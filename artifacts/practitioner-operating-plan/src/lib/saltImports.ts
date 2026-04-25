// Per-source classifiers that turn a pasted CSV/TSV export into the
// channel-level breakdown SALT-01 needs. Each parser:
//   1. Tolerates the column-name variations the upstream system actually
//      ships with (Square, Shopify, Shippo all rename columns between
//      template versions, so we look up by synonym list).
//   2. Uses the bookkeeper's SKU map to assign each line to one of the
//      four channels (4400.10/.20/.30/.40); rows whose SKU isn't mapped
//      fall through to the source's default channel and are surfaced as
//      "unmapped" so the bookkeeper can extend the map next month.
//   3. Returns a deterministic, channel-shaped totals object the close
//      page can either preview or apply directly to the channel inputs.

import { findHeader, parseCsv, parseMoney, parseNumber } from "./csvParse";

export type ChannelKey = "wholesale" | "customLabels" | "dtcBatch" | "markets";

export type ChannelTotals = {
  revenue: number;
  cogs: number;
  freight: number;
  packaging: number;
};

export type ParsedTotals = {
  byChannel: Record<ChannelKey, ChannelTotals>;
  unmapped: { sku: string; rows: number; revenue: number }[];
  rowCount: number;
  warnings: string[];
  // Echo the columns we matched so the bookkeeper can sanity-check the
  // parser picked the right amount field (Square has both Gross and Net,
  // Shopify has both Total and Subtotal — wrong pick silently mis-states
  // the close).
  matchedColumns: { label: string; header: string | null }[];
};

export type SkuMapping = {
  sku: string;
  channel: ChannelKey;
};

export const CHANNEL_KEYS: ChannelKey[] = [
  "wholesale",
  "customLabels",
  "dtcBatch",
  "markets",
];

export function emptyChannelTotals(): ChannelTotals {
  return { revenue: 0, cogs: 0, freight: 0, packaging: 0 };
}

export function emptyByChannel(): Record<ChannelKey, ChannelTotals> {
  return {
    wholesale: emptyChannelTotals(),
    customLabels: emptyChannelTotals(),
    dtcBatch: emptyChannelTotals(),
    markets: emptyChannelTotals(),
  };
}

function buildSkuLookup(mapping: SkuMapping[]): Map<string, ChannelKey> {
  const m = new Map<string, ChannelKey>();
  for (const row of mapping) {
    const k = row.sku.trim().toLowerCase();
    if (!k) continue;
    m.set(k, row.channel);
  }
  return m;
}

function lookupChannel(
  sku: string,
  lookup: Map<string, ChannelKey>,
  defaultChannel: ChannelKey,
): { channel: ChannelKey; mapped: boolean } {
  const k = sku.trim().toLowerCase();
  if (!k) return { channel: defaultChannel, mapped: false };
  // Exact SKU match first.
  const exact = lookup.get(k);
  if (exact) return { channel: exact, mapped: true };
  // Then prefix match — bookkeepers often map "SALT-CL-" to custom labels
  // and let every SKU starting with that prefix flow through.
  for (const [prefix, channel] of lookup.entries()) {
    if (prefix.endsWith("*")) {
      const pre = prefix.slice(0, -1);
      if (pre && k.startsWith(pre)) return { channel, mapped: true };
    } else if (prefix.endsWith("-") && k.startsWith(prefix)) {
      return { channel, mapped: true };
    }
  }
  return { channel: defaultChannel, mapped: false };
}

function bumpUnmapped(
  list: Map<string, { rows: number; revenue: number }>,
  sku: string,
  revenue: number,
) {
  const key = sku.trim() || "(blank)";
  const cur = list.get(key) ?? { rows: 0, revenue: 0 };
  cur.rows += 1;
  cur.revenue += revenue;
  list.set(key, cur);
}

function unmappedToList(m: Map<string, { rows: number; revenue: number }>) {
  return Array.from(m.entries())
    .map(([sku, v]) => ({ sku, rows: v.rows, revenue: v.revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

// ─── Square ─────────────────────────────────────────────────────────────
// Items export from Square: revenue per SKU + (optionally) a "Cost of
// Goods Sold" column. The bookkeeper's wholesale invoices flow through
// the same export, so default to wholesale and let the SKU mapping pull
// custom-label and market lines into their own channels.

export function parseSquareExport(
  csv: string,
  mapping: SkuMapping[],
  defaultChannel: ChannelKey = "wholesale",
): ParsedTotals {
  const { headers, rows } = parseCsv(csv);
  const out = emptyByChannel();
  const warnings: string[] = [];
  const unmapped = new Map<string, { rows: number; revenue: number }>();

  if (headers.length === 0) {
    return { byChannel: out, unmapped: [], rowCount: 0, warnings: ["Nothing to parse — paste a CSV or TSV with a header row."], matchedColumns: [] };
  }

  const skuCol = findHeader(headers, ["SKU", "Item SKU", "Variant SKU", "Lineitem sku"]);
  const revenueCol =
    findHeader(headers, [
      "Net Sales",
      "Net Sale",
      "Item Net Sales",
      "Net Amount",
      "Gross Sales",
      "Item Sales",
      "Sales",
      "Amount",
    ]);
  const cogsCol = findHeader(headers, [
    "Cost of Goods Sold",
    "COGS",
    "Item Cost",
    "Total Cost",
    "Cost",
  ]);
  const qtyCol = findHeader(headers, ["Qty", "Quantity", "Items Sold", "Item Quantity"]);
  const itemCostCol = findHeader(headers, ["Item Cost", "Unit Cost", "Cost / Unit"]);

  if (!revenueCol) {
    warnings.push(
      "No revenue column found. Expected one of: Net Sales, Gross Sales, Sales, Amount.",
    );
  }
  if (!skuCol) {
    warnings.push("No SKU column found — every row will fall to the default channel.");
  }
  if (!cogsCol) {
    warnings.push("No COGS column found — channel COGS won't import (post supplier invoices manually).");
  }

  const lookup = buildSkuLookup(mapping);
  let rowCount = 0;

  for (const r of rows) {
    if (!revenueCol) break;
    const rev = parseMoney(r[revenueCol]);
    let cogs = cogsCol ? parseMoney(r[cogsCol]) : 0;
    // Square's "Item Cost" is per unit; multiply by Qty if that's the
    // column we matched.
    if (cogsCol === itemCostCol && qtyCol) {
      cogs = cogs * parseNumber(r[qtyCol]);
    }
    if (rev === 0 && cogs === 0) continue;
    rowCount += 1;
    const sku = skuCol ? r[skuCol] ?? "" : "";
    const { channel, mapped } = lookupChannel(sku, lookup, defaultChannel);
    out[channel].revenue += rev;
    out[channel].cogs += cogs;
    if (!mapped && skuCol) bumpUnmapped(unmapped, sku, rev);
  }

  return {
    byChannel: out,
    unmapped: unmappedToList(unmapped),
    rowCount,
    warnings,
    matchedColumns: [
      { label: "SKU", header: skuCol },
      { label: "Revenue", header: revenueCol },
      { label: "COGS", header: cogsCol },
      { label: "Qty", header: qtyCol },
    ],
  };
}

// ─── Shopify ────────────────────────────────────────────────────────────
// Orders export. Each line item is its own row; the order-level shipping
// charge sits on the first row of each order with subsequent rows blank
// for shipping. We bucket revenue by SKU mapping (default DTC), and add
// shipping to the freight bucket of whatever channel the order's first
// line item resolved to.

export function parseShopifyExport(
  csv: string,
  mapping: SkuMapping[],
  defaultChannel: ChannelKey = "dtcBatch",
): ParsedTotals {
  const { headers, rows } = parseCsv(csv);
  const out = emptyByChannel();
  const warnings: string[] = [];
  const unmapped = new Map<string, { rows: number; revenue: number }>();

  if (headers.length === 0) {
    return { byChannel: out, unmapped: [], rowCount: 0, warnings: ["Nothing to parse — paste a CSV or TSV with a header row."], matchedColumns: [] };
  }

  const skuCol = findHeader(headers, ["Lineitem sku", "Lineitem SKU", "SKU", "Variant SKU"]);
  const priceCol = findHeader(headers, [
    "Lineitem price",
    "Lineitem Price",
    "Item price",
    "Price",
  ]);
  const qtyCol = findHeader(headers, [
    "Lineitem quantity",
    "Lineitem Quantity",
    "Quantity",
    "Qty",
  ]);
  const discountCol = findHeader(headers, [
    "Lineitem discount",
    "Discount Amount",
    "Discount",
  ]);
  const shippingCol = findHeader(headers, [
    "Shipping",
    "Shipping Amount",
    "Shipping Total",
  ]);
  const orderCol = findHeader(headers, ["Name", "Order", "Order Number", "Order ID"]);
  const refundCol = findHeader(headers, ["Refunded Amount", "Lineitem refunded amount"]);
  const cogsCol = findHeader(headers, ["Lineitem cost", "Cost of Goods Sold", "COGS"]);

  if (!priceCol) warnings.push("No line-item price column found. Expected: Lineitem price, Price.");
  if (!skuCol) warnings.push("No SKU column found — every line falls to the default channel.");

  const lookup = buildSkuLookup(mapping);
  let rowCount = 0;
  // Track the channel of the first line of each order so we can attribute
  // the order-level shipping charge to it. orderShippingApplied flags the
  // order ids whose shipping has already been counted, so a second non-zero
  // shipping cell (rare but happens with split-fulfilment exports) doesn't
  // get added twice.
  const orderChannel = new Map<string, ChannelKey>();
  const orderShippingApplied = new Set<string>();

  for (const r of rows) {
    if (!priceCol) break;
    const price = parseMoney(r[priceCol]);
    const qty = qtyCol ? parseNumber(r[qtyCol]) : 1;
    const lineRev = price * (qty || 1);
    const discount = discountCol ? parseMoney(r[discountCol]) : 0;
    const refund = refundCol ? parseMoney(r[refundCol]) : 0;
    const net = lineRev - Math.abs(discount) - Math.abs(refund);

    const sku = skuCol ? r[skuCol] ?? "" : "";
    const { channel, mapped } = lookupChannel(sku, lookup, defaultChannel);

    if (net !== 0 || (cogsCol && r[cogsCol])) {
      rowCount += 1;
      out[channel].revenue += net;
      if (cogsCol) {
        const lineCogs = parseMoney(r[cogsCol]) * (qty || 1);
        out[channel].cogs += lineCogs;
      }
      if (!mapped && skuCol && net !== 0) bumpUnmapped(unmapped, sku, net);
    }

    // Shipping: Shopify usually puts the order-level shipping on the
    // first line of the order, but exports vary — sometimes a refunded
    // first line carries 0 and the next line has the real number. We
    // dedupe per (order, line-with-shipping), counting the first NON-ZERO
    // shipping value we see for an order, then ignoring later ones.
    if (shippingCol && orderCol) {
      const ship = parseMoney(r[shippingCol]);
      const orderId = r[orderCol] ?? "";
      if (orderId) {
        // Always remember the routing channel from the first line so a
        // later shipping line on the same order routes correctly.
        if (!orderChannel.has(orderId)) orderChannel.set(orderId, channel);
        if (ship !== 0 && !orderShippingApplied.has(orderId)) {
          const route = orderChannel.get(orderId) ?? channel;
          out[route].freight += ship;
          orderShippingApplied.add(orderId);
        }
      }
    } else if (shippingCol && !orderCol) {
      // No order column to dedupe — sum every shipping cell into default.
      const ship = parseMoney(r[shippingCol]);
      if (ship !== 0) out[defaultChannel].freight += ship;
    }
  }

  if (!cogsCol) {
    warnings.push("No line-item cost column — Shopify COGS not imported (post from supplier invoices).");
  }
  if (!shippingCol) {
    warnings.push("No shipping column — book Canada Post / Shippo charges from the freight import instead.");
  }

  return {
    byChannel: out,
    unmapped: unmappedToList(unmapped),
    rowCount,
    warnings,
    matchedColumns: [
      { label: "Order", header: orderCol },
      { label: "SKU", header: skuCol },
      { label: "Price", header: priceCol },
      { label: "Qty", header: qtyCol },
      { label: "Shipping", header: shippingCol },
      { label: "Discount", header: discountCol },
      { label: "Refund", header: refundCol },
      { label: "COGS", header: cogsCol },
    ],
  };
}

// ─── Shippo / Manitoulin freight ────────────────────────────────────────
// Shipping-label exports don't carry SKUs. We classify by an explicit
// "Channel" column if the bookkeeper added one, then by a "Reference"
// column lookup against the SKU map (treat the reference as a SKU), and
// finally fall through to the default channel. Cost goes to freight (5200).

export function parseShippoExport(
  csv: string,
  mapping: SkuMapping[],
  defaultChannel: ChannelKey = "dtcBatch",
): ParsedTotals {
  const { headers, rows } = parseCsv(csv);
  const out = emptyByChannel();
  const warnings: string[] = [];
  const unmapped = new Map<string, { rows: number; revenue: number }>();

  if (headers.length === 0) {
    return { byChannel: out, unmapped: [], rowCount: 0, warnings: ["Nothing to parse — paste a CSV or TSV with a header row."], matchedColumns: [] };
  }

  const costCol = findHeader(headers, [
    "Cost",
    "Total Cost",
    "Rate",
    "Amount",
    "Charge",
    "Total Charge",
  ]);
  const channelCol = findHeader(headers, ["Channel", "SALT Channel", "Cost Centre"]);
  const referenceCol = findHeader(headers, [
    "Reference 1",
    "Reference",
    "Order Reference",
    "Order Number",
    "Metadata 1",
  ]);
  const insuranceCol = findHeader(headers, ["Insurance Cost", "Insurance"]);
  const packagingCol = findHeader(headers, [
    "Packaging Cost",
    "Packaging",
    "Dunnage",
  ]);

  if (!costCol) warnings.push("No cost column found. Expected: Cost, Rate, Amount, Charge.");

  const lookup = buildSkuLookup(mapping);
  let rowCount = 0;

  const channelTextLookup: Record<string, ChannelKey> = {
    wholesale: "wholesale",
    "wholesale (4400.10)": "wholesale",
    "4400.10": "wholesale",
    w: "wholesale",
    "custom labels": "customLabels",
    "custom label": "customLabels",
    "4400.20": "customLabels",
    cl: "customLabels",
    "dtc batch": "dtcBatch",
    dtc: "dtcBatch",
    "4400.30": "dtcBatch",
    markets: "markets",
    market: "markets",
    "4400.40": "markets",
    mk: "markets",
    pr: "markets",
  };

  for (const r of rows) {
    if (!costCol) break;
    const cost = parseMoney(r[costCol]);
    const insurance = insuranceCol ? parseMoney(r[insuranceCol]) : 0;
    const packaging = packagingCol ? parseMoney(r[packagingCol]) : 0;
    if (cost === 0 && insurance === 0 && packaging === 0) continue;
    rowCount += 1;

    let channel: ChannelKey | null = null;

    if (channelCol) {
      const v = (r[channelCol] ?? "").trim().toLowerCase();
      if (v && channelTextLookup[v]) channel = channelTextLookup[v];
    }

    let mapped = channel !== null;
    if (channel === null && referenceCol) {
      const ref = r[referenceCol] ?? "";
      const looked = lookupChannel(ref, lookup, defaultChannel);
      channel = looked.channel;
      mapped = looked.mapped;
      if (!mapped && ref.trim()) bumpUnmapped(unmapped, ref, cost);
    }
    if (channel === null) channel = defaultChannel;

    out[channel].freight += cost + insurance;
    out[channel].packaging += packaging;
  }

  if (!channelCol && !referenceCol) {
    warnings.push(
      "No Channel or Reference column found — every shipment will go to the default channel. Add a 'Channel' column to your Shippo export to split.",
    );
  }

  return {
    byChannel: out,
    unmapped: unmappedToList(unmapped),
    rowCount,
    warnings,
    matchedColumns: [
      { label: "Cost", header: costCol },
      { label: "Channel", header: channelCol },
      { label: "Reference", header: referenceCol },
      { label: "Insurance", header: insuranceCol },
      { label: "Packaging", header: packagingCol },
    ],
  };
}

// ─── Timesheet ──────────────────────────────────────────────────────────
// Two acceptable shapes:
//   1. A header row with an "Hours" column — we sum every numeric value
//      in that column. Optionally filter to rows where a "Cost Code" /
//      "Project" column matches "SALT" / "SALT-01".
//   2. A bare list of numbers (one per line, or comma/tab separated) —
//      we sum them all. Useful when the depot timesheet exports as a
//      single column of decimals.

export type TimesheetParse = {
  hours: number;
  rowCount: number;
  warnings: string[];
  matchedColumns: { label: string; header: string | null }[];
};

export function parseTimesheet(csv: string): TimesheetParse {
  const text = csv.replace(/^\uFEFF/, "").trim();
  if (!text) {
    return { hours: 0, rowCount: 0, warnings: ["Nothing to parse."], matchedColumns: [] };
  }

  const { headers, rows } = parseCsv(text);

  // Mode 1: structured CSV with an Hours column.
  if (headers.length > 0 && rows.length > 0) {
    const hoursCol = findHeader(headers, [
      "Hours",
      "Hrs",
      "Time",
      "Duration",
      "Hours Worked",
    ]);
    const codeCol = findHeader(headers, [
      "Cost Code",
      "Project",
      "Cost Centre",
      "Job Code",
      "Tag",
    ]);
    if (hoursCol) {
      let total = 0;
      let counted = 0;
      let filtered = 0;
      for (const r of rows) {
        const hrs = parseNumber(r[hoursCol]);
        if (!hrs) continue;
        if (codeCol) {
          const code = (r[codeCol] ?? "").toLowerCase();
          if (!code.includes("salt")) {
            filtered += 1;
            continue;
          }
        }
        total += hrs;
        counted += 1;
      }
      const warnings: string[] = [];
      if (codeCol && filtered > 0) {
        warnings.push(
          `${filtered} non-SALT row${filtered === 1 ? "" : "s"} filtered out via "${codeCol}".`,
        );
      } else if (!codeCol) {
        warnings.push(
          "No cost-code column — summed every Hours row. Add a 'Cost Code' column with SALT / SALT-01 values to filter automatically.",
        );
      }
      return {
        hours: total,
        rowCount: counted,
        warnings,
        matchedColumns: [
          { label: "Hours", header: hoursCol },
          { label: "Cost Code", header: codeCol },
        ],
      };
    }
  }

  // Mode 2: bare numbers, one or several per line.
  const tokens = text.split(/[\s,;]+/).filter(Boolean);
  let total = 0;
  let counted = 0;
  for (const t of tokens) {
    const n = parseNumber(t);
    if (Number.isFinite(n) && n > 0) {
      total += n;
      counted += 1;
    }
  }
  if (counted === 0) {
    return {
      hours: 0,
      rowCount: 0,
      warnings: [
        "Couldn't find an Hours column or a list of numbers. Paste either a CSV with an 'Hours' header, or one number per line.",
      ],
      matchedColumns: [],
    };
  }
  return {
    hours: total,
    rowCount: counted,
    warnings: [
      "Summed bare numeric tokens. For automatic SALT-only filtering, paste a CSV with 'Hours' and 'Cost Code' columns.",
    ],
    matchedColumns: [],
  };
}

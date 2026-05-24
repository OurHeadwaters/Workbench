import { Link } from "wouter";
import {
  ArrowLeft,
  Key,
  ShieldCheck,
  Coins,
  GitMerge,
  AlertTriangle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ACCENT = "#1E3A5F";
const ACCENT_SOFT = "#E0E8F4";
const ACCENT_INK = "#0F2340";

export function CryptoCornerPage() {
  return (
    <div className="space-y-6" data-testid="page-crypto-corner">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
        >
          <Key className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Stomping Path · Named waypoint
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Crypto Corner
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Where sound money instinct meets practical key custody discipline
            and community-scale stablecoin architecture.
          </p>
          <p className="mt-2 text-xs text-muted-foreground max-w-3xl">
            This is not a crypto pitch. It is a sovereignty discipline — the
            same Zone 0 logic as the pantry and the canning season, applied to
            digital asset custody.
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
          >
            Junction: Stage 2 sound money instinct → Stage 3 community
            ownership architecture
          </div>
        </div>
      </header>

      <Accordion type="multiple" defaultValue={["where-it-sits"]} className="space-y-3">

        {/* 1. Where this waypoint sits */}
        <AccordionItem
          value="where-it-sits"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-where-it-sits"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <GitMerge className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Where this waypoint sits on the trail</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bitcoin sits at the junction between Stage 2 (Ron Paul sound
                money instincts) and Stage 3 (Headwaters ownership
                architecture). Ron Paul disciples arrive carrying hard money
                instincts — gold first, then Bitcoin. That instinct is correct.
                The extraction is real. The prescription needs a next rung.
              </p>
              <div
                className="rounded-md border-l-4 px-4 py-3 text-base leading-relaxed"
                style={{
                  borderLeftColor: ACCENT,
                  backgroundColor: ACCENT_SOFT,
                  color: ACCENT_INK,
                  fontFamily: "var(--app-font-serif)",
                }}
              >
                You did the hard thing. You got out of the extraction machine at
                the household level. The next question is: where does the
                surplus actually go, and who owns the community it flows
                through?
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crypto Corner names the junction where that sound money instinct
                stops being a personal hedge and starts being infrastructure.
                The traveller who arrives here already understands why fiat
                extraction works. What they need is the practical discipline —
                how to hold keys, why custody is non-negotiable, and how sound
                money instinct connects to the broader community economy rather
                than stopping at the individual wallet.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Zone 0 key custody discipline */}
        <AccordionItem
          value="zone-0-custody"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-zone-0-custody"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <Key className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Zone 0 — key custody discipline</span>
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
              >
                Not your keys, not your coins
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cryptographic key custody is a Zone 0 practice. Same category
                as the pantry and the canning season. The household either
                maintains it or does not. There is no passive option that is not
                a leak.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zone 0 is the ground you are standing on — the immediate
                household stability that must be secured before anything can be
                built outward. A household that holds Bitcoin on an exchange has
                not closed the loop. The exchange holds the keys. The
                sovereignty claim is incomplete. This is the same structural
                failure as keeping savings in an institution that can freeze the
                account — the asset is present on paper; the control is not.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "Self-custody",
                    body: "Hardware wallet, seed phrase secured off-device, no exchange holds the private key. The household owns the asset without a custodian between them and it.",
                    status: "sovereignty",
                  },
                  {
                    label: "Exchange custody",
                    body: "The exchange holds the keys. The household holds a claim on the exchange. That claim can be frozen, hacked, or dissolved. This is not sovereignty — it is a different creditor.",
                    status: "leak",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border p-4"
                    style={{
                      borderColor:
                        item.status === "sovereignty"
                          ? ACCENT
                          : "hsl(var(--card-border))",
                      background:
                        item.status === "sovereignty"
                          ? ACCENT_SOFT
                          : "hsl(var(--muted)/0.4)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: ACCENT_INK }}
                      >
                        {item.label}
                      </p>
                      <span
                        className="text-[10px] font-mono uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
                        style={
                          item.status === "sovereignty"
                            ? { background: ACCENT, color: "#fff" }
                            : {
                                background: "hsl(var(--muted))",
                                color: "hsl(var(--muted-foreground))",
                              }
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground border-t pt-3 border-card-border">
                The Zone 0 test: if someone else can freeze it, you don't own
                it. Patch the roof before you plant the orchard.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Speculative vs sovereignty framing */}
        <AccordionItem
          value="framing"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-framing"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Speculative vs sovereignty framing</span>
              <span className="text-xs text-muted-foreground">Two ways to hold the same asset</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most people arrive at Bitcoin through the speculative door —
                price goes up, number goes up, the moonshot narrative. The
                Headwaters framing is different. It is not a rejection of price
                appreciation; it is a reorientation of purpose.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th
                        className="text-left py-2 pr-4 font-mono uppercase tracking-[0.14em] text-muted-foreground border-b"
                        style={{ borderColor: "hsl(var(--card-border))" }}
                      >
                        Speculative framing
                      </th>
                      <th
                        className="text-left py-2 font-mono uppercase tracking-[0.14em] border-b"
                        style={{
                          borderColor: "hsl(var(--card-border))",
                          color: ACCENT,
                        }}
                      >
                        Sovereignty framing
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Hold for price appreciation", "Hold as a censorship-resistant store"],
                      ["Exit into fiat at a target price", "Maintain as long-duration sovereignty reserve"],
                      ["Measure success in dollar terms", "Measure success in custody discipline"],
                      ["Exchange custody is fine — convenient", "Self-custody is non-negotiable — it is the point"],
                      ["Individual moonshot narrative", "Community infrastructure layer"],
                      ["Fear of missing the run", "Fear of handing nothing forward"],
                    ].map(([spec, sov], i) => (
                      <tr
                        key={i}
                        className="border-b last:border-0"
                        style={{ borderColor: "hsl(var(--card-border))" }}
                      >
                        <td className="py-2.5 pr-4 text-muted-foreground leading-relaxed align-top">
                          {spec}
                        </td>
                        <td
                          className="py-2.5 leading-relaxed align-top font-medium"
                          style={{ color: ACCENT_INK }}
                        >
                          {sov}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The sovereignty framing does not need the price to do anything.
                The asset is held because it is one of the few things a
                community can hold that no institution can inflate away, freeze,
                or confiscate without the holder's private key. That is the
                Headwaters case for it — not the chart.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. RLUSD as the Reservoir layer */}
        <AccordionItem
          value="rlusd-reservoir"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-rlusd-reservoir"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <Coins className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">RLUSD — the Reservoir layer</span>
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
              >
                Community-scale stablecoin architecture
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bitcoin is the long-duration sovereignty reserve. It is not
                suited to daily community commerce — the volatility is the
                point for long-duration holding; it is an obstacle for
                day-to-day exchange. RLUSD (Ripple's USD-pegged stablecoin on
                the XRP Ledger) enters as the Reservoir layer: the interface
                between the household's hard money discipline and the
                community's shared economic infrastructure.
              </p>
              <div
                className="rounded-md border-l-4 px-4 py-3 space-y-2"
                style={{
                  borderLeftColor: ACCENT,
                  backgroundColor: ACCENT_SOFT,
                  color: ACCENT_INK,
                }}
              >
                <p className="text-sm font-semibold" style={{ fontFamily: "var(--app-font-serif)" }}>
                  The Reservoir holds what the community moves.
                </p>
                <p className="text-sm leading-relaxed">
                  A Reservoir is stable by design — it buffers the flow
                  between the hard-money reserve and the operating economy.
                  RLUSD is pegged 1:1 to the US dollar, settles on a
                  near-instant public ledger, and is redeemable. For a northern
                  community, this means: money that can move inside the
                  community without the extraction of a bank, without the
                  volatility of a speculative asset, and without leaving the
                  watershed to a payment processor.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Why a stablecoin, not Bitcoin, for daily exchange",
                    body: "Bitcoin's value fluctuates. A canning jar of salts priced in Bitcoin today is priced differently tomorrow. The community needs a unit of account that the local economy can plan around. RLUSD is that unit — stable, programmable, and community-controllable.",
                  },
                  {
                    label: "Why RLUSD on the XRP Ledger, not a bank account",
                    body: "A bank account routes every transaction through an institution with the legal authority to freeze it, report it, or block it. The XRP Ledger settles peer-to-peer. The community's Reservoir is not a bank's ledger — it is the community's own.",
                  },
                  {
                    label: "How this connects to the Headwaters operating model",
                    body: "The three streams — Salts, Community Contracts, Brightside — flow into reinvestment buckets. A Reservoir layer means surplus can stay inside a community-held medium rather than immediately converting to a bank balance that leaves the watershed the moment it lands. The architecture is still in design; the principle is already load-bearing.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border p-4"
                    style={{
                      borderColor: "hsl(var(--card-border))",
                      background: "hsl(var(--card))",
                    }}
                  >
                    <p
                      className="text-sm font-semibold mb-1.5"
                      style={{ color: ACCENT_INK }}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground border-t pt-3 border-card-border">
                The Reservoir layer is not a finished product — it is a named
                architecture direction. The discipline is to hold the framing
                steady while the implementation catches up.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. The custody checklist */}
        <AccordionItem
          value="custody-checklist"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-custody-checklist"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Custody discipline — the floor</span>
              <span className="text-xs text-muted-foreground">Before anything else</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is the minimum before any community architecture layer can
                be discussed. A practitioner who holds Bitcoin on an exchange
                has not completed Zone 0. The checklist below is the floor, not
                the ceiling.
              </p>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-3 leading-relaxed">
                <li>
                  <strong className="text-foreground">Hardware wallet in hand.</strong>{" "}
                  A dedicated physical device that signs transactions without
                  exposing the private key to a networked computer. Not a hot
                  wallet on a phone. Not a browser extension. A cold device.
                </li>
                <li>
                  <strong className="text-foreground">Seed phrase secured off-device and off-cloud.</strong>{" "}
                  Written on paper or stamped on metal. Stored somewhere the
                  household controls — not photographed, not in a cloud drive,
                  not in a password manager that lives on a server someone else
                  runs.
                </li>
                <li>
                  <strong className="text-foreground">Know the passphrase / PIN, not just the seed.</strong>{" "}
                  A hardware wallet with a passphrase adds a 25th word. If the
                  household cannot reconstruct its wallet from the seed phrase
                  alone, the custody is incomplete.
                </li>
                <li>
                  <strong className="text-foreground">At least one other person knows the recovery path.</strong>{" "}
                  Seven-generation stewardship means the next generation can
                  inherit what was held. A single point of custody knowledge is
                  a single point of failure. The discipline is not a secret —
                  it is a system the household can hand forward.
                </li>
                <li>
                  <strong className="text-foreground">Zero balance on exchanges for long-duration holdings.</strong>{" "}
                  Exchanges are for buying and selling. They are not storage.
                  The moment the purchase is made, it moves to cold storage.
                  The exchange balance resets to zero.
                </li>
              </ol>
              <p className="text-xs text-muted-foreground border-t pt-3 border-card-border">
                This is not sophisticated. It is the same logic as a root
                cellar: you built the thing, you maintain the thing, you hand
                the keys to the next person in the household when the time
                comes. The technology is different. The discipline is the same.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Footer — trail context */}
      <div
        className="rounded-xl border p-5 space-y-3"
        style={{
          borderColor: ACCENT + "40",
          background: ACCENT_SOFT,
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
        >
          Where to from here
        </p>
        <p className="text-sm leading-relaxed" style={{ color: ACCENT_INK }}>
          Crypto Corner is a waypoint, not a destination. The traveller who
          completes it has Zone 0 custody discipline in place and a clear
          picture of where the stablecoin Reservoir layer fits in the broader
          community economy. The next conversation is the{" "}
          <Link
            href="/compare"
            className="font-semibold underline decoration-dotted underline-offset-2 hover:no-underline"
            style={{ color: ACCENT_INK }}
          >
            Operating Framework
          </Link>{" "}
          — how the three streams flow, where the surplus goes, and how the
          reinvestment buckets connect to the community the household is
          building toward.
        </p>
        <p
          className="text-xs pt-1"
          style={{ color: ACCENT_INK, opacity: 0.7 }}
        >
          Source: Stomping Path · Crypto Corner section · anchored May 2026
        </p>
      </div>
    </div>
  );
}

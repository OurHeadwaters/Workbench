import {
  db,
  bookkeeperCostCentresTable,
  bookkeeperAccountsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

interface CostCentreSeed {
  code: string;
  name: string;
  parentEntity: string;
  owner?: string;
  description?: string;
  color?: string;
}

interface AccountSeed {
  code: string;
  name: string;
  type: string;
  normalSide: "debit" | "credit";
  costCentreCode?: string;
  mirrorAccountCode?: string;
  notes?: string;
}

const COST_CENTRES: CostCentreSeed[] = [
  {
    code: "HEADWATERS",
    name: "Headwaters Food Systems Agency",
    parentEntity: "Headwaters",
    description: "Root cost-centre — operating entity for the agency.",
    color: "#1f4d3a",
  },
  {
    code: "AGENCY-MIRRORS",
    name: "Agency operating mirrors",
    parentEntity: "Headwaters",
    description:
      "Mirror cost-centre that receives allocations from project lines (e.g. SALT-01 5400 / 5500 → 6010 / 6020).",
    color: "#6b7a55",
  },
  {
    code: "SALT-01",
    name: "Northern Band — co-op store pilot",
    parentEntity: "Northern Band",
    description:
      "First operating cost-centre under the agency. Stub — will fill in as the pilot moves forward.",
    color: "#7a4d2e",
  },
];

const ACCOUNTS: AccountSeed[] = [
  // SALT-01 revenue
  {
    code: "4400.10",
    name: "SALT-01 · Wholesale revenue",
    type: "revenue",
    normalSide: "credit",
    costCentreCode: "SALT-01",
  },
  {
    code: "4400.20",
    name: "SALT-01 · Custom labels revenue",
    type: "revenue",
    normalSide: "credit",
    costCentreCode: "SALT-01",
  },
  {
    code: "4400.30",
    name: "SALT-01 · DTC batch revenue",
    type: "revenue",
    normalSide: "credit",
    costCentreCode: "SALT-01",
  },
  {
    code: "4400.40",
    name: "SALT-01 · Markets revenue (PR / cost-recovery)",
    type: "revenue",
    normalSide: "credit",
    costCentreCode: "SALT-01",
  },
  // SALT-01 COGS / direct costs
  {
    code: "5100",
    name: "SALT-01 · COGS",
    type: "cost_of_sales",
    normalSide: "debit",
    costCentreCode: "SALT-01",
  },
  {
    code: "5200",
    name: "SALT-01 · Freight & shipping",
    type: "cost_of_sales",
    normalSide: "debit",
    costCentreCode: "SALT-01",
  },
  {
    code: "5300",
    name: "SALT-01 · Packaging & labels",
    type: "cost_of_sales",
    normalSide: "debit",
    costCentreCode: "SALT-01",
  },
  // SALT-01 allocated → mirror to agency
  {
    code: "5400",
    name: "SALT-01 · Allocated labour",
    type: "expense",
    normalSide: "debit",
    costCentreCode: "SALT-01",
    mirrorAccountCode: "6020",
    notes:
      "Mirror to Headwaters 6020 (Wages) when posted — allocated labour from agency staff time.",
  },
  {
    code: "5500",
    name: "SALT-01 · Depot rent allocation",
    type: "expense",
    normalSide: "debit",
    costCentreCode: "SALT-01",
    mirrorAccountCode: "6010",
    notes:
      "Mirror to Headwaters 6010 (Facilities) when posted — share of depot rent.",
  },
  // Agency mirrors
  {
    code: "6010",
    name: "Headwaters · Facilities",
    type: "expense",
    normalSide: "debit",
    costCentreCode: "AGENCY-MIRRORS",
  },
  {
    code: "6020",
    name: "Headwaters · Wages (Operations)",
    type: "expense",
    normalSide: "debit",
    costCentreCode: "AGENCY-MIRRORS",
  },
  // Cash
  {
    code: "1010",
    name: "Operating chequing",
    type: "asset",
    normalSide: "debit",
    costCentreCode: "HEADWATERS",
  },
];

export async function seedBookkeeper(): Promise<void> {
  let ccInserted = 0;
  for (const cc of COST_CENTRES) {
    const existing = await db
      .select({ id: bookkeeperCostCentresTable.id })
      .from(bookkeeperCostCentresTable)
      .where(eq(bookkeeperCostCentresTable.code, cc.code))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(bookkeeperCostCentresTable).values({
        code: cc.code,
        name: cc.name,
        parentEntity: cc.parentEntity,
        owner: cc.owner ?? null,
        description: cc.description ?? null,
        color: cc.color ?? null,
      });
      ccInserted += 1;
    }
  }

  let acctInserted = 0;
  for (const acct of ACCOUNTS) {
    const existing = await db
      .select({ id: bookkeeperAccountsTable.id })
      .from(bookkeeperAccountsTable)
      .where(eq(bookkeeperAccountsTable.code, acct.code))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(bookkeeperAccountsTable).values({
        code: acct.code,
        name: acct.name,
        type: acct.type,
        normalSide: acct.normalSide,
        costCentreCode: acct.costCentreCode ?? null,
        mirrorAccountCode: acct.mirrorAccountCode ?? null,
        notes: acct.notes ?? null,
      });
      acctInserted += 1;
    }
  }

  logger.info(
    {
      costCentresInserted: ccInserted,
      accountsInserted: acctInserted,
      costCentresTotal: COST_CENTRES.length,
      accountsTotal: ACCOUNTS.length,
    },
    "bookkeeper seed complete",
  );
}

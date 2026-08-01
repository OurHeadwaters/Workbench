// ── Year-End Notes to Accountant ─────────────────────────────────────────────
// Owner-authored instructions the accountant receives at year-end filing.
// Append-only log: add new entries by extending YE_NOTES below.
// No backend required — owner edits this file directly.

export type YENoteStatus = "needs-review" | "actioned" | "monitoring";

export interface YENote {
  id: string;
  title: string;
  entity: string;
  taxContext: string;
  body: string[];
  referenceUrl: string;
  referenceLabel: string;
  status: YENoteStatus;
}

export const YE_NOTES: YENote[] = [
  {
    id: "oitc-2026",
    title: "Ontario Innovation Tax Credit (OITC)",
    entity: "Headwaters Ontario Corp",
    taxContext: "Corporate T2 — year-end action required",
    body: [
      "The Ontario Innovation Tax Credit (OITC) is a refundable Ontario corporate tax credit equal to up to 10% of qualifying Scientific Research and Experimental Development (SR&ED) expenditures incurred in Ontario. Because it is refundable, Headwaters Ontario Corp can receive it as a cash refund even if the corporation owes no provincial tax.",
      "Headwaters Ontario Corp is engaged in software development and food-systems platform work. These activities may qualify as SR&ED under the Canada Revenue Agency's definitions — specifically, work that constitutes systematic investigation or search carried out in a field of science or technology by means of experiment or analysis, aimed at advancing knowledge or achieving a technological advancement.",
      "Please assess whether Headwaters' development activities (platform architecture, algorithmic work, experimental tooling for community food economies) qualify under both the federal SR&ED program and the Ontario OITC definitions. If eligible, claim the OITC on the T2 return for the applicable tax year. Document the qualifying activities and expenditures in a form suitable for CRA review.",
      "Note: The federal SR&ED investment tax credit (ITC) may also be available in addition to the Ontario OITC. Please assess both credits together at year-end.",
    ],
    referenceUrl:
      "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/provincial-territorial-corporation-tax/ontario-provincial-corporation-tax/ontario-innovation-tax-credit.html",
    referenceLabel: "Canada.ca — Ontario Innovation Tax Credit",
    status: "needs-review",
  },
];

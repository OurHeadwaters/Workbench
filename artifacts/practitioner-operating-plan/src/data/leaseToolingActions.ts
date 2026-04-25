export type LeaseToolingAction = {
  num: string;
  when: string;
  title: string;
  detail: string;
  cost: string;
  oneTimeMin: number;
  oneTimeMax: number;
  monthlyMin?: number;
  monthlyMax?: number;
  link?: string;
  linkLabel?: string;
};

export const leaseToolingActions: LeaseToolingAction[] = [
  {
    num: "01",
    when: "Today",
    title: "Pull two or three fair-market-rent comparables",
    detail:
      "Quick screenshots from MLS commercial, Kijiji commercial, or a one-line email from a Dryden or Sioux Lookout commercial realtor for similar warehouse/office space. Add a one-page memo noting that $2,200/mo predates the Headwaters arrangement and has been the negotiated rate for years.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
  {
    num: "02",
    when: "Today",
    title: "Confirm three things with Dad",
    detail:
      "Property ownership entity (his name vs. a corporation), his HST registration status, and how utilities have historically been billed and metered. Friendly conversation, not a form.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
  {
    num: "03",
    when: "This week",
    title: "Decide the utilities approach",
    detail:
      "Two clean options: (a) Headwaters opens hydro/heat/internet accounts in its own name (cleanest long-term, switch when Dad has cleared out), or (b) Dad keeps the accounts and invoices Headwaters monthly with copies of the bills attached at cost. Pick one and write it down.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
  {
    num: "04",
    when: "This week",
    title: "Agree the move-out and clearance schedule",
    detail:
      "Dad's tools currently fill the interior. Set a clearance target together (not unilaterally) and, if there's a transition period of shared use, agree a prorated rent step (e.g. $1,100/mo while shared, $2,200/mo once cleared). Take photos of the space at clearance. The point is to match the financial picture to operational reality.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
  {
    num: "05",
    when: "This week",
    title: "Pre-agree the 3-door garage rent",
    detail:
      "Target $1,200–1,500/mo + utilities, written into the lease as a Right of First Refusal with 60-day activation notice. Lock the number now while leverage is balanced — once Headwaters is operationally embedded, the negotiation gets harder.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
  {
    num: "06",
    when: "This week",
    title: "Pre-agree the house-next-door rent",
    detail:
      "Same pattern as the garage. Target $1,500–2,200/mo + utilities, Right of First Refusal, 60-day activation. Worth pricing now even if you don't activate it for a year.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
  {
    num: "07",
    when: "Before the first cheque",
    title: "Draft the one-page lease",
    detail:
      "Parties (Dad's legal name or his corp's name as Landlord; Headwaters Inc. as Tenant), premises (civic address + sq ft + what's included), term + renewal, rent ($2,200/mo plus utilities, due the 1st), utilities clause, permitted use (\"commercial — aggregation, distribution, light warehousing, office\"), insurance split, maintenance split, expansion options referencing items 05 and 06, termination terms, annual rent review clause.",
    cost: "Free if DIY",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
  {
    num: "08",
    when: "Before the first cheque",
    title: "Set up Headwaters' tenant insurance",
    detail:
      "Contents and equipment + commercial general liability with Dad named as an additional insured. Roughly $200/mo through any Canadian commercial insurance broker.",
    cost: "~$200 CAD/month",
    oneTimeMin: 0,
    oneTimeMax: 0,
    monthlyMin: 200,
    monthlyMax: 200,
  },
  {
    num: "09",
    when: "Before signing",
    title: "Have a local commercial lawyer review the draft",
    detail:
      "Optional but recommended. An hour with a Dryden or Sioux Lookout commercial lawyer catches things and costs less than fixing them later. Tell them this is a related-party lease — they'll know what to look for.",
    cost: "$400–600 CAD",
    oneTimeMin: 400,
    oneTimeMax: 600,
  },
  {
    num: "10",
    when: "Day one",
    title: "Sign the lease and file the working folder",
    detail:
      "Five items in one folder: signed lease, market-rent memo + comparables, utilities decision document, expansion option summary, clearance schedule with photos. Sign before any rent moves. Folder name: Headwaters > Leases > Dad-warehouse > 2026-base.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
  },
];

export const leaseToolingTotals = leaseToolingActions.reduce(
  (acc, a) => ({
    oneTimeMin: acc.oneTimeMin + a.oneTimeMin,
    oneTimeMax: acc.oneTimeMax + a.oneTimeMax,
    monthlyMin: acc.monthlyMin + (a.monthlyMin ?? 0),
    monthlyMax: acc.monthlyMax + (a.monthlyMax ?? 0),
  }),
  { oneTimeMin: 0, oneTimeMax: 0, monthlyMin: 0, monthlyMax: 0 },
);

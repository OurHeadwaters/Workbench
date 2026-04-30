export type NamingAction = {
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

export const namingActions: NamingAction[] = [
  {
    num: "01",
    when: "Today",
    title: "Buy headwaters.ca and watershed.ca",
    detail:
      "Cloudflare Registrar — at-cost renewals, no upsells. Get both before someone else does.",
    cost: "~$15 CAD each",
    oneTimeMin: 30,
    oneTimeMax: 30,
    link: "https://www.cloudflare.com/products/registrar/",
    linkLabel: "cloudflare.com/products/registrar",
  },
  {
    num: "02",
    when: "Today",
    title: "Defensive registrations",
    detail:
      "If budget allows: watershedhq.ca, headwatersmoney.com, watershed.app, headwaters.app. Cheap insurance against squatters.",
    cost: "~$15–25 CAD each",
    oneTimeMin: 60,
    oneTimeMax: 100,
    link: "https://www.cloudflare.com/products/registrar/",
    linkLabel: "cloudflare.com/products/registrar",
  },
  {
    num: "03",
    when: "This week",
    title: "Run the CIPO direct trademark search",
    detail:
      "Search 'Headwaters' and 'Watershed' in Class 36 (insurance & financial) and Class 9 (electrical, scientific & teaching apparatus and software). Free, ~10 minutes.",
    cost: "Free",
    oneTimeMin: 0,
    oneTimeMax: 0,
    link: "https://ised-isde.canada.ca/cipo/trademark-search/srch?lang=eng",
    linkLabel: "ised-isde.canada.ca/cipo/trademark-search",
  },
  {
    num: "04",
    when: "This week",
    title: "Set up you@headwaters.ca",
    detail:
      "Google Workspace. Real email beats a Gmail address for a real agency — especially when Dad reads the contract.",
    cost: "~$8 CAD/month",
    oneTimeMin: 0,
    oneTimeMax: 0,
    monthlyMin: 8,
    monthlyMax: 8,
    link: "https://workspace.google.com/business/signup/",
    linkLabel: "workspace.google.com/business",
  },
  {
    num: "05",
    when: "Before filing or printing",
    title: "Engage a Canadian trademark agent",
    detail:
      "Paid clearance opinion. Don't file, don't print, until they sign off. Specifically ask about the Watershed Asset Management overlap in Class 36. Use the IPIC directory of registered Canadian trademark agents.",
    cost: "$300–500",
    oneTimeMin: 300,
    oneTimeMax: 500,
    link: "https://ipic.ca/english/find-an-ip-professional",
    linkLabel: "ipic.ca/find-an-ip-professional",
  },
  {
    num: "06",
    when: "Before incorporating",
    title: "NUANS name search for 'Headwaters'",
    detail:
      "Federal or Ontario corporate name availability. Required before you can file articles of incorporation.",
    cost: "~$15",
    oneTimeMin: 15,
    oneTimeMax: 15,
    link: "https://www.nuans.com/",
    linkLabel: "nuans.com",
  },
];

export const namingActionTotals = namingActions.reduce(
  (acc, a) => ({
    oneTimeMin: acc.oneTimeMin + a.oneTimeMin,
    oneTimeMax: acc.oneTimeMax + a.oneTimeMax,
    monthlyMin: acc.monthlyMin + (a.monthlyMin ?? 0),
    monthlyMax: acc.monthlyMax + (a.monthlyMax ?? 0),
  }),
  { oneTimeMin: 0, oneTimeMax: 0, monthlyMin: 0, monthlyMax: 0 },
);

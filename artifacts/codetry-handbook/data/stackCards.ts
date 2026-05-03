export interface StackCardStep {
  id: string;
  prompt: string;
}

export interface StackCard {
  id: string;
  category: string;
  question: string;
  context: string;
  steps: StackCardStep[];
}

export const STACK_CARDS: StackCard[] = [
  {
    id: "stall-cost",
    category: "Stall Math",
    question: "What does a single Dryden Farmers' Market stall actually cost?",
    context:
      "The model assumes $30/stall/week. Confirm the 2026 rate with the market coordinator. Factor in any annual membership or insurance requirements.",
    steps: [
      {
        id: "stall-cost-1",
        prompt: "Call or email the Dryden Farmers' Market coordinator. What is the confirmed 2026 stall fee per market day?",
      },
      {
        id: "stall-cost-2",
        prompt: "Is there an annual membership fee on top of the per-day rate? If so, write it here.",
      },
      {
        id: "stall-cost-3",
        prompt: "Is vendor insurance required? Note any cost or requirement you found.",
      },
      {
        id: "stall-cost-4",
        prompt: "Write the final confirmed per-stall cost you'll use in the model.",
      },
    ],
  },
  {
    id: "jars-throughput",
    category: "Stall Math",
    question: "What is the realistic jars-per-day throughput?",
    context:
      "The planning model carries 3 jars/week (45/season). Talk to vendors who've run the market for 2+ seasons. What does a good Saturday look like vs a slow one?",
    steps: [
      {
        id: "jars-throughput-1",
        prompt: "Identify one or two vendors who have run the Dryden market for 2+ seasons. Who can you talk to?",
      },
      {
        id: "jars-throughput-2",
        prompt: "Ask them: what does a good Saturday look like in units sold? What does a slow one look like?",
      },
      {
        id: "jars-throughput-3",
        prompt: "Based on your conversations, what is your conservative jars-per-market-day estimate?",
      },
      {
        id: "jars-throughput-4",
        prompt: "What is your stretch jars-per-day estimate? What would need to be true for that to happen?",
      },
    ],
  },
  {
    id: "break-even-gross",
    category: "Stall Math",
    question: "What does a single market day need to gross to be worth the time?",
    context:
      "Break-even calculation: stall cost + setup time (est. 2 hrs) + market time (est. 4 hrs) + breakdown (1 hr) at shadow-labour rate ($30/hr). At $12/jar, how many jars cover that? What margin target makes it worth returning?",
    steps: [
      {
        id: "break-even-1",
        prompt: "Calculate your time cost: (setup + market + breakdown hours) × your shadow labour rate. What is that number?",
      },
      {
        id: "break-even-2",
        prompt: "Add your confirmed stall fee to your time cost. What is your total break-even cost per market day?",
      },
      {
        id: "break-even-3",
        prompt: "At your jar price, how many jars do you need to sell to break even? Write the math.",
      },
      {
        id: "break-even-4",
        prompt: "What margin target (above break-even) makes it worth returning the following week? State your number.",
      },
    ],
  },
  {
    id: "setup-checklist",
    category: "Stall Math",
    question: "What setup is required before the first stall?",
    context:
      "Confirmed items needed: price list, jar label with ingredients + allergens, cash or Square for payment. What's missing from that list right now?",
    steps: [
      {
        id: "setup-1",
        prompt: "Is your price list printed and ready? If not, what needs to happen to finalize it?",
      },
      {
        id: "setup-2",
        prompt: "Do your jar labels include ingredients and allergens? Note what's missing or still needed.",
      },
      {
        id: "setup-3",
        prompt: "Is your payment method (cash float or Square) ready to go? What needs to be set up?",
      },
      {
        id: "setup-4",
        prompt: "List any other items you know are missing from the first-stall setup. Be specific.",
      },
    ],
  },
  {
    id: "outreach-coops",
    category: "Organizational Outreach",
    question: "Which co-operatives in the 807 area should we approach first?",
    context:
      "Co-operatives have shared governance, food distribution, and co-op platform needs — a natural fit. The warm channel is the existing 807 Co-op relationship. Hook: 'A working platform that follows your governance — not a template your bylaws have to fit into.'",
    steps: [
      {
        id: "coops-1",
        prompt: "List the co-operatives in the 807 area you already know by name. Start with the warmest relationship.",
      },
      {
        id: "coops-2",
        prompt: "Who is the right contact person at the 807 Co-op? How do you reach them?",
      },
      {
        id: "coops-3",
        prompt: "What is the one specific problem you'd open with in an introductory call? Write the hook in your own words.",
      },
      {
        id: "coops-4",
        prompt: "What is your next concrete action — email, call, warm intro through someone? Set a date.",
      },
    ],
  },
  {
    id: "outreach-band-offices",
    category: "Organizational Outreach",
    question: "Which band offices or tribal councils are our warmest leads?",
    context:
      "Primary buyers for community store plans and food systems work. Warmest channel given Deer Lake pursuit. Same freight corridor, same operating environment. Hook: 'Store-in-a-box for a northern community: procurement dashboard, local hire plan, open financial model — the council can read every number before signing.'",
    steps: [
      {
        id: "band-1",
        prompt: "List the band offices and tribal councils you've had any contact with (IFNA cluster, Shibogama, Windigo, Deer Lake, others).",
      },
      {
        id: "band-2",
        prompt: "Rank them warmest to coldest based on your current relationship. Who is at the top?",
      },
      {
        id: "band-3",
        prompt: "For your warmest lead: what is the next step, and who initiates it?",
      },
      {
        id: "band-4",
        prompt: "What's the one thing you need to have ready (a document, a number, a reference) before that conversation?",
      },
    ],
  },
  {
    id: "outreach-health",
    category: "Organizational Outreach",
    question: "Which regional health authorities should we engage for food-access work?",
    context:
      "Food access as a health mandate. SLFNHA and NOHA are primary. Brightside RT-LTC is a secondary pitch here. Hook: 'What does a remote community need to have reliable access to food? That's the question this work answers.'",
    steps: [
      {
        id: "health-1",
        prompt: "Do you have an existing contact at SLFNHA or NOHA? Name them and how you'd reach them.",
      },
      {
        id: "health-2",
        prompt: "What specific program or mandate within their org connects to food access? Research one concrete connection.",
      },
      {
        id: "health-3",
        prompt: "How does Brightside RT-LTC factor in — as a follow-on or a lead? Note your thinking.",
      },
      {
        id: "health-4",
        prompt: "Draft one sentence that opens the conversation with a health authority. Keep it on their terms, not yours.",
      },
    ],
  },
  {
    id: "outreach-credit-unions",
    category: "Organizational Outreach",
    question: "Which credit unions in the Dryden area are a good fit?",
    context:
      "Credit unions have a small-business support mandate, board governance software needs, and member platforms. Potential for custom internal tool engagements. Hook: 'A custom tool built around how your operation actually works — not off-the-shelf software with a monthly fee.'",
    steps: [
      {
        id: "cu-1",
        prompt: "List the credit unions in the Dryden area you know of. Which has the strongest small-business mandate?",
      },
      {
        id: "cu-2",
        prompt: "Who on their board or staff would be the right first conversation? How would you get to them?",
      },
      {
        id: "cu-3",
        prompt: "What is the specific operational problem a credit union might want solved — governance, member tools, reporting? Pick one.",
      },
      {
        id: "cu-4",
        prompt: "What is your next action and your target date for making first contact?",
      },
    ],
  },
];

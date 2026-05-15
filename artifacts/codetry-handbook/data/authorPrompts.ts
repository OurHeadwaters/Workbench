export type Prompt = {
  id: string;
  question: string;
  hint?: string;
};

export type ZoneAuthorEntry = {
  id: string;
  name: string;
  subtitle: string;
  prompts: Prompt[];
};

export const ZONE_AUTHOR_ENTRIES: ZoneAuthorEntry[] = [
  {
    id: "z0",
    name: "Saltbox",
    subtitle: "Zone 0 \u00b7 the household \u00b7 where everything flows from",
    prompts: [
      {
        id: "z0-01",
        question: "What is Saltbox, in your own words \u2014 not the description, the real thing?",
        hint: "Skip the tech. What does it do for your family on an ordinary Tuesday?",
      },
      {
        id: "z0-02",
        question: "How did the jar kitchen start?",
        hint: "Was there a surplus? A specific season? A moment when you decided this was how you\u2019d live?",
      },
      {
        id: "z0-03",
        question: "What does the seasonal shelf teach your kids that school can\u2019t?",
        hint: "This can be one thing. It doesn\u2019t have to be a list.",
      },
      {
        id: "z0-04",
        question: "What was breaking down before Saltbox existed \u2014 what were you trying to do that had no right tool?",
        hint: "The problem that made this necessary.",
      },
      {
        id: "z0-05",
        question: "What does Zone 0 feel like when it\u2019s running well?",
        hint: "A season, a morning, a smell. Something specific.",
      },
      {
        id: "z0-06",
        question: "What would someone misunderstand about this zone if they only read the description?",
        hint: "What does the data not capture?",
      },
    ],
  },
  {
    id: "z1",
    name: "Headwaters",
    subtitle: "Eave \u00b7 envelope budgeting \u00b7 the household source",
    prompts: [
      {
        id: "z1-01",
        question: "Why couldn\u2019t you just use YNAB, Mint, or any other budget app?",
        hint: "What did they all get wrong \u2014 not technically, but in what they assumed about how you live?",
      },
      {
        id: "z1-02",
        question: "What does \u201cthe household balance is the source of the watershed\u201d mean on a real Tuesday?",
        hint: "Put it in your own words. Not the chapter. The actual feeling when the system is working.",
      },
      {
        id: "z1-03",
        question: "When did you know the water metaphor was doing real work and not just decoration?",
        hint: "Was there a moment \u2014 a conversation, a pay day, a decision \u2014 where you felt the metaphor holding weight?",
      },
      {
        id: "z1-04",
        question: "What\u2019s the difference between a Bucket and a category?",
        hint: "Not the definition. The difference in how you behave when you think in each one.",
      },
      {
        id: "z1-05",
        question: "What does XRPL give this that a regular bank account doesn\u2019t?",
        hint: "In plain language \u2014 no crypto jargon.",
      },
      {
        id: "z1-06",
        question: "What would be lost if you called it \u201cBudget App\u201d instead of Headwaters?",
        hint: "Say this like you\u2019re explaining it to someone who asked why the name matters.",
      },
    ],
  },
  {
    id: "z2",
    name: "Workbench",
    subtitle: "Zone 2 \u00b7 the workbench \u00b7 you are here",
    prompts: [
      {
        id: "z2-01",
        question: "What\u2019s the difference between running a practice and running a startup?",
        hint: "This is the zone where you work. What makes it a practice and not a business?",
      },
      {
        id: "z2-02",
        question: "What does the week-card ritual actually do for you?",
        hint: "Not what it\u2019s supposed to do. What it actually does when you sit down with it.",
      },
      {
        id: "z2-03",
        question: "What does codetry protect that a business plan would erase?",
        hint: "If someone handed you a standard business plan template to fill out, what would be missing that matters?",
      },
      {
        id: "z2-04",
        question: "What does it mean that this is the zone where the names get decided?",
        hint: "You\u2019re the practitioner. You\u2019re the one who says what things are called. What is that responsibility like?",
      },
      {
        id: "z2-05",
        question: "What does this workbench look like on its best morning?",
        hint: "Walk through it. What\u2019s open, what\u2019s working, what\u2019s clear.",
      },
    ],
  },
  {
    id: "z3",
    name: "Commons",
    subtitle: "Zone 3 \u00b7 commons \u00b7 community production",
    prompts: [
      {
        id: "z3-01",
        question: "How did the 807 co-op actually start \u2014 what was the original problem?",
        hint: "Before the system existed. What were people doing, and what wasn\u2019t working?",
      },
      {
        id: "z3-02",
        question: "What does community production mean to you \u2014 not the definition, the feeling?",
        hint: "When it\u2019s working, what does it look like from inside?",
      },
      {
        id: "z3-03",
        question: "What\u2019s the hardest thing about running a food co-op in Northwestern Ontario?",
        hint: "Geography, weather, supply chains, people, trust \u2014 whatever is actually hard.",
      },
      {
        id: "z3-04",
        question: "When a neighbour walks through the door, what are they actually walking toward?",
        hint: "Not the product. The relationship, the thing you\u2019ve built together.",
      },
      {
        id: "z3-05",
        question: "What would be lost if you called members \u201cresidents\u201d instead of \u201cneighbours\u201d?",
        hint: "What changes when the word changes?",
      },
      {
        id: "z3-06",
        question: "What does the treasurer\u2019s calm monthly journey protect \u2014 for the treasurer, and for the co-op?",
        hint: "Why does the calm matter? What was happening before?",
      },
    ],
  },
  {
    id: "z4",
    name: "Arc",
    subtitle: "Zone 4 \u00b7 the arc \u00b7 in motion",
    prompts: [
      {
        id: "z4-01",
        question: "Why abattoir capacity \u2014 why is that the chokepoint and not land, customers, or knowledge?",
        hint: "Explain this the way you\u2019d explain it to a farmer who doesn\u2019t know what Zone 4 is.",
      },
      {
        id: "z4-02",
        question: "What does \u201cconventional to regenerative\u201d look like when you can see it happening in a field?",
        hint: "Not the theory. The actual change \u2014 what do you see, smell, observe?",
      },
      {
        id: "z4-03",
        question: "Who is Jude, and what does it mean that she\u2019s the pilot operator?",
        hint: "Tell me about the person. Why her, why now, why CCM?",
      },
      {
        id: "z4-04",
        question: "What does a farmer\u2019s path to transition actually look like \u2014 the steps, the risks, the fears?",
        hint: "Walk me through it from the farmer\u2019s side.",
      },
      {
        id: "z4-05",
        question: "What would this zone look like if the abattoir capacity problem were solved \u2014 what comes next?",
        hint: "You can look five years out here.",
      },
    ],
  },
  {
    id: "z5",
    name: "The Margin",
    subtitle: "Zone 5 \u00b7 wild observation \u00b7 private first, shared by choice",
    prompts: [
      {
        id: "z5-01",
        question: "What\u2019s a take in The Margin \u2014 not the definition, a real one you remember keeping?",
        hint: "Describe a specific take. What you noticed, what made you write it down.",
      },
      {
        id: "z5-02",
        question: "Why \u201cdam\u201d \u2014 what\u2019s being held back, and why is the holding back the point?",
        hint: "Not the rebrand story. The metaphor. What does a dam do that matters here?",
      },
      {
        id: "z5-03",
        question: "What\u2019s the difference between a thought staying in The Margin and floating to the Shallows?",
        hint: "What makes you choose to share? What makes you keep something private?",
      },
      {
        id: "z5-04",
        question: "What have you learned about yourself from keeping a record this way?",
        hint: "Not what the app does. What the practice has taught you.",
      },
      {
        id: "z5-05",
        question: "What\u2019s the relationship between The Margin and the rest of the constellation?",
        hint: "It\u2019s Zone 5 \u2014 the outermost zone. What does that position mean?",
      },
      {
        id: "z5-06",
        question: "What would be lost if you made The Margin public by default?",
        hint: "Why does privacy-first matter for this kind of thinking?",
      },
    ],
  },
];

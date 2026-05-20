/**
 * ethosContent.ts — canonical source for the Headwaters ethos
 *
 * "Don't trust; verify."
 *
 * Both the deck slide (EthosSlide.tsx) and the standalone page (EthosPage.tsx)
 * import from here so the copy can never drift out of sync.
 */

export const ETHOS_HEADLINE = "Don't trust; verify.";

export const ETHOS_BODY: string[] = [
  "We believe our eyes and our ears — listening first to Mother Earth and everything downstream of her. Every spiritual circle along the way is a whirlpool of knowledge gathered over seven generations, with a force so strong it's impenetrable.",

  "That tradition is older than any software company and older than any funder's reporting cycle. It is the reason we build instruments rather than ask for trust. Trust is generous. Instruments are honest.",

  "Verification is not adversarial. It is patient listening made visible — a price dashboard anyone can read, a household lookup a family can run themselves, a year-end audit that ships with a forward credit before the question is asked. Every tool Headwaters builds is the same move: don't ask anyone to take our word for it, give them the instrument to check.",
];

export interface VerificationInstrument {
  name: string;
  note: string;
}

export const ETHOS_INSTRUMENTS: VerificationInstrument[] = [
  {
    name: "Public price dashboard",
    note: "Anyone can see what the food costs and where the margin goes.",
  },
  {
    name: "Household lookup",
    note: "Every family can verify what they are owed and what they have received.",
  },
  {
    name: "Value-delivered audit + forward credit",
    note: "Year-end reconciliation ships as a paper trail, not a verbal assurance.",
  },
  {
    name: "Self-hosted servers",
    note: "The band takes physical possession. No vendor lock-in. No cloud dependency the community can't see.",
  },
  {
    name: "Privacy phones",
    note: "Community members control their own data without routing it through a third party.",
  },
  {
    name: "Payback memo",
    note: "The Capital Recovery agreement is a signed document, not a handshake. The math is on the page.",
  },
];

export const ETHOS_CLOSING = "Seven generations of gathered knowledge — impenetrable. That is the standard.";

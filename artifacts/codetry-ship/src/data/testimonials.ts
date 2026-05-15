export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  community: string;
}

const testimonials: Testimonial[] = [
  {
    id: "adele-rankin",
    quote:
      "The planning work was grounded and practical. Bobbie helped us build systems we actually understand and can run ourselves — not another consultant's framework we'd need outside help to maintain.",
    name: "Adele Rankin",
    title: "Board Chair",
    community: "807 Food Co-operative",
  },
  {
    id: "raymond-swanson",
    quote:
      "Having our own food hub changes what's possible for our community. This isn't theory — it's a real plan built around how we actually operate, and our council can see exactly how it works.",
    name: "Chief Raymond Swanson",
    title: "Chief",
    community: "Animakee Wa Zhing 37 First Nation",
  },
];

export default testimonials;

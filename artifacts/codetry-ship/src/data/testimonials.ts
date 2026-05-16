export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title?: string;
  community: string;
}

const testimonials: Testimonial[] = [
  {
    id: "adele-rankin",
    quote:
      "The planning work was grounded and practical. Bobbie helped us build systems we actually understand and can run ourselves — not another consultant's framework we'd need outside help to maintain.",
    name: "Adele Rankin",
    community: "-807 food cooperative board member",
  },
];

export default testimonials;

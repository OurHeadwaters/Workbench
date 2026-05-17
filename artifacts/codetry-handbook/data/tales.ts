export type TaleBlock =
  | { kind: "para"; text: string }
  | { kind: "italic"; text: string }
  | { kind: "break" };

export interface Tale {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: TaleBlock[];
  authorNote: string;
}

export const TALES: Tale[] = [
  {
    id: "the-girl-who-waited-for-the-eagle",
    title: "The Girl Who Waited for the Eagle",
    subtitle: "A tale for children of all ages, on every kind of ground",
    excerpt:
      "There was once a girl who had too many ideas. She wrote them all down — thousands of them — and waited to learn what they were for.",
    body: [
      {
        kind: "para",
        text: "There was once a girl who had too many ideas.",
      },
      {
        kind: "para",
        text: "They came to her in the morning before she opened her eyes. They came to her in the river, in the shape of the current. They came to her in the market, watching the old women trade things that had no price tags — a jar of something, a word of something, a promise of something.",
      },
      {
        kind: "para",
        text: "She wrote them all down. Thousands of them. Pages and pages of ideas that had no shape yet, only a direction.",
      },
      {
        kind: "italic",
        text: "What are they for? people would ask.",
      },
      {
        kind: "italic",
        text: "I don't know yet, she would say. But I will.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "She had been watching eagles her whole life.",
      },
      {
        kind: "para",
        text: "Not looking for them. Watching them. There is a difference. Looking is wanting. Watching is waiting without wanting.",
      },
      {
        kind: "para",
        text: "Eagles do not come when you call. They come when you are ready for what they carry.",
      },
      {
        kind: "para",
        text: "She had learned this the slow way.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "For years she walked into communities and told them what she thought she had.",
      },
      {
        kind: "para",
        text: "Most listened politely. Some said interesting. None said yes.",
      },
      {
        kind: "para",
        text: "She drove home on long roads and asked the sky: Is this the right direction?",
      },
      {
        kind: "para",
        text: "The sky did not answer. Or maybe it did, and she was not yet ready to hear it.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "Then one morning she was standing outside, writing in the early cold, and she asked herself the question again — the same question, worn smooth from so many years of asking.",
      },
      {
        kind: "italic",
        text: "Is this the right direction?",
      },
      {
        kind: "para",
        text: "And an eagle appeared.",
      },
      {
        kind: "para",
        text: "Not circling far away. Not a shape on the horizon. He came from nowhere and dropped low, and held himself above her in the wind — like he was reading her, the way she had spent years reading the land.",
      },
      {
        kind: "para",
        text: "She said, Well, hello.",
      },
      {
        kind: "para",
        text: "He stayed.",
      },
      {
        kind: "para",
        text: "She asked again: Is this the right direction?",
      },
      {
        kind: "para",
        text: "He rose in a slow circle — once, twice — and flew out of sight.",
      },
      {
        kind: "para",
        text: "She stood still for a long time.",
      },
      {
        kind: "para",
        text: "She understood that some questions get answered in bird time, not human time. And that the answer had been yes for longer than she had been listening.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "Not long after, she found herself sitting in a small room with a very old woman.",
      },
      {
        kind: "para",
        text: "The old woman's hands were the most knowledgeable thing about her. They moved when she talked, like they were drawing the story in the air before the words arrived.",
      },
      {
        kind: "para",
        text: "The girl had been told: do not bring your ideas into this room. She had left them outside, in her bag, in the car.",
      },
      {
        kind: "para",
        text: "She brought nothing but her ears.",
      },
      {
        kind: "para",
        text: "The old woman talked for a long time about things that had no English words. She talked about how her people said enough in a way that also meant full and grateful. How they said trade in a way that also meant you are now inside my story. How they said home in a way that held the river, the season, the name of a grandmother, and a specific kind of light all at once.",
      },
      {
        kind: "para",
        text: "The girl listened.",
      },
      {
        kind: "para",
        text: "Then, very quietly, she asked: Would it be alright if I wrote some of these down?",
      },
      {
        kind: "para",
        text: "The old woman looked at her for a long time.",
      },
      {
        kind: "italic",
        text: "Not yet, she said. Come back.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "The girl came back. Again and again. Each time, she brought less. Each time, she was invited further in.",
      },
      {
        kind: "para",
        text: "One afternoon the old woman said: The problem with your people's words is they sit still. Ours move. You can't put a moving word in a box.",
      },
      {
        kind: "italic",
        text: "What if the box moved with it? the girl said.",
      },
      {
        kind: "para",
        text: "The old woman was quiet. Then she smiled.",
      },
      {
        kind: "italic",
        text: "Show me, she said.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "And that was how the ledger began.",
      },
      {
        kind: "para",
        text: "Not with an idea. Not with a plan. With an old woman saying show me to a girl who had finally stopped explaining and started listening.",
      },
      {
        kind: "para",
        text: "The ledger was not a dictionary. It was not a translation. It was a living record — words in the shape they lived in that community, connected to the people who carried them, updated when the community said so, closed to the outside world unless the community opened it.",
      },
      {
        kind: "para",
        text: "It belonged to them. She was only the one who had learned to hold it carefully.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "She told her children about it at bedtime, years later.",
      },
      {
        kind: "italic",
        text: "What did the eagle mean? her youngest asked.",
      },
      {
        kind: "para",
        text: "She thought about it.",
      },
      {
        kind: "italic",
        text: "I think he meant: you are slow enough now. You are ready.",
      },
      {
        kind: "italic",
        text: "Ready for what?",
      },
      {
        kind: "italic",
        text: "To be useful without being in charge of it.",
      },
      {
        kind: "para",
        text: "Her child thought about this for a while.",
      },
      {
        kind: "italic",
        text: "That sounds hard, he said.",
      },
      {
        kind: "italic",
        text: "It is, she said. It takes about thirty years.",
      },
    ],
    authorNote:
      "A true story, told sideways.\nThe eagle was real. The waiting was real. The old woman is still waiting to be found.\nThis work is for her.",
  },
];

export function getTale(id: string | undefined): Tale | undefined {
  if (!id) return undefined;
  return TALES.find((t) => t.id === id);
}

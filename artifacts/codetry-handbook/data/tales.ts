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
    id: "the-button-she-almost-didnt-press",
    title: "The Button She Almost Didn't Press",
    subtitle: "A tale about labour, patience, and the weight of meaning",
    excerpt:
      "Kaya had been inside for eleven days. Not sick. Not grounded. Just — inside. The summer had gotten long in a way summers sometimes do when you're sixteen and there's nothing that needs you.",
    body: [
      { kind: "para", text: "Kaya had been inside for eleven days." },
      {
        kind: "para",
        text: "Not sick. Not grounded. Just — inside. The summer had gotten long in a way summers sometimes do when you're sixteen and there's nothing that needs you.",
      },
      {
        kind: "para",
        text: "Her cousin was at her dad's in Thunder Bay. The community centre was doing little kids' programs. Everyone seemed to be somewhere that wasn't for her.",
      },
      {
        kind: "para",
        text: "She opened the Helping Hands app the way you open the fridge when you're not hungry — just to see.",
      },
      {
        kind: "para",
        text: "There was a section she'd never clicked: Skills. A list of things people in the community knew how to do. Beading. Bannock. Net repair. Chainsaw maintenance. Cree syllabics. And near the bottom, under Food and Harvest:",
      },
      { kind: "italic", text: "Wild Rice Harvesting." },
      {
        kind: "para",
        text: "She didn't know why she stopped there. She'd eaten wild rice her whole life. She'd never thought about where it came from, exactly. The lake. Obviously the lake. But she'd never been out there when it happened.",
      },
      {
        kind: "para",
        text: "There was a small button beneath the description. It just said: I'm watching this.",
      },
      {
        kind: "para",
        text: "She pressed it. Nothing happened. The screen didn't change. No confetti. No notification. She put her phone down and went back to watching the ceiling.",
      },
      { kind: "break" },
      { kind: "para", text: "Four days later, Margaret Swain called her." },
      {
        kind: "para",
        text: "Kaya almost didn't answer. She didn't know Margaret well — she was an old woman who lived near the dock, the kind of person adults talked about with a certain respectful hush. She had a boat she'd been taking out alone for forty years.",
      },
      {
        kind: "italic",
        text: "I saw your name on the list, Margaret said. You want to learn the rice?",
      },
      {
        kind: "para",
        text: "Kaya said yes before she understood what she was agreeing to.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "They went out the first morning before the sun was fully up.",
      },
      {
        kind: "para",
        text: "The lake smelled like cold and green things. Margaret handed her a pole and showed her how to hold it — low, steady, moving from the hips, not the arms. They pushed through the rice beds in silence. The stalks were taller than Kaya expected, brushing against her arms, the grains hanging heavy at the top.",
      },
      { kind: "italic", text: "Not yet, Margaret said." },
      { kind: "italic", text: "How do you know?" },
      {
        kind: "italic",
        text: "Pinch one. Rub it. Is it soft or does it hold?",
      },
      {
        kind: "para",
        text: "Kaya tried. She didn't know what she was feeling for.",
      },
      { kind: "italic", text: "Soft, Margaret said. We wait." },
      {
        kind: "para",
        text: "They went out four mornings that week and came back each time without rice. Kaya learned to read the colour of the stalk. She learned how the grains sounded against each other when the wind came through — not ready, not ready, not ready. She learned that Margaret never seemed impatient, and that this was itself a kind of teaching.",
      },
      {
        kind: "para",
        text: "On the fifth morning, Margaret reached up, rubbed a grain between her fingers, and looked at her.",
      },
      { kind: "italic", text: "Today, she said." },
      { kind: "break" },
      {
        kind: "para",
        text: "The ricing sticks were smooth from decades of use. Margaret showed her the motion — one stick to bend the stalk over the canoe, one to knock the grains loose. Gentle but decisive. You weren't hitting the rice, you were inviting it to fall.",
      },
      {
        kind: "para",
        text: "At first Kaya was too hard. Rice scattered into the water.",
      },
      { kind: "italic", text: "Not like that, Margaret said. She didn't explain further. She just showed her again." },
      {
        kind: "para",
        text: "Kaya tried softer. More rice stayed. She found the rhythm slowly — bend, knock, bend, knock — the grains raining down into the hull in a sound she had never heard before and would not forget. Dry and full and alive.",
      },
      {
        kind: "para",
        text: "Her arms ached by midmorning. Her back hurt in a new way. The mosquitoes found the gap between her collar and her hat. The sun came up and the lake got bright and she kept going because Margaret kept going, and stopping felt like the wrong answer to something, though she couldn't have said what the question was.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "They worked through the morning until the canoe was heavy with it. The rice lay in the hull like small dark keys, thousands of them, the whole summer's patience made into something you could hold.",
      },
      {
        kind: "para",
        text: "Margaret cut the engine on the way back and let them drift for a moment.",
      },
      {
        kind: "italic",
        text: "My grandmother showed me, she said. Hers showed her. It goes back further than either of us can name.",
      },
      {
        kind: "para",
        text: "Kaya looked at the rice. She looked at her sore hands. She didn't say anything because there wasn't anything to say that would fit.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "That night, opening the app to show her mom, Kaya noticed her name had moved. Under wild rice harvesting, where it used to say Watching, it now said Learning.",
      },
      {
        kind: "para",
        text: "She wasn't sure how to explain what that meant. It was just a word on a screen.",
      },
      {
        kind: "para",
        text: "But she'd been out on that lake. She'd waited when the rice said wait. She'd learned the knock that doesn't scatter. She'd come home with something real in the hull and something different in her chest — a kind of weight she'd been missing without knowing it.",
      },
      { kind: "para", text: "She put her phone down." },
      {
        kind: "para",
        text: "Tomorrow, Margaret said, they would parch it.",
      },
      { kind: "para", text: "There was more to learn." },
      { kind: "break" },
      {
        kind: "italic",
        text: "In the Helping Hands skill directory, wild rice harvesting lives under Food and Harvest. Anyone can press I'm watching this. The Knowledge Holder who carries the skill sees your name. What happens after that has been happening on this lake for longer than the app — longer than the phones — longer than most of the words we have for it. The technology just made sure the door was easy to find.",
      },
    ],
    authorNote:
      "The Watching stage is the door before the door. No commitment, no test, no credentials. Just: I see this and I'm curious. Someone who holds something real sees your name. That thread — between a restless kid and a person with forty years in a boat — is what the system is actually for.",
  },
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
  {
    id: "the-girl-who-never-knew",
    title: "The Girl Who Never Knew",
    subtitle: "A coming-of-age tale, told in decades",
    excerpt:
      "She had always worn her heart on the outside, where everyone could see it. She thought that was simply how hearts worked. She didn't know, then, what she was being prepared for.",
    body: [
      {
        kind: "para",
        text: "She was born with her heart already outside her chest.",
      },
      {
        kind: "para",
        text: "Not broken — just worn on the outside, where everyone could see it. She didn't know this made her different. She thought that was simply how hearts worked.",
      },
      {
        kind: "para",
        text: "She lived at the edge of the trees, where the yard gave way to roots and shadows and the kind of quiet that isn't really quiet at all. She brought wildflowers to the neighbours without being asked. She sat with the old dog next door when it was sick. She noticed, without being told, when someone's eyes held too much water — and she would simply stay nearby, as if nearness were a kind of medicine.",
      },
      {
        kind: "para",
        text: "Her world was small. And in that smallness, it was full.",
      },
      {
        kind: "para",
        text: "Her mother called her beautiful inside and out. She accepted this the way she accepted most things — warmly, without question. She didn't know, then, that not every girl heard those words.",
      },
      {
        kind: "italic",
        text: "She didn't know, then, what the world outside the trees was made of.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "When she became a teenager, she pulled her circle tighter — not from fear, exactly, but from a kind of knowing.",
      },
      {
        kind: "para",
        text: "She had found her nook. A corner of the forest that was hers to tend. She knew which mosses grew along the north-facing rocks, which paths stayed dry after rain, which branches held the best quiet. She kept it beautiful the only way she knew how: slowly, tenderly, a little at a time.",
      },
      {
        kind: "para",
        text: "Her friends were few and chosen. Her joy was specific. She did not need much from the world because she had learned how to make enough from what was near.",
      },
      {
        kind: "italic",
        text: "Some people called this small.",
      },
      {
        kind: "italic",
        text: "She called it enough.",
      },
      {
        kind: "italic",
        text: "She didn't know, then, that enough can be a wall as much as a gift.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "University took her to bigger rooms and louder voices, and she moved through them the way a creek moves through a city — finding the quieter channels, the grassy margins, the places where the noise didn't reach.",
      },
      {
        kind: "para",
        text: "She was supposed to graduate on time. There was one course — a small one, taken online — that stood between her and the finish line. But it never quite arrived. The screen felt thin and far away, and outside the window there were always more beautiful things to look at. Always some reason to disappear back through the trees.",
      },
      {
        kind: "para",
        text: "So when the calendar gave her one more semester and the chance to choose something of her own, she chose a course she couldn't explain. A program. A place. The heart of downtown Winnipeg, which might as well have been another country.",
      },
      {
        kind: "para",
        text: "She was pulled there the way you are pulled somewhere you cannot name. A million reasons, none of them speakable.",
      },
      {
        kind: "italic",
        text: "So she went.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "The room was small — a relief. But the faces were unfamiliar, and that was a new kind of discomfort.",
      },
      {
        kind: "para",
        text: "She sat the way she had always sat: with big ears and a tender heart. And she listened.",
      },
      {
        kind: "para",
        text: "What she heard undid her.",
      },
      {
        kind: "para",
        text: "These were people of all ages — some her parents' age, some younger than she expected. And one by one, in that room in the heart of the city, they opened their lives and let her look inside. Stories of things she had no word for. Experiences that her small and careful world had never once prepared her to hold.",
      },
      {
        kind: "para",
        text: "She went home each night and cried herself quiet.",
      },
      {
        kind: "para",
        text: "Not from sadness, exactly. From the rearranging.",
      },
      {
        kind: "para",
        text: "Thirty days. Thirty days of a world she had not known was there — grey in the places she had always imagined as bright, and pitch black in corners that had never once occurred to her. People who had seemingly never, not once, felt warmth from the inside.",
      },
      {
        kind: "para",
        text: "It tore her to pieces.",
      },
      {
        kind: "italic",
        text: "And then, slowly, it put her back together differently.",
      },
      {
        kind: "italic",
        text: "She didn't know, then, that this was the gift. That being torn is how the container gets bigger.",
      },
      { kind: "break" },
      {
        kind: "para",
        text: "Years later she would be sitting on a deck, watching the light go long across the yard, and she would think: that was the moment. That room. That city. Those thirty days. That was where the path turned.",
      },
      {
        kind: "para",
        text: "She hadn't seen it clearly then. You never do.",
      },
      {
        kind: "para",
        text: "But she would sit at a table, later still, and watch an old woman's hands — the way they moved without hurry, the way they held things gently, the way they had learned, over a long life, to carry what was heavy without letting it show.",
      },
      {
        kind: "para",
        text: "And she would understand, finally, what she had been learning all along.",
      },
      {
        kind: "italic",
        text: "That a heart worn on the outside is not a weakness.",
      },
      {
        kind: "italic",
        text: "It is a kind of readiness.",
      },
      {
        kind: "italic",
        text: "She just never knew, until then, what she was ready for.",
      },
    ],
    authorNote:
      "Some rooms change you before you understand what happened inside them. The gift usually arrives looking like loss.",
  },
];

export function getTale(id: string | undefined): Tale | undefined {
  if (!id) return undefined;
  return TALES.find((t) => t.id === id);
}

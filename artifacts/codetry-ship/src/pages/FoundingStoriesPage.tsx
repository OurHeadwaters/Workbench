/**
 * FoundingStoriesPage — shared front door for both the youth and adult Odyssey.
 * Renders the three founding "girl" stories with a creek/stream motif between them.
 * At the bottom: two onward paths — youth journey or pioneer odyssey.
 */

/* ── Creek SVG divider ───────────────────────────────────────────────────── */

function CreekDivider() {
  return (
    <div className="my-14 flex items-center justify-center" aria-hidden="true">
      <svg
        viewBox="0 0 480 48"
        width="100%"
        style={{ maxWidth: 480, display: "block" }}
      >
        <path
          d="M 0 24 C 30 14, 50 34, 80 24 C 110 14, 130 36, 160 24 C 190 12, 210 36, 240 24 C 270 12, 290 36, 320 24 C 350 12, 370 36, 400 24 C 430 12, 455 34, 480 24"
          fill="none"
          stroke="rgba(46,139,78,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 0 32 C 30 22, 55 42, 85 30 C 115 18, 140 40, 170 30 C 200 20, 225 42, 255 30 C 285 18, 310 40, 340 30 C 370 20, 395 42, 425 30 C 450 20, 465 38, 480 32"
          fill="none"
          stroke="rgba(100,160,200,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* small pebble dots */}
        {[60, 140, 220, 300, 380].map((x) => (
          <circle key={x} cx={x} cy={24} r={2.5} fill="rgba(201,124,46,0.35)" />
        ))}
      </svg>
    </div>
  );
}

/* ── Inline story data (three founding girl tales) ───────────────────────── */

type StoryBlock =
  | { kind: "para"; text: string }
  | { kind: "italic"; text: string }
  | { kind: "break" };

interface FoundingTale {
  id: string;
  title: string;
  subtitle: string;
  body: StoryBlock[];
  authorNote: string;
}

const FOUNDING_TALES: FoundingTale[] = [
  {
    id: "the-girl-who-waited-for-the-eagle",
    title: "The Girl Who Waited for the Eagle",
    subtitle: "A tale for children of all ages, on every kind of ground",
    authorNote:
      "A true story, told sideways.\nThe eagle was real. The waiting was real. The old woman is still waiting to be found.\nThis work is for her.",
    body: [
      { kind: "para", text: "There was once a girl who had too many ideas." },
      { kind: "para", text: "They came to her in the morning before she opened her eyes. They came to her in the river, in the shape of the current. They came to her in the market, watching the old women trade things that had no price tags — a jar of something, a word of something, a promise of something." },
      { kind: "para", text: "She wrote them all down. Thousands of them. Pages and pages of ideas that had no shape yet, only a direction." },
      { kind: "italic", text: "What are they for? people would ask." },
      { kind: "italic", text: "I don't know yet, she would say. But I will." },
      { kind: "break" },
      { kind: "para", text: "She had been watching eagles her whole life." },
      { kind: "para", text: "Not looking for them. Watching them. There is a difference. Looking is wanting. Watching is waiting without wanting." },
      { kind: "para", text: "Eagles do not come when you call. They come when you are ready for what they carry." },
      { kind: "para", text: "She had learned this the slow way." },
      { kind: "break" },
      { kind: "para", text: "For years she walked into communities and told them what she thought she had." },
      { kind: "para", text: "Most listened politely. Some said interesting. None said yes." },
      { kind: "para", text: "She drove home on long roads and asked the sky: Is this the right direction?" },
      { kind: "para", text: "The sky did not answer. Or maybe it did, and she was not yet ready to hear it." },
      { kind: "break" },
      { kind: "para", text: "Then one morning she was standing outside, writing in the early cold, and she asked herself the question again — the same question, worn smooth from so many years of asking." },
      { kind: "italic", text: "Is this the right direction?" },
      { kind: "para", text: "And an eagle appeared." },
      { kind: "para", text: "Not circling far away. Not a shape on the horizon. He came from nowhere and dropped low, and held himself above her in the wind — like he was reading her, the way she had spent years reading the land." },
      { kind: "para", text: "She said, Well, hello." },
      { kind: "para", text: "He stayed." },
      { kind: "para", text: "She asked again: Is this the right direction?" },
      { kind: "para", text: "He rose in a slow circle — once, twice — and flew out of sight." },
      { kind: "para", text: "She stood still for a long time." },
      { kind: "para", text: "She understood that some questions get answered in bird time, not human time. And that the answer had been yes for longer than she had been listening." },
      { kind: "break" },
      { kind: "para", text: "Not long after, she found herself sitting in a small room with a very old woman." },
      { kind: "para", text: "The old woman's hands were the most knowledgeable thing about her. They moved when she talked, like they were drawing the story in the air before the words arrived." },
      { kind: "para", text: "The girl had been told: do not bring your ideas into this room. She had left them outside, in her bag, in the car." },
      { kind: "para", text: "She brought nothing but her ears." },
      { kind: "para", text: "The old woman talked for a long time about things that had no English words. She talked about how her people said enough in a way that also meant full and grateful. How they said trade in a way that also meant you are now inside my story. How they said home in a way that held the river, the season, the name of a grandmother, and a specific kind of light all at once." },
      { kind: "para", text: "The girl listened." },
      { kind: "para", text: "Then, very quietly, she asked: Would it be alright if I wrote some of these down?" },
      { kind: "para", text: "The old woman looked at her for a long time." },
      { kind: "italic", text: "Not yet, she said. Come back." },
      { kind: "break" },
      { kind: "para", text: "The girl came back. Again and again. Each time, she brought less. Each time, she was invited further in." },
      { kind: "para", text: "One afternoon the old woman said: The problem with your people's words is they sit still. Ours move. You can't put a moving word in a box." },
      { kind: "italic", text: "What if the box moved with it? the girl said." },
      { kind: "para", text: "The old woman was quiet. Then she smiled." },
      { kind: "italic", text: "Show me, she said." },
      { kind: "break" },
      { kind: "para", text: "And that was how the ledger began." },
      { kind: "para", text: "Not with an idea. Not with a plan. With an old woman saying show me to a girl who had finally stopped explaining and started listening." },
      { kind: "para", text: "The ledger was not a dictionary. It was not a translation. It was a living record — words in the shape they lived in that community, connected to the people who carried them, updated when the community said so, closed to the outside world unless the community opened it." },
      { kind: "para", text: "It belonged to them. She was only the one who had learned to hold it carefully." },
      { kind: "break" },
      { kind: "para", text: "She told her children about it at bedtime, years later." },
      { kind: "italic", text: "What did the eagle mean? her youngest asked." },
      { kind: "para", text: "She thought about it." },
      { kind: "italic", text: "I think he meant: you are slow enough now. You are ready." },
      { kind: "italic", text: "Ready for what?" },
      { kind: "italic", text: "To be useful without being in charge of it." },
      { kind: "para", text: "Her child thought about this for a while." },
      { kind: "italic", text: "That sounds hard, he said." },
      { kind: "italic", text: "It is, she said. It takes about thirty years." },
    ],
  },
  {
    id: "the-girl-who-never-knew",
    title: "The Girl Who Never Knew",
    subtitle: "A coming-of-age tale, told in decades",
    authorNote:
      "Some rooms change you before you understand what happened inside them. The gift usually arrives looking like loss.",
    body: [
      { kind: "para", text: "She was born with her heart already outside her chest." },
      { kind: "para", text: "Not broken — just worn on the outside, where everyone could see it. She didn't know this made her different. She thought that was simply how hearts worked." },
      { kind: "para", text: "She lived at the edge of the trees, where the yard gave way to roots and shadows and the kind of quiet that isn't really quiet at all. She brought wildflowers to the neighbours without being asked. She sat with the old dog next door when it was sick. She noticed, without being told, when someone's eyes held too much water — and she would simply stay nearby, as if nearness were a kind of medicine." },
      { kind: "para", text: "Her world was small. And in that smallness, it was full." },
      { kind: "para", text: "Her mother called her beautiful inside and out. She accepted this the way she accepted most things — warmly, without question. She didn't know, then, that not every girl heard those words." },
      { kind: "italic", text: "She didn't know, then, what the world outside the trees was made of." },
      { kind: "break" },
      { kind: "para", text: "When she became a teenager, she pulled her circle tighter — not from fear, exactly, but from a kind of knowing." },
      { kind: "para", text: "She had found her nook. A corner of the forest that was hers to tend. She knew which mosses grew along the north-facing rocks, which paths stayed dry after rain, which branches held the best quiet. She kept it beautiful the only way she knew how: slowly, tenderly, a little at a time." },
      { kind: "para", text: "Her friends were few and chosen. Her joy was specific. She did not need much from the world because she had learned how to make enough from what was near." },
      { kind: "italic", text: "Some people called this small." },
      { kind: "italic", text: "She called it enough." },
      { kind: "italic", text: "She didn't know, then, that enough can be a wall as much as a gift." },
      { kind: "break" },
      { kind: "para", text: "University took her to bigger rooms and louder voices, and she moved through them the way a creek moves through a city — finding the quieter channels, the grassy margins, the places where the noise didn't reach." },
      { kind: "para", text: "She was supposed to graduate on time. There was one course — a small one, taken online — that stood between her and the finish line. But it never quite arrived. The screen felt thin and far away, and outside the window there were always more beautiful things to look at. Always some reason to disappear back through the trees." },
      { kind: "para", text: "So when the calendar gave her one more semester and the chance to choose something of her own, she chose a course she couldn't explain. A program. A place. The heart of downtown Winnipeg, which might as well have been another country." },
      { kind: "para", text: "She was pulled there the way you are pulled somewhere you cannot name. A million reasons, none of them speakable." },
      { kind: "italic", text: "So she went." },
      { kind: "break" },
      { kind: "para", text: "The room was small — a relief. But the faces were unfamiliar, and that was a new kind of discomfort." },
      { kind: "para", text: "She sat the way she had always sat: with big ears and a tender heart. And she listened." },
      { kind: "para", text: "What she heard undid her." },
      { kind: "para", text: "These were people of all ages — some her parents' age, some younger than she expected. And one by one, in that room in the heart of the city, they opened their lives and let her look inside. Stories of things she had no word for. Experiences that her small and careful world had never once prepared her to hold." },
      { kind: "para", text: "She went home each night and cried herself quiet." },
      { kind: "para", text: "Not from sadness, exactly. From the rearranging." },
      { kind: "para", text: "Thirty days. Thirty days of a world she had not known was there — grey in the places she had always imagined as bright, and pitch black in corners that had never once occurred to her. People who had seemingly never, not once, felt warmth from the inside." },
      { kind: "para", text: "It tore her to pieces." },
      { kind: "italic", text: "And then, slowly, it put her back together differently." },
      { kind: "italic", text: "She didn't know, then, that this was the gift. That being torn is how the container gets bigger." },
      { kind: "break" },
      { kind: "para", text: "Years later she would be sitting on a deck, watching the light go long across the yard, and she would think: that was the moment. That room. That city. Those thirty days. That was where the path turned." },
      { kind: "para", text: "She hadn't seen it clearly then. You never do." },
      { kind: "para", text: "But she would sit at a table, later still, and watch an old woman's hands — the way they moved without hurry, the way they held things gently, the way they had learned, over a long life, to carry what was heavy without letting it show." },
      { kind: "para", text: "And she would understand, finally, what she had been learning all along." },
      { kind: "italic", text: "That a heart worn on the outside is not a weakness." },
      { kind: "italic", text: "It is a kind of readiness." },
      { kind: "italic", text: "She just never knew, until then, what she was ready for." },
    ],
  },
  {
    id: "the-girl-who-stopped-waiting-for-spring",
    title: "The Girl Who Stopped Waiting for Spring",
    subtitle: "On the aliveness that does not wait for permission",
    authorNote:
      "The aliveness that arrives with spring is real. But the capacity for it was never seasonal. It was only ever waiting for her to stop waiting. The February green that grows without permission is not a lesson — it's a reminder. The internal drive that needs an external cue to feel legitimate is still the drive. It just hasn't trusted itself yet.",
    body: [
      { kind: "para", text: "Every year she waited for the ice to break on the lake." },
      { kind: "para", text: "It happened in April, sometimes May. There was a sound to it — not a crack so much as a low, settling groan, like the lake was exhaling something it had held all winter. She had been hearing that sound her whole life and it still made her stop whatever she was doing and listen." },
      { kind: "para", text: "When the ice broke she felt like herself again. Full and awake and in the right place. She could not have explained it to anyone who asked." },
      { kind: "para", text: "The months between freeze and breakup — October through May — she spent in a kind of holding. Not unhappy. Not exactly. Just waiting. Keeping herself in reserve until the world said it was time." },
      { kind: "break" },
      { kind: "para", text: "One February, the hardest month, the one that showed no signs of ending, she was looking out the back window at the yard when she saw it." },
      { kind: "para", text: "A small push of green, coming up through the snow at the base of the fence." },
      { kind: "para", text: "She went outside in her coat and crouched down to look at it. The ground was still frozen six inches down. The temperature had not been above minus ten in three weeks. Whatever this was had no business being here. Nothing had said it could." },
      { kind: "italic", text: "And yet." },
      { kind: "break" },
      { kind: "para", text: "She watched it for the next two weeks. Some mornings it was buried under new snow and she would find it again when the snow shifted — still green, still pushing, as if it had not gotten the message that this was not its season." },
      { kind: "para", text: "It did not ask if it was time. It did not look at the ice on the lake. It grew toward something it could not see yet, through ground that had not softened, in a month that gave it nothing to work with." },
      { kind: "para", text: "She started going outside in the mornings to check on it. She did not tell anyone. It was hers in a way she could not explain." },
      { kind: "break" },
      { kind: "para", text: "April came. The ice broke — she heard it, the same exhale — and she went to the lake the way she always did, and stood at the edge, and felt it: the fullness, the waking." },
      { kind: "para", text: "But this year it was different. This year she recognized it." },
      { kind: "para", text: "She had felt this in February, kneeling in the snow at the base of the fence. She had felt it every morning she went outside to check on the green thing that grew without permission. The feeling had not been stored away waiting for the ice. The feeling had been available the whole time. She just had not known to look for it before April." },
      { kind: "break" },
      { kind: "italic", text: "The ice broke anyway." },
      { kind: "italic", text: "But this year she was already there when it did." },
    ],
  },
];

/* ── Story block renderer ────────────────────────────────────────────────── */

function StoryBody({ blocks }: { blocks: StoryBlock[] }) {
  return (
    <div className="space-y-0">
      {blocks.map((block, i) => {
        if (block.kind === "break") {
          return <div key={i} className="h-6" />;
        }
        if (block.kind === "italic") {
          return (
            <p
              key={i}
              className="font-serif italic"
              style={{
                fontSize: "clamp(1rem, 2.8vw, 1.125rem)",
                color: "rgba(244,237,224,0.78)",
                lineHeight: 1.85,
                marginBottom: "0.6em",
              }}
            >
              {block.text}
            </p>
          );
        }
        return (
          <p
            key={i}
            className="font-serif"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 1.125rem)",
              color: "rgba(244,237,224,0.88)",
              lineHeight: 1.85,
              marginBottom: "0.6em",
            }}
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */

export function FoundingStoriesPage() {
  return (
    <main
      style={{
        background: "linear-gradient(to bottom, #0d1d15 0%, #16261e 40%, #1a2e24 80%, #162535 100%)",
        minHeight: "100vh",
        color: "#f4ede0",
      }}
    >
      {/* ── Header ── */}
      <header
        className="max-w-[44rem] mx-auto px-6 sm:px-8"
        style={{ paddingTop: "clamp(3rem, 8vw, 5rem)", paddingBottom: "2.5rem" }}
      >
        <p
          className="font-mono uppercase tracking-[0.28em] mb-4"
          style={{ fontSize: "9px", color: "rgba(201,124,46,0.7)" }}
        >
          Headwaters · Founding Stories
        </p>
        <h1
          className="font-serif mb-4"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "#f4ede0",
          }}
        >
          Three Girls,<br />One River
        </h1>
        <p
          className="font-serif italic"
          style={{
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            color: "rgba(244,237,224,0.55)",
            lineHeight: 1.65,
            maxWidth: "34rem",
          }}
        >
          These are the stories that run beneath everything else here.
          Read them before you begin — whichever path you take.
        </p>

        {/* creek intro line */}
        <div className="mt-8 flex items-center gap-3">
          <svg viewBox="0 0 80 12" width="80" style={{ display: "block" }} aria-hidden="true">
            <path
              d="M 0 6 C 10 2, 18 10, 28 6 C 38 2, 46 10, 56 6 C 66 2, 74 10, 80 6"
              fill="none"
              stroke="rgba(46,139,78,0.5)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="font-mono uppercase tracking-[0.22em]"
            style={{ fontSize: "8px", color: "rgba(244,237,224,0.25)" }}
          >
            Three stories · one creek
          </span>
        </div>
      </header>

      {/* ── Stories ── */}
      <div className="max-w-[44rem] mx-auto px-6 sm:px-8 pb-4">
        {FOUNDING_TALES.map((tale, idx) => (
          <div key={tale.id}>
            {/* Story header */}
            <div className="mb-8">
              <span
                className="font-mono uppercase tracking-[0.22em] block mb-3"
                style={{ fontSize: "8.5px", color: "rgba(201,124,46,0.6)" }}
              >
                Story {String(idx + 1).padStart(2, "0")} of 03
              </span>
              <h2
                className="font-serif mb-2"
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                  color: "#f4ede0",
                }}
              >
                {tale.title}
              </h2>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "clamp(0.9rem, 2.6vw, 1.05rem)",
                  color: "rgba(201,124,46,0.75)",
                  lineHeight: 1.55,
                }}
              >
                {tale.subtitle}
              </p>
              <div
                className="mt-4 h-px"
                style={{ background: "rgba(201,124,46,0.18)" }}
              />
            </div>

            {/* Story body */}
            <StoryBody blocks={tale.body} />

            {/* Author note */}
            <div
              className="mt-8 px-5 py-4 rounded-xl"
              style={{
                background: "rgba(244,237,224,0.04)",
                border: "1px solid rgba(244,237,224,0.08)",
              }}
            >
              <p
                className="font-mono uppercase tracking-[0.2em] mb-2"
                style={{ fontSize: "7.5px", color: "rgba(201,124,46,0.5)" }}
              >
                Author's note
              </p>
              {tale.authorNote.split("\n").map((line, i) => (
                <p
                  key={i}
                  className="font-serif italic"
                  style={{
                    fontSize: "13px",
                    color: "rgba(244,237,224,0.42)",
                    lineHeight: 1.7,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Creek divider between stories */}
            {idx < FOUNDING_TALES.length - 1 && <CreekDivider />}
          </div>
        ))}
      </div>

      {/* ── Onward paths ── */}
      <footer
        className="max-w-[44rem] mx-auto px-6 sm:px-8"
        style={{ paddingTop: "3rem", paddingBottom: "5rem" }}
      >
        {/* final creek line */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(46,139,78,0.22)" }} />
          <svg viewBox="0 0 16 16" width="16" aria-hidden="true">
            <circle cx="8" cy="8" r="3" fill="rgba(100,160,200,0.4)" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "rgba(46,139,78,0.22)" }} />
        </div>

        <p
          className="font-mono uppercase tracking-[0.28em] text-center mb-3"
          style={{ fontSize: "8.5px", color: "rgba(244,237,224,0.3)" }}
        >
          Choose your path
        </p>
        <p
          className="font-serif italic text-center mb-8"
          style={{
            fontSize: "clamp(1rem, 3vw, 1.15rem)",
            color: "rgba(244,237,224,0.5)",
            lineHeight: 1.65,
          }}
        >
          The creek runs the same direction from here.<br />
          Which bank are you on?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/story"
            className="flex-1 sm:max-w-[18rem] flex flex-col items-center gap-1 px-6 py-5 rounded-xl transition-all hover:opacity-85"
            style={{
              background: "rgba(31,61,46,0.5)",
              border: "1.5px solid rgba(46,139,78,0.35)",
              textDecoration: "none",
            }}
          >
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: "8px", color: "rgba(201,124,46,0.7)" }}
            >
              Youth Journey
            </span>
            <span
              className="font-serif"
              style={{ fontSize: "1.05rem", color: "#f4ede0", fontWeight: 500 }}
            >
              I'm a young reader →
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "7.5px", color: "rgba(244,237,224,0.3)", letterSpacing: "0.1em" }}
            >
              /story
            </span>
          </a>

          <a
            href="/odyssey"
            className="flex-1 sm:max-w-[18rem] flex flex-col items-center gap-1 px-6 py-5 rounded-xl transition-all hover:opacity-85"
            style={{
              background: "rgba(20,35,55,0.5)",
              border: "1.5px solid rgba(122,179,204,0.3)",
              textDecoration: "none",
            }}
          >
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: "8px", color: "rgba(122,179,204,0.7)" }}
            >
              Pioneer Odyssey
            </span>
            <span
              className="font-serif"
              style={{ fontSize: "1.05rem", color: "#f4ede0", fontWeight: 500 }}
            >
              I'm a practitioner →
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "7.5px", color: "rgba(244,237,224,0.3)", letterSpacing: "0.1em" }}
            >
              /odyssey
            </span>
          </a>
        </div>
      </footer>
    </main>
  );
}

import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const questions = [
  {
    num: "Q1",
    label: "Since your last appearance",
    text: "Last time you were on the show, you were in the thick of building Parr's Jars and figuring out what a real northern food business looked like. What's happened since then — what's the short version of the last three years?",
  },
  {
    num: "Q2",
    label: "What pulled you north",
    text: "At some point you got a call to go north to a northern Band — a fly-in community with no road access and a food situation most of your listeners would find hard to imagine. What was the ask, and what made you say yes?",
  },
  {
    num: "Q3",
    label: "Building the store — what it actually takes",
    text: "When you're building a community-owned store for a place that can only be reached by plane or winter road, what does the supply chain even look like? Walk us through it from the shelf backwards.",
  },
  {
    num: "Q4",
    label: "The margin for error",
    text: "Most small businesses can absorb a bad week. A fly-in community store can't. How do you design a store — the operations, the finances, the staffing — when the margin for failure is basically zero?",
  },
  {
    num: "Q5",
    label: "Codetry — what is it",
    text: "You've developed something called Codetry — a discipline for building community-owned systems. For a listener who's never heard that word, what is it, and why did you feel like the existing tools and frameworks weren't good enough for this kind of work?",
  },
  {
    num: "Q6",
    label: "Why naming matters",
    text: "A big part of Codetry is about names — specifically, the idea that the words a community uses to describe its own economy determine what that economy can become. That sounds almost philosophical. Can you give us a concrete example of where the wrong word caused a real problem?",
  },
  {
    num: "Q7",
    label: "The homestead connection",
    text: "You still run the homestead — the well, the garden, the jars. How does living that way on your own land keep you honest when you're sitting across the table from a band council, telling them how to run a store?",
  },
  {
    num: "Q8",
    label: "What the homestead teaches about community resilience",
    text: "Preppers and homesteaders think a lot about personal resilience — what happens when the grid goes down, when the supply chain breaks. You've been inside a community where that's not a thought experiment, it's Tuesday. What did it teach you about what self-reliance actually looks like at scale?",
  },
  {
    num: "Q9",
    label: "What listeners can do",
    text: "Say someone listening right now wants to help their community get more food-resilient — maybe it's a buying club, a small co-op, a neighbourhood pantry. What's the first move that actually matters?",
  },
  {
    num: "Q10",
    label: "Where to start without waiting for permission",
    text: "Your whole trajectory — the jars, the co-op, the store, Codetry — has been built without a government grant, without a corporate sponsor, without waiting for the system to say yes. What's the version of that lesson that a TSP listener can take home today?",
  },
];

function buildBioText(): string {
  return [
    "BIO",
    "",
    "Bobbie Parr lives and works in northwestern Ontario, where she and her husband run a homestead on land they didn't inherit — spring-fed well, manual pump, a garden built up year by year from clay. She started Parr's Jars as a way to turn the surplus into something that paid, and the co-op grew out of a hunch that the same discipline applied at the neighbourhood level. When she appeared on TSP in 2023, she called what she was doing \"irrational exuberance\" and \"decentralized initiatives\" — the kind of language that sounds almost like a joke until someone points out that you've been doing it for a decade and it's still standing.",
    "",
    "Since then, she got a call she didn't expect: a northern Band, reachable only by plane or winter road, needed help building a community-owned store from the ground up. No roads. No existing supply chain to borrow. A community that had been paying fly-in grocery prices for a generation. She went. The work that came out of it — the cold-chain plan, the co-op structure, the band financing model — became the founding work of Headwaters Development Services, the agency she runs today.",
    "",
    "Along the way she developed a discipline she calls Codetry — a method for building community-owned systems that stay legible to the people who have to run them, without importing someone else's assumptions along with the software. It's about naming things correctly, refusing to translate your words into someone else's framework, and handing back a system the community can own without a consultant in the room. The homestead is still running. The jars are still on the shelf. The work got bigger; the discipline got quieter.",
  ].join("\n");
}

function buildTopicText(): string {
  return [
    "TOPIC",
    "",
    "\"How to Build a Community-Owned Economy That Works Without the Grid, the Government, or a Consultant\"",
    "",
    "Note to Jack: This framing ties the northern Band store, the Dryden co-op, and the Codetry discipline into one headline a TSP listener can grab on to immediately — it's the self-reliance conversation, scaled up from the homestead to the community, with real numbers and real problems instead of theory.",
  ].join("\n");
}

function buildQuestionsText(): string {
  const questionLines = questions.map(
    (q) => `${q.num}. ${q.label}\n${q.text}`
  );
  return ["8-10 QUESTIONS TO BE ASKED", "", ...questionLines].join("\n\n");
}

function buildPlainText(): string {
  return [
    "THE SURVIVAL PODCAST — GUEST APPLICATION · FALL 2026",
    "Bobbie Parr — Second Appearance",
    "Homesteader, food-business builder, and the practitioner behind Headwaters Development Services and the Codetry discipline.",
    "",
    "---",
    "",
    buildBioText(),
    "",
    "---",
    "",
    buildTopicText(),
    "",
    "---",
    "",
    buildQuestionsText(),
    "",
    "---",
    "",
    "Bobbie Parr — Headwaters Development Services",
    "Northwestern Ontario · ourheadwaters.ca",
    "bobbie@ourheadwaters.ca",
  ].join("\n");
}

const sections = [
  { label: "Bio", getText: buildBioText },
  { label: "Topic", getText: buildTopicText },
  { label: "Questions", getText: buildQuestionsText },
  { label: "Full document", getText: buildPlainText },
];

export default function TspGuestForm() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="bobbie-parr-tsp-guest-form-fall-2026.pdf"
        pdfApiPath="/api/pdf/tsp-guest-form.pdf"
        onCopyPlainText={buildPlainText}
        sections={sections}
      />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: 0, overflow: "hidden", background: "var(--cream)", minHeight: "11in" }}
      >
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ background: "var(--evergreen)", padding: "0.42in 0.65in 0.32in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.1rem" }}>
              The Survival Podcast — Guest Application · Fall 2026
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.15rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.06, marginBottom: "0.1rem", letterSpacing: "-0.02em" }}>
              Bobbie Parr — Second Appearance
            </h1>
            <div style={{ width: "1.5in", height: 2, background: "var(--rust)", margin: "0.16rem 0 0.22rem" }} />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.84rem", fontStyle: "italic", color: "rgba(244,237,224,0.8)", lineHeight: 1.5, maxWidth: "5.5in" }}>
              Homesteader, food-business builder, and the practitioner behind Headwaters Development Services and the Codetry discipline.
            </p>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.3in 0.65in 0.25in", display: "flex", flexDirection: "column", gap: "0.22in" }}>

            {/* Bio */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.1rem" }}>
                Bio
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.73rem", color: "var(--ink)", lineHeight: 1.55 }}>
                Bobbie Parr lives and works in northwestern Ontario with her husband, who is the heart of their homestead —
                spring-fed well, manual pump, a garden built up from clay year by year. She's his helping hands. Between
                the two of them, the jars, the coop, and the seasons keep the drift away. She started Parr's Jars because
                the surplus needed somewhere to go. The co-op grew from a hunch that the same discipline applied at the
                neighbourhood level. Something she picked up from TSP — the practice of naming a word for the year — has
                become the throughline of how she works: spread, peace, stability, and now ROI.
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.73rem", color: "var(--ink)", lineHeight: 1.55, marginTop: "0.08in" }}>
                The northern Band store started as a thought experiment: a fly-in community, no road access, a generation
                of fly-in grocery prices. She never went north — what she had was a warm lead and a problem worth solving.
                What she discovered was that she finally had the tools to actually execute. Literate programming — writing
                code the way you'd explain it to a human — has been around since the 1980s, but the tools had finally
                caught up, and AI had opened the door for a whole new kind of person: the nerdy non-nerd, the creative.
                She got in. What came out of that experiment became Headwaters Development Services and a discipline she
                calls Codetry.
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.73rem", color: "var(--ink)", lineHeight: 1.55, marginTop: "0.08in" }}>
                Codetry treats naming as architecture. It's the hempcrete of community software — legible, structural,
                yours. The discipline grew partly from watching what happens when communities let their words drift: the
                grant board calls and suddenly your neighbour is speaking in KPIs and deliverables and you feel the moment
                the conversation stops belonging to you. She studied community development, minored in Aboriginal Studies —
                a phrase that now makes a certain kind of person flinch, which is exactly the point. When you're in our
                salt box, you use our words. 2026 is the year she stops explaining herself to people who won't understand
                and starts building ships for the people who are ready to crew them.
              </p>
            </section>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(31,61,46,0.14)" }} />

            {/* Topic */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.1rem" }}>
                Choose one topic:
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.3, marginBottom: "0.06rem" }}>
                "How to Build Systems Your Community Actually Owns — Before Someone Changes the Words Out From Under You"
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.5, fontStyle: "italic" }}>
                Note to Jack: TSP has no shows on literate programming — which is surprising, because it's essentially
                what TSP has been teaching people to do between their ears for years. Bobbie will make that case plainly
                and connect it to the self-reliance conversation your audience already knows. The Codetry discipline, the
                hempcrete naming framework, the co-op structure, the northern store thought experiment — it all threads
                back to the same thing: systems that stay legible to the people who have to run them, without a consultant
                in the room.
              </p>
            </section>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(31,61,46,0.14)" }} />

            {/* Questions */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.13rem" }}>
                8-10 questions to be asked
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.1in" }}>
                {questions.map((q) => (
                  <div key={q.num} style={{ display: "grid", gridTemplateColumns: "0.48in 1fr", gap: "0.1in", alignItems: "baseline" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 700, color: "var(--rust)", margin: 0 }}>
                        {q.num}
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", color: "var(--muted)", margin: 0, lineHeight: 1.35, fontStyle: "italic" }}>
                        {q.label}
                      </p>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.71rem", color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>
                      {q.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(31,61,46,0.14)" }} />

            {/* Resources */}
            <section>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.1rem" }}>
                Resources
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.06in 0.3in" }}>
                {[
                  { label: "Homestead & preserves", url: "parrsjars.ca" },
                  { label: "Headwaters Development Services", url: "ourheadwaters.ca" },
                  { label: "Codetry handbook & manifest", url: "ourheadwaters.ca/codetry-handbook/" },
                  { label: "Replit — $10 in credits", url: "replit.com/refer/xbucketsapp" },
                ].map(({ label, url }) => (
                  <div key={url} style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", color: "var(--muted)", margin: 0, lineHeight: 1.3 }}>{label}</p>
                    <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.62rem", color: "var(--evergreen)", margin: 0, lineHeight: 1.4 }}>{url}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <div style={{ marginTop: "auto", paddingTop: "0.12in", borderTop: "1px solid rgba(31,61,46,0.15)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.05rem" }}>
                  Bobbie Parr — Headwaters Development Services
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  Northwestern Ontario · ourheadwaters.ca
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  bobbie@ourheadwaters.ca
                </p>
              </div>
              <QRCodeStamp url="https://ourheadwaters.ca" size={48} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { ChevronDown, ChevronUp, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

interface FoundationalDoc {
  id: string;
  title: string;
  subtitle: string;
  version?: string;
  description: string;
  keyPoints: { label: string; detail: string }[];
  closingRule?: string;
}

const FOUNDATIONAL_DOCS: FoundationalDoc[] = [
  {
    id: "money-machine",
    title: "Community Money Machine Blueprint",
    subtitle: "Foundational Economic Architecture",
    version: "v4 · Anchored May 2026",
    description:
      "The economic engine underneath every Headwaters institution. Not a theory — a working description of how money flows through a community that has decided to stop leaking wealth outward and start owning its own ground. The machine has one job: take every dollar that enters and route it so the maximum amount stays inside the watershed before any exits to the extractive economy.",
    keyPoints: [
      {
        label: "Bucket 1 — Cost Basis",
        detail:
          "Pay the real cost of running the community's institutions — practitioners, infrastructure, operations. Never borrow against this bucket. If it runs dry, the machine stops before it borrows.",
      },
      {
        label: "Bucket 2 — Reserve",
        detail:
          "Three to six months of operating costs, held in hard, community-controlled assets. This bucket does not get touched until the machine has a confirmed income failure. It is not a slush fund.",
      },
      {
        label: "Bucket 3 — Reinvestment",
        detail:
          "New capacity, new infrastructure, new practitioners, and new institutions inside the watershed. Every dollar must produce a measurable ownership increase — not a program, not an event, not a report.",
      },
      {
        label: "Bucket 4 — Eave Flow",
        detail:
          "The surplus that overflows the first three buckets and flows outward — to allied watersheds, replication, and the seventh generation. This bucket does not activate until Buckets 1–3 are funded and the Reserve is full. Premature eave flow is a leak.",
      },
      {
        label: "The Honey Principle",
        detail:
          "A hive produces honey continuously. Most feeds the hive. The excess overflows the cells and drips down the comb — that overflow is the only honey the keeper harvests. Taking from inside the comb before it overflows kills the hive. Headwaters communities do not harvest before overflow.",
      },
      {
        label: "The Three Tests",
        detail:
          "Every dollar must pass: (1) Does it increase ownership or create dependency? (2) Does it strengthen the watershed or create a new leak? (3) Would it pass seven-generation scrutiny? If any answer is no, the dollar does not move that direction.",
      },
    ],
    closingRule:
      "The machine does not run on hope. It runs on structure. Stop the leak. Fill the buckets. Let the overflow reach the next watershed.",
  },
  {
    id: "watershed-compact",
    title: "Watershed Compact",
    subtitle: "Operating System & Decision Filter",
    description:
      "The full operating system for Headwaters community economy work. The compact defines the decision filter that governs every commitment, contract, and institutional move — the rules the community agrees to hold itself to before any external relationship is formed.",
    keyPoints: [
      {
        label: "The operating rule",
        detail:
          "The compact is the container every tool and artifact lives inside. It defines what the community is protecting, what it is building toward, and what it will not trade away.",
      },
      {
        label: "Decision filter",
        detail:
          "Every significant decision is run through the compact before it moves. If a proposed action cannot be located inside the compact's frame, the community pauses before proceeding.",
      },
    ],
  },
  {
    id: "stomping-path",
    title: "The Stomping Path",
    subtitle: "Practitioner Transformation Trail",
    description:
      "The transformation trail that brings practitioners to the machine. The stomping path is the sequence of moves that takes a community from extractive dependence to operating the money machine — the ordered process of reclamation and founding that precedes a machine that can run without watching.",
    keyPoints: [
      {
        label: "The sequence",
        detail:
          "The path names the stages a practitioner moves through — not a linear checklist, but a trail with known landmarks. Knowing which landmark you are at determines which tools belong in your hands.",
      },
      {
        label: "Founding vs. reclamation",
        detail:
          "The materials are the same. The order of operations is not. The stomping path reads the site before prescribing the mix.",
      },
    ],
  },
];

function FoundationalDocCard({ doc }: { doc: FoundationalDoc }) {
  const [open, setOpen] = useState(false);
  const [openPoint, setOpenPoint] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-4 min-h-[56px] text-left"
      >
        <div>
          <p className="text-sm font-medium">{doc.title}</p>
          <p className="text-xs text-[#78716C]">{doc.subtitle}{doc.version ? ` · ${doc.version}` : ""}</p>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="border-t border-[#E7E5E4] px-4 pt-3 pb-4 space-y-3">
          <p className="text-sm text-[#44403C] leading-relaxed">{doc.description}</p>

          {doc.keyPoints.length > 0 && (
            <div className="space-y-1">
              {doc.keyPoints.map((point, i) => (
                <div key={i} className="rounded-lg border border-[#E7E5E4] overflow-hidden">
                  <button
                    onClick={() => setOpenPoint(openPoint === i ? null : i)}
                    className="w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] text-left"
                  >
                    <span className="text-xs font-medium text-[#44403C]">{point.label}</span>
                    {openPoint === i ? <ChevronUp size={13} className="text-[#78716C]" /> : <ChevronDown size={13} className="text-[#78716C]" />}
                  </button>
                  {openPoint === i && (
                    <div className="px-3 pb-3 text-xs text-[#78716C] leading-relaxed border-t border-[#E7E5E4] pt-2">
                      {point.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {doc.closingRule && (
            <p className="text-xs text-[#8C7B6D] italic border-t border-[#E7E5E4] pt-3 leading-relaxed">
              {doc.closingRule}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface Chapter {
  id: string;
  title: string;
  sections: { id: string; title: string; content: string }[];
}

const CHAPTERS: Chapter[] = [
  {
    id: "zones",
    title: "The Zone Model",
    sections: [
      {
        id: "what",
        title: "What is a zone?",
        content: `A zone is a category of work — not a task list, not a project tracker, but a kind of commitment. Every project you run belongs to one of four zones:\n\n**Z1 — Household / Afloat**: Income-generating work. The floor. If Z1 collapses, everything else does too. Treat this zone as protected by default.\n\n**Z2 — Circle / Paid Contract**: Paid work with a deadline and a check attached. Z2 projects have external commitments — someone is counting on delivery. Guard this zone aggressively.\n\n**Z3 — Home Range / Build now**: Things you're building now for future value. Most passion projects live here. Z3 is productive and important, but it's also the zone that most easily crowded out the income zones.\n\n**Z4 — Community / Passion**: Volunteer, community, or pure creative work. No immediate return. Essential for soul, dangerous for cash flow if unchecked.`,
      },
      {
        id: "guardrails",
        title: "The guardrail logic",
        content: `Z1 and Z2 are protected zones. The app actively guards them from being crowded out by Z3/Z4 energy.\n\nThe guardrail fires when you pick a Z3 or Z4 constellation for the day while a Z2 contract still has hours remaining for the week. The app asks: "You have Xh left on [contract] this week. Still pick this?" You can always say yes — the friction is the point, not a hard block.\n\nThis is a decision prompt, not a judgment. Sometimes the right call is to step away from the contract and tend to something else. The guardrail just makes sure that's a conscious choice.`,
      },
      {
        id: "assign",
        title: "Assigning projects to zones",
        content: `The zone assignment is the most important decision in the system. Getting it wrong is common and correctable — just update the constellation's zone on the Zones page.\n\nAsk yourself:\n- Does this project have a paying client or invoice attached? → Z2 if contracted, Z1 if it's the income baseline.\n- Is this something I'm building now that I expect will generate income later? → Z3.\n- Is this community work, volunteer, or pure passion with no financial return? → Z4.\n\nThe zone model is load-bearing. The guardrail, the weekly review's zone hour chart, and the zone ranking all only make sense if the zone assignments are honest.`,
      },
    ],
  },
  {
    id: "constellations",
    title: "Constellations & Picks",
    sections: [
      {
        id: "what",
        title: "What is a constellation?",
        content: `A constellation is not a task. It's a living project — something you're building, tending, or maintaining. The daily pick is about attention, not completion.\n\nWhen you pick a constellation for the day, you're saying: "This gets a piece of me today." That might mean 30 minutes of deep focus, or an afternoon, or just keeping it in mind while you work on other things. The pick is the intention, not the schedule.`,
      },
      {
        id: "soft-cap",
        title: "The soft cap at 3",
        content: `Three constellations per day is a guardrail, not a hard limit. The soft cap exists because — for ADHD-inattentive brains especially — having too many open loops is the enemy of depth.\n\nWhen you try to pick a fourth, the app asks you to park one. That's a moment of honesty: if you're actually picking four things, you're probably not fully present with any of them.\n\nYou can bypass the cap. The point is that you do it consciously.`,
      },
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    sections: [
      {
        id: "weekly",
        title: "The weekly review",
        content: `Sunday or Monday — before the new week begins — is when you step back and look at what moved. The weekly review asks:\n\n1. What shipped? What got materially further?\n2. What stalled? What hit friction?\n3. Zone balance — how did you actually spend your hours vs. how you intended?\n4. Contract report — did you hit your weekly hour targets?\n5. What's the intention for next week?\n\nOne record per week. 52 records max (one year).`,
      },
      {
        id: "seasonal",
        title: "The seasonal review",
        content: `Bigger picture. The seasonal review asks what changed this season — in your work, your zones, your statement. Seasons are winter/spring/summer/fall.\n\nThis is where you update your north star statement if the statement no longer fits. It's also where you notice if a zone has been chronically under- or over-served.\n\nOne record per season. 24 records max (six years).`,
      },
    ],
  },
  {
    id: "statement",
    title: "The North Star Statement",
    sections: [
      {
        id: "what",
        title: "What is the statement?",
        content: `Three sentences:\n\n**Who**: Who is this work for? Not "everyone" — a specific kind of person.\n\n**Why**: So that what shifts for them? The underlying change you're trying to create.\n\n**No-fly**: What you will politely decline — even when the offer looks good.\n\nThe statement is the filter. When someone offers you a contract or asks for help, you run it through the statement. If it doesn't serve the Who, doesn't create the Why, or crosses the no-fly line — you have a decision anchor.`,
      },
      {
        id: "update",
        title: "Updating the statement",
        content: `The statement evolves. It's not a constitution — it's a compass. Update it in Settings, or during a seasonal review when you feel it drift.\n\nA good cadence: review the statement every season. Ask: does this still describe who I'm serving and why? If not, update it. If it still fits but you've been ignoring it, that's information too.`,
      },
    ],
  },
  {
    id: "codetry-in-practice",
    title: "Codetry in Practice",
    sections: [
      {
        id: "building-materials",
        title: "The building materials",
        content: `Building a community economy is a construction project. These are the named materials.\n\n**Hempcrete** — Codetry itself. The binder. Lightweight, breathable, and carbon-negative — it keeps strengthening after it sets. Hempcrete holds the wall without being the wall. Without a frame to press against, it has nothing to do.\n\n**The frame** — the structural skeleton the hempcrete fills around. The frame is the existing relationships, commitments, and structures you're building inside or alongside. Without a frame, there is no wall — just a pile of good material.\n\n**The foundation** — Zone 0: ethos, honest capacity, and trust map. Not a document. An accumulated practice. You cannot retroactively pour the foundation. It is either there or it is not, and no amount of planning language fills the gap.\n\n**Windows** — intentional openings. Sized and placed deliberately. They face outward from surplus, never inward toward interior labour. You don't cut windows until the wall has cured.`,
      },
      {
        id: "gate-and-giraffe",
        title: "The fence post gate and the giraffe",
        content: `Two figures for the regulatory side of community building.\n\n**The fence post gate** — the specific regulatory hinge. The health unit. The band council resolution. The cooperative registration. Not the whole apparatus — the specific mechanism the apparatus walks through if you give it a reason.\n\n**The giraffe** — the regulatory apparatus itself. Long-necked by design — it can see over the fence from the road. It cannot enter unless you cross the trigger threshold. A giraffe is not the enemy. It is a known animal with known habits. You can design a yard it has no reason to enter.`,
      },
      {
        id: "mixing-process",
        title: "Mixing the foundation",
        content: `Before you build anything for a market, there is a four-question mix to run. Skipping any one produces a wall that looks finished and isn't.\n\n**Hurd audit** — what capacity is genuinely available after existing commitments are honoured first. Not the pitch version. The real version.\n\n**Ethos line** — what would make growth not worth it. Where is the floor you would walk away over. If you don't name this before you build, someone else's growth pressure names it for you.\n\n**Pressure question** — what makes now the moment. What necessity makes action real rather than aspirational. An idea without pressure is a plan. A plan with pressure is a project.\n\n**Shape of the wall** — what are you enclosing. What stays inside, what gets traded. The exterior is not designed for the exterior's benefit. It is designed for the ability to stay in the kitchen.`,
      },
      {
        id: "two-modes",
        title: "Two modes — founding and reclamation",
        content: `The materials are the same. The order of operations is not.\n\n**Founding mode** — building from personal sovereignty with Codetry from the first pour. Hempcrete from day one. Generationally durable. The house gets stronger while you live in it. What you build this way, you can hand to someone else without explaining what it secretly is.\n\n**Reclamation mode** — board-by-board sovereignty recovery within a house someone else built. You cannot demolish while a thousand people are living inside. Each replaced board must carry the weight of the ones around it while the old ones come out. The goal is a house that is yours. The path is repair, not demolition.\n\nMost people arriving are in reclamation mode. That is not a lesser version. It is harder, it carries more scar tissue, and it produces a house that is genuinely yours by the time you are done — because you have replaced every board that needed replacing and left standing every board that could carry weight.\n\nA founding-mode toolkit handed to a reclamation-mode practitioner produces paralysis or destruction. A reclamation-mode toolkit handed to a founder produces timidity. Read the site before you mix.`,
      },
      {
        id: "window-placement",
        title: "The window placement rule",
        content: `Windows face outward from surplus — not inward toward the foundation.\n\nThe exterior — the sandbox, the trampoline, the public-facing offer — is designed for one purpose: the ability to stay in the kitchen. A well-designed outside is what lets the interior work happen.\n\nSetup is the work that earns the right to stop watching. A steward who is always at the window is a steward whose interior isn't set up yet.`,
      },
    ],
  },
  {
    id: "the-on-ramp",
    title: "The On-Ramp",
    sections: [
      {
        id: "who-this-is-for",
        title: "Who this is for",
        content: `Zone 0 is not an abstract unit. It is the mechanic, the plumber, the electrician, the homesteader. The husband and wife who have been carrying the household on their backs for years.\n\nThe headwaters people — the ones who have held the water from the source, who are tired, and who are looking for something to hand off or bring others into.\n\nThey do not need explaining. They need a plan they can stray from. Nobody interjecting while they work. The outside world handled so their hands stay free.\n\nThe tradespeople angle is not decorative. A builder who works with hempcrete reads this and recognizes that the metaphor is not borrowed — it is load-bearing. A nice-looking wall without the maintenance overhead of drywall is a real argument for a real material. The person who knows how to mix mortar already understands the difference between binder and structure. You are not teaching them a metaphor. You are translating a practice they already know into a new site.`,
      },
      {
        id: "grindstone-and-oil",
        title: "The grindstone and the oil",
        content: `There are two roles in the household engine.\n\n**The grindstone person** — hands full, eyes on the material, on the ground. The mechanic, the builder, the one doing the physical thing. Needs the outside world handled so they can stay in contact with the work.\n\n**The oil** — the person handling the outside world. Running the scraps to the dump. Talking to suppliers, regulators, neighbours. Representing the interior to anyone who needs to know it exists. Without them, the grindstone seizes. Without the grindstone, they have nothing to represent.\n\nThat engine does not grind without the oil.\n\nThis is not a hierarchy. It is a named division of labour. The naming is the point — it stops being invisible when you name it. Invisible labour is the primary source of resentment in Zone 0 households, not the labour itself.\n\nThe most valuable thing you can hand the next generation is a working example of two people who figured out the division without one of them disappearing. That is the inheritance. Not the house, not the money — the pattern.`,
      },
      {
        id: "step-1-frame",
        title: "Step 1 — Lay the frame",
        content: `Before any hempcrete goes in, the frame has to stand on its own.\n\nIn the house: the structural skeleton that defines the interior spaces. In Codetry: the household unit — what is inside, who is inside, what the walls protect.\n\nThis is the step most people skip. They want to fill the wall before the frame is plumb. Write down what you are enclosing. Name the household. Name what stays inside it.\n\nThe frame does not need to be finished to be started. Two posts and a beam is a frame. You can add to it.`,
      },
      {
        id: "step-2-hempcrete",
        title: "Step 2 — Fill with hempcrete",
        content: `Hempcrete is not a structural material — the frame does that. Hempcrete is the binder. It fills, insulates, regulates. It holds the wall without being the wall.\n\nIn Codetry that binder is the practice itself: the vocabulary, the naming discipline, the zone model. It fills the spaces the frame defines. It breathes. It does not crack under settling the way concrete does.\n\nYou do not pour all at once. You fill in lifts — a foot at a time, tamped, left to set before the next. Rushing it produces a weak wall. The pace is the point.\n\nA hempcrete wall is a nice-looking wall. No maintenance overhead of drywall — no scuffs, no repainting every few years, no paper face that dents when someone bumps it. The material argument and the framework argument are the same argument.`,
      },
      {
        id: "step-3-windows",
        title: "Step 3 — Frame the windows",
        content: `A window is an intentional opening. You decide where light comes in and where the outside world can see.\n\nIn the house: placement is a design decision, not an accident. In Codetry: which zone boundaries are permeable, and by how much.\n\nThe household steward is the interior architect. That is the person who knows what the rooms are for, who moves between them, and where the windows should go.\n\nWindows face outward. The interior stays yours. Nobody reaches through a window and rearranges the furniture.\n\nDon't cut windows until the wall has cured. A window cut too early weakens the wall before it has set.`,
      },
      {
        id: "step-4-gate",
        title: "Step 4 — Hang the gate",
        content: `The gate is the regulatory hinge — the point where inside meets outside on your terms. The fence post it hangs on is the boundary. The gate is not locked; it opens and closes.\n\nIn Codetry this is the Eave: the hard privacy boundary between the household interior and the organizational world above. The gate controls what crosses.\n\nHang the gate before you invite anyone in. A fence without a gate is just a barrier. A gate without a fence is decoration.\n\nKnow where your gate is before you scale.`,
      },
      {
        id: "stray-from-the-plan",
        title: "You are allowed to stray",
        content: `A build sequence is a starting frame, not a contract. Real walls meet real conditions. The hempcrete mix changes with the humidity. The frame settles. You adapt.\n\nThe sequence exists so you know what you skipped and can go back. That is all. It is not a grading system.\n\nNo one is interjecting while you work. Do the next thing. The plan will still be here.`,
      },
    ],
  },
];

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const guideState = useStore((s) => s.guide);
  const setGuideProgress = useStore((s) => s.setGuideProgress);
  const setGuideBookmark = useStore((s) => s.setGuideBookmark);
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const isBookmarked = guideState.bookmarkChapterId === chapter.id;
  const lastSection = guideState.lastSectionByChapter[chapter.id];

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-4 min-h-[56px] text-left"
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium">{chapter.title}</p>
            {lastSection && (
              <p className="text-xs text-[#78716C]">
                Last read: {chapter.sections.find((s) => s.id === lastSection)?.title}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGuideBookmark(isBookmarked ? "" : chapter.id);
            }}
            className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isBookmarked ? <BookmarkCheck size={16} className="text-[#4F6E5C]" /> : <Bookmark size={16} className="text-[#78716C]" />}
          </button>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-[#E7E5E4] divide-y divide-[#E7E5E4]">
          {chapter.sections.map((s) => (
            <div key={s.id}>
              <button
                onClick={() => {
                  setOpenSection(openSection === s.id ? null : s.id);
                  setGuideProgress(chapter.id, s.id);
                }}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-left"
              >
                <span className={cn("text-sm", lastSection === s.id ? "font-medium" : "")}>{s.title}</span>
                {openSection === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSection === s.id && (
                <div className="px-4 pb-4 text-sm text-[#44403C] leading-relaxed whitespace-pre-line">
                  {s.content.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GuidePage() {
  const statement = useStore((s) => s.statement);

  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="text-2xl mb-1">Guide</h1>
          <p className="text-sm text-[#78716C]">The Codetry zone model — what it is and how to use it.</p>
        </div>

        {statement && (
          <div className="bg-[#F5F5F0] rounded-xl p-4 space-y-1">
            <p className="text-xs text-[#78716C] uppercase tracking-wider mb-2">Your north star</p>
            {statement.who && <p className="text-sm text-[#44403C]"><span className="font-medium">For</span> {statement.who}</p>}
            {statement.why && <p className="text-sm text-[#44403C]"><span className="font-medium">So that</span> {statement.why}</p>}
            {statement.noFly && <p className="text-sm text-[#78716C] italic"><span className="font-medium not-italic">No-fly:</span> {statement.noFly}</p>}
          </div>
        )}

        <a
          href="/codetry-handbook/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-white rounded-xl border border-[#E7E5E4] px-4 py-3 min-h-[56px]"
        >
          <div>
            <p className="text-sm font-medium">Codetry Handbook</p>
            <p className="text-xs text-[#78716C]">How a community runs its own economy</p>
          </div>
          <ExternalLink size={16} className="text-[#78716C]" />
        </a>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#78716C] uppercase tracking-wider font-medium mb-2 px-1">
              Foundational Architecture
            </p>
            <div className="space-y-2">
              {FOUNDATIONAL_DOCS.map((doc) => (
                <FoundationalDocCard key={doc.id} doc={doc} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[#78716C] uppercase tracking-wider font-medium mb-2 px-1">
              Zone Model & Practice
            </p>
            <div className="space-y-3">
              {CHAPTERS.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

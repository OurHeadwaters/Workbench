import { useState } from "react";
import { ChevronDown, ChevronUp, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

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
        content: `The same tools apply differently depending on which situation you're building in. Handing the wrong kit to the wrong mode is the most common mistake in community economy work.\n\n**Founding mode** — building from personal sovereignty with Codetry from the first pour. Hempcrete from day one. Generationally durable. The house gets stronger while you live in it.\n\n**Reclamation mode** — board-by-board sovereignty recovery within a house someone else built. You cannot demolish while a thousand people are living inside. Each replaced board must carry the weight of the ones around it while the old ones come out. The goal is a house that is yours. The path is repair, not demolition.\n\nA founding-mode toolkit handed to a reclamation-mode practitioner produces paralysis or destruction. A reclamation-mode toolkit handed to a founder produces timidity. Read the site before you mix.`,
      },
      {
        id: "window-placement",
        title: "The window placement rule",
        content: `Windows face outward from surplus — not inward toward the foundation.\n\nThe exterior — the sandbox, the trampoline, the public-facing offer — is designed for one purpose: the ability to stay in the kitchen. A well-designed outside is what lets the interior work happen.\n\nSetup is the work that earns the right to stop watching. A steward who is always at the window is a steward whose interior isn't set up yet.`,
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
          {CHAPTERS.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { usePile } from "@/lib/useStore";
import { WordpileStore } from "@/lib/store";
import { STANDING_THRESHOLD } from "@/lib/buildBehavior";
import type { Bucket, WordEntry } from "@/data/types";
import { StackerPrototype } from "@/components/build/StackerPrototype";
import { BlockBuilderPrototype } from "@/components/build/BlockBuilderPrototype";
import { FallingPlanksPrototype } from "@/components/build/FallingPlanksPrototype";
import { FileUnsortedPrompt } from "@/components/build/FileUnsortedPrompt";

type Variant = "stacker" | "blocks" | "planks";

const VARIANT_LABELS: Record<Variant, string> = {
  stacker: "Stacker",
  blocks: "Block builder",
  planks: "Falling planks",
};

const VARIANT_BLURBS: Record<Variant, string> = {
  stacker: "Drag word-timbers onto a frame.",
  blocks: "Snap word-blocks onto a baseplate.",
  planks: "Steer word-planks as they fall.",
};

interface VoteRecord {
  stacker: number;
  blocks: number;
  planks: number;
  lastChoice?: Variant;
}

const EMPTY_VOTES: VoteRecord = { stacker: 0, blocks: 0, planks: 0 };

const voteKeyFor = (pileId: string) => `wordpile:build-vote:${pileId}`;

function readVotes(pileId: string): VoteRecord {
  if (typeof window === "undefined") return EMPTY_VOTES;
  try {
    const raw = window.localStorage.getItem(voteKeyFor(pileId));
    if (!raw) return EMPTY_VOTES;
    const parsed = JSON.parse(raw) as Partial<VoteRecord>;
    return {
      stacker: typeof parsed.stacker === "number" ? parsed.stacker : 0,
      blocks: typeof parsed.blocks === "number" ? parsed.blocks : 0,
      planks: typeof parsed.planks === "number" ? parsed.planks : 0,
      lastChoice: parsed.lastChoice,
    };
  } catch {
    return EMPTY_VOTES;
  }
}

function writeVotes(pileId: string, votes: VoteRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(voteKeyFor(pileId), JSON.stringify(votes));
}

/**
 * Verdict surfaced after an Unsorted word gets placed in any prototype.
 * The page shows a small prompt offering to file the word into a real
 * bucket; the action goes through the existing store so it cloud-syncs.
 */
export interface UnsortedVerdict {
  wordId: string;
  word: string;
  /** What the prototype made this word act like (so we can suggest one). */
  suggested: Bucket;
}

export function BuildPage() {
  const params = useParams<{ pileId: string }>();
  const pile = usePile(params.pileId);
  const [, navigate] = useLocation();
  const [variant, setVariant] = useState<Variant>("stacker");
  const [resetKey, setResetKey] = useState(0);
  const [pendingVerdict, setPendingVerdict] = useState<UnsortedVerdict | null>(
    null,
  );
  const [votes, setVotes] = useState<VoteRecord>(EMPTY_VOTES);
  const [structuralCount, setStructuralCount] = useState(0);

  // Hydrate votes once we know the pile id.
  useEffect(() => {
    if (!params.pileId) return;
    setVotes(readVotes(params.pileId));
  }, [params.pileId]);

  // Reset structural count and any open prompt whenever the variant or
  // the manual Reset button changes — each prototype starts fresh.
  useEffect(() => {
    setStructuralCount(0);
    setPendingVerdict(null);
  }, [variant, resetKey]);

  const words: WordEntry[] = useMemo(() => {
    if (!pile) return [];
    // Filter out the empty word strings the importer may have left behind
    // and stable-sort by bucket then alphabetical so the tray reads the
    // same way every time the page loads.
    const order: Record<Bucket, number> = {
      load: 0,
      interior: 1,
      unsorted: 2,
      avoid: 3,
    };
    return [...pile.words]
      .filter((w) => w.word.trim() !== "")
      .sort((a, b) => {
        const bd = order[a.bucket] - order[b.bucket];
        if (bd !== 0) return bd;
        return a.word.localeCompare(b.word);
      });
  }, [pile]);

  if (!pile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="eyebrow mb-3">Wordpile</p>
        <h1 className="text-3xl mb-4">That community pile isn't here.</h1>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Back to piles
        </button>
      </div>
    );
  }

  const standing = structuralCount >= STANDING_THRESHOLD;

  function handleVote(choice: Variant) {
    if (!params.pileId) return;
    const next: VoteRecord = {
      ...votes,
      [choice]: votes[choice] + 1,
      lastChoice: choice,
    };
    setVotes(next);
    writeVotes(params.pileId, next);
  }

  function fileUnsorted(bucket: Bucket) {
    if (!pendingVerdict || !pile) return;
    WordpileStore.moveWord(pile.id, pendingVerdict.wordId, bucket);
    setPendingVerdict(null);
  }

  const sharedProps = {
    pileId: pile.id,
    words,
    resetKey,
    onStructuralCountChange: setStructuralCount,
    onUnsortedPlaced: setPendingVerdict,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-baseline gap-3 mb-2">
        <Link
          href={`/pile/${pile.id}`}
          className="link"
          data-testid="link-back-to-pile-from-build"
        >
          <ArrowLeft size={11} style={{ display: "inline", marginRight: 4 }} />
          Back to {pile.name}
        </Link>
      </div>
      <p className="eyebrow mb-2">Build with {pile.name}'s timbers</p>
      <h1
        className="text-4xl mb-2"
        style={{ fontWeight: 600, lineHeight: 1.05 }}
      >
        Build something that stands.
      </h1>
      <p
        className="mb-6 text-lg leading-relaxed"
        style={{ color: "var(--color-stone)", maxWidth: 720 }}
      >
        Every word in the pile is a 2x4. Load-bearing timbers hold weight,
        Interior trim sits on top, and Avoid words crack on contact. Try all
        three little games — pick the one that feels best.
      </p>

      <div className="build-toolbar" data-testid="build-toolbar">
        <div className="build-switcher" role="tablist" aria-label="Prototype">
          {(Object.keys(VARIANT_LABELS) as Variant[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={variant === v}
              className={`build-switcher-btn ${variant === v ? "is-active" : ""}`}
              onClick={() => setVariant(v)}
              data-testid={`button-variant-${v}`}
            >
              <span className="build-switcher-name">{VARIANT_LABELS[v]}</span>
              <span className="build-switcher-blurb">{VARIANT_BLURBS[v]}</span>
            </button>
          ))}
        </div>
        <div className="build-goal">
          <p className="eyebrow">Goal</p>
          <p>
            Build something that stands.{" "}
            <span
              className={standing ? "build-standing-yes" : "build-standing-no"}
              data-testid="text-standing-status"
            >
              {standing ? "Standing" : "Not yet"}
            </span>
            <span className="ml-2" style={{ color: "var(--color-stone)" }}>
              · {structuralCount} of {STANDING_THRESHOLD} load-bearing timbers
              in place
            </span>
          </p>
        </div>
        <button
          className="btn-secondary whitespace-nowrap"
          onClick={() => setResetKey((k) => k + 1)}
          data-testid="button-build-reset"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {words.length === 0 ? (
        <div
          className="rounded p-8 my-8 text-center"
          style={{
            backgroundColor: "var(--color-paper)",
            border: "1px dashed var(--color-sand)",
          }}
          data-testid="text-build-empty"
        >
          <p style={{ color: "var(--color-stone)" }}>
            This pile is empty — open it and add some words first, then come
            back to build with them.
          </p>
        </div>
      ) : (
        <div className="build-stage" data-testid={`stage-${variant}`}>
          {variant === "stacker" && <StackerPrototype {...sharedProps} />}
          {variant === "blocks" && <BlockBuilderPrototype {...sharedProps} />}
          {variant === "planks" && <FallingPlanksPrototype {...sharedProps} />}
        </div>
      )}

      {pendingVerdict && (
        <FileUnsortedPrompt
          verdict={pendingVerdict}
          onFile={fileUnsorted}
          onDismiss={() => setPendingVerdict(null)}
        />
      )}

      <hr className="divider" />

      <section
        className="rounded p-5"
        style={{
          backgroundColor: "var(--color-paper)",
          border: "1px solid var(--color-rule)",
        }}
        data-testid="section-vote"
      >
        <p className="eyebrow mb-2">Which one did you like?</p>
        <p
          className="text-sm mb-4"
          style={{ color: "var(--color-stone)" }}
        >
          Tap a button to cast a vote. Votes are saved on this device so we can
          see what you picked next time.
        </p>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(VARIANT_LABELS) as Variant[]).map((v) => (
            <button
              key={v}
              className={`btn-vote ${votes.lastChoice === v ? "is-chosen" : ""}`}
              onClick={() => handleVote(v)}
              data-testid={`button-vote-${v}`}
            >
              <span className="btn-vote-name">{VARIANT_LABELS[v]}</span>
              <span className="btn-vote-count">
                {votes[v]} vote{votes[v] === 1 ? "" : "s"}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

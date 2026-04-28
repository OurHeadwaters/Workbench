import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  HelpCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { usePile } from "@/lib/useStore";
import { WordpileStore } from "@/lib/store";
import { STANDING_THRESHOLD } from "@/lib/buildBehavior";
import type { Bucket, WordEntry } from "@/data/types";
import {
  StackerPrototype,
  type RunState,
  type StackerSnapshotHandle,
} from "@/components/build/StackerPrototype";
import { FileUnsortedPrompt } from "@/components/build/FileUnsortedPrompt";
import {
  isBuildAudioMuted,
  setBuildAudioMuted,
} from "@/lib/buildAudio";
import {
  archiveBuildVotes,
  hasMigratedBuildVotes,
  mergeRunIntoStats,
  readArchivedVotesForPile,
  readStats,
  writeStats,
  type ArchivedPileVotes,
  type BuildStats,
  EMPTY_STATS,
} from "@/lib/buildStats";
import { downloadShareImage } from "@/lib/buildShare";

/**
 * Verdict surfaced after an Unsorted word gets placed in the prototype.
 * The page shows a small prompt offering to file the word into a real
 * bucket; the action goes through the existing store so it cloud-syncs.
 */
export interface UnsortedVerdict {
  wordId: string;
  word: string;
  /** What the prototype made this word act like (so we can suggest one). */
  suggested: Bucket;
}

const ONBOARD_KEY = "wordpile:build-onboard:v1";
const ARCHIVE_NOTE_DISMISSED_PREFIX =
  "wordpile:build-archive-note-dismissed:v1:";
const EMPTY_RUN: RunState = {
  framePlaced: 0,
  trimPlaced: 0,
  cracks: 0,
  standing: false,
};

// One-time vote-archive migration on first load. Hoisted out of the
// component so HMR / re-renders don't re-trigger the work — the helper is
// idempotent on its own, but skipping the function call avoids a noisy
// localStorage scan every render.
let voteMigrationDone = false;
function ensureVoteMigration() {
  if (voteMigrationDone) return;
  voteMigrationDone = true;
  archiveBuildVotes();
}

export function BuildPage() {
  const params = useParams<{ pileId: string }>();
  const pile = usePile(params.pileId);
  const [, navigate] = useLocation();
  const [resetKey, setResetKey] = useState(0);
  const [pendingVerdict, setPendingVerdict] = useState<UnsortedVerdict | null>(
    null,
  );
  const [structuralCount, setStructuralCount] = useState(0);
  const [run, setRun] = useState<RunState>(EMPTY_RUN);
  const [stats, setStats] = useState<BuildStats>(EMPTY_STATS);
  const [muted, setMutedState] = useState<boolean>(() => isBuildAudioMuted());
  const [showOnboard, setShowOnboard] = useState(false);
  const [justStood, setJustStood] = useState(false);
  const [archivedVotes, setArchivedVotes] = useState<ArchivedPileVotes | null>(
    null,
  );
  const [showArchiveNote, setShowArchiveNote] = useState(false);
  const stackerRef = useRef<StackerSnapshotHandle>(null);
  const lastSavedStatsRef = useRef<BuildStats>(EMPTY_STATS);

  // One-time vote archival.
  useEffect(() => {
    ensureVoteMigration();
  }, []);

  // After the migration runs, surface a one-time, dismissible note about
  // the prototype selection — but only for piles that actually had archived
  // votes. We require both the migration flag and the archive payload (per
  // the task spec) so the note can never appear before the migration that
  // produced the archive has run. The dismiss flag is per-pile so each
  // community gets its own first-visit acknowledgement.
  useEffect(() => {
    if (!params.pileId) {
      setArchivedVotes(null);
      setShowArchiveNote(false);
      return;
    }
    if (!hasMigratedBuildVotes()) {
      setArchivedVotes(null);
      setShowArchiveNote(false);
      return;
    }
    const archived = readArchivedVotesForPile(params.pileId);
    setArchivedVotes(archived);
    if (!archived) {
      setShowArchiveNote(false);
      return;
    }
    if (typeof window === "undefined") return;
    try {
      const dismissed =
        window.localStorage.getItem(
          `${ARCHIVE_NOTE_DISMISSED_PREFIX}${params.pileId}`,
        ) === "1";
      setShowArchiveNote(!dismissed);
    } catch {
      setShowArchiveNote(true);
    }
  }, [params.pileId]);

  // Hydrate stats once we know the pile id.
  useEffect(() => {
    if (!params.pileId) return;
    const next = readStats(params.pileId);
    setStats(next);
    lastSavedStatsRef.current = next;
  }, [params.pileId]);

  // First-visit onboarding: show the welcome card unless the user has
  // already dismissed it. Persisted in localStorage so it doesn't repeat.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(ONBOARD_KEY) !== "seen") {
        setShowOnboard(true);
      }
    } catch {
      // Ignore.
    }
  }, []);

  // Reset structural count and any open prompt whenever the manual Reset
  // button changes — the prototype starts fresh each run.
  useEffect(() => {
    setStructuralCount(0);
    setPendingVerdict(null);
    setRun(EMPTY_RUN);
    setJustStood(false);
  }, [resetKey]);

  const words: WordEntry[] = useMemo(() => {
    if (!pile) return [];
    // Filter out empty word strings the importer may have left behind and
    // stable-sort by bucket then alphabetical so the tray reads the same way
    // every time the page loads.
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

  // Persist run highs into the lifetime stats. The "lastSaved" ref is the
  // baseline we compare against — at the start of every run it's the
  // current lifetime totals; per-run counts get added on top of it. The
  // pure mergeRunIntoStats helper encodes the exact semantics (see its
  // doc comment) and is unit-tested across the multi-reset lifecycle.
  useEffect(() => {
    if (!params.pileId) return;
    const next = mergeRunIntoStats(lastSavedStatsRef.current, run);

    if (
      next.runs === stats.runs &&
      next.bestPlaced === stats.bestPlaced &&
      next.bestFrame === stats.bestFrame &&
      next.crackCount === stats.crackCount &&
      next.everStood === stats.everStood
    ) {
      return;
    }

    setStats(next);
    writeStats(params.pileId, next);
  }, [run, params.pileId, stats]);

  const handleReset = useCallback(() => {
    // Reset locks the current run's totals into the lifetime baseline so
    // the next run starts counting from there.
    lastSavedStatsRef.current = { ...stats };
    setResetKey((k) => k + 1);
  }, [stats]);

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

  function fileUnsorted(bucket: Bucket) {
    if (!pendingVerdict || !pile) return;
    WordpileStore.moveWord(pile.id, pendingVerdict.wordId, bucket);
    setPendingVerdict(null);
  }

  function toggleMute() {
    const next = !muted;
    setMutedState(next);
    setBuildAudioMuted(next);
  }

  function dismissArchiveNote() {
    setShowArchiveNote(false);
    if (!params.pileId || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        `${ARCHIVE_NOTE_DISMISSED_PREFIX}${params.pileId}`,
        "1",
      );
    } catch {
      // Ignore — quota / privacy mode.
    }
  }

  function reopenArchiveNote() {
    setShowArchiveNote(true);
  }

  function dismissOnboard() {
    setShowOnboard(false);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(ONBOARD_KEY, "seen");
      } catch {
        // Ignore — quota / privacy mode.
      }
    }
  }

  function handleShare() {
    if (!stackerRef.current) return;
    const snap = stackerRef.current.getSnapshot();
    downloadShareImage({
      pileName: pile?.name ?? "Wordpile",
      frame: snap.frame,
      trim: snap.trim,
      standing,
    });
  }

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
        Every word in the pile is a 2x4. Drag Load-bearing words into the frame,
        Interior trim onto the top, and watch Avoid words crack on contact.
        Reach {STANDING_THRESHOLD} load-bearing timbers and the building stands.
      </p>

      <div className="build-toolbar build-toolbar-polished" data-testid="build-toolbar">
        <div className="build-goal">
          <p className="eyebrow">Goal</p>
          <p>
            Build something that stands.{" "}
            <span
              className={standing ? "build-standing-yes" : "build-standing-no"}
              data-testid="text-standing-status"
            >
              {standing ? (
                <CheckCircle2
                  size={14}
                  aria-hidden="true"
                  style={{
                    display: "inline",
                    verticalAlign: "-2px",
                    marginRight: 4,
                  }}
                />
              ) : (
                <Circle
                  size={14}
                  aria-hidden="true"
                  style={{
                    display: "inline",
                    verticalAlign: "-2px",
                    marginRight: 4,
                  }}
                />
              )}
              {standing ? "Standing" : "Not yet"}
            </span>
            <span className="ml-2" style={{ color: "var(--color-stone)" }}>
              · {structuralCount} of {STANDING_THRESHOLD} load-bearing timbers
              in place
            </span>
          </p>
          {/* Polite live region — only announces when the building flips
              into the "standing" state. Empty content the rest of the
              time so screen readers stay quiet. */}
          <span
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-testid="text-standing-live"
          >
            {standing ? "It stands." : ""}
          </span>
        </div>
        <div className="build-controls">
          <button
            type="button"
            className="btn-icon"
            onClick={toggleMute}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            aria-pressed={muted}
            title={muted ? "Sound off" : "Sound on"}
            data-testid="button-build-mute"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setShowOnboard(true)}
            aria-label="How to play"
            title="How to play"
            data-testid="button-build-help"
          >
            <HelpCircle size={16} />
          </button>
          {archivedVotes && (
            <button
              type="button"
              className="build-about-link"
              onClick={reopenArchiveNote}
              data-testid="button-build-about"
              title="About this build"
            >
              About this build
            </button>
          )}
          <button
            type="button"
            className="btn-secondary whitespace-nowrap"
            onClick={handleShare}
            disabled={run.framePlaced + run.trimPlaced === 0}
            data-testid="button-build-share"
            title="Save a picture of your build"
          >
            <Download size={14} /> Save image
          </button>
          <button
            className="btn-secondary whitespace-nowrap"
            onClick={handleReset}
            data-testid="button-build-reset"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {showArchiveNote && archivedVotes && (
        <ArchiveNote
          votes={archivedVotes}
          onDismiss={dismissArchiveNote}
        />
      )}

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
        <div className="build-stage" data-testid="stage-stacker">
          <StackerPrototype
            ref={stackerRef}
            pileId={pile.id}
            words={words}
            resetKey={resetKey}
            onStructuralCountChange={setStructuralCount}
            onUnsortedPlaced={setPendingVerdict}
            onRunUpdate={setRun}
            onJustStood={() => setJustStood(true)}
          />
        </div>
      )}

      {pendingVerdict && (
        <FileUnsortedPrompt
          verdict={pendingVerdict}
          onFile={fileUnsorted}
          onDismiss={() => setPendingVerdict(null)}
        />
      )}

      {justStood && (
        <div
          className="build-celebrate"
          role="status"
          data-testid="banner-celebrate"
        >
          <span className="timber">It stands.</span>{" "}
          <span style={{ color: "var(--color-cream)", opacity: 0.9 }}>
            Save the picture or keep going.
          </span>
          <button
            className="build-celebrate-dismiss"
            onClick={() => setJustStood(false)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <hr className="divider" />

      <section
        className="build-stats"
        data-testid="section-build-stats"
        aria-label="Build stats"
      >
        <p className="eyebrow mb-2">This pile's workshop log</p>
        <div className="build-stats-grid">
          <Stat label="Runs played" value={stats.runs} />
          <Stat label="Best frame" value={`${stats.bestFrame} / ${STANDING_THRESHOLD}`} />
          <Stat label="Most pieces placed" value={stats.bestPlaced} />
          <Stat label="Avoid words cracked" value={stats.crackCount} />
          <Stat
            label="Ever stood?"
            value={stats.everStood ? "Yes" : "Not yet"}
            highlight={stats.everStood}
          />
        </div>
      </section>

      {showOnboard && (
        <OnboardCard onClose={dismissOnboard} pileName={pile.name} />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`build-stat ${highlight ? "is-highlight" : ""}`}
      data-testid={`stat-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
    >
      <span className="build-stat-label">{label}</span>
      <span className="build-stat-value">{value}</span>
    </div>
  );
}

function ArchiveNote({
  votes,
  onDismiss,
}: {
  votes: ArchivedPileVotes;
  onDismiss: () => void;
}) {
  const total = votes.stacker + votes.blocks + votes.planks;
  const retiredTotal = votes.blocks + votes.planks;
  return (
    <div
      className="build-archive-note"
      role="note"
      aria-label="About this build"
      data-testid="note-build-archive"
    >
      <div className="build-archive-note-body">
        <p className="eyebrow">About this build</p>
        <h3 className="build-archive-note-title">
          We picked Stacker. Thanks for voting.
        </h3>
        <p className="build-archive-note-lede">
          During the playtest you could pick between three Build prototypes —
          Stacker, Block builder, and Falling planks. We've kept{" "}
          <strong>Stacker</strong> as the one Build experience and retired the
          other two. The {total === 1 ? "vote" : "votes"} cast on this pile
          are saved below so the choice is on the record.
        </p>
        <ul className="build-archive-note-tally">
          <li>
            <span className="build-archive-note-name">
              Stacker <span className="build-archive-note-tag is-kept">kept</span>
            </span>
            <span
              className="build-archive-note-count"
              data-testid="archive-vote-stacker"
            >
              {votes.stacker} {votes.stacker === 1 ? "vote" : "votes"}
            </span>
          </li>
          <li>
            <span className="build-archive-note-name">
              Block builder{" "}
              <span className="build-archive-note-tag is-retired">retired</span>
            </span>
            <span
              className="build-archive-note-count"
              data-testid="archive-vote-blocks"
            >
              {votes.blocks} {votes.blocks === 1 ? "vote" : "votes"}
            </span>
          </li>
          <li>
            <span className="build-archive-note-name">
              Falling planks{" "}
              <span className="build-archive-note-tag is-retired">retired</span>
            </span>
            <span
              className="build-archive-note-count"
              data-testid="archive-vote-planks"
            >
              {votes.planks} {votes.planks === 1 ? "vote" : "votes"}
            </span>
          </li>
        </ul>
        {retiredTotal > 0 && (
          <p className="build-archive-note-thanks">
            {retiredTotal === 1
              ? "One of those votes went to a retired prototype — thank you for trying it. The data helped narrow the field."
              : `${retiredTotal} of those votes went to retired prototypes — thank you for trying them. The data helped narrow the field.`}
          </p>
        )}
      </div>
      <button
        type="button"
        className="build-archive-note-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss this note"
        data-testid="button-archive-note-dismiss"
      >
        ×
      </button>
    </div>
  );
}

function OnboardCard({
  onClose,
  pileName,
}: {
  onClose: () => void;
  pileName: string;
}) {
  return (
    <div
      className="build-onboard-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="build-onboard-title"
      data-testid="panel-build-onboard"
    >
      <div className="build-onboard-card">
        <p className="eyebrow">Workshop tour</p>
        <h2 id="build-onboard-title" className="build-onboard-title">
          Building with {pileName}
        </h2>
        <ol className="build-onboard-steps">
          <li>
            <span className="build-onboard-num">1</span>
            <div>
              <strong>Drag a Load-bearing word</strong> from the tray on the
              left into one of the five frame slots. It snaps green and counts
              toward "standing."
            </div>
          </li>
          <li>
            <span className="build-onboard-num">2</span>
            <div>
              <strong>Drag an Interior word</strong> onto the trim row up top.
              Trim is decorative — it doesn't hold weight.
            </div>
          </li>
          <li>
            <span className="build-onboard-num">3</span>
            <div>
              <strong>Try an Avoid word.</strong> It cracks on contact and
              shows a safer alternative — that's the lesson.
            </div>
          </li>
          <li>
            <span className="build-onboard-num">4</span>
            <div>
              <strong>Untreated words</strong> land loose. We'll ask whether
              they're really Load, Interior, or Avoid — your answer files them
              in the pile.
            </div>
          </li>
        </ol>
        <p className="build-onboard-tip">
          Tap a tray card if dragging is fiddly. Use the speaker icon to mute
          sound, and Save image to grab a picture of your finished build.
        </p>
        <div className="build-onboard-actions">
          <button
            className="btn-primary"
            onClick={onClose}
            data-testid="button-onboard-close"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Archive,
  ArrowRight,
  Gift,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useWordpile } from "@/lib/useStore";
import {
  WordpileStore,
  findSimilarLocalPile,
  computeMergeConflicts,
  parseAnyImport,
  type BundleEntryDecision,
  type MergeConflictSummary,
} from "@/lib/store";
import { decodePileShare, readShareFragment } from "@/lib/shareLink";
import {
  BUCKET_LABELS,
  type AnyPileImport,
  type Bucket,
  type PileBundleExport,
  type PileExport,
  type PileExportWord,
} from "@/data/types";

export function PilesPage() {
  const data = useWordpile();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importPayload, setImportPayload] = useState<PileExport | null>(null);
  const [importBundle, setImportBundle] = useState<PileBundleExport | null>(
    null,
  );
  const [bundleSelection, setBundleSelection] = useState<boolean[]>([]);
  const [bundleDecisions, setBundleDecisions] = useState<BundleEntryDecision[]>(
    [],
  );
  // Tracks which bundle rows the practitioner has explicitly chosen a
  // mode on, so the late-sync re-suggestion effect doesn't overwrite an
  // intentional "Create new" pick when piles arrive later.
  const [bundleDecisionsTouched, setBundleDecisionsTouched] = useState<
    boolean[]
  >([]);
  const [importFileName, setImportFileName] = useState<string>("");
  const [importSource, setImportSource] = useState<"file" | "link">("file");
  const [importMode, setImportMode] = useState<"new" | "merge">("new");
  const [importNewName, setImportNewName] = useState<string>("");
  const [importMergeId, setImportMergeId] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importHint, setImportHint] = useState<string | null>(null);
  // Set to true the moment the user touches the mode radios or the merge
  // dropdown, which freezes the auto-default so cloud-sync hydrating
  // more piles in the background can't clobber a manual choice.
  const [userOverrodeImport, setUserOverrodeImport] = useState(false);
  // Per-word "use theirs" picks for the single-pile (file/share-link)
  // merge preview. Words listed here will adopt the incoming pile's
  // bucket + safer alternative instead of keeping the existing version.
  // Resets whenever the merge target or import payload changes so a
  // toggle picked against pile A doesn't silently apply to pile B.
  const [singleUseTheirs, setSingleUseTheirs] = useState<Set<string>>(
    () => new Set(),
  );
  // Same idea for the multi-pile bundle preview, keyed by the bundle
  // row index. We only ever store the rows the practitioner has touched,
  // so empty-map = today's "keep mine for everything" behaviour.
  const [bundleUseTheirsByIndex, setBundleUseTheirsByIndex] = useState<
    Record<number, Set<string>>
  >({});
  const piles = data.pileOrder
    .map((id) => data.piles[id])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const isLinkImport =
    importSource === "link" && (importPayload !== null || importError !== null);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  // When a share-link import lands, scroll the banner into view so the
  // preview is the first thing visible — especially on phones, where the
  // marketing copy would otherwise push it below the fold.
  useEffect(() => {
    if (!isLinkImport) return;
    if (typeof window === "undefined") return;
    const el = bannerRef.current;
    if (!el) return;
    // Scroll to the very top so the banner sits above the fold without
    // any leftover marketing copy peeking in above it.
    window.scrollTo({ top: 0, behavior: "auto" });
    el.focus({ preventScroll: true });
  }, [isLinkImport]);

  // If we landed here with a `#data=...` share fragment, decode it once
  // and pre-populate the import preview. We strip the fragment afterwards
  // so a refresh doesn't re-prompt — and so users don't accidentally
  // re-share the URL with the payload still attached.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const encoded = readShareFragment(window.location.hash);
    if (!encoded) return;
    let cancelled = false;
    void decodePileShare(encoded).then((result) => {
      if (cancelled) return;
      if (typeof window !== "undefined") {
        const cleanUrl =
          window.location.pathname + window.location.search;
        window.history.replaceState(null, "", cleanUrl);
      }
      if (!result.ok) {
        setImportPayload(null);
        setImportFileName("");
        setImportSource("link");
        setImportError(
          result.reason === "too-large"
            ? "That share link is too long for this browser to load. Ask the sender to export the pile as a file instead."
            : result.reason === "unsupported"
              ? "This browser can't open share links. Try a newer browser, or ask the sender for the .wordpile.json file."
              : "That share link doesn't look like a wordpile. It may have been truncated or edited.",
        );
        return;
      }
      setImportPayload(result.payload);
      setImportFileName(`${result.payload.pile.name} (shared link)`);
      setImportSource("link");
      setImportNewName(result.payload.pile.name);
      setImportMode("new");
      setImportMergeId("");
      setImportError(null);
      setImportHint(null);
      setUserOverrodeImport(false);
    });
    return () => {
      cancelled = true;
    };
    // We only want this to fire on first mount — the fragment is consumed
    // and stripped, so re-running would do nothing useful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-detect duplicate piles for share-link imports and default the
  // preview to "Merge into <existing>" when the incoming pile looks like
  // one the practitioner already has. Re-runs as `piles` changes (cloud
  // sync can hydrate the cache incrementally after the share link
  // decoded), but freezes once the user has interacted with the import
  // controls so we never overwrite a manual choice.
  useEffect(() => {
    if (!importPayload) return;
    if (importSource !== "link") {
      // File imports keep the historical "create new" default; just seed
      // the merge-target dropdown so it isn't empty if the user switches.
      if (piles.length > 0 && importMergeId === "") {
        setImportMergeId(piles[0].id);
      }
      return;
    }
    if (userOverrodeImport) return;
    if (piles.length === 0) return;
    const match = findSimilarLocalPile(importPayload, piles);
    if (match) {
      setImportMode("merge");
      setImportMergeId(match.pile.id);
      setImportHint(match.reason);
      return;
    }
    // No similar pile — clear any stale hint from a prior pile snapshot
    // and make sure the merge dropdown has a sane default in case the
    // practitioner switches modes manually.
    setImportHint(null);
    if (importMergeId === "") setImportMergeId(piles[0].id);
  }, [importPayload, importSource, piles, importMergeId, userOverrodeImport]);

  // If the practitioner switches the merge target or mode for a single
  // import, the per-word "use theirs" picks no longer line up with the
  // newly previewed conflicts — clear them so we never silently apply a
  // stale choice. The conflict math itself is recomputed by the
  // singleMergeConflicts memo below.
  useEffect(() => {
    setSingleUseTheirs(new Set());
  }, [importPayload, importMergeId, importMode]);

  // When piles arrive late (sign-in sync) for an already-loaded bundle,
  // re-suggest merge targets for rows the practitioner has not
  // explicitly touched (and that don't already have a merge target).
  // We never overwrite an intentional pick — if the user explicitly
  // chose "Create new", a later cloud sync must not flip them back.
  useEffect(() => {
    if (!importBundle || piles.length === 0) return;
    setBundleDecisions((prev) => {
      let changed = false;
      const next = importBundle.piles.map((entry, i) => {
        const current = prev[i] ?? { mode: "new" as const };
        if (current.mode === "merge") return current;
        if (bundleDecisionsTouched[i]) return current;
        const suggested = suggestBundleDecision(entry.name, piles);
        if (suggested.mode === "merge") {
          changed = true;
          return suggested;
        }
        return current;
      });
      return changed ? next : prev;
    });
  }, [importBundle, piles, bundleDecisionsTouched]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const created = WordpileStore.createPile(name);
    setName("");
    navigate(`/pile/${created.id}`);
  }

  function handleSaveRename(id: string) {
    if (editingName.trim()) WordpileStore.renamePile(id, editingName);
    setEditingId(null);
    setEditingName("");
  }

  function resetImport() {
    setImportPayload(null);
    setImportBundle(null);
    setBundleSelection([]);
    setBundleDecisions([]);
    setBundleDecisionsTouched([]);
    setImportFileName("");
    setImportSource("file");
    setImportMode("new");
    setImportNewName("");
    setImportMergeId("");
    setImportError(null);
    setImportHint(null);
    setUserOverrodeImport(false);
    setSingleUseTheirs(new Set());
    setBundleUseTheirsByIndex({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function applyParsedImport(parsed: AnyPileImport, fileName: string) {
    if (parsed.kind === "bundle") {
      setImportBundle(parsed.payload);
      setBundleSelection(parsed.payload.piles.map(() => true));
      setBundleDecisions(parsed.payload.piles.map((p) => suggestBundleDecision(p.name, piles)));
      setBundleDecisionsTouched(parsed.payload.piles.map(() => false));
      setBundleUseTheirsByIndex({});
      setImportPayload(null);
      setImportFileName(fileName);
      setImportMode("new");
      setImportHint(null);
      setUserOverrodeImport(false);
      return;
    }
    setImportPayload(parsed.payload);
    setImportBundle(null);
    setBundleSelection([]);
    setBundleDecisions([]);
    setBundleDecisionsTouched([]);
    setBundleUseTheirsByIndex({});
    setSingleUseTheirs(new Set());
    setImportFileName(fileName);
    setImportNewName(parsed.payload.pile.name);
    setImportMode("new");
    setImportMergeId(piles[0]?.id ?? "");
    setImportHint(null);
    setUserOverrodeImport(false);
  }

  async function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSource("file");
    try {
      const text = await file.text();
      const parsed = parseAnyImport(text);
      if (!parsed) {
        setImportPayload(null);
        setImportBundle(null);
        setImportFileName(file.name);
        setImportError(
          "That file isn't a wordpile export. Expected a .wordpile.json or .wordpile-bundle.json file.",
        );
        return;
      }
      applyParsedImport(parsed, file.name);
    } catch {
      setImportPayload(null);
      setImportBundle(null);
      setImportFileName(file.name);
      setImportError("Couldn't read that file.");
    }
  }

  function handleConfirmImport() {
    if (importBundle) {
      const indexes = bundleSelection
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      if (indexes.length === 0) {
        setImportError("Pick at least one pile to import.");
        return;
      }
      // Validate any merge decisions still point at a real pile (in
      // case the practitioner deleted a pile after loading the backup).
      const decisions: Record<number, BundleEntryDecision> = {};
      for (const i of indexes) {
        const decision = bundleDecisions[i] ?? { mode: "new" };
        if (
          decision.mode === "merge" &&
          !piles.some((p) => p.id === decision.pileId)
        ) {
          setImportError(
            `The pile chosen for "${importBundle.piles[i].name}" no longer exists. Pick another target or switch it back to a new pile.`,
          );
          return;
        }
        if (decision.mode === "merge") {
          const useTheirs = bundleUseTheirsByIndex[i];
          decisions[i] = useTheirs && useTheirs.size > 0
            ? { ...decision, useTheirsWords: Array.from(useTheirs) }
            : decision;
        } else {
          decisions[i] = decision;
        }
      }
      const result = WordpileStore.importBundle(importBundle, {
        selectedIndexes: indexes,
        decisions,
      });
      resetImport();
      if (result.length === 1) navigate(`/pile/${result[0].id}`);
      return;
    }
    if (!importPayload) return;
    if (importMode === "merge") {
      const target = piles.find((p) => p.id === importMergeId);
      if (!target) {
        setImportError("Pick a pile to merge into.");
        return;
      }
      WordpileStore.importPile(importPayload, {
        mergeIntoPileId: target.id,
        useTheirsWords:
          singleUseTheirs.size > 0 ? Array.from(singleUseTheirs) : undefined,
      });
      resetImport();
      navigate(`/pile/${target.id}`);
      return;
    }
    if (!importNewName.trim()) {
      setImportError("Give the new pile a name.");
      return;
    }
    const created = WordpileStore.importPile(importPayload, {
      nameOverride: importNewName,
    });
    resetImport();
    if (created) navigate(`/pile/${created.id}`);
  }

  function handleBackupAll() {
    const bundle = WordpileStore.serializeAllPiles();
    const json = JSON.stringify(bundle, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date(bundle.exportedAt)
      .toISOString()
      .slice(0, 10);
    a.href = url;
    a.download = `wordpile-${stamp}.wordpile-bundle.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function toggleBundleEntry(index: number) {
    setBundleSelection((prev) =>
      prev.map((on, i) => (i === index ? !on : on)),
    );
  }

  function setAllBundleSelected(value: boolean) {
    setBundleSelection((prev) => prev.map(() => value));
  }

  const importErrorBlock = importError ? (
    <div
      className="mt-3 rounded p-3 text-sm"
      style={{
        backgroundColor: "var(--color-paper)",
        border: "1px solid var(--color-avoid)",
        color: "var(--color-avoid)",
      }}
      data-testid="text-import-error"
    >
      {importError}
      <button
        className="btn-ghost ml-2"
        onClick={resetImport}
        style={{ color: "inherit" }}
      >
        Dismiss
      </button>
    </div>
  ) : null;

  // When the practitioner is in "merge into existing pile" mode, run
  // the conflict math up front so the preview can show how many of
  // their existing words would be left untouched and how many of those
  // are classified differently in the shared pile.
  const singleMergeTarget =
    importPayload && importMode === "merge"
      ? piles.find((p) => p.id === importMergeId) ?? null
      : null;
  const singleMergeConflicts =
    importPayload && singleMergeTarget
      ? computeMergeConflicts(importPayload.pile, singleMergeTarget)
      : null;

  // Roll-up of conflict counts across every bundle row in merge mode,
  // so the bottom action button can flag "you'll touch piles with
  // existing words you've classified differently" without making the
  // practitioner expand every row to find that out. `useTheirsCount`
  // tracks how many of those reclassified words the practitioner has
  // explicitly opted to take from the backup, so the warning text only
  // mentions rows that will actually keep the existing version.
  const bundleMergeRollup = (() => {
    if (!importBundle) return null;
    let mergeRows = 0;
    let overlapCount = 0;
    let reclassifiedCount = 0;
    let useTheirsCount = 0;
    importBundle.piles.forEach((p, i) => {
      const decision = bundleDecisions[i] ?? { mode: "new" };
      const selected = bundleSelection[i] ?? false;
      if (!selected || decision.mode !== "merge") return;
      const target = piles.find((px) => px.id === decision.pileId);
      if (!target) return;
      const summary = computeMergeConflicts(p, target);
      mergeRows += 1;
      overlapCount += summary.overlapCount;
      reclassifiedCount += summary.reclassifiedCount;
      const picks = bundleUseTheirsByIndex[i];
      if (picks && picks.size > 0) {
        for (const c of summary.conflicts) {
          if ((c.bucketDiffers || c.saferAlternativeDiffers) && picks.has(c.word)) {
            useTheirsCount += 1;
          }
        }
      }
    });
    return {
      mergeRows,
      overlapCount,
      reclassifiedCount,
      useTheirsCount,
      keepMineCount: reclassifiedCount - useTheirsCount,
    };
  })();

  const importPreviewBlock = importPayload ? (
    <div
      className="mt-3 rounded p-4 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-paper)",
        border: "1px solid var(--color-rule)",
      }}
      data-testid="panel-import-preview"
    >
      <div>
        <p className="eyebrow mb-1">
          {importSource === "link"
            ? "Importing from share link"
            : `Importing from ${importFileName}`}
        </p>
        <p className="text-sm" style={{ color: "var(--color-stone)" }}>
          <strong>{importPayload.pile.name}</strong> ·{" "}
          {importPayload.pile.words.length} word
          {importPayload.pile.words.length === 1 ? "" : "s"}
          {importPayload.pile.draft ? " · includes a saved draft" : ""}
        </p>
        {importHint && (
          <p
            className="text-sm mt-2"
            style={{
              color: "var(--color-load)",
              borderLeft: "3px solid var(--color-load)",
              paddingLeft: 10,
            }}
            data-testid="text-import-hint"
          >
            {importHint}
          </p>
        )}
      </div>
      {(importPayload.pile.words.length > 0 || importPayload.pile.draft) && (
        <SharedPilePeek payload={importPayload} />
      )}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="import-mode"
            checked={importMode === "new"}
            onChange={() => {
              setImportMode("new");
              setUserOverrodeImport(true);
            }}
            data-testid="radio-import-new"
          />
          Create a new pile
        </label>
        {importMode === "new" && (
          <input
            className="input"
            style={{ maxWidth: 360, marginLeft: 22 }}
            value={importNewName}
            onChange={(e) => setImportNewName(e.target.value)}
            placeholder="Name for the new pile"
            data-testid="input-import-new-name"
          />
        )}
        {piles.length > 0 && (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="import-mode"
                checked={importMode === "merge"}
                onChange={() => {
                  setImportMode("merge");
                  setUserOverrodeImport(true);
                }}
                data-testid="radio-import-merge"
              />
              Merge into an existing pile
            </label>
            {importMode === "merge" && (
              <select
                className="input"
                style={{ maxWidth: 360, marginLeft: 22 }}
                value={importMergeId}
                onChange={(e) => {
                  setImportMergeId(e.target.value);
                  setUserOverrodeImport(true);
                }}
                data-testid="select-import-merge-target"
              >
                {piles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
            {importMode === "merge" && singleMergeConflicts && singleMergeTarget && (
              <div style={{ marginLeft: 22 }}>
                <MergeConflictPreview
                  summary={singleMergeConflicts}
                  targetName={singleMergeTarget.name}
                  testIdPrefix="single"
                  useTheirsWords={singleUseTheirs}
                  onToggleUseTheirs={(word, take) => {
                    setSingleUseTheirs((prev) => {
                      const next = new Set(prev);
                      if (take) next.add(word);
                      else next.delete(word);
                      return next;
                    });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="btn-primary"
          onClick={handleConfirmImport}
          data-testid="button-confirm-import"
        >
          {importMode === "merge"
            ? singleMergeConflicts &&
              singleMergeConflicts.reclassifiedCount > singleUseTheirs.size
              ? "Merge anyway"
              : singleUseTheirs.size > 0
                ? "Merge with picks"
                : "Merge into pile"
            : "Create pile"}
        </button>
        <button
          className="btn-ghost"
          onClick={resetImport}
          data-testid="button-cancel-import"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {isLinkImport && (
        <section
          className="share-banner mb-10"
          ref={bannerRef}
          tabIndex={-1}
          aria-label="Shared pile preview"
          data-testid="banner-share-link"
        >
          <div className="share-banner-header">
            <span className="share-banner-icon" aria-hidden="true">
              <Gift size={18} />
            </span>
            <div className="share-banner-headline">
              <p className="eyebrow mb-1">Someone shared a pile with you</p>
              <h1
                className="text-2xl"
                style={{ fontWeight: 600, lineHeight: 1.15, margin: 0 }}
              >
                {importPayload
                  ? `Open “${importPayload.pile.name}” on this device?`
                  : "We couldn't open that share link."}
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--color-stone)", margin: "8px 0 0" }}
              >
                {importPayload
                  ? "Review what they sent, then save it as your own pile or merge it into one you already have."
                  : "Ask the sender to try again — details are below."}
              </p>
            </div>
          </div>
          {importErrorBlock}
          {importPreviewBlock}
        </section>
      )}

      <div className={isLinkImport ? "intro-muted" : ""}>
        <p className="eyebrow mb-3">A per-community word inventory</p>
        <h1
          className={isLinkImport ? "text-2xl mb-2" : "text-4xl mb-3"}
          style={{ fontWeight: 600, lineHeight: 1.1 }}
        >
          {isLinkImport
            ? "About wordpile"
            : "Each community gets its own pile of timber."}
        </h1>
        {!isLinkImport && (
          <p
            className="text-lg leading-relaxed mb-2"
            style={{ color: "var(--color-stone)", maxWidth: 620 }}
          >
            Every word is a 2x4. Sort it onto one of three stacks:{" "}
            <strong style={{ color: "var(--color-load)" }}>load-bearing</strong>{" "}
            words hold the meaning up,{" "}
            <strong style={{ color: "var(--color-interior)" }}>interior</strong>{" "}
            words are flavor you can swap, and{" "}
            <strong style={{ color: "var(--color-avoid)" }}>avoid</strong>{" "}
            words each get a safer alternative. Stop relearning each
            community's language from scratch.
          </p>
        )}
        {isLinkImport && (
          <p
            className="text-sm leading-relaxed mb-2"
            style={{ color: "var(--color-stone)", maxWidth: 620 }}
          >
            Wordpile keeps a small inventory of words per community —
            load-bearing, interior, and avoid. The pile above was sent to you
            so you don't have to start from scratch.
          </p>
        )}
      </div>

      <hr className="divider" />

      <section className={`mb-10 ${isLinkImport ? "intro-muted" : ""}`}>
        <p className="eyebrow mb-3">
          {isLinkImport ? "Or start your own pile" : "Start a new community pile"}
        </p>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            className="input"
            placeholder="e.g. Deer Lake"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="input-new-pile-name"
            autoFocus={!isLinkImport}
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap"
            disabled={!name.trim()}
            data-testid="button-create-pile"
          >
            <Plus size={14} />
            Create pile
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFilePicked}
            style={{ display: "none" }}
            data-testid="input-import-file"
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-import-pile"
            title="Load a .wordpile.json or .wordpile-bundle.json file."
          >
            <Upload size={12} /> Import from a file
          </button>
          {piles.length > 0 && (
            <button
              type="button"
              className="btn-ghost"
              onClick={handleBackupAll}
              data-testid="button-backup-all"
              title="Download every pile (and its draft) as a single .wordpile-bundle.json backup."
            >
              <Archive size={12} /> Back up all piles
            </button>
          )}
          <span
            className="eyebrow"
            style={{ color: "var(--color-stone)" }}
            title="Or paste a share link in your address bar — it will open here."
          >
            <LinkIcon size={11} style={{ display: "inline", marginRight: 4 }} />
            Share links open here automatically
          </span>
          {importFileName && !importPayload && !importBundle && !importError && (
            <span className="eyebrow">{importFileName}</span>
          )}
        </div>
        {!isLinkImport && importErrorBlock}
        {!isLinkImport && importPreviewBlock}
        {importBundle && (
          <div
            className="mt-3 rounded p-4 flex flex-col gap-3"
            style={{
              backgroundColor: "var(--color-paper)",
              border: "1px solid var(--color-rule)",
            }}
            data-testid="panel-bundle-preview"
          >
            <div>
              <p className="eyebrow mb-1">
                Restoring backup from {importFileName}
              </p>
              <p className="text-sm" style={{ color: "var(--color-stone)" }}>
                {importBundle.piles.length} pile
                {importBundle.piles.length === 1 ? "" : "s"} in this backup.
                Pick which ones to bring in, and choose whether each one
                becomes a new pile or merges into one you already have
                (existing words are kept as-is).
              </p>
            </div>
            {importBundle.piles.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-stone)" }}>
                This backup is empty.
              </p>
            ) : (
              <>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setAllBundleSelected(true)}
                    data-testid="button-bundle-select-all"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setAllBundleSelected(false)}
                    data-testid="button-bundle-select-none"
                  >
                    None
                  </button>
                </div>
                <ul
                  className="flex flex-col gap-2"
                  style={{
                    maxHeight: 320,
                    overflowY: "auto",
                    borderTop: "1px solid var(--color-rule)",
                    borderBottom: "1px solid var(--color-rule)",
                    paddingTop: 6,
                    paddingBottom: 6,
                  }}
                >
                  {importBundle.piles.map((p, i) => {
                    const decision = bundleDecisions[i] ?? { mode: "new" };
                    const selected = bundleSelection[i] ?? false;
                    const selectValue =
                      decision.mode === "merge" ? `merge:${decision.pileId}` : "new";
                    const mergeTarget =
                      decision.mode === "merge"
                        ? piles.find((px) => px.id === decision.pileId) ?? null
                        : null;
                    const rowConflicts =
                      selected && mergeTarget
                        ? computeMergeConflicts(p, mergeTarget)
                        : null;
                    return (
                      <li key={`${p.name}-${i}`} className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleBundleEntry(i)}
                            data-testid={`checkbox-bundle-${i}`}
                          />
                          <strong>{p.name}</strong>
                          <span style={{ color: "var(--color-stone)" }}>
                            · {p.words.length} word
                            {p.words.length === 1 ? "" : "s"}
                            {p.draft ? " · draft" : ""}
                          </span>
                        </label>
                        {selected && piles.length > 0 && (
                          <select
                            className="input"
                            style={{ maxWidth: 360, marginLeft: 22 }}
                            value={selectValue}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBundleDecisions((prev) => {
                                const next = [...prev];
                                next[i] = v.startsWith("merge:")
                                  ? { mode: "merge", pileId: v.slice("merge:".length) }
                                  : { mode: "new" };
                                return next;
                              });
                              setBundleDecisionsTouched((prev) => {
                                const next = [...prev];
                                next[i] = true;
                                return next;
                              });
                              // The conflict diff just changed
                              // (different target, or no target at all
                              // for "Create new"), so any per-word
                              // picks for this row are now stale.
                              setBundleUseTheirsByIndex((prev) => {
                                if (!(i in prev)) return prev;
                                const next = { ...prev };
                                delete next[i];
                                return next;
                              });
                            }}
                            data-testid={`select-bundle-mode-${i}`}
                          >
                            <option value="new">Create a new pile</option>
                            {piles.map((existing) => (
                              <option
                                key={existing.id}
                                value={`merge:${existing.id}`}
                              >
                                Merge into {existing.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {rowConflicts && mergeTarget && (
                          <div style={{ marginLeft: 22 }}>
                            <MergeConflictPreview
                              summary={rowConflicts}
                              targetName={mergeTarget.name}
                              testIdPrefix={`bundle-${i}`}
                              compact
                              useTheirsWords={
                                bundleUseTheirsByIndex[i] ?? EMPTY_USE_THEIRS
                              }
                              onToggleUseTheirs={(word, take) => {
                                setBundleUseTheirsByIndex((prev) => {
                                  const current = prev[i] ?? new Set<string>();
                                  const nextSet = new Set(current);
                                  if (take) nextSet.add(word);
                                  else nextSet.delete(word);
                                  if (nextSet.size === 0 && !(i in prev)) {
                                    return prev;
                                  }
                                  if (nextSet.size === 0) {
                                    const next = { ...prev };
                                    delete next[i];
                                    return next;
                                  }
                                  return { ...prev, [i]: nextSet };
                                });
                              }}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            {bundleMergeRollup && bundleMergeRollup.overlapCount > 0 && (
              <p
                className="text-sm"
                data-testid="text-bundle-merge-rollup"
                style={{
                  margin: 0,
                  color:
                    bundleMergeRollup.keepMineCount > 0
                      ? "var(--color-avoid)"
                      : "var(--color-stone)",
                }}
              >
                Across the merge rows above: {bundleMergeRollup.overlapCount} word
                {bundleMergeRollup.overlapCount === 1 ? "" : "s"} already exist
                in your piles.
                {bundleMergeRollup.reclassifiedCount > 0 ? (
                  <>
                    {" "}
                    <strong>
                      {bundleMergeRollup.reclassifiedCount} are sorted
                      differently in this backup
                    </strong>
                    {bundleMergeRollup.useTheirsCount > 0 ? (
                      <>
                        {" "}
                        — you've chosen to take{" "}
                        {bundleMergeRollup.useTheirsCount} from the backup;
                        the other {bundleMergeRollup.keepMineCount} keep
                        {bundleMergeRollup.keepMineCount === 1 ? "s" : ""}{" "}
                        your classification.
                      </>
                    ) : (
                      <>
                        {" "}
                        — your existing classifications will be kept. Expand
                        each row to see what differs (or pick "Use theirs"
                        for individual words) before restoring.
                      </>
                    )}
                  </>
                ) : (
                  " Your existing classifications will be kept."
                )}
              </p>
            )}
            <div className="flex gap-2">
              <button
                className="btn-primary"
                onClick={handleConfirmImport}
                disabled={importBundle.piles.length === 0}
                data-testid="button-confirm-bundle-import"
              >
                {bundleMergeRollup &&
                bundleMergeRollup.keepMineCount > 0
                  ? "Restore anyway"
                  : bundleMergeRollup &&
                      bundleMergeRollup.useTheirsCount > 0
                    ? "Restore with picks"
                    : "Restore selected piles"}
              </button>
              <button
                className="btn-ghost"
                onClick={resetImport}
                data-testid="button-cancel-bundle-import"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <p className="eyebrow mb-3">
          Your piles {piles.length > 0 ? `· ${piles.length}` : ""}
        </p>
        {piles.length === 0 ? (
          <div
            className="rounded p-8 text-center"
            style={{
              backgroundColor: "var(--color-paper)",
              border: "1px dashed var(--color-sand)",
            }}
          >
            <p style={{ color: "var(--color-stone)" }}>
              No piles yet. Create one above to start logging words for a
              community you work with.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {piles.map((pile) => {
              const counts = countByBucket(pile.words);
              const isEditing = editingId === pile.id;
              return (
                <li
                  key={pile.id}
                  className="rounded p-4 flex flex-col gap-3"
                  style={{
                    backgroundColor: "var(--color-paper)",
                    border: "1px solid var(--color-rule)",
                  }}
                  data-testid={`row-pile-${pile.id}`}
                >
                  <div className="flex items-baseline gap-3 flex-wrap">
                    {isEditing ? (
                      <>
                        <input
                          className="input"
                          style={{ maxWidth: 320 }}
                          value={editingName}
                          autoFocus
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(pile.id);
                            if (e.key === "Escape") {
                              setEditingId(null);
                              setEditingName("");
                            }
                          }}
                        />
                        <button
                          className="btn-secondary"
                          onClick={() => handleSaveRename(pile.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-ghost"
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h2
                          className="text-2xl"
                          style={{ fontWeight: 600 }}
                          data-testid={`text-pile-name-${pile.id}`}
                        >
                          {pile.name}
                        </h2>
                        <span className="eyebrow">
                          {pile.words.length} word
                          {pile.words.length === 1 ? "" : "s"}
                        </span>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <div
                      className="flex flex-wrap gap-x-5 gap-y-1 text-sm"
                      style={{ color: "var(--color-stone)" }}
                    >
                      <span>Load-bearing · {counts.load}</span>
                      <span>Interior · {counts.interior}</span>
                      <span>Avoid · {counts.avoid}</span>
                      <span>Unsorted · {counts.unsorted}</span>
                    </div>
                  )}
                  {!isEditing && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          WordpileStore.selectPile(pile.id);
                          navigate(`/pile/${pile.id}`);
                        }}
                        data-testid={`button-open-${pile.id}`}
                      >
                        Open <ArrowRight size={14} />
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => {
                          setEditingId(pile.id);
                          setEditingName(pile.name);
                        }}
                        data-testid={`button-rename-${pile.id}`}
                      >
                        <Pencil size={12} /> Rename
                      </button>
                      <button
                        className="btn-ghost"
                        style={{ color: "var(--color-avoid)" }}
                        onClick={() => {
                          if (
                            confirm(
                              `Delete the "${pile.name}" pile? This removes ${pile.words.length} word${
                                pile.words.length === 1 ? "" : "s"
                              } from this device.`,
                            )
                          ) {
                            WordpileStore.deletePile(pile.id);
                          }
                        }}
                        data-testid={`button-delete-${pile.id}`}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

// Stable empty-set reference for `MergeConflictPreview`'s
// `useTheirsWords` prop on rows where the practitioner hasn't toggled
// anything yet — keeps the prop identity stable across renders so the
// component doesn't think the selection changed.
const EMPTY_USE_THEIRS: ReadonlySet<string> = new Set();

function SharedPilePeek({ payload }: { payload: PileExport }) {
  const words = payload.pile.words;
  const groups: { key: "load" | "interior" | "avoid" | "unsorted"; label: string; words: PileExportWord[] }[] = [
    { key: "load", label: "Load-bearing", words: words.filter((w) => w.bucket === "load") },
    { key: "interior", label: "Interior", words: words.filter((w) => w.bucket === "interior") },
    { key: "avoid", label: "Avoid", words: words.filter((w) => w.bucket === "avoid") },
    { key: "unsorted", label: "Unsorted", words: words.filter((w) => w.bucket === "unsorted") },
  ];
  const draft = payload.pile.draft ?? "";
  const draftSample = draft.trim().slice(0, 80);
  const draftHasMore = draft.trim().length > draftSample.length;

  const summaryBits: string[] = [];
  for (const g of groups) {
    if (g.words.length > 0) {
      summaryBits.push(`${g.words.length} ${g.label.toLowerCase()}`);
    }
  }
  if (draft) summaryBits.push("draft");
  const summaryText = summaryBits.length > 0 ? summaryBits.join(" · ") : "Empty pile";

  return (
    <details className="peek-disclosure" data-testid="disclosure-share-peek">
      <summary className="peek-summary" data-testid="summary-share-peek">
        <span className="peek-summary-label">See what's inside</span>
        <span className="peek-summary-meta">{summaryText}</span>
      </summary>
      <div className="peek-body">
        {words.length === 0 && !draft && (
          <p className="text-sm" style={{ color: "var(--color-stone)", margin: 0 }}>
            No words yet.
          </p>
        )}
        {groups.map((g) =>
          g.words.length === 0 ? null : (
            <div key={g.key} className={`peek-group peek-group-${g.key}`}>
              <p className="eyebrow peek-group-label">
                {g.label} · {g.words.length}
              </p>
              <ul className="peek-chip-list">
                {g.words.map((w, i) => (
                  <li
                    key={`${g.key}-${i}`}
                    className={`peek-chip peek-chip-${g.key}`}
                    title={
                      g.key === "avoid" && w.saferAlternative
                        ? `Suggested instead: ${w.saferAlternative}${w.note ? ` — ${w.note}` : ""}`
                        : w.note || undefined
                    }
                  >
                    <span className="peek-chip-word">{w.word}</span>
                    {g.key === "avoid" && w.saferAlternative && (
                      <span className="peek-chip-arrow"> → {w.saferAlternative}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
        {draft && (
          <div className="peek-group peek-draft" data-testid="peek-draft-preview">
            <p className="eyebrow peek-group-label">Draft</p>
            <p className="text-sm peek-draft-sample">
              {draftSample.length > 0 ? `“${draftSample}${draftHasMore ? "…" : ""}”` : "(empty draft)"}
            </p>
          </div>
        )}
      </div>
    </details>
  );
}

// Inline preview block describing what would happen if the practitioner
// merged a shared/imported pile into the named target. Always shows
// counts; when overlap > 0, also surfaces an expandable per-word diff
// (bucket / safer-alternative side-by-side) so they can back out
// before clicking the merge button. The merge code keeps the existing
// version on a name collision — this UI is what makes that policy
// visible instead of silent.
function MergeConflictPreview({
  summary,
  targetName,
  testIdPrefix,
  compact = false,
  useTheirsWords,
  onToggleUseTheirs,
}: {
  summary: MergeConflictSummary;
  targetName: string;
  testIdPrefix: string;
  compact?: boolean;
  // The set of conflicting words the practitioner has opted into "use
  // theirs" for. Words in this set will adopt the incoming bucket /
  // safer-alternative on confirm; everything else keeps the existing
  // version (today's default).
  useTheirsWords: ReadonlySet<string>;
  onToggleUseTheirs: (word: string, useTheirs: boolean) => void;
}) {
  const { totalIncoming, newCount, overlapCount, reclassifiedCount, conflicts } =
    summary;

  if (totalIncoming === 0) {
    return (
      <p
        className="text-sm"
        style={{ color: "var(--color-stone)", margin: compact ? "4px 0 0" : "8px 0 0" }}
        data-testid={`text-merge-empty-${testIdPrefix}`}
      >
        Nothing to merge — the shared pile is empty.
      </p>
    );
  }

  // Of the rows that actually differ, how many has the practitioner
  // chosen to take from the shared pile? Drives the summary text and
  // the parent's confirm-button label so they match the picks.
  const useTheirsAppliedCount = conflicts.reduce((acc, c) => {
    if (!(c.bucketDiffers || c.saferAlternativeDiffers)) return acc;
    return useTheirsWords.has(c.word) ? acc + 1 : acc;
  }, 0);
  const keepMineCount = reclassifiedCount - useTheirsAppliedCount;

  const newSentence = `${newCount} new word${newCount === 1 ? "" : "s"} would be added to “${targetName}”.`;
  const overlapColor =
    keepMineCount > 0 ? "var(--color-avoid)" : "var(--color-stone)";

  return (
    <div
      className="flex flex-col gap-2"
      style={{ marginTop: compact ? 4 : 8 }}
      data-testid={`panel-merge-conflicts-${testIdPrefix}`}
    >
      <p
        className="text-sm"
        style={{ color: "var(--color-stone)", margin: 0 }}
        data-testid={`text-merge-new-${testIdPrefix}`}
      >
        {newSentence}
      </p>
      {overlapCount > 0 && (
        <p
          className="text-sm"
          style={{ color: overlapColor, margin: 0 }}
          data-testid={`text-merge-overlap-${testIdPrefix}`}
        >
          {overlapCount} word{overlapCount === 1 ? "" : "s"} already in this
          pile.
          {reclassifiedCount > 0 && (
            <>
              {" "}
              <strong data-testid={`text-merge-reclassified-${testIdPrefix}`}>
                {reclassifiedCount} {reclassifiedCount === 1 ? "is" : "are"}{" "}
                sorted differently in the shared pile.
              </strong>{" "}
              {useTheirsAppliedCount > 0 ? (
                <span data-testid={`text-merge-use-theirs-${testIdPrefix}`}>
                  You're taking {useTheirsAppliedCount} from the shared pile;
                  the other {keepMineCount} keep
                  {keepMineCount === 1 ? "s" : ""} your classification.
                </span>
              ) : (
                <span>
                  Your version stays unless you tick "Use theirs" below.
                </span>
              )}
            </>
          )}
        </p>
      )}
      {conflicts.length > 0 && (
        <details
          className="peek-disclosure"
          data-testid={`disclosure-merge-conflicts-${testIdPrefix}`}
        >
          <summary className="peek-summary">
            <span className="peek-summary-label">See what overlaps</span>
            <span className="peek-summary-meta">
              {conflicts.length} word{conflicts.length === 1 ? "" : "s"}
              {reclassifiedCount > 0
                ? ` · ${reclassifiedCount} differ${reclassifiedCount === 1 ? "s" : ""}`
                : ""}
              {useTheirsAppliedCount > 0
                ? ` · ${useTheirsAppliedCount} use theirs`
                : ""}
            </span>
          </summary>
          <ul
            className="flex flex-col gap-1"
            style={{
              listStyle: "none",
              padding: "8px 0 0",
              margin: 0,
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {conflicts.map((c) => {
              const differs = c.bucketDiffers || c.saferAlternativeDiffers;
              const taking = useTheirsWords.has(c.word);
              return (
                <li
                  key={c.word}
                  className="flex flex-col gap-1"
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px dashed var(--color-rule)",
                  }}
                  data-testid={`row-merge-conflict-${testIdPrefix}-${c.word}`}
                >
                  <div className="text-sm">
                    <strong>{c.word}</strong>
                    <span style={{ color: "var(--color-stone)", marginLeft: 6 }}>
                      {differs ? (
                        <>
                          you: {bucketSummary(c.existingBucket, c.existingSaferAlternative)}{" "}
                          →{" "}
                          <span style={{ color: "var(--color-avoid)" }}>
                            shared: {bucketSummary(c.incomingBucket, c.incomingSaferAlternative)}
                          </span>
                        </>
                      ) : (
                        <>same as yours · {BUCKET_LABELS[c.existingBucket]}</>
                      )}
                    </span>
                  </div>
                  {differs && (
                    <div
                      className="flex flex-wrap gap-3"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <label
                        className="flex items-center gap-1"
                        style={{ color: "var(--color-stone)" }}
                      >
                        <input
                          type="radio"
                          name={`merge-pick-${testIdPrefix}-${c.word}`}
                          checked={!taking}
                          onChange={() => onToggleUseTheirs(c.word, false)}
                          data-testid={`radio-merge-keep-mine-${testIdPrefix}-${c.word}`}
                        />
                        Keep mine
                      </label>
                      <label
                        className="flex items-center gap-1"
                        style={{
                          color: taking
                            ? "var(--color-avoid)"
                            : "var(--color-stone)",
                          fontWeight: taking ? 600 : 400,
                        }}
                      >
                        <input
                          type="radio"
                          name={`merge-pick-${testIdPrefix}-${c.word}`}
                          checked={taking}
                          onChange={() => onToggleUseTheirs(c.word, true)}
                          data-testid={`radio-merge-use-theirs-${testIdPrefix}-${c.word}`}
                        />
                        Use theirs
                      </label>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </div>
  );
}

function bucketSummary(bucket: Bucket, saferAlternative: string) {
  const label = BUCKET_LABELS[bucket];
  if (bucket === "avoid" && saferAlternative.trim()) {
    return `${label} → ${saferAlternative}`;
  }
  return label;
}

function countByBucket(words: { bucket: string }[]) {
  const counts = { load: 0, interior: 0, avoid: 0, unsorted: 0 };
  for (const w of words) {
    if (w.bucket === "load") counts.load += 1;
    else if (w.bucket === "interior") counts.interior += 1;
    else if (w.bucket === "avoid") counts.avoid += 1;
    else counts.unsorted += 1;
  }
  return counts;
}

// Default each bundle row to "merge into <same-named pile>" when the
// device already has a pile with that name (case-insensitive). This is
// what makes a backup actually restore in-place instead of producing
// duplicates. Anything without a same-named match defaults to creating
// a new pile.
function suggestBundleDecision(
  entryName: string,
  existing: { id: string; name: string }[],
): BundleEntryDecision {
  const target = entryName.trim().toLowerCase();
  const match = existing.find((p) => p.name.trim().toLowerCase() === target);
  return match ? { mode: "merge", pileId: match.id } : { mode: "new" };
}

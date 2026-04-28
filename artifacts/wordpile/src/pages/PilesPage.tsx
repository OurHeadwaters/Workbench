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
import { WordpileStore, parseAnyImport } from "@/lib/store";
import { decodePileShare, readShareFragment } from "@/lib/shareLink";
import type { AnyPileImport, PileBundleExport, PileExport } from "@/data/types";

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
  const [importFileName, setImportFileName] = useState<string>("");
  const [importSource, setImportSource] = useState<"file" | "link">("file");
  const [importMode, setImportMode] = useState<"new" | "merge">("new");
  const [importNewName, setImportNewName] = useState<string>("");
  const [importMergeId, setImportMergeId] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
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
    });
    return () => {
      cancelled = true;
    };
    // We only want this to fire on first mount — the fragment is consumed
    // and stripped, so re-running would do nothing useful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh the merge target default once piles arrive from a sign-in
  // bootstrap (the share link arrives anonymously, before the cloud sync
  // has hydrated, so the dropdown could otherwise be empty).
  useEffect(() => {
    if (importPayload && importMergeId === "" && piles.length > 0) {
      setImportMergeId(piles[0].id);
    }
  }, [importPayload, importMergeId, piles]);

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
    setImportFileName("");
    setImportSource("file");
    setImportMode("new");
    setImportNewName("");
    setImportMergeId("");
    setImportError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function applyParsedImport(parsed: AnyPileImport, fileName: string) {
    if (parsed.kind === "bundle") {
      setImportBundle(parsed.payload);
      setBundleSelection(parsed.payload.piles.map(() => true));
      setImportPayload(null);
      setImportFileName(fileName);
      setImportMode("new");
      return;
    }
    setImportPayload(parsed.payload);
    setImportBundle(null);
    setBundleSelection([]);
    setImportFileName(fileName);
    setImportNewName(parsed.payload.pile.name);
    setImportMode("new");
    setImportMergeId(piles[0]?.id ?? "");
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
      const created = WordpileStore.importBundle(importBundle, {
        selectedIndexes: indexes,
      });
      resetImport();
      if (created.length === 1) navigate(`/pile/${created[0].id}`);
      return;
    }
    if (!importPayload) return;
    if (importMode === "merge") {
      const target = piles.find((p) => p.id === importMergeId);
      if (!target) {
        setImportError("Pick a pile to merge into.");
        return;
      }
      WordpileStore.importPile(importPayload, { mergeIntoPileId: target.id });
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
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="import-mode"
            checked={importMode === "new"}
            onChange={() => setImportMode("new")}
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
                onChange={() => setImportMode("merge")}
                data-testid="radio-import-merge"
              />
              Merge into an existing pile
            </label>
            {importMode === "merge" && (
              <select
                className="input"
                style={{ maxWidth: 360, marginLeft: 22 }}
                value={importMergeId}
                onChange={(e) => setImportMergeId(e.target.value)}
                data-testid="select-import-merge-target"
              >
                {piles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
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
          {importMode === "merge" ? "Merge into pile" : "Create pile"}
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
    <div className="max-w-3xl mx-auto px-6 py-12">
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
                Pick which ones to bring in — each becomes a new pile, so
                nothing on this device gets overwritten.
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
                  className="flex flex-col gap-1"
                  style={{
                    maxHeight: 260,
                    overflowY: "auto",
                    borderTop: "1px solid var(--color-rule)",
                    borderBottom: "1px solid var(--color-rule)",
                    paddingTop: 6,
                    paddingBottom: 6,
                  }}
                >
                  {importBundle.piles.map((p, i) => (
                    <li key={`${p.name}-${i}`}>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={bundleSelection[i] ?? false}
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
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="flex gap-2">
              <button
                className="btn-primary"
                onClick={handleConfirmImport}
                disabled={importBundle.piles.length === 0}
                data-testid="button-confirm-bundle-import"
              >
                Restore selected piles
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

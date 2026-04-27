import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useWordpile } from "@/lib/useStore";
import { WordpileStore, parsePileExport } from "@/lib/store";
import type { PileExport } from "@/data/types";

export function PilesPage() {
  const data = useWordpile();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importPayload, setImportPayload] = useState<PileExport | null>(null);
  const [importFileName, setImportFileName] = useState<string>("");
  const [importMode, setImportMode] = useState<"new" | "merge">("new");
  const [importNewName, setImportNewName] = useState<string>("");
  const [importMergeId, setImportMergeId] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
  const piles = data.pileOrder
    .map((id) => data.piles[id])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

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
    setImportFileName("");
    setImportMode("new");
    setImportNewName("");
    setImportMergeId("");
    setImportError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      const text = await file.text();
      const parsed = parsePileExport(text);
      if (!parsed) {
        setImportPayload(null);
        setImportFileName(file.name);
        setImportError(
          "That file isn't a wordpile export. Expected a .wordpile.json file with a pile inside.",
        );
        return;
      }
      setImportPayload(parsed);
      setImportFileName(file.name);
      setImportNewName(parsed.pile.name);
      setImportMode("new");
      setImportMergeId(piles[0]?.id ?? "");
    } catch {
      setImportPayload(null);
      setImportFileName(file.name);
      setImportError("Couldn't read that file.");
    }
  }

  function handleConfirmImport() {
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="eyebrow mb-3">A per-community word inventory</p>
      <h1
        className="text-4xl mb-3"
        style={{ fontWeight: 600, lineHeight: 1.1 }}
      >
        Each community gets its own pile of timber.
      </h1>
      <p
        className="text-lg leading-relaxed mb-2"
        style={{ color: "var(--color-stone)", maxWidth: 620 }}
      >
        Every word is a 2x4. Sort it onto one of three stacks:{" "}
        <strong style={{ color: "var(--color-load)" }}>load-bearing</strong>{" "}
        words hold the meaning up,{" "}
        <strong style={{ color: "var(--color-interior)" }}>interior</strong>{" "}
        words are flavor you can swap, and{" "}
        <strong style={{ color: "var(--color-avoid)" }}>avoid</strong> words
        each get a safer alternative. Stop relearning each community's language
        from scratch.
      </p>

      <hr className="divider" />

      <section className="mb-10">
        <p className="eyebrow mb-3">Start a new community pile</p>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            className="input"
            placeholder="e.g. Deer Lake"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="input-new-pile-name"
            autoFocus
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
            title="Load a .wordpile.json file another practitioner shared with you."
          >
            <Upload size={12} /> Import a pile from a file
          </button>
          {importFileName && !importPayload && !importError && (
            <span className="eyebrow">{importFileName}</span>
          )}
        </div>
        {importError && (
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
        )}
        {importPayload && (
          <div
            className="mt-3 rounded p-4 flex flex-col gap-3"
            style={{
              backgroundColor: "var(--color-paper)",
              border: "1px solid var(--color-rule)",
            }}
            data-testid="panel-import-preview"
          >
            <div>
              <p className="eyebrow mb-1">Importing from {importFileName}</p>
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

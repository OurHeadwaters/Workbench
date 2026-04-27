import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useWordpile } from "@/lib/useStore";
import { WordpileStore } from "@/lib/store";

export function PilesPage() {
  const data = useWordpile();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
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

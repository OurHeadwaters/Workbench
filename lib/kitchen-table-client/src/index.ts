/**
 * Kitchen Table client — shared "put it on the kitchen table" helper.
 *
 * Every artifact in the monorepo can drop an item onto the Kitchen Table by
 * calling `putOnKitchenTable()`. The helper POSTs to the open `/api/tasks`
 * endpoint with a `source` (artifact id) so the round-table view can group
 * items artifact-by-artifact without the founder having to ask "where did
 * this come from?".
 *
 * Auth posture:
 *   - Drop is open (no token required).
 *   - Decision-cap routes (PATCH /api/deadhead/intake/:id, etc.) stay
 *     gated by `x-library-owner-token`. This helper never sets that header.
 *
 * Convention (also documented in each artifact's AGENTS.md):
 *   When the user says "put it on the kitchen table", call
 *   `putOnKitchenTable({ title, body?, sourceRef? })` with the current
 *   page's title and (optionally) the doc/page id as `sourceRef`. The
 *   `source` is auto-filled by the artifact-bound client (see
 *   `createKitchenTableClient`).
 */

export interface PutOnKitchenTableInput {
  title: string;
  body?: string;
  sourceRef?: string | null;
}

export interface PutOnKitchenTableArgs extends PutOnKitchenTableInput {
  /**
   * Artifact id, e.g. `artifacts/north-star`. Optional — if omitted, the
   * helper auto-derives it from `import.meta.env.BASE_URL` (Vite) using the
   * monorepo convention `artifacts/<slug>` where `<slug>` matches the
   * artifact's `previewPath`. Pass explicitly only for non-Vite contexts
   * (Expo native, server-side scripts) or to override.
   */
  source?: string;
  /** Base URL. Defaults to '' (same origin). */
  baseUrl?: string;
}

/**
 * Auto-derive the artifact source id from the current build's base URL.
 * Returns `null` when no usable base URL is available (e.g. SSR / Node).
 *
 * Convention (enforced across the monorepo): every web artifact mounts at
 * `/<slug>/` where `<slug>` is the artifact directory name. So
 * `import.meta.env.BASE_URL === "/north-star/"` ⇒ `artifacts/north-star`.
 */
export function deriveSource(): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any).env;
    const base: string | undefined = env?.BASE_URL;
    if (base && typeof base === "string") {
      const slug = base.replace(/^\/+|\/+$/g, "");
      if (slug) return `artifacts/${slug}`;
    }
  } catch {
    // ignore — non-Vite / non-DOM context
  }
  return null;
}

export interface KitchenTableDrop {
  id: string;
  title: string;
  status: string;
  source: string | null;
  sourceRef: string | null;
  createdAt: string;
}

/**
 * Drop an item onto the Kitchen Table. POSTs to `/api/tasks` with the
 * `source` tag preserved. Returns the created task.
 *
 * The `body` parameter (if provided) is appended to the title with a
 * separator so the round-table view sees the full context — the
 * `project_tasks` table only stores a single `title` column today, so we
 * keep this client's API forward-compatible without changing the schema.
 */
export async function putOnKitchenTable(
  args: PutOnKitchenTableArgs,
): Promise<KitchenTableDrop> {
  const { title, body, sourceRef, baseUrl = "" } = args;
  const source = (args.source && args.source.trim()) || deriveSource();
  if (!title || !title.trim()) {
    throw new Error("putOnKitchenTable: title is required");
  }
  if (!source) {
    throw new Error(
      "putOnKitchenTable: source could not be auto-derived (no import.meta.env.BASE_URL); pass `source` explicitly",
    );
  }

  const fullTitle = body && body.trim() ? `${title.trim()} — ${body.trim()}` : title.trim();

  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: fullTitle,
      source,
      sourceRef: sourceRef ?? undefined,
    }),
  });

  if (!res.ok) {
    let msg = `Kitchen Table drop failed (${res.status})`;
    try {
      const json = (await res.json()) as { error?: string };
      if (json?.error) msg = json.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as KitchenTableDrop;
}

/**
 * Bind the helper to a particular artifact so callers don't have to repeat
 * the source on every call.
 *
 *   const client = createKitchenTableClient({ source: 'artifacts/north-star' });
 *   await client.put({ title: 'Reinvestment slide needs net-after framing' });
 */
export function createKitchenTableClient(opts?: { source?: string; baseUrl?: string }): {
  source: string;
  put: (input: PutOnKitchenTableInput) => Promise<KitchenTableDrop>;
} {
  const resolved = (opts?.source && opts.source.trim()) || deriveSource();
  if (!resolved) {
    throw new Error(
      "createKitchenTableClient: source could not be auto-derived; pass `source` explicitly",
    );
  }
  return {
    source: resolved,
    put: (input) =>
      putOnKitchenTable({ ...input, source: resolved, baseUrl: opts?.baseUrl }),
  };
}

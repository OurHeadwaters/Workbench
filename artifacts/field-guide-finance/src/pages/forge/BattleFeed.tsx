import { useState, useEffect } from "react";
import { ForgeNav } from "@/components/forge/ForgeNav";
import { fetchPosts } from "@/data/xFeed";
import { ELEMENT_MAP } from "@/data/forgeData";
import type { XPost } from "@/data/xFeed";

const STORAGE_KEY = "forge:battle-feed-replies";

function loadReplies(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveReplies(replies: Record<string, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(replies));
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

function PostCard({ post }: { post: XPost }) {
  const faction = ELEMENT_MAP[post.factionTag];
  const [replies, setReplies] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const all = loadReplies();
    setReplies(all[post.id] ?? []);
  }, [post.id]);

  function submitReply() {
    const text = draft.trim();
    if (!text) return;
    const all = loadReplies();
    const updated = [...(all[post.id] ?? []), text];
    all[post.id] = updated;
    saveReplies(all);
    setReplies(updated);
    setDraft("");
  }

  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid rgba(255,255,255,0.08)`,
        borderLeft: `3px solid ${faction.color}`,
        backgroundColor: "rgba(255,255,255,0.03)",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src={post.avatarUrl}
          alt={post.displayName}
          width={38}
          height={38}
          style={{ borderRadius: "50%", border: `2px solid ${faction.color}`, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: "var(--forge-light)", fontWeight: 700, fontSize: "0.9rem" }}>
              {post.displayName}
            </span>
            <span style={{ color: "var(--forge-muted)", fontSize: "0.78rem" }}>{post.handle}</span>
            <span style={{ color: "var(--forge-muted)", fontSize: "0.72rem", marginLeft: "auto" }}>
              {formatTimestamp(post.timestamp)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <span style={{ fontSize: 13 }}>{faction.emoji}</span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: faction.color,
              }}
            >
              {faction.factionName}
            </span>
          </div>
        </div>
      </div>

      <p style={{ color: "var(--forge-light)", fontSize: "0.92rem", lineHeight: 1.65, margin: 0 }}>
        {post.body}
      </p>

      <div
        style={{
          borderRadius: 8,
          backgroundColor: `rgba(${hexToRgb(faction.color)},0.07)`,
          border: `1px solid rgba(${hexToRgb(faction.color)},0.2)`,
          padding: "10px 14px",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: faction.color,
            display: "block",
            marginBottom: 4,
          }}
        >
          Battle Provocation
        </span>
        <p style={{ fontSize: "0.82rem", color: "var(--forge-muted)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
          {post.provocationPrompt}
        </p>
      </div>

      {replies.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 16, borderLeft: "2px solid rgba(255,255,255,0.08)" }}>
          {replies.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💬</span>
              <p style={{ fontSize: "0.82rem", color: "var(--forge-muted)", lineHeight: 1.55, margin: 0 }}>{r}</p>
            </div>
          ))}
        </div>
      )}

      {open ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add your commentary…"
            maxLength={500}
            rows={3}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 8,
              color: "var(--forge-light)",
              fontSize: "0.85rem",
              padding: "10px 12px",
              fontFamily: "var(--font-sans)",
              resize: "vertical",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={submitReply}
              disabled={!draft.trim()}
              style={{
                backgroundColor: faction.color,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: draft.trim() ? "pointer" : "not-allowed",
                opacity: draft.trim() ? 1 : 0.5,
                fontFamily: "var(--font-sans)",
              }}
            >
              Post reply
            </button>
            <button
              onClick={() => { setOpen(false); setDraft(""); }}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: "0.8rem",
                color: "var(--forge-muted)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "7px 14px",
            fontSize: "0.78rem",
            color: "var(--forge-muted)",
            cursor: "pointer",
            alignSelf: "flex-start",
            fontFamily: "var(--font-sans)",
          }}
        >
          + Add commentary
        </button>
      )}
    </div>
  );
}

export function BattleFeed() {
  const posts = fetchPosts().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <ForgeNav active="battle-feed" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 72px" }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--forge-orange)",
            marginBottom: 8,
          }}
        >
          The Forge — Battle Feed
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: "var(--forge-light)",
            marginBottom: 8,
          }}
        >
          Battle Feed
        </h1>
        <p style={{ color: "var(--forge-muted)", fontSize: "0.9rem", marginBottom: 8, lineHeight: 1.6, maxWidth: 560 }}>
          Real voices, faction-tagged. Each post is a provocation — a live structural argument playing out in public. Add your commentary and join the reckoning.
        </p>
        <div
          style={{
            display: "inline-flex",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid rgba(255,107,43,0.25)",
            backgroundColor: "rgba(255,107,43,0.07)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--forge-orange)",
            marginBottom: 32,
          }}
        >
          Mock feed — X API swap ready
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

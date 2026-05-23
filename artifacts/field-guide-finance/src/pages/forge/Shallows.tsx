import { useState, useEffect } from "react";
import { ForgeNav } from "@/components/forge/ForgeNav";
import { fetchPosts } from "@/data/xFeed";
import { ELEMENT_MAP } from "@/data/forgeData";
import type { XPost } from "@/data/xFeed";

const STORAGE_KEY = "forge:battle-feed-replies";

interface FlatEntry {
  type: "post" | "reply";
  id: string;
  postId: string;
  timestamp: string;
  content: string;
  post?: XPost;
  replyIndex?: number;
}

function loadReplies(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveReplies(data: Record<string, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export function Shallows() {
  const posts = fetchPosts();
  const [replies, setReplies] = useState<Record<string, string[]>>({});
  const [draft, setDraft] = useState("");
  const [activePostId, setActivePostId] = useState<string | null>(null);

  useEffect(() => {
    setReplies(loadReplies());
  }, []);

  function submitReply(postId: string) {
    const text = draft.trim();
    if (!text) return;
    const all = loadReplies();
    all[postId] = [...(all[postId] ?? []), text];
    saveReplies(all);
    setReplies({ ...all });
    setDraft("");
    setActivePostId(null);
  }

  const entries: FlatEntry[] = [];
  for (const post of posts) {
    entries.push({
      type: "post",
      id: `post-${post.id}`,
      postId: post.id,
      timestamp: post.timestamp,
      content: post.body,
      post,
    });
    const postReplies = replies[post.id] ?? [];
    postReplies.forEach((r, i) => {
      const replyTs = new Date(new Date(post.timestamp).getTime() + (i + 1) * 60_000 * 5).toISOString();
      entries.push({
        type: "reply",
        id: `reply-${post.id}-${i}`,
        postId: post.id,
        timestamp: replyTs,
        content: r,
        post,
        replyIndex: i,
      });
    });
  }

  entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <ForgeNav active="shallows" />
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px" }}>
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
          The Forge — Zone 5
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
          The Shallows
        </h1>
        <p
          style={{
            color: "var(--forge-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            maxWidth: 520,
            marginBottom: 36,
          }}
        >
          A public idea commons. Posts and replies surface chronologically — no ranking, no likes, no algorithm. Wade in. The ideas that matter rise by being returned to.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((entry) => {
            const faction = entry.post ? ELEMENT_MAP[entry.post.factionTag] : null;

            if (entry.type === "post" && entry.post) {
              const post = entry.post;
              const isActive = activePostId === post.id;
              return (
                <div
                  key={entry.id}
                  style={{
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.07)",
                    backgroundColor: "rgba(255,255,255,0.025)",
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                      src={post.avatarUrl}
                      alt={post.displayName}
                      width={30}
                      height={30}
                      style={{ borderRadius: "50%", border: `1.5px solid ${faction?.color ?? "#555"}`, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ color: "var(--forge-light)", fontWeight: 700, fontSize: "0.82rem" }}>
                        {post.displayName}
                      </span>
                      <span style={{ color: "var(--forge-muted)", fontSize: "0.72rem" }}>{post.handle}</span>
                      {faction && (
                        <span
                          style={{
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            color: faction.color,
                            padding: "1px 7px",
                            borderRadius: 4,
                            backgroundColor: `rgba(${hexToRgb(faction.color)},0.1)`,
                          }}
                        >
                          {faction.emoji} {faction.factionName}
                        </span>
                      )}
                      <span style={{ color: "var(--forge-muted)", fontSize: "0.68rem", marginLeft: "auto" }}>
                        {formatTime(post.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: "var(--forge-light)", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
                    {post.body}
                  </p>

                  {isActive ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Add to the commons…"
                        maxLength={500}
                        rows={2}
                        autoFocus
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          borderRadius: 7,
                          color: "var(--forge-light)",
                          fontSize: "0.82rem",
                          padding: "8px 10px",
                          fontFamily: "var(--font-sans)",
                          resize: "vertical",
                          outline: "none",
                        }}
                      />
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => submitReply(post.id)}
                          disabled={!draft.trim()}
                          style={{
                            backgroundColor: faction?.color ?? "var(--forge-orange)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 7,
                            padding: "6px 14px",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            cursor: draft.trim() ? "pointer" : "not-allowed",
                            opacity: draft.trim() ? 1 : 0.5,
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          Share
                        </button>
                        <button
                          onClick={() => { setActivePostId(null); setDraft(""); }}
                          style={{
                            background: "none",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 7,
                            padding: "6px 12px",
                            fontSize: "0.76rem",
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
                      onClick={() => { setActivePostId(post.id); setDraft(""); }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "var(--forge-muted)",
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        alignSelf: "flex-start",
                        fontFamily: "var(--font-sans)",
                        textDecoration: "underline",
                        textDecorationColor: "rgba(255,255,255,0.15)",
                      }}
                    >
                      respond
                    </button>
                  )}
                </div>
              );
            }

            if (entry.type === "reply") {
              return (
                <div
                  key={entry.id}
                  style={{
                    marginLeft: 32,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: "rgba(255,255,255,0.015)",
                    padding: "12px 16px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>💬</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                      <span style={{ color: "var(--forge-muted)", fontSize: "0.7rem", fontWeight: 600 }}>
                        You · replying to {entry.post?.handle}
                      </span>
                      <span style={{ color: "var(--forge-muted)", fontSize: "0.65rem", marginLeft: "auto" }}>
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <p style={{ color: "var(--forge-muted)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                      {entry.content}
                    </p>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        {entries.length === 0 && (
          <p style={{ color: "var(--forge-muted)", fontSize: "0.88rem", textAlign: "center", marginTop: 48 }}>
            The Shallows are quiet. Add a reply in Battle Feed to see it surface here.
          </p>
        )}

        <div
          style={{
            marginTop: 48,
            padding: "16px 20px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <p style={{ color: "var(--forge-muted)", fontSize: "0.78rem", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            The Shallows is Zone 5 of the Crypto Castle — a public idea commons where posts and replies float in chronologically. No algorithmic ranking. No likes. Ideas that matter rise by being returned to.
          </p>
        </div>
      </main>
    </div>
  );
}

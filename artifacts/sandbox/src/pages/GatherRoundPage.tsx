import { useState, useEffect } from "react";
import { api, type SandboxPost, type SandboxHousehold, type SandboxBucket } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Sprout, Plus, Leaf } from "lucide-react";

interface GatherRoundPageProps {
  household: SandboxHousehold;
}

export function GatherRoundPage({ household }: GatherRoundPageProps) {
  const [posts, setPosts] = useState<SandboxPost[]>([]);
  const [bucket, setBucket] = useState<SandboxBucket | null>(null);
  const [newPost, setNewPost] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listBuckets().then((buckets) => {
      const gr = buckets.find((b) => b.isGatherRound);
      if (gr) {
        setBucket(gr);
        api.listPosts(gr.id).then(setPosts);
      }
    });
  }, [household.id]);

  const alreadyPosted = posts.some((p) => p.householdId === household.id);
  const participated = household.gatherRoundParticipated != null;

  const defaultPrompt = "What does your household have this month? What do you need? What can you offer?";
  const promptText = bucket?.promptText?.trim() || defaultPrompt;

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.trim() || !bucket) return;
    setSubmitting(true);
    try {
      const post = await api.createPost(bucket.id, newPost.trim());
      setPosts((p) => [post, ...p]);
      setNewPost("");
      setShowCompose(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await api.deletePost(id);
    setPosts((p) => p.filter((post) => post.id !== id));
  }

  return (
    <div className="min-h-dvh bg-[#FAF6F0]">
      <header className="sticky top-0 bg-[#FAF6F0] border-b border-[#E4D9CC] px-4 py-4 pt-safe-top z-10">
        <div className="flex items-center gap-3">
          <Sprout className="w-5 h-5 text-[#4A6741]" />
          <div>
            <h1 className="text-xl text-[#2E2620]">Gather Round</h1>
            <p className="text-xs text-[#7A6B60]">Monthly neighbourhood readiness prompt</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {participated && (
          <div className="flex items-center gap-2 bg-[#EBF2EA] rounded-xl px-4 py-3 border border-[#4A6741]/30">
            <Leaf className="w-4 h-4 text-[#4A6741]" />
            <p className="text-xs text-[#4A6741] font-medium">
              Your household has contributed this month. Thank you.
            </p>
          </div>
        )}

        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-5">
          <p className="text-xs font-medium text-[#4A3F38] uppercase tracking-wide mb-3">
            This month's prompt
          </p>
          <p className="text-base text-[#2E2620] leading-relaxed font-light" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
            {promptText}
          </p>
        </div>

        {!alreadyPosted && (
          showCompose ? (
            <form onSubmit={handlePost} className="bg-[#FFFDF9] rounded-2xl border border-[#4A6741]/50 p-4">
              <p className="text-xs font-medium text-[#4A3F38] mb-3 uppercase tracking-wide">
                Your household's response
              </p>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share what you have, what you need, or what you can offer the neighbourhood this month…"
                className="w-full bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl p-3 text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A6741] resize-none min-h-[120px]"
                autoFocus
              />
              {error && <p className="text-xs text-[#C7613B] mt-2">{error}</p>}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => { setShowCompose(false); setNewPost(""); setError(""); }}
                  className="flex-1 py-3 border border-[#E4D9CC] rounded-xl text-sm text-[#7A6B60] min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newPost.trim()}
                  className="flex-1 py-3 bg-[#4A6741] text-white rounded-xl text-sm font-medium disabled:opacity-50 min-h-[44px] active:scale-95 transition-all"
                >
                  {submitting ? "Sharing…" : "Share response"}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCompose(true)}
              className="w-full flex items-center gap-3 bg-[#FFFDF9] rounded-2xl border border-[#4A6741]/40 px-4 py-3 min-h-[52px] text-[#7A6B60] hover:border-[#4A6741] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#4A6741]" />
              <span className="text-sm">Share your household's response…</span>
            </button>
          )
        )}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <Sprout className="w-8 h-8 text-[#E4D9CC] mx-auto mb-3" />
            <p className="text-[#7A6B60] text-sm">Nothing shared yet this month.</p>
          </div>
        )}

        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              household={household}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

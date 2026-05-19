import { useState, useEffect } from "react";
import { api, type SandboxPost, type SandboxHousehold } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Plus, AlertTriangle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HeadsUpPageProps {
  household: SandboxHousehold;
}

const SEVENTY_TWO_HOURS = 72 * 60 * 60 * 1000;

export function HeadsUpPage({ household }: HeadsUpPageProps) {
  const [posts, setPosts] = useState<SandboxPost[]>([]);
  const [bucketId, setBucketId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listBuckets().then((buckets) => {
      const hu = buckets.find((b) => b.isHeadsUp);
      if (hu) {
        setBucketId(hu.id);
        api.listPosts(hu.id).then((p) => {
          // Filter out expired (>72h) client-side
          const fresh = p.filter((post) => {
            if (!post.expiresAt) return true;
            return new Date(post.expiresAt).getTime() > Date.now();
          });
          setPosts(fresh);
        });
      }
    });
  }, []);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.trim() || !bucketId) return;
    setSubmitting(true);
    try {
      const post = await api.createPost(bucketId, newPost.trim());
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
      <header className="sticky top-0 bg-[#FAF6F0] border-b border-[#E4D9CC] px-4 pt-safe-top z-10">
        <div className="flex items-center gap-3 py-4">
          <AlertTriangle className="w-5 h-5 text-[#C7913B]" />
          <div>
            <h1 className="text-xl text-[#2E2620]">Heads Up</h1>
            <p className="text-xs text-[#7A6B60]">Voluntary status — posts clear after 72 hours</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-3">
        <div className="bg-[#FFF8EC] rounded-xl border border-[#E4D9CC] p-4 flex gap-3">
          <Info className="w-4 h-4 text-[#C7913B] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#7A6B60] leading-relaxed">
            Post here when your household is on alert — a power outage, a family member away, 
            needing a hand. This is opt-in and never shares your Saltbox status automatically.
          </p>
        </div>

        {showCompose ? (
          <form onSubmit={handlePost} className="bg-[#FFFDF9] rounded-2xl border border-[#C7913B] p-4">
            <p className="text-xs font-medium text-[#4A3F38] mb-3 uppercase tracking-wide">
              Your household status
            </p>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What do your neighbours need to know? Keep it brief and calm."
              className="w-full bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl p-3 text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#C7913B] resize-none min-h-[100px]"
              autoFocus
              maxLength={280}
            />
            <p className="text-xs text-[#7A6B60] mt-1 text-right">{280 - newPost.length} remaining</p>
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
                className="flex-1 py-3 bg-[#C7913B] text-white rounded-xl text-sm font-medium disabled:opacity-50 min-h-[44px] active:scale-95 transition-all"
              >
                {submitting ? "Posting…" : "Post status"}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center gap-3 bg-[#FFF8EC] rounded-2xl border border-[#C7913B]/50 px-4 py-3 min-h-[52px] text-[#7A6B60] hover:border-[#C7913B] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C7913B]" />
            <span className="text-sm">Post a heads up for your household…</span>
          </button>
        )}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#7A6B60] text-sm">No active heads-up posts.</p>
            <p className="text-[#7A6B60] text-xs mt-1">Your neighbourhood is all clear.</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            household={household}
            onDelete={handleDelete}
            isHeadsUp
          />
        ))}
      </main>
    </div>
  );
}

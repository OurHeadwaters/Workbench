import { useState, useEffect, useCallback } from "react";
import { api, type SandboxPost, type SandboxBucket, type SandboxHousehold, type SandboxStandbyEvent } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Plus, ChevronDown, LogOut, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BoardPageProps {
  household: SandboxHousehold;
  onSignOut: () => void;
}

export function BoardPage({ household, onSignOut }: BoardPageProps) {
  const [buckets, setBuckets] = useState<SandboxBucket[]>([]);
  const [posts, setPosts] = useState<SandboxPost[]>([]);
  const [activeBucket, setActiveBucket] = useState<string | null>(null);
  const [standby, setStandby] = useState<SandboxStandbyEvent | null>(null);
  const [newPost, setNewPost] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [b, e] = await Promise.all([api.listBuckets(), api.getActiveStandby()]);
    const regular = b.filter((bk) => !bk.isHeadsUp && !bk.isGatherRound);
    setBuckets(regular);
    setStandby(e);
    if (!activeBucket && regular[0]) setActiveBucket(regular[0].id);
  }, [activeBucket]);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!activeBucket) return;
    api.listPosts(activeBucket).then(setPosts).catch(console.error);
  }, [activeBucket]);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.trim() || !activeBucket) return;
    setSubmitting(true);
    try {
      const post = await api.createPost(activeBucket, newPost.trim());
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

  const currentBucket = buckets.find((b) => b.id === activeBucket);

  return (
    <div className="min-h-dvh bg-[#FAF6F0]">
      <header className="sticky top-0 bg-[#FAF6F0] border-b border-[#E4D9CC] px-4 pt-safe-top z-10">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl text-[#2E2620]">Village Board</h1>
            <p className="text-xs text-[#7A6B60]">{household.name}</p>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 text-[#7A6B60] hover:text-[#C7613B] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {standby && (
          <a href={`${import.meta.env.BASE_URL}standby`} className="flex items-center gap-2 bg-[#F5EAE4] border border-[#C7613B] rounded-xl px-4 py-3 mb-3 min-h-[44px]">
            <AlertCircle className="w-4 h-4 text-[#C7613B] flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#C7613B]">Standby active — {standby.name}</p>
              <p className="text-xs text-[#7A6B60]">Declared {formatDistanceToNow(new Date(standby.declaredAt), { addSuffix: true })}</p>
            </div>
          </a>
        )}

        <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-none">
          {buckets.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBucket(b.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors min-h-[36px] ${
                activeBucket === b.id
                  ? "bg-[#C7613B] text-white"
                  : "bg-[#FFFDF9] border border-[#E4D9CC] text-[#7A6B60]"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-3">
        {showCompose ? (
          <form onSubmit={handlePost} className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-4">
            <p className="text-xs font-medium text-[#4A3F38] mb-3 uppercase tracking-wide">
              Post to {currentBucket?.label}
            </p>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind for the neighbourhood?"
              className="w-full bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl p-3 text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#C7613B] resize-none min-h-[100px]"
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
                className="flex-1 py-3 bg-[#C7613B] text-white rounded-xl text-sm font-medium disabled:opacity-50 min-h-[44px] active:scale-95 transition-all"
              >
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center gap-3 bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] px-4 py-3 min-h-[52px] text-[#7A6B60] hover:border-[#C7613B] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C7613B]" />
            <span className="text-sm">Share something with the neighbourhood…</span>
          </button>
        )}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#7A6B60] text-sm">Nothing posted here yet.</p>
            <p className="text-[#7A6B60] text-xs mt-1">Be the first to share something.</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            household={household}
            onDelete={handleDelete}
          />
        ))}
      </main>
    </div>
  );
}

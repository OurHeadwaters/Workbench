import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import type { SandboxPost, SandboxHousehold } from "@/lib/api";

interface PostCardProps {
  post: SandboxPost;
  household: SandboxHousehold;
  onDelete?: (id: string) => void;
  isHeadsUp?: boolean;
}

export function PostCard({ post, household, onDelete, isHeadsUp }: PostCardProps) {
  const canDelete = household.id === post.householdId || household.isOrganizer;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div className={`bg-[#FFFDF9] rounded-xl border p-4 ${isHeadsUp ? "border-[#C7913B] bg-[#FFF8EC]" : "border-[#E4D9CC]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${isHeadsUp ? "bg-[#F5D99C] text-[#7A4F1A]" : "bg-[#E4D9CC] text-[#4A3F38]"}`}>
              {post.householdName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-sm font-medium text-[#2E2620]">{post.householdName}</span>
              <span className="text-xs text-[#7A6B60] ml-2">{timeAgo}</span>
            </div>
          </div>
          <p className="text-sm text-[#2E2620] leading-relaxed">{post.body}</p>
        </div>
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-[#7A6B60] hover:text-[#C7613B] rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

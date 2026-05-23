import { type NurseryIdea, type IdeaStage } from "../lib/api";
import { formatDistanceToNow } from "date-fns";

interface IdeaCardProps {
  idea: NurseryIdea;
  onClick: () => void;
}

const STAGE_STYLES: Record<IdeaStage | "draft", { bg: string; border: string; badge: string; dot: string }> = {
  nursery: {
    bg: "bg-[#F7FCF8]",
    border: "border-[#B8D9C3]",
    badge: "bg-[#EBF3EE] text-[#4A7C59]",
    dot: "bg-[#4A7C59]",
  },
  fodder: {
    bg: "bg-[#FFF9F6]",
    border: "border-[#F5C9B3]",
    badge: "bg-[#FEF3EE] text-[#C7613B]",
    dot: "bg-[#C7613B]",
  },
  fallow: {
    bg: "bg-[#F8FAF8]",
    border: "border-[#BDD4C1]",
    badge: "bg-[#EFF4F0] text-[#6B8F71]",
    dot: "bg-[#6B8F71]",
  },
  graduated: {
    bg: "bg-[#F8F8F8]",
    border: "border-[#C8C8C8]",
    badge: "bg-[#F0F0F0] text-[#3D3D3D]",
    dot: "bg-[#3D3D3D]",
  },
  draft: {
    bg: "bg-[#FFFDF9]",
    border: "border-[#E4D9CC]",
    badge: "bg-[#F0E9DF] text-[#7A6B60]",
    dot: "bg-[#A89A8E]",
  },
};

const STAGE_LABELS: Record<IdeaStage, string> = {
  nursery: "Nursery",
  fodder: "Fodder",
  fallow: "Fallow",
  graduated: "Graduated",
};

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const stageKey = idea.isDraft ? "draft" : idea.stage;
  const styles = STAGE_STYLES[stageKey];
  const label = idea.isDraft ? "Draft · awaiting review" : STAGE_LABELS[idea.stage];

  const lastActivity = idea.updatedAt || idea.createdAt;
  const timeAgo = formatDistanceToNow(new Date(lastActivity), { addSuffix: true });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border ${styles.bg} ${styles.border} hover:shadow-sm transition-all group`}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
          {label}
        </span>
      </div>

      <h4 className="text-[#2E2620] font-['Fraunces',serif] text-base leading-snug mb-1.5 group-hover:text-[#4A7C59] transition-colors line-clamp-2">
        {idea.title}
      </h4>

      {idea.vernacularName && (
        <p className="text-xs text-[#7A6B60] italic mb-2 line-clamp-1">"{idea.vernacularName}"</p>
      )}

      {idea.problemStatement && (
        <p className="text-xs text-[#7A6B60] line-clamp-2 mb-3">{idea.problemStatement}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#E4D9CC]/60">
        <span className="text-xs text-[#A89A8E]">{idea.createdByProducerName}</span>
        <span className="text-xs text-[#A89A8E]">{timeAgo}</span>
      </div>
    </button>
  );
}

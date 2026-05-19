import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { formatDate } from "@/lib/utils";
import { ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS, type ActivityType } from "@/lib/types";
import { ChevronRight } from "lucide-react";

const ACTIVITY_PATHS: Record<ActivityType, string> = {
  blackout_kit: "/activities/blackout-kit",
  junk_hunt: "/activities/junk-hunt",
  fire_escape: "/activities/fire-escape",
  gather_round: "/activities/gather-round",
};

const ACTIVITY_ORDER: ActivityType[] = ["blackout_kit", "junk_hunt", "fire_escape", "gather_round"];

export function ActivitiesPage() {
  const [, navigate] = useLocation();
  const { readiness, familyMembers } = useGatherStore();
  const { activitiesCompleted } = readiness;

  const getLastCompletion = (type: ActivityType) => {
    const completions = activitiesCompleted.filter((a) => a.activityType === type);
    if (completions.length === 0) return null;
    return completions.sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  };

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader title="The Mall" subtitle="Preparedness activities" />

      <div className="px-4 pt-4 space-y-3">
        <p className="text-sm text-[#7A6B60]">
          These activities build your household's readiness, one at a time. No hurry — pick one when it feels right.
        </p>

        {ACTIVITY_ORDER.map((type) => {
          const last = getLastCompletion(type);
          return (
            <button
              key={type}
              onClick={() => navigate(ACTIVITY_PATHS[type])}
              className="w-full text-left rounded-xl bg-white border border-[#E4D9CC] p-4 hover:border-[#C7613B]/40 transition-all min-h-[80px]"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2E2620] text-base">{ACTIVITY_LABELS[type]}</p>
                  <p className="text-sm text-[#7A6B60] mt-0.5 leading-snug">{ACTIVITY_DESCRIPTIONS[type]}</p>
                  {last && (
                    <p className="text-xs text-[#4A6741] mt-1.5">
                      Last done: {formatDate(last.completedAt)}
                    </p>
                  )}
                </div>
                <ChevronRight size={18} className="text-[#C4B4A0] flex-shrink-0" />
              </div>
            </button>
          );
        })}

        {activitiesCompleted.length > 0 && (
          <section className="pt-2">
            <h2 className="text-sm font-medium text-[#4A3F38] mb-3">History</h2>
            <div className="space-y-2">
              {[...activitiesCompleted]
                .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
                .slice(0, 10)
                .map((a) => {
                  const leaders = a.ledByIds
                    .map((id) => familyMembers.find((m) => m.id === id)?.name)
                    .filter(Boolean);
                  return (
                    <div key={a.id} className="py-2 border-b border-[#E4D9CC] last:border-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#2E2620]">{ACTIVITY_LABELS[a.activityType]}</p>
                        <p className="text-xs text-[#7A6B60]">{formatDate(a.completedAt)}</p>
                      </div>
                      {leaders.length > 0 && (
                        <p className="text-xs text-[#7A6B60] mt-0.5">Led by {leaders.join(", ")}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

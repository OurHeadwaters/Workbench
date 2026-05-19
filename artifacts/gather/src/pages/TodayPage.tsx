import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useLocation } from "wouter";
import type { StandbyStatus } from "@/lib/types";
import { formatDate, daysSince } from "@/lib/utils";

const STATUS_OPTIONS: { value: StandbyStatus; label: string; desc: string }[] = [
  { value: "everyday", label: "Everyday", desc: "Normal days — everything as usual" },
  { value: "headsup", label: "Heads Up", desc: "Something may be coming — good time to check in" },
  { value: "standby", label: "Standby", desc: "Ready mode — roles are active" },
];

export function TodayPage() {
  const [, navigate] = useLocation();
  const { familyMembers, readiness, setStatus } = useGatherStore();
  const { status, roles, kitItems, activitiesCompleted } = readiness;

  const isHeightened = status === "headsup" || status === "standby";

  const getMemberRoles = (memberId: string) => {
    const member = familyMembers.find((m) => m.id === memberId);
    if (!member) return [];
    return member.roleIds.map((rid) => roles.find((r) => r.id === rid)).filter(Boolean);
  };

  const lastActivity = activitiesCompleted.length > 0
    ? activitiesCompleted[activitiesCompleted.length - 1]
    : null;

  const kitCheckSummary = (() => {
    if (kitItems.length === 0) return null;
    const checked = kitItems.filter((i) => i.lastCheckedDate !== null);
    const oldest = kitItems
      .filter((i) => i.lastCheckedDate)
      .sort((a, b) => (a.lastCheckedDate! < b.lastCheckedDate! ? -1 : 1))[0];
    return { total: kitItems.length, checked: checked.length, oldest: oldest ?? null };
  })();

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader
        title="Saltbox"
        action={
          <button
            onClick={() => navigate("/settings")}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7A6B60] hover:text-[#2E2620]"
          >
            <Settings size={20} />
          </button>
        }
      />

      <div className="px-4 pt-4 space-y-5">
        {/* Status Toggle */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[#4A3F38]">Standby Protocol</p>
            <StatusBadge status={status} />
          </div>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-all min-h-[44px] ${
                  status === opt.value
                    ? opt.value === "standby"
                      ? "bg-[#C7613B] border-[#C7613B] text-white"
                      : opt.value === "headsup"
                      ? "bg-[#FFF0D6] border-[#C7913B] text-[#7A4A00]"
                      : "bg-[#E4D9CC] border-[#E4D9CC] text-[#2E2620]"
                    : "bg-transparent border-[#E4D9CC] text-[#7A6B60] hover:border-[#C7613B]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {isHeightened && (
            <p className="text-xs text-[#7A6B60] mt-2 px-1">
              {status === "standby"
                ? "Standby is active. Each person's role is shown below."
                : "Heads Up is on. Good time to review roles and check the kit."}
            </p>
          )}
        </section>

        {/* Role Cards — float up when heightened */}
        {familyMembers.length > 0 && (
          <section>
            {isHeightened && (
              <h2 className="text-base text-[#2E2620] mb-3">
                {status === "standby" ? "Active roles" : "Household roles"}
              </h2>
            )}
            <div className="space-y-2">
              {isHeightened
                ? familyMembers
                    .filter((m) => m.roleIds.length > 0)
                    .map((member) => {
                      const memberRoles = getMemberRoles(member.id);
                      return (
                        <div
                          key={member.id}
                          className="rounded-xl border border-[#C7613B]/20 bg-[#FFF8F3] p-3"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar name={member.name} color={member.avatarColor} size="sm" />
                            <div>
                              <p className="font-medium text-sm text-[#2E2620]">{member.name}</p>
                              <p className="text-xs text-[#7A6B60]">
                                {member.ageGroup === "adult" ? "Adult" : member.ageGroup === "teen" ? "Teen" : "Child"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {memberRoles.map((role) => role && (
                              <div key={role.id}>
                                <span className="text-xs bg-[#E4D9CC] text-[#4A3F38] px-2 py-0.5 rounded-full">
                                  {role.name}
                                </span>
                                <p className="text-xs text-[#7A6B60] mt-1.5 leading-relaxed">
                                  {member.ageGroup === "child"
                                    ? role.childDescription
                                    : role.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                : familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 py-1">
                      <Avatar name={member.name} color={member.avatarColor} size="sm" />
                      <p className="text-sm text-[#2E2620]">{member.name}</p>
                      {member.roleIds.length > 0 && (
                        <span className="text-xs text-[#7A6B60] ml-auto">
                          {member.roleIds.length} role{member.roleIds.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  ))}
            </div>
          </section>
        )}

        {/* Quick glance summary */}
        <section className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl bg-white border border-[#E4D9CC] p-3 cursor-pointer hover:border-[#C7613B]/40 transition-colors"
            onClick={() => navigate("/kit")}
          >
            <p className="text-xs text-[#7A6B60] mb-1">Kit</p>
            {kitCheckSummary ? (
              <>
                <p className="text-base font-medium text-[#2E2620]">
                  {kitCheckSummary.checked}/{kitCheckSummary.total} checked
                </p>
                {kitCheckSummary.oldest && (
                  <p className="text-xs text-[#7A6B60] mt-0.5">
                    Oldest: {daysSince(kitCheckSummary.oldest.lastCheckedDate) ?? "—"}d ago
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-[#7A6B60]">Not started</p>
            )}
          </div>

          <div
            className="rounded-xl bg-white border border-[#E4D9CC] p-3 cursor-pointer hover:border-[#C7613B]/40 transition-colors"
            onClick={() => navigate("/activities")}
          >
            <p className="text-xs text-[#7A6B60] mb-1">Activities</p>
            {lastActivity ? (
              <>
                <p className="text-base font-medium text-[#2E2620]">
                  {activitiesCompleted.length} done
                </p>
                <p className="text-xs text-[#7A6B60] mt-0.5">
                  Last: {formatDate(lastActivity.completedAt)}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#7A6B60]">None yet</p>
            )}
          </div>
        </section>

        {/* Empty state CTA */}
        {familyMembers.length === 0 && (
          <div className="rounded-xl bg-[#F0E9DF] border border-[#E4D9CC] p-5 text-center">
            <h2 className="text-lg text-[#2E2620] mb-2">Welcome to Saltbox</h2>
            <p className="text-sm text-[#7A6B60] mb-4">
              Start by adding your family members, then assign roles and build your kit.
            </p>
            <Button onClick={() => navigate("/family")} variant="primary">
              Add family members
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

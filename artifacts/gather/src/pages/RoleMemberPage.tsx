import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { useParams } from "wouter";

export function RoleMemberPage() {
  const params = useParams<{ roleId: string; memberId: string }>();
  const { readiness, familyMembers } = useGatherStore();

  const role = readiness.roles.find((r) => r.id === params.roleId);
  const member = familyMembers.find((m) => m.id === params.memberId);

  if (!role || !member) {
    return (
      <div className="max-w-md mx-auto pb-24">
        <PageHeader title="Role" back="/roles" />
        <div className="px-4 pt-8 text-center text-[#7A6B60]">Role or member not found.</div>
      </div>
    );
  }

  const isChild = member.ageGroup === "child";
  const displayText = isChild ? role.childDescription : role.description;

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader title={role.name} back="/roles" />
      <div className="px-4 pt-6 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={member.name} color={member.avatarColor} size="lg" />
          <div>
            <h2 className="text-2xl text-[#2E2620]">{member.name}</h2>
            <p className="text-sm text-[#7A6B60] capitalize">{member.ageGroup}</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#F0E9DF] border border-[#E4D9CC] p-5">
          <p className="text-lg leading-relaxed text-[#2E2620]">{displayText}</p>
        </div>

        {isChild && (
          <div className="rounded-xl bg-[#4A6741]/10 border border-[#4A6741]/20 p-4">
            <p className="text-sm font-medium text-[#4A6741] mb-1">Why this matters</p>
            <p className="text-sm text-[#4A3F38]">
              Every family works better when everyone knows their part. {member.name}'s role as {role.name} is real — not pretend, not practice. It matters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

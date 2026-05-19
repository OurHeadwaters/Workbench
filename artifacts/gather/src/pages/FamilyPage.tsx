import { useState } from "react";
import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { AVATAR_COLORS } from "@/lib/types";
import type { AgeGroup, FamilyMember } from "@/lib/types";

interface MemberFormProps {
  initial?: Partial<FamilyMember>;
  onSave: (data: { name: string; ageGroup: AgeGroup; avatarColor: string }) => void;
  onCancel: () => void;
}

function MemberForm({ initial, onSave, onCancel }: MemberFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(initial?.ageGroup ?? "adult");
  const [color, setColor] = useState(initial?.avatarColor ?? AVATAR_COLORS[0]);

  return (
    <div className="rounded-xl border border-[#C7613B]/30 bg-[#FFF8F3] p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#4A3F38] mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4A3F38] mb-2">Age range</label>
        <div className="flex gap-2">
          {(["child", "teen", "adult"] as AgeGroup[]).map((ag) => (
            <button
              key={ag}
              onClick={() => setAgeGroup(ag)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all min-h-[44px] capitalize ${
                ageGroup === ag
                  ? "bg-[#C7613B] border-[#C7613B] text-white"
                  : "border-[#E4D9CC] text-[#7A6B60] hover:border-[#C7613B]"
              }`}
            >
              {ag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4A3F38] mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === c ? "border-[#2E2620] scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => name.trim() && onSave({ name: name.trim(), ageGroup, avatarColor: color })}
          disabled={!name.trim()}
          className="flex-1"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export function FamilyPage() {
  const { familyMembers, addFamilyMember, updateFamilyMember, removeFamilyMember } = useGatherStore();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader
        title="Family"
        subtitle={familyMembers.length > 0 ? `${familyMembers.length} member${familyMembers.length !== 1 ? "s" : ""}` : undefined}
        action={
          !adding && !editingId ? (
            <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
              <Plus size={18} className="mr-1" /> Add
            </Button>
          ) : null
        }
      />

      <div className="px-4 pt-4 space-y-3">
        {adding && (
          <MemberForm
            onSave={(data) => { addFamilyMember({ ...data, roleIds: [] }); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        )}

        {familyMembers.length === 0 && !adding && (
          <EmptyState
            icon={Users}
            title="No family members yet"
            description="Add parents and children here. Roles attach to these people."
            action={<Button variant="primary" onClick={() => setAdding(true)}>Add first member</Button>}
          />
        )}

        {familyMembers.map((member) => (
          <div key={member.id}>
            {editingId === member.id ? (
              <MemberForm
                initial={member}
                onSave={(data) => { updateFamilyMember(member.id, data); setEditingId(null); }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-white border border-[#E4D9CC] px-3 py-3">
                <Avatar name={member.name} color={member.avatarColor} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2E2620]">{member.name}</p>
                  <p className="text-sm text-[#7A6B60] capitalize">
                    {member.ageGroup}
                    {member.roleIds.length > 0 && ` · ${member.roleIds.length} role${member.roleIds.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <button
                  onClick={() => setEditingId(member.id)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7A6B60] hover:text-[#2E2620]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => removeFamilyMember(member.id)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7A6B60] hover:text-[#C7613B]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

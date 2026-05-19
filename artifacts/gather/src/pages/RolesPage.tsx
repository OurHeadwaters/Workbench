import { useState } from "react";
import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Plus, ChevronDown, ChevronUp, Shield, Trash2, Check, Pencil } from "lucide-react";
import type { StandbyRole } from "@/lib/types";
import { useLocation } from "wouter";

function RoleCard({ role }: { role: StandbyRole }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(role.name);
  const [editDesc, setEditDesc] = useState(role.description);
  const [editChildDesc, setEditChildDesc] = useState(role.childDescription);
  const [, navigate] = useLocation();
  const { familyMembers, assignRole, unassignRole, removeRole, updateRole } = useGatherStore();

  const assignedMembers = familyMembers.filter((m) => m.roleIds.includes(role.id));
  const unassignedMembers = familyMembers.filter((m) => !m.roleIds.includes(role.id));

  return (
    <div className="rounded-xl bg-white border border-[#E4D9CC] overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left min-h-[56px]"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="w-9 h-9 rounded-full bg-[#E4D9CC] flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-[#7A6B60]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#2E2620] text-sm">{role.name}</p>
          <p className="text-xs text-[#7A6B60]">
            {assignedMembers.length > 0
              ? assignedMembers.map((m) => m.name).join(", ")
              : "No one assigned"}
          </p>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-[#7A6B60] flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-[#7A6B60] flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#E4D9CC] space-y-4">
          {editing ? (
            <div className="pt-3 space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Role name"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base"
              />
              <div>
                <p className="text-xs text-[#7A6B60] mb-1">Description (adults &amp; teens)</p>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base resize-none"
                />
              </div>
              <div>
                <p className="text-xs text-[#7A6B60] mb-1">Description (children — first person)</p>
                <textarea
                  value={editChildDesc}
                  onChange={(e) => setEditChildDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => { setEditing(false); setEditName(role.name); setEditDesc(role.description); setEditChildDesc(role.childDescription); }} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={!editName.trim()}
                  onClick={() => {
                    updateRole(role.id, { name: editName.trim(), description: editDesc.trim(), childDescription: editChildDesc.trim() });
                    setEditing(false);
                  }}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#7A6B60] pt-3">{role.description}</p>

              {familyMembers.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#4A3F38] mb-2">Assign to</p>
                  <div className="space-y-2">
                    {familyMembers.map((member) => {
                      const assigned = member.roleIds.includes(role.id);
                      return (
                        <button
                          key={member.id}
                          onClick={() =>
                            assigned
                              ? unassignRole(member.id, role.id)
                              : assignRole(member.id, role.id)
                          }
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F0EB] transition-colors min-h-[44px]"
                        >
                          <Avatar name={member.name} color={member.avatarColor} size="sm" />
                          <span className="flex-1 text-sm text-left text-[#2E2620]">{member.name}</span>
                          {assigned && (
                            <span className="w-5 h-5 rounded-full bg-[#4A6741] flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {assignedMembers.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#4A3F38] mb-2">Role view</p>
                  <div className="space-y-2">
                    {assignedMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => navigate(`/roles/${role.id}/member/${member.id}`)}
                        className="w-full text-left text-sm text-[#C7613B] hover:underline min-h-[44px] flex items-center"
                      >
                        View {member.name}'s role card →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs text-[#7A6B60] hover:text-[#2E2620] min-h-[44px] transition-colors"
                >
                  <Pencil size={14} /> Edit role
                </button>
                {!role.isBuiltIn && (
                  <button
                    onClick={() => removeRole(role.id)}
                    className="flex items-center gap-1.5 text-xs text-[#7A6B60] hover:text-[#C7613B] min-h-[44px] transition-colors"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function RolesPage() {
  const { readiness } = useGatherStore();
  const [addingRole, setAddingRole] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const { addRole } = useGatherStore();

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader
        title="Roles"
        subtitle="Who does what when it matters"
        action={
          !addingRole ? (
            <Button variant="ghost" size="sm" onClick={() => setAddingRole(true)}>
              <Plus size={18} className="mr-1" /> Custom
            </Button>
          ) : null
        }
      />

      <div className="px-4 pt-4 space-y-3">
        {addingRole && (
          <div className="rounded-xl border border-[#C7613B]/30 bg-[#FFF8F3] p-4 space-y-3">
            <p className="text-sm font-medium text-[#4A3F38]">New role</p>
            <input
              type="text"
              placeholder="Role name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base"
            />
            <textarea
              placeholder="What does this role involve? (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base resize-none"
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setAddingRole(false); setNewName(""); setNewDesc(""); }} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!newName.trim()}
                onClick={() => {
                  addRole({ name: newName.trim(), description: newDesc.trim(), childDescription: newDesc.trim() });
                  setAddingRole(false);
                  setNewName("");
                  setNewDesc("");
                }}
                className="flex-1"
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {readiness.roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
}

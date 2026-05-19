import { useState } from "react";
import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Plus, Check, Pencil, Trash2, Package } from "lucide-react";
import { formatDate, daysSince } from "@/lib/utils";
import type { KitItem } from "@/lib/types";

interface ItemFormProps {
  initial?: Partial<KitItem>;
  roleId: string;
  onSave: (data: Omit<KitItem, "id" | "lastCheckedDate" | "lastCheckedById">) => void;
  onCancel: () => void;
}

function ItemForm({ initial, roleId, onSave, onCancel }: ItemFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? "1"));
  const [location, setLocation] = useState(initial?.location ?? "");

  return (
    <div className="rounded-xl border border-[#C7613B]/30 bg-[#FFF8F3] p-4 space-y-3">
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base"
      />
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          className="w-20 px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base"
        />
        <input
          type="text"
          placeholder="Where is it? (e.g. hall closet)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-base"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button
          variant="primary"
          disabled={!name.trim()}
          onClick={() => onSave({ name: name.trim(), quantity: parseInt(quantity) || 1, location: location.trim(), roleId })}
          className="flex-1"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function KitItemRow({ item }: { item: KitItem }) {
  const { updateKitItem, removeKitItem, checkKitItem, familyMembers } = useGatherStore();
  const [editing, setEditing] = useState(false);
  const days = daysSince(item.lastCheckedDate);
  const stale = days !== null && days > 30;

  if (editing) {
    return (
      <ItemForm
        initial={item}
        roleId={item.roleId}
        onSave={(data) => { updateKitItem(item.id, data); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className={`rounded-lg border px-3 py-3 flex items-start gap-3 ${stale ? "border-[#C7913B]/40 bg-[#FFF8F3]" : "border-[#E4D9CC] bg-white"}`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#2E2620]">
          {item.name}
          {item.quantity > 1 && <span className="text-[#7A6B60] font-normal"> ×{item.quantity}</span>}
        </p>
        {item.location && (
          <p className="text-xs text-[#7A6B60] mt-0.5">{item.location}</p>
        )}
        <p className={`text-xs mt-0.5 ${stale ? "text-[#C7613B]" : "text-[#7A6B60]"}`}>
          Checked: {formatDate(item.lastCheckedDate)}
          {stale && " — overdue"}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => checkKitItem(item.id, familyMembers[0]?.id ?? "unknown")}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#4A6741] hover:bg-[#4A6741]/10 rounded-lg transition-colors"
          title="Mark as checked"
        >
          <Check size={16} />
        </button>
        <button
          onClick={() => setEditing(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7A6B60] hover:text-[#2E2620] transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => removeKitItem(item.id)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7A6B60] hover:text-[#C7613B] transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export function KitPage() {
  const { readiness, familyMembers, addKitItem, checkAllRoleItems } = useGatherStore();
  const { roles, kitItems } = readiness;
  const [addingToRole, setAddingToRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const getItemsForRole = (roleId: string) => kitItems.filter((i) => i.roleId === roleId);

  const rolesWithItems = roles.filter((r) => getItemsForRole(r.id).length > 0);
  const displayRoles = activeTab === "all" ? rolesWithItems : roles.filter((r) => r.id === activeTab);

  const checkerMember = familyMembers[0];

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader
        title="Kit"
        subtitle={kitItems.length > 0 ? `${kitItems.length} items across ${rolesWithItems.length} roles` : undefined}
      />

      {/* Role filter tabs */}
      {rolesWithItems.length > 1 && (
        <div className="overflow-x-auto scrollbar-none px-4 pt-3">
          <div className="flex gap-2 pb-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all min-h-[36px] ${
                activeTab === "all"
                  ? "bg-[#C7613B] border-[#C7613B] text-white"
                  : "border-[#E4D9CC] text-[#7A6B60]"
              }`}
            >
              All
            </button>
            {rolesWithItems.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all min-h-[36px] ${
                  activeTab === role.id
                    ? "bg-[#C7613B] border-[#C7613B] text-white"
                    : "border-[#E4D9CC] text-[#7A6B60]"
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pt-4 space-y-5">
        {kitItems.length === 0 && !addingToRole && (
          <EmptyState
            icon={Package}
            title="Kit is empty"
            description="Add items to your kit organized by role. Start with the Blackout Kit Build activity to get going."
            action={
              <Button variant="primary" onClick={() => setAddingToRole(roles[1]?.id ?? roles[0]?.id ?? "light_tender")}>
                Add first item
              </Button>
            }
          />
        )}

        {/* Per-role sections */}
        {roles.map((role) => {
          const items = getItemsForRole(role.id);
          const visible = activeTab === "all" || activeTab === role.id;
          if (!visible || (items.length === 0 && addingToRole !== role.id)) return null;

          const assignedMembers = familyMembers.filter((m) => m.roleIds.includes(role.id));

          return (
            <section key={role.id}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-base text-[#2E2620]">{role.name}</h2>
                  {assignedMembers.length > 0 && (
                    <p className="text-xs text-[#7A6B60]">
                      {assignedMembers.map((m) => m.name).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {items.length > 0 && checkerMember && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => checkAllRoleItems(role.id, checkerMember.id)}
                    >
                      <Check size={14} className="mr-1" /> Check all
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddingToRole(role.id)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>

              {addingToRole === role.id && (
                <div className="mb-2">
                  <ItemForm
                    roleId={role.id}
                    onSave={(data) => {
                      addKitItem({ ...data, lastCheckedDate: null, lastCheckedById: null });
                      setAddingToRole(null);
                    }}
                    onCancel={() => setAddingToRole(null)}
                  />
                </div>
              )}

              <div className="space-y-2">
                {items.map((item) => <KitItemRow key={item.id} item={item} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

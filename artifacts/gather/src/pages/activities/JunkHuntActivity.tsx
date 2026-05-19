import { useState } from "react";
import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { todayString } from "@/lib/utils";

interface HuntItem {
  id: string;
  name: string;
  found: boolean;
  addedDuringHunt: boolean;
}

const STARTER_ITEMS = [
  "Old birthday candles",
  "Spare batteries (any size)",
  "A hand crank or wind-up device",
  "A deck of cards",
  "A camping pot or tin can",
  "A rope or bungee cord",
  "A manual can opener",
  "Any kind of tape (duct, masking)",
  "A rain poncho",
  "An extra pair of shoes near the door",
  "A foil emergency blanket",
  "Any kind of whistle",
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function JunkHuntActivity() {
  const [, navigate] = useLocation();
  const { familyMembers, addKitItem, logActivity } = useGatherStore();

  const [items, setItems] = useState<HuntItem[]>(() =>
    STARTER_ITEMS.map((name) => ({ id: generateId(), name, found: false, addedDuringHunt: false }))
  );
  const [newItem, setNewItem] = useState("");
  const [completed, setCompleted] = useState(false);

  function toggleItem(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, found: !i.found } : i));
  }

  function addItem() {
    if (!newItem.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: generateId(), name: newItem.trim(), found: true, addedDuringHunt: true },
    ]);
    setNewItem("");
  }

  const foundItems = items.filter((i) => i.found);

  function handleComplete() {
    const today = todayString();
    foundItems.forEach((item) => {
      addKitItem({
        name: item.name,
        quantity: 1,
        location: "from junk hunt",
        roleId: "light_tender",
        lastCheckedDate: today,
        lastCheckedById: familyMembers[0]?.id ?? "",
        source: "scavenged",
      });
    });

    logActivity({
      activityType: "junk_hunt",
      completedAt: new Date().toISOString(),
      ledByIds: familyMembers.map((m) => m.id),
      notes: `Found ${foundItems.length} items`,
    });

    setCompleted(true);
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto pb-24">
        <PageHeader title="Junk Scavenger Hunt" back="/activities" />
        <div className="px-4 pt-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#4A6741]/15 flex items-center justify-center mx-auto">
            <Check size={28} className="text-[#4A6741]" />
          </div>
          <h2 className="text-2xl text-[#2E2620]">Hunt complete.</h2>
          <p className="text-[#7A6B60] text-sm max-w-xs mx-auto">
            {foundItems.length} item{foundItems.length !== 1 ? "s" : ""} added to your kit. Good finds.
          </p>
          <Button variant="moss" onClick={() => navigate("/activities")}>
            Back to activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader title="Junk Scavenger Hunt" back="/activities" />

      <div className="px-4 pt-4 space-y-5">
        <div className="bg-[#FFF8F3] rounded-xl p-4 border border-[#E4D9CC]">
          <p className="text-sm text-[#4A3F38] font-medium mb-1">The game</p>
          <p className="text-sm text-[#7A6B60]">
            Tear through the whole house. Find as many things on this list as you can.
            Spot something useful that isn't on the list? Add it. No wrong answers.
          </p>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all min-h-[52px] ${
                item.found
                  ? "bg-[#F0F5EE] border-[#4A6741]/30"
                  : "bg-white border-[#E4D9CC] hover:border-[#C7613B]/30"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  item.found ? "bg-[#4A6741] border-[#4A6741]" : "border-[#C4B4A0]"
                }`}
              >
                {item.found && <Check size={12} className="text-white" />}
              </div>
              <span className={`text-sm flex-1 ${item.found ? "text-[#7A6B60] line-through" : "text-[#2E2620]"}`}>
                {item.name}
              </span>
              {item.addedDuringHunt && (
                <span className="text-xs text-[#C7613B] flex-shrink-0">found!</span>
              )}
            </button>
          ))}
        </div>

        {/* Add found item */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Found something else? Add it here..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="flex-1 px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-sm"
          />
          <button
            onClick={addItem}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C7613B] hover:bg-[#FFF8F3] rounded-lg border border-[#E4D9CC]"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="pt-1">
          <p className="text-sm text-[#7A6B60] mb-3">
            Found so far: <span className="text-[#4A6741] font-medium">{foundItems.length}</span> item{foundItems.length !== 1 ? "s" : ""}
          </p>
          <Button
            variant="moss"
            className="w-full"
            disabled={foundItems.length === 0}
            onClick={handleComplete}
          >
            Log what we found
          </Button>
        </div>
      </div>
    </div>
  );
}

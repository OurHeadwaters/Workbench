import { useState } from "react";
import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Check, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { Avatar } from "@/components/Avatar";
import { todayString } from "@/lib/utils";

interface Step {
  id: string;
  childInstruction: string;
  parentRationale: string;
  itemName: string;
  done: boolean;
}

const DEFAULT_STEPS: Omit<Step, "id" | "done">[] = [
  {
    childInstruction: "Find every flashlight in the house and put them on the kitchen table.",
    parentRationale: "Consolidating light sources first so you know what you have before building out the kit.",
    itemName: "Flashlights",
  },
  {
    childInstruction: "Check each flashlight — does it turn on? If the batteries are weak, find new ones.",
    parentRationale: "Dead batteries are the #1 reason blackout kits fail. Replace anything below 50%.",
    itemName: "Flashlight batteries",
  },
  {
    childInstruction: "Find any candles and put them in one spot — plus matches or a lighter nearby.",
    parentRationale: "Candles provide sustained ambient light. Keep fire starters co-located.",
    itemName: "Candles + fire starters",
  },
  {
    childInstruction: "Find a portable phone charger (power bank) or a hand-crank radio if you have one.",
    parentRationale: "Communication devices matter most in extended outages. Charge the power bank now.",
    itemName: "Power bank / radio",
  },
  {
    childInstruction: "Find one deck of cards or a board game that doesn't need power.",
    parentRationale: "Long blackouts need calm activities for kids. One good option is enough.",
    itemName: "Non-power game",
  },
  {
    childInstruction: "Fill the two biggest pots you own with water and put lids on them.",
    parentRationale: "Tap water may become unavailable. 10L+ is a good buffer for a family overnight.",
    itemName: "Water storage",
  },
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function BlackoutKitActivity() {
  const [, navigate] = useLocation();
  const { familyMembers, addKitItem, logActivity } = useGatherStore();

  const [steps, setSteps] = useState<Step[]>(() =>
    DEFAULT_STEPS.map((s) => ({ ...s, id: generateId(), done: false }))
  );
  const [selectedLeaders, setSelectedLeaders] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);
  const [newChild, setNewChild] = useState("");
  const [showParent, setShowParent] = useState<string | null>(null);

  const lightTenders = familyMembers.filter((m) => m.roleIds.includes("light_tender"));
  const allDone = steps.every((s) => s.done);

  function toggleStep(id: string) {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, done: !s.done } : s));
  }

  function addStep() {
    if (!newChild.trim()) return;
    setSteps((prev) => [
      ...prev,
      { id: generateId(), childInstruction: newChild.trim(), parentRationale: "", itemName: newChild.trim(), done: false },
    ]);
    setNewChild("");
  }

  function removeStep(id: string) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }

  function handleComplete() {
    const today = todayString();
    steps.filter((s) => s.done).forEach((s) => {
      addKitItem({
        name: s.itemName,
        quantity: 1,
        location: "",
        roleId: "light_tender",
        lastCheckedDate: today,
        lastCheckedById: selectedLeaders[0] ?? familyMembers[0]?.id ?? "",
        source: "scavenged",
      });
    });

    logActivity({
      activityType: "blackout_kit",
      completedAt: new Date().toISOString(),
      ledByIds: selectedLeaders,
      notes,
    });

    setCompleted(true);
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto pb-24">
        <PageHeader title="Blackout Kit Build" back="/activities" />
        <div className="px-4 pt-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#4A6741]/15 flex items-center justify-center mx-auto">
            <Check size={28} className="text-[#4A6741]" />
          </div>
          <h2 className="text-2xl text-[#2E2620]">Kit built.</h2>
          <p className="text-[#7A6B60] text-sm max-w-xs mx-auto">
            The items you checked off have been added to your kit. This is logged quietly in your history.
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
      <PageHeader title="Blackout Kit Build" back="/activities" />

      <div className="px-4 pt-4 space-y-5">
        <p className="text-sm text-[#7A6B60]">
          A scavenger hunt. Find each item and check it off as you go. The Light Tender leads.
        </p>

        {/* Leader selection */}
        {lightTenders.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[#4A3F38] mb-2">Who is leading today?</p>
            <div className="flex gap-2 flex-wrap">
              {familyMembers.map((m) => {
                const selected = selectedLeaders.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() =>
                      setSelectedLeaders((prev) =>
                        selected ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all min-h-[44px] ${
                      selected
                        ? "bg-[#C7613B] border-[#C7613B] text-white"
                        : "border-[#E4D9CC] text-[#7A6B60]"
                    }`}
                  >
                    <Avatar name={m.name} color={m.avatarColor} size="sm" />
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step list */}
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`rounded-xl border p-3 transition-all ${
                step.done ? "bg-[#F0F5EE] border-[#4A6741]/30" : "bg-white border-[#E4D9CC]"
              }`}
            >
              <div className="flex gap-3">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    step.done ? "bg-[#4A6741] border-[#4A6741]" : "border-[#C4B4A0]"
                  }`}
                >
                  {step.done && <Check size={12} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${step.done ? "text-[#7A6B60] line-through" : "text-[#2E2620]"}`}>
                    {step.childInstruction}
                  </p>
                  {step.parentRationale && (
                    <button
                      onClick={() => setShowParent(showParent === step.id ? null : step.id)}
                      className="text-xs text-[#C7613B] mt-1 min-h-[24px]"
                    >
                      {showParent === step.id ? "Hide note" : "Why this?"}
                    </button>
                  )}
                  {showParent === step.id && step.parentRationale && (
                    <p className="text-xs text-[#7A6B60] mt-1 bg-[#F5F0EB] rounded-lg p-2">
                      {step.parentRationale}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeStep(step.id)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C4B4A0] hover:text-[#C7613B] flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add step */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add another item to find..."
            value={newChild}
            onChange={(e) => setNewChild(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStep()}
            className="flex-1 px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-sm"
          />
          <button
            onClick={addStep}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C7613B] hover:bg-[#FFF8F3] rounded-lg border border-[#E4D9CC]"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-[#4A3F38] mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Anything to remember from this round..."
            className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-sm resize-none"
          />
        </div>

        <Button
          variant="moss"
          className="w-full"
          disabled={!steps.some((s) => s.done)}
          onClick={handleComplete}
        >
          {allDone ? "Kit complete — log it" : `Log ${steps.filter((s) => s.done).length} found items`}
        </Button>
      </div>
    </div>
  );
}

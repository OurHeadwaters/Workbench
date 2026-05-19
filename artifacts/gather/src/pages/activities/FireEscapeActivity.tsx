import { useState } from "react";
import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check, Printer } from "lucide-react";
import { useLocation } from "wouter";
import { formatDate, todayString } from "@/lib/utils";
import type { FireEscapeRoom } from "@/lib/types";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function FireEscapeActivity() {
  const [, navigate] = useLocation();
  const { familyMembers, readiness, updateFireEscapePlan, logActivity } = useGatherStore();
  const plan = readiness.fireEscapePlan;

  const [saved, setSaved] = useState(false);
  const [practiceLogged, setPracticeLogged] = useState(false);

  function addRoom() {
    const newRoom: FireEscapeRoom = { id: generateId(), name: "", exits: "", notes: "" };
    updateFireEscapePlan({ rooms: [...plan.rooms, newRoom] });
  }

  function updateRoom(id: string, field: keyof FireEscapeRoom, value: string) {
    updateFireEscapePlan({
      rooms: plan.rooms.map((r) => r.id === id ? { ...r, [field]: value } : r),
    });
  }

  function removeRoom(id: string) {
    updateFireEscapePlan({ rooms: plan.rooms.filter((r) => r.id !== id) });
  }

  function logPractice() {
    updateFireEscapePlan({
      practiceCount: plan.practiceCount + 1,
      lastPracticedDate: todayString(),
    });
    logActivity({
      activityType: "fire_escape",
      completedAt: new Date().toISOString(),
      ledByIds: plan.navigatorId ? [plan.navigatorId] : [],
      notes: `Practice #${plan.practiceCount + 1}`,
    });
    setSaved(true);
    setPracticeLogged(true);
  }

  function handlePrint() {
    window.print();
  }

  const littleNavigators = familyMembers.filter((m) => m.roleIds.includes("little_navigator"));

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader
        title="Fire Escape Plan"
        back="/activities"
        action={
          plan.rooms.length > 0 ? (
            <button
              onClick={handlePrint}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7A6B60] hover:text-[#2E2620]"
            >
              <Printer size={18} />
            </button>
          ) : null
        }
      />

      <div className="px-4 pt-4 space-y-5">
        <p className="text-sm text-[#7A6B60]">
          Walk through each room together. Note the exits, agree on a meeting spot, and pick who leads the little ones.
        </p>

        {/* Rooms */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base text-[#2E2620]">Rooms</h2>
            <Button variant="ghost" size="sm" onClick={addRoom}>
              <Plus size={14} className="mr-1" /> Add room
            </Button>
          </div>

          {plan.rooms.length === 0 && (
            <p className="text-sm text-[#7A6B60] py-3">No rooms added yet. Walk through your home room by room.</p>
          )}

          <div className="space-y-3">
            {plan.rooms.map((room, i) => (
              <div key={room.id} className="rounded-xl bg-white border border-[#E4D9CC] p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[#7A6B60] w-5">{i + 1}.</p>
                  <input
                    type="text"
                    placeholder="Room name (e.g. Main bedroom)"
                    value={room.name}
                    onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded border border-[#E4D9CC] text-sm text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] bg-white"
                  />
                  <button
                    onClick={() => removeRoom(room.id)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C4B4A0] hover:text-[#C7613B]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Exits (e.g. door to hall, window to porch roof)"
                  value={room.exits}
                  onChange={(e) => updateRoom(room.id, "exits", e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-[#E4D9CC] text-sm text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] bg-white"
                />
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={room.notes}
                  onChange={(e) => updateRoom(room.id, "notes", e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-[#E4D9CC] text-sm text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] bg-white"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Meeting spot */}
        <section>
          <label className="block text-base text-[#2E2620] mb-2">Outside meeting spot</label>
          <input
            type="text"
            placeholder="e.g. The big oak tree at the front corner of the yard"
            value={plan.meetingSpot}
            onChange={(e) => updateFireEscapePlan({ meetingSpot: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-sm"
          />
        </section>

        {/* Navigator */}
        {familyMembers.length > 0 && (
          <section>
            <label className="block text-base text-[#2E2620] mb-2">
              Who leads the little ones?
              {littleNavigators.length > 0 && <span className="text-xs text-[#7A6B60] ml-2">(Little Navigator role)</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {familyMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateFireEscapePlan({ navigatorId: plan.navigatorId === m.id ? null : m.id })}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all min-h-[44px] ${
                    plan.navigatorId === m.id
                      ? "bg-[#C7613B] border-[#C7613B] text-white"
                      : "border-[#E4D9CC] text-[#7A6B60]"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Practice */}
        <section className="rounded-xl bg-[#F0E9DF] border border-[#E4D9CC] p-4">
          <p className="text-base text-[#2E2620] mb-1">Practice</p>
          <p className="text-sm text-[#7A6B60] mb-3">
            Run a drill together — call "fire drill!" and everyone walks to the meeting spot.
            {plan.practiceCount > 0 && ` You've done this ${plan.practiceCount} time${plan.practiceCount !== 1 ? "s" : ""}.`}
            {plan.lastPracticedDate && ` Last: ${formatDate(plan.lastPracticedDate)}.`}
          </p>
          <Button variant="primary" onClick={logPractice} disabled={practiceLogged} className="w-full">
            {practiceLogged ? "Practice logged" : "Log a practice drill"}
          </Button>
        </section>

        {/* Save plan note */}
        {plan.rooms.length > 0 && !saved && (
          <div className="rounded-xl bg-[#4A6741]/10 border border-[#4A6741]/20 p-3">
            <p className="text-xs text-[#4A3F38]">
              Your plan saves automatically as you type. Use the print button in the header to get a copy you can post on the fridge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

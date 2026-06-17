import { useState } from "react";
import { TaskAutopilot } from "@/components/TaskAutopilot";

const BG     = "#0B0905";
const BORDER = "rgba(237,232,213,0.08)";
const TEXT   = "#EDE8D5";
const TEXT2  = "rgba(237,232,213,0.55)";

export function TableRoomPage() {
  const [sessionCleared, setSessionCleared] = useState(0);

  return (
    <div className="min-h-dvh pb-24" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-8 pb-4"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: TEXT, fontFamily: "Fraunces, serif" }}
            >
              Table
            </h1>
            {sessionCleared > 0 && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: "#0D2010", border: "1px solid #1A4020", color: "#4ADE80" }}
              >
                <span style={{ fontSize: 9 }}>⚡</span>
                Council cleared {sessionCleared} task{sessionCleared !== 1 ? "s" : ""} this session
              </span>
            )}
          </div>
          <p className="text-sm mt-0.5" style={{ color: TEXT2 }}>
            Council autopilot — live sweep of proposed tasks across all projects
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <TaskAutopilot
          defaultOpen={true}
          tableMode={true}
          onClearedCountChange={setSessionCleared}
        />
      </div>
    </div>
  );
}

import { useState } from "react";
import { TaskAutopilot } from "@/components/TaskAutopilot";
import { KitchenTablePage } from "@/pages/KitchenTablePage";
import { BG, BORDER, TEXT, TEXT_2, AMBER, FONT_DISPLAY } from "@/lib/theme";

type TableTab = "autopilot" | "council";

export function TableRoomPage() {
  const [sessionCleared, setSessionCleared] = useState(0);
  const [tab, setTab] = useState<TableTab>("autopilot");

  return (
    <div className="min-h-dvh pb-24 flex flex-col" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-8 pb-0 flex-shrink-0"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: TEXT, fontFamily: FONT_DISPLAY }}
            >
              Table
            </h1>
            {tab === "autopilot" && sessionCleared > 0 && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: "#0D2010", border: "1px solid #1A4020", color: "#4ADE80" }}
              >
                <span style={{ fontSize: 9 }}>⚡</span>
                Council cleared {sessionCleared} task{sessionCleared !== 1 ? "s" : ""} this session
              </span>
            )}
          </div>
          <p className="text-sm mt-0.5 mb-4" style={{ color: TEXT_2 }}>
            {tab === "autopilot"
              ? "Autopilot — live sweep of proposed tasks across all projects"
              : "Council — sit with the six seats and deliberate"}
          </p>

          {/* Tab switcher */}
          <div className="flex gap-1 -mb-px">
            {([
              { id: "autopilot" as const, label: "Autopilot" },
              { id: "council" as const, label: "Council" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-4 py-2.5 text-sm font-medium min-h-[44px] border-b-2 transition-colors"
                style={{
                  color: tab === t.id ? AMBER : TEXT_2,
                  borderColor: tab === t.id ? AMBER : "transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "autopilot" ? (
        <div className="max-w-3xl mx-auto w-full">
          <TaskAutopilot
            defaultOpen={true}
            tableMode={true}
            onClearedCountChange={setSessionCleared}
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <KitchenTablePage />
        </div>
      )}
    </div>
  );
}

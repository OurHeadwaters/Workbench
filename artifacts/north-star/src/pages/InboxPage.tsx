import { Inbox } from "lucide-react";
import { useStore } from "@/store";
import { MorningTriage } from "@/components/MorningTriage";

const BG     = "#0B0905";
const SURF   = "#141210";
const BORDER = "rgba(237,232,213,0.08)";
const TEXT   = "#EDE8D5";
const TEXT2  = "rgba(237,232,213,0.55)";

export function InboxPage() {
  const inbox = useStore((s) => s.inbox);

  return (
    <div className="min-h-dvh pb-24" style={{ backgroundColor: BG }}>
      <div
        className="sticky top-0 z-10 px-5 pt-8 pb-4"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="max-w-xl mx-auto">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: TEXT, fontFamily: "Fraunces, serif" }}
          >
            Inbox
          </h1>
          <p className="text-sm mt-0.5" style={{ color: TEXT2 }}>
            Morning triage — handle or defer
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-5">
        {!inbox.enabled ? (
          <div
            className="rounded-xl px-5 py-8 text-center mt-4"
            style={{ backgroundColor: SURF, border: `1px dashed ${BORDER}` }}
          >
            <Inbox size={32} className="mx-auto mb-3" style={{ color: TEXT2 }} />
            <p className="font-medium mb-1" style={{ color: TEXT }}>
              Morning Triage not connected
            </p>
            <p className="text-sm" style={{ color: TEXT2 }}>
              Enable Gmail accounts in Settings → Inbox Setup to start triaging here.
            </p>
          </div>
        ) : (
          <MorningTriage alwaysExpanded />
        )}
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { Download, Upload, RotateCcw, ExternalLink } from "lucide-react";
import { useStore } from "@/store";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function SettingsPage() {
  const statement = useStore((s) => s.statement);
  const setStatement = useStore((s) => s.setStatement);
  const exportBackup = useStore((s) => s.exportBackup);
  const importBackup = useStore((s) => s.importBackup);
  const resetAll = useStore((s) => s.resetAll);

  const [who, setWho] = useState(statement?.who ?? "");
  const [why, setWhy] = useState(statement?.why ?? "");
  const [noFly, setNoFly] = useState(statement?.noFly ?? "");
  const [statementSaved, setStatementSaved] = useState(false);

  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  function handleSaveStatement() {
    setStatement({ who: who.trim(), why: why.trim(), noFly: noFly.trim() });
    setStatementSaved(true);
    setTimeout(() => setStatementSaved(false), 2000);
  }

  function handleExport() {
    const json = exportBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `north-star-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const ok = importBackup(text);
      if (ok) {
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => setImportSuccess(false), 3000);
      } else {
        setImportError("Invalid backup file. Check the format and try again.");
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleReset() {
    resetAll();
    setShowReset(false);
    window.location.replace(`${BASE}/onboarding`);
  }

  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl">Settings</h1>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-4">
          <h2 className="text-base">North star statement</h2>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">Who is this work for?</label>
            <textarea
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder="A specific kind of person"
              rows={2}
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">So that…</label>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="What shifts for them"
              rows={2}
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">No-fly</label>
            <textarea
              value={noFly}
              onChange={(e) => setNoFly(e.target.value)}
              placeholder="What you'll politely decline"
              rows={2}
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
            />
          </div>

          <button
            onClick={handleSaveStatement}
            className="w-full bg-[#1C1917] text-white rounded-lg py-2 text-sm font-medium min-h-[44px]"
          >
            {statementSaved ? "Saved ✓" : "Save statement"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] divide-y divide-[#E7E5E4]">
          <Link
            href="/zones"
            className="flex items-center justify-between px-4 py-3 min-h-[56px]"
          >
            <span className="text-sm">Manage constellations & contracts</span>
            <ExternalLink size={16} className="text-[#78716C]" />
          </Link>
          <Link
            href="/inbox-setup"
            className="flex items-center justify-between px-4 py-3 min-h-[56px]"
          >
            <span className="text-sm">Gmail inbox setup</span>
            <ExternalLink size={16} className="text-[#78716C]" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-4">
          <h2 className="text-base">Backup & restore</h2>
          <p className="text-xs text-[#78716C]">North Star lives only on this device. Export a backup regularly.</p>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px] hover:bg-[#F5F5F0]"
          >
            <Download size={16} /> Export backup JSON
          </button>

          <label className="w-full flex items-center justify-center gap-2 border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px] hover:bg-[#F5F5F0] cursor-pointer">
            <Upload size={16} /> Import backup JSON
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>

          {importError && <p className="text-sm text-[#B45309]">{importError}</p>}
          {importSuccess && <p className="text-sm text-[#4F6E5C]">Backup imported successfully.</p>}
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Danger zone</h2>

          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full flex items-center justify-center gap-2 border border-[#FCD34D] bg-[#FEF3C7] text-[#92400E] rounded-lg py-2 text-sm min-h-[44px]"
            >
              <RotateCcw size={16} /> Reset all data
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[#92400E]">
                This will permanently erase all your constellations, picks, reviews, and captures. There is no undo. Export a backup first.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowReset(false)} className="flex-1 border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px]">
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] rounded-lg py-2 text-sm font-medium min-h-[44px]"
                >
                  Yes, reset everything
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-[#78716C]">North Star · Local-first · Schema v4</p>
        </div>
      </div>
    </div>
  );
}

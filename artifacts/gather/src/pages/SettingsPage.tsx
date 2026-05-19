import { useRef, useState } from "react";
import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, Upload, RotateCcw, Check, AlertTriangle } from "lucide-react";

export function SettingsPage() {
  const { exportData, importData, reset } = useGatherStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<"ok" | "fail" | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saltbox-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") {
        const ok = importData(text);
        setImportResult(ok ? "ok" : "fail");
        setTimeout(() => setImportResult(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader title="Settings" back="/" />

      <div className="px-4 pt-4 space-y-6">
        {/* Backup section */}
        <section>
          <h2 className="text-base text-[#2E2620] mb-1">Backup & Restore</h2>
          <p className="text-sm text-[#7A6B60] mb-4">
            All your data lives on this device. Export a backup regularly — it includes your family, roles, kit, and readiness plans.
          </p>

          <div className="space-y-3">
            <Button variant="secondary" className="w-full" onClick={handleExport}>
              <Download size={16} className="mr-2" /> Export backup
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={16} className="mr-2" /> Restore from backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />

            {importResult === "ok" && (
              <div className="flex items-center gap-2 text-sm text-[#4A6741] bg-[#F0F5EE] rounded-lg px-3 py-2">
                <Check size={14} /> Restore successful
              </div>
            )}
            {importResult === "fail" && (
              <div className="flex items-center gap-2 text-sm text-[#7A6B60] bg-[#F0E9DF] rounded-lg px-3 py-2">
                <AlertTriangle size={14} /> Could not read that file
              </div>
            )}
          </div>
        </section>

        {/* About */}
        <section className="rounded-xl bg-[#F0E9DF] border border-[#E4D9CC] p-4">
          <h2 className="text-base text-[#2E2620] mb-2">About Saltbox</h2>
          <p className="text-sm text-[#7A6B60] leading-relaxed">
            Saltbox is a private household companion. All data stays on your device — nothing leaves unless you export it yourself. No account, no sync, no notifications.
          </p>
        </section>

        {/* Reset */}
        <section>
          <h2 className="text-base text-[#2E2620] mb-1">Reset</h2>
          <p className="text-sm text-[#7A6B60] mb-3">
            This clears all data on this device. Export a backup first if you want to keep anything.
          </p>
          {!confirmReset ? (
            <Button variant="ghost" className="text-[#7A6B60] border border-[#E4D9CC]" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} className="mr-2" /> Reset all data
            </Button>
          ) : (
            <div className="rounded-xl border border-[#C7613B]/30 bg-[#FFF8F3] p-4 space-y-3">
              <p className="text-sm text-[#4A3F38] font-medium">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setConfirmReset(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => { reset(); setConfirmReset(false); }}
                  className="flex-1"
                >
                  Yes, reset everything
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

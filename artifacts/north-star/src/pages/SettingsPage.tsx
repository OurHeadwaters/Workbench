import { useState, useRef, useEffect } from "react";
import { Download, Upload, RotateCcw, ExternalLink, Mail, Lock } from "lucide-react";
import { useStore } from "@/store";
import { Link } from "wouter";
import { getEffectivePassword } from "@/components/PasswordGate";
import { lockKitchenTable, isKitchenTableUnlocked } from "@/lib/lock";

const CUSTOM_PW_KEY = "north-star:custom-password";
const UNLOCK_KEY = "north-star:unlocked";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = import.meta.env.VITE_API_URL ?? "";

function getOwnerToken(): string | null {
  return (
    window.localStorage.getItem("library.ownerToken") ||
    window.localStorage.getItem("ownerToken") ||
    null
  );
}

function ownerHeaders(): HeadersInit {
  const token = getOwnerToken();
  return token ? { "x-library-owner-token": token } : {};
}

export function SettingsPage() {
  const statement = useStore((s) => s.statement);
  const setStatement = useStore((s) => s.setStatement);
  const workbenchPlan = useStore((s) => s.workbenchPlan);
  const setWorkbenchPlan = useStore((s) => s.setWorkbenchPlan);
  const exportBackup = useStore((s) => s.exportBackup);
  const importBackup = useStore((s) => s.importBackup);
  const resetAll = useStore((s) => s.resetAll);

  const [who, setWho] = useState(statement?.who ?? "");
  const [why, setWhy] = useState(statement?.why ?? "");
  const [noFly, setNoFly] = useState(statement?.noFly ?? "");
  const [statementSaved, setStatementSaved] = useState(false);

  const [wpPhase, setWpPhase] = useState(workbenchPlan?.phase ?? "");
  const [wpBurst, setWpBurst] = useState(workbenchPlan?.burstMinutes != null ? String(workbenchPlan.burstMinutes) : "");
  const [wpWindows, setWpWindows] = useState(workbenchPlan?.windows ?? "");
  const [wpWindowNotes, setWpWindowNotes] = useState(workbenchPlan?.windowNotes ?? "");
  const [wpNotes, setWpNotes] = useState(workbenchPlan?.notes ?? "");
  const [wpSaved, setWpSaved] = useState(false);

  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);

  const ENV_PW_SET = (import.meta.env.VITE_KITCHEN_TABLE_PASSWORD as string || "").length > 0;

  const fileRef = useRef<HTMLInputElement>(null);

  const isOwner = !!getOwnerToken();
  const kitchenTableUnlocked = isKitchenTableUnlocked();

  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyEmailSource, setNotifyEmailSource] = useState<"db" | "env" | "unset" | null>(null);
  const [notifyEmailSaving, setNotifyEmailSaving] = useState(false);
  const [notifyEmailSaved, setNotifyEmailSaved] = useState(false);
  const [notifyEmailError, setNotifyEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOwner) return;
    fetch(`${API}/api/settings/notify-email`, { headers: ownerHeaders() })
      .then((r) => r.json())
      .then((data: { email: string | null; source: "db" | "env" | "unset" }) => {
        setNotifyEmail(data.email ?? "");
        setNotifyEmailSource(data.source);
      })
      .catch(() => {});
  }, [isOwner]);

  async function handleSaveNotifyEmail() {
    setNotifyEmailSaving(true);
    setNotifyEmailError(null);
    try {
      const res = await fetch(`${API}/api/settings/notify-email`, {
        method: "PUT",
        headers: { ...ownerHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifyEmail }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setNotifyEmailError(data.error ?? "Save failed");
      } else {
        setNotifyEmailSource("db");
        setNotifyEmailSaved(true);
        setTimeout(() => setNotifyEmailSaved(false), 2000);
      }
    } catch {
      setNotifyEmailError("Could not reach the server");
    } finally {
      setNotifyEmailSaving(false);
    }
  }

  function handleSaveStatement() {
    setStatement({ who: who.trim(), why: why.trim(), noFly: noFly.trim() });
    setStatementSaved(true);
    setTimeout(() => setStatementSaved(false), 2000);
  }

  function handleSaveWorkbenchPlan() {
    setWorkbenchPlan({
      phase: wpPhase.trim(),
      burstMinutes: wpBurst.trim() !== "" ? Number(wpBurst.trim()) || null : null,
      windows: wpWindows.trim(),
      windowNotes: wpWindowNotes.trim(),
      notes: wpNotes.trim(),
    });
    setWpSaved(true);
    setTimeout(() => setWpSaved(false), 2000);
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

  function handleChangePassword() {
    setPwError(null);
    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwError("Please fill in all three fields.");
      return;
    }
    const effective = getEffectivePassword();
    if (pwCurrent !== effective) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (pwNew.length < 4) {
      setPwError("New password must be at least 4 characters.");
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwError("New passwords don't match.");
      return;
    }
    try {
      localStorage.setItem(CUSTOM_PW_KEY, pwNew);
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      setPwError("Could not save — localStorage may be blocked.");
      return;
    }
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div className="min-h-dvh pb-24" style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #F5F0E8 100%)" }}>
      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl">Settings</h1>

        <div
          className="rounded-2xl border border-[#D6D0C7] shadow-sm p-4 space-y-4"
          style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)" }}
        >
          <h2 className="text-base font-medium text-[#1C1917]">North star statement</h2>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">Who is this work for?</label>
            <textarea
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder="A specific kind of person"
              rows={2}
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">So that…</label>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="What shifts for them"
              rows={2}
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">No-fly</label>
            <textarea
              value={noFly}
              onChange={(e) => setNoFly(e.target.value)}
              placeholder="What you'll politely decline"
              rows={2}
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A] resize-none"
            />
          </div>

          <button
            onClick={handleSaveStatement}
            className="w-full bg-[#1C1917] text-white rounded-xl py-2 text-sm font-medium min-h-[44px]"
          >
            {statementSaved ? "Saved ✓" : "Save statement"}
          </button>
        </div>

        <div
          className="rounded-2xl border border-[#D6D0C7] shadow-sm p-4 space-y-4"
          style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)" }}
        >
          <h2 className="text-base font-medium text-[#1C1917]">Workbench plan</h2>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">Phase</label>
            <input
              type="text"
              value={wpPhase}
              onChange={(e) => setWpPhase(e.target.value)}
              placeholder="e.g. Funnels"
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">Burst (minutes)</label>
            <input
              type="number"
              value={wpBurst}
              onChange={(e) => setWpBurst(e.target.value)}
              placeholder="e.g. 20"
              min={1}
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">Work windows</label>
            <input
              type="text"
              value={wpWindows}
              onChange={(e) => setWpWindows(e.target.value)}
              placeholder="e.g. 6–8am / 6–8pm / Weekend block"
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">Window notes</label>
            <input
              type="text"
              value={wpWindowNotes}
              onChange={(e) => setWpWindowNotes(e.target.value)}
              placeholder="e.g. when dad is home"
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#78716C] uppercase tracking-wider">Notes</label>
            <textarea
              value={wpNotes}
              onChange={(e) => setWpNotes(e.target.value)}
              placeholder="What you're building and why right now"
              rows={3}
              className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A] resize-none"
            />
          </div>

          <button
            onClick={handleSaveWorkbenchPlan}
            className="w-full bg-[#1C1917] text-white rounded-xl py-2 text-sm font-medium min-h-[44px]"
          >
            {wpSaved ? "Saved ✓" : "Save workbench plan"}
          </button>
        </div>

        {isOwner && (
          <div
            className="rounded-2xl border border-[#D6D0C7] shadow-sm p-4 space-y-4"
            style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)" }}
          >
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-[#78716C]" />
              <h2 className="text-base font-medium text-[#1C1917]">River Smith briefing email</h2>
            </div>

            <p className="text-xs text-[#78716C]">
              The nightly briefing will be delivered to this address.
              {notifyEmailSource === "env" && (
                <span className="ml-1 italic">Currently set via server config — saving here will override it.</span>
              )}
              {notifyEmailSource === "unset" && (
                <span className="ml-1 italic">No address configured yet — briefings are not being sent.</span>
              )}
            </p>

            <div className="space-y-2">
              <label className="text-xs text-[#78716C] uppercase tracking-wider">Delivery address</label>
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="bobbie@example.com"
                className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
              />
            </div>

            {notifyEmailError && (
              <p className="text-sm text-[#B45309]">{notifyEmailError}</p>
            )}

            <button
              onClick={handleSaveNotifyEmail}
              disabled={notifyEmailSaving}
              className="w-full bg-[#1C1917] text-white rounded-xl py-2 text-sm font-medium min-h-[44px] disabled:opacity-60"
            >
              {notifyEmailSaved ? "Saved ✓" : notifyEmailSaving ? "Saving…" : "Save briefing email"}
            </button>
          </div>
        )}

        {ENV_PW_SET && (
          <div
            className="rounded-2xl border border-[#D6D0C7] shadow-sm p-4 space-y-4"
            style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)" }}
          >
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-[#78716C]" />
              <h2 className="text-base font-medium text-[#1C1917]">Change password</h2>
            </div>

            <p className="text-xs text-[#78716C]">
              Update the Kitchen Table password. The new password is saved on this device and will be required on your next sign-in.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-[#78716C] uppercase tracking-wider">Current password</label>
                <input
                  type="password"
                  value={pwCurrent}
                  onChange={(e) => { setPwCurrent(e.target.value); setPwError(null); }}
                  placeholder="Your current password"
                  autoComplete="current-password"
                  className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#78716C] uppercase tracking-wider">New password</label>
                <input
                  type="password"
                  value={pwNew}
                  onChange={(e) => { setPwNew(e.target.value); setPwError(null); }}
                  placeholder="At least 4 characters"
                  autoComplete="new-password"
                  className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#78716C] uppercase tracking-wider">Confirm new password</label>
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={(e) => { setPwConfirm(e.target.value); setPwError(null); }}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  className="w-full border border-[#D6D0C7] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9]/70 focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]"
                />
              </div>
            </div>

            {pwError && <p className="text-sm text-[#B45309]">{pwError}</p>}
            {pwSaved && <p className="text-sm text-[#4F6E5C]">Password updated — use the new one next time you sign in.</p>}

            <button
              onClick={handleChangePassword}
              className="w-full bg-[#1C1917] text-white rounded-xl py-2 text-sm font-medium min-h-[44px]"
            >
              Update password
            </button>
          </div>
        )}

        <div className="bg-white/70 rounded-2xl border border-[#D6D0C7] shadow-sm divide-y divide-[#E7E5E4]">
          <Link
            href="/zones"
            className="flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#F5F0E8]/50 rounded-t-2xl transition-colors"
          >
            <span className="text-sm">Manage constellations & contracts</span>
            <ExternalLink size={16} className="text-[#78716C]" />
          </Link>
          <Link
            href="/inbox-setup"
            className={`flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#F5F0E8]/50 transition-colors${kitchenTableUnlocked ? "" : " rounded-b-2xl"}`}
          >
            <span className="text-sm">Gmail inbox setup</span>
            <ExternalLink size={16} className="text-[#78716C]" />
          </Link>
          {kitchenTableUnlocked && (
            <button
              onClick={lockKitchenTable}
              className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#F5F0E8]/50 rounded-b-2xl transition-colors text-left"
            >
              <span className="text-sm text-[#78716C]">Lock Kitchen Table</span>
              <Lock size={16} className="text-[#78716C]" />
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-[#C8923A]/40 shadow-sm p-4 space-y-4" style={{ background: "#FEF9EE" }}>
          <h2 className="text-base font-medium text-[#1C1917]">Backup & restore</h2>
          <p className="text-xs text-[#92400E]">North Star lives only on this device. Export a backup regularly.</p>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 border border-[#D6D0C7] bg-white/60 rounded-xl py-2 text-sm min-h-[44px] hover:bg-white/90 transition-colors"
          >
            <Download size={16} /> Export backup JSON
          </button>

          <label className="w-full flex items-center justify-center gap-2 border border-[#D6D0C7] bg-white/60 rounded-xl py-2 text-sm min-h-[44px] hover:bg-white/90 transition-colors cursor-pointer">
            <Upload size={16} /> Import backup JSON
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>

          {importError && <p className="text-sm text-[#B45309]">{importError}</p>}
          {importSuccess && <p className="text-sm text-[#4F6E5C]">Backup imported successfully.</p>}
        </div>

        <div className="bg-white/70 rounded-2xl border border-[#D6D0C7] shadow-sm p-4 space-y-3">
          <h2 className="text-base font-medium text-[#1C1917]">Danger zone</h2>

          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full flex items-center justify-center gap-2 border border-[#C8923A]/50 bg-[#FEF9EE] text-[#92400E] rounded-xl py-2 text-sm min-h-[44px] hover:bg-[#FEF3C7] transition-colors"
            >
              <RotateCcw size={16} /> Reset all data
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[#92400E]">
                This will permanently erase all your constellations, picks, reviews, and captures. There is no undo. Export a backup first.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowReset(false)} className="flex-1 border border-[#D6D0C7] rounded-xl py-2 text-sm min-h-[44px] hover:bg-[#F5F0E8] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-[#FEF3C7] border border-[#C8923A]/50 text-[#92400E] rounded-xl py-2 text-sm font-medium min-h-[44px] hover:bg-[#FDE68A] transition-colors"
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

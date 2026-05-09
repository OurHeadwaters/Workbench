import { useState, useEffect } from "react";

const PROJECT = "cold-trailer";

const SCOPE_ITEMS = [
  "01 — Air Conditioners (Units)",
  "02 — Air Conditioner Installation",
  "03 — Exterior AC Covers",
  "04 — Heater — Unit & Install",
  "05 — 807 Branding Decals",
  "06 — Paint Touch-Ups",
  "07 — Hitch TLC + Lights Inspection",
  "08 — Interior Flooring",
  "General — Planning / Coordination",
  "Other",
];

interface Submission {
  id: string;
  workDate: string;
  scopeItem: string;
  description: string;
  hours: string | null;
  ratePerHour: string | null;
  expenseDescription: string | null;
  expenseAmount: string | null;
  submittedBy: string;
}

interface Summary {
  rows: Submission[];
  totalLabour: number;
  totalExpenses: number;
  totalSpent: number;
}

const BUDGET = 9995;

const API_BASE = import.meta.env.DEV
  ? "http://localhost:8080/api"
  : `${window.location.origin}/api`;

function fmt(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });
}

export default function TylerSubmit() {
  const [submittedBy, setSubmittedBy] = useState("Tyler — Rockfront Family Farms");
  const [workDate, setWorkDate] = useState(new Date().toISOString().slice(0, 10));
  const [scopeItem, setScopeItem] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);

  async function loadSummary() {
    try {
      const res = await fetch(`${API_BASE}/subcontract/submissions/${PROJECT}`);
      if (res.ok) setSummary(await res.json());
    } catch {}
  }

  useEffect(() => { loadSummary(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/subcontract/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: PROJECT, submittedBy, workDate, scopeItem, description, hours: hours || null, ratePerHour: ratePerHour || null, expenseDescription: expenseDescription || null, expenseAmount: expenseAmount || null }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); setErrorMsg(data.error ?? "Something went wrong."); return; }
      setStatus("success");
      setDescription("");
      setHours("");
      setExpenseDescription("");
      setExpenseAmount("");
      loadSummary();
    } catch {
      setStatus("error");
      setErrorMsg("Network error — check your connection and try again.");
    }
  }

  const remaining = summary ? BUDGET - summary.totalSpent : BUDGET;
  const pct = summary ? Math.min(100, (summary.totalSpent / BUDGET) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f4ede0", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#1f3d2e", color: "white", padding: "2rem 1.5rem 1.75rem" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.4rem" }}>
            807 Food Co-op · Cold Trailer Project
          </p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.5rem" }}>
            Time & Receipt Submission
          </h1>
          <p style={{ fontSize: "0.88rem", opacity: 0.78, lineHeight: 1.6 }}>
            Log your hours at your rate and submit receipts as you go. No approval needed — just keep track and we'll see how far the budget stretches.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem 1.5rem 3rem" }}>

        {/* Budget bar */}
        <div style={{ background: "white", border: "1px solid rgba(31,61,46,0.12)", borderRadius: 8, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 700, color: "#1f3d2e" }}>
              {fmt(summary?.totalSpent ?? 0)} spent
            </span>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              {fmt(remaining)} remaining of {fmt(BUDGET)}
            </span>
          </div>
          <div style={{ height: 8, background: "rgba(31,61,46,0.1)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct > 85 ? "#b85a3e" : "#1f3d2e", borderRadius: 4, transition: "width 0.4s" }} />
          </div>
          {summary && (
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.6rem", fontSize: "0.78rem", color: "#666" }}>
              <span>Labour: {fmt(summary.totalLabour)}</span>
              <span>Receipts: {fmt(summary.totalExpenses)}</span>
              <span>{summary.rows.length} {summary.rows.length === 1 ? "entry" : "entries"}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid rgba(31,61,46,0.12)", borderRadius: 8, padding: "1.25rem" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 600, color: "#1f3d2e", marginBottom: "1rem" }}>
            New Entry
          </h2>

          <div style={{ display: "grid", gap: "0.85rem" }}>

            {/* Name */}
            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#444" }}>Your name</span>
              <input
                type="text"
                value={submittedBy}
                onChange={e => setSubmittedBy(e.target.value)}
                required
                style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.9rem", fontFamily: "inherit", background: "#fafaf8" }}
              />
            </label>

            {/* Date + Scope row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#444" }}>Date</span>
                <input
                  type="date"
                  value={workDate}
                  onChange={e => setWorkDate(e.target.value)}
                  required
                  style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.9rem", fontFamily: "inherit", background: "#fafaf8" }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#444" }}>Scope item</span>
                <select
                  value={scopeItem}
                  onChange={e => setScopeItem(e.target.value)}
                  required
                  style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.875rem", fontFamily: "inherit", background: "#fafaf8" }}
                >
                  <option value="">Select…</option>
                  {SCOPE_ITEMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            {/* Description */}
            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#444" }}>What did you do?</span>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Brief description of work done or expense…"
                style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.9rem", fontFamily: "inherit", background: "#fafaf8", resize: "vertical" }}
              />
            </label>

            {/* Hours + Rate */}
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#444", marginBottom: "0.4rem" }}>Time (if applicable)</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#666" }}>Hours worked</span>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    placeholder="e.g. 3.5"
                    style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.9rem", fontFamily: "inherit", background: "#fafaf8" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#666" }}>Your rate ($/hr)</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={ratePerHour}
                    onChange={e => setRatePerHour(e.target.value)}
                    placeholder="e.g. 65"
                    style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.9rem", fontFamily: "inherit", background: "#fafaf8" }}
                  />
                </label>
              </div>
              {hours && ratePerHour && (
                <p style={{ fontSize: "0.8rem", color: "#1f3d2e", fontWeight: 600, marginTop: "0.4rem" }}>
                  = {fmt(parseFloat(hours) * parseFloat(ratePerHour))} labour
                </p>
              )}
            </div>

            {/* Expense */}
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#444", marginBottom: "0.4rem" }}>Receipt / Expense (if applicable)</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem", alignItems: "end" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#666" }}>What was it for?</span>
                  <input
                    type="text"
                    value={expenseDescription}
                    onChange={e => setExpenseDescription(e.target.value)}
                    placeholder="e.g. 2× window AC units, Home Depot"
                    style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.9rem", fontFamily: "inherit", background: "#fafaf8" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#666" }}>Amount ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    style={{ padding: "0.55rem 0.7rem", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, fontSize: "0.9rem", fontFamily: "inherit", background: "#fafaf8", width: 100 }}
                  />
                </label>
              </div>
            </div>

            {errorMsg && (
              <p style={{ color: "#b85a3e", fontSize: "0.85rem", fontWeight: 500 }}>{errorMsg}</p>
            )}

            {status === "success" && (
              <p style={{ color: "#1f3d2e", fontSize: "0.85rem", fontWeight: 600, background: "rgba(31,61,46,0.08)", padding: "0.5rem 0.75rem", borderRadius: 4 }}>
                Submitted. Thanks Tyler.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{ background: "#1f3d2e", color: "white", border: "none", borderRadius: 6, padding: "0.7rem 1.5rem", fontSize: "0.9rem", fontWeight: 600, fontFamily: "inherit", cursor: status === "submitting" ? "not-allowed" : "pointer", opacity: status === "submitting" ? 0.7 : 1, alignSelf: "flex-start" }}
            >
              {status === "submitting" ? "Submitting…" : "Submit Entry"}
            </button>
          </div>
        </form>

        {/* Submission log */}
        {summary && summary.rows.length > 0 && (
          <div style={{ marginTop: "1.25rem" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.05rem", fontWeight: 600, color: "#1f3d2e", marginBottom: "0.75rem" }}>
              Submitted entries
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {summary.rows.map(row => {
                const labour = row.hours && row.ratePerHour ? parseFloat(row.hours) * parseFloat(row.ratePerHour) : null;
                const expense = row.expenseAmount ? parseFloat(row.expenseAmount) : null;
                return (
                  <div key={row.id} style={{ background: "white", border: "1px solid rgba(31,61,46,0.1)", borderRadius: 6, padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.2rem" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1f3d2e" }}>{row.scopeItem}</span>
                      <span style={{ fontSize: "0.78rem", color: "#888" }}>{row.workDate}</span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "#444", marginBottom: "0.3rem", lineHeight: 1.45 }}>{row.description}</p>
                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#666" }}>
                      {labour !== null && <span>Labour: {fmt(labour)} ({row.hours}h @ ${row.ratePerHour}/hr)</span>}
                      {expense !== null && <span>Receipt: {fmt(expense)}{row.expenseDescription ? ` — ${row.expenseDescription}` : ""}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

const STORAGE_KEY = "north-star:unlocked";
const CORRECT = (import.meta.env.VITE_KITCHEN_TABLE_PASSWORD as string) || "";
const GATE_ENABLED = CORRECT.length > 0;

function isUnlocked(): boolean {
  if (!GATE_ENABLED) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (unlocked) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (CORRECT && value === CORRECT) {
      setError(false);
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#090503]">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col items-center gap-6 w-full max-w-xs px-6 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
        style={shake ? { animation: "shake 0.5s ease-in-out" } : undefined}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-3xl select-none">🏔️</span>
          <h1 className="text-[#ede8d5] text-xl font-semibold tracking-tight">
            Kitchen Table
          </h1>
          <p className="text-[rgba(237,232,213,0.45)] text-sm">
            Enter your password to continue
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            placeholder="Password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            className={[
              "w-full rounded-lg px-4 py-3 bg-[#1a1309] border text-[#ede8d5] placeholder-[rgba(237,232,213,0.3)]",
              "outline-none focus:ring-1 transition-colors text-sm",
              error
                ? "border-red-500/60 focus:ring-red-500/40"
                : "border-[rgba(237,232,213,0.12)] focus:border-[rgba(237,232,213,0.3)] focus:ring-[rgba(237,232,213,0.15)]",
            ].join(" ")}
          />
          {error && (
            <p className="text-red-400 text-xs text-center">
              Incorrect password — try again
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-3 bg-[rgba(237,232,213,0.1)] hover:bg-[rgba(237,232,213,0.16)] border border-[rgba(237,232,213,0.12)] text-[#ede8d5] text-sm font-medium transition-colors"
          >
            Unlock
          </button>
        </div>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

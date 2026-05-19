import { useState } from "react";
import { api, setToken, type SandboxHousehold } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onAuth: (household: SandboxHousehold) => void;
}

type Mode = "login" | "create";

export function LoginPage({ onAuth }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !passphrase.trim()) return;
    setError("");
    setLoading(true);
    try {
      if (mode === "create") {
        const result = await api.createHousehold(name.trim(), passphrase, inviteCode.trim() || undefined);
        setToken(result.token);
        onAuth(result.household);
      } else {
        const result = await api.login(name.trim(), passphrase);
        setToken(result.token);
        onAuth(result.household);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#FAF6F0] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-[#2E2620] mb-2">Sandbox</h1>
          <p className="text-sm text-[#7A6B60]">Village board for the neighbourhood</p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-6">
          <div className="flex bg-[#F0E9DF] rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all min-h-[40px] ${mode === "login" ? "bg-[#FFFDF9] text-[#2E2620] shadow-sm" : "text-[#7A6B60]"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode("create"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all min-h-[40px] ${mode === "create" ? "bg-[#FFFDF9] text-[#2E2620] shadow-sm" : "text-[#7A6B60]"}`}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
                Household name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Nguyen family"
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#C7613B] transition-colors"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
                Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder={mode === "create" ? "Choose a passphrase" : "Enter your passphrase"}
                  className="w-full px-4 py-3 pr-12 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#C7613B] transition-colors"
                  autoComplete={mode === "create" ? "new-password" : "current-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6B60] p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "create" && (
              <div>
                <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
                  Invite code
                  <span className="ml-1 font-normal normal-case text-[#7A6B60]">(leave blank if you are the first to join)</span>
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LMRIQ8F6SF"
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#C7613B] transition-colors font-mono tracking-widest"
                  autoComplete="off"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-[#C7613B] bg-[#FEF3EE] rounded-lg px-4 py-3 border border-[#F5C9B3]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || !passphrase.trim()}
              className="w-full bg-[#C7613B] text-[#FFFDF9] py-3.5 rounded-xl text-sm font-medium active:scale-95 transition-all disabled:opacity-50 min-h-[48px]"
            >
              {loading ? "…" : mode === "create" ? "Join neighbourhood" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

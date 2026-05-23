import { useState } from "react";
import { api, type NurseryProducer } from "../lib/api";
import { Eye, EyeOff, Leaf } from "lucide-react";

interface LoginPageProps {
  onAuth: (producer: NurseryProducer, isFreshSteward?: boolean) => void;
}

type Mode = "login" | "join";

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
      if (mode === "join") {
        const result = await api.join(name.trim(), passphrase, inviteCode.trim() || undefined);
        onAuth(result.producer, result.producer.isSteward);
      } else {
        const result = await api.login(name.trim(), passphrase);
        onAuth(result.producer);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EBF3EE] mb-4">
            <Leaf className="w-5 h-5 text-[#4A7C59]" />
          </div>
          <h1 className="text-3xl text-[#2E2620] mb-1.5">Zone 4 Nursery</h1>
          <p className="text-sm text-[#7A6B60]">Producer idea workspace</p>
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
              onClick={() => { setMode("join"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all min-h-[40px] ${mode === "join" ? "bg-[#FFFDF9] text-[#2E2620] shadow-sm" : "text-[#7A6B60]"}`}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={mode === "join" ? "e.g. River Meadow Farm" : "Your name"}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A7C59] transition-colors"
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
                  placeholder={mode === "join" ? "Choose a passphrase" : "Enter your passphrase"}
                  className="w-full px-4 py-3 pr-12 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A7C59] transition-colors"
                  autoComplete={mode === "join" ? "new-password" : "current-password"}
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

            {mode === "join" && (
              <div>
                <label className="block text-xs font-medium text-[#4A3F38] mb-1.5 uppercase tracking-wide">
                  Invite code
                  <span className="ml-1 font-normal normal-case text-[#7A6B60]">(leave blank if you are first)</span>
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LMRIQ8F6SF"
                  className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E4D9CC] rounded-xl text-sm text-[#2E2620] placeholder-[#7A6B60] focus:outline-none focus:border-[#4A7C59] transition-colors font-mono tracking-widest"
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
              className="w-full bg-[#4A7C59] text-[#FFFDF9] py-3.5 rounded-xl text-sm font-medium active:scale-95 transition-all disabled:opacity-50 min-h-[48px]"
            >
              {loading ? "…" : mode === "join" ? "Join the nursery" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#A89A8E] mt-6">
          Zone 4 producer group · Codetry
        </p>
      </div>
    </div>
  );
}

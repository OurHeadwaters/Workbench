import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { useGetHhBand } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import {
  Wallet,
  ShieldCheck,
  Key,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletData {
  memberId: string;
  firstName: string;
  tokenBalance: string;
  tokenCode: string;
  walletType: string;
  xrplAddress?: string | null;
  didRef?: string | null;
}

interface ChallengeData {
  challenge: string;
  expiresAtMs: number;
}

interface VerifyResult {
  ok: boolean;
  xrplAddress: string;
  walletType: string;
  didRef: string;
  sweepStatus: "queued";
  sweepQueuedAt: string;
  message: string;
}

type Step = "education" | "xaman" | "address" | "challenge" | "done";

function isValidXrplAddress(addr: string): boolean {
  return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(addr);
}

export default function HHWalletHandoff() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { data: band } = useGetHhBand();

  const { data: wallet, isLoading: walletLoading } = useQuery<WalletData>({
    queryKey: ["hh-wallet-reveal"],
    queryFn: () => customFetch<WalletData>("/helping-hands/my/wallet", {}),
    staleTime: 30_000,
  });

  const [step, setStep] = useState<Step>("education");
  const [xrplAddress, setXrplAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [challengeEcho, setChallengeEcho] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);

  const tokenCode = band?.communityTokenCode ?? wallet?.tokenCode ?? "HWBAND";
  const balance = wallet ? parseFloat(wallet.tokenBalance).toFixed(2) : "0.00";

  const challengeQuery = useQuery<ChallengeData>({
    queryKey: ["hh-handoff-challenge", xrplAddress],
    queryFn: () =>
      customFetch<ChallengeData>(
        `/helping-hands/my/wallet/handoff/challenge?address=${encodeURIComponent(xrplAddress.trim())}`,
        {},
      ),
    enabled: step === "challenge",
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  const verifyMutation = useMutation({
    mutationFn: () =>
      customFetch<VerifyResult>("/helping-hands/my/wallet/handoff/verify", {
        method: "POST",
        body: JSON.stringify({
          xrplAddress: xrplAddress.trim(),
          challengeEcho: challengeEcho.trim(),
        }),
      }),
    onSuccess: (data) => {
      setResult(data);
      setStep("done");
      qc.invalidateQueries({ queryKey: ["hh-wallet-reveal"] });
    },
    onError: (e: Error) => {
      toast.error(e.message || "Verification failed. Please try again.");
    },
  });

  function handleAddressNext() {
    const trimmed = xrplAddress.trim();
    if (!isValidXrplAddress(trimmed)) {
      setAddressError("Enter a valid XRPL address — it starts with 'r' and is 25–35 characters long.");
      return;
    }
    setAddressError("");
    setChallengeEcho("");
    setStep("challenge");
  }

  function copyChallenge() {
    const text = challengeQuery.data?.challenge ?? "";
    navigator.clipboard.writeText(text).then(() => toast.success("Challenge copied"));
  }

  if (walletLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (wallet?.walletType === "self_custody" && !result) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center py-12 space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Already self-custody</h1>
          <p className="text-muted-foreground">
            Your wallet is already under your own keys.
            {wallet.xrplAddress && (
              <span className="block mt-1 font-mono text-xs text-foreground break-all">{wallet.xrplAddress}</span>
            )}
          </p>
          <Link href="/helping-hands/earnings">
            <Button variant="outline">Back to earnings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {step !== "done" && (
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/helping-hands/earnings">
              <button className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-foreground">Claim your wallet</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-7">
            Move your keys out of Headwaters' custody and into your own Xaman wallet.
          </p>
        </div>
      )}

      <StepIndicator current={step} />

      {step === "education" && (
        <EducationStep
          balance={balance}
          tokenCode={tokenCode}
          onNext={() => setStep("xaman")}
        />
      )}

      {step === "xaman" && (
        <XamanStep
          onBack={() => setStep("education")}
          onNext={() => setStep("address")}
        />
      )}

      {step === "address" && (
        <AddressStep
          xrplAddress={xrplAddress}
          onChange={(v) => { setXrplAddress(v); setAddressError(""); }}
          error={addressError}
          onBack={() => setStep("xaman")}
          onNext={handleAddressNext}
        />
      )}

      {step === "challenge" && (
        <ChallengeStep
          address={xrplAddress.trim()}
          challengeQuery={challengeQuery}
          challengeEcho={challengeEcho}
          onEchoChange={setChallengeEcho}
          onCopy={copyChallenge}
          onBack={() => { setStep("address"); setChallengeEcho(""); }}
          onSubmit={() => verifyMutation.mutate()}
          isSubmitting={verifyMutation.isPending}
          onRetryChallenge={() => {
            setChallengeEcho("");
            qc.removeQueries({ queryKey: ["hh-handoff-challenge", xrplAddress] });
          }}
        />
      )}

      {step === "done" && result && (
        <DoneStep
          result={result}
          tokenCode={tokenCode}
          balance={balance}
          onDashboard={() => setLocation("/helping-hands/earnings")}
        />
      )}
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "education", label: "Understand" },
    { id: "xaman", label: "Xaman" },
    { id: "address", label: "Your address" },
    { id: "challenge", label: "Verify" },
    { id: "done", label: "Done" },
  ];
  const order = steps.map((s) => s.id);
  const currentIdx = order.indexOf(current);

  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  done
                    ? "bg-emerald-600 text-white"
                    : active
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[10px] whitespace-nowrap ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-4 transition-colors ${done ? "bg-emerald-300" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function EducationStep({
  balance,
  tokenCode,
  onNext,
}: {
  balance: string;
  tokenCode: string;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">What self-custody means</h2>
            <p className="text-xs text-muted-foreground">Read before continuing</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Right now, Headwaters holds the keys to your wallet on your behalf — like a community credit union.
            Your {parseFloat(balance).toFixed(2)} {tokenCode} are safe, but someone else manages the account.
          </p>
          <p>
            When you claim self-custody, <strong className="text-foreground">you become the sole holder of your keys.</strong>{" "}
            Headwaters cannot move your funds, recover your account, or reverse any transaction.
            This is the point of self-custody — and also its responsibility.
          </p>
          <p>
            Your Xaman wallet will generate a seed phrase. Write it down on paper and store it somewhere safe.
            If you lose it, no one — not Headwaters, not Xaman, not your band — can recover your funds.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Not reversible.</strong> Once you migrate, Headwaters permanently loses key control.
            You can stay custodial indefinitely — migration is always your choice.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">
              Your {balance} {tokenCode} will be queued for transfer to your new address
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">Your task history and badges stay on record</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">All future task payments go straight to your wallet</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">A portable XRPL identity (DID) is set up in your name</p>
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={onNext}>
        I understand — let's continue
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Not ready?{" "}
        <Link href="/helping-hands/earnings" className="underline hover:text-foreground">
          Go back to your earnings
        </Link>
        {" "}— your wallet stays custodial until you decide.
      </p>
    </div>
  );
}

function XamanStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Set up Xaman</h2>
            <p className="text-xs text-muted-foreground">Create your XRPL wallet</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Xaman (formerly XUMM) is the app you'll use to hold your keys and sign transactions.
            It runs on your phone and never sends your private key to any server.
          </p>
          <p>
            Open the link below, install Xaman, and <strong className="text-foreground">create a new XRPL account</strong>.
            Write down your seed phrase — that paper is your wallet.
          </p>
          <p>
            Once your account is created, Xaman will show you your wallet address — a string starting with{" "}
            <code className="bg-muted px-1 rounded text-xs font-mono">r</code>.
            You'll enter that on the next screen.
          </p>
        </div>

        <a
          href="https://xumm.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg py-3 font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Open Xaman
          <ExternalLink className="w-4 h-4" />
        </a>

        <div className="bg-muted/40 border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Already have Xaman?</p>
          <p>If you already have a Xaman wallet with an XRPL address, you can use it directly — skip to the next step.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button className="flex-1" onClick={onNext}>
          I have my address
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function AddressStep({
  xrplAddress,
  onChange,
  error,
  onBack,
  onNext,
}: {
  xrplAddress: string;
  onChange: (v: string) => void;
  error: string;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Enter your XRPL address</h2>
            <p className="text-xs text-muted-foreground">Copy it from Xaman</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="xrpl-addr">
            Your XRPL wallet address
          </label>
          <input
            id="xrpl-addr"
            type="text"
            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            value={xrplAddress}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm font-mono bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${error ? "border-red-400" : "border-border"}`}
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <p className="text-xs text-muted-foreground">
            Your address starts with <code className="bg-muted px-1 rounded font-mono">r</code> and is 25–35 characters.
            Find it in Xaman under your account details.
          </p>
        </div>

        <div className="bg-muted/40 border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Why we need this:</strong>{" "}
          Headwaters will queue your balance for transfer to this address. On the next screen, we'll ask you
          to prove you own it by signing and echoing back a one-time message from Xaman.
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          className="flex-1"
          onClick={onNext}
          disabled={xrplAddress.trim().length === 0}
        >
          Next — verify ownership
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function ChallengeStep({
  address,
  challengeQuery,
  challengeEcho,
  onEchoChange,
  onCopy,
  onBack,
  onSubmit,
  isSubmitting,
  onRetryChallenge,
}: {
  address: string;
  challengeQuery: ReturnType<typeof useQuery<ChallengeData>>;
  challengeEcho: string;
  onEchoChange: (v: string) => void;
  onCopy: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onRetryChallenge: () => void;
}) {
  const challenge = challengeQuery.data?.challenge;
  const expired =
    challengeQuery.data != null && challengeQuery.data.expiresAtMs < Date.now();

  const echoMatchesChallenge = challenge != null && challengeEcho.trim() === challenge;

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Prove you own this address</h2>
            <p className="text-xs text-muted-foreground">Sign the message in Xaman, then paste it back here</p>
          </div>
        </div>

        <div className="bg-muted/40 border border-border rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground break-all">
          Signing for: <span className="text-foreground">{address}</span>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The message below is unique to you and this address.
            In Xaman, open <strong className="text-foreground">Settings → Sign</strong> or use the{" "}
            <strong className="text-foreground">memo field</strong> in a sign-in payload.
            Paste the message, sign it, then copy it into the field below.
          </p>

          {challengeQuery.isLoading && (
            <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating challenge…</span>
            </div>
          )}

          {challengeQuery.isError && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-700">Could not load challenge.</p>
              <button onClick={onRetryChallenge} className="text-xs text-red-700 underline">Retry</button>
            </div>
          )}

          {expired && (
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <p className="text-sm text-amber-800">Challenge expired.</p>
              <button onClick={onRetryChallenge} className="text-xs text-amber-800 underline">Get new challenge</button>
            </div>
          )}

          {challenge && !expired && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground uppercase tracking-wide">
                  Challenge message — paste this into Xaman
                </label>
                <button
                  onClick={onCopy}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="bg-muted border border-border rounded-lg px-3 py-3 text-xs font-mono text-foreground break-all select-all">
                {challenge}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 shrink-0" />
                <span>Expires in 15 minutes — paste it into Xaman and complete this step before then</span>
              </div>
            </div>
          )}

          {challenge && !expired && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground uppercase tracking-wide" htmlFor="echo-input">
                Paste the challenge back here after signing in Xaman
              </label>
              <textarea
                id="echo-input"
                rows={3}
                placeholder="Paste the exact message you signed in Xaman…"
                value={challengeEcho}
                onChange={(e) => onEchoChange(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-xs font-mono bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                  challengeEcho.trim().length > 0 && !echoMatchesChallenge
                    ? "border-red-400"
                    : "border-border"
                }`}
                spellCheck={false}
                autoComplete="off"
              />
              {challengeEcho.trim().length > 0 && !echoMatchesChallenge && (
                <p className="text-xs text-red-600">
                  This doesn't match the challenge above. Copy the exact text — don't modify it.
                </p>
              )}
              {echoMatchesChallenge && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Challenge confirmed — ready to complete
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          className="flex-1"
          disabled={!echoMatchesChallenge || !!expired || isSubmitting || challengeQuery.isLoading}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1" /> Verifying…
            </>
          ) : (
            <>
              Complete handoff
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function DoneStep({
  result,
  tokenCode,
  balance,
  onDashboard,
}: {
  result: VerifyResult;
  tokenCode: string;
  balance: string;
  onDashboard: () => void;
}) {
  function copyAddress() {
    navigator.clipboard.writeText(result.xrplAddress).then(() => toast.success("Address copied"));
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.04) 70%)",
              border: "1.5px solid rgba(16,185,129,0.4)",
            }}
          >
            <ShieldCheck className="w-9 h-9 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Your keys. Your wallet.</h1>
        <p className="text-muted-foreground leading-relaxed">
          Migration complete. Headwaters no longer holds any keys for your account.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Your XRPL address</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground break-all flex-1">{result.xrplAddress}</p>
              <button onClick={copyAddress} className="text-muted-foreground hover:text-foreground shrink-0" title="Copy">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <a
                href={`https://livenet.xrpl.org/accounts/${result.xrplAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground shrink-0"
                title="View on XRPL explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Your XRPL DID</p>
            <p className="font-mono text-xs text-foreground break-all">{result.didRef}</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-2">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900">Balance transfer: queued</p>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Your {balance} {tokenCode} are queued for transfer to your XRPL address.
              The on-chain settlement will be executed when XRPL is activated for your band.
              Until then, your balance remains safely held — just under self-custody rules.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-900 leading-relaxed">
        <strong>What happens next:</strong> All future task payments and tips will go directly to your XRPL address.
        Your badge credentials are now anchored to your personal XRPL DID.
        Your envelope budgets will reset — rebuild them inside Xaman when XRPL is live.
      </div>

      <Button className="w-full" onClick={onDashboard}>
        Go to my earnings
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ApiError,
  fetchWallet,
  fetchMyTips,
  type WalletState,
  type TipEntry,
} from "@/lib/api";

export function WalletPage() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [tips, setTips] = useState<TipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [w, t] = await Promise.all([fetchWallet(), fetchMyTips()]);
        setWallet(w);
        setTips(t.tips);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Could not load your wallet right now. Try again in a moment.");
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const referralUrl =
    wallet?.referralCode
      ? `${window.location.origin}/economy/join/${wallet.referralCode}`
      : null;

  async function copyReferral() {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select the input
    }
  }

  const sentTips = tips.filter((t) => t.direction === "sent");
  const receivedTips = tips.filter((t) => t.direction === "received");

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[44rem] px-6 sm:px-8 py-16 sm:py-24">

        {/* ── Header ── */}
        <header className="space-y-5">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            codetry · your wallet
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            {loading
              ? "Loading…"
              : wallet?.walletRevealed
              ? "Your wallet."
              : "Your wallet is ready."}
          </h1>
        </header>

        {error && (
          <div
            className="mt-8 rounded-sm border px-5 py-4"
            style={{ borderColor: "hsl(var(--destructive))", color: "hsl(var(--destructive))" }}
          >
            <p className="font-sans text-sm">{error}</p>
            <p className="font-sans text-xs mt-1 opacity-70">
              Make sure you&rsquo;re signed in with your Codetry account.
            </p>
          </div>
        )}

        {!loading && !error && wallet && (
          <>
            {/* ── Progressive reveal moment ── */}
            {!wallet.walletRevealed && (
              <section
                className="mt-10 sm:mt-12 rounded-sm border px-6 sm:px-8 py-8 sm:py-10 space-y-5"
                style={{ borderColor: "hsl(var(--accent))", background: "hsl(var(--card))" }}
              >
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  first look
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl leading-tight">
                  This is your wallet.
                </h2>
                <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  It&rsquo;s been here since you signed up. We didn&rsquo;t put it in
                  your face until there was actually something to show you.
                  Your current balance is{" "}
                  <strong className="text-foreground">
                    {wallet.tokenBalance} {wallet.tokenCode}
                  </strong>.
                </p>
                <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Credits are permanent. They don&rsquo;t expire. Every transaction
                  is recorded and readable by you. This is yours.
                </p>
              </section>
            )}

            {/* ── Balance ── */}
            <section className="mt-10 sm:mt-12 grid sm:grid-cols-2 gap-4">
              <BalanceCard
                label={wallet.tokenCode + " balance"}
                value={parseFloat(wallet.tokenBalance).toFixed(2)}
                sub="community credits"
                accent
              />
              {parseFloat(wallet.xrpBalance) > 0 && (
                <BalanceCard
                  label="XRP balance"
                  value={parseFloat(wallet.xrpBalance).toFixed(6)}
                  sub="on-chain"
                />
              )}
            </section>

            {/* ── Wallet type ── */}
            <section className="mt-6">
              <div
                className="flex items-center gap-3 rounded-sm border px-5 py-3"
                style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em] shrink-0"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {wallet.walletType === "custodial"
                    ? "Platform-managed wallet"
                    : "Self-custody wallet"}
                </span>
                <span
                  className="font-sans text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {wallet.walletType === "custodial"
                    ? "Keys held securely by the platform. Lower friction for daily use."
                    : "You hold your own keys. Full sovereignty."}
                </span>
              </div>
            </section>

            {/* ── Quick actions ── */}
            <section className="mt-8 sm:mt-10 flex flex-wrap gap-3">
              <Link
                href="/economy/tip"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Send a tip
              </Link>
              <Link
                href="/economy"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-sm font-sans text-sm font-medium tracking-wide border hover:opacity-80 transition-opacity"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                How this works
              </Link>
            </section>

            <hr className="rule mt-12 sm:mt-14" />

            {/* ── Referral ── */}
            {wallet.referralCode && (
              <section className="mt-10 sm:mt-12 space-y-4">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Bring someone in
                </p>
                <p className="font-serif text-base sm:text-lg leading-relaxed">
                  Share this link with anyone in your community. When they
                  sign up and complete their first transaction, you both
                  get{" "}
                  <strong>{wallet.referralBonusAmount} {wallet.tokenCode}</strong>.
                </p>
                <div
                  className="flex items-center gap-2 rounded-sm border px-4 py-2"
                  style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
                >
                  <code className="font-mono text-sm flex-1 truncate">{referralUrl}</code>
                  <button
                    onClick={copyReferral}
                    className="font-mono text-[10px] uppercase tracking-[0.18em] shrink-0 hover:opacity-80 transition-opacity"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    {copied ? "copied!" : "copy"}
                  </button>
                </div>
                <p
                  className="font-sans text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Your referral code: <code className="font-mono">{wallet.referralCode}</code>
                  {wallet.referralCount > 0 && (
                    <> · {wallet.referralCount} people joined through your link</>
                  )}
                </p>
              </section>
            )}

            <hr className="rule mt-12 sm:mt-14" />

            {/* ── Tips received ── */}
            {receivedTips.length > 0 && (
              <section className="mt-10 sm:mt-12 space-y-4">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Tips received
                </p>
                <div className="space-y-2">
                  {receivedTips.map((tip) => (
                    <TipRow key={tip.id} tip={tip} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Tips sent ── */}
            {sentTips.length > 0 && (
              <section className="mt-10 sm:mt-12 space-y-4">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Tips sent
                </p>
                <div className="space-y-2">
                  {sentTips.map((tip) => (
                    <TipRow key={tip.id} tip={tip} />
                  ))}
                </div>
              </section>
            )}

            {tips.length === 0 && (
              <section className="mt-10 sm:mt-12">
                <p className="font-serif text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  No tips yet.{" "}
                  <Link href="/economy/tip" className="underline underline-offset-4 hover:opacity-80">
                    Send one →
                  </Link>
                </p>
              </section>
            )}
          </>
        )}

        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · codetry · {new Date().getFullYear()}</p>
          <a
            href="/privacy"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Privacy
          </a>
        </footer>
      </div>
    </main>
  );
}

interface BalanceCardProps {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}

function BalanceCard({ label, value, sub, accent }: BalanceCardProps) {
  return (
    <div
      className="rounded-sm border px-6 py-5 space-y-1"
      style={{
        borderColor: accent ? "hsl(var(--accent))" : "hsl(var(--card-border))",
        background: "hsl(var(--card))",
      }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: accent ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }}
      >
        {label}
      </p>
      <p className="font-serif text-3xl sm:text-4xl font-semibold leading-none">{value}</p>
      <p className="font-sans text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{sub}</p>
    </div>
  );
}

function TipRow({ tip }: { tip: TipEntry }) {
  const isReceived = tip.direction === "received";
  return (
    <div
      className="flex items-start gap-4 rounded-sm border px-5 py-3.5"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
    >
      <span
        className="font-mono text-[11px] uppercase tracking-[0.15em] shrink-0 mt-0.5 w-4"
        style={{ color: isReceived ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }}
      >
        {isReceived ? "+" : "−"}
      </span>
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-sans text-sm">
          <strong>{tip.amount} {tip.currency === "token" ? tip.tokenCode : "XRP"}</strong>
          {" "}
          {isReceived ? `from ${tip.otherName}` : `to ${tip.otherName}`}
        </p>
        {tip.note && (
          <p className="font-serif text-sm italic truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
            &ldquo;{tip.note}&rdquo;
          </p>
        )}
      </div>
      <span
        className="font-mono text-[10px] shrink-0 mt-0.5"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {new Date(tip.sentAt).toLocaleDateString("en-CA")}
      </span>
    </div>
  );
}

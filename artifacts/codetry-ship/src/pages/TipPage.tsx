import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ApiError, searchMembers, sendTip, fetchWallet, type MemberSearchResult, type WalletState } from "@/lib/api";

export function TipPage() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemberSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<MemberSearchResult | null>(null);

  const [amount, setAmount] = useState("1");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ recipientName: string; amount: string; tokenCode: string } | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadWallet() {
      try {
        const w = await fetchWallet();
        setWallet(w);
      } catch {
        // wallet load failing shouldn't block the tip page
      } finally {
        setWalletLoading(false);
      }
    }
    void loadWallet();
  }, []);

  useEffect(() => {
    if (selected) return;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchMembers(query.trim());
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [query, selected]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (submitting) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await sendTip({
        toMemberId: selected.id,
        amount: amount.trim(),
        currency: "token",
        note: note.trim(),
      });
      setConfirmed({ recipientName: res.recipientName, amount: res.amount, tokenCode: res.tokenCode });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong sending the tip. Try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const availableBalance = wallet
    ? parseFloat(wallet.tokenBalance)
    : null;

  if (confirmed) {
    return (
      <main className="min-h-screen w-full bg-background text-foreground">
        <div className="mx-auto max-w-[38rem] px-6 sm:px-8 py-16 sm:py-24">
          <div
            className="rounded-sm border bg-card p-8 sm:p-10 space-y-5"
            style={{ borderColor: "hsl(var(--card-border))" }}
            role="status"
            aria-live="polite"
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              tip sent
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl leading-tight">
              {confirmed.amount} {confirmed.tokenCode} sent to {confirmed.recipientName}.
            </h1>
            <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              It landed in their wallet immediately. No delay, no pending,
              no confirmation needed on their end.
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmed(null);
                  setSelected(null);
                  setQuery("");
                  setAmount("1");
                  setNote("");
                }}
                className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Tip someone else
              </button>
              <Link
                href="/economy/wallet"
                className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                Back to wallet →
              </Link>
            </div>
            <p className="signoff pt-4">— headwaters</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[38rem] px-6 sm:px-8 py-16 sm:py-24">

        {/* ── Header ── */}
        <header className="space-y-5">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            codetry · tip
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Send a tip.
          </h1>
        </header>

        <section className="mt-8 sm:mt-10 font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
          <p>
            Someone gave you useful knowledge. A recipe, a route, a contact.
            Advice that saved you money or a trip. Send them something back.
            It takes ten seconds.
          </p>
        </section>

        {/* ── Balance chip ── */}
        {!walletLoading && wallet && (
          <div
            className="mt-6 inline-flex items-center gap-2 rounded-sm border px-4 py-1.5"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "hsl(var(--muted-foreground))" }}>
              Your balance
            </span>
            <span className="font-mono text-sm font-semibold">
              {parseFloat(wallet.tokenBalance).toFixed(2)} {wallet.tokenCode}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 sm:mt-12 space-y-7" noValidate>

          {/* ── Recipient search ── */}
          <div className="space-y-2">
            <label className="block font-sans text-sm font-medium">
              Who are you tipping?{" "}
              <span style={{ color: "hsl(var(--accent))" }}>*</span>
            </label>

            {selected ? (
              <div
                className="flex items-center gap-3 rounded-sm border px-4 py-3"
                style={{ borderColor: "hsl(var(--accent))", background: "hsl(var(--card))" }}
              >
                <div className="flex-1">
                  <p className="font-sans text-sm font-medium">{selected.firstName} {selected.lastName}</p>
                  <p className="font-sans text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {selected.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelected(null); setQuery(""); }}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-80"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  change
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
                  style={{ borderColor: "hsl(var(--card-border))" }}
                  autoComplete="off"
                />
                {searching && (
                  <p className="mt-1 font-sans text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Searching…
                  </p>
                )}
                {results.length > 0 && (
                  <ul
                    className="mt-1 rounded-sm border divide-y overflow-hidden"
                    style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
                  >
                    {results.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => { setSelected(r); setQuery(""); setResults([]); }}
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <p className="font-sans text-sm font-medium">{r.firstName} {r.lastName}</p>
                          <p className="font-sans text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                            {r.email}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {!searching && query.trim().length >= 2 && results.length === 0 && (
                  <p className="mt-1 font-sans text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    No community members found matching that name.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Amount ── */}
          <div className="space-y-2">
            <label htmlFor="tip-amount" className="block font-sans text-sm font-medium">
              How much?{" "}
              <span style={{ color: "hsl(var(--accent))" }}>*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                id="tip-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-28 rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
                required
              />
              <span
                className="font-mono text-sm"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {wallet?.tokenCode ?? "tokens"}
              </span>
            </div>
            {availableBalance !== null && parseFloat(amount) > availableBalance && (
              <p className="font-sans text-xs text-destructive">
                You only have {availableBalance.toFixed(2)} {wallet?.tokenCode ?? "tokens"} available.
              </p>
            )}
          </div>

          {/* ── Note ── */}
          <div className="space-y-2">
            <label htmlFor="tip-note" className="block font-sans text-sm font-medium">
              What&rsquo;s this for? (optional)
            </label>
            <input
              id="tip-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="for the freight advice, for the bannock recipe…"
              className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
              style={{ borderColor: "hsl(var(--card-border))" }}
              autoComplete="off"
              maxLength={120}
            />
            <p className="font-sans text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Plain language. It&rsquo;ll show in their transaction history.
            </p>
          </div>

          {error && (
            <p role="alert" className="font-sans text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <button
              type="submit"
              disabled={submitting || !selected}
              className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {submitting ? "Sending…" : "Send tip"}
            </button>
            <Link
              href="/economy/wallet"
              className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Back to wallet
            </Link>
          </div>

          <p className="font-sans text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Tips are permanent. They land immediately.{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:opacity-80">
              Privacy policy.
            </a>
          </p>
        </form>

        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · codetry · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}

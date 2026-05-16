import { useState, useCallback } from "react";
import { Client, Wallet, xrpToDrops } from "xrpl";

// ── Constants ──────────────────────────────────────────────────────────────
const TESTNET_WS   = "wss://s.altnet.rippletest.net:51233";
const TESTNET_FAUCET = "https://faucet.altnet.rippletest.net/accounts";
// Stable testnet recipient — stands in for the content author's tip address
const AUTHOR_ADDR  = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe";
const AUTHOR_HANDLE = "watershed_anon_7a3f";

// ── Types ──────────────────────────────────────────────────────────────────
type Phase =
  | { step: "idle" }
  | { step: "funding" }
  | { step: "funded"; wallet: Wallet; balance: string }
  | { step: "tipping"; wallet: Wallet; balance: string; amount: string }
  | { step: "tipped";  wallet: Wallet; balance: string; txHash: string; amount: string }
  | { step: "error";   message: string };

// ── Colours (Zone 5 palette — low-key, no flash) ──────────────────────────
const SLATE  = "#1e2d3d";
const WATER  = "#2a6496";
const FOAM   = "#f0f4f8";
const MIST   = "#b0bec5";
const REED   = "#5d7a5f";
const AMBER  = "#d4860a";
const INK    = "#1a1a1a";

// ── Mock post ─────────────────────────────────────────────────────────────
const POST = {
  handle: AUTHOR_HANDLE,
  time: "2 days ago",
  body: `Found a local source for used wide-mouth jar lids — still sealed, came from a kitchen that switched to weck jars. Tested three batches of preserves, all sealed fine. Will ask if they'll set aside a case monthly. Anyone else doing this kind of lid cycling? Feels like it should be a standing thing at the market. No pressure to reply, just putting it in the commons.`,
  tags: ["preservation", "jar-cycling", "wabigoon-area"],
};

// ── Small helpers ──────────────────────────────────────────────────────────
async function fundWallet(): Promise<{ wallet: Wallet; balance: string }> {
  const res = await fetch(TESTNET_FAUCET, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`Faucet returned ${res.status}`);
  const data = await res.json();
  const wallet = Wallet.fromSeed(data.account.secret);
  // Give the faucet a moment, then check balance
  await new Promise((r) => setTimeout(r, 4000));
  const balance = await getBalance(wallet.address);
  return { wallet, balance };
}

async function getBalance(address: string): Promise<string> {
  const client = new Client(TESTNET_WS);
  await client.connect();
  try {
    const res = await client.getBalances(address);
    const xrp = res.find((b) => b.currency === "XRP");
    return xrp ? xrp.value : "0";
  } finally {
    await client.disconnect();
  }
}

async function sendTip(
  wallet: Wallet,
  amountXrp: string,
): Promise<{ txHash: string; newBalance: string }> {
  const client = new Client(TESTNET_WS);
  await client.connect();
  try {
    const prepared = await client.autofill({
      TransactionType: "Payment",
      Account: wallet.address,
      Amount: xrpToDrops(amountXrp),
      Destination: AUTHOR_ADDR,
    });
    const { tx_blob } = wallet.sign(prepared);
    const result = await client.submitAndWait(tx_blob);
    const txHash = (result.result as any).hash as string;
    const newBalance = await getBalance(wallet.address);
    return { txHash, newBalance };
  } finally {
    await client.disconnect();
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function XRPLTip() {
  const [phase, setPhase] = useState<Phase>({ step: "idle" });
  const [tipAmount, setTipAmount] = useState("0.5");
  const [customAmt, setCustomAmt] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const effectiveAmount = useCustom && customAmt ? customAmt : tipAmount;

  const handleFund = useCallback(async () => {
    setPhase({ step: "funding" });
    try {
      const { wallet, balance } = await fundWallet();
      setPhase({ step: "funded", wallet, balance });
    } catch (e: any) {
      setPhase({ step: "error", message: e.message ?? "Faucet failed." });
    }
  }, []);

  const handleTip = useCallback(async () => {
    if (phase.step !== "funded") return;
    const { wallet, balance } = phase;
    setPhase({ step: "tipping", wallet, balance, amount: effectiveAmount });
    try {
      const { txHash, newBalance } = await sendTip(wallet, effectiveAmount);
      setPhase({ step: "tipped", wallet, balance: newBalance, txHash, amount: effectiveAmount });
    } catch (e: any) {
      setPhase({ step: "error", message: e.message ?? "Transaction failed." });
    }
  }, [phase, effectiveAmount]);

  const handleReset = () => {
    setPhase({ step: "idle" });
    setTipAmount("0.5");
    setCustomAmt("");
    setUseCustom(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: FOAM, fontFamily: "Inter, system-ui, sans-serif", color: INK }}>

      {/* Top bar */}
      <div style={{ background: SLATE, padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "white" }}>The Shallows</span>
          <span style={{ fontSize: "0.7rem", color: MIST, marginLeft: "0.6rem", letterSpacing: "0.08em" }}>XRPL tipping · testnet PoC</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.62rem", color: MIST, letterSpacing: "0.06em", textTransform: "uppercase" }}>Zone 5 · No algorithm · No promotion</span>
          <span style={{ background: WATER, color: "white", fontSize: "0.58rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: 20, letterSpacing: "0.06em" }}>TESTNET</span>
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>

        {/* ── Left: mock post ───────────────────────────────────────── */}
        <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", padding: "1.75rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

          {/* Author row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.1rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${REED}, ${WATER})`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "white", fontWeight: 700 }}>W</span>
            </div>
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: SLATE, margin: 0 }}>{POST.handle}</p>
              <p style={{ fontSize: "0.7rem", color: MIST, margin: 0 }}>{POST.time}</p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: "0.62rem", color: MIST, letterSpacing: "0.05em", textTransform: "uppercase" }}>commons post</span>
          </div>

          {/* Body */}
          <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: INK, margin: "0 0 1.25rem", whiteSpace: "pre-wrap" }}>{POST.body}</p>

          {/* Tags */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {POST.tags.map((t) => (
              <span key={t} style={{ background: "rgba(42,100,150,0.08)", color: WATER, fontSize: "0.7rem", padding: "0.18rem 0.55rem", borderRadius: 12, fontWeight: 500 }}>
                #{t}
              </span>
            ))}
          </div>

          {/* Commons rules note */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "1rem", display: "flex", gap: "1.5rem" }}>
            {["No likes", "No share count", "Flag to hide"].map((r) => (
              <span key={r} style={{ fontSize: "0.65rem", color: MIST, letterSpacing: "0.04em" }}>· {r}</span>
            ))}
          </div>
        </div>

        {/* ── Right: wallet + tip flow ──────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Architecture note */}
          <div style={{ background: "rgba(30,45,61,0.04)", border: "1px solid rgba(30,45,61,0.1)", borderRadius: 8, padding: "0.9rem 1rem" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 700, color: SLATE, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.4rem" }}>Architecture note</p>
            <p style={{ fontSize: "0.72rem", color: "#4a5568", margin: 0, lineHeight: 1.6 }}>
              Custody-free. The platform never touches the XRP. You sign in your wallet; the payment goes peer-to-peer on the XRPL. Author receives directly to their address.
            </p>
          </div>

          {/* Wallet panel */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", padding: "1.4rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: SLATE, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 1rem" }}>Your wallet</p>

            {/* ── idle ── */}
            {phase.step === "idle" && (
              <div>
                <p style={{ fontSize: "0.8rem", color: "#4a5568", margin: "0 0 1rem", lineHeight: 1.6 }}>
                  Get a funded testnet wallet to try a real XRPL payment. No real XRP is used — this is the XRPL Testnet.
                </p>
                <button onClick={handleFund} style={btnStyle(WATER)}>
                  Get testnet wallet
                </button>
              </div>
            )}

            {/* ── funding ── */}
            {phase.step === "funding" && (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <Spinner />
                <p style={{ fontSize: "0.78rem", color: MIST, marginTop: "0.75rem" }}>Calling testnet faucet…</p>
              </div>
            )}

            {/* ── funded ── */}
            {phase.step === "funded" && (
              <div>
                <WalletCard addr={phase.wallet.address} balance={phase.balance} />
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: SLATE, letterSpacing: "0.08em", textTransform: "uppercase", margin: "1rem 0 0.5rem" }}>Send tip to {AUTHOR_HANDLE}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  {["0.1", "0.5", "1"].map((a) => (
                    <button
                      key={a}
                      onClick={() => { setTipAmount(a); setUseCustom(false); }}
                      style={amtBtnStyle(tipAmount === a && !useCustom)}
                    >
                      {a} XRP
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
                  <input
                    type="number"
                    placeholder="Custom XRP"
                    value={customAmt}
                    onChange={(e) => { setCustomAmt(e.target.value); setUseCustom(true); }}
                    onFocus={() => setUseCustom(true)}
                    style={{ flex: 1, padding: "0.45rem 0.65rem", border: `1px solid ${useCustom ? WATER : "rgba(0,0,0,0.15)"}`, borderRadius: 6, fontSize: "0.8rem", outline: "none", color: INK }}
                  />
                </div>
                <RecipientRow />
                <button onClick={handleTip} disabled={!effectiveAmount || Number(effectiveAmount) <= 0} style={btnStyle(REED)}>
                  Send {effectiveAmount} XRP tip →
                </button>
              </div>
            )}

            {/* ── tipping ── */}
            {phase.step === "tipping" && (
              <div>
                <WalletCard addr={phase.wallet.address} balance={phase.balance} />
                <div style={{ textAlign: "center", padding: "1.25rem 0" }}>
                  <Spinner color={REED} />
                  <p style={{ fontSize: "0.78rem", color: MIST, marginTop: "0.75rem" }}>Signing and submitting {phase.amount} XRP…</p>
                </div>
              </div>
            )}

            {/* ── tipped ── */}
            {phase.step === "tipped" && (
              <div>
                <div style={{ background: "rgba(93,122,95,0.08)", border: `1px solid ${REED}`, borderRadius: 8, padding: "0.9rem 1rem", marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: REED, margin: "0 0 0.3rem" }}>✓ Tip sent — {phase.amount} XRP</p>
                  <p style={{ fontSize: "0.66rem", color: "#4a5568", margin: 0, lineHeight: 1.6 }}>
                    Transaction confirmed on XRPL Testnet. The XRP went directly to the author — no middleman.
                  </p>
                </div>
                <WalletCard addr={phase.wallet.address} balance={phase.balance} />
                <div style={{ margin: "0.9rem 0", padding: "0.7rem 0.85rem", background: "rgba(0,0,0,0.03)", borderRadius: 6, wordBreak: "break-all" }}>
                  <p style={{ fontSize: "0.58rem", fontWeight: 700, color: MIST, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.25rem" }}>Tx hash</p>
                  <p style={{ fontSize: "0.63rem", color: SLATE, fontFamily: "monospace", margin: 0 }}>{phase.txHash}</p>
                </div>
                <a
                  href={`https://testnet.xrpl.org/transactions/${phase.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", fontSize: "0.72rem", color: WATER, textDecoration: "underline", marginBottom: "1rem" }}
                >
                  View on XRPL Testnet Explorer →
                </a>
                <button onClick={handleReset} style={btnStyle(SLATE)}>
                  Try another tip
                </button>
              </div>
            )}

            {/* ── error ── */}
            {phase.step === "error" && (
              <div>
                <div style={{ background: "rgba(211,47,47,0.06)", border: "1px solid rgba(211,47,47,0.3)", borderRadius: 8, padding: "0.9rem", marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c62828", margin: "0 0 0.3rem" }}>Something went wrong</p>
                  <p style={{ fontSize: "0.68rem", color: "#4a5568", margin: 0, wordBreak: "break-word" }}>{phase.message}</p>
                </div>
                <button onClick={handleReset} style={btnStyle(SLATE)}>Try again</button>
              </div>
            )}
          </div>

          {/* Integration notes card */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", padding: "1.2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 700, color: SLATE, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.75rem" }}>Hand-off notes for Dam Days agent</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: "Recipient", note: "Author's XRPL address stored in their Shallows profile — no server custody." },
                { label: "Wallet", note: "v1 uses user-supplied seed. v2 should integrate GemWallet or Crossmark browser extension." },
                { label: "Amounts", note: "Fixed set + custom. Consider memo field for post reference (optional, privacy tradeoff)." },
                { label: "Mainnet", note: "Change TESTNET_WS to wss://xrplcluster.com and remove testnet badge. Nothing else changes." },
                { label: "Moderation", note: "Tipping is unmoderated by design. Flag-to-hide applies to posts, not payments." },
                { label: "Zone 5 rule", note: "Tip counts are not displayed publicly. The author sees their balance; nobody else does." },
              ].map((n) => (
                <div key={n.label} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0.4rem", alignItems: "start" }}>
                  <span style={{ fontSize: "0.66rem", fontWeight: 700, color: WATER }}>{n.label}</span>
                  <span style={{ fontSize: "0.66rem", color: "#4a5568", lineHeight: 1.55 }}>{n.note}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function WalletCard({ addr, balance }: { addr: string; balance: string }) {
  return (
    <div style={{ background: "rgba(30,45,61,0.04)", borderRadius: 7, padding: "0.65rem 0.85rem", marginBottom: "0.85rem", wordBreak: "break-all" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.58rem", fontWeight: 700, color: MIST, letterSpacing: "0.1em", textTransform: "uppercase" }}>Address</span>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: SLATE }}>{parseFloat(balance).toFixed(2)} XRP</span>
      </div>
      <p style={{ fontSize: "0.62rem", color: SLATE, fontFamily: "monospace", margin: 0 }}>{addr}</p>
    </div>
  );
}

function RecipientRow() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", padding: "0.45rem 0.65rem", background: "rgba(93,122,95,0.06)", borderRadius: 6 }}>
      <span style={{ fontSize: "0.68rem", color: "#4a5568" }}>To: <strong style={{ color: SLATE }}>{AUTHOR_HANDLE}</strong></span>
      <span style={{ fontSize: "0.6rem", color: MIST, fontFamily: "monospace" }}>{AUTHOR_ADDR.slice(0, 8)}…</span>
    </div>
  );
}

function Spinner({ color = WATER }: { color?: string }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      border: `3px solid rgba(0,0,0,0.08)`,
      borderTopColor: color,
      animation: "spin 0.8s linear infinite",
      margin: "0 auto",
    }} />
  );
}

// ── Style helpers ──────────────────────────────────────────────────────────

function btnStyle(bg: string): React.CSSProperties {
  return {
    display: "block", width: "100%",
    background: bg, color: "white",
    border: "none", borderRadius: 7,
    padding: "0.65rem 1rem",
    fontSize: "0.82rem", fontWeight: 600,
    cursor: "pointer", textAlign: "center",
  };
}

function amtBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? WATER : "rgba(42,100,150,0.07)",
    color: active ? "white" : WATER,
    border: `1px solid ${active ? WATER : "rgba(42,100,150,0.2)"}`,
    borderRadius: 6, padding: "0.45rem 0",
    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
  };
}

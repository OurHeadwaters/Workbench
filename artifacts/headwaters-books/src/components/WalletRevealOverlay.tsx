import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Wallet, ArrowRight, Heart } from "lucide-react";
import { customFetch } from "@workspace/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetHhBand } from "@workspace/api-client-react";

interface WalletData {
  memberId: string;
  firstName: string;
  lastName: string;
  tokenBalance: string;
  tokenCode: string;
  walletRevealed: boolean;
  walletRevealPending: boolean;
  firstValueAmount: string | null;
  firstValueCurrency: string | null;
  firstValueSourceType: "task" | "tip" | "referral" | null;
  firstValueSourceName: string | null;
  referralCode: string;
}

interface Merchant {
  id: string;
  name: string;
  category: string;
}

// localStorage fast-path: prevents flash on same device between page loads
// while the server is the authoritative source across devices.
const SEEN_KEY = (memberId: string) => `hh_wallet_reveal_seen_${memberId}`;

function hasSeenLocally(memberId: string): boolean {
  try {
    return localStorage.getItem(SEEN_KEY(memberId)) === "1";
  } catch {
    return false;
  }
}

function markSeenLocally(memberId: string) {
  try {
    localStorage.setItem(SEEN_KEY(memberId), "1");
  } catch {
    /* ignore */
  }
}

interface Props {
  onDismiss?: () => void;
}

export default function WalletRevealOverlay({ onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const qc = useQueryClient();

  const { data: band } = useGetHhBand();

  const { data: wallet } = useQuery<WalletData>({
    queryKey: ["hh-wallet-reveal"],
    queryFn: () => customFetch<WalletData>("/helping-hands/my/wallet", {}),
    staleTime: 60_000,
  });

  const { data: merchants = [] } = useQuery<Merchant[]>({
    queryKey: ["hh-merchants-reveal"],
    queryFn: () => customFetch<Merchant[]>("/helping-hands/merchants", {}),
    enabled: visible,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!wallet) return;
    // Server is authoritative: only show if server says reveal is pending
    if (!wallet.walletRevealPending) return;
    // localStorage fast-path: skip animation on same device after already seen
    if (hasSeenLocally(wallet.memberId)) return;

    setVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimIn(true));
    });
  }, [wallet]);

  async function dismiss() {
    if (wallet) {
      // Mark seen server-side (cross-device, authoritative)
      markSeenLocally(wallet.memberId);
      try {
        await customFetch("/helping-hands/my/wallet/reveal-seen", {
          method: "POST",
        });
        // Invalidate so next wallet fetch reflects walletRevealPending: false
        qc.invalidateQueries({ queryKey: ["hh-wallet-reveal"] });
      } catch {
        /* non-critical — localStorage already guards same device */
      }
    }

    setAnimIn(false);
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 400);
  }

  if (!visible || !wallet) return null;

  const tokenCode = band?.communityTokenCode ?? wallet.tokenCode ?? "HWBAND";
  const firstName = wallet.firstName;

  const displayAmount = wallet.firstValueAmount
    ? parseFloat(wallet.firstValueAmount).toFixed(2)
    : parseFloat(wallet.tokenBalance).toFixed(2);

  // Build "from" line based on event type
  let fromLine: string;
  if (wallet.firstValueSourceType === "tip" && wallet.firstValueSourceName) {
    fromLine = `${wallet.firstValueSourceName} sent you this.`;
  } else if (wallet.firstValueSourceType === "referral" && wallet.firstValueSourceName) {
    fromLine = `${wallet.firstValueSourceName} shared the referral link that brought you here.`;
  } else if (wallet.firstValueSourceType === "task") {
    fromLine = "You earned this completing a task for your band.";
  } else {
    fromLine = "Your community put this here.";
  }

  const merchantNames = merchants
    .filter((m) => m.name)
    .slice(0, 3)
    .map((m) => m.name);

  const spendLine =
    merchantNames.length > 0
      ? `Spend it at ${merchantNames.join(", ")} — and anywhere else your band adds.`
      : "Spend it at participating stores in your community.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        transition: "opacity 0.4s ease",
        opacity: animIn ? 1 : 0,
        pointerEvents: animIn ? "auto" : "none",
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #78350f 0%, #1c0a00 55%, #0a0500 100%)",
        }}
        onClick={dismiss}
      />

      {/* Torchlight glow rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -65%)",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.06) 40%, transparent 70%)",
            animation: animIn ? "hh-pulse-glow 3s ease-in-out infinite" : "none",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -80%)",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.28) 0%, transparent 65%)",
            animation: animIn
              ? "hh-pulse-glow 2.4s ease-in-out 0.3s infinite"
              : "none",
          }}
        />
      </div>

      <style>{`
        @keyframes hh-pulse-glow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes hh-float-up {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Card */}
      <div
        className="relative max-w-md w-full rounded-2xl overflow-hidden text-center"
        style={{
          background:
            "linear-gradient(160deg, rgba(120,53,15,0.95) 0%, rgba(28,10,0,0.98) 100%)",
          border: "1px solid rgba(251,191,36,0.25)",
          boxShadow:
            "0 0 60px rgba(251,191,36,0.15), 0 24px 64px rgba(0,0,0,0.6)",
          animation: animIn ? "hh-float-up 0.5s ease forwards" : "none",
        }}
      >
        {/* Top glow strip */}
        <div
          style={{
            height: 3,
            background:
              "linear-gradient(90deg, transparent, rgba(251,191,36,0.7) 30%, rgba(251,191,36,1) 50%, rgba(251,191,36,0.7) 70%, transparent)",
          }}
        />

        <div className="px-8 py-10 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0.05) 70%)",
                border: "1.5px solid rgba(251,191,36,0.4)",
                boxShadow: "0 0 24px rgba(251,191,36,0.2)",
              }}
            >
              <Wallet
                className="w-9 h-9"
                style={{ color: "rgba(251,191,36,0.95)" }}
              />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(251,191,36,0.6)" }}
            >
              {firstName ? `Hey ${firstName} —` : "Hey —"}
            </p>
            <h1
              className="text-3xl font-serif font-bold leading-tight"
              style={{ color: "rgba(255,255,255,0.97)" }}
            >
              Your first credit
              <br />
              just landed.
            </h1>
          </div>

          {/* Amount */}
          <div
            className="rounded-xl px-6 py-5"
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
            }}
          >
            <p
              className="text-5xl font-bold tabular-nums"
              style={{ color: "rgba(251,191,36,0.97)" }}
            >
              {displayAmount}
            </p>
            <p
              className="text-sm mt-1 font-medium"
              style={{ color: "rgba(251,191,36,0.6)" }}
            >
              {tokenCode} community credits
            </p>
          </div>

          {/* Explanation */}
          <div className="space-y-3 text-left">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              This is real value — not points, not a voucher.
              It doesn't expire and you own it completely.{" "}
              <span style={{ color: "rgba(255,255,255,0.9)" }}>
                {spendLine}
              </span>
            </p>
            <div
              className="flex items-start gap-2 rounded-lg px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <Heart
                className="w-3.5 h-3.5 mt-0.5 shrink-0"
                style={{ color: "rgba(251,191,36,0.6)" }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {fromLine} Welcome to the circle.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-1">
            <Link href="/helping-hands/envelopes" onClick={dismiss}>
              <button
                className="w-full flex items-center justify-center gap-2 rounded-lg py-3 font-semibold text-sm transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,191,36,0.95), rgba(217,119,6,0.95))",
                  color: "#1c0a00",
                  boxShadow: "0 4px 20px rgba(251,191,36,0.3)",
                }}
              >
                See my envelope
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={dismiss}
              className="w-full rounded-lg py-2.5 text-sm transition-colors"
              style={{
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

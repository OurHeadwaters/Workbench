import { useLocation } from "wouter";
import { Lock, BookOpen, ArrowRight } from "lucide-react";
import { useClerk } from "@clerk/react";

export function UpgradeNudge({ tier }: { tier: string }) {
  const { signOut } = useClerk();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: "var(--cream)" }}>
      <header className="border-b px-4 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} color="var(--accent)" />
            <span
              className="font-semibold"
              style={{ fontFamily: "var(--font-serif)", color: "var(--warm-brown)" }}
            >
              Field Guide Finance
            </span>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" }).then(() => navigate("/"))}
            className="text-sm"
            style={{ color: "var(--mid-brown)" }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="max-w-md w-full rounded-2xl border p-8 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "white" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "var(--accent-light)" }}
          >
            <Lock size={24} color="var(--accent)" />
          </div>

          <h1
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)", color: "var(--warm-brown)" }}
          >
            Upgrade to access this course
          </h1>

          <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--mid-brown)" }}>
            Field Guide Finance is available to <strong>Harvest household</strong> and{" "}
            <strong>Pro producer</strong> members of 807 Benefits.
          </p>

          {tier && tier !== "none" && tier !== "unknown" && (
            <p
              className="text-xs mb-6 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--cream-dark)", color: "var(--mid-brown)" }}
            >
              Your current tier: <strong>{tier}</strong>
            </p>
          )}

          <p className="text-sm mb-6" style={{ color: "var(--mid-brown)" }}>
            Upgrading is handled through the 807 Benefits co-op checkout.
          </p>

          <a
            href="https://807benefits.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors w-full justify-center"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            Upgrade at 807benefits.ca
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

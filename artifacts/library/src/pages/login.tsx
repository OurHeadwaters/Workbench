import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronDown,
  EyeOff,
  FolderOpen,
  Lock,
  Loader2,
  Network,
  Tag,
  Users,
} from "lucide-react";
import { setOwnerToken } from "@/lib/ownerAuth";

type LoginResponse = { token: string };

const LIBRARY_SECTIONS = [
  {
    icon: AlertTriangle,
    label: "Why Stores Fail",
    heading: "The main public synthesis",
    body: "A named catalog of every failure mode in the current northern-store model — drawn from the library, backed by sources, readable via a share link.",
    public: true,
    accent: "rust",
  },
  {
    icon: EyeOff,
    label: "Phenomena",
    heading: "Cross-industry findings",
    body: "Numbers from Transport Canada, federal audits, and academic researchers that describe one structural object. The link between them is the finding.",
    public: false,
    accent: "accent",
  },
  {
    icon: BookOpen,
    label: "Research entries",
    heading: "The full library",
    body: "Academic papers, government reports, industry audits, and community documents — tagged by subject, producer, and project bucket.",
    public: false,
    accent: "evergreen",
  },
  {
    icon: FolderOpen,
    label: "Project buckets",
    heading: "Organized by project",
    body: "Research grouped into the active work streams — each bucket contains the entries that feed it and notes on what's still missing.",
    public: false,
    accent: "muted",
  },
  {
    icon: Users,
    label: "Producers",
    heading: "Who made the research",
    body: "Community organizations, government bodies, universities, and individual researchers — every entry traceable to who produced it.",
    public: false,
    accent: "muted",
  },
  {
    icon: Tag,
    label: "Subjects",
    heading: "Browse by theme",
    body: "Food sovereignty, supply chain, infrastructure, governance — cross-cutting subject tags so a researcher can pull a vertical slice of the library.",
    public: false,
    accent: "muted",
  },
];

type AccentKey = "rust" | "accent" | "evergreen" | "muted";

const accentMap: Record<AccentKey, { border: string; icon: string; pill: string }> = {
  rust: {
    border: "border-[hsl(14_64%_36%/0.30)] hover:border-[hsl(14_64%_36%/0.60)]",
    icon: "bg-[hsl(14_64%_36%/0.09)] text-[hsl(14_64%_36%)]",
    pill: "bg-[hsl(14_64%_36%/0.10)] text-[hsl(14_55%_32%)]",
  },
  accent: {
    border: "border-[hsl(14_64%_36%/0.22)] hover:border-[hsl(14_64%_36%/0.45)]",
    icon: "bg-[hsl(14_64%_36%/0.06)] text-[hsl(14_64%_36%)]",
    pill: "bg-[hsl(14_64%_36%/0.08)] text-[hsl(14_55%_32%)]",
  },
  evergreen: {
    border: "border-[hsl(145_36%_22%/0.22)] hover:border-[hsl(145_36%_22%/0.50)]",
    icon: "bg-[hsl(145_36%_22%/0.08)] text-[hsl(145_36%_22%)]",
    pill: "bg-[hsl(145_36%_22%/0.09)] text-[hsl(145_36%_22%)]",
  },
  muted: {
    border: "border-border/50 hover:border-border",
    icon: "bg-muted/60 text-muted-foreground",
    pill: "bg-muted text-muted-foreground",
  },
};

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [passphrase, setPassphrase] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function doLogin(body: Record<string, string>) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/library/owner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Sign-in failed");
        setSubmitting(false);
        return;
      }
      const data = (await res.json()) as LoginResponse;
      setOwnerToken(data.token);
      onSuccess();
    } catch {
      setError("Could not reach the server");
      setSubmitting(false);
    }
  }

  function onPassphraseSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passphrase.trim()) return;
    doLogin({ passphrase });
  }

  function onEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    doLogin({ email, password });
  }

  return (
    <Tabs defaultValue="email" className="space-y-4">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="email">Email &amp; password</TabsTrigger>
        <TabsTrigger value="passphrase">Owner passphrase</TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <form onSubmit={onEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="curator-email">Email</Label>
            <Input
              id="curator-email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              data-testid="input-curator-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="curator-password">Password</Label>
            <Input
              id="curator-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              data-testid="input-curator-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" data-testid="text-owner-login-error">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !email.trim() || !password.trim()}
            data-testid="button-owner-login"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="passphrase">
        <form onSubmit={onPassphraseSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passphrase">Passphrase</Label>
            <Input
              id="passphrase"
              type="password"
              autoComplete="current-password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              disabled={submitting}
              data-testid="input-owner-passphrase"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" data-testid="text-owner-login-error">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !passphrase.trim()}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing in…
              </>
            ) : (
              "Sign in with passphrase"
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Use the owner passphrase for initial setup or recovery.
          </p>
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default function Login() {
  const [, navigate] = useLocation();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">

      {/* Top nav */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border bg-background/80 sticky top-0 z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-base text-foreground leading-none">
              Northern Food Systems
            </span>
            <span className="hidden sm:inline text-muted-foreground text-sm">
              Research Library
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSignIn(true)}
          className="gap-2"
          data-testid="button-show-owner-login"
        >
          <Lock className="h-3.5 w-3.5" />
          Owner sign-in
        </Button>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 py-20 sm:py-24 max-w-3xl mx-auto w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><path d='M0 40 Q150 18 300 44 Q450 70 600 40' fill='none' stroke='%231f3d2e' stroke-width='0.9' opacity='0.18'/><path d='M0 80 Q150 58 300 84 Q450 110 600 80' fill='none' stroke='%231f3d2e' stroke-width='0.9' opacity='0.18'/><path d='M0 120 Q150 98 300 124 Q450 150 600 120' fill='none' stroke='%231f3d2e' stroke-width='0.9' opacity='0.18'/><path d='M0 160 Q150 138 300 164 Q450 190 600 160' fill='none' stroke='%231f3d2e' stroke-width='0.9' opacity='0.18'/><path d='M0 200 Q150 176 300 204 Q450 232 600 200' fill='none' stroke='%231f3d2e' stroke-width='0.9' opacity='0.18'/></svg>\")",
            backgroundSize: "600px 400px",
            backgroundRepeat: "repeat",
            opacity: 0.5,
          }}
        />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/50" aria-hidden />
            A Headwaters project
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-[3.25rem] font-serif font-bold text-foreground leading-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Bridging what community, industry, government, and research each see separately
          </h1>
          <p className="text-base font-serif italic text-primary/60 max-w-xl mx-auto -mt-1">
            Knowledge rises cold and clean here.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The Northern Food Systems Research Library holds the evidence base behind
            Headwaters' analysis — documents tagged, cross-referenced, and synthesized so
            the patterns hidden across separate disciplines become impossible to miss.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="#why-stores-fail"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("why-stores-fail")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base gap-2">
                <AlertTriangle className="w-4 h-4" />
                Explore Why Stores Fail
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-base gap-2 text-muted-foreground"
              onClick={() => setShowSignIn(true)}
            >
              <Lock className="w-4 h-4" />
              Owner sign-in
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <Network className="w-3.5 h-3.5" />
            Contributor share links give read-only access without a sign-in
          </div>
        </div>
      </section>

      {/* Why Stores Fail spotlight */}
      <section
        id="why-stores-fail"
        className="max-w-4xl mx-auto w-full px-6 pb-14 scroll-mt-20"
      >
        <div
          className="flex items-center gap-4 my-8 text-[9px] uppercase tracking-[0.2em] text-[rgba(31,61,46,0.45)]"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(31,61,46,0.18)] to-transparent" />
          <span>Public synthesis</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(31,61,46,0.18)] to-transparent" />
        </div>

        <div className="rounded-xl border-2 border-[hsl(14_64%_36%/0.30)] bg-gradient-to-br from-[hsl(14_64%_36%/0.04)] to-[hsl(145_36%_22%/0.04)] p-7 sm:p-9 space-y-5">
          <div className="flex items-start gap-5">
            <div className="rounded-xl bg-[hsl(14_64%_36%/0.10)] text-[hsl(14_64%_36%)] p-3 shrink-0 mt-0.5">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.20em] text-[hsl(14_55%_32%)] mb-2">
                Synthesis · drawn from the library · publicly accessible via share link
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary leading-tight mb-3">
                Why Northern Stores Fail
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                A named catalog of every failure mode in the current northern-store model —
                with the evidence and the source it came from. The same dataset the
                community store analysis reads from, so they can never drift.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Governance failures",
              "Supply-chain gaps",
              "Infrastructure deficits",
              "Ownership structure",
              "Funding instability",
              "Cross-industry phenomena",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground flex items-start gap-3">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-primary/50" />
            <span>
              The full interactive version — with source links into the library, the
              Phenomena tracker, and the Reverse Test — is available to owners and
              contributors after sign-in. Public access is via a contributor share link.
            </span>
          </div>
        </div>
      </section>

      {/* Library sections grid */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-20">
        <div
          className="flex items-center gap-4 my-8 text-[9px] uppercase tracking-[0.2em] text-[rgba(31,61,46,0.45)]"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(31,61,46,0.18)] to-transparent" />
          <span>What's in the library</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(31,61,46,0.18)] to-transparent" />
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3">
            The full research stack
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Community, industry, government, and academic perspectives — held together in
            one place, cross-referenced so the connections become impossible to miss.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIBRARY_SECTIONS.map((section) => {
            const s = accentMap[section.accent as AccentKey];
            return (
              <Card
                key={section.label}
                className={`transition-all duration-200 bg-card border ${s.border}`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 shrink-0 ${s.icon}`}>
                      <section.icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {section.label}
                      </span>
                      {section.public ? (
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.pill}`}>
                          Public
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-muted-foreground/60 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Owner
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground leading-snug">
                    {section.heading}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-muted/30 px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-medium text-foreground">
              Curators and contributors sign in to manage the library
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              The full library — entries, tags, review queues, share links, and synthesis
              tools — is owner-access only. Share links give contributors read-only windows
              into specific views without a sign-in.
            </p>
          </div>
          <Button
            className="shrink-0 w-full sm:w-auto gap-2"
            onClick={() => setShowSignIn(true)}
          >
            Sign in <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row items-center gap-3 justify-between mt-auto">
        <span className="italic">
          A Headwaters project — We've always known how to fix it, now we can.
        </span>
        <a
          href="/library/privacy"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Privacy policy
        </a>
      </footer>

      {/* Sign-in overlay */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSignIn(false);
          }}
        >
          <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Curator sign-in
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Northern Food Systems Research Library
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSignIn(false)}
                className="text-muted-foreground hover:text-foreground transition-colors rounded p-1"
                aria-label="Close sign-in"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <SignInForm onSuccess={() => navigate("/")} />
              <p className="text-xs text-muted-foreground text-center pt-4">
                Contributor share links do not require a sign-in.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, type FormEvent } from "react";
import { useLocation, useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { setOwnerToken } from "@/lib/ownerAuth";

type Stage =
  | { kind: "email" }
  | { kind: "sent"; email: string }
  | { kind: "verifying" }
  | { kind: "error"; message: string };

export default function Login() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: "email" });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (!token) return;

    setStage({ kind: "verifying" });

    fetch(`/api/library/owner/verify-link?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          token?: string;
          error?: string;
        };
        if (!res.ok || !body.token) {
          setStage({
            kind: "error",
            message: body.error ?? "This sign-in link is invalid or has expired.",
          });
          return;
        }
        setOwnerToken(body.token);
        navigate("/");
      })
      .catch(() => {
        setStage({ kind: "error", message: "Could not reach the server." });
      });
  }, [search]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/library/owner/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setStage({
          kind: "error",
          message: body.error ?? "The server could not send the link right now. Please try again.",
        });
        return;
      }
      setStage({ kind: "sent", email: trimmed });
    } catch {
      setStage({ kind: "error", message: "Could not reach the server." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {stage.kind === "error" ? (
              <AlertCircle className="h-6 w-6 text-destructive" />
            ) : stage.kind === "sent" ? (
              <CheckCircle className="h-6 w-6 text-primary" />
            ) : (
              <Mail className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-serif">
            {stage.kind === "sent"
              ? "Check your inbox"
              : stage.kind === "verifying"
                ? "Signing you in…"
                : stage.kind === "error"
                  ? "Sign-in failed"
                  : "Curator sign-in"}
          </CardTitle>
          <CardDescription>Northern Food Systems Research Library</CardDescription>
        </CardHeader>

        <CardContent>
          {stage.kind === "email" && (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  data-testid="input-owner-email"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !email.trim()}
                data-testid="button-owner-request-link"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending…
                  </>
                ) : (
                  "Send sign-in link"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-2">
                We'll email you a one-time link. No password needed.
              </p>
            </form>
          )}

          {stage.kind === "sent" && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                A sign-in link was sent to{" "}
                <span className="font-medium text-foreground">{stage.email}</span>.
                Open the email and click the link to continue.
              </p>
              <p className="text-xs text-muted-foreground">
                The link expires in 15 minutes. Didn't get it?{" "}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={() => setStage({ kind: "email" })}
                >
                  Try again
                </button>
                .
              </p>
            </div>
          )}

          {stage.kind === "verifying" && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying your link…
            </div>
          )}

          {stage.kind === "error" && (
            <div className="space-y-4">
              <p
                className="text-sm text-destructive text-center"
                data-testid="text-owner-login-error"
              >
                {stage.message}
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStage({ kind: "email" })}
              >
                Try again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

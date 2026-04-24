import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Loader2 } from "lucide-react";
import { setOwnerToken } from "@/lib/ownerAuth";
import { login } from "@/lib/api";

export default function Login() {
  const [, navigate] = useLocation();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passphrase.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const token = await login(passphrase);
      setOwnerToken(token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">
            Annual Plan Check-in
          </CardTitle>
          <CardDescription>
            Sign in with your curator passphrase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passphrase">Passphrase</Label>
              <Input
                id="passphrase"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                disabled={submitting}
                data-testid="input-owner-passphrase"
              />
            </div>
            {error ? (
              <p
                className="text-sm text-destructive"
                data-testid="text-owner-login-error"
              >
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !passphrase.trim()}
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
            <p className="text-xs text-muted-foreground text-center pt-2">
              Same passphrase as the research library.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

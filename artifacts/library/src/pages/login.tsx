import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Loader2 } from "lucide-react";
import { setOwnerToken } from "@/lib/ownerAuth";

type LoginResponse = { token: string };

export default function Login() {
  const [, navigate] = useLocation();

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
      navigate("/");
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
    <div className="min-h-[100dvh] bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Curator sign-in</CardTitle>
          <CardDescription>Northern Food Systems Research Library</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="email">Email &amp; password</TabsTrigger>
              <TabsTrigger value="passphrase">Owner passphrase</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={onEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
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
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in…</>
                  ) : "Sign in"}
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
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in…</>
                  ) : "Sign in with passphrase"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Use the owner passphrase for initial setup or recovery.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center pt-4">
            Contributor share links do not require a sign-in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

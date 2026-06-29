import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLogin() {
  const { login, loginPending } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login(password);
      if (!res.authenticated) setError("Wrong password.");
    } catch {
      setError("Wrong password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <form onSubmit={onSubmit} className="bg-background border border-border rounded-2xl p-8 max-w-sm w-full space-y-6 shadow-sm">
        <div>
          <h1 className="font-serif text-3xl">Shop Tools</h1>
          <p className="text-sm text-muted-foreground mt-1">Staff & owner login</p>
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loginPending || !password}>
          {loginPending ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Demo default: <code className="bg-muted px-1.5 py-0.5 rounded">konstantino</code>
        </p>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { Users, UserPlus, ShieldOff, ShieldCheck, Crown } from "lucide-react";
import { apiHeaders, apiBase } from "@/lib/api";

type Curator = {
  id: string;
  email: string;
  name: string;
  isOwner: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  revokedAt: string | null;
};

function useCurators() {
  const { token } = useOwnerAuth();
  return useQuery<Curator[]>({
    queryKey: ["curators"],
    queryFn: async () => {
      const res = await fetch(`${apiBase}/api/library/curators`, {
        headers: apiHeaders(token),
      });
      if (!res.ok) throw new Error("Failed to load curators");
      return res.json();
    },
    enabled: !!token,
  });
}

function useCurrentCurator() {
  const { token } = useOwnerAuth();
  return useQuery<{ ok: boolean; curator: Curator }>({
    queryKey: ["currentCurator", token],
    queryFn: async () => {
      const res = await fetch(`${apiBase}/api/library/owner/me`, {
        headers: apiHeaders(token),
      });
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
    enabled: !!token,
  });
}

export default function TeamPage() {
  const { token } = useOwnerAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: curatorsData, isLoading } = useCurators();
  const { data: meData } = useCurrentCurator();
  const isOwner = meData?.curator?.isOwner === true;

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showForm, setShowForm] = useState(false);

  const addMutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; password: string }) => {
      const res = await fetch(`${apiBase}/api/library/curators`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...apiHeaders(token) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Failed to add curator");
      }
      return res.json() as Promise<Curator>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curators"] });
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      toast({ title: "Curator added", description: "They can now sign in with their email and password." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBase}/api/library/curators/${id}/revoke`, {
        method: "PATCH",
        headers: apiHeaders(token),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Failed to revoke curator");
      }
      return res.json() as Promise<Curator>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curators"] });
      toast({ title: "Access revoked" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBase}/api/library/curators/${id}/restore`, {
        method: "PATCH",
        headers: apiHeaders(token),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Failed to restore curator");
      }
      return res.json() as Promise<Curator>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curators"] });
      toast({ title: "Access restored" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;
    addMutation.mutate({ name: form.name.trim(), email: form.email.trim(), password: form.password.trim() });
  }

  const curators = curatorsData ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Team
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Curators can manage library entries, producers, contributors, and share links.
          Only the owner can add or revoke team members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active curators</CardTitle>
          {isOwner && (
            <CardDescription>
              Click "Add curator" to invite a new team member.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="px-6 py-4 text-sm text-muted-foreground">Loading…</p>
          ) : curators.length === 0 ? (
            <p className="px-6 py-4 text-sm text-muted-foreground">No curators yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {curators.map((c) => (
                <li key={c.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{c.name}</span>
                      {c.isOwner && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Crown className="h-3 w-3" />
                          Owner
                        </Badge>
                      )}
                      {c.revokedAt && (
                        <Badge variant="destructive" className="text-xs">Revoked</Badge>
                      )}
                      {c.id === meData?.curator?.id && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Added {new Date(c.createdAt).toLocaleDateString()}
                      {c.lastSignInAt
                        ? ` · Last sign-in ${new Date(c.lastSignInAt).toLocaleDateString()}`
                        : " · Never signed in"}
                    </p>
                  </div>
                  {isOwner && !c.isOwner && c.id !== meData?.curator?.id && (
                    <div className="shrink-0">
                      {c.revokedAt ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restoreMutation.mutate(c.id)}
                          disabled={restoreMutation.isPending}
                          className="gap-1"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Restore
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => revokeMutation.mutate(c.id)}
                          disabled={revokeMutation.isPending}
                          className="gap-1 text-destructive hover:text-destructive hover:border-destructive"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add a curator
            </CardTitle>
            <CardDescription>
              Set a name, email, and initial password. They can sign in immediately with these credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add curator
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label htmlFor="curator-name">Name</Label>
                  <Input
                    id="curator-name"
                    placeholder="Robin Smith"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={addMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curator-email">Email</Label>
                  <Input
                    id="curator-email"
                    type="email"
                    placeholder="robin@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={addMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curator-password">Initial password</Label>
                  <Input
                    id="curator-password"
                    type="password"
                    placeholder="They can change it later"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    disabled={addMutation.isPending}
                  />
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={
                      addMutation.isPending ||
                      !form.name.trim() ||
                      !form.email.trim() ||
                      !form.password.trim()
                    }
                  >
                    {addMutation.isPending ? "Adding…" : "Add curator"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setForm({ name: "", email: "", password: "" });
                    }}
                    disabled={addMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

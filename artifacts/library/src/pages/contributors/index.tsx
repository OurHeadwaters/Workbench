import { useState } from "react";
import { Link } from "wouter";
import { useListContributors, useCreateContributor } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Building, Link as LinkIcon, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { errMessage } from "@/lib/utils";

export default function Contributors() {
  const { data: contributors, isLoading, refetch } = useListContributors();
  const createContributor = useCreateContributor();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    notes: "",
  });

  const resetForm = () => setForm({ name: "", organization: "", email: "", notes: "" });

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", description: "Please enter a name.", variant: "destructive" });
      return;
    }
    try {
      await createContributor.mutateAsync({
        data: {
          name: form.name.trim(),
          organization: form.organization.trim() || undefined,
          email: form.email.trim() || undefined,
          notes: form.notes.trim() || undefined,
        },
      });
      toast({ title: "Contributor added", description: `${form.name} can now be sent share links.` });
      setIsAddOpen(false);
      resetForm();
      void refetch();
    } catch (err) {
      toast({
        title: "Could not add contributor",
        description: errMessage(err, "Unknown error"),
        variant: "destructive",
      });
    }
  };

  const filteredContributors = contributors?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.organization && c.organization.toLowerCase().includes(search.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Contributors</h1>
          <p className="text-muted-foreground">People and organizations collaborating on the research library.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Contributor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add contributor</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contrib-name">Name</Label>
                <Input
                  id="contrib-name"
                  placeholder="e.g. Bobbie Sonstenes"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrib-org">Organization (optional)</Label>
                <Input
                  id="contrib-org"
                  placeholder="e.g. NWO Hub"
                  value={form.organization}
                  onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrib-email">Email (optional)</Label>
                <Input
                  id="contrib-email"
                  type="email"
                  placeholder="hello@..."
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrib-notes">Notes (optional)</Label>
                <Textarea
                  id="contrib-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground px-1">
              Name and email are stored to send share links to this contributor.{" "}
              <a href="/library/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                See our privacy policy.
              </a>
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createContributor.isPending}>
                {createContributor.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <Input 
          placeholder="Search contributors..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      ) : filteredContributors?.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
          <p className="text-muted-foreground">No contributors found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContributors?.map((contributor) => (
            <Card key={contributor.id} className="h-full border-border bg-card shadow-sm flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-serif text-lg text-primary">
                    {contributor.name}
                  </CardTitle>
                </div>
                {contributor.organization && (
                  <div className="flex items-center text-sm text-muted-foreground gap-1.5 mt-1">
                    <Building className="h-3.5 w-3.5" />
                    <span>{contributor.organization}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                {contributor.email && (
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contributor.email}`} className="text-secondary hover:underline">
                      {contributor.email}
                    </a>
                  </div>
                )}
                
                {contributor.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {contributor.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50">
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-none">
                    {contributor.entryCount || 0} entries
                  </Badge>
                  
                  <Link href="/share-links">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-secondary hover:text-primary">
                      <LinkIcon className="h-3.5 w-3.5" />
                      Create Link
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

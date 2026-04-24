import { useState } from "react";
import { Link } from "wouter";
import { useListShareLinks, useCreateShareLink, useListContributors, useListSubjects, useListProjectBuckets } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, Plus, Copy, ExternalLink, ShieldAlert, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { errMessage } from "@/lib/utils";

export default function ShareLinks() {
  const { data: shareLinks, isLoading } = useListShareLinks();
  const { data: contributors } = useListContributors();
  const { data: subjects } = useListSubjects();
  const { data: buckets } = useListProjectBuckets();
  const createShareLink = useCreateShareLink();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<{
    contributorId: string;
    label: string;
    presetSubjectSlugs: string[];
    presetBucketSlugs: string[];
  }>({
    contributorId: "",
    label: "",
    presetSubjectSlugs: [],
    presetBucketSlugs: [],
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied",
      description: "Share link copied to clipboard.",
    });
  };

  const handleCreate = async () => {
    if (!formData.contributorId) {
      toast({ title: "Error", description: "Please select a contributor", variant: "destructive" });
      return;
    }
    
    try {
      await createShareLink.mutateAsync({
        data: {
          contributorId: formData.contributorId,
          label: formData.label || undefined,
          presetSubjectSlugs: formData.presetSubjectSlugs,
          presetBucketSlugs: formData.presetBucketSlugs,
        }
      });
      setIsAddOpen(false);
      setFormData({ contributorId: "", label: "", presetSubjectSlugs: [], presetBucketSlugs: [] });
      toast({ title: "Success", description: "Share link created" });
    } catch (err) {
      toast({ title: "Error", description: errMessage(err, "Failed to create share link"), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Share Links</h1>
          <p className="text-muted-foreground">Tokens for external contributors to securely upload files.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Share Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Share Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Contributor</Label>
                <Select value={formData.contributorId} onValueChange={(v) => setFormData(p => ({ ...p, contributorId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contributor" />
                  </SelectTrigger>
                  <SelectContent>
                    {contributors?.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label (Optional)</Label>
                <Input 
                  placeholder="e.g. 2024 Audit Documents" 
                  value={formData.label}
                  onChange={(e) => setFormData(p => ({ ...p, label: e.target.value }))}
                />
              </div>
              {/* Similar fields for subjects and buckets could go here */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createShareLink.isPending}>
                Generate Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      ) : shareLinks?.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
          <p className="text-muted-foreground">No active share links.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shareLinks?.map((link) => (
            <Card key={link.id} className={`border-border shadow-sm flex flex-col ${link.revokedAt ? 'opacity-60 bg-muted/50' : 'bg-card'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="font-serif text-lg text-primary mb-1">
                      {link.contributor.name}
                    </CardTitle>
                    {link.label && (
                      <CardDescription>{link.label}</CardDescription>
                    )}
                  </div>
                  {link.revokedAt ? (
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive border-none">Revoked</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-none">Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-2">
                  {link.presetSubjects?.map(s => (
                    <Badge key={s.slug} variant="outline" className="text-xs bg-background">{s.name}</Badge>
                  ))}
                  {link.presetBuckets?.map(b => (
                    <Badge key={b.slug} variant="outline" className="text-xs bg-background">{b.name}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                  <Input 
                    readOnly 
                    value={link.url || ""} 
                    className="font-mono text-xs bg-muted"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => handleCopy(link.id, link.url || "")}
                    disabled={!!link.revokedAt}
                  >
                    {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
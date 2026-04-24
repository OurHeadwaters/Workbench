import { useState } from "react";
import { Link } from "wouter";
import {
  useListProducers,
  useCreateProducer,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Mail, Phone, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { errMessage } from "@/lib/utils";

const PRODUCER_KINDS = [
  { value: "producer", label: "Producer (farm / processor)" },
  { value: "distributor", label: "Distributor / wholesaler" },
  { value: "study", label: "Study / report" },
  { value: "organization", label: "Organization" },
  { value: "other", label: "Other" },
] as const;

type ProducerKind = (typeof PRODUCER_KINDS)[number]["value"];

export default function Producers() {
  const [search, setSearch] = useState("");
  const { data: producers, isLoading, refetch } = useListProducers({ search });
  const createProducer = useCreateProducer();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    kind: ProducerKind;
    websiteUrl: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
    description: string;
  }>({
    name: "",
    kind: "producer",
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
    location: "",
    description: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      kind: "producer",
      websiteUrl: "",
      contactEmail: "",
      contactPhone: "",
      location: "",
      description: "",
    });
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", description: "Please enter a name.", variant: "destructive" });
      return;
    }
    try {
      await createProducer.mutateAsync({
        data: {
          name: form.name.trim(),
          kind: form.kind,
          websiteUrl: form.websiteUrl.trim() || undefined,
          contactEmail: form.contactEmail.trim() || undefined,
          contactPhone: form.contactPhone.trim() || undefined,
          location: form.location.trim() || undefined,
          description: form.description.trim() || undefined,
        },
      });
      toast({ title: "Producer added", description: `${form.name} is now in your sources.` });
      setIsAddOpen(false);
      resetForm();
      void refetch();
    } catch (err) {
      toast({
        title: "Could not add producer",
        description: errMessage(err, "Unknown error"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Producers & Sources</h1>
          <p className="text-muted-foreground">The network of farms, businesses, and organizations in the system.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>Add Producer</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Add producer / source</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prod-name">Name</Label>
                <Input
                  id="prod-name"
                  placeholder="e.g. Thunder Bay Country Market"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-kind">Kind</Label>
                <Select
                  value={form.kind}
                  onValueChange={(v) => setForm((f) => ({ ...f, kind: v as ProducerKind }))}
                >
                  <SelectTrigger id="prod-kind">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCER_KINDS.map((k) => (
                      <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prod-website">Website</Label>
                  <Input
                    id="prod-website"
                    placeholder="https://..."
                    value={form.websiteUrl}
                    onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-location">Location</Label>
                  <Input
                    id="prod-location"
                    placeholder="e.g. Dryden, ON"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prod-email">Contact email</Label>
                  <Input
                    id="prod-email"
                    type="email"
                    placeholder="hello@..."
                    value={form.contactEmail}
                    onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prod-phone">Contact phone</Label>
                  <Input
                    id="prod-phone"
                    placeholder="+1..."
                    value={form.contactPhone}
                    onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-desc">Description (optional)</Label>
                <Textarea
                  id="prod-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
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
              <Button onClick={handleCreate} disabled={createProducer.isPending}>
                {createProducer.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <Input 
          placeholder="Search producers..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : producers?.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground">No producers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {producers?.map((producer) => (
            <Link key={producer.id} href={`/producers/${producer.slug}`}>
              <Card className="h-full hover-elevate cursor-pointer transition-all border-border bg-card hover:border-secondary/50 group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-serif text-lg group-hover:text-primary transition-colors">
                      {producer.name}
                    </CardTitle>
                    {producer.kind && (
                      <Badge variant="outline" className="capitalize text-xs font-normal">
                        {producer.kind}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  {producer.location && (
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{producer.location}</span>
                    </div>
                  )}
                  {producer.websiteUrl && (
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="truncate">{producer.websiteUrl.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 mt-auto">
                    <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-none">
                      {producer.entryCount} entries
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

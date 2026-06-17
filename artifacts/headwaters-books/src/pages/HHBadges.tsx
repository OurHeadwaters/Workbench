import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetHhBadgeCategories,
  useCreateHhBadgeCategory,
  useUpdateHhBadgeCategory,
  useWatchHhBadge,
  getGetHhBadgeCategoriesQueryKey,
  getGetMyHhBadgesQueryKey,
  useGetMyHhBadges,
  type HhBadgeCategory,
} from "@workspace/api-client-react";
import { useGetBookkeeperMe } from "@workspace/api-client-react";
import { Loader2, Plus, Eye, CheckCircle2, BookOpen, GraduationCap, Star, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type BadgeStage = "watching" | "learning" | "practicing" | "teaching";
type Domain = "food" | "land" | "care" | "craft" | "governance" | "knowledge";

const STAGE_META: Record<BadgeStage, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  watching: { label: "Watching", icon: Eye, color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
  learning: { label: "Learning", icon: BookOpen, color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  practicing: { label: "Practicing", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  teaching: { label: "Teaching", icon: GraduationCap, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

const DOMAIN_LABELS: Record<Domain, string> = {
  food: "Food & Harvest",
  land: "Land & Water",
  care: "Care & Wellbeing",
  craft: "Craft & Making",
  governance: "Governance",
  knowledge: "Knowledge & Culture",
};

const DOMAIN_ORDER: Domain[] = ["food", "land", "care", "craft", "governance", "knowledge"];

function stageBadge(stage: string) {
  const s = STAGE_META[stage as BadgeStage];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${s.bg} ${s.color} font-medium`}>
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

export default function HHBadges() {
  const qc = useQueryClient();
  const { data: me } = useGetBookkeeperMe();
  const isAdmin = me?.role === "owner" || me?.role === "ops_manager";

  const [statusView, setStatusView] = useState<"active" | "proposed" | "all">("active");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    domain: "knowledge" as Domain,
    stageModel: "four_stage" as "binary" | "three_stage" | "four_stage",
    rateModifierEnabled: false,
  });

  const { data: categories, isLoading } = useGetHhBadgeCategories({ status: statusView });
  const { data: myBadges } = useGetMyHhBadges();
  const createCategory = useCreateHhBadgeCategory();
  const updateCategory = useUpdateHhBadgeCategory();
  const watchBadge = useWatchHhBadge();

  const myBadgeMap = new Map((myBadges ?? []).map((b) => [b.categoryId, b]));

  function invalidate() {
    qc.invalidateQueries({ queryKey: getGetHhBadgeCategoriesQueryKey({ status: statusView }) });
    qc.invalidateQueries({ queryKey: getGetMyHhBadgesQueryKey() });
  }

  function handleCreate() {
    if (!createForm.name.trim()) { toast.error("Name is required"); return; }
    createCategory.mutate(
      { data: { ...createForm, status: isAdmin ? "active" : "proposed" } },
      {
        onSuccess: () => {
          toast.success(isAdmin ? `"${createForm.name}" added to the directory` : `"${createForm.name}" proposed — an admin will review it`);
          setCreateForm({ name: "", description: "", domain: "knowledge", stageModel: "four_stage", rateModifierEnabled: false });
          setShowCreate(false);
          invalidate();
        },
        onError: (e: Error) => toast.error(e.message || "Could not create"),
      },
    );
  }

  function handleActivate(cat: HhBadgeCategory) {
    updateCategory.mutate(
      { id: cat.id, data: { status: "active" } },
      {
        onSuccess: () => { toast.success(`"${cat.name}" is now active`); invalidate(); },
        onError: (e: Error) => toast.error(e.message || "Could not activate"),
      },
    );
  }

  function handleArchive(cat: HhBadgeCategory) {
    updateCategory.mutate(
      { id: cat.id, data: { status: "archived" } },
      {
        onSuccess: () => { toast.success(`"${cat.name}" archived`); invalidate(); },
        onError: (e: Error) => toast.error(e.message || "Could not archive"),
      },
    );
  }

  function handleToggleRateModifier(cat: HhBadgeCategory) {
    updateCategory.mutate(
      { id: cat.id, data: { rateModifierEnabled: !cat.rateModifierEnabled } },
      {
        onSuccess: () => {
          toast.success(cat.rateModifierEnabled ? "Rate uplift disabled" : "Rate uplift enabled");
          invalidate();
        },
        onError: (e: Error) => toast.error(e.message || "Could not update"),
      },
    );
  }

  function handleWatch(cat: HhBadgeCategory) {
    watchBadge.mutate(
      { categoryId: cat.id },
      {
        onSuccess: () => {
          toast.success(`You're now watching "${cat.name}" — a Knowledge Holder will see your interest`);
          invalidate();
        },
        onError: (e: Error) => toast.error(e.message || "Could not register interest"),
      },
    );
  }

  const grouped = DOMAIN_ORDER.reduce<Record<Domain, HhBadgeCategory[]>>((acc, d) => {
    acc[d] = (categories ?? []).filter((c) => c.domain === d);
    return acc;
  }, {} as Record<Domain, HhBadgeCategory[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Skill Directory</h1>
          <p className="text-muted-foreground mt-1">
            Knowledge areas the band recognises with credentials. Press "Watch this" to signal your interest — a Knowledge Holder will see your name.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(!showCreate)}
          variant={showCreate ? "outline" : "default"}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          {isAdmin ? "Add skill" : "Propose skill"}
        </Button>
      </div>

      {/* Stage legend */}
      <div className="flex flex-wrap gap-3 text-sm">
        {(["watching", "learning", "practicing", "teaching"] as BadgeStage[]).map((s) => {
          const meta = STAGE_META[s];
          const Icon = meta.icon;
          return (
            <span key={s} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color}`}>
              <Icon className="w-3 h-3" />
              {meta.label}
            </span>
          );
        })}
        <span className="text-xs text-muted-foreground self-center ml-1">Your stage is shown on each skill</span>
      </div>

      {/* Create / Propose form */}
      {showCreate && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold text-foreground">
            {isAdmin ? "Add a skill area" : "Propose a skill area"}
          </h2>
          {!isAdmin && (
            <p className="text-sm text-muted-foreground">
              Your proposal goes into a review pool. Elders and Knowledge Keepers review it for cultural fit before it becomes active.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <Label>Name</Label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Wild Rice Harvesting, Food Preservation, Bannock Making"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Description</Label>
              <Input
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What does this skill involve? Who holds it in the community?"
              />
            </div>
            <div className="space-y-1">
              <Label>Domain</Label>
              <select
                value={createForm.domain}
                onChange={(e) => setCreateForm((f) => ({ ...f, domain: e.target.value as Domain }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                {DOMAIN_ORDER.map((d) => (
                  <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Stages</Label>
              <select
                value={createForm.stageModel}
                onChange={(e) => setCreateForm((f) => ({ ...f, stageModel: e.target.value as typeof createForm.stageModel }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="four_stage">All four stages (Watching → Teaching)</option>
                <option value="three_stage">Three stages (Learning → Teaching)</option>
                <option value="binary">Verified only</option>
              </select>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="rateModifier"
                  checked={createForm.rateModifierEnabled}
                  onChange={(e) => setCreateForm((f) => ({ ...f, rateModifierEnabled: e.target.checked }))}
                  className="rounded border-input"
                />
                <Label htmlFor="rateModifier" className="font-normal cursor-pointer">
                  Enable task rate uplift for this skill <span className="text-muted-foreground">(band decides case by case)</span>
                </Label>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={createCategory.isPending}>
              {createCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAdmin ? "Add skill area" : "Submit proposal")}
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Status tabs (admin only) */}
      {isAdmin && (
        <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
          {(["active", "proposed", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusView(s)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                statusView === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "active" ? "Active" : s === "proposed" ? "Proposed" : "All"}
            </button>
          ))}
        </div>
      )}

      {/* Categories by domain */}
      {(categories ?? []).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No skill areas yet</p>
          <p className="text-sm mt-1">
            {isAdmin
              ? "Add the first one to open the credential system for the community."
              : "Propose a skill area — your proposal will be reviewed by Knowledge Holders."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {DOMAIN_ORDER.filter((d) => grouped[d].length > 0).map((domain) => (
            <div key={domain}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                {DOMAIN_LABELS[domain]}
              </h2>
              <div className="space-y-2">
                {grouped[domain].map((cat) => {
                  const myBadge = myBadgeMap.get(cat.id);
                  const isExpanded = expandedId === cat.id;
                  const stageModel = cat.stageModel;
                  const stages: BadgeStage[] =
                    stageModel === "binary"
                      ? ["practicing"]
                      : stageModel === "three_stage"
                      ? ["learning", "practicing", "teaching"]
                      : ["watching", "learning", "practicing", "teaching"];

                  return (
                    <div key={cat.id} className="bg-card border border-border rounded-lg overflow-hidden">
                      <button
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/20 transition-colors"
                        onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-foreground">{cat.name}</span>
                            {cat.status === "proposed" && (
                              <Badge className="text-xs bg-orange-100 text-orange-700 border-0">Proposed</Badge>
                            )}
                            {cat.rateModifierEnabled && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                                <Zap className="w-3 h-3" /> Rate uplift
                              </span>
                            )}
                            {myBadge && stageBadge(myBadge.stage)}
                          </div>
                          {cat.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{cat.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border p-4 space-y-4 bg-muted/10">
                          {/* Stage path */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground font-medium">Path:</span>
                            {stages.map((s, i) => {
                              const meta = STAGE_META[s];
                              const Icon = meta.icon;
                              const isCurrent = myBadge?.stage === s;
                              return (
                                <span key={s} className="flex items-center gap-1">
                                  {i > 0 && <span className="text-muted-foreground">→</span>}
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${isCurrent ? `${meta.bg} ${meta.color} ring-2 ring-offset-1 ring-current` : "bg-muted/40 text-muted-foreground border-border"}`}>
                                    <Icon className="w-3 h-3" />
                                    {meta.label}
                                  </span>
                                </span>
                              );
                            })}
                          </div>

                          {cat.description && (
                            <p className="text-sm text-foreground">{cat.description}</p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {/* Watch button — only if not already engaged and watching is in the model */}
                            {!myBadge && stages.includes("watching") && cat.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWatch(cat)}
                                disabled={watchBadge.isPending}
                                className="text-sky-700 border-sky-300 hover:bg-sky-50"
                              >
                                <Eye className="w-3 h-3 mr-1.5" />
                                I'm watching this
                              </Button>
                            )}
                            {myBadge?.stage === "watching" && (
                              <p className="text-sm text-sky-700 bg-sky-50 border border-sky-200 rounded-md px-3 py-1.5">
                                You're watching — a Knowledge Holder can see your name and invite you in.
                              </p>
                            )}

                            {/* Admin controls */}
                            {isAdmin && (
                              <div className="flex gap-2 flex-wrap">
                                {cat.status === "proposed" && (
                                  <Button size="sm" onClick={() => handleActivate(cat)} disabled={updateCategory.isPending}>
                                    Activate
                                  </Button>
                                )}
                                {cat.status === "active" && (
                                  <Button size="sm" variant="outline" onClick={() => handleArchive(cat)} disabled={updateCategory.isPending}>
                                    Archive
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleRateModifier(cat)}
                                  disabled={updateCategory.isPending}
                                  className={cat.rateModifierEnabled ? "text-amber-700 border-amber-300" : ""}
                                >
                                  <Zap className="w-3 h-3 mr-1" />
                                  {cat.rateModifierEnabled ? "Disable rate uplift" : "Enable rate uplift"}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

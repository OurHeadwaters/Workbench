import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetMyHhBadges,
  useGetHhBadgeCategories,
  useWatchHhBadge,
  useIssueHhBadge,
  useGetHhMembers,
  getGetMyHhBadgesQueryKey,
  getGetHhBadgeCategoriesQueryKey,
  type HhMemberBadgeWithCategory,
  type HhBadgeCategory,
} from "@workspace/api-client-react";
import { useGetBookkeeperMe } from "@workspace/api-client-react";
import {
  Loader2,
  Eye,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type BadgeStage = "watching" | "learning" | "practicing" | "teaching";

const STAGE_META: Record<
  BadgeStage,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    description: string;
  }
> = {
  watching: {
    label: "Watching",
    icon: Eye,
    color: "text-sky-700",
    bg: "bg-sky-50 border-sky-200",
    description: "You've shown interest. A Knowledge Holder can see your name and invite you in.",
  },
  learning: {
    label: "Learning",
    icon: BookOpen,
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    description: "You're actively developing this skill. The band acknowledges you're on the path.",
  },
  practicing: {
    label: "Practicing",
    icon: CheckCircle2,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    description: "Verified by the band. You've demonstrated this skill. Rate uplift applies if enabled.",
  },
  teaching: {
    label: "Teaching",
    icon: GraduationCap,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    description: "You can verify this skill in others. The community recognises you as a source.",
  },
};

const STAGE_ORDER: BadgeStage[] = ["watching", "learning", "practicing", "teaching"];

const EARTH_KIT_BRIDGE_DOMAINS = ["food", "land", "governance", "care"] as const;
type BridgeDomain = (typeof EARTH_KIT_BRIDGE_DOMAINS)[number];

function isBridgeDomain(domain: string): domain is BridgeDomain {
  return (EARTH_KIT_BRIDGE_DOMAINS as readonly string[]).includes(domain);
}

function stagePill(stage: string, credentialSource?: string) {
  const s = STAGE_META[stage as BadgeStage];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${s.bg} ${s.color}`}
    >
      <Icon className="w-3 h-3" />
      {s.label}
      {credentialSource === "earth_kit" && (
        <span className="ml-1 text-xs text-stone-500 font-normal">· EK</span>
      )}
    </span>
  );
}

function stagesFor(stageModel: string): BadgeStage[] {
  if (stageModel === "binary") return ["practicing"];
  if (stageModel === "three_stage") return ["learning", "practicing", "teaching"];
  return ["watching", "learning", "practicing", "teaching"];
}

function nextStage(current: string, stageModel: string): BadgeStage | null {
  const stages = stagesFor(stageModel);
  const idx = stages.indexOf(current as BadgeStage);
  if (idx < 0 || idx >= stages.length - 1) return null;
  return stages[idx + 1];
}

function useEarthKitStatus(apiBase: string) {
  const [isPractitioner, setIsPractitioner] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch(`${apiBase}/helping-hands/my/earth-kit-status`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : { isPractitioner: false })
      .then((data: { isPractitioner?: boolean }) => {
        setIsPractitioner(!!data.isPractitioner);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [apiBase]);

  return { isPractitioner, checked };
}

export default function HHMyBadges() {
  const qc = useQueryClient();
  const { data: me } = useGetBookkeeperMe();
  const isAdmin = me?.role === "owner" || me?.role === "ops_manager";

  const { data: myBadges, isLoading: loadingBadges } = useGetMyHhBadges();
  const { data: allCategories, isLoading: loadingCats } = useGetHhBadgeCategories({ status: "active" });
  const { data: members } = useGetHhMembers();
  const watchBadge = useWatchHhBadge();
  const issueBadge = useIssueHhBadge();

  const apiBase = import.meta.env.BASE_URL?.replace(/\/$/, "") + "/api";
  const { isPractitioner } = useEarthKitStatus(apiBase);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [issueTarget, setIssueTarget] = useState<{ badge: HhMemberBadgeWithCategory; memberId: string } | null>(null);
  const [issueForm, setIssueForm] = useState<{ stage: BadgeStage; notes: string; memberId: string }>({
    stage: "learning",
    notes: "",
    memberId: "",
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: getGetMyHhBadgesQueryKey() });
    qc.invalidateQueries({ queryKey: getGetHhBadgeCategoriesQueryKey({ status: "active" }) });
  }

  function handleWatch(cat: HhBadgeCategory) {
    watchBadge.mutate(
      { categoryId: cat.id },
      {
        onSuccess: () => {
          toast.success(`You're now watching "${cat.name}"`);
          invalidate();
        },
        onError: (e: Error) => toast.error(e.message || "Could not register interest"),
      },
    );
  }

  function handleIssue() {
    if (!issueTarget) return;
    issueBadge.mutate(
      {
        memberId: issueForm.memberId || issueTarget.badge.memberId,
        categoryId: issueTarget.badge.categoryId,
        data: { stage: issueForm.stage, notes: issueForm.notes },
      },
      {
        onSuccess: () => {
          toast.success(`Badge advanced to ${STAGE_META[issueForm.stage].label}`);
          setIssueTarget(null);
          invalidate();
        },
        onError: (e: Error) => toast.error(e.message || "Could not advance badge"),
      },
    );
  }

  const myBadgeMap = new Map((myBadges ?? []).map((b) => [b.categoryId, b]));
  const availableToWatch = (allCategories ?? []).filter(
    (c) => !myBadgeMap.has(c.id) && stagesFor(c.stageModel).includes("watching"),
  );

  const teachingBadgesInBridgeDomains = (myBadges ?? []).filter(
    (b) => b.stage === "teaching" && isBridgeDomain(b.categoryDomain),
  );

  const isLoading = loadingBadges || loadingCats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">My Credentials</h1>
        <p className="text-muted-foreground mt-1">
          Your knowledge identity — built by the community, anchored to you.
        </p>
      </div>

      {/* DID sovereignty note */}
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-emerald-800">
          <span className="font-medium">These credentials belong to you.</span> The band issues them, but only you hold your identity. You can claim full key sovereignty at any time — the door is always open.
        </div>
      </div>

      {/* Earth Kit Practitioner banner */}
      {isPractitioner && (
        <div className="flex items-start gap-3 bg-stone-50 border border-stone-300 rounded-lg p-4 text-sm">
          <Award className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
          <div className="text-stone-800">
            <span className="font-medium">Earth Kit Practitioner.</span> Your practitioner standing is recognised here. Badges in Food, Land, Governance, and Care domains show a <span className="font-medium">Practitioner Verified</span> indicator — reflecting the cross-validated credential.
          </div>
        </div>
      )}

      {/* Active badges */}
      {(myBadges ?? []).length === 0 ? (
        <div className="text-center py-10 text-muted-foreground bg-card border border-border rounded-lg">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No credentials yet</p>
          <p className="text-sm mt-1">Watch a skill below to put your name on the path.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Your badges</h2>
          {(myBadges ?? []).map((badge) => {
            const meta = STAGE_META[badge.stage as BadgeStage];
            const Icon = meta?.icon ?? Eye;
            const isExpanded = expandedId === badge.id;
            const stages = stagesFor(badge.categoryStageModel);
            const next = nextStage(badge.stage, badge.categoryStageModel);
            const credSource = (badge as HhMemberBadgeWithCategory & { credentialSource?: string }).credentialSource;
            const isPractitionerVerified =
              isPractitioner &&
              isBridgeDomain(badge.categoryDomain) &&
              (badge.stage === "practicing" || badge.stage === "teaching");

            return (
              <div key={badge.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : badge.id)}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${meta?.bg ?? ""} shrink-0`}>
                    <Icon className={`w-4 h-4 ${meta?.color ?? "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{badge.categoryName}</span>
                      {stagePill(badge.stage, credSource)}
                      {isPractitionerVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-600 bg-stone-100 border border-stone-300 rounded-full px-2 py-0.5 font-medium">
                          <Award className="w-3 h-3" />
                          Practitioner Verified
                        </span>
                      )}
                      {badge.categoryRateModifierEnabled && badge.stage !== "watching" && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                          <Zap className="w-3 h-3" /> Rate uplift
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{badge.categoryDomain.replace("_", " ")}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4 bg-muted/10">
                    <p className="text-sm text-foreground">{meta?.description}</p>

                    {/* Practitioner Verified detail */}
                    {isPractitionerVerified && (
                      <div className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-md px-3 py-2">
                        <Award className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>This badge carries Earth Kit practitioner standing — validated across both credentialing systems.</span>
                      </div>
                    )}

                    {/* Stage path */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {stages.map((s, i) => {
                        const sm = STAGE_META[s];
                        const SIcon = sm.icon;
                        const isCurrent = badge.stage === s;
                        const isPast =
                          STAGE_ORDER.indexOf(s) < STAGE_ORDER.indexOf(badge.stage as BadgeStage);
                        return (
                          <span key={s} className="flex items-center gap-1">
                            {i > 0 && <span className="text-muted-foreground text-xs">→</span>}
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium transition-all ${
                                isCurrent
                                  ? `${sm.bg} ${sm.color} shadow-sm`
                                  : isPast
                                  ? "bg-muted text-muted-foreground border-transparent line-through opacity-50"
                                  : "bg-background text-muted-foreground border-border"
                              }`}
                            >
                              <SIcon className="w-3 h-3" />
                              {sm.label}
                            </span>
                          </span>
                        );
                      })}
                    </div>

                    {badge.notes && (
                      <p className="text-xs text-muted-foreground italic border-l-2 border-border pl-3">
                        "{badge.notes}"
                      </p>
                    )}

                    {/* Admin: advance badge panel */}
                    {isAdmin && next && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-foreground mb-2">Advance this member's badge</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Member</label>
                            <select
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                              value={issueTarget?.badge.id === badge.id ? issueForm.memberId : badge.memberId}
                              onChange={(e) => {
                                setIssueTarget({ badge, memberId: e.target.value });
                                setIssueForm((f) => ({ ...f, memberId: e.target.value, stage: next }));
                              }}
                            >
                              {(members ?? []).map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.firstName} {m.lastName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Advance to</label>
                            <select
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                              value={issueTarget?.badge.id === badge.id ? issueForm.stage : next}
                              onChange={(e) => {
                                setIssueTarget({ badge, memberId: issueForm.memberId || badge.memberId });
                                setIssueForm((f) => ({ ...f, stage: e.target.value as BadgeStage }));
                              }}
                            >
                              {stages
                                .filter((s) => STAGE_ORDER.indexOf(s) > STAGE_ORDER.indexOf(badge.stage as BadgeStage))
                                .map((s) => (
                                  <option key={s} value={s}>
                                    {STAGE_META[s].label}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs text-muted-foreground">Notes (optional)</label>
                            <input
                              type="text"
                              placeholder="Context for the advancement..."
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                              value={issueTarget?.badge.id === badge.id ? issueForm.notes : ""}
                              onChange={(e) => {
                                setIssueTarget({ badge, memberId: issueForm.memberId || badge.memberId });
                                setIssueForm((f) => ({ ...f, notes: e.target.value }));
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            setIssueTarget({ badge, memberId: issueForm.memberId || badge.memberId });
                            handleIssue();
                          }}
                          disabled={issueBadge.isPending}
                        >
                          {issueBadge.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Advance badge"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Skills you can start watching */}
      {availableToWatch.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Skills you can start watching</h2>
          <p className="text-xs text-muted-foreground">
            Press "Watch" to put your name on the path — no commitment, just curiosity. A Knowledge Holder will see your interest.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableToWatch.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between gap-3 bg-card border border-border rounded-lg px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{cat.domain.replace("_", " ")}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleWatch(cat)}
                  disabled={watchBadge.isPending}
                  className="text-sky-700 border-sky-300 hover:bg-sky-50 shrink-0"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Watch
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's next — HH → Earth Kit upgrade pathway */}
      {!isPractitioner && teachingBadgesInBridgeDomains.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-amber-900">What's next — Earth Kit pathway</h2>
              <p className="text-xs text-amber-800 mt-1">
                You've reached Teaching level in{" "}
                {teachingBadgesInBridgeDomains.map((b) => b.categoryDomain.replace("_", " ")).join(", ")}.
                That may qualify you for <span className="font-medium">Earth Kit Licensed</span> standing — a formal practitioner credential recognised beyond the community.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <a
              href="/north-star/apply-practitioner"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 border border-amber-300 bg-white rounded-md px-3 py-1.5 hover:bg-amber-50 transition-colors"
            >
              Apply for Earth Kit Licensed
              <ArrowRight className="w-3 h-3" />
            </a>
            <span className="text-xs text-amber-700">
              — mention your Helping Hands Teaching badges as supporting evidence.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

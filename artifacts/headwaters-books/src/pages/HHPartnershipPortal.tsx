import { Loader2, Building2, TrendingUp, ShieldCheck } from "lucide-react";
import { customFetch } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";

interface PortalData {
  bandName: string;
  month: string;
  activeMembers: number;
  membersWithSavingsEnvelope: number;
  savingsAdoptionPct: number;
  avgMonthlyTokenSavingsBudget: string;
  envelopeDisciplinePct: number;
  note: string;
}

export default function HHPartnershipPortal() {
  const { data, isLoading, error } = useQuery<PortalData>({
    queryKey: ["hh-partnership-portal"],
    queryFn: () => customFetch<PortalData>("/helping-hands/partnership-portal", {}),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="font-medium">Access restricted.</p>
        <p className="text-sm mt-1">Only band administrators can view the partnership portal.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Active members",
      value: data.activeMembers,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Savings adoption",
      value: `${data.savingsAdoptionPct}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Envelope discipline",
      value: `${data.envelopeDisciplinePct}%`,
      icon: ShieldCheck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Partnership Portal</h1>
        <p className="text-muted-foreground mt-1">
          Aggregate financial behaviour data for {data.bandName} — {data.month}.
          No individual data is shown without member consent.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-lg p-5 flex flex-col gap-2`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Detailed metrics */}
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {[
          {
            label: "Members with a savings envelope",
            value: `${data.membersWithSavingsEnvelope} of ${data.activeMembers}`,
          },
          {
            label: "Avg monthly savings budget",
            value: `${parseFloat(data.avgMonthlyTokenSavingsBudget).toFixed(2)} tokens`,
          },
          {
            label: "Envelopes on or under budget this month",
            value: `${data.envelopeDisciplinePct}%`,
          },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between p-4">
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="font-semibold text-foreground text-sm">{row.value}</span>
          </div>
        ))}
      </div>

      {/* V1 note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>V1 stub:</strong> {data.note}
      </div>

      <div className="bg-muted/40 border border-border rounded-lg p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">What this enables:</strong> Credit unions and Investors Group
        can use savings adoption and envelope discipline as on-chain proof of financial reliability —
        allowing matched savings programs, micro-loans, and RRSP top-ups tied to demonstrated behaviour,
        not just credit scores.
      </div>
    </div>
  );
}

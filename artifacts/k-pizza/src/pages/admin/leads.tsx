import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, CheckCircle2, RotateCcw, Inbox, Smartphone, Leaf, HeartHandshake, Megaphone, UtensilsCrossed, Hotel, CalendarClock, Sparkles, Users, GraduationCap } from "lucide-react";
import {
  useListPhoneAddonRequests,
  getListPhoneAddonRequestsQueryKey,
  useUpdatePhoneAddonRequest,
  useDeletePhoneAddonRequest,
  type PhoneAddonRequest,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

const KIND_META: Partial<Record<PhoneAddonRequest["kind"], { label: string; icon: typeof Smartphone; blurb: string }>> = {
  phone_addon: {
    label: "Front-Line Phone",
    icon: Smartphone,
    blurb: "Folks who tapped \"Activate a line\" on the Front-Line Phone card.",
  },
  coop_crate: {
    label: "807 Co-op Crate",
    icon: Leaf,
    blurb: "Folks who asked about joining the weekly 807 Food Co-op crate.",
  },
  catering: {
    label: "Catering & Group Orders",
    icon: UtensilsCrossed,
    blurb: "Quote requests from the Feed Your Team catering pitch — offices, trades, government, schools, Indigenous orgs, hotels. Pull these before the rush so deposits and timing get sorted.",
  },
  community_drive: {
    label: "Community Pizza Drive",
    icon: Megaphone,
    blurb: "Schools, teams, and groups looking to run a wholesale fundraiser drive.",
  },
  slice_program: {
    label: "Cooked Slice Program",
    icon: HeartHandshake,
    blurb: "Sponsors and partners pitching in on the Community Living Dryden slice program.",
  },
  hotel_qr_request: {
    label: "Hotel QR Cards",
    icon: Hotel,
    blurb: "Hotels requesting a stack of printed QR cards for their front desk.",
  },
  lunch_club: {
    label: "Lunch Club",
    icon: CalendarClock,
    blurb: "Businesses pitching the standing weekly lunch program. Reach out and confirm day, headcount, and start date.",
  },
  weekly_promo: {
    label: "This Week Promo",
    icon: Sparkles,
    blurb: "Locals who opted into a heads-up about the current weekly promo. Send manually — no automated emails go out.",
  },
  school_lunch_program: {
    label: "School Lunch Program",
    icon: GraduationCap,
    blurb: "Coordinators, lead agencies, and principals exploring the Ontario school lunch program.",
  },
};

export default function AdminLeads() {
  const qc = useQueryClient();
  const { data: requests, isLoading } = useListPhoneAddonRequests();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListPhoneAddonRequestsQueryKey() });
  const update = useUpdatePhoneAddonRequest({ mutation: { onSuccess: invalidate } });
  const del = useDeletePhoneAddonRequest({ mutation: { onSuccess: invalidate } });

  if (isLoading || !requests) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const kinds: PhoneAddonRequest["kind"][] = [
    "lunch_club",
    "catering",
    "phone_addon",
    "coop_crate",
    "community_drive",
    "slice_program",
    "hotel_qr_request",
    "weekly_promo",
    "school_lunch_program",
  ];

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-12">
      <div>
        <h2 className="text-4xl font-serif mb-2">Lead Inbox</h2>
        <p className="text-muted-foreground max-w-2xl">
          Submissions from the add-on cards on the landing page. Reach out by text or email, then mark resolved so the list stays focused on new ones.
        </p>
      </div>

      {kinds.map((kind) => {
        const meta = KIND_META[kind];
        if (!meta) return null;
        const Icon = meta.icon;
        const forKind = requests.filter((r) => r.kind === kind);
        const open = forKind.filter((r) => r.status === "new");
        const resolved = forKind.filter((r) => r.status === "resolved");
        return (
          <div key={kind} className="space-y-5">
            <div className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Icon size={18} className="text-primary" />
                <h3 className="font-serif text-2xl leading-tight">{meta.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{meta.blurb}</p>
            </div>

            <section className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New · {open.length}</h4>
              {open.length === 0 ? (
                <Card><CardContent className="p-5 flex items-center gap-3 text-muted-foreground text-sm">
                  <Inbox size={16} /> Nothing new here yet.
                </CardContent></Card>
              ) : (
                open.map((r) => (
                  <LeadRow
                    key={r.id}
                    item={r}
                    onResolve={() => update.mutate({ id: r.id, data: { status: "resolved" } })}
                    onDelete={() => del.mutate({ id: r.id })}
                  />
                ))
              )}
            </section>

            {resolved.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolved · {resolved.length}</h4>
                {resolved.map((r) => (
                  <LeadRow
                    key={r.id}
                    item={r}
                    muted
                    onReopen={() => update.mutate({ id: r.id, data: { status: "new" } })}
                    onDelete={() => del.mutate({ id: r.id })}
                  />
                ))}
              </section>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LeadRow({
  item,
  muted,
  onResolve,
  onReopen,
  onDelete,
}: {
  item: PhoneAddonRequest;
  muted?: boolean;
  onResolve?: () => void;
  onReopen?: () => void;
  onDelete: () => void;
}) {
  const when = new Date(item.createdAt).toLocaleString();
  return (
    <Card className={muted ? "opacity-60" : ""}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="font-serif text-lg leading-tight">{item.name || "(no name given)"}</p>
            <p className="font-sans text-sm text-muted-foreground">{when}</p>
          </div>
          <div className="flex items-center gap-1">
            {onResolve && (
              <Button variant="outline" size="sm" onClick={onResolve}>
                <CheckCircle2 size={14} className="mr-1.5" /> Mark resolved
              </Button>
            )}
            {onReopen && (
              <Button variant="outline" size="sm" onClick={onReopen}>
                <RotateCcw size={14} className="mr-1.5" /> Reopen
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-sans pt-2 border-t border-border">
          <div className="sm:col-span-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Contact</p>
            <p className="font-mono break-all">{item.contact}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Note</p>
            <p className="whitespace-pre-wrap">{item.note || <span className="text-muted-foreground italic">No message included.</span>}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

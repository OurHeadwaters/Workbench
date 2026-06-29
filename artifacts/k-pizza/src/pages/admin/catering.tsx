import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Users, Clock, Truck, Store, CalendarDays, CalendarRange } from "lucide-react";
import {
  useListPhoneAddonRequests,
  type PhoneAddonRequest,
} from "@workspace/k-pizza-client-react";

type CateringEvent = {
  lead: PhoneAddonRequest;
  date: string;
  headcount: string;
  pickupWindow?: string;
  mode?: string;
  business: string;
};

export function parseCateringEvent(lead: PhoneAddonRequest): CateringEvent | null {
  if (lead.kind !== "catering") return null;
  const note = lead.note || "";
  const dateMatch =
    note.match(/Event date:\s*(\d{4}-\d{2}-\d{2})/i) ||
    note.match(/Needed by:\s*(\d{4}-\d{2}-\d{2})/i) ||
    note.match(/Target date:\s*(\d{4}-\d{2}-\d{2})/i);
  if (!dateMatch) return null;
  const headMatch = note.match(/Headcount:\s*([^\n]+)/i);
  const pickupMatch = note.match(/Pickup window:\s*([^\n]+)/i);
  const modeMatch = note.match(/Mode:\s*([^\n]+)/i);
  const bizMatch =
    note.match(/Business \/ org:\s*([^\n]+)/i) ||
    note.match(/Business\/org:\s*([^\n]+)/i) ||
    note.match(/Business:\s*([^\n]+)/i) ||
    note.match(/Organization:\s*([^\n]+)/i);
  const business =
    (bizMatch && bizMatch[1].trim()) ||
    (lead.name && lead.name.trim()) ||
    lead.contact ||
    "(no name given)";
  return {
    lead,
    date: dateMatch[1],
    headcount: headMatch ? headMatch[1].trim() : "?",
    pickupWindow: pickupMatch ? pickupMatch[1].trim() : undefined,
    mode: modeMatch ? modeMatch[1].trim() : undefined,
    business,
  };
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay());
  return out;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminCatering() {
  const { data: requests, isLoading } = useListPhoneAddonRequests();
  const [view, setView] = React.useState<"month" | "week">("month");
  const [cursor, setCursor] = React.useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const events: CateringEvent[] = React.useMemo(() => {
    if (!requests) return [];
    return requests
      .map(parseCateringEvent)
      .filter((e): e is CateringEvent => e !== null);
  }, [requests]);

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CateringEvent[]>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [events]);

  if (isLoading || !requests) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const today = ymd(new Date());

  let days: Date[];
  let title: string;
  if (view === "month") {
    const first = startOfMonth(cursor);
    const gridStart = startOfWeek(first);
    days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
    title = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  } else {
    const start = startOfWeek(cursor);
    days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    const end = addDays(start, 6);
    const sameMonth = start.getMonth() === end.getMonth();
    title = sameMonth
      ? `${start.toLocaleDateString(undefined, { month: "long", day: "numeric" })} – ${end.getDate()}, ${end.getFullYear()}`
      : `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
  }

  const shift = (n: number) => {
    if (view === "month") setCursor(addMonths(cursor, n));
    else setCursor(addDays(cursor, n * 7));
  };

  const goToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setCursor(d);
  };

  const focusMonth = view === "month" ? cursor.getMonth() : -1;

  const upcoming = [...events]
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-4xl font-serif mb-2">Catering Calendar</h2>
        <p className="text-muted-foreground max-w-2xl">
          Every catering quote request with a confirmed event date. Plan dough, staffing, and delivery routes around the day, and avoid double-booking the kitchen.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous">
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
              <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next">
                <ChevronRight size={16} />
              </Button>
              <h3 className="font-serif text-2xl ml-2">{title}</h3>
            </div>
            <div className="flex items-center gap-1 border border-border rounded-md p-1">
              <button
                onClick={() => setView("month")}
                className={`flex items-center gap-1.5 px-3 py-1 text-sm rounded ${view === "month" ? "bg-primary text-white" : "hover:bg-muted"}`}
              >
                <CalendarDays size={14} /> Month
              </button>
              <button
                onClick={() => setView("week")}
                className={`flex items-center gap-1.5 px-3 py-1 text-sm rounded ${view === "week" ? "bg-primary text-white" : "hover:bg-muted"}`}
              >
                <CalendarRange size={14} /> Week
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-primary" /> Confirmed (deposit paid / resolved)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm border-2 border-primary bg-primary/15" /> Pending (awaiting follow-up)
            </span>
          </div>

          <div className={`grid grid-cols-7 gap-px bg-border border border-border rounded-md overflow-hidden ${view === "week" ? "" : ""}`}>
            {WEEKDAYS.map((w) => (
              <div key={w} className="bg-card text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-2 text-center">
                {w}
              </div>
            ))}
            {days.map((d) => {
              const key = ymd(d);
              const dayEvents = eventsByDay.get(key) ?? [];
              const isToday = key === today;
              const dimmed = view === "month" && d.getMonth() !== focusMonth;
              const totalHead = dayEvents.reduce((sum, e) => {
                const n = parseInt(e.headcount, 10);
                return sum + (Number.isFinite(n) ? n : 0);
              }, 0);
              return (
                <div
                  key={key}
                  className={`bg-card p-2 min-h-[110px] ${view === "week" ? "min-h-[260px]" : ""} ${dimmed ? "opacity-40" : ""} flex flex-col gap-1.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center" : "text-foreground"}`}>
                      {d.getDate()}
                    </span>
                    {totalHead > 0 && (
                      <span className="text-[10px] font-sans uppercase tracking-wider text-muted-foreground flex items-center gap-0.5">
                        <Users size={10} /> {totalHead}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((e) => {
                      const confirmed = e.lead.status === "resolved";
                      return (
                        <div
                          key={e.lead.id}
                          title={`${e.business} · ${e.headcount} people${e.pickupWindow ? ` · ${e.pickupWindow}` : ""}${e.mode ? ` · ${e.mode}` : ""}`}
                          className={`text-[11px] font-sans leading-tight rounded px-1.5 py-1 truncate ${
                            confirmed
                              ? "bg-primary text-white"
                              : "border-2 border-primary bg-primary/15 text-foreground"
                          }`}
                        >
                          <div className="font-bold truncate">{e.business}</div>
                          <div className={`flex items-center gap-1 ${confirmed ? "text-white/85" : "text-foreground/70"}`}>
                            <Users size={9} /> {e.headcount}
                            {e.pickupWindow && view === "week" && (
                              <><span>·</span><Clock size={9} /> {e.pickupWindow}</>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-serif text-2xl mb-3">Upcoming bookings</h3>
        {upcoming.length === 0 ? (
          <Card><CardContent className="p-5 text-sm text-muted-foreground">No future catering bookings on the books.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcoming.map((e) => {
              const confirmed = e.lead.status === "resolved";
              const dateLabel = new Date(`${e.date}T12:00:00`).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <Card key={e.lead.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-lg leading-tight">{e.business}</p>
                        <p className="text-xs font-sans text-muted-foreground">{dateLabel}</p>
                      </div>
                      <span className={`text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full ${confirmed ? "bg-primary text-white" : "border border-primary text-primary"}`}>
                        {confirmed ? "Confirmed" : "Pending"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs font-sans text-muted-foreground pt-1 border-t border-border">
                      <span className="flex items-center gap-1"><Users size={12} /> {e.headcount}</span>
                      {e.pickupWindow && <span className="flex items-center gap-1"><Clock size={12} /> {e.pickupWindow}</span>}
                      {e.mode && (
                        <span className="flex items-center gap-1">
                          {e.mode.toLowerCase().includes("deliver") ? <Truck size={12} /> : <Store size={12} />} {e.mode}
                        </span>
                      )}
                      <span className="font-mono break-all">{e.lead.contact}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

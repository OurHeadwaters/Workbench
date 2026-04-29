import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Eye,
  Package,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { constellation } from "@/data/constellation";
import {
  useStandbyStore,
  type CallEntry,
  type RungId,
} from "@/lib/standbyStore";

const RUNG_TONE: Record<RungId, { dot: string; ring: string; text: string; bg: string }> = {
  advisory: {
    dot: "bg-amber-400",
    ring: "ring-amber-400/30",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  standby: {
    dot: "bg-orange-500",
    ring: "ring-orange-500/30",
    text: "text-orange-700",
    bg: "bg-orange-50",
  },
  active: {
    dot: "bg-red-600",
    ring: "ring-red-500/40",
    text: "text-red-700",
    bg: "bg-red-50",
  },
  standdown: {
    dot: "bg-emerald-600",
    ring: "ring-emerald-500/30",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
};

function formatStamp(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

// AUDIT NOTE — Standby-leaks-into-Gate bug class (Task #473)
// =========================================================
// This page is *intentionally* Standby-only. Every UI affordance below
// is built around The Standby's specific vocabulary: the four-rung
// ladder (advisory/standby/active/standdown), the call composer, the
// watch tab, the drawdown ledger, the debrief shape with its
// `standbyStockReplenished` checkbox, the Common Pantry / Watch
// sub-shelves. None of that vocabulary survives unchanged on The Gate
// (which has draft/under-review/cleared/refused as its rungs and
// Mappings/Substitutions/Categories as its sub-shelves).
//
// The constellation manifest now registers two primitives under
// `constellationWidePrimitives` — `the-standby` and `the-gate`. This
// page picks `the-standby` by id explicitly. DO NOT genericize this
// template into a primitive-loop renderer that takes the id from the
// route or from props — that is the bug class the codetry-handbook
// chapter generator was just fixed for. If a sibling Gate dashboard is
// wanted, build it as a separate file (e.g. `pages/Gate.tsx`) on a
// separate route (`/gate`) with its own UI that respects the Gate's
// vocabulary, ladder, and sub-shelves. Each non-zone primitive opts in
// per surface; nothing is shared by default.
export default function Standby() {
  const standbyPrimitive = useMemo(
    () =>
      constellation.constellationWidePrimitives.find(
        (p) => p.id === "the-standby",
      ) ?? null,
    [],
  );

  if (!standbyPrimitive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted-foreground">
        Constellation manifest is missing the Standby primitive. Refresh the
        snapshot with{" "}
        <code className="ml-1 px-2 py-0.5 rounded bg-muted text-foreground text-sm">
          pnpm --filter @workspace/headwaters-books run sync-constellation
        </code>
        .
      </div>
    );
  }

  const ladder = standbyPrimitive.severityLadder ?? [];
  const subShelves = standbyPrimitive.subShelves ?? [];
  const vocabulary = standbyPrimitive.vocabulary ?? [];

  const store = useStandbyStore();
  const [openComposer, setOpenComposer] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = store.calls.find((c) => c.id === selectedId) ?? null;

  if (!store.hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading the shelf…
      </div>
    );
  }

  const openCalls = store.calls.filter((c) => !c.closed);
  const closedCalls = store.calls.filter((c) => c.closed);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Headwaters</span>
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <div className="text-xs text-muted-foreground tracking-wide uppercase">
                Z3 · {constellation.z3?.memberFacingBrand ?? "807 Benefits"} · pilot
              </div>
              <h1 className="font-serif text-2xl text-foreground leading-tight">
                The Standby
              </h1>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>manifest v{constellation.version}</div>
            <div>updated {constellation.lastUpdated}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Primitive header — vocabulary verbatim from constellation */}
        <section className="mb-10">
          <p className="text-base text-foreground/80 max-w-3xl leading-relaxed">
            {standbyPrimitive.summary}
          </p>
          {standbyPrimitive.hostZoneRationale && (
            <p className="mt-3 text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {standbyPrimitive.hostZoneRationale}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {vocabulary.map((v) => (
              <Badge
                key={v.term}
                variant="outline"
                title={v.role}
                className="font-normal"
              >
                {v.term}
              </Badge>
            ))}
          </div>
        </section>

        {/* The four-rung ladder, verbatim */}
        <section className="mb-10">
          <h2 className="font-serif text-lg text-foreground mb-3">
            The four-rung ladder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {ladder.map((rung) => {
              const tone = RUNG_TONE[rung.rung as RungId];
              return (
                <div
                  key={rung.rung}
                  className={`rounded-lg border border-border ${tone?.bg ?? "bg-muted"} p-4`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${tone?.dot ?? "bg-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm font-semibold uppercase tracking-wide ${tone?.text ?? "text-foreground"}`}
                    >
                      {rung.rung}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-snug">
                    {rung.meaning}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* The two sub-shelves, verbatim */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {subShelves.map((shelf) => (
            <Card key={shelf.name} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  {shelf.name === "The Common Pantry" ? (
                    <Package className="w-5 h-5 text-primary" />
                  ) : (
                    <Eye className="w-5 h-5 text-primary" />
                  )}
                  {shelf.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {shelf.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Separator className="mb-8" />

        {/* Calls — open and history */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-2xl text-foreground">
                Calls on the shelf
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                A call is a specific active event. Open one when a centralized
                disruption forms; close with a debrief when it stands down.
              </p>
            </div>
            <Button
              data-testid="button-open-call"
              onClick={() => setOpenComposer(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Open a call
            </Button>
          </div>

          {openComposer && (
            <CallComposer
              ladder={ladder.map((l) => l.rung as RungId)}
              onCancel={() => setOpenComposer(false)}
              onSubmit={(input) => {
                const id = store.openCall(input);
                setOpenComposer(false);
                setSelectedId(id);
              }}
            />
          )}

          {store.calls.length === 0 && !openComposer && (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-60" />
                The shelf is quiet. No call is open. The watch is informed.
              </CardContent>
            </Card>
          )}

          {openCalls.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Open
              </h3>
              <div className="space-y-2">
                {openCalls.map((call) => (
                  <CallRow
                    key={call.id}
                    call={call}
                    selected={selectedId === call.id}
                    onSelect={() =>
                      setSelectedId(selectedId === call.id ? null : call.id)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {closedCalls.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Stood down
              </h3>
              <div className="space-y-2">
                {closedCalls.map((call) => (
                  <CallRow
                    key={call.id}
                    call={call}
                    selected={selectedId === call.id}
                    onSelect={() =>
                      setSelectedId(selectedId === call.id ? null : call.id)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {selected && (
          <section className="mt-8">
            <CallDetail
              key={selected.id}
              call={selected}
              ladder={ladder.map((l) => l.rung as RungId)}
              ladderMeanings={ladder}
              subShelves={subShelves.map((s) => s.name)}
              onSetRung={(rung, by) => store.setRung(selected.id, rung, by)}
              onAddWatch={(name, role) =>
                store.addWatch(selected.id, name, role)
              }
              onRemoveWatch={(id) => store.removeWatch(selected.id, id)}
              onDrawDown={(input) => store.drawDown(selected.id, input)}
              onUndoDrawdown={(id) => store.undoDrawdown(selected.id, id)}
              onClose={(debrief) => store.closeCall(selected.id, debrief)}
              onReopen={() => store.reopenCall(selected.id)}
              onDelete={() => {
                store.deleteCall(selected.id);
                setSelectedId(null);
              }}
            />
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>
            Pilot surface for The Standby — a Z3 dashboard. State lives in this
            browser only.
          </span>
          <span>
            Read from{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">
              constellation.constellationWidePrimitives
            </code>
          </span>
        </div>
      </footer>
    </div>
  );
}

function CallRow({
  call,
  selected,
  onSelect,
}: {
  call: CallEntry;
  selected: boolean;
  onSelect: () => void;
}) {
  const tone = RUNG_TONE[call.rung];
  return (
    <button
      type="button"
      onClick={onSelect}
      data-testid={`row-call-${call.id}`}
      className={`w-full text-left rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors px-4 py-3 flex items-center gap-3 ${
        selected ? `ring-2 ${tone.ring}` : ""
      }`}
    >
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${tone.dot} flex-shrink-0`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-medium text-foreground truncate">
            {call.title}
          </span>
          <span className={`text-xs uppercase tracking-wide ${tone.text}`}>
            {call.rung}
          </span>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {call.centralizedDisruption} · opened {formatStamp(call.openedAt)}
          {call.openedBy ? ` · by ${call.openedBy}` : ""}
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span title="on the watch" className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          {call.watch.length}
        </span>
        <span title="standby stock drawdowns" className="flex items-center gap-1">
          <Package className="w-3.5 h-3.5" />
          {call.drawdowns.length}
        </span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${selected ? "rotate-90" : ""}`}
        />
      </div>
    </button>
  );
}

function CallComposer({
  ladder,
  onSubmit,
  onCancel,
}: {
  ladder: RungId[];
  onSubmit: (input: {
    title: string;
    centralizedDisruption: string;
    rung: RungId;
    openedBy?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [disruption, setDisruption] = useState("");
  const [rung, setRung] = useState<RungId>(ladder[1] ?? "standby");
  const [openedBy, setOpenedBy] = useState("");

  const canSubmit = title.trim().length > 0 && disruption.trim().length > 0;

  return (
    <Card className="border-primary/40 mb-4">
      <CardHeader>
        <CardTitle className="font-serif text-lg">Open a call</CardTitle>
        <CardDescription>
          Name the call in the language the community will recognize on the
          shelf.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="call-title">Call name</Label>
            <Input
              id="call-title"
              data-testid="input-call-title"
              placeholder="Smoke call · April 28"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="call-disruption">Centralized disruption</Label>
            <Input
              id="call-disruption"
              data-testid="input-call-disruption"
              placeholder="smoke · ice · freight · power · AGM-postponed"
              value={disruption}
              onChange={(e) => setDisruption(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="call-rung">Open at rung</Label>
            <Select
              value={rung}
              onValueChange={(v) => setRung(v as RungId)}
            >
              <SelectTrigger id="call-rung" data-testid="select-call-rung">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ladder.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="call-by">Opened by (optional)</Label>
            <Input
              id="call-by"
              placeholder="steward name"
              value={openedBy}
              onChange={(e) => setOpenedBy(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            data-testid="button-submit-call"
            disabled={!canSubmit}
            onClick={() =>
              onSubmit({
                title,
                centralizedDisruption: disruption,
                rung,
                openedBy: openedBy || undefined,
              })
            }
          >
            Open the call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CallDetail({
  call,
  ladder,
  ladderMeanings,
  subShelves,
  onSetRung,
  onAddWatch,
  onRemoveWatch,
  onDrawDown,
  onUndoDrawdown,
  onClose,
  onReopen,
  onDelete,
}: {
  call: CallEntry;
  ladder: RungId[];
  ladderMeanings: { rung: string; meaning: string }[];
  subShelves: string[];
  onSetRung: (rung: RungId, by?: string) => void;
  onAddWatch: (name: string, role: string) => void;
  onRemoveWatch: (id: string) => void;
  onDrawDown: (input: {
    item: string;
    quantity: string;
    shelf: "The Common Pantry" | "The Watch";
    note?: string;
  }) => void;
  onUndoDrawdown: (id: string) => void;
  onClose: (debrief: {
    whatHappened: string;
    whatHeld: string;
    whatStrained: string;
    standbyStockReplenished: boolean;
  }) => void;
  onReopen: () => void;
  onDelete: () => void;
}) {
  const tone = RUNG_TONE[call.rung];
  const [watchName, setWatchName] = useState("");
  const [watchRole, setWatchRole] = useState("");
  const [drawItem, setDrawItem] = useState("");
  const [drawQty, setDrawQty] = useState("");
  const [drawShelf, setDrawShelf] =
    useState<"The Common Pantry" | "The Watch">("The Common Pantry");
  const [drawNote, setDrawNote] = useState("");

  const [debriefHappened, setDebriefHappened] = useState(
    call.debrief?.whatHappened ?? "",
  );
  const [debriefHeld, setDebriefHeld] = useState(call.debrief?.whatHeld ?? "");
  const [debriefStrained, setDebriefStrained] = useState(
    call.debrief?.whatStrained ?? "",
  );
  const [debriefReplenished, setDebriefReplenished] = useState(
    call.debrief?.standbyStockReplenished ?? false,
  );

  const submitWatch = () => {
    if (!watchName.trim()) return;
    onAddWatch(watchName, watchRole);
    setWatchName("");
    setWatchRole("");
  };

  const submitDrawdown = () => {
    if (!drawItem.trim()) return;
    onDrawDown({ item: drawItem, quantity: drawQty, shelf: drawShelf, note: drawNote });
    setDrawItem("");
    setDrawQty("");
    setDrawNote("");
  };

  const submitDebrief = () => {
    onClose({
      whatHappened: debriefHappened.trim(),
      whatHeld: debriefHeld.trim(),
      whatStrained: debriefStrained.trim(),
      standbyStockReplenished: debriefReplenished,
    });
  };

  return (
    <Card data-testid={`detail-call-${call.id}`} className={`border-2 ${call.closed ? "border-emerald-500/30" : "border-border"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${tone.dot}`}
              />
              {call.title}
            </CardTitle>
            <CardDescription className="mt-1">
              Centralized disruption: {call.centralizedDisruption} · opened{" "}
              {formatStamp(call.openedAt)}
              {call.openedBy ? ` by ${call.openedBy}` : ""}
              {call.closed && call.closedAt
                ? ` · stood down ${formatStamp(call.closedAt)}`
                : ""}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Remove this call"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">
            Move on the ladder:
          </span>
          {ladder.map((r) => {
            const t = RUNG_TONE[r];
            const isCurrent = call.rung === r;
            return (
              <Button
                key={r}
                size="sm"
                variant={isCurrent ? "default" : "outline"}
                disabled={call.closed && r !== "standdown"}
                onClick={() => onSetRung(r)}
                data-testid={`button-rung-${r}`}
                className={`gap-1.5 ${isCurrent ? "" : t.text}`}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${t.dot}`} />
                {r}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {ladderMeanings.find((l) => l.rung === call.rung)?.meaning}
        </p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={call.closed ? "debrief" : "watch"}>
          <TabsList className="mb-4">
            <TabsTrigger value="watch" data-testid="tab-watch">
              The Watch ({call.watch.length})
            </TabsTrigger>
            <TabsTrigger value="pantry" data-testid="tab-pantry">
              Standby stock ({call.drawdowns.length})
            </TabsTrigger>
            <TabsTrigger value="ladder">Rung history</TabsTrigger>
            <TabsTrigger value="debrief" data-testid="tab-debrief">
              The debrief
            </TabsTrigger>
          </TabsList>

          {/* THE WATCH */}
          <TabsContent value="watch" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The watch is the active-monitoring posture between advisory and
              active — the people doing the watching during this call.
            </p>
            {!call.closed && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  data-testid="input-watch-name"
                  placeholder="who is on the watch"
                  value={watchName}
                  onChange={(e) => setWatchName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitWatch()}
                />
                <Input
                  placeholder="role (e.g. dispatch, freight liaison)"
                  value={watchRole}
                  onChange={(e) => setWatchRole(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitWatch()}
                />
                <Button
                  data-testid="button-add-watch"
                  onClick={submitWatch}
                  disabled={!watchName.trim()}
                >
                  Log on the watch
                </Button>
              </div>
            )}
            {call.watch.length === 0 ? (
              <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center">
                No one has been logged on the watch yet.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {call.watch.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-border bg-card"
                  >
                    <div>
                      <span className="font-medium text-foreground">
                        {w.name}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {" "}
                        — {w.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatStamp(w.loggedAt)}
                      </span>
                      {!call.closed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveWatch(w.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          aria-label="Remove from the watch"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          {/* STANDBY STOCK */}
          <TabsContent value="pantry" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Standby stock is the physical/operational reserves the always-on
              side maintains. Draw down items as the call uses them — the
              shelf they came from is named.
            </p>
            {!call.closed && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_1fr] gap-2">
                  <Input
                    data-testid="input-draw-item"
                    placeholder="what was drawn (water · pellets · diesel · masks)"
                    value={drawItem}
                    onChange={(e) => setDrawItem(e.target.value)}
                  />
                  <Input
                    placeholder="qty"
                    value={drawQty}
                    onChange={(e) => setDrawQty(e.target.value)}
                  />
                  <Select
                    value={drawShelf}
                    onValueChange={(v) =>
                      setDrawShelf(v as "The Common Pantry" | "The Watch")
                    }
                  >
                    <SelectTrigger data-testid="select-draw-shelf">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subShelves.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                  <Input
                    placeholder="note (optional — who took it, where it went)"
                    value={drawNote}
                    onChange={(e) => setDrawNote(e.target.value)}
                  />
                  <Button
                    data-testid="button-draw-down"
                    onClick={submitDrawdown}
                    disabled={!drawItem.trim()}
                  >
                    Draw down
                  </Button>
                </div>
              </div>
            )}
            {call.drawdowns.length === 0 ? (
              <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center">
                Nothing has been drawn from standby stock yet.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {call.drawdowns.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-start justify-between gap-2 px-3 py-2 rounded-md border border-border bg-card"
                  >
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-medium text-foreground">
                          {d.item}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          × {d.quantity}
                        </span>
                        <Badge variant="outline" className="font-normal">
                          {d.shelf}
                        </Badge>
                      </div>
                      {d.note && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {d.note}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatStamp(d.drawnAt)}
                      </span>
                      {!call.closed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUndoDrawdown(d.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          aria-label="Undo drawdown"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          {/* RUNG HISTORY */}
          <TabsContent value="ladder" className="space-y-2">
            <p className="text-sm text-muted-foreground">
              How this call moved on the four-rung ladder.
            </p>
            <ol className="space-y-1.5">
              {call.rungHistory.map((entry, i) => {
                const t = RUNG_TONE[entry.rung];
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-card"
                  >
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${t.dot}`}
                    />
                    <span className={`text-sm font-medium ${t.text}`}>
                      {entry.rung}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatStamp(entry.at)}
                      {entry.by ? ` · ${entry.by}` : ""}
                    </span>
                  </li>
                );
              })}
            </ol>
          </TabsContent>

          {/* DEBRIEF */}
          <TabsContent value="debrief" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The debrief is the after-action synthesis once a call has stood
              down. Closing the call moves it to standdown and replenishes the
              record.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="debrief-happened">What happened</Label>
                <Textarea
                  id="debrief-happened"
                  data-testid="textarea-debrief-happened"
                  rows={3}
                  placeholder="A brief account of the call from open to standdown."
                  value={debriefHappened}
                  onChange={(e) => setDebriefHappened(e.target.value)}
                  disabled={call.closed}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="debrief-held">What held</Label>
                  <Textarea
                    id="debrief-held"
                    rows={3}
                    placeholder="The parts of the standby that worked as named."
                    value={debriefHeld}
                    onChange={(e) => setDebriefHeld(e.target.value)}
                    disabled={call.closed}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="debrief-strained">What strained</Label>
                  <Textarea
                    id="debrief-strained"
                    rows={3}
                    placeholder="What the call exposed in standby stock, the watch, or the ladder."
                    value={debriefStrained}
                    onChange={(e) => setDebriefStrained(e.target.value)}
                    disabled={call.closed}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground/80">
                <Checkbox
                  data-testid="checkbox-replenished"
                  checked={debriefReplenished}
                  onCheckedChange={(v) => setDebriefReplenished(v === true)}
                  disabled={call.closed}
                />
                Standby stock has been replenished.
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {call.closed ? (
                <Button
                  variant="outline"
                  onClick={onReopen}
                  className="gap-2"
                  data-testid="button-reopen"
                >
                  <RotateCcw className="w-4 h-4" /> Reopen the call
                </Button>
              ) : (
                <Button
                  onClick={submitDebrief}
                  className="gap-2"
                  data-testid="button-close-call"
                  disabled={!debriefHappened.trim()}
                >
                  <CheckCircle2 className="w-4 h-4" /> Stand down · close with debrief
                </Button>
              )}
            </div>

            {call.closed && call.debrief && (
              <div className="mt-3 text-xs text-muted-foreground">
                Debrief written {formatStamp(call.debrief.writtenAt)}.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

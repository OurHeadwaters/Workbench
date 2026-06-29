import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChefHat, Send, Volume2, VolumeX } from "lucide-react";
import {
  useListOrders,
  getListOrdersQueryKey,
  useGetOrder,
  getGetOrderQueryKey,
  useUpdateOrder,
  usePostOrderMessage,
  type Order,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

const COLUMNS: { key: Order["status"]; title: string; tint: string }[] = [
  { key: "pending", title: "New", tint: "bg-amber-50 border-amber-200" },
  { key: "accepted", title: "Accepted", tint: "bg-blue-50 border-blue-200" },
  { key: "preparing", title: "In Prep", tint: "bg-purple-50 border-purple-200" },
  { key: "ready", title: "Ready for Pickup", tint: "bg-green-50 border-green-200" },
];

function playPing() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine"; o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.start(); o.stop(ctx.currentTime + 0.42);
  } catch {/* ignore */}
}

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders } = useListOrders({ query: { refetchInterval: 4000 } as never });
  const update = useUpdateOrder({
    mutation: { onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      qc.invalidateQueries({ queryKey: getGetOrderQueryKey(v.id) });
    } },
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const knownPending = useRef<Set<number>>(new Set());
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!orders) return;
    const pending = orders.filter(o => o.status === "pending");
    if (firstLoad.current) {
      firstLoad.current = false;
      knownPending.current = new Set(pending.map(o => o.id));
      return;
    }
    for (const o of pending) {
      if (!knownPending.current.has(o.id)) {
        knownPending.current.add(o.id);
        if (soundOn) playPing();
      }
    }
  }, [orders, soundOn]);

  const byStatus = useMemo(() => {
    const m: Record<string, Order[]> = { pending: [], accepted: [], preparing: [], ready: [] };
    for (const o of orders ?? []) if (m[o.status]) m[o.status].push(o);
    return m;
  }, [orders]);

  if (!orders) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-serif mb-1 flex items-center gap-3"><ChefHat /> Kitchen Board</h2>
          <p className="text-muted-foreground text-sm">Live orders. New ones ping you.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSoundOn(s => !s)}>
          {soundOn ? <Volume2 size={16} className="mr-2" /> : <VolumeX size={16} className="mr-2" />}
          {soundOn ? "Sound on" : "Sound off"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => (
          <div key={col.key} className={`rounded-xl border ${col.tint} p-4 space-y-3 min-h-[200px]`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-widest text-xs">{col.title}</h3>
              <span className="text-xs bg-background/70 px-2 py-0.5 rounded-full font-mono">{byStatus[col.key]?.length ?? 0}</span>
            </div>
            <div className="space-y-2">
              {byStatus[col.key]?.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  className="w-full text-left bg-background border border-border rounded-lg p-3 hover:border-foreground/30 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div className="font-bold">{o.customerName}</div>
                    <div className="text-xs text-muted-foreground font-mono">#{o.id}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{o.phone}{o.etaMinutes ? ` · ${o.etaMinutes}m ETA` : ""}</div>
                  <div className="text-sm line-clamp-3">{o.summary}</div>
                </button>
              ))}
              {byStatus[col.key]?.length === 0 && (
                <p className="text-xs text-muted-foreground/60 italic text-center py-4">Empty</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedId && (
        <OrderDrawer id={selectedId} onClose={() => setSelectedId(null)} onAdvance={(status) => update.mutate({ id: selectedId, data: { status } })} onSetEta={(eta) => update.mutate({ id: selectedId, data: { etaMinutes: eta } })} />
      )}
    </div>
  );
}

function OrderDrawer({ id, onClose, onAdvance, onSetEta }: { id: number; onClose: () => void; onAdvance: (s: Order["status"]) => void; onSetEta: (n: number) => void }) {
  const qc = useQueryClient();
  const { data } = useGetOrder(id, { query: { refetchInterval: 3000 } as never });
  const post = usePostOrderMessage({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetOrderQueryKey(id) }) } });
  const [reply, setReply] = useState("");
  const [eta, setEta] = useState<string>("");
  useEffect(() => { if (data?.order.etaMinutes != null) setEta(String(data.order.etaMinutes)); }, [data?.order.etaMinutes]);
  if (!data) return null;
  const o = data.order;

  const sendReply = () => {
    if (!reply.trim()) return;
    post.mutate({ id, data: { sender: "staff", body: reply.trim() } });
    setReply("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex justify-end" onClick={onClose}>
      <div className="bg-background w-full max-w-md h-full overflow-auto p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-serif">{o.customerName}</h3>
            <p className="text-sm text-muted-foreground">{o.phone} · #{o.id}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <Card><CardContent className="pt-6">
          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2">Order summary</p>
          <p className="text-sm whitespace-pre-wrap">{o.summary}</p>
        </CardContent></Card>

        <div className="flex flex-wrap gap-2">
          {o.status === "pending" && <Button onClick={() => onAdvance("accepted")}>Accept</Button>}
          {o.status === "accepted" && <Button onClick={() => onAdvance("preparing")}>Start Preparing</Button>}
          {o.status === "preparing" && <Button onClick={() => onAdvance("ready")}>Mark Ready</Button>}
          {o.status === "ready" && <Button onClick={() => onAdvance("picked_up")}>Picked Up</Button>}
          {o.status !== "cancelled" && o.status !== "picked_up" && (
            <Button variant="outline" className="text-destructive" onClick={() => onAdvance("cancelled")}>Cancel</Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">ETA (min):</span>
          <Input type="number" value={eta} onChange={(e) => setEta(e.target.value)} className="w-24" />
          <Button size="sm" variant="outline" onClick={() => onSetEta(Number(eta) || 0)}>Set</Button>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Chat</p>
          <div className="space-y-2 max-h-72 overflow-auto bg-muted/30 p-3 rounded-lg">
            {data.messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-2xl px-3 py-2 max-w-[80%] text-sm ${m.sender === "customer" ? "bg-background border border-border" : m.sender === "system" ? "bg-muted text-muted-foreground italic text-xs" : "bg-primary text-white"}`}>
                  {m.body}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply to customer..." onKeyDown={(e) => e.key === "Enter" && sendReply()} />
            <Button onClick={sendReply} disabled={!reply.trim() || post.isPending}><Send size={16} /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

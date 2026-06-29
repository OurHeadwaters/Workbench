import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, Loader2, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetSettings,
  useListUpsells,
  useCreateOrder,
  useGetOrder,
  usePostOrderMessage,
  getGetOrderQueryKey,
  type Order,
} from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Waiting for the kitchen to confirm",
  accepted: "Kitchen has accepted your order",
  preparing: "Your order is being made",
  ready: "Ready for pickup!",
  picked_up: "Picked up — thanks!",
  cancelled: "Order cancelled",
};

export default function OrderPage() {
  const { data: settings } = useGetSettings();
  const { data: upsells } = useListUpsells();
  const createOrder = useCreateOrder();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restore in-progress order from sessionStorage
  useEffect(() => {
    const id = sessionStorage.getItem("kpizza_order_id");
    if (id) setOrderId(Number(id));
  }, []);

  const chefSpecial = (upsells ?? []).filter(u => u.pool === "chef_specials");
  const pick = chefSpecial.length ? chefSpecial[Math.floor(Math.random() * chefSpecial.length)] : null;

  const shopOpen = settings?.status === "open";

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !body.trim()) return;
    setError(null);
    try {
      const res = await createOrder.mutateAsync({ data: { customerName: name.trim(), phone: phone.trim(), body: body.trim() } });
      sessionStorage.setItem("kpizza_order_id", String(res.order.id));
      setOrderId(res.order.id);
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } };
      setError(err?.data?.message ?? "Couldn't send your order. Try again.");
    }
  };

  const reset = () => {
    sessionStorage.removeItem("kpizza_order_id");
    setOrderId(null);
    setBody("");
    qc.removeQueries({ queryKey: ["/api/orders"] });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24 font-sans text-foreground">
      <header className="bg-background border-b border-border p-4 sticky top-0 z-10 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft size={20} /></Button>
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold">Order Ahead</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Pickup at {settings?.address || "the shop"}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 mt-4">
        {orderId ? (
          <OrderThread orderId={orderId} onReset={reset} />
        ) : (
          <>
            {settings && !shopOpen && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900">
                <p className="font-bold uppercase tracking-widest text-xs mb-1">{settings.status === "closed" ? "Closed" : "Paused"}</p>
                <p className="text-sm">{settings.statusMessage || "We're not taking orders right now. Check back soon."}</p>
              </div>
            )}

            {pick && shopOpen && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-background">
                  {pick.imageUrl && <img src={pick.imageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-1">Chef's Special</h4>
                  <p className="font-serif text-lg leading-tight mb-1">{pick.name} <span className="text-muted-foreground text-sm">{pick.price}</span></p>
                  <p className="text-xs text-foreground/70">{pick.blurb}</p>
                </div>
              </div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif">Skip the phone tag.</h2>
                <p className="text-muted-foreground text-sm">Tell us what you want. We'll reply when it's confirmed.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your order</Label>
                <Textarea placeholder="e.g. One large meat lovers, 1lb honey garlic wings, garlic bread w/ cheese..." rows={4} className="bg-background resize-none" value={body} onChange={(e) => setBody(e.target.value)} disabled={!shopOpen} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</Label>
                  <Input className="bg-background" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} disabled={!shopOpen} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</Label>
                  <Input className="bg-background" type="tel" placeholder="(807)" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!shopOpen} />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button className="w-full h-14 text-lg font-bold rounded-xl" disabled={!shopOpen || !body.trim() || !name.trim() || !phone.trim() || createOrder.isPending} onClick={submit}>
                {createOrder.isPending ? <Loader2 className="animate-spin" /> : (<>Send Order <Send className="ml-2" size={18} /></>)}
              </Button>
            </motion.div>
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border flex justify-center">
        <a href={`tel:${(settings?.phone ?? "").replace(/\D/g, "")}`} className="text-sm font-bold uppercase tracking-widest text-primary hover:underline">
          Call instead: {settings?.phone || "—"}
        </a>
      </div>
    </div>
  );
}

function OrderThread({ orderId, onReset }: { orderId: number; onReset: () => void }) {
  const { data, isLoading } = useGetOrder(orderId, { query: { refetchInterval: 4000 } as never });
  const qc = useQueryClient();
  const post = usePostOrderMessage({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) }) } });
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [data?.messages.length]);

  if (isLoading || !data) return <div className="flex justify-center pt-12"><Loader2 className="animate-spin" /></div>;
  const o = data.order;
  const send = () => {
    if (!text.trim()) return;
    post.mutate({ id: orderId, data: { sender: "customer", body: text.trim() } });
    setText("");
  };

  const isDone = o.status === "picked_up" || o.status === "cancelled";

  return (
    <div className="space-y-6">
      <div className="bg-background border border-border rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Order #{o.id}</p>
          {o.etaMinutes != null && o.status !== "ready" && o.status !== "picked_up" && (
            <span className="text-xs flex items-center gap-1 text-muted-foreground"><Clock size={12} /> ~{o.etaMinutes} min</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {o.status === "ready" ? (
            <CheckCircle2 className="text-green-600" />
          ) : o.status === "cancelled" ? (
            <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          )}
          <p className="font-bold">{STATUS_LABEL[o.status]}</p>
        </div>
      </div>

      <div ref={scrollRef} className="bg-background border border-border rounded-2xl p-4 space-y-3 max-h-[55vh] overflow-auto">
        {data.messages.map(m => (
          <div key={m.id} className={`flex flex-col ${m.sender === "customer" ? "items-end" : "items-start"}`}>
            <div className={`rounded-2xl px-3 py-2 max-w-[85%] text-sm ${m.sender === "customer" ? "bg-primary text-white rounded-tr-sm" : m.sender === "system" ? "bg-muted text-muted-foreground italic text-xs" : "bg-muted text-foreground rounded-tl-sm"}`}>
              {m.body}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        ))}
      </div>

      {!isDone ? (
        <div className="flex gap-2">
          <Input placeholder="Add a note..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          <Button onClick={send} disabled={!text.trim() || post.isPending}><Send size={16} /></Button>
        </div>
      ) : (
        <Button variant="outline" className="w-full" onClick={onReset}>Start a new order</Button>
      )}
    </div>
  );
}

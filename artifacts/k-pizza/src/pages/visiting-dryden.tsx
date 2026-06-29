import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Clock, Sparkles, Hotel, Loader2, Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetSettings,
  useCreatePhoneAddonRequest,
} from "@workspace/k-pizza-client-react";

const DAY_LABELS: Record<number, string> = {
  0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat",
};

function formatTime(t: string): string {
  if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return t;
  const [hStr, mStr] = t.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const suffix = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  return m === 0 ? `${h}${suffix}` : `${h}:${String(m).padStart(2, "0")}${suffix}`;
}

export default function VisitingDrydenPage() {
  const { data: settings } = useGetSettings();
  const hotel = settings?.hotelGuest;
  const phoneDisplay = settings?.phone ?? "(807) 215-0101";
  const addressDisplay = settings?.address ?? "5 Earl Ave, Dryden, ON";
  const mapUrl =
    hotel?.mapUrl?.trim() ||
    "https://www.google.com/maps/search/?api=1&query=Konstantino+Pizza+%26+Wings+Dryden+ON";

  const today = new Date().getDay();
  const todaysHours = settings?.hours?.[String(today) as "0"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Slim nav */}
      <nav className="border-b border-border bg-background sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/real/logo.jpg" alt="Konstantino Pizza & Wings" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-serif font-bold tracking-tight">Konstantino's</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/menu" className="text-sm font-sans hover:text-primary hidden sm:inline">Menu</Link>
            <Link href="/order">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-none font-sans uppercase tracking-wider text-xs">Order</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="welcome" className="bg-foreground text-background py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-5">
              <Hotel size={14} /> Visiting Dryden?
            </span>
            <h1 className="text-4xl md:text-6xl font-serif leading-[1.05] mb-6">
              Welcome. You picked the right block.
            </h1>
            <p className="font-sans text-background/85 text-lg leading-relaxed">
              {hotel?.welcomeBlurb ||
                "Welcome to Dryden. You are about a block from a real pizza shop — hand-stretched dough, fresh sauce, wings tossed to order. Walk over, eat well, and ask the counter what is coming out of the oven tonight."}
            </p>
            <p className="font-sans text-accent text-sm uppercase tracking-widest font-bold mt-4">
              {hotel?.walkLine || "About a one-block walk from most downtown Dryden hotels."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick info: address, hours, map */}
      <section className="bg-background border-b border-border py-10 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin size={16} />
              <span className="font-bold text-xs uppercase tracking-widest">Where</span>
            </div>
            <p className="font-serif text-lg leading-tight">{addressDisplay}</p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm font-sans underline text-primary hover:text-primary/80"
            >
              Open in Google Maps →
            </a>
          </div>
          <div className="border border-border p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Clock size={16} />
              <span className="font-bold text-xs uppercase tracking-widest">Open today</span>
            </div>
            {todaysHours?.open ? (
              <p className="font-serif text-lg leading-tight">
                {formatTime(todaysHours.start)} – {formatTime(todaysHours.end)}
              </p>
            ) : (
              <p className="font-serif text-lg leading-tight text-muted-foreground">Closed today</p>
            )}
            {settings?.hours && (
              <div className="mt-3 grid grid-cols-7 gap-1 text-[10px] font-sans">
                {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                  const h = settings.hours[String(d) as "0"];
                  const isToday = d === today;
                  return (
                    <div key={d} className={`text-center ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      <div>{DAY_LABELS[d]}</div>
                      <div className="mt-0.5">{h.open ? formatTime(h.start).replace(/[ap]m/, "") : "—"}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="border border-border p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles size={16} />
              <span className="font-bold text-xs uppercase tracking-widest">Call</span>
            </div>
            <p className="font-serif text-lg leading-tight">{phoneDisplay}</p>
            <p className="text-xs font-sans text-muted-foreground mt-2">Or text-chat order from the site below.</p>
            <Link href="/order">
              <Button size="sm" className="mt-3 bg-primary text-white hover:bg-primary/90 rounded-none font-sans uppercase tracking-wider text-xs">
                Text-chat order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* First-visit picks */}
      <section id="first-visit" className="py-16 md:py-24 px-6 md:px-12 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 mb-5">
            What to order on a first visit
          </span>
          <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-10">
            If it is your first time, these are the safe yes.
          </h2>
          <div className="space-y-5">
            {(hotel?.firstVisitPicks ?? []).map((pick, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border-l-4 border-primary bg-background p-5"
              >
                <h3 className="font-serif text-xl mb-1">{pick.name}</h3>
                <p className="font-sans text-foreground/75 text-sm leading-relaxed">{pick.why}</p>
              </motion.div>
            ))}
            {(!hotel?.firstVisitPicks || hotel.firstVisitPicks.length === 0) && (
              <p className="text-muted-foreground italic">Ask the counter — they will steer you right.</p>
            )}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/menu">
              <Button variant="outline" className="rounded-none">See the full menu →</Button>
            </Link>
            <Link href="/order">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-none">Order ahead</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For hotels & front desks */}
      <HotelPitchSection />

      {/* Footer */}
      <footer className="bg-foreground text-background/70 py-8 px-6 text-center text-sm font-sans">
        <p>Konstantino Pizza &amp; Wings · {addressDisplay} · {phoneDisplay}</p>
        <Link href="/" className="underline hover:text-background text-xs uppercase tracking-widest mt-2 inline-block">
          Back to the main site
        </Link>
      </footer>
    </div>
  );
}

function HotelPitchSection() {
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [note, setNote] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const create = useCreatePhoneAddonRequest({
    mutation: { onSuccess: () => { setDone(true); setName(""); setContact(""); setNote(""); } },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = contact.trim();
    if (!trimmed) {
      setErr("Add an email or phone so we can deliver the cards.");
      return;
    }
    create.mutate({ data: { kind: "hotel_qr_request", name: name.trim(), contact: trimmed, note: note.trim(), website: hp } as never });
  };

  return (
    <section id="for-hotels" className="py-16 md:py-24 px-6 md:px-12 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-5">
          <span className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest px-3 py-1.5">
            <Hotel size={14} /> For Hotels &amp; Front Desks
          </span>
          <h2 className="text-3xl md:text-4xl font-serif leading-tight">
            Your guests ask where to eat.<br/>Hand them this card.
          </h2>
          <p className="font-sans text-foreground/80 text-lg leading-relaxed">
            Tourists rolling into Dryden eat wherever the front desk recommends. We will drop off a stack of printed QR cards for your lobby — guests scan, land on this page, walk a block, eat well. You look good, they remember you, we feed the room.
          </p>
          <ul className="space-y-2 font-sans text-foreground/75 text-base">
            <li className="flex gap-2"><Check className="text-primary shrink-0 mt-1" size={16} /> No cost to the hotel. We print, we deliver.</li>
            <li className="flex gap-2"><Check className="text-primary shrink-0 mt-1" size={16} /> Cards point your guests at this guide — picks, hours, map.</li>
            <li className="flex gap-2"><Check className="text-primary shrink-0 mt-1" size={16} /> Restock anytime — just text Jamie.</li>
          </ul>
          <div className="pt-3">
            <a
              href="/hotel-qr-card"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-sans underline text-primary hover:text-primary/80"
            >
              <QrCode size={14} /> Preview the printable card
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          {done ? (
            <div className="bg-accent/30 border border-accent p-6 space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <Check size={18} className="text-primary" />
                <p className="font-bold">Got it — Jamie will be in touch.</p>
              </div>
              <p className="font-sans text-sm text-foreground/80">
                We will swing by with a starter stack of cards within a day or two.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="text-xs font-sans underline text-foreground/60 hover:text-foreground"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-muted/40 border border-border p-6 space-y-3">
              <p className="text-xs uppercase tracking-widest font-bold">Request QR cards for your lobby</p>
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
              >
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                  />
                </label>
              </div>
              <input
                type="text"
                placeholder="Hotel name (e.g. Best Western Dryden)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                required
                placeholder="Front-desk email or phone"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
              />
              <textarea
                rows={3}
                placeholder="How many cards? Any restock cadence? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary resize-none"
              />
              {err && <p className="text-xs font-sans font-bold text-destructive">{err}</p>}
              <button
                type="submit"
                disabled={create.isPending}
                className="w-full bg-primary text-white font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {create.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                {create.isPending ? "Sending…" : "Request a stack"}
              </button>
              <p className="text-[11px] text-muted-foreground font-sans">
                Jamie will text you back to confirm count and drop-off time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

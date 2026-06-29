import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, MapPin, Sparkles, Clock, Calendar, Loader2, Phone } from "lucide-react";
import { useGetSettings, useListMarketStalls, type MarketStall } from "@workspace/k-pizza-client-react";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };

export default function MarketMosaicPage() {
  const { data: settings, isLoading: settingsLoading } = useGetSettings();
  const { data: stalls, isLoading: stallsLoading } = useListMarketStalls({ active: true });

  if (settingsLoading || stallsLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const mm = settings.marketMosaic;
  const seasonOn = mm?.seasonEnabled ?? false;

  if (!seasonOn) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="px-6 md:px-12 py-6 border-b border-border">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Back to Konstantino's
          </Link>
        </header>
        <main className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center space-y-6">
          <span className="inline-flex items-center gap-2 bg-muted text-foreground/70 text-xs font-bold uppercase tracking-widest px-3 py-1.5">
            <Calendar size={14} /> Days of Summer · off-season
          </span>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05]">The Market Mosaic is on summer break.</h1>
          <p className="font-sans text-foreground/75 leading-relaxed">
            Konstantino's Days of Summer page runs Thursdays alongside the Dryden Farmers' Market. It'll flip back on when the season starts again. In the meantime, our 807 Co-op crate and weekly specials are still live at the shop.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1">
              Back to the shop →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const coopCount = (stalls ?? []).filter((s) => s.coopMember).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 md:px-12 py-6 border-b border-border flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Back to Konstantino's
        </Link>
        <span className="text-xs font-sans uppercase tracking-widest text-foreground/60 hidden sm:inline">
          {mm.thursdayHours}
        </span>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-b border-border">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-5xl mx-auto space-y-6"
        >
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
            <Sparkles size={14} /> Days of Summer · Thursday hop
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.02]">
            {mm.daysOfSummerHeadline}
          </motion.h1>
          <motion.p variants={fadeUp} className="font-sans text-lg md:text-xl text-foreground/80 leading-relaxed max-w-3xl">
            {mm.daysOfSummerIntro}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
            <span className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1.5 text-xs font-sans">
              <Clock size={14} className="text-primary" /> {mm.thursdayHours}
            </span>
            <span className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1.5 text-xs font-sans">
              <Leaf size={14} className="text-primary" /> {coopCount} of {(stalls ?? []).length} stalls feed the 807 co-op crate
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Mosaic */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">The market, stall by stall</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.1]">Walk the row. We'll tell you which stalls walked into our kitchen this week.</h2>
          </div>

          {(stalls ?? []).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border">
              No stalls posted yet — owner is updating this week's row.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {(stalls ?? []).map((stall) => (
                <StallCard key={stall.id} stall={stall} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Happy hour card */}
      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28 bg-foreground text-background">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
              <Sparkles size={14} /> After the market · Local Hour
            </span>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05]">{mm.happyHour.headline}</h2>
            <p className="font-sans text-lg text-background/85 leading-relaxed">{mm.happyHour.special}</p>
            <p className="font-sans text-sm text-background/65 leading-relaxed">{mm.happyHour.weeklyRotation}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-background/5 border border-background/20 p-6 md:p-7 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">When</p>
                <p className="font-serif text-2xl leading-tight">{mm.happyHour.hoursLine}</p>
              </div>
              <div className="border-t border-background/15 pt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Where</p>
                <p className="font-sans text-base text-background/85 leading-snug">
                  Konstantino Pizza & Wings · {settings.address}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-3 pt-1">
                {settings.address && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Konstantino Pizza & Wings, ${settings.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-accent border-b-2 border-accent pb-1 hover:text-background hover:border-background transition-colors"
                  >
                    <MapPin size={14} /> {mm.happyHour.ctaLabel}
                  </a>
                )}
                {settings.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-accent border-b-2 border-accent pb-1 hover:text-background hover:border-background transition-colors"
                  >
                    <Phone size={14} /> Tap to call {settings.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function StallCard({ stall }: { stall: MarketStall }) {
  return (
    <motion.div variants={fadeUp} className="border border-border bg-background p-5 flex flex-col gap-3 h-full">
      {stall.imageUrl ? (
        <div className="aspect-[4/3] -mx-5 -mt-5 mb-1 bg-muted overflow-hidden">
          <img src={stall.imageUrl} alt={stall.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-[4/3] -mx-5 -mt-5 mb-1 bg-gradient-to-br from-muted to-muted/40 flex items-center justify-center">
          <Leaf className="text-foreground/20" size={48} />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-xl leading-tight">{stall.name}</h3>
        {stall.coopMember && (
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 shrink-0">
            <Leaf size={10} /> 807
          </span>
        )}
      </div>
      <p className="font-sans text-sm text-foreground/75 leading-relaxed flex-1">{stall.blurb}</p>
      {stall.coopMember && stall.coopNote && (
        <div className="border-t border-border pt-3 mt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">On our menu this week</p>
          <p className="font-sans text-xs text-foreground/70 leading-snug">{stall.coopNote}</p>
        </div>
      )}
    </motion.div>
  );
}

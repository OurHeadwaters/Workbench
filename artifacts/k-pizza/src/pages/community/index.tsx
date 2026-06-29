import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  Users,
  Megaphone,
  Sprout,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useMarketMosaicPrograms } from "@/hooks/useMarketMosaicPrograms";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const PROGRAM_ICONS: Record<string, React.ElementType> = {
  "lunch-club": CalendarClock,
  "feed-your-team": Users,
  fundraisers: Megaphone,
  "days-of-summer": Sprout,
};

export default function CommunityPage() {
  const { programs, loading } = useMarketMosaicPrograms();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 md:px-12 py-6 border-b border-border flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to Konstantino's
        </Link>
      </header>

      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-b border-border">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-5xl mx-auto space-y-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5"
          >
            <Users size={14} /> Community Programs
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.02]"
          >
            More than a pizza shop.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-foreground/80 leading-relaxed max-w-3xl"
          >
            Konstantino's runs four community programs out of the same kitchen on
            Earl Ave. Standing weekly lunches, crew catering, fundraiser drives,
            and seasonal market deals — pick the one that fits your team or
            organization.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-10">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-muted-foreground" size={28} />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {programs.map((program) => {
                const Icon = PROGRAM_ICONS[program.id] ?? Users;
                return (
                  <motion.div
                    key={program.id}
                    variants={fadeUp}
                    className="bg-background border border-border p-7 flex flex-col gap-5 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <h2 className="font-serif text-2xl leading-tight">
                        {program.name}
                      </h2>
                    </div>
                    {program.description && (
                      <p className="font-sans text-foreground/75 text-base leading-relaxed flex-1">
                        {program.description}
                      </p>
                    )}
                    <Link
                      href={program.href}
                      className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1 self-start hover:text-secondary transition-colors"
                    >
                      Learn more <ArrowRight size={13} />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-16 border-b border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Not sure which fits?
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Call the shop and ask for Jamie.
            </h2>
            <p className="font-sans text-foreground/75 leading-relaxed max-w-xl">
              Every program is run out of the same kitchen by the same team.
              Jamie will point you to the right one and get you set up the same
              day.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="tel:8072150101"
              className="inline-flex items-center gap-2 bg-foreground text-background font-sans text-sm font-bold uppercase tracking-widest px-6 py-4 hover:bg-foreground/90 transition-colors"
            >
              (807) 215-0101
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t border-border py-10 px-6 font-sans text-sm text-foreground/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© Konstantino Pizza &amp; Wings · Dryden, ON</p>
          <Link href="/" className="hover:text-primary transition-colors">
            Back to the shop
          </Link>
        </div>
      </footer>
    </div>
  );
}

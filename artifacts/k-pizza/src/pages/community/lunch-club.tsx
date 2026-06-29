import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  Truck,
  FileText,
  Users,
  Check,
  Loader2,
} from "lucide-react";
import {
  useListLunchRotations,
  useCreatePhoneAddonRequest,
  type LunchRotation,
} from "@workspace/k-pizza-client-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const DAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export default function LunchClubPage() {
  const { data: rotations } = useListLunchRotations({ active: true });
  const list = (rotations ?? []).filter((r) => r.active);

  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground">
      <header className="px-6 md:px-12 py-6 border-b border-border flex items-center gap-4">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-sans text-secondary-foreground/60 hover:text-secondary-foreground"
        >
          <ArrowLeft size={16} /> Community Programs
        </Link>
      </header>

      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-b border-border">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl space-y-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5"
          >
            <CalendarClock size={14} /> Lunch Club · for offices, trades, schools, gov
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.02]"
          >
            Pick a weekday.<br />
            We feed your team every week.<br />
            You never plan lunch again.
          </motion.h1>
          <motion.p variants={fadeUp} className="font-sans text-secondary-foreground/85 text-lg leading-relaxed max-w-2xl">
            A standing weekly drop, sized to your crew, billed once a month. No
            more "what's everyone want today?" group chats. No more wandering to
            find food on a 30-minute break. Just hot food, on the same day, every
            week.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20 bg-background text-foreground border-b border-border">
        <div className="max-w-7xl mx-auto space-y-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
              Current rotations
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Choose a program that fits your team.
            </h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
          >
            {list.length === 0 ? (
              <p className="font-sans text-foreground/60 col-span-3">
                Rotations coming soon — get in touch and we'll build one with you.
              </p>
            ) : (
              list.map((rot) => (
                <motion.div
                  key={rot.id}
                  variants={fadeUp}
                  className="bg-secondary text-secondary-foreground p-7 flex flex-col h-full border-t-4 border-accent"
                >
                  <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
                    {DAY_LABELS[rot.dayOfWeek] ?? "Weekday"}
                  </p>
                  <h3 className="font-serif text-3xl leading-tight mb-3">
                    {rot.name}
                  </h3>
                  {rot.blurb && (
                    <p className="font-sans text-sm text-secondary-foreground/70 leading-relaxed mb-6 flex-1">
                      {rot.blurb}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-secondary-foreground/10 space-y-1">
                    <p className="font-serif text-2xl leading-none">
                      {rot.perHead || "Per-head pricing"}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-widest text-secondary-foreground/60">
                      Min {rot.minHeadcount} heads
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-16 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-5">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
            {[
              { icon: CalendarClock, title: "Pick your day", body: "Monday, Wednesday, whatever fits your week." },
              { icon: ClipboardList, title: "Pick your rotation", body: "Choose one of our sample programs — or design your own." },
              { icon: Truck, title: "We deliver weekly", body: "Hot food, same day, every week. You forget about lunch." },
              { icon: FileText, title: "One monthly invoice", body: "No per-order math. One bill at the end of the month." },
            ].map((step, i) => (
              <div key={i} className="bg-secondary-foreground/5 border border-secondary-foreground/10 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-accent text-foreground w-7 h-7 inline-flex items-center justify-center font-serif text-sm">
                    {i + 1}
                  </span>
                  <step.icon size={18} className="text-accent" />
                </div>
                <h4 className="font-serif text-xl leading-tight mb-1.5">
                  {step.title}
                </h4>
                <p className="font-sans text-sm text-secondary-foreground/75 leading-snug">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-16 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Get your crew on the roster
            </p>
            <h3 className="font-serif text-3xl md:text-4xl leading-tight">
              Set it up once. Jamie handles the rest.
            </h3>
            <p className="font-sans text-secondary-foreground/80 leading-relaxed">
              Tell us a bit about your team — preferred day, headcount, and which
              rotation looks right. Jamie or the partner will call within a
              business day to lock in your first drop date.
            </p>
            <ul className="text-sm font-sans space-y-2 text-secondary-foreground/75 pt-2">
              <li className="flex gap-2">
                <Users size={14} className="text-accent mt-1 shrink-0" /> Works
                for offices, trades shops, schools, and gov departments.
              </li>
              <li className="flex gap-2">
                <Check size={14} className="text-accent mt-1 shrink-0" /> Pause
                or swap weeks any time — just give a day's notice.
              </li>
              <li className="flex gap-2">
                <Check size={14} className="text-accent mt-1 shrink-0" /> Custom
                rotations welcome if the samples don't fit.
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-background text-foreground p-7 md:p-8 shadow-xl">
              <LunchClubRequestForm rotations={list} />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t border-border py-10 px-6 font-sans text-sm text-foreground/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© Konstantino Pizza &amp; Wings · Dryden, ON</p>
          <div className="flex gap-6">
            <Link href="/community" className="hover:text-primary transition-colors">
              All Community Programs
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Back to the shop
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LunchClubRequestForm({ rotations }: { rotations: LunchRotation[] }) {
  const [business, setBusiness] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [headcount, setHeadcount] = React.useState("");
  const [day, setDay] = React.useState("");
  const [rotation, setRotation] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const create = useCreatePhoneAddonRequest({
    mutation: {
      onSuccess: () => {
        setDone(true);
        setBusiness("");
        setContact("");
        setHeadcount("");
        setDay("");
        setRotation("");
        setStartDate("");
        setHp("");
      },
      onError: () =>
        setErr("Couldn't send that — try again or call the shop directly."),
    },
  });

  if (done) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Check size={20} />
          <p className="font-serif text-2xl leading-tight">You're on the list.</p>
        </div>
        <p className="font-sans text-sm text-foreground/75">
          Jamie or the partner will reach out within a business day to lock in
          your first drop date and confirm the headcount.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="text-xs font-sans underline text-foreground/60 hover:text-foreground"
        >
          Sign up another team
        </button>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmedContact = contact.trim();
    const trimmedBusiness = business.trim();
    if (!trimmedContact) {
      setErr("Add a phone or email so we can confirm your standing order.");
      return;
    }
    if (!trimmedBusiness) {
      setErr("Add your business or team name so we know who to deliver to.");
      return;
    }
    const noteParts: string[] = [];
    if (headcount.trim()) noteParts.push(`Headcount: ${headcount.trim()}`);
    if (day) noteParts.push(`Preferred day: ${day}`);
    if (rotation) noteParts.push(`Rotation: ${rotation}`);
    if (startDate) noteParts.push(`Start date: ${startDate}`);
    create.mutate({
      data: {
        kind: "lunch_club",
        name: trimmedBusiness,
        contact: trimmedContact,
        note: noteParts.join("\n"),
        website: hp,
      } as never,
    });
  };

  const inputCls =
    "bg-muted/40 border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary w-full";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">
            Business / team name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dryden Mill — shift A"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">
            Contact (phone or email)
          </label>
          <input
            type="text"
            required
            placeholder="555-555-5555 or you@work.com"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">
            Headcount
          </label>
          <input
            type="number"
            min={1}
            placeholder="12"
            value={headcount}
            onChange={(e) => setHeadcount(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">
            Preferred day
          </label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={inputCls}
          >
            <option value="">Pick a day</option>
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <option key={d} value={DAY_LABELS[d]}>
                {DAY_LABELS[d]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">
            Rotation
          </label>
          <select
            value={rotation}
            onChange={(e) => setRotation(e.target.value)}
            className={inputCls}
          >
            <option value="">Pick a rotation</option>
            {rotations.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
            <option value="Custom — let's design one">
              Custom — let's design one
            </option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">
          Start date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputCls + " max-w-xs"}
        />
      </div>
      {err && (
        <p className="text-xs font-sans text-destructive">{err}</p>
      )}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full bg-primary text-white font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {create.isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : null}
        {create.isPending ? "Sending…" : "Set up our standing order"}
      </button>
    </form>
  );
}

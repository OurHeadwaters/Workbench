import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Clock,
  Truck,
  HardHat,
  Building2,
  Landmark,
  GraduationCap,
  Sprout,
  Hotel,
  Check,
  Loader2,
} from "lucide-react";
import {
  useGetSettings,
  useCreatePhoneAddonRequest,
} from "@workspace/k-pizza-client-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function FeedYourTeamPage() {
  const { data: settings } = useGetSettings();
  const phoneDigits = (settings?.phone ?? "8072150101").replace(/\D/g, "");
  const phoneDisplay = settings?.phone ?? "(807) 215-0101";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 md:px-12 py-6 border-b border-border flex items-center gap-4">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> Community Programs
        </Link>
      </header>

      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-b border-border">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end"
        >
          <div className="lg:col-span-8 space-y-5">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5"
            >
              <Users size={14} /> Feed Your Team · Catering &amp; Group Orders
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.02]"
            >
              A block from your office.<br />
              One call feeds the crew.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="font-sans text-foreground/80 text-lg leading-relaxed max-w-2xl"
            >
              We're a short walk down the block from most of downtown Dryden. No
              rep, no contract, no minimum hassle. Pick a package, send the
              headcount, we deliver hot. Same quality you'd get at the counter —
              just enough of it to feed everyone at once.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <div className="border border-border bg-background p-5 space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="text-primary mt-0.5 shrink-0" size={20} />
                <div>
                  <p className="font-serif text-lg leading-tight">
                    Order by 10am
                  </p>
                  <p className="font-sans text-sm text-foreground/70 leading-snug">
                    for same-day lunch. Bigger jobs, give us a day's notice and
                    we'll set up around it.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-border pt-3">
                <Truck className="text-primary mt-0.5 shrink-0" size={20} />
                <div>
                  <p className="font-serif text-lg leading-tight">
                    Free downtown delivery
                  </p>
                  <p className="font-sans text-sm text-foreground/70 leading-snug">
                    Inside the downtown core, we drop it off ourselves. Outside
                    the core, we'll quote the run.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-10 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
            Built for
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 font-sans text-sm">
            {[
              { icon: HardHat, label: "Contractors & trades" },
              { icon: Building2, label: "Offices & boardrooms" },
              { icon: Landmark, label: "Government" },
              { icon: GraduationCap, label: "Schools & teachers" },
              { icon: Sprout, label: "Indigenous organizations" },
              { icon: Hotel, label: "Hotels" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-foreground/80">
                <Icon size={18} className="text-primary shrink-0" />
                <span className="leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(settings?.cateringPackages ?? []).length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 py-16 border-b border-border">
          <div className="max-w-7xl mx-auto space-y-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Packages
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                Pick a size and send the headcount.
              </h2>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {(settings?.cateringPackages ?? []).map((pkg, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="border border-border bg-background p-7 flex flex-col"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    Package {i + 1}
                  </p>
                  <h3 className="font-serif text-3xl leading-tight">
                    {pkg.name}
                  </h3>
                  <p className="font-sans text-sm font-bold uppercase tracking-widest text-foreground/60 mt-2">
                    {pkg.headcount}
                  </p>
                  <p className="font-serif text-4xl text-foreground mt-4">
                    {pkg.price}
                  </p>
                  <p className="font-sans text-sm text-foreground/75 leading-relaxed mt-4 flex-1">
                    {pkg.blurb}
                  </p>
                  <a
                    href="#catering-quote"
                    className="mt-6 inline-block text-sm font-sans uppercase tracking-widest font-bold text-primary border-b-2 border-primary pb-1 hover:text-secondary transition-colors self-start"
                  >
                    Request this →
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section
        id="catering-quote"
        className="px-6 md:px-12 lg:px-24 py-16 bg-muted/30 border-b border-border"
      >
        <div className="max-w-7xl mx-auto border border-border bg-background p-7 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Request a quote
            </p>
            <h3 className="font-serif text-3xl md:text-4xl leading-tight">
              Tell us who, when, and how many.
            </h3>
            <p className="font-sans text-foreground/75 leading-relaxed">
              Lands in Jamie's inbox. He'll text or email back within the same
              day with a price and a confirmation. No deposit, no platform —
              just food.
            </p>
            <p className="font-sans text-sm text-foreground/60">
              Last-minute? Call{" "}
              <a className="underline" href={`tel:${phoneDigits}`}>
                {phoneDisplay}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-7">
            <CateringQuoteForm />
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

function CateringQuoteForm() {
  const [name, setName] = React.useState("");
  const [business, setBusiness] = React.useState("");
  const [headcount, setHeadcount] = React.useState("");
  const [date, setDate] = React.useState("");
  const [dietary, setDietary] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [pkg, setPkg] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const create = useCreatePhoneAddonRequest({
    mutation: {
      onSuccess: () => {
        setDone(true);
        setName("");
        setBusiness("");
        setHeadcount("");
        setDate("");
        setDietary("");
        setContact("");
        setPkg("");
        setHp("");
      },
      onError: () => setErr("Couldn't send that — try again or call the shop."),
    },
  });

  if (done) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Check size={18} />
          <p className="font-serif text-xl leading-tight">Got it.</p>
        </div>
        <p className="font-sans text-sm text-foreground/75">
          Jamie will reach out within the same day with a confirmed price and
          time. If it's urgent, call the shop and ask for catering.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="text-xs font-sans underline text-foreground/60 hover:text-foreground"
        >
          Send another
        </button>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmedContact = contact.trim();
    if (!trimmedContact) {
      setErr("Add a phone or email so Jamie can get back to you.");
      return;
    }
    if (!headcount.trim()) {
      setErr("Tell us roughly how many people you're feeding.");
      return;
    }
    const noteLines = [
      business.trim() && `Business / org: ${business.trim()}`,
      `Headcount: ${headcount.trim()}`,
      date.trim() && `Needed by: ${date.trim()}`,
      pkg.trim() && `Package of interest: ${pkg.trim()}`,
      dietary.trim() && `Dietary notes: ${dietary.trim()}`,
    ].filter(Boolean);
    create.mutate({
      data: {
        kind: "catering",
        name: name.trim(),
        contact: trimmedContact,
        note: noteLines.join("\n"),
        website: hp,
      } as never,
    });
  };

  const inputCls =
    "w-full bg-muted/40 border border-border px-3 py-2.5 text-sm font-sans text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
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
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
        <input
          type="text"
          placeholder="Business / organization"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          placeholder="Headcount (e.g. 25)"
          value={headcount}
          onChange={(e) => setHeadcount(e.target.value)}
          className={inputCls}
        />
        <input
          type="date"
          placeholder="Date needed"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputCls}
        />
      </div>
      <input
        type="text"
        required
        placeholder="Phone or email so we can confirm"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className={inputCls}
      />
      <select
        value={pkg}
        onChange={(e) => setPkg(e.target.value)}
        className={inputCls}
      >
        <option value="">Package of interest (optional)</option>
        <option value="Crew Lunch">Crew Lunch (10–15)</option>
        <option value="Office Spread">Office Spread (20–30)</option>
        <option value="Big Job">Big Job (40+)</option>
        <option value="Not sure — recommend something">
          Not sure — recommend something
        </option>
      </select>
      <textarea
        rows={3}
        placeholder="Dietary notes, delivery address, or anything else (optional)"
        value={dietary}
        onChange={(e) => setDietary(e.target.value)}
        className={`${inputCls} resize-none`}
      />
      {err && (
        <p className="text-xs font-sans text-primary font-bold">{err}</p>
      )}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full bg-primary text-white font-sans text-sm font-bold uppercase tracking-widest px-4 py-3.5 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {create.isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : null}
        {create.isPending ? "Sending…" : "Request a quote"}
      </button>
      <p className="text-xs font-sans text-foreground/55 leading-snug">
        We'll never share this. Goes straight to the shop inbox.
      </p>
    </form>
  );
}

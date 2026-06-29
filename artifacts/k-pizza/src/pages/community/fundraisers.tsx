import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Megaphone,
  HeartHandshake,
  Check,
  Loader2,
} from "lucide-react";
import { useCreatePhoneAddonRequest } from "@workspace/k-pizza-client-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function FundraisersPage() {
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

      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-foreground text-background border-b border-border">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-5xl mx-auto space-y-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5"
          >
            <Megaphone size={14} /> Community Fundraisers
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.02]"
          >
            Raise money for your group.<br />
            We do the baking.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-sans text-background/80 text-lg leading-relaxed max-w-3xl"
          >
            Two fundraiser programs out of the same kitchen: a community pizza
            drive for teams and groups who want to keep the margin, and a cooked
            slice sponsorship that puts hot food in front of neighbours who need
            it.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-foreground text-background border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="lg:col-span-6 space-y-6"
          >
            <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
              <Megaphone size={14} /> Community Pizza Drive
            </span>
            <h2 className="text-4xl md:text-5xl font-serif leading-[1.05]">
              Wholesale pies. Your group keeps the spread.
            </h2>
            <div className="space-y-4 font-sans text-base text-background/80 leading-relaxed">
              <p>
                Schools, hockey teams, scouts, church groups, grad classes —
                collect pre-orders for a date, we bake them all in one run at
                wholesale, and your group keeps the margin as the fundraiser.
              </p>
              <p>
                No upfront cost to the group. We'll send a one-pager you can
                hand to parents with sizes, toppings, pickup time, and a payment
                link.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="border border-background/15 p-4 text-center">
                <div className="text-2xl font-serif text-accent mb-1">25+</div>
                <p className="text-xs font-sans text-background/70 leading-tight">
                  pies minimum per drive
                </p>
              </div>
              <div className="border border-background/15 p-4 text-center">
                <div className="text-2xl font-serif text-accent mb-1">~$5</div>
                <p className="text-xs font-sans text-background/70 leading-tight">
                  margin per pie to your group
                </p>
              </div>
              <div className="border border-background/15 p-4 text-center">
                <div className="text-2xl font-serif text-accent mb-1">1 wk</div>
                <p className="text-xs font-sans text-background/70 leading-tight">
                  heads-up to lock the bake
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="lg:col-span-6"
          >
            <div className="bg-background/5 border border-background/20 p-6 md:p-8">
              <DriveLeadForm />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-accent/10 border-t-4 border-accent border-b border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-5">
              <HeartHandshake size={14} /> Give-Back · Cooked Slice Program
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05] mb-5">
              A hot slice for a neighbour who needs one.
            </h2>
            <p className="font-sans text-foreground/80 text-lg leading-relaxed">
              Run in partnership with Community Living Dryden. Sponsors fund a
              tab of cooked slices; CLD distributes them to folks they support.
              Slices are billed at our cost — no markup, no margin — and we
              handle the paperwork so sponsors get the ~25% tax recovery (CRA
              charitable receipt + provincial credit) on every dollar.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="lg:col-span-7 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    n: "1",
                    title: "Sponsor a tab",
                    body: "A business or family loads $50, $200, or $1,000 against the slice tab.",
                  },
                  {
                    n: "2",
                    title: "CLD pulls slices",
                    body: "Community Living Dryden hands out tokens to the folks they support, redeemed at the counter.",
                  },
                  {
                    n: "3",
                    title: "Receipt back",
                    body: "Sponsor gets a charitable receipt from CLD — typically ~25% back via federal + Ontario tax credit.",
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="bg-background border border-accent/40 p-5"
                  >
                    <div className="text-3xl font-serif text-accent mb-2">
                      {step.n}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">
                      {step.title}
                    </p>
                    <p className="font-sans text-sm text-foreground/75 leading-snug">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-background border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  The honest math
                </p>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                  Slices are charged at food + labour cost. The software
                  handling the tab, the tokens, and the dashboard for CLD is
                  free — it sits on the same stack as the rest of this site.
                  The shop covers its costs, the sponsor gets the receipt, the
                  neighbour gets a hot meal. Nobody markets it as charity from
                  the shop.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="lg:col-span-5"
            >
              <div className="bg-background border-2 border-accent p-6 md:p-8">
                <SliceProgramLeadForm />
              </div>
            </motion.div>
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

function DriveLeadForm() {
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [groupName, setGroupName] = React.useState("");
  const [driveDate, setDriveDate] = React.useState("");
  const [pieCount, setPieCount] = React.useState("");
  const [note, setNote] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const create = useCreatePhoneAddonRequest({
    mutation: {
      onSuccess: () => {
        setDone(true);
        setName("");
        setContact("");
        setGroupName("");
        setDriveDate("");
        setPieCount("");
        setNote("");
        setHp("");
      },
      onError: () =>
        setErr("Couldn't send that — try again or text the shop directly."),
    },
  });

  if (done) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-accent">
          <Check size={18} />
          <p className="font-serif text-lg leading-tight">We got it.</p>
        </div>
        <p className="font-sans text-sm text-background/85">
          Jamie will reach out within a day with the drive one-pager and a date
          hold.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="text-xs font-sans underline text-background/60 hover:text-background"
        >
          Send another
        </button>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!contact.trim()) {
      setErr("Add a phone or email so we can get back to you.");
      return;
    }
    if (!groupName.trim()) {
      setErr("Group or cause name is required.");
      return;
    }
    if (!driveDate) {
      setErr("Target drive date is required.");
      return;
    }
    if (!pieCount.trim()) {
      setErr("Approximate pie count is required.");
      return;
    }
    const structured = [
      `Group / cause: ${groupName.trim()}`,
      `Target date: ${driveDate}`,
      `Approx pies: ${pieCount.trim()}`,
    ].join("\n");
    const fullNote = [
      `[community_drive]\n${structured}`,
      note.trim() && `Notes:\n${note.trim()}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    create.mutate({
      data: {
        kind: "community_drive",
        name: name.trim(),
        contact: contact.trim(),
        note: fullNote,
        website: hp,
      } as never,
    });
  };

  const inputCls =
    "bg-background/10 border border-background/20 px-3 py-2 text-sm font-sans text-background placeholder:text-background/40 focus:outline-none focus:border-accent w-full";
  const labelCls = "text-xs font-sans text-background/70 mb-1 block";

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
      <div>
        <p className="text-xs uppercase tracking-widest font-bold mb-2 text-accent">
          Pitch a drive
        </p>
        <p className="font-sans text-xs leading-snug text-background/75">
          Tell us your group, target pies, and the date you're aiming at. We'll
          send the one-pager.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
        <input
          type="text"
          required
          placeholder="Phone or email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Group or cause *</label>
        <input
          type="text"
          required
          placeholder="e.g. DHS hockey team, food bank, scout troop"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Target drive date *</label>
          <input
            type="date"
            required
            value={driveDate}
            onChange={(e) => setDriveDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Approx. pies *</label>
          <input
            type="number"
            min={1}
            required
            placeholder="e.g. 60"
            value={pieCount}
            onChange={(e) => setPieCount(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <textarea
        rows={3}
        placeholder="Group name, target date, rough pie count, anything else"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className={`${inputCls} resize-none`}
      />
      {err && (
        <p className="text-xs font-sans text-accent">{err}</p>
      )}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full bg-accent text-foreground font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {create.isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : null}
        {create.isPending ? "Sending…" : "Pitch the drive"}
      </button>
    </form>
  );
}

function SliceProgramLeadForm() {
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [note, setNote] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const create = useCreatePhoneAddonRequest({
    mutation: {
      onSuccess: () => {
        setDone(true);
        setName("");
        setContact("");
        setNote("");
        setHp("");
      },
      onError: () =>
        setErr("Couldn't send that — try again or text the shop directly."),
    },
  });

  if (done) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Check size={18} />
          <p className="font-serif text-lg leading-tight">We got it.</p>
        </div>
        <p className="font-sans text-sm text-foreground/80">
          Jamie or the CLD partner will reach out within a day to set up the
          tab and receipt flow.
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
    if (!contact.trim()) {
      setErr("Add a phone or email so we can get back to you.");
      return;
    }
    create.mutate({
      data: {
        kind: "slice_program",
        name: name.trim(),
        contact: contact.trim(),
        note: note.trim(),
        website: hp,
      } as never,
    });
  };

  const inputCls =
    "bg-foreground/5 border border-foreground/20 px-3 py-2 text-sm font-sans text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-foreground w-full";

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
      <div>
        <p className="text-xs uppercase tracking-widest font-bold mb-2 text-primary">
          Sponsor a tab or partner with CLD
        </p>
        <p className="font-sans text-xs leading-snug text-foreground/75">
          Business sponsors, individuals, and CLD staff — drop a contact and
          we'll loop you in.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
        <input
          type="text"
          required
          placeholder="Phone or email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={inputCls}
        />
      </div>
      <textarea
        rows={3}
        placeholder="Sponsor amount, business name, or how you'd like to help"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className={`${inputCls} resize-none`}
      />
      {err && (
        <p className="text-xs font-sans font-bold text-foreground">{err}</p>
      )}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full bg-foreground text-background font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-foreground/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {create.isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : null}
        {create.isPending ? "Sending…" : "Get in on the slice program"}
      </button>
    </form>
  );
}

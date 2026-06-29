import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mic, LayoutDashboard, Megaphone, AlertCircle, Leaf, Sparkles, MapPin, Smartphone, Wifi, ShieldOff, PhoneCall, Camera, ListChecks, Wrench, PackagePlus, Loader2, Check, Snowflake, HeartHandshake, UtensilsCrossed, ExternalLink, ShoppingBag, Hotel, CalendarClock, Users, Truck, FileText, ClipboardList, ArrowRight, Clock, Building2, HardHat, Landmark, GraduationCap, Sprout, ChevronDown } from "lucide-react";
import { useMarketMosaicPrograms } from "@/hooks/useMarketMosaicPrograms";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
import {
  useGetSettings,
  useListUpsells,
  useGetSpecials,
  useListCoopCrate,
  useListMenu,
  useListReviews,
  useListSnaps,
  useListLunchRotations,
  useCreatePhoneAddonRequest,
  type Review,
  type Snap,
  type LunchRotation,
  type WeeklyPromo,
} from "@workspace/k-pizza-client-react";

const DAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function formatTime(t: string): string {
  // "16:00" -> "4pm"
  if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return t;
  const [hStr, mStr] = t.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const suffix = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  return m === 0 ? `${h}${suffix}` : `${h}:${String(m).padStart(2, "0")}${suffix}`;
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: settings } = useGetSettings();
  const { data: upsells } = useListUpsells();
  const { data: specials } = useGetSpecials();
  const { data: coopCrate } = useListCoopCrate({ active: true });
  const { data: menu } = useListMenu();

  const frontCounter = (upsells ?? []).filter(u => u.pool === "front_counter");
  const upsell = frontCounter.length ? frontCounter[Math.floor(Math.random() * frontCounter.length)] : null;

  const today = new Date().getDay();
  const todaysDaily = specials?.daily.find(d => d.dayOfWeek === today && d.active);
  const seasonal = (specials?.seasonal ?? []).filter(s => s.season === settings?.currentSeason);


  const isOpen = settings?.status === "open";
  const phoneDigits = (settings?.phone ?? "8072150101").replace(/\D/g, "");
  const phoneDisplay = settings?.phone ?? "(807) 215-0101";
  const addressDisplay = settings?.address ?? "5 Earl Ave, Dryden, ON P8N 1X4";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-white">

      {/* Live shop status banner */}
      {settings && !isOpen && (
        <div className="bg-amber-500 text-amber-950 px-6 py-3 flex items-center justify-center gap-3 text-sm font-bold sticky top-0 z-50">
          <AlertCircle size={16} />
          <span className="uppercase tracking-widest">{settings.status === "closed" ? "Closed" : "Paused"}</span>
          <span className="normal-case font-medium">— {settings.statusMessage || "Check back soon."}</span>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center transition-colors duration-300 border-b text-white ${
          scrolled
            ? "bg-black/85 backdrop-blur-md border-white/10"
            : "bg-black/60 backdrop-blur-sm border-white/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <img src="/images/real/logo.jpg" alt="Konstantino Pizza & Wings" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-serif font-bold text-xl tracking-tight uppercase hidden sm:inline">{settings?.shopName?.split(" ")[0] ?? "Konstantino's"}</span>
        </div>
        <div className="hidden md:flex gap-5 font-sans text-sm font-medium tracking-wide whitespace-nowrap">
          <a href="#story" className="hover:text-accent transition-colors">Our Story</a>
          <Link href="/menu" className="hover:text-accent transition-colors">Menu</Link>
          <a href="#how-it-works" className="hover:text-accent transition-colors">How It Works</a>
          <a href="#tools" className="hover:text-accent transition-colors">Tools</a>
          <CommunityNavDropdown />
          <a href="#addons" className="hover:text-accent transition-colors">Add-ons</a>
          <Link href="/visiting-dryden" className="hover:text-accent transition-colors">Visiting Dryden?</Link>
          <a href="#location" className="hover:text-accent transition-colors">Find Us</a>
        </div>
        <Link href="/order">
          <Button disabled={!isOpen} className="bg-primary text-white hover:bg-primary/90 rounded-none font-sans uppercase tracking-wider text-xs px-6 py-5 shadow-lg">
            {isOpen ? "Order Now" : "Closed"}
          </Button>
        </Link>
      </nav>

      {/* Hero Section — split layout, figurine on the right */}
      <section className="relative min-h-[100dvh] w-full bg-black grid grid-cols-1 lg:grid-cols-12">
        {/* Left: copy panel */}
        <div className="lg:col-span-7 xl:col-span-6 2xl:col-span-5 relative bg-black flex flex-col justify-end p-8 md:p-16 lg:p-20 pb-24 pt-32 lg:pt-40 order-2 lg:order-1">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-xl"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span className="bg-primary/90 text-white border border-primary/30 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-sm">
                Made in Dryden
              </span>
            </motion.div>
            <motion.p variants={fadeUp} className="text-accent font-sans uppercase tracking-[0.2em] mb-4 text-sm font-bold">
              Dryden, Ontario · 5 Earl Ave
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif text-white leading-[0.95] tracking-tight mb-6">
              A pizza sculpted<br/>with care.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/85 font-sans text-lg md:text-xl mb-10 leading-relaxed">
              A Dryden artist sculpted Jamie tossing dough and called it <em>"another successful delivery."</em> That's the welcome the town gives a craftsman. The website should match the warmth — so we built a custom ordering window, just for you.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-start sm:items-center">
              <Link href="/order">
                <Button size="lg" disabled={!isOpen} className="bg-primary hover:bg-primary/90 text-white rounded-none text-lg px-8 py-7">
                  {isOpen ? "Try the Voice-Note Order" : "Not taking orders"}
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline" className="rounded-none text-lg px-8 py-7 bg-transparent border-white text-white hover:bg-white hover:text-foreground">See Menu</Button>
              </Link>
              <a href="#tools" className="text-white/70 hover:text-white font-sans text-sm uppercase tracking-widest font-bold border-b border-white/40 pb-1 transition-colors">
                See the working demos
              </a>
              <a href="#lunch-club" className="text-accent hover:text-white font-sans text-sm uppercase tracking-widest font-bold border-b border-accent pb-1 transition-colors">
                Managers & office admins → Lunch Club
              </a>
              <a href="#catering" className="text-accent hover:text-white font-sans text-sm uppercase tracking-widest font-bold border-b border-accent pb-1 transition-colors">
                Feeding a crew? Catering →
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: figurine image */}
        <motion.div
          style={{ y: heroY }}
          className="lg:col-span-5 xl:col-span-6 2xl:col-span-7 relative bg-black h-[60dvh] lg:h-auto order-1 lg:order-2 overflow-hidden pt-24 lg:pt-0"
        >
          <img
            src="/images/real/figurine-1.png"
            alt="A Dryden artist's hand-sculpted figurine of Jamie tossing dough"
            className="absolute inset-x-0 top-24 bottom-0 lg:inset-0 lg:top-0 w-full h-[calc(100%-6rem)] lg:h-full object-contain"
            style={{ objectPosition: "center center" }}
          />
          {/* soft fade on the left edge into the dark panel */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent hidden lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 text-white/70 text-[10px] md:text-xs font-sans tracking-wider uppercase bg-black/40 backdrop-blur-sm px-2 py-1">
            Figurine by @mikenerino · Dryden, ON
          </div>
        </motion.div>
      </section>

      {/* Local Hour promo strip — 807 Thursday drop → same-afternoon special */}
      {settings?.weeklyPromo?.enabled && <WeeklyPromoStrip promo={settings.weeklyPromo} />}

      {/* Today's special strip */}
      {(todaysDaily || seasonal.length > 0) && (
        <section className="bg-foreground text-background py-8 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {todaysDaily && (
              <div className="flex items-center gap-4">
                {todaysDaily.imageUrl && (
                  <img
                    src={todaysDaily.imageUrl}
                    alt={todaysDaily.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover ring-1 ring-background/20 shadow-md flex-shrink-0"
                  />
                )}
                <div>
                  <p className="text-accent uppercase tracking-[0.2em] font-bold text-xs mb-1">Today's Special</p>
                  <h3 className="text-2xl font-serif">{todaysDaily.name} <span className="text-background/60 text-base ml-2">{todaysDaily.price}</span></h3>
                  <p className="text-background/70 text-sm max-w-md">{todaysDaily.description}</p>
                </div>
              </div>
            )}
            {seasonal.length > 0 && (
              <div className="text-right">
                <p className="text-accent uppercase tracking-[0.2em] font-bold text-xs mb-1 capitalize">{settings?.currentSeason} Features</p>
                <h3 className="text-xl font-serif">{seasonal[0].name} <span className="text-background/60 text-base ml-2">{seasonal[0].price}</span></h3>
              </div>
            )}
          </div>
        </section>
      )}

      <section id="story" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">Made right here<br />on Earl Ave.</h2>
            <div className="space-y-6 text-foreground/80 font-sans text-lg leading-relaxed">
              <p>We're a fresh, independent pizza shop right in the heart of Dryden. No shortcuts. No pre-made frozen crusts.</p>
              <p>Our dough is hand-stretched daily. Our sauce and toppings are prepared fresh in-house.</p>
            </div>
            <img src="/images/real/storefront.jpg" alt="Konstantino Pizza & Wings storefront on Earl Ave, Dryden" className="w-full h-64 object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700" />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } } }} className="lg:col-span-7 relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/real/pizza-box.jpg" alt="Pepperoni pizza from Konstantino's, Dryden" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 left-4 md:-bottom-10 md:left-6 lg:-bottom-12 lg:-left-12 bg-white p-6 md:p-8 shadow-xl max-w-xs border border-border">
              <p className="font-serif italic text-xl md:text-2xl text-foreground">"The only pie that makes a brutal February shift at the mill bearable."</p>
              <p className="mt-4 font-sans text-sm font-bold uppercase tracking-widest text-primary">— The Local Word</p>
            </div>
          </motion.div>
        </div>
      </section>

      {upsell && isOpen && (
        <section className="bg-primary/5 py-12 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg shrink-0">
                {upsell.imageUrl && <img src={upsell.imageUrl} alt={upsell.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="text-primary font-sans uppercase tracking-[0.2em] font-bold text-xs mb-1">Try this tonight</p>
                <h3 className="text-2xl font-serif">{upsell.name}</h3>
                <p className="text-foreground/70 text-sm max-w-md">{upsell.blurb}</p>
              </div>
            </div>
            <Link href="/order">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-none uppercase tracking-widest font-bold">Add to order — {upsell.price}</Button>
            </Link>
          </div>
        </section>
      )}

      <section id="menu-preview" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <p className="text-primary font-sans uppercase tracking-[0.2em] font-bold text-sm mb-4">The Goods</p>
              <h2 className="text-5xl md:text-7xl font-serif text-foreground">Menu Highlights</h2>
            </div>
            <Link href="/menu"><Button variant="outline" className="rounded-none">See full menu →</Button></Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            {(menu?.categories ?? []).slice(0, 2).map(cat => {
              const items = (menu?.items ?? []).filter(i => i.categoryId === cat.id && i.available).slice(0, 6);
              return (
                <motion.div key={cat.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                  <h3 className="text-3xl font-serif mb-8 text-secondary border-b border-border pb-4">{cat.name}</h3>
                  <div className="space-y-8">
                    {items.map(item => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-baseline">
                        <h4 className="col-span-7 text-lg font-bold">{item.name}</h4>
                        <div className="col-span-3 border-b-2 border-dotted border-border/50 opacity-50 relative top-[-4px]" />
                        <span className="col-span-2 font-serif text-right">{item.price}</span>
                        <p className="col-span-12 text-foreground/70 text-sm -mt-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials — pulled from real Facebook reviews via /api/reviews?featured=true */}
      <ReviewsSection />

      {/* How It Works — the sales model: free baseline + pick 3 pain points + 3 features built in */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-3xl mb-14">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 mb-5">How a build like this works</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05] mb-5">
              Free site. Three features.<br/>You keep the keys.
            </h2>
            <p className="font-sans text-foreground/75 text-lg leading-relaxed">
              The software's free. Always. The pitch is simple: I read your public image — your Instagram, your Facebook, your reviews — and build you a working baseline site off what's already out there. Then you tell me the three things in your day that hurt the most, and those three become real working features on the site. Anything beyond the three is a priced add-on, and any physical service is billed at cost.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeUp} className="border border-border bg-muted/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-foreground text-background w-7 h-7 inline-flex items-center justify-center font-serif text-sm">1</span>
                <Camera className="text-primary" size={20} />
              </div>
              <h3 className="font-serif text-2xl leading-tight mb-2">Profile from your public image</h3>
              <p className="font-sans text-sm text-foreground/70 leading-snug">I pull your photos, reviews, and posts and shape them into a real site — no questionnaires, no homework. You see a working version before you commit to anything.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="border border-border bg-muted/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-foreground text-background w-7 h-7 inline-flex items-center justify-center font-serif text-sm">2</span>
                <ListChecks className="text-primary" size={20} />
              </div>
              <h3 className="font-serif text-2xl leading-tight mb-2">Pick your three pain points</h3>
              <p className="font-sans text-sm text-foreground/70 leading-snug">Phone won't stop ringing. Specials never get posted. Reviews going stale. Pick the three that bug you most — those become the features the site actually does.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="border border-border bg-muted/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-foreground text-background w-7 h-7 inline-flex items-center justify-center font-serif text-sm">3</span>
                <Wrench className="text-primary" size={20} />
              </div>
              <h3 className="font-serif text-2xl leading-tight mb-2">Three working features, built in</h3>
              <p className="font-sans text-sm text-foreground/70 leading-snug">Not mockups. Real tools that solve those three things, included in the free build. Anything beyond the three is a priced add-on — see below for the ones Konstantino's running.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section — Konstantino's three chosen features (the included build) */}
      <section id="tools" className="py-24 bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 mb-5">Konstantino's three · the included build</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">You said online ordering was coming.<br/>It's ready right now.</h2>
            <p className="font-sans text-foreground/70 max-w-2xl text-lg">
              Jamie's three pain points were the phone ringing through dinner rush, specials nobody saw, and slow stock sitting on the line. So that's what the build does. A real operating system, not a brochure — owner edits, customer orders, kitchen ships. Click into the demos. Everything you see is live.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ToolCard icon={Mic} title="Text-Chat Ordering" subtitle="Skip the phone tag" color="primary" href="/order" bullets={["No middlemen or delivery cuts", "Stop calls interrupting the kitchen", "Customers type, send, get an ETA"]} />
            <ToolCard icon={LayoutDashboard} title="Specials Engine" subtitle="Set it once. Let it run." color="accent" href="/admin/specials" bullets={["Site rotates daily specials", "Push a same-day special in 10 seconds", "No web developer needed"]} />
            <ToolCard icon={Megaphone} title="Auto-Upsells" subtitle="Front-counter picks" color="secondary" href="/admin/upsells" bullets={["Rotating carousel of featured items", "Move slow stock on autopilot", "Pitch high-margin items at checkout"]} />
          </motion.div>
        </div>
      </section>

      {/* Lunch Club — standing weekly lunch program for offices, trades, schools, gov */}
      <LunchClubSection />

      {/* Market Mosaic seasonal hook — only when Days of Summer is on */}
      {settings?.marketMosaic?.seasonEnabled && (
        <section className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-accent/15 border-t-4 border-accent">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
                <Sprout size={14} /> {settings.marketMosaic.landingBannerLabel}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05]">
                {settings.marketMosaic.daysOfSummerHeadline}
              </h2>
              <p className="font-sans text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl">
                {settings.marketMosaic.landingBannerBlurb}
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link href="/market-mosaic">
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-none font-sans uppercase tracking-wider text-sm px-6 py-6 shadow-lg">
                  Walk the market →
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Add-ons header band — two arms: goods/wholesale and community/give-back */}
      <section id="addons" className="pt-24 md:pt-32 px-6 md:px-12 lg:px-24 bg-foreground text-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-3xl pb-12 md:pb-16 border-b border-background/15">
            <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-5">
              <PackagePlus size={14} /> Priced Add-Ons · beyond the included three
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05] mb-5">
              Goods, services, and a way to give back.
            </h2>
            <p className="font-sans text-background/80 text-lg leading-relaxed mb-6">
              The software stays free. When an add-on involves a physical service or a real third-party cost — a frozen pie for the home oven, a crate of local produce, a phone line with the carrier, a slice for a neighbour — it's billed at cost. No markup, no monthly margin. Konstantino's running these right now.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-background/15">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1.5">Goods &amp; services</p>
                <p className="font-sans text-sm text-background/75 leading-snug">Frozen pies on the 807 shelf, catering pre-orders, community fundraising drives, and a dedicated front-line phone — all at cost, all owner-controlled.</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1.5">Give-back</p>
                <p className="font-sans text-sm text-background/75 leading-snug">A cooked-slice program run with Community Living Dryden. Sponsors fund slices for neighbours who need a hot meal, with grant and tax-credit paperwork handled.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 807 Food Co-op — chef-share partnership, Thursday drop, 807 app handshake */}
      <section id="coop" className="pt-16 md:pt-20 pb-24 md:pb-32 px-6 md:px-12 lg:px-24 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14"
          >
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
                <Leaf size={14} /> 807 Food Co-op · Chef Share Partnership
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05]">
                A 15-week season.<br/>One Thursday drop.<br/>Three wins.
              </h2>
              <p className="font-sans text-background/80 text-lg leading-relaxed max-w-2xl">
                One Northwestern Ontario farmer. Twenty household CSA shares (already sold and reserved for the best market picks). And ten <span className="text-accent font-semibold">specialty chef shares at $200/week</span> — one of them ours. Same Thursday run: <span className="text-accent">pizza place first, market table second</span>. The specialty stuff that wouldn't survive to round 3 at the market — asparagus, garlic scapes, the first heirloom tomatoes — lands here and becomes that week's pizza.
              </p>
              <p className="font-sans text-background/80 text-lg leading-relaxed max-w-2xl">
                The handshake: the farmer arrives Thursday at 2pm, lays out the black crates, our chef points at what they want, the farmer ticks those picks in the <span className="text-accent font-semibold">807 app</span>. Those ticks land in Jamie's screen here automatically — each one already paired with a take-it-or-leave-it special idea. Edit it, ignore it, or push it live. No meetings, no week-ahead lists nobody can promise.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-sm font-sans">
                <span className="inline-flex items-center gap-1.5 text-background/70"><MapPin size={14} /> Grown within 60 km of 5 Earl Ave</span>
                <span className="text-background/30">·</span>
                <span className="inline-flex items-center gap-1.5 text-background/70"><Sparkles size={14} /> Farmer ticks · Jamie sees · special goes live</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-accent text-foreground p-8 h-full flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Chef Share · 15-week season</p>
                  <p className="text-6xl md:text-7xl font-serif leading-none">{settings?.coopAddon.price ?? "$200"}<span className="text-2xl align-top">{settings?.coopAddon.period ?? "/wk"}</span></p>
                  <p className="font-sans mt-3 leading-snug">
                    {settings?.coopAddon.tagline ?? "Specialty chef share from the 807 Food Co-op. Thursday drop, farmer ticks each pick in the 807 app, software here meets every pick with a ready-to-go special. Take it or leave it."}
                  </p>
                </div>
                <div className="border-t border-foreground/15 pt-5">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3">How it works</p>
                  <ol className="space-y-2.5 text-sm font-sans">
                    <li className="flex gap-3"><span className="font-serif text-base leading-none">1.</span><span><span className="font-semibold">Thursday 2pm drop.</span> Farmer lays out the black crates on our counter.</span></li>
                    <li className="flex gap-3"><span className="font-serif text-base leading-none">2.</span><span>Chef points. <span className="font-semibold">Farmer ticks each pick in the 807 app.</span></span></li>
                    <li className="flex gap-3"><span className="font-serif text-base leading-none">3.</span><span>The pick lands on Jamie's screen here with a special idea attached.</span></li>
                    <li className="flex gap-3"><span className="font-serif text-base leading-none">4.</span><span><span className="font-semibold">Take it or leave it.</span> Accept, edit, or dismiss. No obligation.</span></li>
                  </ol>
                </div>
                <div className="border-t border-foreground/15 pt-5">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3">Three-way win</p>
                  <ul className="space-y-1.5 text-sm font-sans">
                    <li className="flex gap-2"><span>•</span> <span><span className="font-semibold">Farm</span> — guaranteed weekly buyer for the specialty stuff that wouldn't make round 3 at the market.</span></li>
                    <li className="flex gap-2"><span>•</span> <span><span className="font-semibold">Kitchen</span> — fresh local produce + a special idea waiting on screen.</span></li>
                    <li className="flex gap-2"><span>•</span> <span><span className="font-semibold">Market</span> — fresh remainders for the household grab bags, round 2.</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {coopCrate && coopCrate.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex items-end justify-between mb-6 border-b border-background/15 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">What came off the truck today · live demo</p>
                  <p className="font-serif text-2xl md:text-3xl mt-1">Ingredient in. Special out.</p>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <a href="/807-shop/" className="text-xs uppercase tracking-widest text-accent hover:text-background transition-colors border border-accent/40 px-3 py-1.5">Shop 807 →</a>
                  <a href="/admin/coop" className="text-xs uppercase tracking-widest text-background/60 hover:text-accent transition-colors">Owner view →</a>
                </div>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coopCrate.map((item) => (
                  <motion.div key={item.id} variants={fadeUp} className="bg-background/5 border border-background/10 p-5 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <p className="text-xs uppercase tracking-widest text-accent mb-1">{item.qty || "Fresh"}</p>
                      <p className="font-serif text-xl leading-tight">{item.name}</p>
                      {item.throughDate && <p className="text-xs text-background/50 mt-1">{item.throughDate}</p>}
                    </div>
                    <div className="col-span-1 flex justify-center text-accent">
                      <Sparkles size={18} />
                    </div>
                    <div className="col-span-7">
                      {item.suggestion ? (
                        <>
                          <p className="font-sans text-sm leading-snug text-background/90">{item.suggestion}</p>
                          {item.suggestedPrice && <p className="text-xs uppercase tracking-widest text-accent mt-1">{item.suggestedPrice}</p>}
                        </>
                      ) : (
                        <p className="font-sans text-sm text-background/40 italic">Pending suggestion…</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 807 Freezer Shelf — raw pies + frozen dough on the 807 Localline shop */}
      <FreezerShelfSection />

      {/* Front-Line Phone Plan — second add-on: $29/mo talk & text */}
      <section id="phone-plan" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
          >
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest px-3 py-1.5">
                <Smartphone size={14} /> Front-Line Phone · Add-On
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05]">
                One dedicated phone<br/>for the front line.
              </h2>
              <p className="font-sans text-foreground/80 text-lg leading-relaxed max-w-2xl">
                The text orders, the Staff Room snaps, the specials engine, the co-op crate — all of it runs in a browser. Drop it on a {settings?.phoneAddon.price ?? "$29"}{settings?.phoneAddon.period ?? "/mo"} talk-and-text line, on any old phone, and the shop has a real workstation that isn't Jamie's personal cell. Data is blocked on purpose; the shop wifi handles the rest.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="border border-border p-4">
                  <PhoneCall className="text-primary mb-2" size={20} />
                  <p className="font-serif text-base leading-snug">Same number, every order</p>
                  <p className="font-sans text-sm text-foreground/60 mt-1">Customers text one line that lives at the shop, not on a personal cell.</p>
                </div>
                <div className="border border-border p-4">
                  <ShieldOff className="text-primary mb-2" size={20} />
                  <p className="font-serif text-base leading-snug">Data blocked on purpose</p>
                  <p className="font-sans text-sm text-foreground/60 mt-1">No surprise overage. No off-task scrolling. Wifi only for the software.</p>
                </div>
                <div className="border border-border p-4">
                  <Wifi className="text-primary mb-2" size={20} />
                  <p className="font-serif text-base leading-snug">Runs on any old device</p>
                  <p className="font-sans text-sm text-foreground/60 mt-1">Bring your own — or we'll refer you to our device guy for a clean hand-me-down.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-foreground text-background p-8 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Talk &amp; Text Plan</p>
                  <p className="text-6xl md:text-7xl font-serif leading-none">{settings?.phoneAddon.price ?? "$29"}<span className="text-2xl align-top">{settings?.phoneAddon.period ?? "/mo"}</span></p>
                  <p className="font-sans mt-3 leading-snug text-background/85">
                    {settings?.phoneAddon.tagline ?? "Unlimited talk, unlimited text, data intentionally blocked. Pair it with an old phone and the front counter has a dedicated brain — separate from yours."}
                  </p>
                  <p className="font-sans mt-3 text-xs leading-snug text-background/60">
                    At-cost service: covers the carrier fee, the data-block and device setup, and the line being held under our partner's personal name. No markup on the software — that stays free.
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="border-t border-background/15 pt-4">
                    <p className="text-xs uppercase tracking-widest text-accent mb-1">Two lines on deck</p>
                    <p className="font-sans text-sm text-background/85">Available to activate today — first to confirm, first served.</p>
                  </div>
                  <ul className="text-sm font-sans space-y-1.5 text-background/80">
                    <li className="flex gap-2"><span>•</span> One number for orders, one for the kitchen</li>
                    <li className="flex gap-2"><span>•</span> Old Android or iPhone works fine</li>
                    <li className="flex gap-2"><span>•</span> Need hardware? Referral to our device guy</li>
                  </ul>
                  <PhoneAddonRequestForm />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catering Pre-Orders — light card */}
      <section id="catering-preorder" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest px-3 py-1.5">
              <UtensilsCrossed size={14} /> Catering · pre-order
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.05]">
              Feed the crew. We just need a day.
            </h2>
            <div className="space-y-4 font-sans text-base text-foreground/80 leading-relaxed">
              <p>Office lunches, hockey wind-ups, trade-show greenrooms, gov training days. Pizzas, wings, salads, and pop — pre-ordered, prepped, and ready for pickup or short-haul delivery in Dryden.</p>
              <p>Tell us the date, headcount, and pickup window. We'll send a quote with a 25% deposit to lock the slot. No markup on the food — the only add-on is what delivery actually costs.</p>
            </div>
            <div className="border border-border bg-background p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">What you get back</p>
              <ul className="font-sans text-sm text-foreground/85 space-y-1.5">
                <li className="flex gap-2"><span className="text-primary">•</span>Written quote within a day, deposit handled by e-transfer or card</li>
                <li className="flex gap-2"><span className="text-primary">•</span>Hot pickup window, or short-haul delivery at cost</li>
                <li className="flex gap-2"><span className="text-primary">•</span>One contact through the order — no phone tag</li>
              </ul>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-6">
            <div className="bg-foreground text-background p-6 md:p-8">
              <LeadForm
                kind="catering"
                theme="dark"
                eyebrow="Start a catering pre-order"
                blurb="Date, headcount, pickup window — Jamie will quote it back the same day."
                notePlaceholder="Date, headcount, pickup/delivery, anything we should know"
                submitLabel="Send the pre-order"
                doneTitle="We got it."
                doneBlurb="Jamie will reach out within a day with a quote and a deposit link."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feed Your Team — catering pitch for Dryden offices, trades, gov, schools, Indigenous orgs, hotels */}
      <section id="catering" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-muted/40 border-t border-border">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end"
          >
            <div className="lg:col-span-8 space-y-5">
              <span className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5">
                <Users size={14} /> Feed Your Team · Catering & Group Orders
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05]">
                A block from your office.<br/>One call feeds the crew.
              </h2>
              <p className="font-sans text-foreground/80 text-lg leading-relaxed max-w-2xl">
                We're a short walk down the block from most of downtown Dryden. No rep, no contract, no minimum hassle. Pick a package, send the headcount, we deliver hot. Same quality you'd get at the counter — just enough of it to feed everyone at once.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="border border-border bg-background p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="text-primary mt-0.5 shrink-0" size={20} />
                  <div>
                    <p className="font-serif text-lg leading-tight">Order by 10am</p>
                    <p className="font-sans text-sm text-foreground/70 leading-snug">for same-day lunch. Bigger jobs, give us a day's notice and we'll set up around it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-t border-border pt-3">
                  <Truck className="text-primary mt-0.5 shrink-0" size={20} />
                  <div>
                    <p className="font-serif text-lg leading-tight">Free downtown delivery</p>
                    <p className="font-sans text-sm text-foreground/70 leading-snug">Inside the downtown core, we drop it off ourselves. Outside the core, we'll quote the run.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Audience strip */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="border-y border-border py-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Built for</p>
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
          </motion.div>

          {/* Packages */}
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
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Package {i + 1}</p>
                <h3 className="font-serif text-3xl leading-tight">{pkg.name}</h3>
                <p className="font-sans text-sm font-bold uppercase tracking-widest text-foreground/60 mt-2">{pkg.headcount}</p>
                <p className="font-serif text-4xl text-foreground mt-4">{pkg.price}</p>
                <p className="font-sans text-sm text-foreground/75 leading-relaxed mt-4 flex-1">{pkg.blurb}</p>
                <a
                  href="#catering-quote"
                  className="mt-6 inline-block text-sm font-sans uppercase tracking-widest font-bold text-primary border-b-2 border-primary pb-1 hover:text-secondary transition-colors self-start"
                >
                  Request this →
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Quote form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            id="catering-quote"
            className="border border-border bg-background p-7 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Request a quote</p>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight">Tell us who, when, and how many.</h3>
              <p className="font-sans text-foreground/75 leading-relaxed">
                Lands in Jamie's inbox. He'll text or email back within the same day with a price and a confirmation. No deposit, no platform — just food.
              </p>
              <p className="font-sans text-sm text-foreground/60">
                Last-minute? Call <a className="underline" href={`tel:${phoneDigits}`}>{phoneDisplay}</a>.
              </p>
            </div>
            <div className="lg:col-span-7">
              <CateringQuoteForm />
            </div>
          </motion.div>
        </div>
      </section>

      <FreezerShelfSection />

      {/* Community Pizza Drives — dark card, wholesale fundraiser */}
      <section id="drives" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-foreground text-background border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
              <Megaphone size={14} /> Community Pizza Drive
            </span>
            <h2 className="text-4xl md:text-5xl font-serif leading-[1.05]">
              Wholesale pies. Your group keeps the spread.
            </h2>
            <div className="space-y-4 font-sans text-base text-background/80 leading-relaxed">
              <p>Schools, hockey teams, scouts, church groups, grad classes — collect pre-orders for a date, we bake them all in one run at wholesale, and your group keeps the margin as the fundraiser.</p>
              <p>No upfront cost to the group. We'll send a one-pager you can hand to parents with sizes, toppings, pickup time, and a payment link.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="border border-background/15 p-4 text-center">
                <div className="text-2xl font-serif text-accent mb-1">25+</div>
                <p className="text-xs font-sans text-background/70 leading-tight">pies minimum per drive</p>
              </div>
              <div className="border border-background/15 p-4 text-center">
                <div className="text-2xl font-serif text-accent mb-1">~$5</div>
                <p className="text-xs font-sans text-background/70 leading-tight">margin per pie to your group</p>
              </div>
              <div className="border border-background/15 p-4 text-center">
                <div className="text-2xl font-serif text-accent mb-1">1 wk</div>
                <p className="text-xs font-sans text-background/70 leading-tight">heads-up to lock the bake</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-6">
            <div className="bg-background/5 border border-background/20 p-6 md:p-8">
              <LeadForm
                kind="community_drive"
                theme="dark"
                eyebrow="Pitch a drive"
                blurb="Tell us your group, target pies, and the date you're aiming at. We'll send the one-pager."
                notePlaceholder="Group name, target date, rough pie count, anything else"
                submitLabel="Pitch the drive"
                doneTitle="We got it."
                doneBlurb="Jamie will reach out within a day with the drive one-pager and a date hold."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cooked Slice Program — give-back, Community Living Dryden */}
      <section id="slice-program" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-accent/10 border-t-4 border-accent">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-5">
              <HeartHandshake size={14} /> Give-Back · Cooked Slice Program
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05] mb-5">
              A hot slice for a neighbour who needs one.
            </h2>
            <p className="font-sans text-foreground/80 text-lg leading-relaxed">
              Run in partnership with Community Living Dryden. Sponsors fund a tab of cooked slices; CLD distributes them to folks they support. Slices are billed at our cost — no markup, no margin — and we handle the paperwork so sponsors get the ~25% tax recovery (CRA charitable receipt + provincial credit) on every dollar.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-background border border-accent/40 p-5">
                  <div className="text-3xl font-serif text-accent mb-2">1</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">Sponsor a tab</p>
                  <p className="font-sans text-sm text-foreground/75 leading-snug">A business or family loads $50, $200, or $1,000 against the slice tab.</p>
                </div>
                <div className="bg-background border border-accent/40 p-5">
                  <div className="text-3xl font-serif text-accent mb-2">2</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">CLD pulls slices</p>
                  <p className="font-sans text-sm text-foreground/75 leading-snug">Community Living Dryden hands out tokens to the folks they support, redeemed at the counter.</p>
                </div>
                <div className="bg-background border border-accent/40 p-5">
                  <div className="text-3xl font-serif text-accent mb-2">3</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">Receipt back</p>
                  <p className="font-sans text-sm text-foreground/75 leading-snug">Sponsor gets a charitable receipt from CLD — typically ~25% back via federal + Ontario tax credit.</p>
                </div>
              </div>
              <div className="bg-background border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">The honest math</p>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                  Slices are charged at food + labour cost. The software handling the tab, the tokens, and the dashboard for CLD is free — it sits on the same stack as the rest of this site. The shop covers its costs, the sponsor gets the receipt, the neighbour gets a hot meal. Nobody markets it as charity from the shop.
                </p>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-5">
              <div className="bg-background border-2 border-accent p-6 md:p-8">
                <LeadForm
                  kind="slice_program"
                  theme="light"
                  eyebrow="Sponsor a tab or partner with CLD"
                  blurb="Business sponsors, individuals, and CLD staff — drop a contact and we'll loop you in."
                  notePlaceholder="Sponsor amount, business name, or how you'd like to help"
                  submitLabel="Get in on the slice program"
                  doneTitle="We got it."
                  doneBlurb="Jamie or the CLD partner will reach out within a day to set up the tab and receipt flow."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ontario School Lunch Program — pitch CTA */}
      {settings?.schoolProgram?.enabled && (
        <section id="school-program-cta" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-foreground text-background border-t-4 border-accent">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
                <GraduationCap size={14} /> Ontario School Lunch Program · pitch
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05]">
                Hot lunches for Ontario schools — sourced from the 807, baked in Dryden.
              </h2>
              <p className="font-sans text-lg text-background/80 leading-relaxed">
                Built for coordinators, lead agencies, and principals. A weekly menu that meets Ontario Student Nutrition Program guidelines, ≥{settings?.schoolProgram?.sourcingTargetPct ?? 60}% sourced through the 807 Food Co-op, with allergen labelling, hot delivery in the Dryden / Kenora / Sioux Lookout corridor, and a printable local-sourcing report for board reporting.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="border border-background/15 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Capacity</p>
                  <p className="font-sans text-sm text-background/80 leading-snug">Up to 250 meals / day</p>
                </div>
                <div className="border border-background/15 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Sourcing</p>
                  <p className="font-sans text-sm text-background/80 leading-snug">≥{settings?.schoolProgram?.sourcingTargetPct ?? 60}% through 807 co-op</p>
                </div>
                <div className="border border-background/15 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Delivery</p>
                  <p className="font-sans text-sm text-background/80 leading-snug">Hot, 10:30–11:15 a.m.</p>
                </div>
              </div>
              <div className="pt-2">
                <Link href="/school-program">
                  <Button className="bg-accent text-foreground hover:bg-accent/90 rounded-none font-sans uppercase tracking-wider text-sm px-6 py-6 shadow-lg">
                    See the full pitch →
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:col-span-5">
              <div className="bg-background/5 border border-background/20 p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-accent">For coordinators only</p>
                <p className="font-serif text-2xl leading-tight">Not a parent-facing pitch.</p>
                <p className="font-sans text-sm text-background/80 leading-relaxed">
                  This program is built for the OSNP local lead agency, school board nutrition coordinators, and principals running the lunch line — not for families ordering individual meals. Full menu, rules engine, negotiation levers, and contact form on the pitch page.
                </p>
                <Link href="/school-program" className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-widest text-accent border-b-2 border-accent pb-0.5 hover:text-background hover:border-background transition-colors">
                  Open the coordinator pitch →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      {/* Community Love — the figurine */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="lg:col-span-5 space-y-6"
          >
            <p className="text-primary font-sans uppercase tracking-[0.2em] font-bold text-sm">Made in Dryden</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05]">
              A local artist sculpted Jamie tossing dough.
            </h2>
            <div className="space-y-4 font-sans text-lg text-foreground/80 leading-relaxed">
              <p>
                Earlier this year, a Dryden teacher who sculpts hand-painted figurines made one of Jamie — apron flour-dusted, K-cap on, dough mid-air over a Northwestern Ontario lake. Then he tagged the shop and called it <em>"another successful delivery."</em>
              </p>
              <p>
                You don't get that from a chain. You get that when the town starts treating you like one of theirs.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/dryden_konstantinos/"
                target="_blank"
                rel="noreferrer"
                className="inline-block font-sans text-sm uppercase tracking-widest font-bold text-primary border-b-2 border-primary pb-1 hover:text-secondary transition-colors"
              >
                See it on Instagram
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="lg:col-span-7 grid grid-cols-12 grid-rows-6 gap-3 md:gap-4 h-[520px] md:h-[620px]"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="col-span-7 row-span-6 overflow-hidden bg-muted shadow-xl"
            >
              <img src="/images/real/figurine-2.png" alt="Hand-sculpted figurine of Jamie tossing dough" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="col-span-5 row-span-3 overflow-hidden bg-muted shadow-lg"
            >
              <img src="/images/real/figurine-jamie.png" alt="Jamie holding the figurine of himself" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="col-span-5 row-span-3 overflow-hidden bg-muted shadow-lg"
            >
              <img src="/images/real/figurine-4.png" alt="Figurine of Jamie from behind, K-cap visible" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Staff Room snaps — uploaded live from the shop floor */}
      <SnapsGallery />

      {/* Latest from the Shop — mirrors Instagram */}
      <section id="latest" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6"
          >
            <div>
              <p className="text-primary font-sans uppercase tracking-[0.2em] font-bold text-sm mb-4">Fresh out the Oven</p>
              <h2 className="text-5xl md:text-7xl font-serif text-foreground leading-[0.95]">Latest from<br/>the shop.</h2>
            </div>
            <div className="max-w-sm">
              <p className="font-sans text-foreground/70 mb-4">
                Specials, new sauces, snow-day hours — straight from our kitchen. Updated every time we post.
              </p>
              <a
                href="https://www.instagram.com/dryden_konstantinos/"
                target="_blank"
                rel="noreferrer"
                className="inline-block font-sans text-sm uppercase tracking-widest font-bold text-primary hover:text-secondary border-b-2 border-primary pb-1 transition-colors"
              >
                Follow @dryden_konstantinos
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
          >
            {[
              { img: "/images/real/pizza-box.jpg", date: "This week", title: "Pepperoni, edge to edge", body: "Hand-stretched, baked till the crust crackles. Pulled straight off the line." },
              { img: "/images/real/figurine-jamie.png", date: "March", title: "A local sculpted Jamie", body: "A Dryden teacher hand-painted a figurine of the man at the oven. Tagged us. The town's paying attention." },
            ].map((post, i) => (
              <motion.a
                key={i}
                href="https://www.instagram.com/dryden_konstantinos/"
                target="_blank"
                rel="noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="group block bg-muted border border-border/60 overflow-hidden hover:border-primary/60 transition-colors"
              >
                <div className="aspect-square overflow-hidden bg-foreground/5">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-primary mb-2">{post.date}</p>
                  <h4 className="font-serif text-lg md:text-xl text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">{post.title}</h4>
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed">{post.body}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center font-sans text-xs uppercase tracking-widest text-foreground/40 mt-12"
          >
            Post once on Instagram — it shows up here. One system, one job.
          </motion.p>
        </div>
      </section>

      {/* Visiting Dryden — hotel guest CTA */}
      <section className="bg-accent/40 border-y border-border py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
              <Hotel size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-foreground/70 mb-1">Visiting Dryden?</p>
              <h3 className="font-serif text-xl md:text-2xl leading-tight">Staying at a hotel? You're a block away. Here's what to order.</h3>
            </div>
          </div>
          <Link href="/visiting-dryden">
            <Button className="bg-foreground text-background hover:bg-foreground/85 rounded-none font-sans uppercase tracking-widest text-xs">
              Open the visitor guide →
            </Button>
          </Link>
        </div>
      </section>

      {/* Location / CTA Footer */}
      <section id="location" className="py-32 px-6 md:px-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-5xl md:text-7xl font-serif mb-6 text-foreground">Come get it.</h2>
            <p className="text-xl font-sans text-foreground/70 mb-12 max-w-md">
              Send us a note in the chat or call ahead. We're takeout only — hot and ready when you pull up on Earl Ave.
            </p>

            <div className="space-y-10 font-sans">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Location</h4>
                <p className="text-2xl text-foreground whitespace-pre-line">{addressDisplay}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Hours</h4>
                <div className="flex flex-col gap-2 text-lg max-w-xs">
                  {[1, 2, 3, 4, 5, 6, 0].map(d => {
                    const h = settings?.hours?.[String(d) as keyof NonNullable<typeof settings>["hours"]];
                    return (
                      <div key={d} className="flex justify-between border-b border-border/50 pb-2 last:border-b-0">
                        <span className="text-foreground/70">{DAY_LABELS[d]}</span>
                        <span className="font-medium">{h?.open ? `${formatTime(h.start)} – ${formatTime(h.end)}` : "Closed"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Call in your order</h4>
                <a href={`tel:${phoneDigits}`} className="text-4xl font-serif text-foreground hover:text-accent transition-colors">
                  {phoneDisplay}
                </a>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Connect</h4>
                <div className="flex gap-6">
                  <a href="https://www.facebook.com/61581457267478/" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary transition-colors font-medium">Facebook</a>
                  <a href="https://www.instagram.com/dryden_konstantinos/" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary transition-colors font-medium">Instagram</a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-muted p-12 flex flex-col justify-center items-center text-center space-y-8 h-full min-h-[400px]"
          >
            <h3 className="text-4xl font-serif">Takeout Only</h3>
            <p className="font-sans text-foreground/70 max-w-sm">
              We focus on one thing: making great food. Send us a note or call us to place your order.
            </p>
            <Link href="/order" className="w-full sm:w-auto">
              <Button size="lg" disabled={!isOpen} className="w-full bg-primary text-white hover:bg-primary/90 rounded-none text-lg px-12 py-8 uppercase tracking-widest font-bold">
                {isOpen ? "Order Online" : "We're Closed"}
              </Button>
            </Link>
            <a href={`tel:${phoneDigits}`} className="font-sans text-sm uppercase tracking-widest font-bold text-foreground/70 hover:text-primary transition-colors">
              or call {phoneDisplay}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background/50 py-12 px-6 font-sans text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p>© {new Date().getFullYear()} Konstantino Pizza & Wings. Respect the Craft.</p>
          <div className="text-center md:text-right text-background/40">
            <p className="uppercase tracking-widest text-xs font-bold mb-1">Made in Dryden, ON</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LunchClubSection() {
  const { data: rotations } = useListLunchRotations({ active: true });
  const list = (rotations ?? []).filter((r) => r.active);
  return (
    <section id="lunch-club" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary text-secondary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-accent text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-5">
            <CalendarClock size={14} /> Lunch Club · for offices, trades, schools, gov
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05] mb-5">
            Pick a weekday.<br/>We feed your team every week.<br/>You never plan lunch again.
          </h2>
          <p className="font-sans text-secondary-foreground/85 text-lg leading-relaxed">
            A standing weekly drop, sized to your crew, billed once a month. No more "what's everyone want today?" group chats. No more wandering to find food on a 30-minute break. Just hot food, on the same day, every week.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20"
        >
          {list.length === 0 ? (
            <p className="font-sans text-secondary-foreground/60 col-span-3">Rotations coming soon — get in touch and we'll build one with you.</p>
          ) : (
            list.map((rot) => (
              <motion.div
                key={rot.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="bg-background text-foreground p-7 flex flex-col h-full border-t-4 border-accent"
              >
                <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">{DAY_LABELS[rot.dayOfWeek] ?? "Weekday"}</p>
                <h3 className="font-serif text-3xl leading-tight mb-3">{rot.name}</h3>
                {rot.blurb && (
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed mb-6 flex-1">{rot.blurb}</p>
                )}
                <div className="mt-auto pt-4 border-t border-border space-y-1">
                  <p className="font-serif text-2xl leading-none">{rot.perHead || "Per-head pricing"}</p>
                  <p className="font-sans text-xs uppercase tracking-widest text-foreground/60">Min {rot.minHeadcount} heads</p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 md:mb-20"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-5">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
            {[
              { icon: CalendarClock, title: "Pick your day", body: "Monday, Wednesday, whatever fits your week." },
              { icon: ClipboardList, title: "Pick your rotation", body: "Choose one of our sample programs — or design your own." },
              { icon: Truck, title: "We deliver weekly", body: "Hot food, same day, every week. You forget about lunch." },
              { icon: FileText, title: "One monthly invoice", body: "No per-order math. One bill at the end of the month." },
            ].map((step, i) => (
              <div key={i} className="bg-background/5 border border-background/10 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-accent text-foreground w-7 h-7 inline-flex items-center justify-center font-serif text-sm">{i + 1}</span>
                  <step.icon size={18} className="text-accent" />
                </div>
                <h4 className="font-serif text-xl leading-tight mb-1.5">{step.title}</h4>
                <p className="font-sans text-sm text-secondary-foreground/75 leading-snug">{step.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Get your crew on the roster</p>
            <h3 className="font-serif text-3xl md:text-4xl leading-tight">Set it up once. Jamie handles the rest.</h3>
            <p className="font-sans text-secondary-foreground/80 leading-relaxed">
              Tell us a bit about your team — preferred day, headcount, and which rotation looks right. Jamie or the partner will call within a business day to lock in your first drop date.
            </p>
            <ul className="text-sm font-sans space-y-2 text-secondary-foreground/75 pt-2">
              <li className="flex gap-2"><Users size={14} className="text-accent mt-1 shrink-0" /> Works for offices, trades shops, schools, and gov departments.</li>
              <li className="flex gap-2"><Check size={14} className="text-accent mt-1 shrink-0" /> Pause or swap weeks any time — just give a day's notice.</li>
              <li className="flex gap-2"><Check size={14} className="text-accent mt-1 shrink-0" /> Custom rotations welcome if the samples don't fit.</li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-background text-foreground p-7 md:p-8 shadow-xl">
              <LunchClubRequestForm rotations={list} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
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
      onError: () => setErr("Couldn't send that — try again or call the shop directly."),
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
          Jamie or the partner will reach out within a business day to lock in your first drop date and confirm the headcount.
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

  const inputCls = "bg-muted/40 border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary w-full";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">Business / team name</label>
          <input type="text" required placeholder="e.g. Dryden Mill — shift A" value={business} onChange={(e) => setBusiness(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">Contact (phone or email)</label>
          <input type="text" required placeholder="555-555-5555 or you@work.com" value={contact} onChange={(e) => setContact(e.target.value)} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">Headcount</label>
          <input type="number" min={1} placeholder="12" value={headcount} onChange={(e) => setHeadcount(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">Preferred day</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} className={inputCls}>
            <option value="">Pick a day</option>
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <option key={d} value={DAY_LABELS[d]}>{DAY_LABELS[d]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">Rotation</label>
          <select value={rotation} onChange={(e) => setRotation(e.target.value)} className={inputCls}>
            <option value="">Pick a rotation</option>
            {rotations.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
            <option value="Custom — let's design one">Custom — let's design one</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold mb-1 block">Start date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls + " max-w-xs"} />
      </div>
      {err && <p className="text-xs font-sans text-destructive">{err}</p>}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full bg-primary text-white font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {create.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
        {create.isPending ? "Sending…" : "Set up our standing order"}
      </button>
    </form>
  );
}

function SourceLabel({ source }: { source: Review["source"] }) {
  const label = source === "facebook" ? "Facebook" : source === "instagram" ? "Instagram" : source === "google" ? "Google" : "Customer";
  return <span className="text-xs uppercase tracking-widest opacity-60 font-bold">via {label}</span>;
}

const sectionStagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

function ReviewsSection() {
  const { data: reviews } = useListReviews({ featured: true });
  const list = (reviews ?? []).slice(0, 6);
  if (list.length === 0) return null;
  const gridCls = list.length === 1
    ? "grid grid-cols-1 max-w-3xl mx-auto"
    : list.length === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14";
  return (
    <section className="py-24 md:py-28 bg-primary text-primary-foreground px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 text-center"
        >
          <p className="text-accent font-sans uppercase tracking-[0.2em] font-bold text-xs mb-3">From the people of Dryden</p>
          <h2 className="text-3xl md:text-4xl font-serif">Real reviews. Pulled from Facebook.</h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionStagger}
          className={gridCls}
        >
          {list.map((r) => (
            <motion.div
              key={r.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="space-y-4 flex flex-col"
            >
              <div className="text-accent text-4xl font-serif leading-none">"</div>
              <p className="font-sans text-base md:text-lg font-medium leading-relaxed flex-1">{r.body}</p>
              <div className="pt-3 border-t border-primary-foreground/15">
                <p className="text-sm uppercase tracking-widest font-bold">
                  {r.authorName}{r.authorLocation ? <span className="opacity-70"> — {r.authorLocation}</span> : null}
                </p>
                <div className="mt-1"><SourceLabel source={r.source} /></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SnapsGallery() {
  const { data: snaps } = useListSnaps({ featured: true });
  const list = (snaps ?? []).slice(0, 12);
  if (list.length === 0) return null;
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-foreground text-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
        >
          <div>
            <p className="text-accent font-sans uppercase tracking-[0.2em] font-bold text-xs mb-3">Straight from the Staff Room</p>
            <h2 className="text-4xl md:text-6xl font-serif leading-[1.05]">Happy customers,<br/>posted live.</h2>
          </div>
          <p className="font-sans text-background/70 max-w-sm">
            Staff snaps a photo or screenshots a Facebook comment — and it lands on this page in seconds. No editor, no developer.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionStagger}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {list.map((s: Snap) => (
            <motion.figure
              key={s.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="relative aspect-square overflow-hidden bg-background/5 group"
            >
              <img src={s.imageData} alt={s.caption || "Customer snap"} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
              {s.caption ? (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 font-sans text-xs md:text-sm text-white">
                  {s.caption}
                </figcaption>
              ) : null}
              {s.kind === "review_screenshot" ? (
                <span className="absolute top-2 left-2 bg-accent text-foreground text-[10px] uppercase tracking-widest font-bold px-2 py-1">FB Review</span>
              ) : null}
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PhoneAddonRequestForm() {
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
      onError: () => setErr("Couldn't send that — try again or text the shop directly."),
    },
  });

  if (done) {
    return (
      <div className="mt-6 border-t border-background/15 pt-5 space-y-2">
        <div className="flex items-center gap-2 text-accent">
          <Check size={18} />
          <p className="font-serif text-lg leading-tight">We got it.</p>
        </div>
        <p className="font-sans text-sm text-background/75">
          Jamie or the partner will reach out within a day to walk through activating the line. No commitment.
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
    const trimmed = contact.trim();
    if (!trimmed) {
      setErr("Add a phone or email so we can get back to you.");
      return;
    }
    create.mutate({ data: { kind: "phone_addon", name: name.trim(), contact: trimmed, note: note.trim(), website: hp } as never });
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 border-t border-background/15 pt-5 space-y-3">
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
      <div>
        <p className="text-xs uppercase tracking-widest text-accent mb-2">Activate a line</p>
        <p className="font-sans text-xs text-background/65 leading-snug">
          Drop your number or email — we'll confirm whether a line is still on deck and walk through the setup. No pressure.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background/10 border border-background/20 px-3 py-2 text-sm font-sans text-background placeholder:text-background/40 focus:outline-none focus:border-accent"
        />
        <input
          type="text"
          required
          placeholder="Phone or email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="bg-background/10 border border-background/20 px-3 py-2 text-sm font-sans text-background placeholder:text-background/40 focus:outline-none focus:border-accent"
        />
      </div>
      <textarea
        rows={2}
        placeholder="Anything we should know? (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full bg-background/10 border border-background/20 px-3 py-2 text-sm font-sans text-background placeholder:text-background/40 focus:outline-none focus:border-accent resize-none"
      />
      {err && <p className="text-xs font-sans text-accent">{err}</p>}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full bg-accent text-foreground font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {create.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
        {create.isPending ? "Sending…" : "Request the line"}
      </button>
    </form>
  );
}

function safeHref(value: string | undefined | null): string | undefined {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return trimmed;
  } catch {
    // not a parseable absolute URL
  }
  return undefined;
}
function FreezerShelfSection() {
  const { data: settings } = useGetSettings();
  const fs = settings?.freezerShelf;
  if (!fs) return null;
  const headline = fs.headline?.trim() || "Raw pies from yesterday's prep. Frozen on 807's shelf.";
  const story = fs.story?.trim() || "When the day's prep runs over, those extra pies don't go to waste — they get frozen and stocked on the 807 Food Co-op's Localline shop, dual-branded Konstantino + 807. Same dough, same sauce, ready for your home oven.";
  const url = safeHref(fs.locallineUrl);
  return (
    <section id="freezer-shelf" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="space-y-5 mb-12">
          <span className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest px-3 py-1.5">
            <Snowflake size={14} /> 807 Freezer Shelf · raw pies
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05]">{headline}</h2>
          <p className="font-sans text-lg text-foreground/80 leading-relaxed">{story}</p>
          {url ? (
            <div className="pt-2">
              <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-foreground text-background font-sans text-sm font-bold uppercase tracking-widest px-5 py-3 hover:bg-foreground/90 transition-colors">
                <ShoppingBag size={14} /> Shop the shelf on Localline <ExternalLink size={12} />
              </a>
            </div>
          ) : null}
        </motion.div>
        {fs.items.length > 0 ? (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6 border-t border-border">
            {fs.items.map((item, idx) => {
              const itemHref = safeHref(item.link);
              const imgSrc = safeHref(item.imageUrl) ?? (item.imageUrl?.startsWith("/") ? item.imageUrl : undefined);
              return (
                <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-muted border border-border overflow-hidden flex flex-col">
                  {imgSrc ? (
                    <div className="aspect-[4/3] bg-background overflow-hidden">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-serif text-xl text-foreground mb-2">{item.name}</h3>
                    <p className="font-sans text-sm text-foreground/75 leading-snug flex-1">{item.blurb}</p>
                    {itemHref ? (
                      <a href={itemHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-widest text-primary border-b border-primary self-start pb-0.5 hover:text-secondary hover:border-secondary transition-colors">
                        Grab one <ExternalLink size={11} />
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : null}
      </div>
    </section>
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
          Jamie will reach out within the same day with a confirmed price and time. If it's urgent, call the shop and ask for catering.
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
        <option value="Not sure — recommend something">Not sure — recommend something</option>
      </select>
      <textarea
        rows={3}
        placeholder="Dietary notes, delivery address, or anything else (optional)"
        value={dietary}
        onChange={(e) => setDietary(e.target.value)}
        className={`${inputCls} resize-none`}
      />
      {err && <p className="text-xs font-sans text-primary font-bold">{err}</p>}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full bg-primary text-white font-sans text-sm font-bold uppercase tracking-widest px-4 py-3.5 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {create.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
        {create.isPending ? "Sending…" : "Request a quote"}
      </button>
      <p className="text-xs font-sans text-foreground/55 leading-snug">
        We'll never share this. Goes straight to the shop inbox.
      </p>
    </form>
  );
}

type LeadFormKind = "catering" | "community_drive" | "slice_program";
type LeadFormTheme = "dark" | "light";

function LeadForm({ kind, theme, eyebrow, blurb, notePlaceholder, submitLabel, doneTitle, doneBlurb }: {
  kind: LeadFormKind;
  theme: LeadFormTheme;
  eyebrow: string;
  blurb: string;
  notePlaceholder: string;
  submitLabel: string;
  doneTitle: string;
  doneBlurb: string;
}) {
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [note, setNote] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  // Catering-specific fields
  const [eventDate, setEventDate] = React.useState("");
  const [eventTime, setEventTime] = React.useState("");
  const [headCount, setHeadCount] = React.useState("");
  const [mode, setMode] = React.useState<"pickup" | "delivery">("pickup");
  const [depositAck, setDepositAck] = React.useState(false);
  // Community drive-specific fields
  const [groupName, setGroupName] = React.useState("");
  const [driveDate, setDriveDate] = React.useState("");
  const [pieCount, setPieCount] = React.useState("");

  const create = useCreatePhoneAddonRequest({
    mutation: {
      onSuccess: () => {
        setDone(true);
        setName(""); setContact(""); setNote(""); setHp("");
        setEventDate(""); setEventTime(""); setHeadCount(""); setMode("pickup"); setDepositAck(false);
        setGroupName(""); setDriveDate(""); setPieCount("");
      },
      onError: () => setErr("Couldn't send that — try again or text the shop directly."),
    },
  });

  const isDark = theme === "dark";
  const eyebrowTone = isDark ? "text-accent" : "text-primary";
  const bodyTone = isDark ? "text-background/75" : "text-foreground/75";
  const inputCls = isDark
    ? "bg-background/10 border border-background/20 px-3 py-2 text-sm font-sans text-background placeholder:text-background/40 focus:outline-none focus:border-accent"
    : "bg-foreground/5 border border-foreground/20 px-3 py-2 text-sm font-sans text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-foreground";
  const buttonCls = isDark
    ? "w-full bg-accent text-foreground font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
    : "w-full bg-foreground text-background font-sans text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-foreground/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2";
  const errCls = isDark ? "text-xs font-sans text-accent" : "text-xs font-sans font-bold text-foreground";

  if (done) {
    return (
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${isDark ? "text-accent" : "text-primary"}`}>
          <Check size={18} />
          <p className="font-serif text-lg leading-tight">{doneTitle}</p>
        </div>
        <p className={`font-sans text-sm ${bodyTone}`}>{doneBlurb}</p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className={`text-xs font-sans underline ${isDark ? "text-background/60 hover:text-background" : "text-foreground/60 hover:text-foreground"}`}
        >
          Send another
        </button>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = contact.trim();
    if (!trimmed) {
      setErr("Add a phone or email so we can get back to you.");
      return;
    }
    const structured: string[] = [];
    if (kind === "catering") {
      if (!eventDate) { setErr("Event date is required for catering pre-orders."); return; }
      if (!headCount.trim()) { setErr("Headcount is required for catering pre-orders."); return; }
      if (!depositAck) { setErr("Please acknowledge the 25% deposit to lock the slot."); return; }
      structured.push(`Event date: ${eventDate}`);
      if (eventTime) structured.push(`Pickup window: ${eventTime}`);
      structured.push(`Headcount: ${headCount.trim()}`);
      structured.push(`Mode: ${mode}`);
      structured.push(`Deposit acknowledged: yes (25%)`);
    } else if (kind === "community_drive") {
      if (!groupName.trim()) { setErr("Group or cause name is required."); return; }
      if (!driveDate) { setErr("Target drive date is required."); return; }
      if (!pieCount.trim()) { setErr("Approximate pie count is required."); return; }
      structured.push(`Group / cause: ${groupName.trim()}`);
      structured.push(`Target date: ${driveDate}`);
      structured.push(`Approx pies: ${pieCount.trim()}`);
    }
    const block = structured.length ? `[${kind}]\n${structured.join("\n")}` : "";
    const trimmedNote = note.trim();
    const fullNote = [block, trimmedNote && `Notes:\n${trimmedNote}`].filter(Boolean).join("\n\n");
    create.mutate({ data: { kind, name: name.trim(), contact: trimmed, note: fullNote, website: hp } as never });
  };

  const labelCls = isDark ? "text-xs font-sans text-background/70 mb-1 block" : "text-xs font-sans text-foreground/70 mb-1 block";
  const checkboxCls = isDark ? "accent-accent" : "accent-foreground";
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>
      <div>
        <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${eyebrowTone}`}>{eyebrow}</p>
        <p className={`font-sans text-xs leading-snug ${bodyTone}`}>{blurb}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        <input type="text" required placeholder="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} className={inputCls} />
      </div>
      {kind === "catering" ? (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Event date *</label>
              <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
            <div>
              <label className={labelCls}>Pickup / start time</label>
              <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Headcount *</label>
              <input type="number" min={1} required placeholder="e.g. 40" value={headCount} onChange={(e) => setHeadCount(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
            <div>
              <label className={labelCls}>Pickup or delivery</label>
              <select value={mode} onChange={(e) => setMode(e.target.value as "pickup" | "delivery")} className={`w-full ${inputCls}`}>
                <option value="pickup">Pickup at shop</option>
                <option value="delivery">Delivery (Dryden + 30 km)</option>
              </select>
            </div>
          </div>
          <label className={`flex items-start gap-2 text-xs font-sans leading-snug ${bodyTone}`}>
            <input type="checkbox" checked={depositAck} onChange={(e) => setDepositAck(e.target.checked)} className={`${checkboxCls} mt-0.5`} />
            <span>I understand a 25% deposit locks the slot and the balance is due on pickup or delivery.</span>
          </label>
        </div>
      ) : null}

      {kind === "community_drive" ? (
        <div className="space-y-2 pt-1">
          <div>
            <label className={labelCls}>Group or cause *</label>
            <input type="text" required placeholder="e.g. DHS hockey team, food bank, scout troop" value={groupName} onChange={(e) => setGroupName(e.target.value)} className={`w-full ${inputCls}`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Target drive date *</label>
              <input type="date" required value={driveDate} onChange={(e) => setDriveDate(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
            <div>
              <label className={labelCls}>Approx. pies *</label>
              <input type="number" min={1} required placeholder="e.g. 60" value={pieCount} onChange={(e) => setPieCount(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
          </div>
        </div>
      ) : null}
      <textarea rows={3} placeholder={notePlaceholder} value={note} onChange={(e) => setNote(e.target.value)} className={`w-full resize-none ${inputCls}`} />
      {err && <p className={errCls}>{err}</p>}
      <button type="submit" disabled={create.isPending} className={buttonCls}>
        {create.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
        {create.isPending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function WeeklyPromoStrip({ promo }: { promo: WeeklyPromo }) {
  const cta = promo.ctaHref || "#location";
  const isInternal = cta.startsWith("/") && !cta.startsWith("//");
  const isHash = cta.startsWith("#");

  const ctaButton = (
    <Button className="bg-white text-primary hover:bg-white/90 rounded-none uppercase tracking-widest font-bold text-xs px-6 py-5">
      {promo.ctaLabel || "Walk in"} <ArrowRight size={14} className="ml-2" />
    </Button>
  );

  return (
    <section className="bg-primary text-white border-b-4 border-accent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex items-start gap-4 md:gap-5 flex-1">
            <div className="hidden sm:flex w-12 h-12 rounded-full bg-white/15 items-center justify-center shrink-0 mt-1">
              <Sparkles size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-white/80 font-bold">
                This Week at Konstantino's
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">{promo.name}</h2>
              <p className="font-sans text-sm md:text-base text-white/90 max-w-xl">{promo.hook}</p>
              <p className="text-[11px] md:text-xs uppercase tracking-widest font-bold text-white/85 pt-1">
                {promo.timeWindow}
              </p>
            </div>
          </div>
          <div className="md:ml-auto md:text-right shrink-0">
            {isInternal ? (
              <Link href={cta}>{ctaButton}</Link>
            ) : isHash ? (
              <a href={cta}>{ctaButton}</a>
            ) : (
              <a href={cta} target="_blank" rel="noreferrer">{ctaButton}</a>
            )}
          </div>
        </div>
        {promo.remindOptIn && (
          <div className="mt-6 pt-5 border-t border-white/15">
            <PromoRemindForm />
          </div>
        )}
      </div>
    </section>
  );
}

function PromoRemindForm() {
  const create = useCreatePhoneAddonRequest();
  const [email, setEmail] = React.useState("");
  const [hp, setHp] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (create.isSuccess) setDone(true);
  }, [create.isSuccess]);

  if (done) {
    return (
      <div className="flex items-center gap-3 text-white/95 text-sm font-sans">
        <Check size={18} className="text-accent" />
        <p>Got it — we'll send you a heads-up before the next one drops.</p>
        <button
          type="button"
          onClick={() => { setDone(false); setEmail(""); }}
          className="ml-auto text-xs underline text-white/70 hover:text-white"
        >
          Add another
        </button>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = email.trim();
    if (!trimmed || !/^.+@.+\..+$/.test(trimmed)) {
      setErr("Drop a valid email so we can ping you.");
      return;
    }
    create.mutate({ data: { kind: "weekly_promo", contact: trimmed, name: "", note: "", website: hp } as never });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-widest font-bold text-white/80 mb-1">Want a heads-up next week?</p>
        <p className="text-xs font-sans text-white/70">Drop your email. Jamie sends the reminder by hand — no spam, no list rentals.</p>
      </div>
      <div className="flex gap-2 sm:w-auto w-full">
        <input
          type="email"
          required
          placeholder="you@dryden.ca"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 sm:w-64 bg-white/10 border border-white/25 px-3 py-2.5 text-sm font-sans text-white placeholder:text-white/50 focus:outline-none focus:border-white"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="bg-white text-primary font-sans text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
        >
          {create.isPending && <Loader2 size={14} className="animate-spin" />}
          Remind me
        </button>
      </div>
      {err && <p className="text-xs font-sans font-bold text-accent sm:ml-auto">{err}</p>}
    </form>
  );
}

function CommunityNavDropdown() {
  const { programs } = useMarketMosaicPrograms();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 hover:text-accent transition-colors focus:outline-none"
      >
        Community Programs
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/10 shadow-xl z-50 py-1">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={program.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-accent hover:bg-white/5 transition-colors font-sans font-medium"
            >
              {program.name}
            </Link>
          ))}
          <div className="border-t border-white/10 mt-1 pt-1">
            <Link
              href="/community"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-xs text-white/50 hover:text-accent hover:bg-white/5 transition-colors font-sans uppercase tracking-widest font-bold"
            >
              All Programs →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ icon: Icon, title, subtitle, bullets, href, color }: { icon: typeof Mic; title: string; subtitle: string; bullets: string[]; href: string; color: "primary" | "accent" | "secondary" }) {
  const cls = {
    primary: { bg: "bg-primary/10 text-primary", btn: "group-hover:bg-primary group-hover:text-white", dot: "text-primary" },
    accent: { bg: "bg-accent/20 text-accent", btn: "group-hover:bg-accent group-hover:text-white group-hover:border-accent", dot: "text-accent" },
    secondary: { bg: "bg-secondary/10 text-secondary", btn: "group-hover:bg-secondary group-hover:text-white group-hover:border-secondary", dot: "text-secondary" },
  }[color];
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="bg-background border border-border p-8 hover:border-primary/50 transition-colors flex flex-col h-full group">
      <div className={`w-12 h-12 ${cls.bg} flex items-center justify-center rounded-lg mb-6 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-serif mb-2">{title}</h3>
      <p className={`font-sans text-sm font-bold uppercase tracking-widest mb-4 ${cls.dot.replace("text-", "text-")}`}>{subtitle}</p>
      <ul className="space-y-3 font-sans text-sm text-foreground/80 mb-8 flex-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2"><span className={cls.dot}>•</span>{b}</li>
        ))}
      </ul>
      <Link href={href} className="mt-auto">
        <Button variant="outline" className={`w-full ${cls.btn} transition-colors`}>Open →</Button>
      </Link>
    </motion.div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Leaf,
  Flame,
  Gift,
  ArrowRight,
  Clock,
  Heart,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import imgSoapBars from "@assets/IMG_1987_1779536548041.png";
import imgSoapShelf from "@assets/IMG_1981_1779536548041.png";
import imgCandles from "@assets/IMG_1980_1779536548041.png";
import imgGlowBed from "@assets/IMG_1985_1779536548042.png";
import imgFacialTreatment from "@assets/facial_treatment.png";
import imgLaundry from "@assets/IMG_1979_1779536548042.png";
import imgStore from "@assets/IMG_1988_1779536548041.png";

import igImg1 from "@assets/IMG_1995_1779538732179.png";
import igImg2 from "@assets/IMG_1993_1779538732180.png";
import igImg3 from "@assets/IMG_1992_1779538732180.png";
import igImg4 from "@assets/IMG_1994_1779538732180.png";
import igImg5 from "@assets/IMG_1982_1779536548041.png";
import igImg6 from "@assets/IMG_1989_1779536548041.png";


const IG_URL = "https://www.instagram.com/hinterland_and_co";

const STATIC_IG_POSTS = [
  { img: igImg1, alt: "True North ball cap in store" },
  { img: igImg2, alt: "Cash is King sign" },
  { img: igImg3, alt: "Professional teeth whitening at Hinterland" },
  { img: igImg4, alt: "Pride Month swag rack" },
  { img: igImg5, alt: "Cold process soap bars" },
  { img: igImg6, alt: "Gift sets and accessories" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const igPosts = STATIC_IG_POSTS;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHighlighted((h) => (h + 1) % igPosts.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
  };
  const stagger = { visible: { transition: { staggerChildren: 0.09 } } };

  const products = [
    {
      img: imgSoapShelf,
      name: "Cold Process Soaps",
      desc: "Made from scratch with natural, vegan organic oils. The cold process method preserves skin-loving nutrients you don't get in mass-produced bars. Your skin notices the difference.",
      note: "Vegan · No synthetic fragrance",
    },
    {
      img: imgLaundry,
      name: "Bath Bombs",
      desc: "Drop one in and watch it work. Fizzy, moisturizing, and made with ingredients you can actually pronounce. Available in rotating seasonal scents.",
      note: "Skin-safe colourants · Kid-friendly",
    },
    {
      img: imgCandles,
      name: "Soy Candles",
      desc: "Clean-burning soy wax, hand-poured in small batches. Longer burn time than paraffin, no petroleum byproducts, and scents that actually fill a room without being overwhelming.",
      note: "Soy wax · Cotton wick · Hand-poured",
    },
    {
      img: imgStore,
      name: "Gift Sets",
      desc: "Curated sets perfect for birthdays, thank-yous, or no reason at all. Mix and match soaps, bath bombs, and candles. Local wrapping, ready to give.",
      note: "Custom orders welcome",
    },
  ];

  const values = [
    {
      label: "Cold process, always",
      body: "It takes longer than melt-and-pour but the result is a bar that's genuinely better for your skin. No shortcuts.",
    },
    {
      label: "Vegan ingredients",
      body: "No tallow, no beeswax. Every formula is plant-based — without sacrificing lather, hardness, or moisture.",
    },
    {
      label: "Small batches",
      body: "Every item is made by hand in Dryden. Not in a factory. Not outsourced. What you buy was made by the person who sold it to you.",
    },
  ];

  const glowServices = [
    { name: "Express Facial", price: "$65" },
    { name: "Teeth Whitening", price: "$125" },
    { name: "Spray Tan", price: "$65" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Leaf className="w-5 h-5 text-primary" />
            Hinterland <span className="text-muted-foreground font-normal">&amp; Co.</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollTo("products")} className="hover:text-foreground transition-colors">Products</button>
            <button onClick={() => scrollTo("glow-room")} className="hover:text-foreground transition-colors">Glow Room</button>
            <button onClick={() => scrollTo("story")} className="hover:text-foreground transition-colors">Our Story</button>
            <button onClick={() => scrollTo("find-us")} className="hover:text-foreground transition-colors">Find Us</button>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex border-2"
              onClick={() => scrollTo("find-us")}
            >
              Find Us
            </Button>
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-border bg-background"
            >
              <div className="flex flex-col px-4 py-3 gap-1">
                {[
                  { label: "Products", id: "products" },
                  { label: "Glow Room", id: "glow-room" },
                  { label: "Our Story", id: "story" },
                  { label: "Find Us", id: "find-us" },
                ].map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="text-left w-full px-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* HERO */}
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-8">
                  <Leaf className="w-3 h-3" /> Handmade in Dryden, ON
                </motion.div>
                <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.05] mb-6 text-foreground">
                  Small batch.<br />
                  <span className="text-primary">Made by hand.</span><br />
                  Made here.
                </motion.h1>
                <motion.p variants={fadeUp} className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                  Hinterland &amp; Co. makes cold process soaps, bath bombs, soy candles, and gift sets — all vegan, all handcrafted, right here in Dryden.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base"
                    onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    See what we make <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 text-base border-2"
                    onClick={() => document.getElementById("find-us")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Find us downtown
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
                className="order-first md:order-last"
              >
                <img
                  src={imgSoapBars}
                  alt="Handcrafted cold process soap bars tied with twine"
                  className="w-full h-[380px] md:h-[460px] object-cover rounded-2xl shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div className="bg-primary text-primary-foreground py-3 overflow-hidden border-y border-primary">
          <div className="flex gap-12 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="flex items-center gap-12 text-sm font-medium tracking-wide shrink-0">
                <span className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 opacity-70" /> Vegan</span>
                <span className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 opacity-70" /> Cold Process</span>
                <span className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 opacity-70" /> Natural Ingredients</span>
                <span className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 opacity-70" /> Handmade in Dryden</span>
                <span className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 opacity-70" /> Small Batch</span>
                <span className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 opacity-70" /> Gift-Ready</span>
              </span>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <section id="products" className="py-20 px-4 md:px-6 bg-muted/40">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">What we make.</h2>
                <p className="text-muted-foreground text-lg max-w-xl">Every product is made in small batches with ingredients chosen for what they do, not how cheap they are.</p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-5">
                {products.map((p, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <div className="bg-card border-2 border-border rounded-2xl overflow-hidden h-full hover:border-primary/40 transition-colors group">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={p.img}
                          alt={p.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500${i === 0 ? " object-bottom" : ""}`}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{p.desc}</p>
                        <span className="text-xs font-semibold text-primary bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">{p.note}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p variants={fadeUp} className="mt-8 text-sm text-muted-foreground">
                Seasonal products and new scents drop regularly. Follow <a href="https://www.instagram.com/hinterland_and_co" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline underline-offset-2">@hinterland_and_co</a> on Instagram to see what's coming next.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* GLOW ROOM */}
        <section id="glow-room" className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-12 items-start"
            >
              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                <img
                  src={imgGlowBed}
                  alt="Glow Room treatment bed"
                  className="w-full h-60 object-cover rounded-2xl shadow-md"
                />
                <img
                  src={imgFacialTreatment}
                  alt="Express facial treatment"
                  className="w-full h-52 object-cover rounded-2xl shadow-md"
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-6">
                  <Sparkles className="w-3 h-3" /> Beauty services
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Glow Room</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Alongside our handcrafted products, we offer a small menu of beauty treatments in our private Glow Room. Quick, affordable, and no appointment drama.
                </p>

                <div className="space-y-3 mb-8">
                  {glowServices.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/60 rounded-xl px-5 py-4 border border-border">
                      <span className="font-semibold text-base">{s.name}</span>
                      <span className="text-primary font-bold text-lg">{s.price}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://www.instagram.com/hinterland_and_co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-4 h-4" /> Message us to book
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* OUR STORY */}
        <section id="story" className="py-20 px-4 md:px-6 bg-muted/40">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-14 items-start"
            >
              <motion.div variants={fadeUp}>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Our story</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">We make things the longer way on purpose.</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Hinterland &amp; Co. grew out of a genuine interest in what goes on your skin — and a frustration with products that rely on filler ingredients and synthetic shortcuts. We started making soap because we wanted to know exactly what was in it.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Cold process takes more time than alternatives. You mix oils and lye at precise temperatures, pour the batter into moulds, and then wait. No shortcuts produce the same bar. The result is a soap with natural glycerin, a creamy lather, and a hardness that comes from the saponification process — not from additives.
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-primary shrink-0" />
                  <span>Handcrafted with care in Dryden, Northwestern Ontario.</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                {values.map((v, i) => (
                  <div key={i} className="bg-muted/60 rounded-xl p-5 border border-border">
                    <p className="font-bold text-base mb-1.5">{v.label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                  </div>
                ))}
                <div className="bg-primary/8 border border-primary/20 rounded-xl p-5">
                  <p className="font-bold text-base text-primary mb-1.5">Custom orders</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Need a custom gift set, a specific scent, or bulk soap for an event? Get in touch — we're happy to work with you.</p>
                  <a
                    href="mailto:lovingsuds4@gmail.com?subject=Custom Order Inquiry"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-3 hover:underline underline-offset-2"
                  >
                    Email us <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* PHOTO STRIP */}
        <div className="flex">
          <div className="flex-1 aspect-square overflow-hidden">
            <img src={imgSoapShelf} alt="Colourful soap shelf" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 aspect-square overflow-hidden">
            <img src={imgCandles} alt="Soul Sister soy candles" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 aspect-square overflow-hidden">
            <img src={imgStore} alt="Hinterland store interior" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* INSTAGRAM FEED */}
        <section className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                    <Instagram className="w-3 h-3" /> Instagram
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Follow along.</h2>
                  <p className="text-muted-foreground mt-2 max-w-md">New products, seasonal drops, and behind-the-scenes moments — all on Instagram.</p>
                </div>
                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 shrink-0 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-4 h-4" /> @hinterland_and_co
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 md:gap-3">
                {igPosts.map((post, i) => (
                  <a
                    key={i}
                    href={IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      "relative overflow-hidden rounded-xl aspect-square group block",
                      "ring-2 transition-all duration-500",
                      highlighted === i
                        ? "ring-primary shadow-lg scale-[1.02]"
                        : "ring-transparent",
                    ].join(" ")}
                  >
                    <img
                      src={post.img}
                      alt={post.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <Instagram className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                    </div>
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FIND US */}
        <section id="find-us" className="py-20 px-4 md:px-6 bg-foreground text-background">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest text-background/40 mb-4">Find us</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-background">Come say hello.</h2>
                <p className="text-background/60 mt-3 text-lg">We're right downtown. Stop in when you're passing through.</p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-5">
                <motion.div variants={fadeUp} className="bg-background/10 border border-background/20 rounded-2xl p-6">
                  <MapPin className="w-6 h-6 text-primary mb-4" />
                  <p className="font-bold text-background mb-1">Address</p>
                  <p className="text-background/70 text-sm leading-relaxed">53 King Street<br />Dryden, Ontario</p>
                  <a
                    href="https://maps.google.com/?q=53+King+Street+Dryden+Ontario"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-3 hover:underline underline-offset-2"
                  >
                    Open in Maps <ArrowRight className="w-3 h-3" />
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-background/10 border border-background/20 rounded-2xl p-6">
                  <Clock className="w-6 h-6 text-primary mb-4" />
                  <p className="font-bold text-background mb-1">Hours</p>
                  <p className="text-background/70 text-sm leading-relaxed">Check Instagram or give us a call for current hours — they vary by season.</p>
                  <a
                    href="https://www.instagram.com/hinterland_and_co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-3 hover:underline underline-offset-2"
                  >
                    @hinterland_and_co <ArrowRight className="w-3 h-3" />
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-background/10 border border-background/20 rounded-2xl p-6">
                  <Phone className="w-6 h-6 text-primary mb-4" />
                  <p className="font-bold text-background mb-1">Get in touch</p>
                  <div className="space-y-2 mt-2">
                    <a href="tel:8072204685" className="flex items-center gap-2 text-background/70 text-sm hover:text-primary transition-colors">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      (807) 220-4685
                    </a>
                    <a href="mailto:lovingsuds4@gmail.com" className="flex items-center gap-2 text-background/70 text-sm hover:text-primary transition-colors">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      lovingsuds4@gmail.com
                    </a>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.instagram.com/hinterland_and_co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-background/10 border border-background/20 text-background px-5 py-3 rounded-xl text-sm font-semibold hover:bg-background/20 transition-colors"
                >
                  <Instagram className="w-4 h-4" /> @hinterland_and_co
                </a>
                <a
                  href="https://www.facebook.com/hinterlandandco/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-background/10 border border-background/20 text-background px-5 py-3 rounded-xl text-sm font-semibold hover:bg-background/20 transition-colors"
                >
                  <Facebook className="w-4 h-4" /> Hinterland &amp; Co.
                </a>
                <a
                  href="tel:8072204685"
                  className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Phone className="w-4 h-4" /> (807) 220-4685
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-10 px-4 md:px-6 border-t border-border bg-background">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Leaf className="w-4 h-4 text-primary" />
            Hinterland &amp; Co. · Dryden, ON
          </div>
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/hinterland_and_co" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <a href="https://www.facebook.com/hinterlandandco/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a>
            <a href="tel:8072204685" className="hover:text-primary transition-colors">(807) 220-4685</a>
          </div>
          <p className="text-xs">Formerly Loving Suds Inc.</p>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

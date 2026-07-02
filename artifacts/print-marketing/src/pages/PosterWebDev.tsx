import { PrintNav } from "../components/PrintNav";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function getPlainText(): string {
  return [
    "Your dream operating app — built for you.",
    "",
    "I'm a business owner in the region. I know the hurdles.",
    "Web3-powered tools. Frictionless operations. You own it — no subscriptions, no middlemen.",
    "",
    "✓ Custom web & web3-powered apps",
    "✓ Built for small biz & community orgs in NW Ontario",
    "✓ I've lived the problem — I speak the language",
    "",
    "Custom builds from $1,200 · 50% to start · 50% on delivery",
    "",
    "Book a free 30-min call:",
    "your@email.com",
    "",
    "Wabigoon, ON · Northwestern Ontario",
    "Local · Personal · Mission-driven",
  ].join("\n");
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

export default function PosterWebDev() {
  const [copied, setCopied] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("your@email.com").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <PrintNav
        targetId="poster-web-dev"
        filename="web-dev-poster.pdf"
        onCopyPlainText={getPlainText}
      />

      <div
        style={{
          minHeight: "100vh",
          background: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "2rem 1rem 1rem",
          gap: "1.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            maxWidth: 600,
            letterSpacing: "0.02em"
          }}
        >
          📸 Save for social — zoom out until the square fills your screen, then screenshot. Mac: ⌘⇧4 · Windows: Win+Shift+S
        </p>

        <div
          id="poster-web-dev"
          style={{
            width: 1080,
            height: 1080,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            background: "var(--evergreen)",
            fontFamily: "var(--font-serif)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
          }}
        >
          {/* Animated topo background */}
          <motion.svg
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.12, scale: 1.05 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              inset: "-10%",
              width: "120%",
              height: "120%",
              pointerEvents: "none"
            }}
            viewBox="0 0 1080 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            {[100, 220, 340, 460, 580, 700, 820, 940, 1060].map((r, i) => (
              <ellipse key={`a-${i}`} cx={700} cy={600} rx={r * 1.5} ry={r} fill="none" stroke="var(--cream)" strokeWidth="1.5" />
            ))}
            {[80, 160, 240, 320, 400, 480].map((r, i) => (
              <ellipse key={`b-${i}`} cx={200} cy={200} rx={r * 1.2} ry={r} fill="none" stroke="var(--cream)" strokeWidth="1" />
            ))}
          </motion.svg>

          {/* Rust geometric accent */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -100,
              width: 400,
              height: 400,
              background: "var(--rust)",
              opacity: 0.2,
              transform: "rotate(15deg)",
              borderRadius: 20,
              pointerEvents: "none",
            }}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "72px 80px",
            }}
          >
            {/* Top row */}
            <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 50 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(244, 237, 224, 0.08)",
                  border: "1px solid rgba(244, 237, 224, 0.2)",
                  borderRadius: 40,
                  padding: "10px 20px",
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "var(--rust-light)",
                    flexShrink: 0,
                    display: "inline-block"
                  }}
                />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--cream)", fontWeight: 600 }}>
                  Wabigoon, ON · Northwestern Ontario
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "5rem",
                fontWeight: 900,
                color: "var(--cream)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 32,
                maxWidth: 900,
              }}
            >
              Your dream operating app — built for you.
            </motion.h1>

            <motion.div variants={fadeUp} style={{ width: 100, height: 6, background: "var(--firefly-gold)", borderRadius: 3, marginBottom: 40 }} />

            {/* Sub-headline & Differentiator */}
            <motion.div variants={fadeUp} style={{ marginBottom: 60, maxWidth: 800 }}>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--cream)",
                  lineHeight: 1.4,
                  marginBottom: 16,
                }}
              >
                I'm a business owner in the region. I know the hurdles.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.3rem",
                  color: "rgba(244,237,224,0.85)",
                  lineHeight: 1.5,
                }}
              >
                Web3-powered tools. Frictionless operations. You own it — no subscriptions, no middlemen.
              </p>
            </motion.div>

            {/* Bullets */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 60 }}>
              {[
                "Custom web & web3-powered apps",
                "Built for small biz & community orgs in NW Ontario",
                "I've lived the problem — I speak the language"
              ].map((text, i) => (
                <motion.div
                  key={i}
                  whileHover={{ 
                    x: 10,
                    backgroundColor: "rgba(244,237,224,0.06)",
                    borderLeftColor: "var(--firefly-gold)"
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "16px 20px",
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "4px solid transparent",
                    transition: "all 0.2s ease",
                    cursor: "default"
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(244,237,224,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1.5 5.5L5 9L12.5 1.5" stroke="var(--firefly-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "1.2rem", fontWeight: 500, color: "var(--cream)" }}>
                    {text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <div style={{ flex: 1 }} />

            {/* CTA Block */}
            <motion.div
              variants={fadeUp}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(184, 90, 62, 0)",
                  "0 0 0 15px rgba(184, 90, 62, 0.2)",
                  "0 0 0 0 rgba(184, 90, 62, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "var(--rust)",
                borderRadius: 16,
                padding: "40px 48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 40,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(255,255,255,0.08)", borderRadius: "50%", pointerEvents: "none" }} />
              
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "white",
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  Custom builds from $1,200 · 50% to start · 50% on delivery
                </p>
              </div>

              <div style={{ width: 2, height: 80, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />

              <div style={{ textAlign: "right", position: "relative", flexShrink: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: 16,
                  }}
                >
                  Book a free 30-min call
                </p>
                
                <div style={{ position: "relative", display: "inline-block" }}>
                  <motion.button
                    onClick={handleCopy}
                    onHoverStart={() => setHoverContact(true)}
                    onHoverEnd={() => setHoverContact(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: "white",
                      color: "var(--rust)",
                      border: "none",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 800,
                      fontSize: "1.4rem",
                      padding: "16px 32px",
                      borderRadius: 8,
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    your@email.com
                  </motion.button>
                  
                  <AnimatePresence>
                    {(hoverContact || copied) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                          position: "absolute",
                          top: -45,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "var(--evergreen)",
                          color: "var(--cream)",
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: "0.85rem",
                          fontFamily: "var(--font-sans)",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          zIndex: 10
                        }}
                      >
                        {copied ? "Copied!" : "Click to copy"}
                        <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "var(--evergreen)" }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              variants={fadeUp}
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,237,224,0.4)", fontWeight: 600 }}>
                Local · Personal · Mission-driven
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(244,237,224,0.3)" }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(244,237,224,0.3)" }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(244,237,224,0.3)" }} />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            marginTop: "0.5rem"
          }}
        >
          Replace your@email.com with your actual contact before sharing.
        </p>
      </div>
    </>
  );
}

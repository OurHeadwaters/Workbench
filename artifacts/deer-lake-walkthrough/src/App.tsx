import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { TopChrome, BottomChrome } from "@/components/Chrome";
import { SECTIONS } from "@/data/sections";

import Prologue from "@/sections/Prologue";
import WhatItIs from "@/sections/WhatItIs";
import WhyCurrentFails from "@/sections/WhyCurrentFails";
import ColdChain from "@/sections/ColdChain";
import WhoWorks from "@/sections/WhoWorks";
import FirstMorning from "@/sections/FirstMorning";
import WhatStays from "@/sections/WhatStays";
import Ask from "@/sections/Ask";
import Recap from "@/sections/Recap";

const SECTION_COMPONENTS = [
  Prologue,
  WhatItIs,
  WhyCurrentFails,
  ColdChain,
  WhoWorks,
  FirstMorning,
  WhatStays,
  Ask,
  Recap,
];

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 380;
const TAP_MAX_MOVEMENT = 6;

/**
 * The walkthrough shell. One section at a time fills the viewport. Swipe
 * left/right (or use the arrows in the bottom chrome) to flip between
 * sections; tap the page to fade the chrome out so the page becomes the
 * page. Each section scrolls independently inside its own viewport so a
 * long section never spills into the next one.
 */
export default function App() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [chromeVisible, setChromeVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  const total = SECTION_COMPONENTS.length;
  const current = SECTIONS[index];
  const SectionComponent = SECTION_COMPONENTS[index];

  const goTo = (next: number) => {
    if (next < 0 || next >= total || next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
    if (sectionScrollRef.current) sectionScrollRef.current.scrollTop = 0;
  };

  const onPrev = () => goTo(index - 1);
  const onNext = () => goTo(index + 1);

  // Hash-based deep linking so a section is shareable. Uses functional
  // state updates so the listener doesn't capture a stale `index`, and
  // handles `#prologue` (the implicit first section) explicitly.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace(/^#/, "") || SECTIONS[0].id;
      const i = SECTIONS.findIndex((s) => s.id === id);
      if (i < 0) return;
      setIndex((prev) => {
        if (i === prev) return prev;
        setDirection(i > prev ? 1 : -1);
        return i;
      });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    const id = SECTIONS[index]?.id;
    if (id && window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
  }, [index]);

  // Keyboard navigation for desktop / accessibility.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const sectionScrollRef = useRef<HTMLDivElement | null>(null);
  const tapStart = useRef<{ x: number; y: number; t: number } | null>(null);

  const handleTapStart = (e: React.PointerEvent) => {
    tapStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };

  const handleTapEnd = (e: React.PointerEvent) => {
    const start = tapStart.current;
    tapStart.current = null;
    if (!start) return;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const dt = Date.now() - start.t;
    if (dx < TAP_MAX_MOVEMENT && dy < TAP_MAX_MOVEMENT && dt < 280) {
      // True tap — toggle chrome.
      setChromeVisible((v) => !v);
    }
  };

  const variants = useMemo(
    () => ({
      enter: (dir: 1 | -1) => ({
        x: reduceMotion ? 0 : dir * 36,
        opacity: 0,
      }),
      center: { x: 0, opacity: 1 },
      exit: (dir: 1 | -1) => ({
        x: reduceMotion ? 0 : dir * -36,
        opacity: 0,
      }),
    }),
    [reduceMotion],
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden paper"
      style={{ background: "var(--color-bg)" }}
    >
      <TopChrome
        visible={chromeVisible}
        eyebrow={current.eyebrow}
        position={index + 1}
        total={total}
      />

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={current.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.42 },
            opacity: { duration: 0.22 },
          }}
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_event: unknown, info: PanInfo) => {
            const dx = info.offset.x;
            const vx = info.velocity.x;
            if (dx < -SWIPE_DISTANCE || vx < -SWIPE_VELOCITY) onNext();
            else if (dx > SWIPE_DISTANCE || vx > SWIPE_VELOCITY) onPrev();
          }}
          onPointerDown={handleTapStart}
          onPointerUp={handleTapEnd}
          className="absolute inset-0 touch-pan-y"
        >
          <div
            ref={sectionScrollRef}
            className="w-full h-full overflow-y-auto no-scrollbar overscroll-contain"
          >
            <SectionComponent />
          </div>
        </motion.div>
      </AnimatePresence>

      <BottomChrome
        visible={chromeVisible}
        position={index + 1}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        onJump={(i) => goTo(i)}
        eyebrow={current.eyebrow}
      />
    </div>
  );
}

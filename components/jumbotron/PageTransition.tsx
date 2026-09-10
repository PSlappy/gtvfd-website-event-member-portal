"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Broadcast-style page-swap: on every route change, the old screen
 * exits and the new one enters using one of several jumbotron/
 * electronic-billboard-style transitions (side swipe, iris reveal,
 * vertical wipe, hard cut) chosen at random, so it doesn't play the
 * same transition every time. Never repeats the immediately previous
 * one back to back.
 */
type TransitionName = "swipe" | "iris" | "vertical" | "flash";

const TRANSITION_NAMES: TransitionName[] = [
  "swipe",
  "iris",
  "vertical",
  "flash",
];

// Fixed, not random — this is what both server and client render on
// first paint. Picking randomly here would call Math.random() during
// a render that has to match between server and client, causing a
// hydration mismatch (confirmed via a real React warning while
// building this). Randomization only kicks in via the effect below,
// which is client-only and runs after a route has actually changed.
const DEFAULT_TRANSITION: TransitionName = "swipe";

const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

const VARIANTS: Record<
  TransitionName,
  { initial: object; animate: object; exit: object }
> = {
  // Side swipe: new screen slides in from the right as the old one
  // slides out to the left, like an electronic billboard panel change.
  swipe: {
    initial: { x: "100%", opacity: 1 },
    animate: { x: "0%", opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
    exit: { x: "-100%", opacity: 1, transition: { duration: 0.4, ease: EASE_IN } },
  },
  // Iris reveal: expands open from the center, like a broadcast
  // graphics package cueing in.
  iris: {
    initial: { clipPath: "circle(0% at 50% 50%)", opacity: 1 },
    animate: {
      clipPath: "circle(150% at 50% 50%)",
      opacity: 1,
      transition: { duration: 0.55, ease: "easeInOut" },
    },
    exit: {
      clipPath: "circle(0% at 50% 50%)",
      opacity: 1,
      transition: { duration: 0.4, ease: EASE_IN },
    },
  },
  // Vertical wipe: same idea as swipe, top-to-bottom instead of
  // side-to-side, for variety.
  vertical: {
    initial: { y: "100%", opacity: 1 },
    animate: { y: "0%", opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
    exit: { y: "-100%", opacity: 1, transition: { duration: 0.4, ease: EASE_IN } },
  },
  // Hard cut: quick fade/scale, snappier and more abrupt than the
  // others, plus a brief gold flash for a "broadcast cut" feel.
  flash: {
    initial: { opacity: 0, scale: 1.02 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.25, delay: 0.1 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
  },
};

function pickTransition(exclude: TransitionName): TransitionName {
  const pool = TRANSITION_NAMES.filter((name) => name !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [transitionName, setTransitionName] =
    useState<TransitionName>(DEFAULT_TRANSITION);
  const lastTransitionRef = useRef<TransitionName>(DEFAULT_TRANSITION);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // First mount already rendered with DEFAULT_TRANSITION on both
      // server and client — nothing to reconcile, and AnimatePresence's
      // initial={false} means it won't animate anyway. Only start
      // randomizing from the next real navigation onward.
      isFirstRender.current = false;
      return;
    }
    const next = pickTransition(lastTransitionRef.current);
    lastTransitionRef.current = next;
    setTransitionName(next);
  }, [pathname]);

  if (reduceMotion) {
    return <div className="h-full w-full">{children}</div>;
  }

  const variant = VARIANTS[transitionName];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={variant.initial}
          animate={variant.animate}
          exit={variant.exit}
          className="relative h-full w-full"
        >
          {children}
          {transitionName === "flash" && (
            <div
              aria-hidden
              className="gt-cut-flash pointer-events-none absolute inset-0 z-30 bg-gt-gold"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

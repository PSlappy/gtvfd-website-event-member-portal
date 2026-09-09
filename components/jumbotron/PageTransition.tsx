"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Broadcast-style page-swap: old content cuts out, a gold panel wipes
 * across covering the screen, then recedes to reveal the new page
 * fading in underneath — like a scoreboard switching graphics rather
 * than a normal page navigation.
 */
export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="h-full w-full">{children}</div>;
  }

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        <motion.div
          key={pathname}
          aria-hidden
          initial={{ scaleX: 1 }}
          animate={{
            scaleX: 0,
            transition: { delay: 0.15, duration: 0.25, ease: "easeInOut" },
          }}
          exit={{ scaleX: 1, transition: { duration: 0.15, ease: "easeIn" } }}
          className="pointer-events-none absolute inset-0 z-30 bg-gt-gold"
        />
      </AnimatePresence>
    </div>
  );
}

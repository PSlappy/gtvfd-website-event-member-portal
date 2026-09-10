"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTypingCoordination } from "./TypingCoordinationContext";
import { useTypeSequence } from "./TypeSequenceContext";

// Small breathing room between one caption finishing and the next
// one's turn starting, so consecutive captions don't hard-cut into
// each other.
const SEQUENCE_GAP_MS = 220;

/**
 * Types `text` out character by character, in order, as each block
 * scrolls into view, like captions being typed live on the board.
 *
 * Three things make that work together:
 *
 * 1. **Trigger** — uses an IntersectionObserver on itself. Works both
 *    on a normal page and inside `JumbotronCrawl`'s auto-scrolling
 *    container without needing to know which one it's in: intermediate
 *    `overflow` ancestors clip an IntersectionObserver target
 *    regardless of the observer's own `root`, so the default
 *    (viewport) root already respects the crawl's current scroll
 *    position, or a plain page's own scroll container, with no extra
 *    plumbing.
 * 2. **Order** — `TypeSequenceContext` (provided once per page by
 *    `PageTransition`) makes each instance wait its turn so a heading
 *    and the paragraph under it, both already in view, type one after
 *    another instead of both firing on top of each other.
 * 3. **Autoscroll** — while a block is actively typing, it tells the
 *    nearest `JumbotronCrawl` (via `TypingCoordinationContext`, a
 *    no-op outside a crawl) to pause, so the crawl can never scroll a
 *    caption out of view mid-type.
 *
 * The full string is always in the DOM for screen readers via
 * `aria-label`; the animated partial string underneath is
 * `aria-hidden` so it isn't read out character by character.
 */
export default function Typewriter({
  text,
  className = "",
  speed = 33,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Extra milliseconds to wait, once in view and it's this block's
   * turn, before typing starts — mainly for the first block on a
   * page, to let its entrance animation settle first. */
  startDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const coordination = useTypingCoordination();
  const sequence = useTypeSequence();
  const [sequenceId, setSequenceId] = useState<number | null>(null);
  const registeredRef = useRef(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [visibleChars, setVisibleChars] = useState(
    reduceMotion ? text.length : 0,
  );
  const startedRef = useRef(false);
  const isTypingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Registering here (rather than in a useState lazy initializer) is
  // deliberate: React's dev StrictMode double-invokes render — lazy
  // initializers included — which would burn two ids off the shared
  // counter per instance and permanently desync every block after it
  // from its turn (confirmed while building this: every block after
  // the first stayed stuck at 0 characters forever). Effects don't
  // have that problem, and `registeredRef` also blocks StrictMode's
  // separate mount-cleanup-mount effect replay from registering
  // twice.
  useEffect(() => {
    if (!sequence || registeredRef.current) return;
    registeredRef.current = true;
    setSequenceId(sequence.register());
  }, [sequence]);

  const myTurn =
    sequence === null
      ? true
      : sequenceId !== null && sequence.activeIndex === sequenceId;

  // Detect entering view, once.
  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasEntered(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // Start typing once both in view and it's this block's turn.
  useEffect(() => {
    if (reduceMotion || startedRef.current || !hasEntered || !myTurn) return;
    startedRef.current = true;

    timeoutRef.current = setTimeout(() => {
      isTypingRef.current = true;
      coordination?.onTypingStart();
      let i = 0;
      intervalRef.current = setInterval(() => {
        i += 1;
        setVisibleChars(i);
        if (i >= text.length) {
          clearInterval(intervalRef.current);
          isTypingRef.current = false;
          coordination?.onTypingEnd();
          setTimeout(() => sequence?.advance(), SEQUENCE_GAP_MS);
        }
      }, speed);
    }, startDelay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEntered, myTurn, reduceMotion]);

  // Cleanup on unmount, mid-type.
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      if (isTypingRef.current) {
        isTypingRef.current = false;
        coordination?.onTypingEnd();
      }
    };
    // Deliberately empty deps: this is a mount/unmount-only cleanup
    // effect, not something that should re-run when `coordination`
    // changes mid-typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, visibleChars)}</span>
    </span>
  );
}

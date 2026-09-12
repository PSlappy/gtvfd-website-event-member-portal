"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { TypingCoordinationProvider } from "./TypingCoordinationContext";

// A person's head/shoulders plus sound-wave arcs, distinct from the
// plain speaker-cone icon (see MusicPlayer.tsx) used for the site's
// background music — this one is specifically the "someone is
// speaking" icon for a page's voiceover narration.
function IconVoice() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="9" cy="7" r="2.6" fill="currentColor" />
      <path
        d="M4.5 18c0-3 2-5 4.5-5s4.5 2 4.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15.5 9a4 4 0 0 1 0 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M18 7a7 7 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconVoiceMuted() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="9" cy="7" r="2.6" fill="currentColor" />
      <path
        d="M4.5 18c0-3 2-5 4.5-5s4.5 2 4.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 9 20 14M20 9 15 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconReplay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 12a8 8 0 1 1 2.5 5.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 17v-5h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Wraps page content in a jumbotron-style auto-scrolling crawl, like a
 * Star Wars opening or a broadcast teleprompter: on arrival it scrolls
 * itself top to bottom at a steady pace, pauses instantly the moment a
 * visitor scrolls manually (their input always wins). The autoscroll
 * itself always runs, on every page — `showVoiceControls` only gates
 * the Voice/Replay button row, per the owner: those only belong on
 * pages that actually have (or will have) voiceover narration, About
 * for now, not every page the crawl wraps.
 *
 * Voice-mute doesn't do anything audible yet, there's no narration
 * audio recorded (see the Typography-adjacent TODO in CLAUDE.md for
 * the same "no licensed/sourced asset yet" situation). It's wired up
 * now so the announcer narration planned for later just has to check
 * `muted` rather than needing new UI. `onMutedChange` is exposed so a
 * future audio player can subscribe to the same toggle. Replay
 * restarts the typewriter/scroll now, and will also restart the
 * voiceover once that exists.
 */
export default function JumbotronCrawl({
  children,
  speed = 48,
  startDelay = 900,
  showVoiceControls = false,
  onMutedChange,
}: {
  children: ReactNode;
  /** Scroll speed in pixels per second. */
  speed?: number;
  /** Delay in ms before the crawl starts, so entrance animations settle first. */
  startDelay?: number;
  /** Show the Voice-mute/Replay button row — only pages with (or planning) voiceover narration should opt in. */
  showVoiceControls?: boolean;
  onMutedChange?: (muted: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const activeTypersRef = useRef(0);
  const [muted, setMuted] = useState(false);
  const reduceMotion = useReducedMotion();

  // Stable across renders so it can be handed to context without
  // retriggering consumers. Any Typewriter inside the crawl that's
  // actively typing bumps this, which pauses the scroll loop below
  // until every active typewriter has finished.
  const coordination = useRef({
    onTypingStart: () => {
      activeTypersRef.current += 1;
    },
    onTypingEnd: () => {
      activeTypersRef.current = Math.max(0, activeTypersRef.current - 1);
    },
  }).current;

  function stop() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
  }

  function tick(ts: number) {
    const el = scrollRef.current;
    if (!el) return;
    if (lastTsRef.current === null) lastTsRef.current = ts;
    // A caption is mid-type below: hold position rather than scroll
    // it away, but keep ticking (rather than fully stopping) so we
    // notice the moment it's done and pick back up. Reset lastTsRef
    // each paused frame so dt doesn't accumulate into one big jump
    // once scrolling resumes.
    if (activeTypersRef.current > 0) {
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    // Cap dt so a backgrounded/throttled tab doesn't "catch up" with one
    // huge jump in scroll position once the frame finally fires again.
    const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1);
    lastTsRef.current = ts;

    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) {
      stop();
      return;
    }
    const next = Math.min(el.scrollTop + speed * dt, max);
    el.scrollTop = next;
    if (next >= max) {
      stop();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function play() {
    stop();
    rafRef.current = requestAnimationFrame(tick);
  }

  function replay() {
    stop();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    requestAnimationFrame(() => play());
  }

  useEffect(() => {
    if (reduceMotion) return;
    const t = setTimeout(play, startDelay);
    return () => {
      clearTimeout(t);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // Any real user input on the crawl cancels autoplay immediately and
  // leaves the scroll position exactly where they left it.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onUserInteract = () => {
      if (rafRef.current !== null) stop();
    };
    el.addEventListener("wheel", onUserInteract, { passive: true });
    el.addEventListener("touchstart", onUserInteract, { passive: true });
    el.addEventListener("pointerdown", onUserInteract);
    el.addEventListener("keydown", onUserInteract);
    return () => {
      el.removeEventListener("wheel", onUserInteract);
      el.removeEventListener("touchstart", onUserInteract);
      el.removeEventListener("pointerdown", onUserInteract);
      el.removeEventListener("keydown", onUserInteract);
    };
  }, []);

  function toggleMuted() {
    setMuted((m) => {
      const next = !m;
      onMutedChange?.(next);
      return next;
    });
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={scrollRef}
        tabIndex={0}
        className="gt-no-scrollbar h-full w-full overflow-y-auto overflow-x-hidden outline-none"
      >
        <TypingCoordinationProvider value={coordination}>
          {children}
        </TypingCoordinationProvider>
      </div>

      {showVoiceControls && (
        <>
          {/* fade the crawl to black before it reaches the control row, so
              text doesn't clip abruptly behind the buttons */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-20 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center gap-3 px-4">
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? "Unmute narration" : "Mute narration"}
              aria-pressed={muted}
              className="gt-jumbotron-btn pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-gt-gold bg-gt-navy text-gt-gold"
            >
              {muted ? <IconVoiceMuted /> : <IconVoice />}
            </button>
            <button
              type="button"
              onClick={replay}
              aria-label="Replay the crawl from the top"
              className="gt-jumbotron-btn pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-gt-gold bg-gt-gold text-black"
            >
              <IconReplay />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

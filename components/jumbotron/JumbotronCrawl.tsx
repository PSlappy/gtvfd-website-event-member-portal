"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { TypingCoordinationProvider } from "./TypingCoordinationContext";
import { useVoiceControls } from "./VoiceControlsContext";

/**
 * Wraps page content in a jumbotron-style auto-scrolling crawl, like a
 * Star Wars opening or a broadcast teleprompter: on arrival it scrolls
 * itself top to bottom at a steady pace, pauses instantly the moment a
 * visitor scrolls manually (their input always wins). The autoscroll
 * itself always runs, on every page — `showVoiceControls` only governs
 * whether this page's Voice-mute/Replay controls exist at all, per the
 * owner: those only belong on pages that actually have (or will have)
 * voiceover narration, About for now, not every page the crawl wraps.
 *
 * Doesn't render its own Voice/Replay buttons anymore — per the owner,
 * those now live in the single persistent media-controls row alongside
 * the music player (`MusicPlayer.tsx`, mounted in `JumbotronFrame`).
 * Since that row lives outside this page's own part of the component
 * tree, this registers `muted`/`toggleMuted`/`replay` into
 * `VoiceControlsContext` instead (via `registerVoiceControls`) whenever
 * `showVoiceControls` is on, and `MusicPlayer` renders the actual
 * buttons from whatever's currently registered there.
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
  const { registerVoiceControls } = useVoiceControls();

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

  // Registers this page's Voice/Replay controls into the shared
  // context so MusicPlayer can render them — re-runs on `muted`
  // changes too, so the registered value stays fresh rather than a
  // stale closure from mount. Unregisters on unmount or the moment
  // `showVoiceControls` turns off, so MusicPlayer stops showing these
  // buttons the instant a non-voice page mounts.
  useEffect(() => {
    if (!showVoiceControls) {
      registerVoiceControls(null);
      return;
    }
    registerVoiceControls({ muted, toggleMuted, replay });
    return () => registerVoiceControls(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVoiceControls, muted]);

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
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The site's background music, per the owner: 2-3 songs, Previous/
 * Play/Next/Mute controls, playing across every page (mounted once in
 * `JumbotronFrame`, so it never remounts or restarts on navigation —
 * same reasoning as `NavBar`/`NextEventTicker` staying mounted in the
 * root layout). Deliberately separate from `JumbotronCrawl`'s Voice/
 * Replay controls: this plays continuously regardless of whether the
 * current page also has voiceover narration playing.
 *
 * TODO(owner): there's no actual audio yet. `TRACKS` below points at
 * files that don't exist — same "no licensed/sourced asset" situation
 * as the Typography TODO in CLAUDE.md, and for the same reason: music
 * is real intellectual property, and rather than pull in something
 * without knowing it's cleared to use, this ships with the full
 * player wired up and silent until real files land at those paths.
 * Drop 2-3 royalty-free/licensed mp3s into `public/audio/music/` with
 * matching filenames (or edit `TRACKS` to point at wherever they
 * end up) and playback works with no other changes.
 */
const TRACKS = [
  { title: "Track 1", src: "/audio/music/track-1.mp3" },
  { title: "Track 2", src: "/audio/music/track-2.mp3" },
  { title: "Track 3", src: "/audio/music/track-3.mp3" },
];

function IconPrevious() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M6 5v14h2V5H6Z" fill="currentColor" />
      <path d="M19 5 10 12l9 7V5Z" fill="currentColor" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M16 5v14h2V5h-2Z" fill="currentColor" />
      <path d="M5 5l9 7-9 7V5Z" fill="currentColor" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="currentColor" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" fill="currentColor" />
    </svg>
  );
}

function IconSpeaker() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M19 6a9 9 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMuted() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path
        d="M16 9.5 20.5 14M20.5 9.5 16 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Changing `src` resets playback, so pick the new track back up if
  // it was already playing when Previous/Next/auto-advance-on-end
  // moved to it.
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function previousTrack() {
    setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }

  function nextTrack() {
    setTrackIndex((i) => (i + 1) % TRACKS.length);
  }

  function toggleMuted() {
    setIsMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-40 flex items-center gap-1.5 sm:right-4 sm:top-4">
      <audio
        ref={audioRef}
        src={TRACKS[trackIndex].src}
        muted={isMuted}
        preload="none"
        onEnded={nextTrack}
      />
      <button
        type="button"
        onClick={previousTrack}
        aria-label="Previous song"
        className="gt-jumbotron-btn pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-gt-gold bg-gt-navy text-gt-gold sm:h-8 sm:w-8"
      >
        <IconPrevious />
      </button>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        aria-pressed={isPlaying}
        className="gt-jumbotron-btn pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-gt-gold bg-gt-gold text-black sm:h-8 sm:w-8"
      >
        {isPlaying ? <IconPause /> : <IconPlay />}
      </button>
      <button
        type="button"
        onClick={nextTrack}
        aria-label="Next song"
        className="gt-jumbotron-btn pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-gt-gold bg-gt-navy text-gt-gold sm:h-8 sm:w-8"
      >
        <IconNext />
      </button>
      <button
        type="button"
        onClick={toggleMuted}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
        aria-pressed={isMuted}
        className="gt-jumbotron-btn pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-gt-gold bg-gt-navy text-gt-gold sm:h-8 sm:w-8"
      >
        {isMuted ? <IconMuted /> : <IconSpeaker />}
      </button>
    </div>
  );
}

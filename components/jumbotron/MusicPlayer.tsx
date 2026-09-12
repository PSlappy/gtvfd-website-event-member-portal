"use client";

import { useEffect, useRef, useState } from "react";
import { useVoiceControls } from "./VoiceControlsContext";

/**
 * The site's single persistent media-controls row, per the owner:
 * background music (Previous/Play/Next/Mute, this component's own
 * state) and, when the current page has voiceover narration, that
 * page's Voice-mute/Replay too — all six buttons together in one row,
 * icon-only, in this exact order: Back, Play, Forward, Mute, Voice,
 * Replay. Mounted once in `JumbotronFrame` (not inside any page), so
 * the music state and the underlying `<audio>` element never remount
 * or restart on navigation — same reasoning `NavBar`/`NextEventTicker`
 * stay mounted in the root layout for.
 *
 * The Voice/Replay pair isn't owned by this component — it comes from
 * `VoiceControlsContext`, which the current page's `JumbotronCrawl`
 * registers into when it has `showVoiceControls` on (About only, for
 * now). Only rendered when something's actually registered, so pages
 * without voiceover just show the four music buttons.
 *
 * TODO(owner): there's no actual background music yet. `TRACKS` below
 * points at files that don't exist — same "no licensed/sourced asset"
 * situation as the Typography TODO in CLAUDE.md, and for the same
 * reason: music is real intellectual property, and rather than pull
 * in something without knowing it's cleared to use, this ships with
 * the full player wired up and silent until real files land at those
 * paths. Drop 2-3 royalty-free/licensed mp3s into
 * `public/audio/music/` with matching filenames (or edit `TRACKS` to
 * point at wherever they end up) and playback works with no other
 * changes.
 */
const TRACKS = [
  { title: "Track 1", src: "/audio/music/track-1.mp3" },
  { title: "Track 2", src: "/audio/music/track-2.mp3" },
  { title: "Track 3", src: "/audio/music/track-3.mp3" },
];

// Every icon here is sized to match the buttons' own 50%-smaller
// dimensions (see the `h-3.5 w-3.5` button size below) — half of what
// each one used to be before the owner's "50% smaller" request.
function IconPrevious() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[7px] w-[7px]">
      <path d="M6 5v14h2V5H6Z" fill="currentColor" />
      <path d="M19 5 10 12l9 7V5Z" fill="currentColor" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[7px] w-[7px]">
      <path d="M16 5v14h2V5h-2Z" fill="currentColor" />
      <path d="M5 5l9 7-9 7V5Z" fill="currentColor" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
      <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="currentColor" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
      <path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" fill="currentColor" />
    </svg>
  );
}

function IconSpeaker() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[7px] w-[7px]">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-[7px] w-[7px]">
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

// A person's head/shoulders plus sound-wave arcs, distinct from the
// plain speaker-cone icon above (that one's the site's music mute) —
// this is specifically the "someone is speaking" icon for a page's
// voiceover narration.
function IconVoice() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
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

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { voiceControls } = useVoiceControls();

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

  // Buttons are 50% smaller across the board, per the owner (was
  // h-7 w-7 sm:h-8 sm:w-8) — every button below shares this class.
  const buttonClass =
    "gt-jumbotron-btn pointer-events-auto flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-gt-gold sm:h-4 sm:w-4";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex items-center justify-center gap-1.5">
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
        className={`${buttonClass} bg-gt-navy text-gt-gold`}
      >
        <IconPrevious />
      </button>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        aria-pressed={isPlaying}
        className={`${buttonClass} bg-gt-gold text-black`}
      >
        {isPlaying ? <IconPause /> : <IconPlay />}
      </button>
      <button
        type="button"
        onClick={nextTrack}
        aria-label="Next song"
        className={`${buttonClass} bg-gt-navy text-gt-gold`}
      >
        <IconNext />
      </button>
      <button
        type="button"
        onClick={toggleMuted}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
        aria-pressed={isMuted}
        className={`${buttonClass} bg-gt-navy text-gt-gold`}
      >
        {isMuted ? <IconMuted /> : <IconSpeaker />}
      </button>
      {voiceControls && (
        <>
          <button
            type="button"
            onClick={voiceControls.toggleMuted}
            aria-label={
              voiceControls.muted ? "Unmute narration" : "Mute narration"
            }
            aria-pressed={voiceControls.muted}
            className={`${buttonClass} bg-gt-navy text-gt-gold`}
          >
            {voiceControls.muted ? <IconVoiceMuted /> : <IconVoice />}
          </button>
          <button
            type="button"
            onClick={voiceControls.replay}
            aria-label="Replay the crawl from the top"
            className={`${buttonClass} bg-gt-gold text-black`}
          >
            <IconReplay />
          </button>
        </>
      )}
    </div>
  );
}

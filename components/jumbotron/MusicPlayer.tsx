"use client";

import { useEffect, useRef, useState } from "react";
import { useVoiceControls } from "./VoiceControlsContext";

/**
 * The site's single persistent media-controls row, per the owner:
 * background music (Previous/Play/Next/Stop/Mute, this component's
 * own state) and, when the current page has voiceover narration, that
 * page's Voice-mute/Replay too — all together in one row, icon-only,
 * in this order: Back, Play, Forward, Stop, Mute, Voice, Replay.
 * Mounted once in `JumbotronFrame` (not inside any page), so playback
 * never restarts on navigation — same reasoning `NavBar`/
 * `NextEventTicker` stay mounted in the root layout for.
 *
 * The Voice/Replay pair isn't owned by this component — see
 * `VoiceControlsContext`.
 *
 * Real audio, per the owner: instead of self-hosting music files (the
 * "no licensed asset yet" TODO this used to carry), this plays
 * through Spotify's own officially embeddable iFrame API — Spotify
 * handles all licensing, nothing is hosted or distributed here. The
 * widget's own visual chrome is hidden (see the 1x1, clipped
 * `spotifyContainerRef` div below — not `display: none`, since some
 * browsers deprioritize/pause fully-hidden media iframes; a
 * zero-size-but-rendered one keeps playing); every button here talks
 * to the hidden player through Spotify's real JS API instead of
 * showing its UI.
 *
 * Spotify's officially documented API is narrower than the six-button
 * row wants, though — confirmed against the actual docs before
 * building this, not assumed:
 * - `play()`/`pause()`/`resume()`/`togglePlay()`/`seek(seconds)`/
 *   `loadEntity(uri)` exist and are what Play/Pause and Stop use.
 * - There is NO documented skip-to-next/previous-track method at all.
 *   Back/Forward below work around that by loading a different URI
 *   from `TRACK_URIS` (a short list the owner supplied) instead of
 *   asking the embed to "skip" — a real, working substitute, not a
 *   true next()/previous() the way the old <audio>-based version had.
 * - There is NO volume/mute method in the API, full stop. Mute can't
 *   be wired to anything real, so per the owner it stays in the row,
 *   visibly disabled, rather than either lying about what it does or
 *   disappearing — "might repurpose later."
 * - Stop isn't a real Spotify API method either — implemented as
 *   `pause()` + `seek(0)`, which is genuinely supported and matches
 *   what "Stop" means (halted and back at the start), unlike Pause
 *   (halted, position kept).
 */
const TRACK_URIS = [
  "spotify:track:0ZOzvjnZDwrtluHrwbtvGR",
  "spotify:track:52vkM2u1I5N7puXQfi5typ",
  "spotify:track:0Rhi3Bn5e02JyuehXOAJmY",
  "spotify:track:58k6SxNmGP1Viq6oTn7Aiy",
];

const SPOTIFY_IFRAME_API_SCRIPT_SRC =
  "https://open.spotify.com/embed/iframe-api/v1";

// Deliberately narrow — this is the part of Spotify's iFrame API this
// component actually calls, not a guess at the full surface (there's
// no official @types package for it).
type SpotifyController = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  loadEntity: (uri: string) => void;
  addListener: (
    event: "ready" | "playback_started" | "playback_update",
    callback: (e: { data?: { isPaused?: boolean } }) => void,
  ) => void;
};

type SpotifyIFrameApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
    __gtSpotifyIframeApi?: SpotifyIFrameApi;
  }
}

// Every icon here is sized to match the buttons' own dimensions (see
// `buttonClass` below) — landed between the original size and the
// 50%-smaller size that followed, per the owner ("too small now, too
// big previously — try a size in between").
function IconPrevious() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[10px] w-[10px]">
      <path d="M6 5v14h2V5H6Z" fill="currentColor" />
      <path d="M19 5 10 12l9 7V5Z" fill="currentColor" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[10px] w-[10px]">
      <path d="M16 5v14h2V5h-2Z" fill="currentColor" />
      <path d="M5 5l9 7-9 7V5Z" fill="currentColor" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
      <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="currentColor" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
      <path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" fill="currentColor" />
    </svg>
  );
}

function IconStop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
      <rect x="5" y="5" width="14" height="14" fill="currentColor" />
    </svg>
  );
}

function IconSpeaker() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[10px] w-[10px]">
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

// A person's head/shoulders plus sound-wave arcs, distinct from the
// plain speaker-cone icon above (that one's the site's music mute) —
// this is specifically the "someone is speaking" icon for a page's
// voiceover narration.
function IconVoice() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
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
  const spotifyContainerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { voiceControls } = useVoiceControls();

  useEffect(() => {
    function setupController(api: SpotifyIFrameApi) {
      if (!spotifyContainerRef.current || controllerRef.current) return;
      api.createController(
        spotifyContainerRef.current,
        { uri: TRACK_URIS[0], width: "1", height: "1" },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            if (typeof e.data?.isPaused === "boolean") {
              setIsPlaying(!e.data.isPaused);
            }
          });
        },
      );
    }

    // The API can already be available (a prior mount already loaded
    // it — this component should only ever mount once, but React
    // StrictMode double-invokes effects in dev) — reuse it instead of
    // injecting the script or clobbering the global callback again.
    if (window.__gtSpotifyIframeApi) {
      setupController(window.__gtSpotifyIframeApi);
      return;
    }

    const previousCallback = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api) => {
      window.__gtSpotifyIframeApi = api;
      previousCallback?.(api);
      setupController(api);
    };

    if (!document.getElementById("gt-spotify-iframe-api")) {
      const script = document.createElement("script");
      script.id = "gt-spotify-iframe-api";
      script.src = SPOTIFY_IFRAME_API_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  function loadTrack(index: number, autoplay: boolean) {
    const controller = controllerRef.current;
    if (!controller) return;
    controller.loadEntity(TRACK_URIS[index]);
    if (autoplay) {
      controller.play();
      setIsPlaying(true);
    }
  }

  function togglePlay() {
    controllerRef.current?.togglePlay();
    setIsPlaying((p) => !p);
  }

  function previousTrack() {
    setTrackIndex((i) => {
      const next = (i - 1 + TRACK_URIS.length) % TRACK_URIS.length;
      loadTrack(next, isPlaying);
      return next;
    });
  }

  function nextTrack() {
    setTrackIndex((i) => {
      const next = (i + 1) % TRACK_URIS.length;
      loadTrack(next, isPlaying);
      return next;
    });
  }

  function stop() {
    controllerRef.current?.pause();
    controllerRef.current?.seek(0);
    setIsPlaying(false);
  }

  // Went h-7/sm:h-8 → h-3.5/sm:h-4 (50% smaller) → h-5/sm:h-6, per the
  // owner: the 50%-smaller pass read too small, the original read too
  // big, this lands roughly halfway between the two.
  const buttonClass =
    "gt-jumbotron-btn pointer-events-auto flex h-5 w-5 items-center justify-center rounded-full border-2 border-gt-gold sm:h-6 sm:w-6";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex items-center justify-center gap-1.5">
      {/* Hidden but functional Spotify embed — 1x1 and clipped, not
          display:none, so playback keeps working while nothing
          visibly renders. Spotify's own script populates this div. */}
      <div
        ref={spotifyContainerRef}
        aria-hidden
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
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
        onClick={stop}
        aria-label="Stop music"
        className={`${buttonClass} bg-gt-navy text-gt-gold`}
      >
        <IconStop />
      </button>
      {/* Disabled, not removed — per the owner, Spotify's API has no
          volume/mute method to wire this to, but it might get
          repurposed later rather than deleted outright. */}
      <button
        type="button"
        disabled
        aria-label="Mute music (not available yet)"
        aria-disabled="true"
        className={`${buttonClass} cursor-not-allowed bg-gt-navy text-gt-gold opacity-40`}
      >
        <IconSpeaker />
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

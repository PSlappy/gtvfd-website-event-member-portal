"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

type VoiceControls = {
  muted: boolean;
  toggleMuted: () => void;
  replay: () => void;
} | null;

type VoiceControlsContextValue = {
  voiceControls: VoiceControls;
  registerVoiceControls: (controls: VoiceControls) => void;
};

const VoiceControlsContext = createContext<VoiceControlsContextValue | null>(
  null,
);

/**
 * Bridges `JumbotronCrawl` (page-scoped, nested deep inside `main`) and
 * `MusicPlayer` (frame-scoped, a sibling of `main` in `JumbotronFrame`
 * so it survives navigation) — they need to share one button row, per
 * the owner, but neither is an ancestor of the other. Provided once
 * around both in `JumbotronFrame`, so React resolves it correctly
 * regardless of where each element's JSX was originally authored.
 *
 * A page's `JumbotronCrawl` (when `showVoiceControls`) registers its
 * `muted`/`toggleMuted`/`replay` here instead of rendering its own
 * button row; `MusicPlayer` reads it back and renders the Voice/Replay
 * buttons itself, right alongside the music controls, only when a
 * page has actually registered something.
 */
export function VoiceControlsProvider({ children }: { children: ReactNode }) {
  const [voiceControls, setVoiceControls] = useState<VoiceControls>(null);
  const registerVoiceControls = useCallback((controls: VoiceControls) => {
    setVoiceControls(controls);
  }, []);

  return (
    <VoiceControlsContext.Provider
      value={{ voiceControls, registerVoiceControls }}
    >
      {children}
    </VoiceControlsContext.Provider>
  );
}

export function useVoiceControls() {
  const ctx = useContext(VoiceControlsContext);
  if (!ctx) {
    throw new Error(
      "useVoiceControls must be used within a VoiceControlsProvider",
    );
  }
  return ctx;
}

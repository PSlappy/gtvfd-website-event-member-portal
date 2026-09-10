"use client";

import { createContext, useContext } from "react";

/**
 * Lets a `Typewriter` tell an ancestor `JumbotronCrawl` to pause its
 * autoscroll while a block of text is actively typing out, so the
 * crawl never scrolls a caption away mid-type. No-ops outside a
 * crawl (plain pages don't autoscroll, so there's nothing to pause).
 */
export type TypingCoordination = {
  onTypingStart: () => void;
  onTypingEnd: () => void;
};

const TypingCoordinationContext = createContext<TypingCoordination | null>(
  null,
);

export const TypingCoordinationProvider = TypingCoordinationContext.Provider;

export function useTypingCoordination(): TypingCoordination | null {
  return useContext(TypingCoordinationContext);
}

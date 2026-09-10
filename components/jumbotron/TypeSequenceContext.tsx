"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

/**
 * Orders every `Typewriter` on a page so they type one at a time in
 * DOM order instead of all firing at once the moment each scrolls
 * into view (which, since a screenful of jumbotron content easily
 * shows a heading plus a paragraph or two together, would otherwise
 * type multiple captions simultaneously and look like garbage).
 *
 * A `Typewriter` registers on mount to get a stable position in line,
 * then only actually starts typing once it's both scrolled into view
 * *and* every earlier-registered `Typewriter` has finished. Reset per
 * page since `PageTransition` remounts this provider (it lives inside
 * the route-keyed `motion.div`) on every navigation.
 */
type TypeSequence = {
  register: () => number;
  activeIndex: number;
  advance: () => void;
};

const TypeSequenceContext = createContext<TypeSequence | null>(null);

export function TypeSequenceProvider({ children }: { children: ReactNode }) {
  const nextIdRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const register = useCallback(() => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    return id;
  }, []);

  const advance = useCallback(() => {
    setActiveIndex((i) => i + 1);
  }, []);

  return (
    <TypeSequenceContext.Provider value={{ register, activeIndex, advance }}>
      {children}
    </TypeSequenceContext.Provider>
  );
}

export function useTypeSequence(): TypeSequence | null {
  return useContext(TypeSequenceContext);
}

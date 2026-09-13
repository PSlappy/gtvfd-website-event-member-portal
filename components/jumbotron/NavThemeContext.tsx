"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ColorToken } from "@/lib/navColorTokens";

export type NavTheme = {
  buttonBackground: ColorToken;
  fontColor: ColorToken;
  fontOutlineColor: ColorToken;
  buttonBorderColor: ColorToken;
  navBarBackground: ColorToken;
};

// Matches the real nav bar's actual shipped look, so visiting
// /nav-settings before ever touching a control shows the site exactly
// as it already looks — nothing changes until the owner picks
// something.
export const DEFAULT_NAV_THEME: NavTheme = {
  buttonBackground: "grey",
  fontColor: "metallicGold",
  fontOutlineColor: "white",
  buttonBorderColor: "white",
  navBarBackground: "navy",
};

const STORAGE_KEY = "gt-nav-theme";

type NavThemeContextValue = {
  theme: NavTheme;
  setThemeProp: (key: keyof NavTheme, value: ColorToken) => void;
  resetTheme: () => void;
};

const NavThemeContext = createContext<NavThemeContextValue | null>(null);

/**
 * Live, owner-adjustable theme for the real nav bar's Rest state — the
 * owner's replacement for the old /nav-color-test page: instead of
 * Claude hand-editing a separate test page every round, the owner
 * picks colors on `/nav-settings` and sees the actual site's nav bar
 * update immediately, like a light/dark mode toggle but for five
 * separate properties. Only the Rest state is configurable — Hover/
 * Click/Current stay as designed, unaffected.
 *
 * Persisted to localStorage so it survives reloads, same as any
 * per-visitor preference would. Reads back in a `useEffect` (after
 * mount) rather than as the `useState` initializer, on purpose — this
 * provider wraps `JumbotronFrame`, which is server-rendered on first
 * load, and reading `localStorage` during the initial render would
 * mismatch between server and client, the same hydration-mismatch
 * class of bug already documented for `PageTransition`'s random-value
 * pick elsewhere in this codebase. The brief flash back to
 * `DEFAULT_NAV_THEME` on a hard reload (for anyone who's actually
 * customized it) is the accepted tradeoff.
 */
export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NavTheme>(DEFAULT_NAV_THEME);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate: syncing in from localStorage (a browser-only API) after mount, on purpose, to avoid the hydration mismatch a useState lazy initializer would cause instead (see the doc comment above).
      if (stored) setTheme({ ...DEFAULT_NAV_THEME, ...JSON.parse(stored) });
    } catch {
      // localStorage unavailable (private browsing, etc.) — just keep defaults.
    }
  }, []);

  const setThemeProp = useCallback((key: keyof NavTheme, value: ColorToken) => {
    setTheme((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore — the in-memory state still updates either way.
      }
      return next;
    });
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_NAV_THEME);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  return (
    <NavThemeContext.Provider value={{ theme, setThemeProp, resetTheme }}>
      {children}
    </NavThemeContext.Provider>
  );
}

export function useNavTheme() {
  const ctx = useContext(NavThemeContext);
  if (!ctx) {
    throw new Error("useNavTheme must be used within a NavThemeProvider");
  }
  return ctx;
}

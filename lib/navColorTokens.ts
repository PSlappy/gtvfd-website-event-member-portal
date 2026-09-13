/**
 * Shared color vocabulary for the nav bar's live theme settings
 * (`/nav-settings`, `NavThemeContext`, `NavBarButton`). Four options
 * only, per the owner: White, Grey (always Light Gray, `#e5e5e5` —
 * see the owner's standing definition), Metallic Gold, Navy (the
 * literal `--gt-navy`, `#051e39`).
 */
export type ColorToken = "white" | "grey" | "metallicGold" | "navy";

export const COLOR_TOKENS: { token: ColorToken; label: string }[] = [
  { token: "white", label: "White" },
  { token: "grey", label: "Grey" },
  { token: "metallicGold", label: "Metallic Gold" },
  { token: "navy", label: "Navy" },
];

// Same banded gradient used everywhere else on the site "Metallic
// Gold" shows up — there's no official digital value for the real
// Metallic Tech Gold ink (PMS 10126 C is offset-print-only), so this
// invented gradient is the standing approximation.
export const METALLIC_GOLD_GRADIENT =
  "linear-gradient(135deg, #b39051 0%, #ddc38a 22%, #8a7350 45%, #ddc38a 68%, #b39051 100%)";

export const FLAT_VALUE: Record<ColorToken, string> = {
  white: "#ffffff",
  grey: "#e5e5e5",
  metallicGold: "#b39051",
  navy: "#051e39",
};

/** The solid `background-color` for a token — transparent for Metallic Gold, which fills via `backgroundImageValue` instead. */
export function backgroundColorValue(token: ColorToken): string {
  return token === "metallicGold" ? "transparent" : FLAT_VALUE[token];
}

/** The `background-image` for a token — the banded gradient for Metallic Gold, `none` otherwise. */
export function backgroundImageValue(token: ColorToken): string {
  return token === "metallicGold" ? METALLIC_GOLD_GRADIENT : "none";
}

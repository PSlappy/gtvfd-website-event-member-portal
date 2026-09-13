"use client";

import JumbotronCrawl from "@/components/jumbotron/JumbotronCrawl";
import {
  DEFAULT_NAV_THEME,
  useNavTheme,
  type NavTheme,
} from "@/components/jumbotron/NavThemeContext";
import {
  backgroundColorValue,
  backgroundImageValue,
  COLOR_TOKENS,
  type ColorToken,
} from "@/lib/navColorTokens";

/**
 * Live theme controls for the real nav bar's Rest state, per the
 * owner — replaces the old /nav-color-test page entirely. Instead of
 * Claude hand-building a separate comparison page every round, the
 * owner picks a color per property here and the actual site's nav bar
 * updates immediately, "just like light/dark mode... but with more
 * colors and on more elements." Not linked from the real nav (an
 * internal tool, not visitor-facing content) — reachable via the
 * "Nav Settings" quick-link in the main screen's bottom-right corner.
 *
 * Deliberately only touches the Rest state — Hover/Click/Current keep
 * their own designed behavior, unaffected. See `NavThemeContext.tsx`
 * for how the five properties below actually reach `NavBarButton`/
 * `JumbotronFrame` (CSS custom properties, not literal inline styles,
 * so Hover/Click/Current's own higher-specificity CSS rules can still
 * override them normally).
 */
const SETTINGS: { key: keyof NavTheme; label: string }[] = [
  { key: "buttonBackground", label: "Button Background" },
  { key: "fontColor", label: "Font Color" },
  { key: "fontOutlineColor", label: "Font Outline Color" },
  { key: "buttonBorderColor", label: "Button Border Color" },
  { key: "navBarBackground", label: "Nav Bar Background Color" },
];

function ColorSwatchCircle({
  token,
  label,
  selected,
  onSelect,
}: {
  token: ColorToken;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      aria-pressed={selected}
      className={`h-9 w-9 shrink-0 rounded-full border-2 transition-transform sm:h-10 sm:w-10 ${
        selected
          ? "scale-110 border-gt-gold ring-2 ring-gt-gold ring-offset-2 ring-offset-black"
          : "border-white/30 hover:scale-105"
      }`}
      style={{
        backgroundColor: backgroundColorValue(token),
        backgroundImage: backgroundImageValue(token),
      }}
    />
  );
}

export default function NavSettingsPage() {
  const { theme, setThemeProp, resetTheme } = useNavTheme();

  return (
    <JumbotronCrawl>
      <div className="flex min-h-full flex-col items-center gap-8 px-4 py-10 sm:px-8">
        <div className="text-center">
          <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
            Nav Bar Settings
          </h2>
          <p className="gt-led-text-dim mt-2 max-w-md text-balance text-sm text-zinc-400">
            Changes apply to the real nav bar immediately and are remembered on
            this device — nothing here is a preview or a copy.
          </p>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-6">
          {SETTINGS.map((setting) => (
            <div
              key={setting.key}
              className="flex flex-col items-center gap-3 border-b border-white/10 pb-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="gt-led-text-dim text-xs uppercase tracking-[0.2em] text-gt-gray-light/80 sm:text-sm">
                {setting.label}
              </span>
              <div className="flex items-center gap-3">
                {COLOR_TOKENS.map(({ token, label }) => (
                  <ColorSwatchCircle
                    key={token}
                    token={token}
                    label={`${setting.label}: ${label}`}
                    selected={theme[setting.key] === token}
                    onSelect={() => setThemeProp(setting.key, token)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={resetTheme}
          className="gt-jumbotron-btn flex h-9 items-center rounded-full border-2 border-gt-gold bg-gt-navy px-4 text-[10px] font-bold uppercase tracking-wider text-gt-gold sm:text-xs"
        >
          Reset to Defaults
        </button>

        <p className="gt-led-text-dim max-w-md text-balance text-center text-[10px] uppercase tracking-wider text-gt-gray-light/50">
          Default: Button Background {DEFAULT_NAV_THEME.buttonBackground}, Font
          Color {DEFAULT_NAV_THEME.fontColor}, Font Outline Color{" "}
          {DEFAULT_NAV_THEME.fontOutlineColor}, Button Border Color{" "}
          {DEFAULT_NAV_THEME.buttonBorderColor}, Nav Bar Background Color{" "}
          {DEFAULT_NAV_THEME.navBarBackground}.
        </p>
      </div>
    </JumbotronCrawl>
  );
}

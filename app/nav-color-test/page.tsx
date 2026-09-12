import type { CSSProperties } from "react";
import JumbotronCrawl from "@/components/jumbotron/JumbotronCrawl";

/**
 * TEMPORARY page, not linked from the real nav — visit it directly at
 * /nav-color-test. Built so the owner can compare nav-button color
 * combos side by side instead of the real NavBar only ever showing
 * one combo per segment at a time. Delete this whole route once a
 * direction is picked; nothing else in the app depends on it.
 *
 * Rebuilt from scratch per the owner: every earlier test row (Chase
 * Ring/Shine swatches, the Tech Gold reference row, the metallic-vs-
 * current comparison) is gone — this page now shows exactly the three
 * rows of four color-combo swatches the owner specified, styled as
 * exact copies of the real six-segment nav bar's box model/typography
 * (`NavBarButton`'s shape and text treatment) rather than the old
 * pill-shaped `Swatch`. No Chase Ring or Shine on any of these, same
 * as the earlier metallic-comparison row — the only variable here is
 * the four color properties in the owner's spec.
 */

type ColorToken = "grey" | "navy" | "white" | "metallicGold" | "black";

const METALLIC_GOLD_GRADIENT =
  "linear-gradient(135deg, #b39051 0%, #ddc38a 22%, #8a7350 45%, #ddc38a 68%, #b39051 100%)";

// Flat stand-in for "Metallic Gold" wherever a gradient isn't
// practical (a 2px border, a 0.5px text stroke) — same reasoning
// documented in globals.css for the real nav bar: there's no official
// digital value for the metallic ink anyway, and a hairline is too
// thin a surface for banding to read as metallic.
const FLAT_VALUE: Record<ColorToken, string> = {
  grey: "#e5e5e5",
  navy: "#051e39",
  white: "#ffffff",
  metallicGold: "#b39051",
  black: "#000000",
};

function backgroundStyle(token: ColorToken): CSSProperties {
  if (token === "metallicGold") {
    return {
      backgroundImage: METALLIC_GOLD_GRADIENT,
      backgroundColor: "transparent",
    };
  }
  return { backgroundColor: FLAT_VALUE[token], backgroundImage: "none" };
}

function textStyle(
  fontColor: ColorToken,
  fontOutline: ColorToken,
): CSSProperties {
  const stroke: CSSProperties = {
    WebkitTextStroke: `0.5px ${FLAT_VALUE[fontOutline]}`,
  };
  if (fontColor === "metallicGold") {
    return {
      ...stroke,
      backgroundImage: METALLIC_GOLD_GRADIENT,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    };
  }
  return {
    ...stroke,
    backgroundImage: "none",
    color: FLAT_VALUE[fontColor],
    WebkitTextFillColor: FLAT_VALUE[fontColor],
  };
}

/**
 * One swatch, styled as an exact copy of `NavBarButton`'s box model
 * and text treatment (same classes, same `background-clip: text`
 * gradient technique for a "Metallic Gold" fill) but with
 * background/font-color/font-outline/border picked independently via
 * inline styles rather than through the real component's fixed
 * Rest/Hover/Click/Current states — this page needs combinations that
 * don't correspond to any single real state. Plain `span`s, not real
 * links, since these aren't meant to navigate anywhere.
 *
 * `relative z-20` is load-bearing, not decorative: the row wrapper's
 * `.gt-pixel-grid` overlay is `position: absolute` with its own
 * `z-10`, which paints above any non-positioned sibling regardless of
 * DOM order — the exact bug documented repeatedly elsewhere in this
 * codebase (`.gt-jumbotron-btn`'s own `z-index: 20` exists for the
 * same reason). Without it, these swatches read as washed-out/
 * translucent instead of solid, since the dot overlay was painting
 * directly on top of them.
 */
function TestNavButton({
  label,
  background,
  fontColor,
  fontOutline,
  border,
}: {
  label: string;
  background: ColorToken;
  fontColor: ColorToken;
  fontOutline: ColorToken;
  border: ColorToken;
}) {
  return (
    <span
      className="relative z-20 flex h-12 flex-1 items-center justify-center border-2 px-1 text-center sm:h-14"
      style={{
        ...backgroundStyle(background),
        borderColor: FLAT_VALUE[border],
      }}
    >
      <span
        className="pointer-events-none text-[10px] font-black uppercase leading-none tracking-widest sm:text-xs"
        style={textStyle(fontColor, fontOutline)}
      >
        {label}
      </span>
    </span>
  );
}

type TestRow = {
  heading: string;
  // The strip's own panel background (mimics the real nav bar's navy
  // backdrop) — independent of each button's own `background` below.
  // Always navy except for the "duplicate Row 1 on other nav
  // backgrounds" rows the owner asked for.
  panelBackground: ColorToken;
  buttons: {
    label: string;
    background: ColorToken;
    fontColor: ColorToken;
    fontOutline: ColorToken;
    border: ColorToken;
  }[];
};

const LABELS = ["ABOUT", "SCHEDULE", "DONATIONS", "CONTACT"];

// Row 1's three-button pattern, reused as-is across the four
// "duplicate Row 1 on other nav backgrounds" rows below — only the
// panel background changes between them, not the buttons themselves.
// Schedule's swatch was removed entirely, per the owner ("I don't
// like that design"). Contact's colors were corrected, also per the
// owner: Metallic Gold font, Navy font outline, White button border.
const row1Buttons: TestRow["buttons"] = [
  {
    label: LABELS[0],
    background: "grey",
    fontColor: "metallicGold",
    fontOutline: "navy",
    border: "metallicGold",
  },
  {
    // Corrected per the owner: Donations' border is Navy, not
    // Metallic Gold — an error in the original table.
    label: LABELS[2],
    background: "grey",
    fontColor: "metallicGold",
    fontOutline: "navy",
    border: "navy",
  },
  {
    label: LABELS[3],
    background: "grey",
    fontColor: "metallicGold",
    fontOutline: "navy",
    border: "white",
  },
];

// Exactly the owner's table, column by column.
const rows: TestRow[] = [
  {
    heading: "Row 1 Test Buttons",
    panelBackground: "navy",
    buttons: row1Buttons,
  },
  // Four duplicates of Row 1, per the owner, each on a different nav
  // (panel) background — the buttons themselves are identical to Row
  // 1 above, only the strip behind them changes.
  {
    heading: "Row 1 — Grey Nav Background",
    panelBackground: "grey",
    buttons: row1Buttons,
  },
  {
    heading: "Row 1 — Metallic Gold Nav Background",
    panelBackground: "metallicGold",
    buttons: row1Buttons,
  },
  {
    heading: "Row 1 — Navy Nav Background",
    panelBackground: "navy",
    buttons: row1Buttons,
  },
  {
    heading: "Row 1 — Black Nav Background",
    panelBackground: "black",
    buttons: row1Buttons,
  },
  {
    heading: "Row 2 Test Buttons",
    panelBackground: "navy",
    buttons: [
      {
        label: LABELS[0],
        background: "metallicGold",
        fontColor: "white",
        fontOutline: "navy",
        border: "white",
      },
      {
        label: LABELS[1],
        background: "metallicGold",
        fontColor: "navy",
        fontOutline: "white",
        border: "navy",
      },
      {
        label: LABELS[2],
        background: "metallicGold",
        fontColor: "navy",
        fontOutline: "white",
        border: "white",
      },
      {
        label: LABELS[3],
        background: "metallicGold",
        fontColor: "white",
        fontOutline: "navy",
        border: "navy",
      },
    ],
  },
  {
    heading: "Row 3 Test Buttons",
    panelBackground: "navy",
    buttons: [
      {
        label: LABELS[0],
        background: "navy",
        fontColor: "white",
        fontOutline: "metallicGold",
        border: "white",
      },
      {
        label: LABELS[1],
        background: "navy",
        fontColor: "metallicGold",
        fontOutline: "white",
        border: "metallicGold",
      },
      {
        label: LABELS[2],
        background: "navy",
        fontColor: "metallicGold",
        fontOutline: "white",
        border: "white",
      },
      {
        label: LABELS[3],
        background: "navy",
        fontColor: "white",
        fontOutline: "metallicGold",
        border: "metallicGold",
      },
    ],
  },
];

export default function NavColorTestPage() {
  return (
    <JumbotronCrawl>
      {/* pb-32 (not the usual py-10 all around), per the owner: the
          persistent media-controls row + fade sit fixed over the
          bottom of the main screen and don't take up document flow
          height, so without extra clearance here the crawl's own
          max-scroll stops short of the last row and it's stuck partly
          hidden behind the overlay. */}
      <div className="flex min-h-full flex-col items-center gap-10 px-4 pb-32 pt-10 sm:px-8">
        <div className="text-center">
          <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
            Nav Color Test
          </h2>
          <p className="gt-led-text-dim mt-2 max-w-md text-balance text-sm text-zinc-400">
            Temporary comparison page. Not linked in the real nav — this route
            gets deleted once a direction is picked.
          </p>
        </div>

        {rows.map((row) => (
          <div
            key={row.heading}
            className="flex w-full max-w-2xl flex-col gap-3"
          >
            <p className="gt-led-text-dim text-center text-[10px] uppercase tracking-[0.25em] text-gt-gray-light/60 sm:text-xs">
              {row.heading}
            </p>
            {/* Matches the real nav bar's wrapper exactly (thin
                light-gray border, pixel-grid overlay) — per the owner,
                so these swatches read as "on an actual nav bar," not
                floating on the plain black main-screen background.
                border-y here (not the real nav's border-b only) since
                this is a standalone strip, not nested inside the outer
                frame's own border. Panel background is per-row now
                (navy normally, matching the real nav bar — varied for
                the "duplicate Row 1" rows below), so it's an inline
                style rather than the earlier hardcoded bg-gt-navy
                class. */}
            <div
              className="relative flex w-full items-stretch border-y-[1px] border-gt-gray-light sm:border-y-2"
              style={backgroundStyle(row.panelBackground)}
            >
              {row.buttons.map((button, i) => (
                <TestNavButton key={`${row.heading}-${i}`} {...button} />
              ))}
              <div
                aria-hidden
                className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
              />
            </div>
          </div>
        ))}
      </div>
    </JumbotronCrawl>
  );
}

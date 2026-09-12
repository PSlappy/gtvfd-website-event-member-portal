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

type ColorToken = "grey" | "navy" | "white" | "metallicGold";

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
      className="flex h-12 flex-1 items-center justify-center border-2 px-1 text-center sm:h-14"
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
  buttons: {
    label: string;
    background: ColorToken;
    fontColor: ColorToken;
    fontOutline: ColorToken;
    border: ColorToken;
  }[];
};

const LABELS = ["ABOUT", "SCHEDULE", "DONATIONS", "CONTACT"];

// Exactly the owner's table, column by column.
const rows: TestRow[] = [
  {
    heading: "Row 1 Test Buttons",
    buttons: [
      {
        label: LABELS[0],
        background: "grey",
        fontColor: "metallicGold",
        fontOutline: "navy",
        border: "metallicGold",
      },
      {
        label: LABELS[1],
        background: "grey",
        fontColor: "navy",
        fontOutline: "metallicGold",
        border: "navy",
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
        fontColor: "navy",
        fontOutline: "metallicGold",
        border: "metallicGold",
      },
    ],
  },
  {
    heading: "Row 2 Test Buttons",
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
            {/* Matches the real nav bar's wrapper exactly (navy panel,
                thin light-gray border, pixel-grid overlay) — per the
                owner, so these swatches read as "on an actual nav
                bar," not floating on the plain black main-screen
                background. border-y here (not the real nav's border-b
                only) since this is a standalone strip, not nested
                inside the outer frame's own border. */}
            <div className="relative flex w-full items-stretch border-y-[1px] border-gt-gray-light bg-gt-navy sm:border-y-2">
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

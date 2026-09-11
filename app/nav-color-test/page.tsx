import JumbotronButton from "@/components/jumbotron/JumbotronButton";
import JumbotronCrawl from "@/components/jumbotron/JumbotronCrawl";

/**
 * TEMPORARY page, not linked from the real nav — visit it directly at
 * /nav-color-test. Built so the owner can compare nav button color
 * combos side by side (several full rows on screen at once) instead
 * of the actual NavBar only ever showing one combo per page, one at a
 * time. Delete this whole route once a direction is picked; nothing
 * else in the app depends on it.
 */

type ColorKey = "navy" | "white" | "gold";

const BG_CLASS: Record<ColorKey, string> = {
  navy: "bg-gt-navy",
  white: "bg-gt-gray-light",
  gold: "bg-gt-gold",
};

const TEXT_CLASS: Record<ColorKey, string> = {
  navy: "text-gt-navy",
  white: "text-gt-gray-light",
  gold: "text-gt-gold",
};

const CHASE_CLASS: Record<ColorKey, string> = {
  navy: "gt-chase-navy",
  white: "gt-chase-white",
  gold: "", // .gt-chase-ring is gold by default, no modifier needed
};

/**
 * A standalone swatch matching `.gt-jumbotron-btn` + Chase Ring's
 * real markup/classes, but with `bg`/`text`/`chase` picked
 * independently rather than through `JumbotronButton`'s fixed
 * variants — this page needs combinations (e.g. gold background with
 * navy text) that don't exist as real site variants and shouldn't be
 * added there just for a comparison page. Rendered as a plain `span`
 * (not a link) since these aren't meant to navigate anywhere, only to
 * be looked at.
 */
function Swatch({
  label,
  bg,
  text,
  chase,
}: {
  label: string;
  bg: ColorKey;
  text: ColorKey;
  chase: ColorKey;
}) {
  return (
    <span
      className={`gt-jumbotron-btn gt-chase-ring ${CHASE_CLASS[chase]} inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border-2 border-gt-gold px-4 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${BG_CLASS[bg]} ${TEXT_CLASS[text]}`}
    >
      {label}
    </span>
  );
}

type RowCombo = {
  label: string;
  bg: ColorKey;
  text: ColorKey;
  chase: ColorKey;
};

type Row = {
  title: string;
  combos: RowCombo[];
};

const rows: Row[] = [
  {
    title: "Row 1: Navy buttons",
    combos: [
      { label: "About", bg: "navy", text: "white", chase: "white" },
      { label: "Schedule", bg: "navy", text: "gold", chase: "gold" },
      { label: "Donations", bg: "navy", text: "white", chase: "gold" },
      { label: "Book Us", bg: "navy", text: "gold", chase: "white" },
    ],
  },
  {
    title: "Row 2: White buttons",
    combos: [
      { label: "About", bg: "white", text: "gold", chase: "gold" },
      { label: "Schedule", bg: "white", text: "navy", chase: "navy" },
      { label: "Donations", bg: "white", text: "gold", chase: "navy" },
      { label: "Book Us", bg: "white", text: "navy", chase: "gold" },
    ],
  },
  {
    title: "Row 3: Gold buttons",
    combos: [
      { label: "About", bg: "gold", text: "white", chase: "white" },
      { label: "Schedule", bg: "gold", text: "navy", chase: "navy" },
      { label: "Donations", bg: "gold", text: "white", chase: "navy" },
      { label: "Book Us", bg: "gold", text: "navy", chase: "white" },
    ],
  },
];

// Two extra rows, not requested but worth having next to the three
// above: mixing which item gets which bg color (rows 1-3 give every
// item in a row the same background; these vary it), and a version
// using the site's actual current "outline" button (real
// JumbotronButton, not a Swatch) as a baseline to compare all three
// solid options against what's live today.
const mixedBgCombos: (RowCombo & { bg: ColorKey })[] = [
  { label: "About", bg: "navy", text: "white", chase: "gold" },
  { label: "Schedule", bg: "gold", text: "navy", chase: "white" },
  { label: "Donations", bg: "white", text: "navy", chase: "gold" },
  { label: "Book Us", bg: "navy", text: "gold", chase: "navy" },
];

export default function NavColorTestPage() {
  return (
    <JumbotronCrawl>
      <div className="flex min-h-full flex-col items-center gap-10 px-4 py-10 sm:px-8">
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
          <div key={row.title} className="flex w-full max-w-2xl flex-col gap-3">
            <p className="gt-led-text-dim text-center text-[10px] uppercase tracking-[0.25em] text-gt-gray-light/60 sm:text-xs">
              {row.title}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {row.combos.map((combo) => (
                <Swatch key={combo.label} {...combo} />
              ))}
            </div>
          </div>
        ))}

        <div className="flex w-full max-w-2xl flex-col gap-3">
          <p className="gt-led-text-dim text-center text-[10px] uppercase tracking-[0.25em] text-gt-gray-light/60 sm:text-xs">
            Row 4 (extra): mixed backgrounds within one row
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {mixedBgCombos.map((combo) => (
              <Swatch key={combo.label} {...combo} />
            ))}
          </div>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-3">
          <p className="gt-led-text-dim text-center text-[10px] uppercase tracking-[0.25em] text-gt-gray-light/60 sm:text-xs">
            Row 5 (extra): today&rsquo;s live outline style, for reference
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <JumbotronButton
              href="/nav-color-test"
              variant="outline"
              chaseRing
              chaseColor="gold"
            >
              About
            </JumbotronButton>
            <JumbotronButton
              href="/nav-color-test"
              variant="outline"
              chaseRing
              chaseColor="white"
            >
              Schedule
            </JumbotronButton>
            <JumbotronButton
              href="/nav-color-test"
              variant="outline"
              chaseRing
              chaseColor="navy"
            >
              Donations
            </JumbotronButton>
            <JumbotronButton
              href="/nav-color-test"
              variant="outline"
              chaseRing
              chaseColor="gold"
            >
              Book Us
            </JumbotronButton>
          </div>
        </div>
      </div>
    </JumbotronCrawl>
  );
}

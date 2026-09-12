import JumbotronButton from "@/components/jumbotron/JumbotronButton";
import { formatGameDate, getNextHomeGame } from "@/lib/schedule";

/**
 * The persistent bottom info bar: next upcoming home game, split into
 * three panels per the jumbotron sketch (GT / event info / opponent).
 * The bottom bar only ever covers home games — away games don't have a
 * crew tailgate, so there's nothing here for it to show. Lives in the
 * root layout so it stays mounted across page navigation rather than
 * re-rendering per page.
 *
 * TODO(later stage): the left/right team panels are text labels for
 * now. Replace with each team's logo in a 3D floating animation once
 * we have logo assets — noted here rather than built now.
 */
export default function NextEventTicker() {
  const game = getNextHomeGame();

  if (!game) {
    return (
      <div className="gt-depth-panel relative flex items-center justify-center bg-gt-navy px-4 py-3 sm:py-4">
        <span className="gt-led-text-white text-xs font-bold uppercase tracking-[0.2em] text-gt-gray-light sm:text-sm">
          No upcoming home games on the schedule
        </span>
        <div
          aria-hidden
          className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 bg-gt-navy">
      <div className="gt-depth-panel relative flex items-center justify-center border-r-[1px] border-gt-gray-light px-3 py-3 sm:border-r-2 sm:py-4">
        <span className="gt-led-text-gold gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gold sm:text-base">
          GT
        </span>
        <div
          aria-hidden
          className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
        />
      </div>

      <div className="gt-depth-panel relative flex h-full flex-col items-center justify-between border-r-[1px] border-gt-gray-light px-2 py-3 text-center sm:border-r-2 sm:py-4">
        {/* Row 1: date and kickoff time together, larger font */}
        <span className="gt-led-text-white gt-display-in text-xs font-bold text-white sm:text-sm">
          {formatGameDate(game.date)} &bull; Kickoff {game.kickoff}
        </span>
        {/* Row 2: tailgate label and time, same size as row 1 */}
        <span className="gt-led-text-white gt-display-in text-xs font-bold text-white [animation-delay:80ms] sm:text-sm">
          Tailgate: {game.tailgate ? game.tailgateStart : "N/A"}
        </span>
        {/* Row 3: sign-up — only if a tailgate event exists for this game */}
        {game.tailgate && (
          <div className="gt-display-in [animation-delay:160ms]">
            <JumbotronButton href="/signup" variant="gold" chaseRing>
              Sign-Up
            </JumbotronButton>
          </div>
        )}
        <div
          aria-hidden
          className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
        />
      </div>

      <div className="gt-depth-panel relative flex items-center justify-center px-3 py-3 sm:py-4">
        <span className="gt-led-text-white gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gray-light sm:text-base">
          {game.opponent}
        </span>
        <div
          aria-hidden
          className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
        />
      </div>
    </div>
  );
}

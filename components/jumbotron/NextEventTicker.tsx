import JumbotronButton from "@/components/jumbotron/JumbotronButton";
import { formatGameDate, getNextGame, getTeamPanels } from "@/lib/schedule";

/**
 * The persistent bottom info bar: next upcoming game, split into three
 * panels per the jumbotron sketch. Home team sits on the left panel,
 * visiting team on the right — so GT's side flips between home and
 * away games. Lives in the root layout so it stays mounted across page
 * navigation rather than re-rendering per page.
 *
 * TODO(later stage): the left/right team panels are text labels for
 * now. Replace with each team's logo in a 3D floating animation once
 * we have logo assets — noted here rather than built now.
 */
export default function NextEventTicker() {
  const game = getNextGame();

  if (!game) {
    return (
      <div className="flex items-center justify-center bg-gt-navy px-4 py-3 sm:py-4">
        <span className="gt-led-text-white text-xs font-bold uppercase tracking-[0.2em] text-gt-gray-light sm:text-sm">
          No upcoming games on the schedule
        </span>
      </div>
    );
  }

  const { left, right } = getTeamPanels(game);

  return (
    <div className="grid grid-cols-3 bg-gt-navy">
      <div className="flex items-center justify-center border-r-[3px] border-gt-gold px-3 py-3 sm:border-r-4 sm:py-4">
        <span className="gt-led-text-gold gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gold sm:text-base">
          {left}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 border-r-[3px] border-gt-gold px-2 py-2 text-center sm:border-r-4 sm:py-3">
        {/* Row 1: day, date */}
        <span className="gt-led-text-white gt-display-in text-xs font-bold text-white sm:text-sm">
          {formatGameDate(game.date)}
        </span>
        {/* Row 2: kickoff time or TBD */}
        <span className="gt-display-in text-[9px] uppercase tracking-[0.15em] text-gt-gray-light/70 [animation-delay:80ms] sm:text-[10px]">
          Kickoff {game.kickoff}
        </span>
        {/* Row 3: tailgate time, or no tailgate — set by the admin
            portal once an event exists for this game (stage 8) */}
        <span className="gt-display-in text-[9px] uppercase tracking-[0.15em] text-gt-gray-light/70 [animation-delay:160ms] sm:text-[10px]">
          {game.tailgate ? `Tailgate ${game.tailgateStart}` : "No Tailgate"}
        </span>
        {/* Row 4: sign-up — only if a tailgate event exists for this game */}
        {game.tailgate && (
          <div className="gt-display-in [animation-delay:240ms]">
            <JumbotronButton href="/signup" variant="gold">
              Sign-Up
            </JumbotronButton>
          </div>
        )}
        {/* Row 5: always shown */}
        <div className="gt-display-in [animation-delay:320ms]">
          <JumbotronButton href="/schedule" variant="navy">
            Full Schedule
          </JumbotronButton>
        </div>
      </div>

      <div className="flex items-center justify-center px-3 py-3 sm:py-4">
        <span className="gt-led-text-white gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gray-light sm:text-base">
          {right}
        </span>
      </div>
    </div>
  );
}

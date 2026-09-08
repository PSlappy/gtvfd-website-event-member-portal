import { formatGameDate, getNextTailgate } from "@/lib/schedule";

/**
 * The persistent bottom info bar: next upcoming tailgate, split into
 * three panels (home team / event info / opponent) per the jumbotron
 * sketch. Lives in the root layout so it stays mounted across page
 * navigation rather than re-rendering per page.
 */
export default function NextEventTicker() {
  const game = getNextTailgate();

  if (!game) {
    return (
      <div className="flex items-center justify-center bg-gt-navy px-4 py-3 sm:py-4">
        <span className="gt-led-text-white text-xs font-bold uppercase tracking-[0.2em] text-gt-gray-light sm:text-sm">
          No upcoming tailgates on the schedule
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 bg-gt-navy">
      <div className="flex items-center justify-center border-r-[3px] border-gt-gold px-3 py-3 sm:border-r-4 sm:py-4">
        <span className="gt-led-text-gold gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gold sm:text-base">
          GT
        </span>
      </div>

      <div className="flex flex-col items-center justify-center gap-0.5 border-r-[3px] border-gt-gold px-2 py-2 text-center sm:border-r-4 sm:py-3">
        <span className="gt-display-in text-[9px] uppercase tracking-[0.2em] text-gt-gray-light/60 sm:text-[10px]">
          Next Tailgate
        </span>
        <span className="gt-led-text-white gt-display-in text-xs font-bold text-white [animation-delay:80ms] sm:text-sm">
          {formatGameDate(game.date)}
        </span>
        <span className="gt-display-in text-[9px] uppercase tracking-[0.1em] text-gt-gray-light/70 [animation-delay:160ms] sm:text-[10px]">
          Kickoff {game.kickoff} &middot; Tailgate {game.tailgateStart}
        </span>
        <span className="gt-display-in hidden text-[9px] uppercase tracking-[0.1em] text-gt-gray-light/50 [animation-delay:240ms] sm:block sm:text-[10px]">
          {game.address}
        </span>
      </div>

      <div className="flex items-center justify-center px-3 py-3 sm:py-4">
        <span className="gt-led-text-white gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gray-light sm:text-base">
          {game.opponent}
        </span>
      </div>
    </div>
  );
}

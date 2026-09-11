import JumbotronButton from "@/components/jumbotron/JumbotronButton";
import JumbotronCrawl from "@/components/jumbotron/JumbotronCrawl";
import Typewriter from "@/components/jumbotron/Typewriter";
import { formatGameDate, getNextHomeGame, schedule2026 } from "@/lib/schedule";

/**
 * Only home games are shown here — those are the only ones with a
 * crew tailgate. schedule2026 itself still holds the full season
 * (away games included) as the source of truth; this page just
 * filters down to what's relevant to display.
 */
const homeGames = schedule2026.filter((game) => game.location === "Home");

export default function SchedulePage() {
  const nextHome = getNextHomeGame();

  return (
    <JumbotronCrawl>
      <div className="flex min-h-full flex-col items-center gap-6 px-4 py-10 sm:px-8">
        <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
          <Typewriter text="2026 Schedule" startDelay={700} />
        </h2>
        <p className="gt-led-text-dim gt-display-in max-w-lg text-balance text-left text-sm text-zinc-400 [animation-delay:80ms]">
          <Typewriter
            text="Home games only, since those are the only ones with a crew tailgate. Kickoff times show as TBD until the conference announces them. Sign-Up will appear once the admin portal has a tailgate event created for that game."
            speed={32}
          />
        </p>

        <div className="gt-display-in gt-led-border-gold gt-depth-panel w-full max-w-2xl overflow-x-auto rounded-lg border-2 border-gt-gold [animation-delay:160ms]">
          <table className="w-full min-w-[520px] border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-gt-navy text-gt-gray-light">
                <th className="gt-led-text-gold px-3 py-2 font-bold uppercase tracking-wider text-gt-gold">
                  Date
                </th>
                <th className="gt-led-text-gold px-3 py-2 font-bold uppercase tracking-wider text-gt-gold">
                  Opponent
                </th>
                <th className="gt-led-text-gold px-3 py-2 font-bold uppercase tracking-wider text-gt-gold">
                  Kickoff
                </th>
                <th className="gt-led-text-gold px-3 py-2 font-bold uppercase tracking-wider text-gt-gold">
                  Tailgate
                </th>
                <th className="gt-led-text-gold px-3 py-2 font-bold uppercase tracking-wider text-gt-gold" />
              </tr>
            </thead>
            <tbody>
              {homeGames.map((game, i) => {
                const isNext = nextHome?.date === game.date;
                return (
                  <tr
                    key={game.date}
                    className={`border-t ${
                      isNext
                        ? "border-gt-gold bg-gt-gold/10"
                        : `border-gt-gold/40 ${i % 2 === 0 ? "bg-black" : "bg-zinc-950"}`
                    }`}
                  >
                    <td className="px-3 py-2">
                      <span className="gt-led-text-white font-bold text-white">
                        {formatGameDate(game.date)}
                      </span>
                      {isNext && (
                        <span className="gt-led-text-gold ml-2 rounded border border-gt-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gt-gold">
                          Next
                        </span>
                      )}
                    </td>
                    <td className="gt-led-text-dim px-3 py-2 text-white">
                      {game.opponent}
                    </td>
                    <td className="gt-led-text-dim px-3 py-2 text-gt-gray-light/80">
                      {game.kickoff}
                    </td>
                    <td className="gt-led-text-dim px-3 py-2 text-gt-gray-light/80">
                      {game.tailgate ? game.tailgateStart : "No Tailgate"}
                    </td>
                    <td className="px-3 py-2">
                      {game.tailgate && (
                        <JumbotronButton href="/signup" variant="gold">
                          Sign-Up
                        </JumbotronButton>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </JumbotronCrawl>
  );
}

import JumbotronButton from "@/components/jumbotron/JumbotronButton";
import { formatGameDate, schedule2026 } from "@/lib/schedule";

export default function SchedulePage() {
  return (
    <div className="flex min-h-full flex-col items-center gap-6 px-4 py-10 sm:px-8">
      <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
        2026 Schedule
      </h2>
      <p className="gt-display-in max-w-lg text-balance text-center text-sm text-zinc-400 [animation-delay:80ms]">
        Kickoff times below show as TBD until the conference announces
        them. Sign-Up only appears on games with a tailgate.
      </p>

      <div className="gt-display-in w-full max-w-2xl overflow-x-auto rounded-lg border-2 border-gt-gold [animation-delay:160ms]">
        <table className="w-full min-w-[560px] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-gt-navy text-gt-gray-light">
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Opponent
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Location
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Kickoff
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider">
                Tailgate
              </th>
              <th className="px-3 py-2 font-bold uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody>
            {schedule2026.map((game, i) => (
              <tr
                key={game.date}
                className={`border-t border-gt-gold/40 ${
                  i % 2 === 0 ? "bg-black" : "bg-zinc-950"
                }`}
              >
                <td className="px-3 py-2 text-white">
                  {formatGameDate(game.date)}
                </td>
                <td className="px-3 py-2 text-white">{game.opponent}</td>
                <td className="px-3 py-2 text-gt-gray-light/80">
                  {game.location}
                </td>
                <td className="px-3 py-2 text-gt-gray-light/80">
                  {game.kickoff}
                </td>
                <td className="px-3 py-2 text-gt-gray-light/80">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * 2026 GT football schedule (kickoff times not yet announced by the
 * conference as of this writing — treat as TBD until updated closer to
 * each game). This is the placeholder data source for stage 2; it gets
 * replaced by the real `events` table (see the admin panel data model
 * in CLAUDE.md) once the member portal ships in stage 8.
 */
type RawGame = {
  date: string; // ISO yyyy-mm-dd
  opponent: string;
  location: "Home" | "Away";
};

const rawSchedule2026: RawGame[] = [
  { date: "2026-09-05", opponent: "Colorado", location: "Home" },
  { date: "2026-09-12", opponent: "Tennessee", location: "Home" },
  { date: "2026-09-19", opponent: "Mercer", location: "Home" },
  { date: "2026-09-26", opponent: "Stanford", location: "Away" },
  { date: "2026-10-10", opponent: "Duke", location: "Home" },
  { date: "2026-10-17", opponent: "Virginia Tech", location: "Away" },
  { date: "2026-10-21", opponent: "Pitt", location: "Away" },
  { date: "2026-10-24", opponent: "Boston College", location: "Home" },
  { date: "2026-11-07", opponent: "Louisville", location: "Home" },
  { date: "2026-11-14", opponent: "Clemson", location: "Away" },
  { date: "2026-11-21", opponent: "Wake Forest", location: "Home" },
  { date: "2026-11-28", opponent: "Georgia", location: "Away" },
];

export type ScheduleGame = RawGame & {
  /** Placeholder assumption: the crew tailgates home games only. Real
   * per-event tailgate status will be admin-set once the events table
   * exists. */
  tailgate: boolean;
  kickoff: string;
  tailgateStart: string;
  address: string;
};

export const schedule2026: ScheduleGame[] = rawSchedule2026.map((game) => ({
  ...game,
  tailgate: game.location === "Home",
  kickoff: "TBD",
  tailgateStart: "TBD",
  address: "TBD",
}));

export function getNextTailgate(
  referenceDate: Date = new Date(),
): ScheduleGame | null {
  const todayStr = referenceDate.toISOString().slice(0, 10);
  const upcoming = schedule2026
    .filter((game) => game.tailgate && game.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? null;
}

export function formatGameDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

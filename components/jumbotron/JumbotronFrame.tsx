import type { ReactNode } from "react";

/**
 * Full-viewport shell styled like a stadium video board. The outer page
 * never scrolls — if a page's content overflows, the main display area
 * scrolls internally while the bezel and bottom bar stay fixed.
 */
export default function JumbotronFrame({
  main,
  bottomBar,
}: {
  main: ReactNode;
  bottomBar: ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-2 sm:p-4 md:p-6">
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border-4 border-zinc-700 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_0_60px_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-[6px]"
        style={{
          boxShadow:
            "inset 0 0 0 2px rgba(255,255,255,0.05), inset 0 2px 12px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.9)",
        }}
      >
        {/* screen */}
        <div className="relative m-1.5 flex flex-1 flex-col overflow-hidden rounded-lg bg-black sm:m-2">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">{main}</div>
          <div className="shrink-0 border-t-2 border-zinc-800 bg-zinc-950">
            {bottomBar}
          </div>
        </div>
      </div>
    </div>
  );
}

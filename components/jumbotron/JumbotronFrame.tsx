import type { ReactNode } from "react";

/**
 * Full-viewport shell styled like a stadium video board: a nav bar strip,
 * a persistent home-team brand strip (like the school name across the
 * top of a real scoreboard), the main screen, and a bottom info bar
 * split into three panels (home team / event info / opponent). The
 * outer page never scrolls — if a page's content overflows, only the
 * main screen scrolls internally, while the frame, nav bar, brand
 * strip, and bottom bar stay fixed.
 */
export default function JumbotronFrame({
  nav,
  brand,
  main,
  bottomBarLeft,
  bottomBarCenter,
  bottomBarRight,
}: {
  nav: ReactNode;
  brand: ReactNode;
  main: ReactNode;
  bottomBarLeft: ReactNode;
  bottomBarCenter: ReactNode;
  bottomBarRight: ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-2 sm:p-4">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md border-[3px] border-gt-gold bg-black sm:border-4">
        {/* nav bar */}
        <div className="flex shrink-0 items-center justify-center border-b-[3px] border-gt-gold bg-gt-navy px-4 py-3 sm:border-b-4 sm:py-4">
          {nav}
        </div>

        {/* home-team brand strip */}
        <div className="flex shrink-0 items-center justify-center border-b-[3px] border-gt-gold bg-black px-4 py-4 sm:border-b-4 sm:py-6">
          {brand}
        </div>

        {/* main screen */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-black">
          {main}
        </div>

        {/* bottom info bar: home team / event info / opponent */}
        <div className="grid shrink-0 grid-cols-3 border-t-[3px] border-gt-gold bg-gt-navy sm:border-t-4">
          <div className="flex items-center justify-center border-r-[3px] border-gt-gold px-3 py-3 sm:border-r-4 sm:py-4">
            {bottomBarLeft}
          </div>
          <div className="flex items-center justify-center border-r-[3px] border-gt-gold px-3 py-3 sm:border-r-4 sm:py-4">
            {bottomBarCenter}
          </div>
          <div className="flex items-center justify-center px-3 py-3 sm:py-4">
            {bottomBarRight}
          </div>
        </div>
      </div>
    </div>
  );
}

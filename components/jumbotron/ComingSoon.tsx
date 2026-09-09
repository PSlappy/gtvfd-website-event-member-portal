import type { ReactNode } from "react";

/**
 * Shared placeholder for nav destinations whose real content hasn't
 * been built yet (stages 5-8). Keeps every "not built yet" page
 * consistent instead of hand-rolling the same markup per route.
 */
export default function ComingSoon({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
        {title}
      </h2>
      <p className="gt-display-in max-w-md text-balance text-zinc-400 [animation-delay:80ms]">
        {children}
      </p>
    </div>
  );
}

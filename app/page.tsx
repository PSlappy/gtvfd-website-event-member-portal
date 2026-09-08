export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="gt-led-text-gold gt-display-in max-w-md text-sm uppercase tracking-[0.3em] text-gt-gold [animation-delay:240ms] sm:text-base">
        Stage 2 &mdash; Next Event Ticker
      </p>
      <p className="gt-display-in max-w-lg text-balance text-zinc-400 [animation-delay:360ms]">
        This is placeholder content standing in for the home page. The
        bottom bar below now pulls the next upcoming tailgate from the 2026
        schedule instead of showing static placeholder text.
      </p>
      <div className="gt-display-in mt-8 h-[60vh] w-full max-w-md rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-6 text-left text-sm text-zinc-400 [animation-delay:480ms]">
        Scroll test block &mdash; this box exists only to make the main
        display taller than the visible frame, so we can confirm the screen
        area scrolls internally while the bezel and bottom bar stay put.
      </div>
    </div>
  );
}

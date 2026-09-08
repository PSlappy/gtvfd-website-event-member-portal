import JumbotronFrame from "@/components/jumbotron/JumbotronFrame";

export default function Home() {
  return (
    <JumbotronFrame
      nav={
        <span className="gt-led-text-white gt-display-in text-xs font-bold uppercase tracking-[0.3em] text-gt-gray-light sm:text-sm">
          Navigation Bar &mdash; coming in stage 4
        </span>
      }
      brand={
        <h1 className="gt-led-text-gold gt-display-in text-3xl font-black uppercase tracking-widest text-gt-gold [animation-delay:120ms] sm:text-5xl">
          Ramblin&rsquo; Wreck
        </h1>
      }
      main={
        <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <p className="gt-led-text-gold gt-display-in text-sm uppercase tracking-[0.3em] text-gt-gold [animation-delay:240ms] max-w-md sm:text-base">
            Stage 1 &mdash; Jumbotron Frame Shell
          </p>
          <p className="gt-display-in max-w-lg text-balance text-zinc-400 [animation-delay:360ms]">
            This is placeholder content standing in for the home page while
            the frame, bezel, and internal scroll behavior are proved out.
            The outer browser viewport should never scroll &mdash; only this
            inner display area does, once content overflows it.
          </p>
          <div className="gt-display-in mt-8 h-[60vh] w-full max-w-md rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-6 text-left text-sm text-zinc-400 [animation-delay:480ms]">
            Scroll test block &mdash; this box exists only to make the main
            display taller than the visible frame, so we can confirm the
            screen area scrolls internally while the bezel and bottom bar
            stay put.
          </div>
        </div>
      }
      bottomBarLeft={
        <span className="gt-led-text-gold gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gold [animation-delay:560ms] sm:text-sm">
          GT
        </span>
      }
      bottomBarCenter={
        <span className="gt-display-in text-center text-[10px] uppercase leading-tight tracking-[0.15em] text-gt-gray-light/70 [animation-delay:560ms] sm:text-xs">
          Next event ticker
          <br />
          coming in stage 2
        </span>
      }
      bottomBarRight={
        <span className="gt-led-text-white gt-display-in text-xs font-bold uppercase tracking-[0.2em] text-gt-gray-light [animation-delay:560ms] sm:text-sm">
          Opponent
        </span>
      }
    />
  );
}

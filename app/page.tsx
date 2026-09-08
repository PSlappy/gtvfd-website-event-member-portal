import JumbotronFrame from "@/components/jumbotron/JumbotronFrame";

export default function Home() {
  return (
    <JumbotronFrame
      nav={
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 sm:text-sm">
          Navigation Bar &mdash; coming in stage 4
        </span>
      }
      brand={
        <h1 className="text-3xl font-black uppercase tracking-widest text-white sm:text-5xl">
          Ramblin&rsquo; Wreck
        </h1>
      }
      main={
        <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <p className="max-w-md text-sm uppercase tracking-[0.3em] text-zinc-400 sm:text-base">
            Stage 1 &mdash; Jumbotron Frame Shell
          </p>
          <p className="max-w-lg text-balance text-zinc-500">
            This is placeholder content standing in for the home page while
            the frame, bezel, and internal scroll behavior are proved out.
            The outer browser viewport should never scroll &mdash; only this
            inner display area does, once content overflows it.
          </p>
          <div className="mt-8 h-[60vh] w-full max-w-md rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-6 text-left text-sm text-zinc-500">
            Scroll test block &mdash; this box exists only to make the main
            display taller than the visible frame, so we can confirm the
            screen area scrolls internally while the bezel and bottom bar
            stay put.
          </div>
        </div>
      }
      bottomBarLeft={
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 sm:text-sm">
          GT
        </span>
      }
      bottomBarCenter={
        <span className="text-center text-[10px] uppercase leading-tight tracking-[0.15em] text-zinc-400 sm:text-xs">
          Next event ticker
          <br />
          coming in stage 2
        </span>
      }
      bottomBarRight={
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 sm:text-sm">
          Opponent
        </span>
      }
    />
  );
}

import Typewriter from "@/components/jumbotron/Typewriter";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-10 text-center">
      <p className="gt-led-text-gold gt-display-in text-sm uppercase tracking-[0.3em] text-gt-gold sm:text-base">
        <Typewriter text="Stage 3: Instagram Carousel" startDelay={700} />
      </p>
      <p className="gt-display-in max-w-lg text-balance text-zinc-400 [animation-delay:80ms]">
        <Typewriter
          text="Waiting on Instagram Graph API credentials before building this out. Instagram’s public embed widget only works for the profile card, not individual posts, so the real per-post carousel needs a proper API connection instead."
          speed={42}
        />
      </p>
    </div>
  );
}

import JumbotronCrawl from "./JumbotronCrawl";
import Typewriter from "./Typewriter";

/**
 * Shared placeholder for nav destinations whose real content hasn't
 * been built yet (stages 5-8). Keeps every "not built yet" page
 * consistent instead of hand-rolling the same markup per route.
 *
 * `title`/`description` are plain strings (not children) so both can
 * be typed out with `Typewriter` on first display.
 */
export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <JumbotronCrawl>
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-16">
        <h2 className="gt-font-header gt-led-text-gold gt-display-in text-center text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
          <Typewriter text={title} startDelay={700} />
        </h2>
        <p className="gt-display-in max-w-md text-left text-balance text-zinc-400 [animation-delay:80ms]">
          <Typewriter text={description} speed={35} />
        </p>
      </div>
    </JumbotronCrawl>
  );
}

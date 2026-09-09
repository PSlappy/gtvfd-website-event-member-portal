import PlayerCard from "@/components/jumbotron/PlayerCard";

const sourceArticles = [
  {
    source: "ramblinwreck.com",
    title: "Converted Fire Truck to Real, Live Ramblin' Wreck",
    description:
      "The original 2014 story on how the truck got its start and its name.",
    href: "https://ramblinwreck.com/news/2014/08/27/converted-fire-truck-to-real-live-ramblin-wreck",
  },
  {
    source: "Atlanta Journal-Constitution",
    title: "Georgia Tech vs. Miami Tailgating",
    description:
      "AJC coverage of the truck out on the lot on a GT tailgate Saturday.",
    href: "https://www.ajc.com/sports/college/georgia-tech-miami-tailgating/GZGUnG68nSSbPVL7rXgg6N/",
  },
  {
    source: "The Wall Street Journal",
    title: "Georgia Tech and a Real, Live Ramblin' Wreck",
    description: "WSJ feature on the tailgate firetruck (subscription).",
    href: "https://www.wsj.com/articles/georgia-tech-and-a-real-live-ramblin-wreck-1409084402",
  },
  {
    source: "The Wall Street Journal",
    title: "My Ride: A Ramblin' Wreck to Georgia Tech",
    description: "WSJ's \"My Ride\" column on the truck (subscription).",
    href: "https://www.wsj.com/articles/my-ride-a-ramblin-wreck-to-georgia-tech-1409083358",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col items-center gap-10 px-4 py-10 sm:px-8">
      <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
        About &amp; History
      </h2>

      <div className="gt-display-in max-w-2xl space-y-4 text-balance text-zinc-300 [animation-delay:80ms]">
        <p>
          The tailgate crew&rsquo;s tradition goes back to 2008, but the
          truck itself joined a few years later. In 2014, Georgia Tech
          alum Sam Huffman found a 1977 fire engine listed on eBay out of
          Indiana and bought it for $2,800. He and his friends spent the
          offseason turning it into a rolling tailgate rig &mdash; a
          working keg, a sound system, a deck welded onto the bed &mdash;
          and started driving it to games as &ldquo;the Grant Field
          Volunteer Fire Department,&rdquo; a nod to Georgia Tech&rsquo;s
          engineering reputation.
        </p>
        <p>
          Early press coverage disagreed on the exact make &mdash; one
          article called it a Pierce, another a Ford &mdash; but the
          crew&rsquo;s own records put it at a 1977 Ford C-802.
        </p>
        <p>
          The truck has been passed down through a rotating cast of
          tailgate regulars ever since. Patrick Shea and Harry Rizvi now
          keep it running and parked outside Bobby Dodd Stadium every home
          game.
        </p>
      </div>

      <div className="gt-display-in grid w-full max-w-3xl grid-cols-1 gap-3 [animation-delay:160ms] sm:grid-cols-2">
        {sourceArticles.map((article) => (
          <a
            key={article.href}
            href={article.href}
            target="_blank"
            rel="noopener noreferrer"
            className="gt-jumbotron-btn block rounded-lg border-2 border-gt-gold bg-black/60 p-4 transition-colors hover:bg-gt-navy/60"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gt-gold">
              {article.source}
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              {article.title}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {article.description}
            </p>
          </a>
        ))}
      </div>

      <div className="gt-display-in flex flex-col items-center gap-4 [animation-delay:240ms]">
        <p className="text-sm uppercase tracking-[0.3em] text-gt-gold">
          Current Owners
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <PlayerCard name="Patrick Shea" role="Owner" />
          <PlayerCard name="Harry Rizvi" role="Owner" />
        </div>
      </div>

      <div className="gt-display-in flex flex-col items-center gap-4 pb-6 [animation-delay:320ms]">
        <p className="text-sm uppercase tracking-[0.3em] text-gt-gold">
          Previous Owners &amp; Founders
        </p>
        <PlayerCard name="Names Coming Soon" role="Founding Crew" />
      </div>
    </div>
  );
}

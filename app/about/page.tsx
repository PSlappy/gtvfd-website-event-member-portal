import JumbotronCrawl from "@/components/jumbotron/JumbotronCrawl";
import PlayerCard from "@/components/jumbotron/PlayerCard";
import Typewriter from "@/components/jumbotron/Typewriter";

const sourceArticles = [
  {
    source: "ramblinwreck.com",
    logo: "RW",
    title: "Converted Fire Truck to Real, Live Ramblin' Wreck",
    description:
      "The original 2014 story on how the truck got its start and its name.",
    href: "https://ramblinwreck.com/news/2014/08/27/converted-fire-truck-to-real-live-ramblin-wreck",
  },
  {
    source: "Atlanta Journal-Constitution",
    logo: "AJC",
    title: "Georgia Tech vs. Miami Tailgating",
    description:
      "AJC coverage of the truck out on the lot on a GT tailgate Saturday.",
    href: "https://www.ajc.com/sports/college/georgia-tech-miami-tailgating/GZGUnG68nSSbPVL7rXgg6N/",
  },
  {
    source: "The Wall Street Journal",
    logo: "WSJ",
    title: "Georgia Tech and a Real, Live Ramblin' Wreck",
    description: "WSJ feature on the tailgate firetruck (subscription).",
    href: "https://www.wsj.com/articles/georgia-tech-and-a-real-live-ramblin-wreck-1409084402",
  },
  {
    source: "The Wall Street Journal",
    logo: "WSJ",
    title: "My Ride: A Ramblin' Wreck to Georgia Tech",
    description: "WSJ's \"My Ride\" column on the truck (subscription).",
    href: "https://www.wsj.com/articles/my-ride-a-ramblin-wreck-to-georgia-tech-1409083358",
  },
];

export default function AboutPage() {
  return (
    <JumbotronCrawl>
      <div className="flex flex-col items-center gap-10 px-4 pb-24 pt-10 sm:px-8">
        <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
          <Typewriter text="About & History" startDelay={700} />
        </h2>

        <div className="gt-led-text-dim gt-display-in max-w-2xl space-y-4 text-balance text-left text-zinc-300 [animation-delay:80ms]">
          <p>
            <Typewriter
              speed={29}
              text="The tailgate tradition dates back to 2008. In 2014, Georgia Tech alumni Sam Huffman and Christian Shea found a 1977 Ford fire engine listed on eBay out of Indiana and bought it for $2,800. They spent the offseason turning it into a rolling tailgate rig: a working keg, a sound system, and a deck welded onto the bed, then started driving it to games as “the Grant Field Volunteer Fire Department,” a nod to Georgia Tech’s engineering reputation."
            />
          </p>
          <p>
            <Typewriter
              speed={29}
              text="As the years went on, the original owners got older, started families, and had less time to manage tailgates and keep the truck running, so they started looking to pass it down. Patrick Shea, Christian’s younger brother, had grown up around the group of GT alumni who owned and supported the tailgate, and had been attending with Harry Rizvi, his best friend since they were five years old, since the tradition began. When Patrick and Harry said they wanted to keep it in the family, Sam sold them the truck for $1,000 in October 2021, and they spent that offseason getting it ready for the 2022 season."
            />
          </p>
          <p>
            <Typewriter
              speed={29}
              text="Since taking over, Patrick and Harry have kept upgrading it: a new stereo system, three TVs, turf on the upper deck, 1996 Atlanta Olympic Stadium seats in place of the old bench seating, retractable awnings, and a steady stream of mechanical maintenance to keep a 50 year old fire engine road ready."
            />
          </p>
        </div>

        <div className="gt-display-in flex flex-col items-center gap-4 [animation-delay:160ms]">
          <p className="text-center text-sm uppercase tracking-[0.3em] text-gt-gold">
            <Typewriter text="Current Owners" speed={60} />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <PlayerCard firstName="Patrick" lastName="Shea" role="Owner" />
            <PlayerCard firstName="Harry" lastName="Rizvi" role="Owner" />
          </div>
        </div>

        <div className="gt-display-in flex flex-col items-center gap-4 [animation-delay:240ms]">
          <p className="text-center text-sm uppercase tracking-[0.3em] text-gt-gold">
            <Typewriter text="Founders, Previous Owners & Donors" speed={60} />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <PlayerCard firstName="Sam" lastName="Huffman" role="Founder" />
            <PlayerCard
              firstName="Christian"
              lastName="Shea"
              role="Founder"
            />
          </div>
        </div>

        <div className="gt-display-in flex flex-col items-center gap-4 [animation-delay:320ms]">
          <p className="text-center text-sm uppercase tracking-[0.3em] text-gt-gold">
            <Typewriter text="Featured In" speed={60} />
          </p>
          <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            {sourceArticles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="gt-jumbotron-btn gt-depth-panel flex items-start gap-3 rounded-lg border-2 border-gt-gold bg-black/60 p-4 transition-colors hover:bg-gt-navy/60"
              >
                <span className="gt-led-text-gold flex h-9 w-9 shrink-0 items-center justify-center rounded border border-gt-gold/70 bg-gt-navy text-[10px] font-black tracking-tight text-gt-gold">
                  {article.logo}
                </span>
                <span>
                  <span className="gt-led-text-gold block text-[10px] font-bold uppercase tracking-[0.2em] text-gt-gold">
                    {article.source}
                  </span>
                  <span className="gt-led-text-white mt-1 block text-sm font-bold text-white">
                    {article.title}
                  </span>
                  <span className="gt-led-text-dim mt-1 block text-xs text-zinc-400">
                    {article.description}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </JumbotronCrawl>
  );
}

import type { Metadata } from "next";
import { Bebas_Neue, Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import JumbotronFrame from "@/components/jumbotron/JumbotronFrame";
import NavBar from "@/components/jumbotron/NavBar";
import NextEventTicker from "@/components/jumbotron/NextEventTicker";
import PageTransition from "@/components/jumbotron/PageTransition";

// GT Athletics' real brand typefaces — Proxima Nova (body copy) and
// Zuume Cut (headers/call-outs) — are both commercial, not on Google
// Fonts, and there's no license/font files for them yet. These two
// free Google Fonts stand in for now (Work Sans: similar humanist-
// sans proportions to Proxima Nova; Bebas Neue: a condensed athletic
// display face in the same family as Zuume Cut's stadium-signage
// feel) — see the `--font-body`/`--font-header` stacks in globals.css
// for how this swaps to the real fonts automatically once they're
// available, with zero changes needed here.
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ramblin' Wreck Firetruck | GT Tailgate Crew",
  description:
    "The Georgia Tech tailgate crew's converted firetruck. Not an official Georgia Tech site.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${bebasNeue.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-black">
        <JumbotronFrame
          nav={<NavBar />}
          brand={
            <h1 className="gt-font-header gt-led-text-gold gt-display-in text-3xl font-black uppercase tracking-widest text-gt-gold [animation-delay:120ms] sm:text-5xl">
              Ramblin&rsquo; Wreck
            </h1>
          }
          main={<PageTransition>{children}</PageTransition>}
          bottomBar={<NextEventTicker />}
        />
      </body>
    </html>
  );
}

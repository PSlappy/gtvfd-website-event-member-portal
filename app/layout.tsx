import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import JumbotronFrame from "@/components/jumbotron/JumbotronFrame";
import NavBar from "@/components/jumbotron/NavBar";
import NextEventTicker from "@/components/jumbotron/NextEventTicker";
import PageTransition from "@/components/jumbotron/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-black">
        <JumbotronFrame
          nav={<NavBar />}
          brand={
            <h1 className="gt-led-text-gold gt-display-in text-3xl font-black uppercase tracking-widest text-gt-gold [animation-delay:120ms] sm:text-5xl">
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

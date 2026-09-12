"use client";

import { useState } from "react";
import { fieldClass, labelClass } from "@/lib/formStyles";
import JumbotronCrawl from "@/components/jumbotron/JumbotronCrawl";
import Typewriter from "@/components/jumbotron/Typewriter";

const eventTypes = ["Wedding", "Parade", "Birthday", "Other"] as const;

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <JumbotronCrawl>
        <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-16">
          <h2 className="gt-font-header gt-led-text-gold gt-display-in text-center text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
            Thanks
          </h2>
          <p className="gt-display-in max-w-md text-left text-balance text-zinc-400 [animation-delay:80ms]">
            This form isn&rsquo;t connected to actually send anywhere yet, that
            part&rsquo;s still being built. In the meantime, reach out via{" "}
            <a
              href="https://www.instagram.com/ramblin_wrekd/"
              target="_blank"
              rel="noopener noreferrer"
              className="gt-led-text-gold text-gt-gold underline"
            >
              @ramblin_wrekd
            </a>{" "}
            on Instagram.
          </p>
        </div>
      </JumbotronCrawl>
    );
  }

  return (
    <JumbotronCrawl>
      <div className="flex min-h-full flex-col items-center gap-6 px-4 py-10 sm:px-8">
        <h2 className="gt-font-header gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
          <Typewriter text="Book Us" startDelay={700} />
        </h2>
        <p className="gt-led-text-dim gt-display-in max-w-md text-balance text-left text-sm text-zinc-400 [animation-delay:80ms]">
          <Typewriter
            text="We’ll bring the firetruck to your wedding, parade, birthday, or other paid event outside of tailgates, tell us about it below."
            speed={35}
          />
        </p>

        <form
          onSubmit={handleSubmit}
          className="gt-display-in w-full max-w-md space-y-4 [animation-delay:160ms]"
        >
          <div>
            <label className={labelClass} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="eventType">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              className={fieldClass}
              required
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="eventDate">
                Event Date
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                required
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="guestCount">
                Guest Count
              </label>
              <input
                id="guestCount"
                name="guestCount"
                type="number"
                min={0}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="location">
              Event Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="details">
              Additional Details
            </label>
            <textarea
              id="details"
              name="details"
              rows={5}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            className="gt-jumbotron-btn flex h-11 w-full items-center justify-center rounded-full border-2 border-gt-gold bg-gt-gold text-[10px] font-bold uppercase tracking-wider text-black sm:text-xs"
          >
            Send
          </button>
        </form>
      </div>
    </JumbotronCrawl>
  );
}

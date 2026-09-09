"use client";

import { useState } from "react";
import { fieldClass, labelClass } from "@/lib/formStyles";

const reasons = [
  "General Inquiry",
  "Sponsor / Partner Inquiry",
  "Booking Inquiry",
  "Other",
] as const;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState<(typeof reasons)[number]>(
    "General Inquiry",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
          Thanks
        </h2>
        <p className="gt-display-in max-w-md text-balance text-zinc-400 [animation-delay:80ms]">
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
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center gap-6 px-4 py-10 sm:px-8">
      <h2 className="gt-led-text-gold gt-display-in text-2xl font-black uppercase tracking-widest text-gt-gold sm:text-4xl">
        Contact
      </h2>
      <p className="gt-led-text-dim gt-display-in max-w-md text-balance text-center text-sm text-zinc-400 [animation-delay:80ms]">
        General questions, sponsor and partner inquiries, anything else,
        send it here.
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
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="reason">
            Reason
          </label>
          <select
            id="reason"
            name="reason"
            className={fieldClass}
            required
            value={reason}
            onChange={(e) =>
              setReason(e.target.value as (typeof reasons)[number])
            }
          >
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {reason === "Booking Inquiry" && (
            <p className="gt-led-text-dim mt-2 text-xs text-zinc-400">
              Booking the truck for a wedding, parade, or other event? The{" "}
              <a href="/booking" className="gt-led-text-gold text-gt-gold underline">
                Book Us
              </a>{" "}
              page has a dedicated form for event details.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          className="gt-jumbotron-btn w-full rounded border-2 border-gt-gold bg-gt-gold px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-black"
        >
          Send
        </button>
      </form>
    </div>
  );
}

/**
 * Shared styling for jumbotron-themed form fields (Contact, Book Us, and
 * whatever else needs a form later). Kept as plain class strings rather
 * than a component since inputs, selects, and textareas all need it but
 * don't share a common element to wrap.
 */
export const fieldClass =
  "w-full rounded border-2 border-gt-gold/50 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-gt-gold focus:outline-none focus:ring-1 focus:ring-gt-gold";

export const labelClass =
  "gt-led-text-dim mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gt-gray-light/80";

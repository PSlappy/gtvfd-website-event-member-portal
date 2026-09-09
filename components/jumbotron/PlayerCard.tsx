/**
 * Football broadcast "player card" style bio tile — used for the
 * About/History page's Current Owners and Previous Owners/Founders
 * sections. No real photos yet, so it falls back to an initials
 * monogram; swap in a real `photoSrc` once photos are available.
 */
export default function PlayerCard({
  name,
  role,
  photoSrc,
}: {
  name: string;
  role: string;
  photoSrc?: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="gt-display-in flex w-44 flex-col items-center gap-3 rounded-lg border-2 border-gt-gold bg-gt-navy p-4 sm:w-52">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-gt-gold bg-black sm:h-24 sm:w-24">
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="gt-led-text-gold text-2xl font-black text-gt-gold sm:text-3xl">
            {initials}
          </span>
        )}
      </div>
      <div className="text-center">
        <p className="gt-led-text-gold text-sm font-black uppercase tracking-wider text-gt-gold sm:text-base">
          {name}
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gt-gray-light/70">
          {role}
        </p>
      </div>
    </div>
  );
}

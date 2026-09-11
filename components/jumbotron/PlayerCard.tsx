/**
 * Football broadcast "player roster" style bio tile: a photo (or
 * placeholder monogram) filling the card, with a dark name plate
 * across the bottom, first name small over a bold last name, role
 * underneath. Used for the About/History page's Current Owners and
 * Founders/Previous Owners/Donors sections.
 */
export default function PlayerCard({
  firstName,
  lastName,
  role,
  photoSrc,
}: {
  firstName: string;
  lastName: string;
  role: string;
  photoSrc?: string;
}) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    // Chase Ring's ::before extends outside the element's own bounds
    // (that's the point — it traces the border from the outside), so
    // it has to live on a wrapper without overflow-hidden. The actual
    // card below keeps its own overflow-hidden to clip the photo to
    // its rounded corners.
    <div className="gt-chase-ring relative w-40 rounded-md sm:w-48">
      <div className="gt-display-in gt-led-border-gold gt-depth-panel relative aspect-[3/4] overflow-hidden rounded-md border-2 border-gt-gold bg-black">
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
            alt={`${firstName} ${lastName}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gt-navy">
            <span className="gt-led-text-gold text-4xl font-black text-gt-gold sm:text-5xl">
              {initials}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-black/85 px-3 py-2">
          <p className="gt-led-text-dim text-[10px] font-semibold uppercase tracking-[0.15em] text-gt-gray-light/80">
            {firstName}
          </p>
          <p className="gt-led-text-gold -mt-0.5 text-lg font-black uppercase leading-tight tracking-wide text-gt-gold sm:text-xl">
            {lastName}
          </p>
          <p className="gt-led-text-dim mt-1 text-[9px] uppercase tracking-[0.2em] text-gt-gray-light/60">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

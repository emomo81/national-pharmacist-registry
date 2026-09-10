/**
 * Vector rendition of the Liberian flag (11 stripes + canton star),
 * used as an authenticity mark in the site chrome.
 */
export function LiberiaFlag({ className = "" }: { className?: string }) {
  const stripes = Array.from({ length: 11 }, (_, i) => i);
  const stripeH = 21 / 11;
  return (
    <svg viewBox="0 0 32 21" className={className} aria-label="Flag of Liberia" role="img">
      {stripes.map((i) => (
        <rect
          key={i}
          x="0"
          y={+(i * stripeH).toFixed(3)}
          width="32"
          height={+(stripeH + 0.02).toFixed(3)}
          fill={i % 2 === 0 ? "#BF0A30" : "#ffffff"}
        />
      ))}
      <rect x="0" y="0" width="14" height="10" fill="#002868" />
      <path
        d="M7 1.8l1.1 2.45 2.66.25-2.02 1.75.6 2.6L7 7.5 4.66 8.85l.6-2.6-2.02-1.75 2.66-.25z"
        fill="#ffffff"
      />
    </svg>
  );
}

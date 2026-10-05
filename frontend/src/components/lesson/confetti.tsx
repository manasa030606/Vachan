// Lightweight CSS confetti for the lesson-complete screen.
// Positions are calculated from the index (not random) so server and browser render the same.
// Hidden automatically for users who prefer reduced motion (see globals.css).

const COLORS = ["bg-brand-500", "bg-marigold-400", "bg-rose-500", "bg-teal-500", "bg-emerald-500"];

export function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden motion-reduce:hidden"
    >
      {Array.from({ length: 36 }, (_, index) => (
        <span
          key={index}
          className={`absolute top-0 block h-3 w-2 animate-confetti rounded-sm ${COLORS[index % COLORS.length]}`}
          style={{
            left: `${(index * 37) % 100}%`,
            animationDelay: `${(index % 9) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

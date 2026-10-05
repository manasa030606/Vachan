// The Vachan logo: a speech bubble containing "व" (first letter of वचन, "word/speech")
// with a marigold bindu. Drawn as inline SVG so it stays sharp at every size.
import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoMarkProps = { className?: string };

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-10", className)}>
      {/* Speech bubble */}
      <path
        d="M10 4h28a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H22l-9 7v-7h-3a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8z"
        fill="#5a3be0"
      />
      {/* व */}
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="#ffffff"
        style={{ fontFamily: "'Baloo 2 Variable', sans-serif" }}
      >
        व
      </text>
      {/* Bindu */}
      <circle cx="38.5" cy="11.5" r="4" fill="#ffbb24" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

type LogoProps = {
  href?: string;
  className?: string;
  /** Hide the "Vachan" word and show only the mark (e.g. in a narrow sidebar). */
  markOnly?: boolean;
};

export function Logo({ href = "/", className, markOnly = false }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Vachan home"
      className={cn("inline-flex items-center gap-2 rounded-xl", className)}
    >
      <LogoMark />
      {!markOnly && (
        <span className="font-display text-2xl font-extrabold tracking-tight text-brand-700">
          vachan
        </span>
      )}
    </Link>
  );
}

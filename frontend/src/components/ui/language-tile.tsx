import type { Language } from "@/types/learning";
import { cn } from "@/lib/cn";

type LanguageTileProps = {
  language: Language;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-9 rounded-xl text-lg",
  md: "size-14 rounded-2xl text-2xl",
  lg: "size-20 rounded-3xl text-4xl",
};

/**
 * A coloured tile with the language's native glyph (e.g. "తె" for Telugu).
 * Used instead of flags: languages are not countries.
 */
export function LanguageTile({ language, size = "md", className }: LanguageTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center pt-1 font-display leading-none font-bold shadow-sm",
        language.theme.tile,
        sizes[size],
        className,
      )}
    >
      {language.glyph}
    </span>
  );
}

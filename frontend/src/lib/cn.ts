/** Joins class names, skipping empty / false values: cn("a", isOn && "b") → "a b". */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

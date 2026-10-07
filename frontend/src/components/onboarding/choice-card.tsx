// A selectable card built on a real (visually hidden) radio input,
// so arrow keys, Tab and screen readers work out of the box.
import type { ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";

type ChoiceCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
};

/** One option in an onboarding question, e.g. a language or a daily goal. */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  children,
  className,
}: ChoiceCardProps) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 bg-white p-4 transition",
        "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-200",
        checked
          ? "border-brand-500 bg-brand-50"
          : "border-slate-200 hover:border-brand-200 hover:bg-slate-50",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {children}
      <CircleCheck
        aria-hidden="true"
        className={cn(
          "ml-auto size-6 shrink-0 transition",
          checked ? "fill-brand-600 text-white" : "text-transparent",
        )}
      />
    </label>
  );
}

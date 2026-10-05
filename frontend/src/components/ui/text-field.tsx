// Labelled text input with an accessible error message.
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
  /** Optional element shown inside the input on the right (e.g. a "show password" button). */
  endAdornment?: ReactNode;
};

export function TextField({
  label,
  error,
  hint,
  endAdornment,
  className,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(error && errorId, hint && hintId) || undefined}
          className={cn(
            "h-12 w-full rounded-2xl border-2 bg-white px-4 text-base text-ink transition outline-none",
            "placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100",
            error ? "border-rose-400" : "border-slate-200",
            endAdornment ? "pr-12" : undefined,
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-2 flex items-center">{endAdornment}</div>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

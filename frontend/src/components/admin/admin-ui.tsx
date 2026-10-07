"use client";

// Small building blocks shared by the admin pages.
import { AlertTriangle, Check, ChevronDown, Loader2 } from "lucide-react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

export function errorText(error: unknown): string {
  if (error instanceof ApiError) {
    const details = error.details as unknown;
    if (Array.isArray(details) && details.length > 0) {
      return details
        .map((d: { field?: string; message?: string }) =>
          d.field ? `${d.field}: ${d.message}` : d.message,
        )
        .join(" · ");
    }
    const problems = (details as { problems?: string[] } | undefined)?.problems;
    if (problems?.length) return problems.join(" · ");
    return error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-ink outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}
export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cn(inputClass, "font-mono text-sm", props.className)} />;
}
/**
 * Dropdown styled like the other inputs: the browser's own arrow is hidden (it sat against the
 * edge and looked different in every browser) and replaced by an indigo chevron with room around it.
 */
export function Select({
  options,
  className,
  ...props
}: ComponentProps<"select"> & {
  options: ReadonlyArray<string | { value: string; label: string }>;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        {...props}
        className={cn(
          inputClass,
          "h-11 cursor-pointer appearance-none py-0 pr-10 pl-3.5 font-semibold",
          "hover:border-brand-300 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
        )}
      >
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option}>
              {option.toLowerCase().replace(/_/g, " ")}
            </option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ),
        )}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-brand-600"
        strokeWidth={2.5}
      />
    </div>
  );
}

export function StatusBadge({
  published,
  labels = ["Published", "Draft"],
}: {
  published: boolean;
  labels?: [string, string];
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold",
        published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
      )}
    >
      {published && <Check aria-hidden="true" className="size-3" />}
      {published ? labels[0] : labels[1]}
    </span>
  );
}

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-2xl px-3 py-2 text-sm font-bold",
        tone === "error" && "bg-rose-50 text-rose-700",
        tone === "success" && "bg-emerald-50 text-emerald-700",
        tone === "info" && "bg-slate-100 text-slate-700",
      )}
    >
      {tone === "error" && <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />}
      <span>{children}</span>
    </p>
  );
}

/** A button that runs an async action and shows a spinner; errors go to onError. */
export function ActionButton({
  action,
  onFail,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & {
  action: () => Promise<unknown>;
  onFail?: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      {...props}
      disabled={busy || props.disabled}
      onClick={async () => {
        setBusy(true);
        try {
          await action();
        } catch (error) {
          onFail?.(errorText(error));
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
      {children}
    </Button>
  );
}

/** Two-step delete: "Delete" → "Really delete? Yes / Cancel" (no browser dialog). */
export function ConfirmDelete({
  label = "Delete",
  question = "Delete?",
  onConfirm,
}: {
  label?: string;
  question?: string;
  onConfirm: () => Promise<unknown>;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-rose-700 hover:bg-rose-50"
        onClick={() => setAsking(true)}
      >
        {label}
      </Button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-sm">
      <span className="font-bold text-rose-700">{question}</span>
      <ActionButton
        size="sm"
        variant="danger"
        action={async () => {
          await onConfirm();
          setAsking(false);
        }}
      >
        Yes
      </ActionButton>
      <Button size="sm" variant="ghost" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </span>
  );
}

/** A number with a label (analytics). */
export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/**
 * Horizontal bars for ONE measure (single series → one hue, no legend; the title names it).
 * Values are printed as text next to each bar, every bar has a hover tooltip, and the same
 * numbers are available as a table for screen readers.
 */
export function BarList({
  title,
  rows,
  format = (value) => String(value),
  max,
}: {
  title: string;
  rows: Array<{ label: string; value: number | null; note?: string }>;
  format?: (value: number) => string;
  max?: number;
}) {
  const top = max ?? Math.max(1, ...rows.map((row) => row.value ?? 0));
  return (
    <figure className="space-y-2">
      <figcaption className="font-extrabold text-ink">{title}</figcaption>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">No data in this period yet.</p>
      ) : (
        <ul className="space-y-1.5" aria-hidden="true">
          {rows.map((row) => (
            <li
              key={row.label}
              className="grid grid-cols-[minmax(6rem,12rem)_1fr_auto] items-center gap-2 text-sm"
            >
              <span className="truncate text-slate-700" title={row.label}>
                {row.label}
              </span>
              <span
                className="h-3 rounded-full bg-slate-100"
                title={`${row.label}: ${row.value === null ? "–" : format(row.value)}${row.note ? ` (${row.note})` : ""}`}
              >
                <span
                  className="block h-3 rounded-full bg-brand-500"
                  style={{
                    width: `${row.value === null ? 0 : Math.max(2, (row.value / top) * 100)}%`,
                  }}
                />
              </span>
              <span className="w-16 text-right font-bold text-ink tabular-nums">
                {row.value === null ? "–" : format(row.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value === null ? "no data" : format(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/**
 * Delete with the server's learner-data guard: the first attempt never removes learner
 * progress; if the server answers HAS_LEARNER_DATA the admin sees why and can force it.
 */
export function DeleteControl({
  what,
  remove,
  onDeleted,
  onError,
}: {
  what: string;
  remove: (force: boolean) => Promise<unknown>;
  onDeleted: () => void;
  onError: (message: string) => void;
}) {
  const [blocked, setBlocked] = useState<string | null>(null);
  if (blocked) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1 rounded-2xl bg-rose-50 px-2 py-1 text-sm">
        <span className="font-bold text-rose-700">{blocked}</span>
        <ActionButton
          size="sm"
          variant="danger"
          onFail={onError}
          action={async () => {
            await remove(true);
            setBlocked(null);
            onDeleted();
          }}
        >
          Delete anyway
        </ActionButton>
        <Button size="sm" variant="ghost" onClick={() => setBlocked(null)}>
          Keep it
        </Button>
      </span>
    );
  }
  return (
    <ConfirmDelete
      question={`Delete this ${what}?`}
      onConfirm={async () => {
        try {
          await remove(false);
          onDeleted();
        } catch (error) {
          if (error instanceof ApiError && error.code === "HAS_LEARNER_DATA")
            setBlocked(error.message);
          else onError(errorText(error));
        }
      }}
    />
  );
}

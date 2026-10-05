import { CircleAlert } from "lucide-react";

/** An error message for the whole form (e.g. "Email or password is incorrect"). */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}

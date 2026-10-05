import type { ReactNode } from "react";
import { Info } from "lucide-react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Optional info box (e.g. "this feature is not live yet"). */
  notice?: ReactNode;
};

/** Frame shared by the login, register and forgot-password screens. */
export function AuthCard({ title, subtitle, children, footer, notice }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
      <p className="mt-1 text-slate-600">{subtitle}</p>

      {notice && (
        <p className="mt-5 flex items-start gap-2 rounded-2xl bg-marigold-50 px-4 py-3 text-sm text-marigold-700">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
        </p>
      )}

      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 text-center text-slate-600">{footer}</div>}
    </div>
  );
}

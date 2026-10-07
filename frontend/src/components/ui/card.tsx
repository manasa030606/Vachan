import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** White rounded surface used for most content blocks. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5",
        className,
      )}
      {...props}
    />
  );
}

type CardHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h2" | "h3";
};

/** Title, optional description and an optional action on the right, at the top of a Card. */
export function CardHeader({ title, description, action, as: Heading = "h2" }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <Heading className="text-xl font-bold text-ink">{title}</Heading>
        {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// Buttons and button-styled links, shared by every screen.
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "accent" | "success" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type StyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 disabled:bg-brand-300 disabled:shadow-none",
  secondary:
    "bg-white text-brand-700 ring-2 ring-inset ring-brand-100 hover:bg-brand-50 hover:ring-brand-200 disabled:text-slate-400",
  accent:
    "bg-marigold-400 text-ink shadow-lg shadow-marigold-500/30 hover:bg-marigold-300 disabled:bg-marigold-100",
  success:
    "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:bg-emerald-300",
  danger:
    "bg-rose-600 text-white shadow-lg shadow-rose-600/25 hover:bg-rose-700 disabled:bg-rose-300",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50 disabled:text-slate-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-7 text-lg",
};

/** Returns the Tailwind classes for a button. Useful for styling other elements like a button. */
export function buttonStyles({ variant = "primary", size = "md", fullWidth }: StyleOptions = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-full font-extrabold tracking-wide whitespace-nowrap",
    "transition duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
  );
}

type ButtonProps = ComponentProps<"button"> & StyleOptions;

/** A styled <button>. Defaults to type="button" so it never submits a form by accident. */
export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleOptions;

/** A Next.js link that looks like a button. */
export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size, fullWidth }), className)} {...props} />;
}

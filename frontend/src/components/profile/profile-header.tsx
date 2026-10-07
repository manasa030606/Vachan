import { CalendarDays } from "lucide-react";
import type { Language } from "@/types/learning";
import { LanguageTile } from "@/components/ui/language-tile";

type ProfileHeaderProps = {
  displayName: string;
  email: string;
  joinedLabel: string;
  language: Language;
};

/** Up to two initials for the avatar, e.g. "Asha Rao" gives "AR". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Top of the profile page: avatar, name, email, join date and current language. */
export function ProfileHeader({ displayName, email, joinedLabel, language }: ProfileHeaderProps) {
  return (
    <section className="flex flex-col items-center gap-5 rounded-card border border-slate-200 bg-white p-6 text-center sm:flex-row sm:text-left">
      <div
        aria-hidden="true"
        className="flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-4xl font-extrabold text-white ring-4 ring-marigold-300"
      >
        {initials(displayName) || "V"}
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold text-ink">{displayName}</h1>
        <p className="text-slate-500">{email}</p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-600 sm:justify-start">
          <CalendarDays aria-hidden="true" className="size-4" />
          Joined {joinedLabel}
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <LanguageTile language={language} />
        <div className="text-left">
          <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Learning</p>
          <p className="font-extrabold">{language.name}</p>
        </div>
      </div>
    </section>
  );
}

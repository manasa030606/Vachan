import { Plus } from "lucide-react";
import type { Language } from "@/types/learning";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { LanguageTile } from "@/components/ui/language-tile";

/** The learner's current course and a way to start another language. */
export function LanguageCard({
  language,
  currentUnitTitle,
}: {
  language: Language;
  currentUnitTitle: string;
}) {
  return (
    <Card>
      <CardHeader title="Language" />
      <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
        <LanguageTile language={language} />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold">
            {language.name}{" "}
            <span className="font-display text-brand-700">{language.nativeName}</span>
          </p>
          <p className="text-sm text-slate-600">Currently on: {currentUnitTitle}</p>
        </div>
      </div>
      <ButtonLink href="/onboarding" variant="ghost" size="sm" className="mt-3">
        <Plus aria-hidden="true" className="size-4" />
        Start another language
      </ButtonLink>
    </Card>
  );
}

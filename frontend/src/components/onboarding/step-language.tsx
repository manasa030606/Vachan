import { LanguageTile } from "@/components/ui/language-tile";
import { LANGUAGE_CONTENT } from "@/data/language-content";
import type { Language, LanguageCode } from "@/types/learning";
import { ChoiceCard } from "./choice-card";
import { StepHeading } from "./step-heading";

type StepLanguageProps = {
  /** Languages from GET /api/languages */
  languages: Language[];
  isLoading: boolean;
  error: string | null;
  value: LanguageCode | null;
  onChange: (code: LanguageCode) => void;
};

export function StepLanguage({ languages, isLoading, error, value, onChange }: StepLanguageProps) {
  return (
    <fieldset>
      <StepHeading
        title="What would you like to learn?"
        subtitle="You're learning from English. You can add more languages later."
      />
      {isLoading && <p className="text-slate-500">Loading languages…</p>}
      {error && (
        <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 font-bold text-rose-700">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {languages.map((language) => (
          <ChoiceCard
            key={language.code}
            name="language"
            value={language.code}
            checked={value === language.code}
            onChange={(code) => onChange(code as LanguageCode)}
          >
            <LanguageTile language={language} />
            <span className="min-w-0">
              <span className="block text-lg font-extrabold text-ink">
                {language.name}{" "}
                <span className="font-display font-bold text-slate-600">{language.nativeName}</span>
              </span>
              <span className="block text-sm text-slate-500">
                {language.scriptName} · “{LANGUAGE_CONTENT[language.code].words.hello.script}”
              </span>
            </span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}

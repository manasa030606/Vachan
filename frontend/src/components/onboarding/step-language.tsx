import { LanguageTile } from "@/components/ui/language-tile";
import { LANGUAGE_CONTENT } from "@/data/language-content";
import { LANGUAGES } from "@/data/languages";
import type { LanguageCode } from "@/types/learning";
import { ChoiceCard } from "./choice-card";
import { StepHeading } from "./step-heading";

type StepLanguageProps = {
  value: LanguageCode | null;
  onChange: (code: LanguageCode) => void;
};

export function StepLanguage({ value, onChange }: StepLanguageProps) {
  return (
    <fieldset>
      <StepHeading
        title="What would you like to learn?"
        subtitle="You're learning from English. You can add more languages later."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {LANGUAGES.map((language) => (
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

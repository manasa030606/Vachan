import { LanguageTile } from "@/components/ui/language-tile";
import { LANGUAGE_CONTENT } from "@/data/language-content";
import { LANGUAGES } from "@/data/languages";

/** The six supported languages, each with its script and a greeting. */
export function LanguageShowcase() {
  return (
    <section id="languages" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">
          Choose from six languages
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-slate-600">
          Each course teaches the real script, real pronunciation and everyday phrases.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((language) => {
            const greeting = LANGUAGE_CONTENT[language.code].words.hello;
            return (
              <li
                key={language.code}
                className={`rounded-card border-2 border-transparent p-6 transition hover:-translate-y-1 hover:shadow-lg ${language.theme.soft}`}
              >
                <div className="flex items-center gap-4">
                  <LanguageTile language={language} />
                  <div>
                    <h3 className="text-xl font-extrabold text-ink">{language.name}</h3>
                    <p className="font-display text-lg text-slate-700">{language.nativeName}</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">{language.description}</p>
                <p className="mt-4 rounded-2xl bg-white/80 px-4 py-2 text-sm">
                  <span className="font-bold text-slate-500">Say hello: </span>
                  <span className="font-display text-lg font-bold text-ink">
                    {greeting.script}
                  </span>{" "}
                  <span className="text-slate-500">({greeting.romanization})</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

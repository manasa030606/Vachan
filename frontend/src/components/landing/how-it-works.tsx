const STEPS = [
  {
    title: "Pick a language",
    text: "Choose one of six Indian languages and see its script before you begin.",
  },
  {
    title: "Find your level",
    text: "Tell us what you already know. Beginners start with the alphabet; others skip ahead.",
  },
  {
    title: "Learn in short lessons",
    text: "Five-minute lessons with instant feedback, examples and a quick review of mistakes.",
  },
  {
    title: "Keep your streak",
    text: "Earn XP, hit your daily goal and come back tomorrow. Small steps add up.",
  },
];

/** Landing page: the four steps of how Vachan works. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">
          How Vachan works
        </h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative rounded-card bg-white p-6 shadow-sm">
              <span className="flex size-12 rotate-45 items-center justify-center rounded-xl bg-brand-600 shadow-md">
                <span className="-rotate-45 font-display text-xl font-extrabold text-white">
                  {index + 1}
                </span>
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-ink">{step.title}</h3>
              <p className="mt-2 text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

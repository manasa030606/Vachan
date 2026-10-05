/** Title + subtitle of an onboarding step. Uses <legend> because each step is a <fieldset>. */
export function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <legend className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</legend>
      {subtitle && <p className="mt-2 text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

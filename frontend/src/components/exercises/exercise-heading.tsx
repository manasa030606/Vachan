import type { ReactNode } from "react";

/** The instruction at the top of every exercise, e.g. "Select the correct meaning". */
export function ExerciseHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">{children}</h2>;
}

type ScriptPromptProps = {
  text: string;
  subtext?: string;
  showSubtext: boolean;
  size?: "md" | "xl";
};

/** Big, centred Indian-script text with optional romanization underneath. */
export function ScriptPrompt({ text, subtext, showSubtext, size = "md" }: ScriptPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-brand-200 bg-brand-50/60 px-6 py-8 text-center">
      <p
        className={
          size === "xl"
            ? "font-display text-8xl leading-none font-bold text-brand-800 sm:text-9xl"
            : "font-display text-4xl leading-tight font-bold text-brand-800 sm:text-5xl"
        }
      >
        {text}
      </p>
      {showSubtext && subtext && <p className="mt-2 text-lg text-slate-600">{subtext}</p>}
    </div>
  );
}

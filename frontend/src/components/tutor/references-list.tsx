// "Sources" under a tutor answer: the notes the answer is based on, and the others that were
// looked at, so every answer can be traced back to Vachan's knowledge base.
import { BookOpen, ChevronDown } from "lucide-react";
import type { TutorReferenceDto } from "@/lib/api/types";

/** One knowledge-base note. */
function Reference({ item }: { item: TutorReferenceDto }) {
  return (
    <li className="rounded-xl bg-slate-50 p-3">
      <p className="font-bold text-ink">{item.heading}</p>
      <p className="mt-0.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {item.contentType} · {item.level} · {item.source}
      </p>
      <p className="mt-1 text-sm text-slate-600">{item.excerpt}</p>
    </li>
  );
}

/**
 * Collapsible list of notes. For an answered question it shows the notes used; when the tutor
 * could not answer, it shows the closest notes instead.
 */
export function ReferencesList({
  references,
  answered,
}: {
  references: TutorReferenceDto[];
  answered: boolean;
}) {
  const used = references.filter((reference) => reference.used);
  const others = references.filter((reference) => !reference.used);
  if (references.length === 0) return null;

  return (
    <details className="group mt-3 rounded-2xl border border-slate-200 bg-white text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 font-bold text-brand-700 select-none">
        <BookOpen aria-hidden="true" className="size-4" />
        {answered
          ? `Sources (${used.length})`
          : `Closest notes (${others.length}) — not enough to answer`}
        <ChevronDown
          aria-hidden="true"
          className="ml-auto size-4 transition group-open:rotate-180"
        />
      </summary>
      <div className="space-y-3 px-3 pb-3">
        {used.length > 0 && (
          <ul className="space-y-2" aria-label="Notes this answer is based on">
            {used.map((item) => (
              <Reference key={item.id} item={item} />
            ))}
          </ul>
        )}
        {answered && others.length > 0 && (
          <p className="text-xs text-slate-500">
            Also searched: {others.map((item) => item.heading).join(" · ")}
          </p>
        )}
        {!answered && (
          <ul className="space-y-2" aria-label="Closest notes">
            {others.slice(0, 3).map((item) => (
              <Reference key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}

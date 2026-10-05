// Decorative hero illustration: a phone-style lesson card with floating script letters.
// Built from HTML/CSS only (no image files), so it is fully original and lightweight.
import { Check, Flame, Heart } from "lucide-react";

const FLOATING_LETTERS = [
  { char: "अ", className: "left-2 top-6 bg-orange-100 text-orange-700", delay: "0s" },
  { char: "అ", className: "right-0 top-16 bg-brand-100 text-brand-700", delay: "1s" },
  { char: "அ", className: "-left-4 bottom-24 bg-rose-100 text-rose-700", delay: "2s" },
  { char: "അ", className: "right-4 bottom-10 bg-emerald-100 text-emerald-700", delay: "0.5s" },
  { char: "ಅ", className: "left-16 -bottom-4 bg-amber-100 text-amber-700", delay: "1.5s" },
  { char: "অ", className: "-right-6 top-1/2 bg-teal-100 text-teal-700", delay: "2.5s" },
];

export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[30rem] w-full max-w-sm">
      {FLOATING_LETTERS.map((letter) => (
        <span
          key={letter.char}
          className={`absolute z-10 flex size-14 animate-float items-center justify-center rounded-2xl pt-1 font-display text-3xl font-bold shadow-md ${letter.className}`}
          style={{ animationDelay: letter.delay }}
        >
          {letter.char}
        </span>
      ))}

      {/* Phone card */}
      <div className="absolute inset-x-8 top-4 bottom-4 rotate-2 rounded-[2.5rem] border-8 border-ink bg-white p-5 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-3/5 rounded-full bg-brand-500" />
          </div>
          <Heart className="size-5 fill-rose-500 text-rose-500" />
          <span className="text-sm font-extrabold text-rose-600">5</span>
        </div>
        <p className="mt-5 text-lg font-extrabold text-ink">What does this mean?</p>
        <div className="mt-3 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 py-5 text-center">
          <p className="font-display text-4xl font-bold text-brand-800">నమస్కారం</p>
          <p className="text-sm text-slate-500">namaskaaram</p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-xl border-2 border-emerald-500 bg-emerald-50 px-3 py-2 font-bold text-emerald-800">
            Hello <Check className="size-5" />
          </div>
          <div className="rounded-xl border-2 border-slate-200 px-3 py-2 font-bold text-slate-600">
            Water
          </div>
          <div className="rounded-xl border-2 border-slate-200 px-3 py-2 font-bold text-slate-600">
            Thank you
          </div>
        </div>
      </div>

      {/* Streak sticker */}
      <div className="absolute -right-2 bottom-0 z-20 flex -rotate-6 items-center gap-1.5 rounded-2xl bg-white px-3 py-2 font-extrabold text-orange-600 shadow-lg">
        <Flame className="size-5 fill-orange-400 text-orange-500" /> 12 day streak
      </div>
    </div>
  );
}

import { Bot, Flame, Mic, PenLine, RotateCcw, Trophy, type LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
  color: string;
  comingSoon?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: PenLine,
    title: "Start from the script",
    text: "Learn vowels, consonants and sounds before words — no prior knowledge needed.",
    color: "bg-brand-100 text-brand-700",
  },
  {
    icon: Trophy,
    title: "Game-like progress",
    text: "XP, levels, badges and a learning path that unlocks as you grow.",
    color: "bg-marigold-100 text-marigold-700",
  },
  {
    icon: Flame,
    title: "Daily streaks",
    text: "Set a realistic daily goal and build a habit, five minutes at a time.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: RotateCcw,
    title: "Review your mistakes",
    text: "Words you find hard come back for practice until they stick.",
    color: "bg-teal-100 text-teal-700",
  },
  {
    icon: Bot,
    title: "AI language tutor",
    text: "Ask why an answer is wrong and get simple explanations grounded in verified lessons.",
    color: "bg-rose-100 text-rose-700",
    comingSoon: true,
  },
  {
    icon: Mic,
    title: "Speaking practice",
    text: "Repeat phrases aloud and practise real conversations like ordering food.",
    color: "bg-emerald-100 text-emerald-700",
    comingSoon: true,
  },
];

/** Landing page: grid of the main features (some marked "Coming soon"). */
export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">
          Built for real progress
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="rounded-card border-2 border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-12 items-center justify-center rounded-2xl ${feature.color}`}
                  >
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  {feature.comingSoon && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-ink">{feature.title}</h3>
                <p className="mt-2 text-slate-600">{feature.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

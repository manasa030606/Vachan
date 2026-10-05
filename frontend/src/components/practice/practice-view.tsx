"use client";

import { getLanguage } from "@/data/languages";
import {
  WEAK_TOPICS,
  WEAK_WORD_THRESHOLD,
  getMistakes,
  getVocabularyEntries,
} from "@/data/mock-practice";
import { useLearnerPreferences } from "@/lib/learner-preferences";
import { MistakesList } from "./mistakes-list";
import { RecommendedPractice } from "./recommended-practice";
import { VocabularyList } from "./vocabulary-list";
import { WeakTopicsList } from "./weak-topics-list";

/** Practice screen: recommended session, mistakes, weak topics and vocabulary. */
export function PracticeView() {
  const { languageCode, showRomanization } = useLearnerPreferences();
  const language = getLanguage(languageCode);
  const mistakes = getMistakes(languageCode);
  const vocabulary = getVocabularyEntries(languageCode);
  const weakWordCount = vocabulary.filter((word) => word.strength < WEAK_WORD_THRESHOLD).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">Practice</h1>
        <p className="text-slate-600">
          Strengthen your {language.name} — review what you&apos;ve learned.
        </p>
      </div>

      <RecommendedPractice
        mistakeCount={mistakes.length}
        weakWordCount={weakWordCount}
        weakestTopic={WEAK_TOPICS[0].title}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MistakesList mistakes={mistakes} />
        <WeakTopicsList topics={WEAK_TOPICS} />
      </div>

      <VocabularyList words={vocabulary} showRomanization={showRomanization} />
    </div>
  );
}

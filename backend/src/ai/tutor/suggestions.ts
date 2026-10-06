// Suggested questions shown under the chat (rule-based, from the lesson the learner is in).

export type SuggestionInput = {
  languageName: string;
  lesson?: {
    title: string;
    kind: string;
    words: Array<{ script: string; meaning: string }>;
  } | null;
};

export function suggestQuestions({ languageName, lesson }: SuggestionInput): string[] {
  const suggestions: string[] = [];
  const word = lesson?.words.find((item) => item.script.length > 1) ?? lesson?.words[0];

  if (lesson?.kind === "SCRIPT") {
    if (word) suggestions.push(`How do I pronounce ${word.script}?`);
    suggestions.push(`How do vowel signs work in ${languageName}?`);
  } else if (word) {
    suggestions.push(`What does ${word.script} mean?`);
    suggestions.push(`Give me an example sentence with ${word.script}.`);
  }
  suggestions.push(
    `How do I say hello in ${languageName}?`,
    `Explain ${languageName} word order like I'm a beginner.`,
    `What is the difference between the formal and informal "you" in ${languageName}?`,
  );
  return [...new Set(suggestions)].slice(0, 4);
}

// Choices shown during onboarding. Kept as data so the UI just renders lists.

export const LEARNING_GOALS = [
  {
    id: "family",
    emoji: "👪",
    label: "Connect with family",
    description: "Talk with relatives and understand my roots",
  },
  { id: "travel", emoji: "🧳", label: "Travel", description: "Get around confidently on my trips" },
  {
    id: "culture",
    emoji: "🎬",
    label: "Films, music & culture",
    description: "Enjoy movies, songs and books",
  },
  {
    id: "work",
    emoji: "💼",
    label: "Work or study",
    description: "Communicate with colleagues or classmates",
  },
  {
    id: "friends",
    emoji: "🤝",
    label: "Make friends",
    description: "Chat with friends and neighbours",
  },
  {
    id: "brain",
    emoji: "🧠",
    label: "Train my brain",
    description: "Learn something new every day",
  },
] as const;

export type LearningGoalId = (typeof LEARNING_GOALS)[number]["id"];

/** Daily goals. XP values live here so they are not scattered across components. */
export const DAILY_GOALS = [
  { id: "casual", label: "Casual", minutes: 5, xp: 10 },
  { id: "regular", label: "Regular", minutes: 10, xp: 20 },
  { id: "serious", label: "Serious", minutes: 15, xp: 30 },
  { id: "intense", label: "Intense", minutes: 20, xp: 50 },
] as const;

export type DailyGoalId = (typeof DAILY_GOALS)[number]["id"];

export function getDailyGoal(id: DailyGoalId) {
  return DAILY_GOALS.find((goal) => goal.id === id) ?? DAILY_GOALS[1];
}

/** Self-assessment levels — the six statements from the spec (section 3). */
export const SELF_ASSESSMENT_LEVELS = [
  { id: "new", label: "Completely new — I know nothing", startHint: "Start from the script" },
  { id: "few-words", label: "I know a few words", startHint: "Start from the script, faster" },
  {
    id: "knows-script",
    label: "I know the alphabet/script but need practice",
    startHint: "Start at First Words",
  },
  {
    id: "basic-sentences",
    label: "I can understand basic sentences",
    startHint: "Placement test recommended",
  },
  {
    id: "simple-conversations",
    label: "I can have simple conversations",
    startHint: "Placement test recommended",
  },
  {
    id: "advanced",
    label: "I'm comfortable and want advanced practice",
    startHint: "Placement test recommended",
  },
] as const;

export type SelfAssessmentId = (typeof SELF_ASSESSMENT_LEVELS)[number]["id"];

export function getSelfAssessmentLevel(id: SelfAssessmentId) {
  return SELF_ASSESSMENT_LEVELS.find((level) => level.id === id) ?? SELF_ASSESSMENT_LEVELS[0];
}

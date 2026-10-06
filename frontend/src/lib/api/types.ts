// Shapes of the JSON returned by the backend (see backend/src/services/*).

export type DailyGoalId = "casual" | "regular" | "serious" | "intense";

export type UserDto = {
  id: string;
  email: string;
  role: "LEARNER" | "ADMIN";
  createdAt: string;
  profile: {
    displayName: string;
    currentLanguage: { code: string; name: string; nativeName: string } | null;
    interfaceLanguage: string;
    learningGoal: string | null;
    dailyGoal: DailyGoalId;
    selfAssessment: string | null;
    showRomanization: boolean;
    soundEffects: boolean;
    onboardingDone: boolean;
    timeZone: string;
  } | null;
};

export type ProfileUpdate = Partial<{
  displayName: string;
  languageCode: string;
  learningGoal: string | null;
  dailyGoal: DailyGoalId;
  selfAssessment: string | null;
  showRomanization: boolean;
  soundEffects: boolean;
  onboardingDone: boolean;
  timeZone: string;
}>;

export type LanguageDto = {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  scriptName: string;
  description: string;
};

export type CourseSummaryDto = {
  id: string;
  title: string;
  description: string;
  language: LanguageDto;
  unitCount: number;
  lessonCount: number;
};

export type LessonKind = "SCRIPT" | "VOCABULARY" | "PHRASES" | "CHECKPOINT";
/** completed · current (started, not finished) · available (unlocked, not started) · locked */
export type LessonStatusDto = "completed" | "current" | "available" | "locked";

export type CourseDetailDto = {
  id: string;
  title: string;
  description: string;
  language: LanguageDto;
  progress: {
    completedLessons: number;
    inProgressLessons: number;
    totalLessons: number;
    /** The recommended next lesson; null when the course is finished. */
    currentLessonId: string | null;
  };
  units: Array<{
    id: string;
    number: number;
    title: string;
    description: string;
    stage: string;
    status: "locked" | "active" | "completed";
    completedLessons: number;
    lessons: Array<{
      id: string;
      title: string;
      kind: LessonKind;
      exerciseCount: number;
      status: LessonStatusDto;
      /** Unlocked by the placement test (not studied yet). */
      placedOut: boolean;
    }>;
  }>;
};

export type ChoiceDto = { id: string; text: string; subtext: string | null };

export type PublicExerciseDto =
  | {
      id: string;
      type: "multiple-choice";
      instruction: string;
      prompt: string;
      promptSubtext: string | null;
      options: ChoiceDto[];
    }
  | {
      id: string;
      type: "character-sound";
      instruction: string;
      character: string;
      options: ChoiceDto[];
    }
  | {
      id: string;
      type: "character-recognition";
      instruction: string;
      prompt: string;
      promptSubtext: string | null;
      options: ChoiceDto[];
    }
  | {
      id: string;
      type: "fill-in-blank";
      instruction: string;
      before: string;
      after: string;
      translation: string;
      options: ChoiceDto[];
    }
  | {
      id: string;
      type: "translation";
      instruction: string;
      prompt: string;
      promptSubtext: string | null;
    }
  | { id: string; type: "word-order"; instruction: string; prompt: string; tokens: ChoiceDto[] }
  | {
      id: string;
      type: "matching";
      instruction: string;
      pairs: Array<{ id: string; left: string; leftSubtext: string | null; right: string }>;
    };

export type LessonDto = {
  id: string;
  title: string;
  introText: string;
  kind: LessonKind;
  status: LessonStatusDto;
  unit: { id: string; number: number; title: string };
  course: { id: string; title: string; language: { code: string; name: string } };
  vocabulary: VocabularyDto[];
  exercises: PublicExerciseDto[];
  progress: LessonProgressDto;
};

export type AttemptAnswerDto =
  | { optionId: string }
  | { text: string }
  | { optionIds: string[] }
  | { pairs: Array<{ leftId: string; rightId: string }> };

export type LessonProgressDto = {
  lessonId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  startedAt: string | null;
  runStartedAt: string | null;
  lastActivityAt: string | null;
  completedAt: string | null;
  timesCompleted: number;
  correctAttempts: number;
  incorrectAttempts: number;
  accuracy: number | null;
  /** Exercises answered correctly in the current run (used to resume). */
  completedExerciseIds: string[];
  completedExercises: number;
  totalExercises: number;
};

export type HeartsDto = {
  current: number;
  max: number;
  nextHeartAt: string | null;
  refillMinutes: number;
};

export type StartLessonDto = { resumed: boolean; progress: LessonProgressDto; hearts: HeartsDto };

export type LevelDto = {
  level: number;
  levelStartXp: number;
  nextLevelXp: number | null;
  xpIntoLevel: number;
  xpToNextLevel: number;
  isMaxLevel: boolean;
};

export type BadgeDto = { code: string; title: string; description: string; icon: string };

/** XP, hearts, streak, goal and badges after one answer (POST /exercises/:id/attempt). */
export type RewardsDto = {
  xpEarned: number;
  awards: Array<{ reason: string; amount: number }>;
  totalXp: number;
  level: LevelDto;
  leveledUp: boolean;
  hearts: HeartsDto;
  streak: { current: number; longest: number; change: string };
  dailyGoal: { targetXp: number; earnedToday: number; completed: boolean; justCompleted: boolean };
  newAchievements: BadgeDto[];
};

export type AttemptMode = "lesson" | "review";

export type AttemptResultDto = {
  attempt: {
    id: string;
    exerciseId: string;
    mode: AttemptMode;
    isCorrect: boolean;
    typoCorrection: string | null;
    correctAnswer: string;
    explanation: string | null;
    createdAt: string;
  };
  lessonProgress: LessonProgressDto & { justCompleted: boolean };
  rewards: RewardsDto;
};

export type ProgressSummaryDto = {
  totals: {
    lessonsCompleted: number;
    lessonsInProgress: number;
    exercisesAnswered: number;
    correctAnswers: number;
    incorrectAnswers: number;
    accuracy: number | null;
    lastActivityAt: string | null;
  };
  resume: {
    lessonId: string;
    title: string;
    unitTitle: string;
    courseId: string;
    language: { code: string; name: string };
    lastActivityAt: string;
  } | null;
  courses: Array<{
    courseId: string;
    title: string;
    language: { code: string; name: string };
    completedLessons: number;
    inProgressLessons: number;
    totalLessons: number;
  }>;
  lessons: Array<{
    lessonId: string;
    title: string;
    courseId: string;
    languageCode: string;
    status: "IN_PROGRESS" | "COMPLETED";
    startedAt: string;
    lastActivityAt: string;
    completedAt: string | null;
    timesCompleted: number;
    correctAttempts: number;
    incorrectAttempts: number;
    accuracy: number | null;
    totalExercises: number;
  }>;
};

export type VocabularyDto = {
  id: string;
  kind: string;
  script: string;
  romanization: string;
  meaning: string;
  topic: string;
};

export type MistakeDto = {
  exerciseId: string;
  type: PublicExerciseDto["type"];
  instruction: string;
  prompt: string;
  promptSubtext: string | null;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string | null;
  wrongCount: number;
  lastWrongAt: string;
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
  courseId: string;
  languageCode: string;
};

export type ReviewDto = {
  languageCode: string | null;
  openMistakes: number;
  resolvedMistakes: number;
  mistakes: MistakeDto[];
  learnedVocabulary: VocabularyDto[];
};

export type ReviewSessionDto = {
  id: "review";
  title: string;
  introText: string;
  totalOpen: number;
  exercises: Array<PublicExerciseDto & { lessonTitle: string }>;
};

export type StreakDto = {
  current: number;
  longest: number;
  lastActiveDate: string | null;
  today: string;
  timeZone: string;
  activeToday: boolean;
  week: Array<{ date: string; xpEarned: number; active: boolean; goalMet: boolean }>;
};

export type AchievementDto = BadgeDto & {
  metric: string;
  threshold: number;
  value: number;
  progress: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type StatsDto = {
  xp: LevelDto & { total: number; today: number };
  streak: StreakDto;
  hearts: HeartsDto;
  dailyGoal: { date: string; targetXp: number; earnedToday: number; completed: boolean };
  achievements: { unlockedCount: number; total: number; recent: AchievementDto[] };
  rules: {
    xp: Record<string, number>;
    hearts: {
      max: number;
      initial: number;
      lossPerMistake: number;
      refillMinutes: number;
      reviewRestore: number;
    };
    levelThresholds: number[];
    dailyGoalXp: Record<string, number>;
  };
};

export type RecommendationDto = {
  type:
    | "earn-hearts"
    | "repeated-mistakes"
    | "unfinished-lesson"
    | "weak-topic"
    | "review"
    | "next-lesson";
  title: string;
  reason: string;
  action: { kind: "review" } | { kind: "lesson"; lessonId: string };
};

export type PlacementSkill = "SCRIPT" | "VOCABULARY" | "TRANSLATION" | "SENTENCE";

export type PlacementStartDto = {
  test: {
    id: string;
    status: string;
    language: { code: string; name: string };
    selfAssessment: string | null;
    totalQuestions: number;
  };
  questions: Array<{
    id: string;
    unit: number;
    skill: PlacementSkill;
    exercise: PublicExerciseDto;
  }>;
  rules: string[];
};

export type PlacementResultDto = {
  testId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ACCEPTED" | "DECLINED";
  language: { code: string; name: string };
  selfAssessment: { id: string; label: string } | null;
  correctCount: number;
  totalQuestions: number;
  units: Array<{
    unit: number;
    title: string;
    correct: number;
    total: number;
    passed: boolean;
    skills: PlacementSkill[];
  }>;
  recommendedUnit: number;
  recommendedUnitTitle: string;
  message: string;
  chosenUnit: number | null;
  rules: string[];
};

// ── AI tutor (Phase 6) ──
export type TutorLevel = "beginner" | "elementary" | "intermediate";

export type TutorReferenceDto = {
  n: number;
  id: string;
  heading: string;
  excerpt: string;
  source: string;
  reference: string;
  level: string;
  contentType: string;
  similarity: number;
  /** true = the answer is based on this note */
  used: boolean;
};

export type TutorMessageDto = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "answered" | "insufficient" | "refused" | null;
  references: TutorReferenceDto[];
  examples: Array<{ native: string; romanization: string; meaning: string }>;
  context: {
    level?: TutorLevel;
    unit?: string | null;
    lesson?: string | null;
    sufficient?: boolean;
    bestSimilarity?: number;
  } | null;
  model: string | null;
  latencyMs: number | null;
  createdAt: string;
};

export type TutorConversationDto = {
  id: string;
  title: string;
  language: string;
  lessonId: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
};

export type TutorContextDto = {
  context: {
    language: { code: string; name: string };
    level: TutorLevel;
    levelSource: "request" | "self-assessment" | "default";
    unit: string | null;
    lesson: { id: string; title: string } | null;
  };
  suggestions: string[];
  status: {
    available: boolean;
    reason: string | null;
    provider: string;
    providerLabel: string;
    model: string;
    isTestDouble: boolean;
    searchEnabled: boolean;
  };
};

export type TutorAskBody = {
  question: string;
  conversationId?: string;
  language?: string;
  lessonId?: string;
  exerciseId?: string;
};

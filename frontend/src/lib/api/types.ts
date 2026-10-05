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

export type StartLessonDto = { resumed: boolean; progress: LessonProgressDto };

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

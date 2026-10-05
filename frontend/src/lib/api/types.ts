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
export type LessonStatusDto = "completed" | "current" | "locked";

export type CourseDetailDto = {
  id: string;
  title: string;
  description: string;
  language: LanguageDto;
  progress: { completedLessons: number; totalLessons: number; currentLessonId: string | null };
  units: Array<{
    id: string;
    number: number;
    title: string;
    description: string;
    stage: string;
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
      type: "character-recognition";
      instruction: string;
      character: string;
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
  vocabulary: Array<{
    id: string;
    kind: string;
    script: string;
    romanization: string;
    meaning: string;
    topic: string;
  }>;
  exercises: PublicExerciseDto[];
  progress: { completedExerciseIds: string[]; totalExercises: number };
};

export type AttemptAnswerDto =
  | { optionId: string }
  | { text: string }
  | { optionIds: string[] }
  | { pairs: Array<{ leftId: string; rightId: string }> };

export type LessonProgressDto = {
  lessonId: string;
  status: "IN_PROGRESS" | "COMPLETED";
  completedAt: string | null;
  completedExercises: number;
  totalExercises: number;
  accuracy: number | null;
};

export type AttemptResultDto = {
  attempt: {
    id: string;
    exerciseId: string;
    isCorrect: boolean;
    typoCorrection: string | null;
    correctAnswer: string;
    createdAt: string;
  };
  lessonProgress: LessonProgressDto;
};

export type ProgressSummaryDto = {
  totals: {
    lessonsCompleted: number;
    lessonsStarted: number;
    exercisesAnswered: number;
    correctAnswers: number;
    accuracy: number | null;
  };
  courses: Array<{
    courseId: string;
    title: string;
    language: { code: string; name: string };
    completedLessons: number;
    totalLessons: number;
  }>;
  lessons: Array<{
    lessonId: string;
    title: string;
    courseId: string;
    languageCode: string;
    status: "IN_PROGRESS" | "COMPLETED";
    startedAt: string;
    completedAt: string | null;
  }>;
};

// ALL gamification numbers live here (spec section 6: "values should be configurable and
// stored in backend logic rather than scattered as hard-coded frontend constants").
// Change a value here, restart the backend, and every rule + the UI follow.

export const GAMIFICATION = {
  xp: {
    /** First correct answer to an exercise in a lesson run. */
    exerciseCorrect: 2,
    /** Finishing a lesson for the first time. */
    lessonCompleted: 10,
    /** Finishing a lesson again ("practise again"). */
    lessonPracticed: 5,
    /** Extra XP when a run had no wrong answers. */
    perfectLessonBonus: 5,
    /** A correct answer in the mistake review. */
    reviewCorrect: 2,
  },

  /** Total XP needed to REACH each level. Index 0 = level 1. Add values to add levels. */
  levelThresholds: [0, 50, 120, 220, 350, 520, 750, 1050, 1450, 2000],

  hearts: {
    max: 5,
    /** Hearts a new learner starts with. */
    initial: 5,
    /** A wrong answer in a lesson costs this many hearts (review and placement never cost hearts). */
    lossPerMistake: 1,
    /** One heart comes back every N minutes until the maximum. */
    refillMinutes: 30,
    /** A correct answer in the mistake review gives back this many hearts. */
    reviewRestore: 1,
  },

  streak: {
    /** A day counts for the streak once the learner earns at least this much XP that day. */
    minXpForActiveDay: 1,
    /** Used until the browser tells us the learner's time zone. */
    defaultTimeZone: "Asia/Kolkata",
  },

  /** Daily XP targets, by the daily goal chosen in onboarding/settings. */
  dailyGoalXp: {
    CASUAL: 10,
    REGULAR: 20,
    SERIOUS: 30,
    INTENSE: 50,
  },

  recommendations: {
    /** An open mistake answered wrong at least this many times is a "repeated mistake". */
    repeatedMistakeMin: 2,
    /** A lesson is a "weak topic" below this accuracy (%)… */
    weakTopicAccuracyBelow: 70,
    /** …once it has at least this many answers. */
    weakTopicMinAnswers: 4,
    /** Maximum recommendations returned. */
    maxItems: 5,
  },

  placement: {
    /** Questions per unit in the placement test. */
    questionsPerUnit: 3,
    /** A unit is "passed" with at least this many correct answers out of questionsPerUnit. */
    passMark: 2,
  },
} as const;

export type DailyGoalKey = keyof typeof GAMIFICATION.dailyGoalXp;

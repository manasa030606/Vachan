"use client";

// Picks the right component for an exercise based on its `type`.
// To add a new exercise type: create its component, add its type to types/exercise.ts,
// and add one `case` here.
import type { Exercise, ExerciseComponentProps } from "@/types/exercise";
import { CharacterRecognition } from "./character-recognition";
import { CharacterSound } from "./character-sound";
import { FillInBlank } from "./fill-in-blank";
import { Matching } from "./matching";
import { MultipleChoice } from "./multiple-choice";
import { Translation } from "./translation";
import { WordOrder } from "./word-order";

export function ExerciseRenderer(props: ExerciseComponentProps<Exercise>) {
  const { exercise, ...rest } = props;

  switch (exercise.type) {
    case "multiple-choice":
      return <MultipleChoice exercise={exercise} {...rest} />;
    case "character-sound":
      return <CharacterSound exercise={exercise} {...rest} />;
    case "character-recognition":
      return <CharacterRecognition exercise={exercise} {...rest} />;
    case "matching":
      return <Matching exercise={exercise} {...rest} />;
    case "fill-in-blank":
      return <FillInBlank exercise={exercise} {...rest} />;
    case "translation":
      return <Translation exercise={exercise} {...rest} />;
    case "word-order":
      return <WordOrder exercise={exercise} {...rest} />;
  }
}

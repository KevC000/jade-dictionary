import { CategoryToIcon, PracticeType } from "../types/practice";
import { Word, WordAspect } from "../types/word";

export const randomizePracticeType = (practiceTypes: PracticeType[]) => {
  return practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
};

export const generateMultipleChoice = (words: Word[], currentWord: Word) => {
  const choices = [currentWord];

  while (choices.length < 4) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (!choices.includes(randomWord)) choices.push(randomWord);
  }

  return choices;
};
// Randomizes the question and answer for the current practice type.
export const randomizeQAWordAspects = (
  practiceType: PracticeType,
  setQAWordAspects: React.Dispatch<
    React.SetStateAction<{
      question: WordAspect | null;
      answer: WordAspect | null;
    }>
  >
) => {
  switch (practiceType) {
    case PracticeType.HanziToDefinition:
      if (Math.random() > 0.5) {
        setQAWordAspects({
          question: WordAspect.Hanzi,
          answer: WordAspect.Definition,
        });
      } else {
        setQAWordAspects({
          question: WordAspect.Definition,
          answer: WordAspect.Hanzi,
        });
      }
    case PracticeType.HanziToPinyin:
      if (Math.random() > 0.5) {
        setQAWordAspects({
          question: WordAspect.Hanzi,
          answer: WordAspect.Pinyin,
        });
      } else {
        setQAWordAspects({
          question: WordAspect.Pinyin,
          answer: WordAspect.Hanzi,
        });
      }
  }
};

export const isMultipleChoiceAnswerCorrect = (
  correctAnswer: Word,
  selectedAnswer: Word | null
): boolean => {
  return selectedAnswer != null && selectedAnswer === correctAnswer;
};

export const shuffleArray = (array: Array<any>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const randomizeFlashCard = (
  word: Word,
  practiceTypes: PracticeType[]
): { front: string; back: string } => {
  const randomPracticeType =
    practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
  let text1, text2;

  switch (randomPracticeType) {
    case PracticeType.HanziToDefinition:
      text1 = `${word.simplified}${
        word.traditional !== word.simplified ? ` (${word.traditional})` : ""
      }`;
      text2 = word.definition;
      break;
    case PracticeType.HanziToPinyin:
      text1 = `${word.simplified}${
        word.traditional !== word.simplified ? ` (${word.traditional})` : ""
      }`;
      text2 = word.pinyin;
      break;
    default:
      text1 = "";
      text2 = "";
  }

  return Math.random() > 0.5
    ? { front: text1, back: text2 }
    : { front: text2, back: text1 };
};

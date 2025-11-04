export type QuestionType = 
  | "binaryToDecimal"
  | "decimalToBinary"
  | "hexToDecimal"
  | "binaryToOctal";

export interface Question {
  type: QuestionType;
  question: string;
  answer: string;
}

// Generate a single random integer
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate one question based on type
export const generateQuestion = (type: QuestionType): Question => {
  let num: number;
  switch (type) {
    case "binaryToDecimal":
      num = randomInt(1, 255); // 8-bit binary
      return {
        type,
        question: num.toString(2), // binary string
        answer: num.toString(10),  // decimal answer
      };

    case "decimalToBinary":
      num = randomInt(1, 255);
      return {
        type,
        question: num.toString(10),       // decimal question
        answer: num.toString(2),          // binary answer
      };

    case "hexToDecimal":
      num = randomInt(1, 255);
      return {
        type,
        question: num.toString(16).toUpperCase(), // hex question
        answer: num.toString(10),                 // decimal answer
      };

    case "binaryToOctal":
      num = randomInt(1, 255);
      return {
        type,
        question: num.toString(2),   // binary question
        answer: num.toString(8),     // octal answer
      };
  }
};

// Generate 7 questions in your specific distribution
export const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  questions.push(...Array(3).fill(0).map(() => generateQuestion("binaryToDecimal")));
  questions.push(...Array(2).fill(0).map(() => generateQuestion("decimalToBinary")));
  questions.push(generateQuestion("hexToDecimal"));
  questions.push(generateQuestion("binaryToOctal"));
  return questions;
};

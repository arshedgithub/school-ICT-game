// utils/hackerQuestions.ts
export type HackerQuestionType = "multipleChoice" | "fillIn" | "trueFalse";

export interface HackerQuestion {
  type: HackerQuestionType;
  question: string;
  options?: string[]; // for multiple choice
  answer: string;
  hint?: string;
}

// Example questions based on A/L ICT syllabus
export const hackerQuestions: HackerQuestion[] = [
  {
    type: "multipleChoice",
    question: "Which logic gate outputs 1 only when both inputs are 1?",
    options: ["OR", "AND", "NOT", "XOR"],
    answer: "AND",
    hint: "Think of a gate that requires both conditions to be true."
  },
  {
    type: "fillIn",
    question: "Convert the decimal number 45 to binary.",
    answer: "101101",
    hint: "Divide by 2 and write remainders from bottom to top."
  },
  {
    type: "multipleChoice",
    question: "Which protocol is used for sending emails?",
    options: ["HTTP", "SMTP", "FTP", "TCP"],
    answer: "SMTP",
    hint: "It’s the Simple Mail Transfer Protocol."
  },
  {
    type: "trueFalse",
    question: "In a relational database, primary keys must be unique.",
    answer: "true",
    hint: "Every record needs a unique identifier."
  },
  {
    type: "fillIn",
    question: "What does CPU stand for?",
    answer: "Central Processing Unit",
    hint: "It’s the main processing unit of a computer."
  },
];

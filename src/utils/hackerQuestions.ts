export type HackerQuestionType = "multipleChoice" | "fillIn" | "trueFalse";

export interface HackerQuestion {
  type: HackerQuestionType;
  question: string;
  options?: string[]; // for multiple choice
  answer: string;
  hint?: string;
  level: number;
}

export const hackerQuestions: HackerQuestion[] = [
  {
    type: "multipleChoice",
    question: "Which logic gate outputs 1 only when both inputs are 1?",
    options: ["OR", "AND", "NOT", "XOR"],
    answer: "AND",
    hint: "Think of a gate that requires both conditions to be true.",
    level: 1
},
  {
    type: "fillIn",
    question: "Convert the decimal number 45 to binary.",
    answer: "101101",
    hint: "Divide by 2 and write remainders from bottom to top.",
    level: 1
},
  {
    type: "multipleChoice",
    question: "Which protocol is used for sending emails?",
    options: ["HTTP", "SMTP", "FTP", "TCP"],
    answer: "SMTP",
    level: 2
},
  {
    type: "trueFalse",
    question: "In a relational database, primary keys must be unique.",
    answer: "T",
    hint: "Every record needs a unique identifier.",
    level: 1
},
  {
    type: "fillIn",
    question: "What does C in CPU stand for?",
    answer: "Central",
    hint: "CPU is the main processing unit of a computer.",
    level: 1
},
  {
    type: "multipleChoice",
    question: "Which data structure uses FIFO (First In, First Out) order?",
    options: ["Stack", "Queue", "Tree", "Array"],
    answer: "Queue",
    hint: "Think of a line of people waiting for a bus.",
    level: 2
},
  {
    type: "fillIn",
    question: "Convert binary 1101 to decimal.",
    answer: "13",
    hint: "Use positional values: 8 + 4 + 0 + 1.",
    level: 1
},
  {
    type: "trueFalse",
    question: "HTML is a programming language.",
    answer: "F",
    hint: "It is a markup language, not a programming language.",
    level: 1
},
  {
    type: "multipleChoice",
    question: "Which layer of the OSI model is responsible for routing?",
    options: ["Application Layer", "Network Layer", "Transport Layer", "Session Layer"],
    answer: "Network Layer",
    hint: "Routers operate at this layer.",
    level: 3
},
  {
    type: "fillIn",
    question: "What does S in SQL stand for?",
    answer: "Structured Query Language",
    hint: "SQL is sed to communicate with relational databases.",
    level: 3
},
  {
    type: "multipleChoice",
    question: "Which of the following is NOT an example of secondary storage?",
    options: ["SSD", "RAM", "Hard Disk", "DVD"],
    answer: "RAM",
    hint: "It’s primary memory.",
    level: 2
},
  {
    type: "trueFalse",
    question: "IPv6 uses 128-bit addressing.",
    answer: "T",
    hint: "IPv4 uses 32 bits; IPv6 uses 128 bits.",
    level: 3
},
  {
    type: "multipleChoice",
    question: "Which of the following is used to prevent unauthorized access to a network?",
    options: ["Firewall", "Hub", "Switch", "Repeater"],
    answer: "Firewall",
    hint: "It filters traffic entering or leaving the network.",
    level: 2
},
  {
    type: "fillIn",
    question: "Name the component responsible for arithmetic and logical operations in the CPU.",
    answer: "ALU",
    hint: "Arithmetic Logic Unit.",
    level: 2
},
  {
    type: "multipleChoice",
    question: "Which of the following is an example of an open-source operating system?",
    options: ["Windows", "Linux", "macOS", "ChromeOS"],
    answer: "Linux",
    hint: "It’s freely available and modifiable.",
    level: 1
}
];

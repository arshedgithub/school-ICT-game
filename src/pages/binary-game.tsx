import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuestion, type Question } from "../utils/conversion";
import clsx from "clsx";

export default function BinaryGame() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [cells, setCells] = useState<
    { state: "hidden" | "correct" | "wrong" }[]
  >([]);
  const [gameOver, setGameOver] = useState(false);

  // --- Start game and build questions + initialize cells ---
  const startGame = (lvl: "easy" | "medium" | "hard") => {
    const picked = generateQuestionsByLevel(lvl);
    // Initialize 7 cells (one per question) as hidden
    const initialCells = Array(picked.length)
      .fill(null)
      .map(() => ({ state: "hidden" as const }));

    setLevel(lvl);
    setQuestions(picked);
    setCells(initialCells);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer("");
    setGameOver(false);
  };

  // Generate questions based on level
  const generateQuestionsByLevel = (lvl: "easy" | "medium" | "hard"): Question[] => {
    const all: Question[] = [];
    if (lvl === "easy") {
      all.push(...Array(5).fill(0).map(() => generateQuestion("binaryToDecimal")));
      all.push(generateQuestion("decimalToBinary"));
      all.push(generateQuestion("binaryToOctal"));
    } else if (lvl === "medium") {
      all.push(...Array(2).fill(0).map(() => generateQuestion("binaryToDecimal")));
      all.push(...Array(2).fill(0).map(() => generateQuestion("decimalToBinary")));
      all.push(...Array(2).fill(0).map(() => generateQuestion("binaryToOctal")));
      all.push(generateQuestion("hexToDecimal"));
    } else {
      all.push(generateQuestion("binaryToDecimal"));
      all.push(...Array(2).fill(0).map(() => generateQuestion("decimalToBinary")));
      all.push(...Array(2).fill(0).map(() => generateQuestion("binaryToOctal")));
      all.push(...Array(2).fill(0).map(() => generateQuestion("hexToDecimal")));
    }
    return all;
  };

  // --- Submit logic ---
  const handleSubmit = () => {
    if (!questions[currentIndex] || !userAnswer.trim()) return;

    const question = questions[currentIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

    // Update cell state for current question
    setCells((prev) => {
      const copy = [...prev];
      copy[currentIndex] = { state: isCorrect ? "correct" : "wrong" };
      return copy;
    });

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setUserAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setTimeout(() => setGameOver(true), 400);
    }
  };

  // --- Level selection UI ---
  if (level === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">🔢 Binary Conversion Challenge</h1>
        <p className="mb-6 text-lg text-gray-300">Choose difficulty</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => startGame("easy")}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold"
          >
            Easy
          </button>
          <button
            onClick={() => startGame("medium")}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg font-semibold"
          >
            Medium
          </button>
          <button
            onClick={() => startGame("hard")}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold"
          >
            Hard
          </button>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg"
          >
            ← Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // --- Game Over Modal ---
  if (gameOver) {
    const allCorrect = cells.every((c) => c.state === "correct");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {allCorrect ? "🎉 Perfect Score!" : "💀 Game Over"}
          </h2>
          <p className="mb-4 text-xl">
            Your score: {score} / {questions.length}
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {cells.map((c, i) => (
              <div
                key={i}
                className={clsx(
                  "w-10 h-10 flex items-center justify-center rounded-md text-lg font-semibold",
                  c.state === "correct"
                    ? "bg-green-700 border-2 border-green-500 text-white"
                    : c.state === "wrong"
                    ? "bg-red-700 border-2 border-red-500 text-white"
                    : "bg-gray-800 border-2 border-gray-600 text-gray-300"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startGame(level)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => setLevel(null)}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg"
            >
              Back to Levels
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- In-game UI ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      {/* Top-left/back and top-right/winners */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setLevel(null)}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md shadow"
        >
          ← Back
        </button>
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate("/binary-winners")}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md shadow"
        >
          Winners
        </button>
      </div>

      <div className="max-w-3xl mx-auto pt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">🔢 Binary Puzzle</h1>

        {/* Question cells row - Q1 to Q7 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cells.map((cell, idx) => (
            <div
              key={idx}
              className={clsx(
                "w-12 h-12 flex items-center justify-center rounded-md text-lg font-semibold border-2 transition-all",
                cell.state === "correct"
                  ? "bg-green-700 border-green-500 text-white"
                  : cell.state === "wrong"
                  ? "bg-red-700 border-red-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300"
              )}
            >
              Q{idx + 1}
            </div>
          ))}
        </div>

        {/* Question card */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">
              Question {currentIndex + 1} / {questions.length}
            </div>
            <div className="text-sm text-gray-300">Score: {score}</div>
          </div>

          <p className="text-lg">
            {currentQuestion.type === "binaryToDecimal" &&
              `Convert below Binary number to Decimal number: `}
            {currentQuestion.type === "decimalToBinary" &&
              `Convert below Decimal number to Binary number:`}
            {currentQuestion.type === "hexToDecimal" &&
              `Convert below Hex number to Decimal number:`}
            {currentQuestion.type === "binaryToOctal" &&
              `Convert below Binary number to Octal number`}
          </p>

          <p className="mb-4">{currentQuestion.question}</p>

          {/* Input */}
          <div className="mb-4">
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userAnswer.trim()) handleSubmit();
              }}
              placeholder="Type your answer and press Enter"
              className="w-full px-4 py-2 rounded-lg text-black bg-gray-200"
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className={clsx("px-4 py-2 rounded-lg font-semibold transition", {
                "bg-green-600 hover:bg-green-700 text-white": userAnswer.trim(),
                "bg-gray-600 text-gray-300 cursor-not-allowed": !userAnswer.trim(),
              })}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

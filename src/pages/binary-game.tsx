import { useState, useEffect } from "react";
import { generateQuestions, type Question } from "../utils/conversion";

export default function BinaryGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (userAnswer.trim() === currentQ.answer) {
      setScore(score + 1);
    }
    setUserAnswer("");
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      {currentIndex < questions.length ? (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl md:text-2xl mb-4 font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <p className="mb-6 text-lg">
            {currentQ.type === "binaryToDecimal" && `Binary → Decimal: ${currentQ.question}`}
            {currentQ.type === "decimalToBinary" && `Decimal → Binary: ${currentQ.question}`}
            {currentQ.type === "hexToDecimal" && `Hex → Decimal: ${currentQ.question}`}
            {currentQ.type === "binaryToOctal" && `Binary → Octal: ${currentQ.question}`}
          </p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg text-black text-lg"
            placeholder="Your answer"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-4">Your score: {score} / {questions.length}</p>
          <button
            onClick={() => {
              setQuestions(generateQuestions());
              setCurrentIndex(0);
              setScore(0);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

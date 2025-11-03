import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hackerQuestions, type HackerQuestion } from "../utils/hackerQuestions";

export default function HackerGame() {
  const navigate = useNavigate(); // React Router navigation
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion: HackerQuestion | undefined = hackerQuestions[currentIndex];

  if (!currentQuestion) return null;

  const handleSubmit = () => {
    if (userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setScore(score + 1);
    }
    setUserAnswer("");
    setShowHint(false);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      {/* Back Button */}
      <div className="self-start mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition"
        >
          ← Back to Home
        </button>
      </div>

      {currentIndex < hackerQuestions.length ? (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Question {currentIndex + 1} of {hackerQuestions.length}
          </h2>

          <p className="mb-6 text-lg">{currentQuestion.question}</p>

          {currentQuestion.type === "multipleChoice" && currentQuestion.options && (
            <div className="flex flex-col gap-2 mb-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setUserAnswer(opt)}
                  className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type !== "multipleChoice" && (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-lg text-black text-lg"
              placeholder="Your answer"
            />
          )}

          {currentQuestion.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-yellow-400 underline mb-4"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          )}
          {showHint && <p className="text-yellow-400 mb-4">{currentQuestion.hint}</p>}

          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-4">
            Your score: {score} / {hackerQuestions.length}
          </p>
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setUserAnswer("");
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Play Again
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

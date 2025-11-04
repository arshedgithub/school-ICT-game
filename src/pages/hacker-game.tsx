// src/pages/HackerGame.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hackerQuestions, type HackerQuestion } from "../utils/hackerQuestions";
import clsx from "clsx";

export default function HackerGame() {
  const navigate = useNavigate();

  const [level, setLevel] = useState<number | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<HackerQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>(""); // for MCQ / TF selection
  const [passwordCells, setPasswordCells] = useState<
    { char: string; state: "hidden" | "correct" | "wrong" }[]
  >([]);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // --- Start game and build selectedQuestions + placeholder cells ---
  const startGame = (chosenLevel: number) => {
    const easy = hackerQuestions.filter((q) => q.level === 1);
    const medium = hackerQuestions.filter((q) => q.level === 2);
    const hard = hackerQuestions.filter((q) => q.level === 3);

    let picked: HackerQuestion[] = [];
    if (chosenLevel === 1) {
      picked = easy.sort(() => Math.random() - 0.5).slice(0, 5);
    } else if (chosenLevel === 2) {
      picked = [
        ...easy.sort(() => Math.random() - 0.5).slice(0, 1),
        ...medium.sort(() => Math.random() - 0.5).slice(0, 4),
      ];
    } else {
      picked = [
        ...easy.sort(() => Math.random() - 0.5).slice(0, 1),
        ...medium.sort(() => Math.random() - 0.5).slice(0, 1),
        ...hard.sort(() => Math.random() - 0.5).slice(0, 3),
      ];
    }

    // placeholder: one X cell per answer character
    const placeholder: { char: string; state: "hidden" | "correct" | "wrong" }[] = [];
    picked.forEach((q) => {
      const len = q.answer.trim().length;
      for (let i = 0; i < len; i++) placeholder.push({ char: "X", state: "hidden" });
    });

    setLevel(chosenLevel);
    setSelectedQuestions(picked);
    setPasswordCells(placeholder);
    setCurrentIndex(0);
    setUserAnswer("");
    setSelectedOption("");
    setShowHint(false);
    setGameOver(false);
  };

  // --- Submit logic ---
  const handleSubmit = () => {
    if (!selectedQuestions[currentIndex]) return;

    const question = selectedQuestions[currentIndex];
    const correct = question.answer.trim();
    // normalize answers: for MCQ/TF we expect selectedOption (already set to T/F or option text)
    let answerToCheck = question.type === "multipleChoice" || question.type === "trueFalse"
      ? selectedOption
      : userAnswer.trim();

    // unify case for compare
    const isCorrect = answerToCheck.trim().toLowerCase() === correct.toLowerCase();

    // compute offset of this question's characters in the cell array
    const offset = selectedQuestions.slice(0, currentIndex).reduce((acc, q) => acc + q.answer.trim().length, 0);

    if (isCorrect) {
      const chars = correct.split("");
      setPasswordCells((prev) => {
        const copy = [...prev];
        chars.forEach((c, i) => {
          copy[offset + i] = { char: c.toUpperCase(), state: "correct" };
        });
        return copy;
      });
    } else {
      // set these cells to wrong (red) and keep blank char (user requested blank letters)
      const len = correct.length;
      setPasswordCells((prev) => {
        const copy = [...prev];
        for (let i = 0; i < len; i++) {
          copy[offset + i] = { char: "", state: "wrong" }; // blank letter in red cell
        }
        return copy;
      });
      // DO NOT revert wrong cells back — they must remain red
    }

    // clear inputs / selection and move on
    setUserAnswer("");
    setSelectedOption("");
    setShowHint(false);

    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex((s) => s + 1);
    } else {
      // finished all questions -> show modal after small delay
      setTimeout(() => setGameOver(true), 400);
    }
  };

  // helper: whether submit button should be enabled
  const submitEnabled = (() => {
    const q = selectedQuestions[currentIndex];
    if (!q) return false;
    if (q.type === "multipleChoice" || q.type === "trueFalse") return selectedOption !== "";
    return userAnswer.trim() !== "";
  })();

  // --- Level selection UI ---
  if (level === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
        {/* small embedded help CSS for modal fade-in if needed */}
        <h1 className="text-3xl font-bold mb-6">🧠 Hacker Challenge</h1>
        <p className="mb-6 text-lg text-gray-300">Choose difficulty</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => startGame(1)} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold">Easy</button>
          <button onClick={() => startGame(2)} className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg font-semibold">Medium</button>
          <button onClick={() => startGame(3)} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold">Hard</button>
          <button onClick={() => navigate("/")} className="mt-4 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg">← Home</button>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentIndex];

  // --- Game Over Modal ---
  if (gameOver) {
    const allCorrect = passwordCells.every((c) => c.state === "correct");
    const finalPassword = passwordCells.map((c) => (c.state === "correct" ? c.char : "")).join("");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {allCorrect ? "🎉 You Cracked the Code!" : "💀 Mission Failed"}
          </h2>
          <p className="mb-4">Final password: <span className="font-mono text-green-400">{finalPassword}</span></p>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {passwordCells.map((c, i) => (
              <div key={i} className={clsx("w-10 h-10 flex items-center justify-center rounded-md text-lg font-semibold",
                c.state === "correct" ? "bg-green-700 border-2 border-green-500 text-white" :
                c.state === "wrong" ? "bg-red-700 border-2 border-red-500 text-white" : "bg-gray-800 border-2 border-gray-600 text-gray-300"
              )}>{c.char || "_"}</div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => startGame(level)} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">Try Again</button>
            <button onClick={() => setLevel(null)} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg">Back to Levels</button>
            <button onClick={() => navigate("/")} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg">Home</button>
          </div>
        </div>
      </div>
    );
  }

  // --- In-game UI ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      {/* Embedded CSS for 3D flip and small utilities */}
      <style>{`
        .cell-outer { perspective: 700px; }
        .cell-inner {
          width: 40px; height: 40px;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
          position: relative;
        }
        .cell-inner.flipped { transform: rotateY(180deg); }
        .cell-face {
          position: absolute; inset: 0; display:flex; align-items:center; justify-content:center;
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
          border-radius: 6px;
        }
        .cell-front { transform: rotateY(0deg); }
        .cell-back { transform: rotateY(180deg); }
      `}</style>

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
          onClick={() => navigate("/hacker-winners")}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md shadow"
        >
          Winners
        </button>
      </div>

      <div className="max-w-3xl mx-auto pt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">🧩 Hacker Puzzle</h1>

        {/* Password cells row */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {passwordCells.map((cell, idx) => {
            const showBack = cell.state === "correct" || cell.state === "wrong";
            return (
              <div key={idx} className="cell-outer">
                <div className={clsx("cell-inner", { "flipped": showBack })}>
                  {/* front */}
                  <div className={clsx("cell-face cell-front border-2 rounded-md", {
                    "bg-gray-800 border-gray-600 text-gray-300": cell.state === "hidden",
                    // front won't be visible when flipped, but keep styles
                  })}>
                    <span className="text-lg font-semibold">{cell.char || "X"}</span>
                  </div>

                  {/* back */}
                  <div className={clsx("cell-face cell-back border-2 rounded-md", {
                    "bg-green-700 border-green-500 text-white": cell.state === "correct",
                    "bg-red-700 border-red-500 text-white": cell.state === "wrong",
                  })}>
                    <span className="text-lg font-semibold">{cell.state === "correct" ? cell.char : ""}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Question card */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Question {currentIndex + 1} / {selectedQuestions.length}</div>
            <div className="text-sm text-gray-300">Level {selectedQuestions[currentIndex].level}</div>
          </div>

          <p className="text-lg mb-4">{currentQuestion.question}</p>

          {/* Multiple choice */}
          {currentQuestion.type === "multipleChoice" && currentQuestion.options && (
            <div className="flex flex-col gap-2 mb-4">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      if (selectedOption === opt) {
                        // double click behavior: when clicking again quickly treat as submit;
                        // user asked double click to submit -> we'll require double click
                        // but here we detect the immediate second click by comparing equality
                        handleSubmit();
                      } else {
                        setSelectedOption(opt);
                        setUserAnswer(""); // clear text input
                      }
                    }}
                    onDoubleClick={() => handleSubmit()}
                    className={clsx("text-left px-4 py-2 rounded-lg transition flex items-center justify-between", {
                      "bg-blue-600 text-white": isSelected,
                      "bg-blue-500 text-white hover:bg-blue-600": !isSelected,
                    })}
                  >
                    <span>{opt}</span>
                    {isSelected && <span className="text-sm opacity-80">Selected</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* True/False */}
          {currentQuestion.type === "trueFalse" && (
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => {
                  if (selectedOption === "T") {
                    handleSubmit(); // second click quick submit
                  } else {
                    setSelectedOption("T");
                    setUserAnswer("");
                  }
                }}
                onDoubleClick={() => handleSubmit()}
                className={clsx("px-4 py-2 rounded-lg transition", {
                  "bg-blue-600 text-white": selectedOption === "T",
                  "bg-blue-500 text-white hover:bg-blue-600": selectedOption !== "T",
                })}
              >
                True
              </button>

              <button
                onClick={() => {
                  if (selectedOption === "F") {
                    handleSubmit();
                  } else {
                    setSelectedOption("F");
                    setUserAnswer("");
                  }
                }}
                onDoubleClick={() => handleSubmit()}
                className={clsx("px-4 py-2 rounded-lg transition", {
                  "bg-blue-600 text-white": selectedOption === "F",
                  "bg-blue-500 text-white hover:bg-blue-600": selectedOption !== "F",
                })}
              >
                False
              </button>
            </div>
          )}

          {/* Free text */}
          {currentQuestion.type === "fillIn" && (
            <div className="mb-4">
              <input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && submitEnabled) handleSubmit();
                }}
                placeholder="Type your answer and press Enter"
                className="w-full px-4 py-2 rounded-lg text-black bg-gray-200"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div>
              {currentQuestion.hint && (
                <button
                  onClick={() => setShowHint((s) => !s)}
                  className="text-yellow-400 underline"
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // skip/back one question (optional) — keep as small utility
                  if (currentIndex > 0) {
                    setCurrentIndex((i) => i - 1);
                    setSelectedOption("");
                    setUserAnswer("");
                  }
                }}
                className="text-sm text-gray-300"
              >
                Prev
              </button>

              <button
                onClick={handleSubmit}
                disabled={!submitEnabled}
                className={clsx("px-4 py-2 rounded-lg font-semibold transition", {
                  "bg-green-600 hover:bg-green-700 text-white": submitEnabled,
                  "bg-gray-600 text-gray-300 cursor-not-allowed": !submitEnabled,
                })}
              >
                Submit
              </button>
            </div>
          </div>

          {showHint && currentQuestion.hint && (
            <p className="mt-3 text-yellow-500 italic">💡 {currentQuestion.hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}

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
    const [passwordCells, setPasswordCells] = useState<{ char: string; state: "hidden" | "correct" | "wrong" }[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const startGame = (chosenLevel: number) => {
        const easy = hackerQuestions.filter((q) => q.level === 1);
        const medium = hackerQuestions.filter((q) => q.level === 2);
        const hard = hackerQuestions.filter((q) => q.level === 3);

        let picked: HackerQuestion[] = [];
        if (chosenLevel === 1) {
            picked = easy.sort(() => 0.5 - Math.random()).slice(0, 5);
        } else if (chosenLevel === 2) {
            picked = [
                ...easy.sort(() => 0.5 - Math.random()).slice(0, 1),
                ...medium.sort(() => 0.5 - Math.random()).slice(0, 4),
            ];
        } else if (chosenLevel === 3) {
            picked = [
                ...easy.sort(() => 0.5 - Math.random()).slice(0, 1),
                ...medium.sort(() => 0.5 - Math.random()).slice(0, 1),
                ...hard.sort(() => 0.5 - Math.random()).slice(0, 3),
            ];
        }

        // prepare placeholder password cells with 'X'
        const placeholderCells: { char: string; state: "hidden" | "correct" | "wrong" }[] = [];
        picked.forEach((q) => {
            const len = q.answer.trim().length;
            for (let i = 0; i < len; i++) {
                placeholderCells.push({ char: "X", state: "hidden" });
            }
        });

        setPasswordCells(placeholderCells);
        setLevel(chosenLevel);
        setSelectedQuestions(picked);
        setCurrentIndex(0);
        setUserAnswer("");
        setShowHint(false);
        setGameOver(false);
    };

    const handleSubmit = () => {
        if (!selectedQuestions[currentIndex]) return;
        const correctAnswer = selectedQuestions[currentIndex].answer.trim();

        let answer = userAnswer.trim().toLowerCase();
        const isCorrect = answer === correctAnswer.toLowerCase();

        // compute offset in password cells
        const offset = selectedQuestions
            .slice(0, currentIndex)
            .reduce((acc, q) => acc + q.answer.trim().length, 0);

        if (isCorrect) {
            const chars = correctAnswer.split("");
            setPasswordCells((prev) => {
                const copy = [...prev];
                chars.forEach((c, i) => {
                    copy[offset + i] = { char: c.toUpperCase(), state: "correct" };
                });
                return copy;
            });
        } else {
            const len = correctAnswer.length;
            setPasswordCells((prev) => {
                const copy = [...prev];
                for (let i = 0; i < len; i++) {
                    copy[offset + i] = { char: "X", state: "wrong" };
                }
                return copy;
            });
            setTimeout(() => {
                setPasswordCells((prev) => {
                    const copy = [...prev];
                    for (let i = 0; i < len; i++) {
                        copy[offset + i] = { char: "X", state: "hidden" };
                    }
                    return copy;
                });
            }, 700);
        }

        setUserAnswer("");
        setShowHint(false);

        if (currentIndex < selectedQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setTimeout(() => setGameOver(true), 800);
        }
    };

    if (level === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                <h1 className="text-3xl font-bold mb-8">🧠 Hacker Game</h1>
                <p className="mb-6 text-lg">Select your difficulty level:</p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => startGame(1)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md"
                    >
                        Easy
                    </button>
                    <button
                        onClick={() => startGame(2)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg shadow-md"
                    >
                        Medium
                    </button>
                    <button
                        onClick={() => startGame(3)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-md"
                    >
                        Hard
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = selectedQuestions[currentIndex];

    // Game Over Modal
    if (gameOver) {
        const allCorrect = passwordCells.every((c) => c.state === "correct");
        const finalPassword = passwordCells
            .map((c) => (c.state === "correct" ? c.char : ""))
            .join("");
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center w-full max-w-md animate-fadeIn">
                    <h2 className="text-3xl font-bold mb-4">
                        {allCorrect ? "🎉 You Cracked the Code!" : "💀 Mission Failed!"}
                    </h2>
                    <p className="text-lg mb-6">
                        Final Password:{" "}
                        <span className="font-mono text-green-400">{finalPassword}</span>
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => startGame(level)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => setLevel(null)}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md"
                        >
                            Back to Levels
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md"
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- UI: In-game ---
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="self-start mb-4">
                <button
                    onClick={() => setLevel(null)}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition"
                >
                    ← Back
                </button>
            </div>

            {/* Password Cells with flip animation */}
            <div className="flex flex-wrap gap-1 mb-8 justify-center">
                {passwordCells.map((cell, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "w-10 h-10 flex items-center justify-center border-2 rounded-md text-lg font-semibold transition-all duration-500 transform",
                            {
                                "border-green-500 bg-green-700 rotate-y-180": cell.state === "correct",
                                "border-red-500 bg-red-700 rotate-y-180": cell.state === "wrong",
                                "border-gray-600 bg-gray-800": cell.state === "hidden",
                            }
                        )}
                        style={{
                            perspective: "600px",
                            transformStyle: "preserve-3d",
                            transition: "transform 0.6s ease",
                        }}
                    >
                        {cell.char}
                    </div>
                ))}
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
                <h2 className="text-xl font-semibold mb-4">
                    Question {currentIndex + 1} of {selectedQuestions.length}
                </h2>
                <p className="mb-6 text-lg">{currentQuestion.question}</p>

                {currentQuestion.type === "multipleChoice" &&
                    currentQuestion.options && (
                        <div className="flex flex-col gap-2 mb-4">
                            {currentQuestion.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setUserAnswer(opt)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                {currentQuestion.type === "trueFalse" && (
                    <div className="flex flex-col gap-2 mb-4">
                        <button
                            onClick={() => setUserAnswer("T")}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                        >
                            True
                        </button>
                        <button
                            onClick={() => setUserAnswer("F")}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                        >
                            False
                        </button>
                    </div>
                )}

                {currentQuestion.type !== "multipleChoice" &&
                    currentQuestion.type !== "trueFalse" && (
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="w-full mb-4 px-4 py-2 rounded-lg text-black bg-gray-300 text-lg"
                            placeholder="Your answer"
                        />
                    )}

                <div>
                    {currentQuestion.hint && (
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="text-sm text-yellow-400 underline mb-4"
                        >
                            {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                    )}
                    {showHint && (
                        <p className="text-yellow-400 mb-4 italic">
                            💡 {currentQuestion.hint}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

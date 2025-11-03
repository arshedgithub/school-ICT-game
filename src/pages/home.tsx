import { FaCode, FaUserSecret } from "react-icons/fa";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans flex flex-col">
      
      {/* Header */}
      <header className="flex justify-center items-center py-16 px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl font-bold text-center leading-snug">
          🧠 Welcome to the IT Day Game Zone
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-grow flex justify-center items-start px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
          {/* Binary Game Card */}
          <div className="bg-gray-900 hover:bg-blue-900 transition-colors duration-300 rounded-2xl p-8 text-center shadow-xl shadow-blue-900/50 flex flex-col justify-between">
            <div>
              <FaCode className="text-6xl md:text-7xl text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                Binary Conversion Game
              </h2>
              <p className="text-gray-300 mb-6 text-sm md:text-base">
                Test your logic skills by converting binary to decimal! <br /> Perfect for juniors (Grade 6–9).
              </p>
            </div>
            <a
              href="/binary"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg md:text-xl py-3 px-6 rounded-lg shadow-md shadow-blue-500/50 transition duration-300 inline-block mx-auto"
            >
              Play Now
            </a>
          </div>

          {/* Hacker Puzzle Card */}
          <div className="bg-gray-900 hover:bg-green-900 transition-colors duration-300 rounded-2xl p-8 text-center shadow-xl shadow-green-900/50 flex flex-col justify-between">
            <div>
              <FaUserSecret className="text-6xl md:text-7xl text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                Hacker Puzzle Game
              </h2>
              <p className="text-gray-300 mb-6 text-sm md:text-base">
                Crack codes, decode patterns, and think like a hacker. <br /> Designed for seniors (Grade 10–13).
              </p>
            </div>
            <a
              href="/hacker-puzzle"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg md:text-xl py-3 px-6 rounded-lg shadow-md shadow-green-500/50 transition duration-300 inline-block mx-auto"
            >
              Start Hacking
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-gray-400 text-sm md:text-base text-center">
        © 2025 IT Day | Created by CodeMyte Lab
      </footer>
    </div>
  );
}

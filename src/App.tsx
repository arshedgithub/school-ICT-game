import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import HackerGame from "./pages/hacker-game";
import BinaryGame from "./pages/binary-game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hacker-puzzle" element={<HackerGame />} />
        <Route path="/binary" element={<BinaryGame />} />
      </Routes>
    </BrowserRouter>
  );
}

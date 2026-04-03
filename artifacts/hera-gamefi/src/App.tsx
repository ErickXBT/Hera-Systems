import { useState } from "react";
import Landing from "./Landing";
import Game from "./Game";

export default function App() {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <Game onGoHome={() => setShowGame(false)} />;
  }

  return <Landing onPlayGame={() => setShowGame(true)} />;
}

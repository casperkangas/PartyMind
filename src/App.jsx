import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import ResultsScreen from "./components/ResultsScreen"; // <--- Import this
import { useGameStore } from "./store";

function App() {
  const screen = useGameStore((state) => state.screen);

  return (
    <>
      {screen === "home" && <HomeScreen />}
      {screen === "game" && <GameScreen />}
      {screen === "results" && <ResultsScreen />}
    </>
  );
}

export default App;

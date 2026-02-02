import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import { useGameStore } from "./store";

function App() {
  const screen = useGameStore((state) => state.screen);

  return (
    <>
      {screen === "home" && <HomeScreen />}
      {screen === "game" && <GameScreen />}
      {/* We will add ResultsScreen later */}
    </>
  );
}

export default App;

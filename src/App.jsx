import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import { useGameStore } from "./store";

function App() {
  const screen = useGameStore((state) => state.screen);
  const returnToHome = useGameStore((state) => state.returnToHome);

  return (
    <>
      {screen === "home" && <HomeScreen />}
      {screen === "game" && <GameScreen />}

      {/* Temporary Results Placeholder */}
      {screen === "results" && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Game Over!</h1>
          <button
            onClick={returnToHome}
            style={{ padding: "20px", fontSize: "1.5rem" }}
          >
            Back to Home
          </button>
        </div>
      )}
    </>
  );
}

export default App;

import { useGameStore } from "../store";

export default function GameScreen() {
  const returnToHome = useGameStore((state) => state.returnToHome);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const settings = useGameStore((state) => state.settings);

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1 style={{ color: "var(--primary)" }}>Game On!</h1>

      <div
        style={{
          margin: "30px 0",
          padding: "20px",
          background: "var(--bg-light)",
          borderRadius: "10px",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>Current Player:</p>
        <h2 style={{ fontSize: "2rem" }}>{currentPlayer?.name}</h2>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <p>Circle 1 of {settings.circles}</p>
        <p>Mode: {settings.difficulty}</p>
      </div>

      <button
        onClick={returnToHome}
        style={{
          padding: "10px 20px",
          backgroundColor: "transparent",
          border: "1px solid var(--danger)",
          color: "var(--danger)",
          borderRadius: "5px",
        }}
      >
        Quit Game
      </button>
    </div>
  );
}

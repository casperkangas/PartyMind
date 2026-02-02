import { useState, useEffect } from "react";
import { useGameStore } from "../store";
import { generateChallenge } from "../services/ai";

export default function GameScreen() {
  const [challenge, setChallenge] = useState("Loading challenge...");
  const [loading, setLoading] = useState(true);

  const returnToHome = useGameStore((state) => state.returnToHome);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const settings = useGameStore((state) => state.settings);

  const currentPlayer = players[currentPlayerIndex];

  // Effect: Generate a challenge when the component mounts or player changes
  useEffect(() => {
    async function fetchTask() {
      setLoading(true);
      const text = await generateChallenge(
        settings.difficulty,
        players,
        currentPlayer.name,
      );
      setChallenge(text);
      setLoading(false);
    }

    fetchTask();
  }, [currentPlayerIndex]); // Re-run when player changes

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "30px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Info */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Circle {useGameStore((state) => state.currentCircle)} /{" "}
          {settings.circles}
        </p>
        <h2 style={{ color: "var(--primary)", fontSize: "2.5rem" }}>
          {currentPlayer?.name}
        </h2>
        <p style={{ color: "var(--highlight)" }}>It's your turn!</p>
      </div>

      {/* The Challenge Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "20px 0",
          padding: "20px",
          backgroundColor: "var(--bg-light)",
          borderRadius: "15px",
          border: "2px solid var(--border)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        {loading ? (
          <p style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
            Asking the AI...
          </p>
        ) : (
          <p
            style={{ fontSize: "1.5rem", lineHeight: "1.4", fontWeight: "500" }}
          >
            {challenge}
          </p>
        )}
      </div>

      {/* Controls */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={returnToHome}
          style={{
            flex: 1,
            padding: "15px",
            backgroundColor: "transparent",
            border: "1px solid var(--danger)",
            color: "var(--danger)",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          Quit
        </button>

        {/* Placeholder for "Next" button - we will logic this next */}
        <button
          style={{
            flex: 2,
            padding: "15px",
            backgroundColor: "var(--primary)",
            color: "var(--btn-text)",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          Done!
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useGameStore } from "../store";
import { generateChallenge } from "../services/ai";

export default function GameScreen() {
  // Global State
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const currentCircle = useGameStore((state) => state.currentCircle);
  const settings = useGameStore((state) => state.settings);
  const returnToHome = useGameStore((state) => state.returnToHome);
  const nextTurn = useGameStore((state) => state.nextTurn);

  // Local Component State
  const [challenge, setChallenge] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit); // Initialize with setting

  const currentPlayer = players[currentPlayerIndex];

  // --- EFFECT 1: Fetch Challenge & Reset Timer on Turn Change ---
  useEffect(() => {
    async function fetchTask() {
      setLoading(true);
      // Reset timer whenever player changes
      setTimeLeft(settings.timeLimit);

      const text = await generateChallenge(
        settings.difficulty,
        players,
        currentPlayer.name,
      );
      setChallenge(text);
      setLoading(false);
    }

    if (currentPlayer) {
      fetchTask();
    }
  }, [currentPlayerIndex, settings.difficulty, players, settings.timeLimit]);

  // --- EFFECT 2: The Countdown Timer ---
  useEffect(() => {
    // Only run if we have a time limit, time is left, and we aren't loading
    if (settings.timeLimit > 0 && timeLeft > 0 && !loading) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, settings.timeLimit, loading]);

  // Helper to format time (e.g. 0:05)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar: Circle & Timer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>
          Circle {currentCircle} / {settings.circles}
        </span>

        {settings.timeLimit > 0 && (
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: timeLeft <= 5 ? "var(--danger)" : "var(--text)",
              fontVariantNumeric: "tabular-nums", // Keeps numbers from jumping width
            }}
          >
            ⏱ {formatTime(timeLeft)}
          </span>
        )}
      </div>

      {/* Player Info */}
      <div style={{ marginBottom: "10px" }}>
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0 20px 0",
          padding: "20px",
          backgroundColor: "var(--bg-light)",
          borderRadius: "15px",
          border:
            timeLeft === 0 && settings.timeLimit > 0
              ? "2px solid var(--danger)" // Red border when time is up
              : "2px solid var(--border)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          transition: "border-color 0.3s",
        }}
      >
        {loading ? (
          <p style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
            Asking the AI...
          </p>
        ) : (
          <>
            <p
              style={{
                fontSize: "1.4rem",
                lineHeight: "1.4",
                fontWeight: "500",
              }}
            >
              {challenge}
            </p>
            {/* Show TIME UP message if timer hits 0 */}
            {settings.timeLimit > 0 && timeLeft === 0 && (
              <p
                style={{
                  color: "var(--danger)",
                  fontWeight: "bold",
                  marginTop: "15px",
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                }}
              >
                ⏰ Time's Up! Drink! ⏰
              </p>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={returnToHome}
          style={{
            padding: "15px",
            backgroundColor: "transparent",
            border: "2px solid var(--danger)",
            color: "var(--danger)",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.2rem", // <--- Added to match Done button
            cursor: "pointer",
          }}
        >
          Quit
        </button>

        <button
          onClick={nextTurn}
          style={{
            padding: "15px",
            backgroundColor: "var(--primary)",
            border: "2px solid var(--primary)",
            color: "var(--btn-text)",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          Done!
        </button>
      </div>
    </div>
  );
}

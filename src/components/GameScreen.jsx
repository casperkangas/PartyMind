import { useState, useEffect } from "react";
import { useGameStore } from "../store";
import { generateChallenge } from "../services/ai";

export default function GameScreen() {
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const currentCircle = useGameStore((state) => state.currentCircle);
  const settings = useGameStore((state) => state.settings);
  const skippedInCircle = useGameStore((state) => state.skippedInCircle); // <--- Get skip list
  const markPlayerSkipped = useGameStore((state) => state.markPlayerSkipped); // <--- Action
  const returnToHome = useGameStore((state) => state.returnToHome);
  const nextTurn = useGameStore((state) => state.nextTurn);

  const [challenge, setChallenge] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [penaltyText, setPenaltyText] = useState(""); // Track if we added a penalty

  const currentPlayer = players[currentPlayerIndex];
  const hasSkipped = skippedInCircle.includes(currentPlayer?.id);

  // --- Fetch Challenge Logic (Reusable) ---
  const fetchTask = async (isSkip = false) => {
    setLoading(true);
    setPenaltyText(""); // Clear old penalty
    setTimeLeft(settings.timeLimit); // Reset timer

    let text = await generateChallenge(
      settings.difficulty,
      players,
      currentPlayer.name,
    );

    // If this was triggered by a Skip, append the penalty
    if (isSkip) {
      setPenaltyText("⚠️ PENALTY: Drink 2 sips! ⚠️");
    }

    setChallenge(text);
    setLoading(false);
  };

  // Effect: Fetch on new turn
  useEffect(() => {
    if (currentPlayer) fetchTask();
  }, [currentPlayerIndex, currentCircle]); // Re-run when player or circle changes

  // Timer Effect
  useEffect(() => {
    if (settings.timeLimit > 0 && timeLeft > 0 && !loading) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, settings.timeLimit, loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // --- NEW: Handle Skip ---
  const handleSkip = () => {
    if (hasSkipped) return;
    markPlayerSkipped(currentPlayer.id); // Mark used in store
    fetchTask(true); // Fetch new task with penalty flag
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
      {/* Top Bar */}
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
              fontVariantNumeric: "tabular-nums",
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

      {/* Challenge Card */}
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
              ? "2px solid var(--danger)"
              : "2px solid var(--border)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        {loading ? (
          <p style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
            {import.meta.env.DEV ? "Fetching Dev Task..." : "Asking the AI..."}
          </p>
        ) : (
          <>
            {penaltyText && (
              <p
                style={{
                  color: "var(--secondary)",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: "1.2rem",
                }}
              >
                {penaltyText}
              </p>
            )}
            <p
              style={{
                fontSize: "1.4rem",
                lineHeight: "1.4",
                fontWeight: "500",
              }}
            >
              {challenge}
            </p>
            {settings.timeLimit > 0 && timeLeft === 0 && (
              <p
                style={{
                  color: "var(--danger)",
                  fontWeight: "bold",
                  marginTop: "15px",
                  textTransform: "uppercase",
                }}
              >
                ⏰ Time's Up! ⏰
              </p>
            )}
          </>
        )}
      </div>

      {/* Controls Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr", // Quit | Skip | Done
          gap: "10px",
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
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Quit
        </button>

        <button
          onClick={handleSkip}
          disabled={hasSkipped || loading} // Disable if used or loading
          style={{
            padding: "15px",
            backgroundColor: hasSkipped ? "var(--bg)" : "var(--highlight)",
            border: "2px solid var(--highlight)",
            color: hasSkipped ? "var(--text-muted)" : "var(--bg-dark)",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: hasSkipped ? "not-allowed" : "pointer",
            opacity: hasSkipped ? 0.5 : 1,
          }}
        >
          {hasSkipped ? "Skipped" : "Skip"}
        </button>

        <button
          onClick={nextTurn}
          disabled={loading}
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

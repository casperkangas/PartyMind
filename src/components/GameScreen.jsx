import { useState, useEffect } from "react";
import useSound from "use-sound"; // <--- Import the hook
import { useGameStore } from "../store";
import { generateChallenge } from "../services/ai";

export default function GameScreen() {
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const currentCircle = useGameStore((state) => state.currentCircle);
  const settings = useGameStore((state) => state.settings);
  const skippedInCircle = useGameStore((state) => state.skippedInCircle);
  const markPlayerSkipped = useGameStore((state) => state.markPlayerSkipped);
  const returnToHome = useGameStore((state) => state.returnToHome);
  const nextTurn = useGameStore((state) => state.nextTurn);

  const [challenge, setChallenge] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [penaltyText, setPenaltyText] = useState("");

  // --- SOUND HOOKS ---
  // The 'soundEnabled' check happens inside the play function later
  const [playTick] = useSound("/sounds/tick.mp3", { volume: 0.5 });
  const [playAlarm] = useSound("/sounds/alarm.mp3", { volume: 0.7 });
  const [playPop] = useSound("/sounds/pop.mp3", { volume: 0.5 });

  const currentPlayer = players[currentPlayerIndex];
  const hasSkipped = skippedInCircle.includes(currentPlayer?.id);

  // Helper to play sound only if enabled
  const play = (soundFn) => {
    if (settings.soundEnabled) soundFn();
  };

  const fetchTask = async (isSkip = false) => {
    setLoading(true);
    setPenaltyText("");
    setTimeLeft(settings.timeLimit);

    let text = await generateChallenge(
      settings.difficulty,
      players,
      currentPlayer.name,
    );

    if (isSkip) {
      setPenaltyText("⚠️ PENALTY: Drink 2 sips! ⚠️");
    }

    setChallenge(text);
    setLoading(false);
  };

  useEffect(() => {
    if (currentPlayer) fetchTask();
  }, [currentPlayerIndex, currentCircle]);

  // --- TIMER & SOUND EFFECT ---
  useEffect(() => {
    if (settings.timeLimit > 0 && timeLeft > 0 && !loading) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);

        // Play tick sound (only if time is running low, e.g., last 10 seconds)
        // OR remove the 'if' to play it every second
        if (timeLeft <= 10) play(playTick);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    // Time is up!
    else if (settings.timeLimit > 0 && timeLeft === 0 && !loading) {
      // We use a flag or check to ensure it doesn't loop infinitely
      // But since this effect runs on timeLeft change, it runs once when hitting 0
      play(playAlarm);
    }
  }, [timeLeft, settings.timeLimit, loading]);

  const handleSkip = () => {
    if (hasSkipped) return;
    play(playPop); // <--- Sound
    markPlayerSkipped(currentPlayer.id);
    fetchTask(true);
  };

  const handleNext = () => {
    play(playPop); // <--- Sound
    nextTurn();
  };

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
            Asking AI...
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

      {/* Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr",
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
          disabled={hasSkipped || loading}
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
          onClick={handleNext} // <--- Updated to use our wrapper
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

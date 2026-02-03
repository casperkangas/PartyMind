import { useEffect } from "react";
import useSound from "use-sound";
import { useGameStore } from "../store";

export default function ResultsScreen() {
  const players = useGameStore((state) => state.players);
  const resetGame = useGameStore((state) => state.resetGame);
  const settings = useGameStore((state) => state.settings);

  // Setup the Win sound
  const [playWin] = useSound("/sounds/win.mp3", { volume: 0.6 });

  // Sort players: Highest score first
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  // Play sound when the screen loads (if sound is enabled)
  useEffect(() => {
    if (settings.soundEnabled) {
      playWin();
    }
  }, [settings.soundEnabled, playWin]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        textAlign: "center",
        paddingTop: "30px",
      }}
    >
      {/* Trophy Section */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ fontSize: "5rem", marginBottom: "10px" }}>🏆</div>
        <h2
          style={{
            color: "var(--primary)",
            fontSize: "1.5rem",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Winner
        </h2>
        <h1
          style={{ fontSize: "3.5rem", color: "var(--text)", margin: "10px 0" }}
        >
          {winner?.name}
        </h1>
        <p style={{ color: "var(--highlight)", fontSize: "1.2rem" }}>
          {winner?.score} points
        </p>
      </div>

      {/* Scoreboard */}
      <div
        style={{
          flex: 1,
          backgroundColor: "var(--bg-light)",
          borderRadius: "15px 15px 0 0",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            borderBottom: "1px solid var(--border)",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          Leaderboard
        </h3>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {sortedPlayers.map((player, index) => (
            <li
              key={player.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                backgroundColor: index === 0 ? "var(--bg)" : "transparent",
                border:
                  index === 0
                    ? "2px solid var(--secondary)"
                    : "1px solid var(--border-muted)",
                borderRadius: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      index === 0 ? "var(--secondary)" : "var(--text-muted)",
                    fontSize: "1.2rem",
                    width: "20px",
                  }}
                >
                  #{index + 1}
                </span>
                <span style={{ fontSize: "1.1rem" }}>{player.name}</span>
              </div>
              <span style={{ fontWeight: "bold", color: "var(--primary)" }}>
                {player.score} pts
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Button */}
      <div style={{ padding: "20px", backgroundColor: "var(--bg-light)" }}>
        <button
          onClick={resetGame}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "var(--primary)",
            color: "var(--btn-text)",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

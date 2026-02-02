import { useState } from "react";
import { useGameStore } from "../store";

export default function HomeScreen() {
  const [name, setName] = useState("");

  // Get data and functions from our store
  const players = useGameStore((state) => state.players);
  const settings = useGameStore((state) => state.settings);
  const addPlayer = useGameStore((state) => state.addPlayer);
  const removePlayer = useGameStore((state) => state.removePlayer);
  const updateSettings = useGameStore((state) => state.updateSettings);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPlayer(name);
    setName("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        height: "100%",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1 style={{ color: "var(--primary)", fontSize: "3rem" }}>PartyMind</h1>
        <p style={{ color: "var(--text-muted)" }}>
          The Ultimate Pass & Play Game
        </p>
      </header>

      {/* Player Input Form */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-light)",
            color: "var(--text)",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0 20px",
            borderRadius: "8px",
            backgroundColor: "var(--primary)",
            color: "var(--btn-text)",
            fontWeight: "bold",
          }}
        >
          Add
        </button>
      </form>

      {/* Player List */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: "150px" }}>
        {players.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              marginTop: "20px",
            }}
          >
            No players yet. Add at least 2!
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {players.map((player) => (
              <li
                key={player.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--bg-light)",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-muted)",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{player.name}</span>
                <button
                  onClick={() => removePlayer(player.id)}
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--danger)",
                    fontSize: "1.5rem",
                    lineHeight: 1,
                  }}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Game Settings Section --- */}
      <div
        style={{
          backgroundColor: "var(--bg-light)",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>
          Game Settings
        </h3>

        {/* Circles Slider */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span>Circles (Loops)</span>
            <span style={{ color: "var(--highlight)" }}>
              {settings.circles}
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.circles}
            onChange={(e) =>
              updateSettings({ circles: Number(e.target.value) })
            }
            style={{ width: "100%", accentColor: "var(--primary)" }}
          />
        </div>

        {/* Difficulty Select */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Mode</label>
          <select
            value={settings.difficulty}
            onChange={(e) => updateSettings({ difficulty: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg)",
              color: "var(--text)",
            }}
          >
            <option value="Fun">Fun (Standard)</option>
            <option value="Wild">Wild (Adults)</option>
            <option value="Kid-Friendly">Kid Friendly</option>
          </select>
        </div>

        {/* Timer Input */}
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Time Limit (Seconds)
          </label>
          <input
            type="number"
            placeholder="0 = No Limit"
            value={settings.timeLimit}
            onChange={(e) =>
              updateSettings({ timeLimit: Number(e.target.value) })
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg)",
              color: "var(--text)",
            }}
          />
          <small style={{ color: "var(--text-muted)" }}>
            Set to 0 for no timer
          </small>
        </div>
      </div>

      {/* Start Button */}
      <div style={{ marginTop: "auto", paddingTop: "20px" }}>
        <button
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor:
              players.length >= 2 ? "var(--secondary)" : "var(--border)",
            color:
              players.length >= 2 ? "var(--btn-text)" : "var(--text-muted)",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "10px",
            cursor: players.length >= 2 ? "pointer" : "not-allowed",
          }}
          disabled={players.length < 2}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

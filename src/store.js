import { create } from "zustand";

export const useGameStore = create((set) => ({
  // --- Navigation & Game State ---
  screen: "home",
  currentCircle: 1,
  currentPlayerIndex: 0,

  // New: Track who skipped in the current circle (Array of player IDs)
  skippedInCircle: [],

  players: [],
  settings: {
    circles: 3,
    timeLimit: 0,
    difficulty: "Fun",
  },

  // --- Actions ---
  addPlayer: (name) =>
    set((state) => ({
      players: [...state.players, { id: Date.now(), name: name, score: 0 }],
    })),

  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  startGame: () =>
    set({
      screen: "game",
      currentCircle: 1,
      currentPlayerIndex: 0,
      skippedInCircle: [], // Reset skips
    }),

  // NEW: Mark the current player as having skipped
  markPlayerSkipped: (playerId) =>
    set((state) => ({
      skippedInCircle: [...state.skippedInCircle, playerId],
    })),

  nextTurn: () =>
    set((state) => {
      // 1. ADD POINT TO CURRENT PLAYER
      const updatedPlayers = state.players.map((p, index) => {
        if (index === state.currentPlayerIndex) {
          return { ...p, score: p.score + 1 };
        }
        return p;
      });

      const totalPlayers = state.players.length;
      const nextIndex = state.currentPlayerIndex + 1;

      // 2. Determine Next State

      // Case A: Next player in circle
      if (nextIndex < totalPlayers) {
        return {
          players: updatedPlayers, // Save score
          currentPlayerIndex: nextIndex,
        };
      }

      // Case B: New Circle
      const nextCircle = state.currentCircle + 1;

      // Case C: Game Over
      if (nextCircle > state.settings.circles) {
        return {
          players: updatedPlayers, // Save final score
          screen: "results",
        };
      }

      // Case D: Start New Circle
      return {
        players: updatedPlayers, // Save score
        currentCircle: nextCircle,
        currentPlayerIndex: 0,
        skippedInCircle: [],
      };
    }),

  returnToHome: () => set({ screen: "home" }),
  resetGame: () => set({ screen: "home", players: [] }),
}));

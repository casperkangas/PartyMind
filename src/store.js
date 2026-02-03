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
      const totalPlayers = state.players.length;
      const nextIndex = state.currentPlayerIndex + 1;

      // 1. Next player in same circle
      if (nextIndex < totalPlayers) {
        return { currentPlayerIndex: nextIndex };
      }

      // 2. New Circle
      const nextCircle = state.currentCircle + 1;

      // 3. Game Over
      if (nextCircle > state.settings.circles) {
        return { screen: "results" };
      }

      // 4. Start New Circle (AND RESET SKIPS)
      return {
        currentCircle: nextCircle,
        currentPlayerIndex: 0,
        skippedInCircle: [], // <--- Clear the skip list for the new circle
      };
    }),

  returnToHome: () => set({ screen: "home" }),
  resetGame: () => set({ screen: "home", players: [] }),
}));

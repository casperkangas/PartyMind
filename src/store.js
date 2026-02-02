import { create } from "zustand";

export const useGameStore = create((set) => ({
  // --- Navigation State ---
  screen: "home", // Options: 'home', 'game', 'results'

  // --- Game Loop State ---
  currentCircle: 1, // Which loop are we on?
  currentPlayerIndex: 0, // Who is playing right now? (Index in players array)

  // --- Existing Data ---
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

  // --- NEW: Game Flow Actions ---
  startGame: () =>
    set({
      screen: "game",
      currentCircle: 1,
      currentPlayerIndex: 0,
    }),

  endGame: () => set({ screen: "results" }),

  resetGame: () => set({ screen: "home", players: [] }), // Option to clear everything

  returnToHome: () => set({ screen: "home" }), // Keep players, just go back
}));

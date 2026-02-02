import { create } from "zustand";

export const useGameStore = create((set) => ({
  // --- Navigation State ---
  screen: "home", // 'home', 'game', 'results'

  // --- Game Loop State ---
  currentCircle: 1,
  currentPlayerIndex: 0,

  // --- Data ---
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
    }),

  // --- THE CRITICAL LOGIC FOR THE DONE BUTTON ---
  nextTurn: () =>
    set((state) => {
      console.log("Next turn triggered!"); // Debug log
      const totalPlayers = state.players.length;
      const nextIndex = state.currentPlayerIndex + 1;

      // 1. Is there another player in this circle?
      if (nextIndex < totalPlayers) {
        console.log("Moving to next player:", nextIndex);
        return { currentPlayerIndex: nextIndex };
      }

      // 2. No players left? Move to next circle.
      const nextCircle = state.currentCircle + 1;

      // 3. Are all circles done?
      if (nextCircle > state.settings.circles) {
        console.log("Game Over!");
        return { screen: "results" };
      }

      // 4. Start new circle
      console.log("Starting Circle:", nextCircle);
      return {
        currentCircle: nextCircle,
        currentPlayerIndex: 0,
      };
    }),

  returnToHome: () => set({ screen: "home" }),
  resetGame: () => set({ screen: "home", players: [] }),
}));

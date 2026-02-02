import { create } from "zustand";

export const useGameStore = create((set) => ({
  players: [],

  // Default Settings
  settings: {
    circles: 3, // How many times we go around the group
    timeLimit: 0, // 0 means "No Timer", otherwise seconds
    difficulty: "Fun", // 'Fun', 'Wild', 'Kid-Friendly'
  },

  // Action to add a player
  addPlayer: (name) =>
    set((state) => ({
      players: [...state.players, { id: Date.now(), name: name, score: 0 }],
    })),

  // Action to remove a player
  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),

  // Action to update settings
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}));

import { create } from "zustand";

export const useGameStore = create((set) => ({
  players: [],

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
}));

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// --- BACKUP TASKS (If AI fails or quota is exceeded) ---
const BACKUP_TASKS = [
  "Do 10 pushups immediately.",
  "Let the group go through your photo gallery for 1 minute.",
  "Speak in a fake accent for the next 2 rounds.",
  "Try to lick your elbow.",
  "Let another player send a text to anyone in your contacts (you choose the recipient).",
  "Hold your breath for 30 seconds.",
  "Dance without music for 20 seconds.",
  "Tell the group your most embarrassing moment.",
  "Let the person to your right mix a drink for you (of any ingredients available).",
  "Imitate a monkey until your next turn.",
];

function getBackupTask() {
  return (
    BACKUP_TASKS[Math.floor(Math.random() * BACKUP_TASKS.length)] +
    " (Backup Task)"
  );
}

export async function generateChallenge(
  difficulty,
  players,
  currentPlayerName,
) {
  try {
    // FIX: Use the stable alias 'gemini-flash-lite-latest' which usually has better free quota
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const otherPlayers = players
      .filter((p) => p.name !== currentPlayerName)
      .map((p) => p.name)
      .join(", ");

    const prompt = `
      You are a party game host. Generate a single, short, fun party game task/dare.
      - Context: A mobile pass-and-play game.
      - Current Player: ${currentPlayerName}
      - Other Players available to be involved: ${otherPlayers}
      - Difficulty/Mode: ${difficulty}
      Rules:
      1. If "Wild", make it edgy/drinking related. If "Kid-Friendly", keep it clean.
      2. Under 30 seconds.
      3. No intro text, just the task.
      4. Occasionally involve one of the "Other Players" by name.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    // FALLBACK: Instead of showing an error, return a local backup task!
    return getBackupTask();
  }
}

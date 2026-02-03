import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// --- BACKUP / DEV TASKS ---
const BACKUP_TASKS = [
  "Do 10 pushups immediately.",
  "Let the group go through your photo gallery for 1 minute.",
  "Speak in a fake accent for the next 2 rounds.",
  "Try to lick your elbow.",
  "Let another player send a text to anyone in your contacts.",
  "Hold your breath for 30 seconds.",
  "Dance without music for 20 seconds.",
  "Tell the group your most embarrassing moment.",
  "Let the person to your right mix a drink for you.",
  "Imitate a monkey until your next turn.",
];

function getBackupTask(isDev = false) {
  const task = BACKUP_TASKS[Math.floor(Math.random() * BACKUP_TASKS.length)];
  return isDev ? `[DEV MODE] ${task}` : `${task} (Backup Task)`;
}

export async function generateChallenge(
  difficulty,
  players,
  currentPlayerName,
) {
  // 1. DEV MODE CHECK: Save tokens when running locally
  if (import.meta.env.DEV) {
    console.log("Dev mode detected: Skipping API call.");
    // Simulate a short delay so it feels real
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getBackupTask(true);
  }

  // 2. REAL API CALL
  try {
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
      - Other Players available: ${otherPlayers}
      - Difficulty/Mode: ${difficulty}
      Rules:
      1. Under 30 seconds.
      2. No intro text, just the task.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return getBackupTask(false);
  }
}

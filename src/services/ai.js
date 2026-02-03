// --- BACKUP TASKS (Offline Mode) ---
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

function getBackupTask() {
  return (
    BACKUP_TASKS[Math.floor(Math.random() * BACKUP_TASKS.length)] + " (Backup)"
  );
}

export async function generateChallenge(
  difficulty,
  players,
  currentPlayerName,
) {
  // 1. DEV MODE: Save tokens when running locally
  if (import.meta.env.DEV) {
    console.log("Dev mode: Skipping API call.");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `[DEV] ${getBackupTask()}`;
  }

  // 2. PROD MODE: Call our Vercel Serverless Function
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty, players, currentPlayerName }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data.challenge;
  } catch (error) {
    console.error("AI Service Error:", error);
    // Fallback to local task if server fails
    return getBackupTask();
  }
}

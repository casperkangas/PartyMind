import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Setup CORS (Allows your frontend to talk to this backend)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Check for the Key (Securely loaded from Vercel Environment)
  const API_KEY = process.env.VITE_GEMINI_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Server missing API Key" });
  }

  // 3. Parse the incoming request (Difficulty, Players, etc.)
  const { difficulty, players, currentPlayerName } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const otherPlayers = players
      .filter(p => p.name !== currentPlayerName)
      .map(p => p.name)
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
    const text = response.text();
    
    // 4. Send the text back to the frontend
    res.status(200).json({ challenge: text });
    
  } catch (error) {
    console.error("Server API Error:", error);
    res.status(500).json({ error: "Failed to generate challenge" });
  }
}
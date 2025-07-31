// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI client with API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// POST endpoint to handle chat messages
app.post("/message", async (req, res) => {
  const userMessage = req.body.message || "";

  try {
    // Get Gemini Pro model instance
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Send user message to Gemini model and get response
    const result = await model.generateContent({
      contents: [{ text: userMessage }]
    });

    // Extract reply text from the first candidate
    const aiReply = result.candidates[0].content;

    // Send AI reply back to frontend
    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.json({ reply: "Sorry, something went wrong with Gemini AI." });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

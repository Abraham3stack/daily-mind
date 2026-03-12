import axios from "axios";

const FACTS_PROMPT =
  "Generate 5 interesting 'Today I learned' facts for a social media platform about science, psychology, technology, or history. Each fact should be one sentence.";

const parseFacts = (rawText) =>
  rawText
    .split("\n")
    .map((line) => line.replace(/^\s*\d+[\).\-\s]*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

const generateFacts = async (req, res, next) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "GEMINI_API_KEY is not configured." });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        contents: [
          {
            parts: [{ text: FACTS_PROMPT }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
    const facts = parseFacts(rawText);

    if (!facts.length) {
      return res.status(502).json({ message: "Gemini did not return usable facts." });
    }

    return res.json({ facts });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.error?.message || "Gemini API request failed."
      });
    }

    return next(error);
  }
};

export {
  generateFacts
};

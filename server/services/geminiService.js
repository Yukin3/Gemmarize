const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeTextWithGemini(text, instructions = "") {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

  const prompt = `
You are an expert summarizer.

Please provide:
1. A short, descriptive title for the content.
2. A concise and clear summary of the document.

Return the response in the following format:
Title: <Your title here>

Summary:
<Your summary here>

${instructions ? `Additional Instructions: ${instructions}` : ""}

--- Document ---
${text}
`;

  const result = await model.generateContent({
    contents: [{ parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  const fullOutput = response.text();

  // 🔍 Extract title and summary using simple pattern
  const [_, title = "Untitled Summary", summary = fullOutput] =
    fullOutput.match(/Title:\s*(.+?)\n+Summary:\s*([\s\S]+)/i) || [];

  return { title: title.trim(), summary: summary.trim() };
}


async function generateTagsFromPaper(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
  console.log(`[🧠] content type: ${typeof content}`, content?.constructor?.name);

  if (typeof content !== "string") {
    // Handle buffers
    if (Buffer.isBuffer(content)) {
      content = content.toString("utf8");
    }
    // Handle accidental object types (from Mongo or PDF extractors)
    else if (typeof content === "object" && content !== null && typeof content.toString === "function") {
      content = content.toString();
    }
  }
  
  // Final safety check
  if (typeof content !== "string") {
    throw new Error("Paper content is not a string.");
  }
  

  const prompt = `
You're an academic assistant helping organize research and study materials. Given the content of a document, generate a list of relevant tags or topics that describe the main themes or subjects.

- Output should be a short, comma-separated list of concise keywords or phrases (no explanations).
- Tags should be lowercase and general (e.g., "world war ii", "trigonometry", "machine learning").

--- Document Content ---
${content.slice(0, 3000)}
`;

  const result = await model.generateContent({
    contents: [{ parts: [{ text: prompt }] }],
  });
  console.log(`🔍 Generating tags from ${content.length} characters...`);


  const response = await result.response;
  const rawTags = response.text();

  const tags = rawTags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);
  return tags;
}

async function generateFlashcardsFromPaper(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

  const prompt = `
You're a helpful tutor generating study flashcards. Create a JSON array of flashcards from the document below.

Each flashcard must follow this format:
[
  {
    "front": "Question or term",
    "back": "Explanation or answer"
  }
]

Only return raw JSON. No extra comments, no markdown, no explanations.

--- Document Content ---
${content.slice(0, 3000)}
`;

  const result = await model.generateContent({
    contents: [{ parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  let text = response.text().trim();

  // Remove markdown code blocks if present (e.g. ```json ... ```)
  if (text.startsWith("```")) {
    text = text.replace(/```(?:json)?/gi, "").replace(/```$/, "").trim();
  }

  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Flashcard response is not an array");
    return parsed;
  } catch (err) {
    console.error("❌ Failed to parse flashcard response:", err);
    throw new Error("Gemini flashcard generation failed");
  }
}



module.exports = { summarizeTextWithGemini, generateTagsFromPaper,  generateFlashcardsFromPaper, };

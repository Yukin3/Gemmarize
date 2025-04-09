const Paper = require("../models/Paper");
const { extractTextFromFile } = require("../utils/extractText");
const { generateTagsFromPaper } = require("../services/geminiService");


async function handleUpload({ file, text, contentType, instructions }) {
  let content = "";

  if (contentType === "document") {
    if (!file) throw new Error("File missing for document upload");

    content = await extractTextFromFile(file);
    if (!content || content.trim().length === 0) {
      throw new Error("Failed to extract content from the uploaded document.");
    }
  } else if (contentType === "text" || contentType === "email") {
    if (!text || text.trim().length === 0) {
      throw new Error("Text content is empty.");
    }

    content = text;
  } else {
    throw new Error("Unsupported content type.");
  }

  //Generate tags w Gemini
  let tags = [];
  try {
    console.log(`[📎] Generating tags for "${file?.originalname || "Text upload"}"...`);
    tags = await generateTagsFromPaper(content);
    console.log(`[✅] Tags generated:`, tags);
  } catch (tagErr) {
    console.warn(`[⚠️] Failed to generate tags:`, tagErr.message);
    // fallback: leave tags as empty array
  }

  // Create Paper entry
  const paper = new Paper({
    title: file?.originalname || "Untitled",
    file_name: file?.originalname || null,
    content,
    instructions: instructions || "",
    tags,
  });
  console.log(tags) //Confirm tags
  await paper.save(); //Save entry
  return paper;
}


module.exports = { handleUpload };

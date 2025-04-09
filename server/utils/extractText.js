const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

async function extractTextFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf") {
    return extractTextFromPDF(file.buffer);
  } else if (ext === ".docx") {
    return extractTextFromDocx(file.buffer);
  } else {
    throw new Error("Unsupported file type. Only PDF and DOCX are supported.");
  }
}

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    throw new Error("Failed to extract text from PDF: " + err.message);
  }
}

async function extractTextFromDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    throw new Error("Failed to extract text from DOCX: " + err.message);
  }
}

module.exports = {
  extractTextFromFile,
};

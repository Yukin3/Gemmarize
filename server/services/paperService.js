const Paper = require("../models/Paper");

// Get all papers
async function getAllPapers() {
  return await Paper.find({}, "-content").sort({ uploaded_at: -1 }); // exclude full content
}

// Get single paper by ID
async function getPaperById(paperId) {
  const paper = await Paper.findById(paperId);
  if (!paper) throw new Error("Paper not found");
  return paper;
}

// Search papers by tag (exact match)  //TODO: make fuzzy
async function searchPapersByTag(query) {
  if (!query) return [];
  return await Paper.find({ tags: query.toLowerCase() }, "-content").sort({ uploaded_at: -1 });
}

module.exports = {
  getAllPapers,
  getPaperById,
  searchPapersByTag,
};

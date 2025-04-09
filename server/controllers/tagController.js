const Paper = require("../models/Paper");
const { generateTagsFromPaper } = require("../services/geminiService");

async function generateTagsController(req, res) {
  try {
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ error: "Paper not found" });

    const tags = await generateTagsFromPaper(paper.content);
    paper.tags = tags;
    await paper.save();

    res.status(200).json({ paperId: paper._id, tags });
  } catch (err) {
    console.error("Error generating tags:", err);
    res.status(500).json({ error: "Failed to generate tags" });
  }
}

module.exports = { generateTagsController };

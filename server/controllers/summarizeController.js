const { summarizePaper, getSummaryByPaperId: fetchSummaryByPaperId } = require("../services/summarizeService");

async function summarizeController(req, res) {
  try {
    const { paperId } = req.params;
    const { instructions = "" } = req.body || {};

    const summary = await summarizePaper(paperId, instructions);

    res.status(200).json({
      _id: summary._id,
      title: summary.title,
      summary: summary.summary_text,
      paperId: summary.paper_id,
      instructions: summary.instructions,
    });
  } catch (err) {
    console.error("Gemini summarization failed:", err.message);
    res.status(500).json({ error: "Failed to summarize document." });
  }
}

async function getSummaryByPaperId(req, res) {
  try {
    const { paperId } = req.params;
    const summary = await fetchSummaryByPaperId(paperId);

    res.status(200).json({
      _id: summary._id,
      paperId: summary.paper_id,
      title: summary.title,
      summary: summary.summary_text,
    });
  } catch (err) {
    console.error("Failed to fetch summary:", err.message);
    res.status(err.message === "Summary not found" ? 404 : 500).json({
      error: err.message || "Internal server error",
    });
  }
}

module.exports = 
{   
  getSummaryByPaperId,
  summarizeController,

 };

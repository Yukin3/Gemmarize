const {
    getAllPapers,
    getPaperById,
    searchPapersByTag,
  } = require("../services/paperService");
  
  async function fetchAllPapers(req, res) {
    try {
      const papers = await getAllPapers();
      res.json(papers);
    } catch (err) {
      console.error("Failed to fetch papers:", err);
      res.status(500).json({ error: "Failed to fetch papers" });
    }
  }
  
  async function fetchPaperById(req, res) {
    try {
      const { paperId } = req.params;
      const paper = await getPaperById(paperId);
      res.json(paper);
    } catch (err) {
      console.error("Failed to fetch paper:", err.message);
      res.status(404).json({ error: err.message || "Paper not found" });
    }
  }
  
  async function searchPapers(req, res) {
    try {
      const { q } = req.query;
      const results = await searchPapersByTag(q);
      res.json(results);
    } catch (err) {
      console.error("Search failed:", err.message);
      res.status(500).json({ error: "Search failed" });
    }
  }
  
  module.exports = {
    fetchAllPapers,
    fetchPaperById,
    searchPapers,
  };
  
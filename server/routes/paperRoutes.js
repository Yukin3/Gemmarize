const express = require("express");
const { generateTagsController } = require("../controllers/tagController");
const {
    fetchAllPapers,
    fetchPaperById,
    searchPapers,
  } = require("../controllers/paperController");

const router = express.Router();

router.get("/papers", fetchAllPapers);               // Get all papers
router.get("/papers/:paperId", fetchPaperById);      // Get a specific paper by ID
router.get("/search/papers", searchPapers);          // Search papers by tag (?q=calculus)

router.post("/generate-tags/papers/:paperId", generateTagsController); //generate paper tags

module.exports = router;

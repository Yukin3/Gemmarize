const express = require("express");
const router = express.Router();

const { 
  generateFlashcardsController, 
  getFlashcardsByPaperIdController,
  getAllFlashcardsController, 
} = require("../controllers/flashcardController");

// Generate flashcards from a paper
router.post("/generate/:paperId", generateFlashcardsController);

// Get all flashcards for a paper
router.get("/paper/:paperId", getFlashcardsByPaperIdController);

// Get all flashcards 
router.get("/", getAllFlashcardsController);

module.exports = router;

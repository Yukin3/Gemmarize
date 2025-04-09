const { createFlashcardsForPaper, getAllFlashcards, getFlashcardsForPaper } = require("../services/flashcardService");


async function getAllFlashcardsController(req, res) {
    try {
      const flashcards = await getAllFlashcards();
      res.json({ flashcards });
    } catch (err) {
      console.error("Failed to get all flashcards:", err);
      res.status(500).json({ error: "Failed to fetch flashcards" });
    }
  }


async function getFlashcardsByPaperIdController(req, res) {
    try {
      const { paperId } = req.params;
      const cards = await getFlashcardsForPaper(paperId);
      res.json({ paperId, flashcards: cards });
    } catch (err) {
      console.error("❌ Failed to fetch flashcards:", err);
      res.status(500).json({ error: "Failed to retrieve flashcards" });
    }
  }

async function generateFlashcardsController(req, res) {
  try {
    const { paperId } = req.params;
    const cards = await createFlashcardsForPaper(paperId);
    res.json({ paperId, flashcards: cards });
  } catch (err) {
    console.error("Failed to generate flashcards:", err);
    res.status(500).json({ error: "Flashcard generation failed" });
  }
}

module.exports = {   getFlashcardsByPaperIdController, generateFlashcardsController, getAllFlashcardsController, };
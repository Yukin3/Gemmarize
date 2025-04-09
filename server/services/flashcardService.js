const Flashcard = require("../models/Flashcard");
const Paper = require("../models/Paper");
const { generateFlashcardsFromPaper } = require("./geminiService");



async function getAllFlashcards() {
    return Flashcard.find().sort({ created_at: -1 });
  }


async function getFlashcardsForPaper(paperId) {
    return Flashcard.find({ paper_id: paperId }).sort({ created_at: -1 });
  }


async function createFlashcardsForPaper(paperId) {
  const paper = await Paper.findById(paperId);
  if (!paper) throw new Error("Paper not found");

  const flashcards = await generateFlashcardsFromPaper(paper.content);

  const savedCards = await Flashcard.insertMany(
    flashcards.map((fc) => ({
      paper_id: paper._id,
      front: fc.front,
      back: fc.back,
    }))
  );

  return savedCards;
}

module.exports = {   getFlashcardsForPaper, createFlashcardsForPaper, getAllFlashcards };
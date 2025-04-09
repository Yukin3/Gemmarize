const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  paper_id: { type: mongoose.Schema.Types.ObjectId, ref: "Paper", required: true },
  front: { type: String, required: true }, // The question or prompt
  back: { type: String, required: true },  // The answer or explanation
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Flashcard", flashcardSchema);

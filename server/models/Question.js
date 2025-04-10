const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema({
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    question_number: Number,
    question: String,
    answer: String,
    rationale: String,
    type: { type: String, enum: ["short", "mcq", "t/f"], default: "short" },
    options: [String], // for MCQ
    correct_option_index: Number, //correct answer idnex of MCQ

    created_at: { type: Date, default: Date.now }
  });
  module.exports = mongoose.model("Question", QuestionSchema);
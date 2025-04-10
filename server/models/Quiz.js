const mongoose = require("mongoose");
const QuizSchema = new mongoose.Schema({
  title: String,
  description: String,
  source_type: { type: String,   enum: ["paper", "text", "email", "document", "video", "custom"], },
  source_id: String,
  tags: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Quiz", QuizSchema);
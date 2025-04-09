const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  title: String,
  file_name: String,
  content: String, // full extracted text
  instructions: String, // <-- ADD THIS
  user_id: String, // optional
  uploaded_at: { type: Date, default: Date.now },
  tags: [String],
});

module.exports = mongoose.model("Paper", paperSchema);

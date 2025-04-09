const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  paper_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper", // Link back to uploaded paper
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Summary",
  },
  instructions: {
    type: String,
    default: "",
  },
  summary_text: {
    type: String,
    required: true,
  },
  highlights: [
    {
      text: String,
      note: String, //explanation for highlighting
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Summary", summarySchema);


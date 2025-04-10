const { createQuizFromContent, getAllQuizzes, getQuizById  } = require("../services/quizService");



async function getQuizzes(req, res) {
    try {
      const { source_type, tag } = req.query;
      const filter = {};
  
      if (source_type) filter.source_type = source_type;
      if (tag) filter.tags = tag;
  
      const quizzes = await getAllQuizzes(filter);
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async function getQuizDetails(req, res) {
    try {
      const { id } = req.params;
      const data = await getQuizById(id);
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

async function generateQuiz(req, res) {
  const { content, instructions = "", source_type, source_id, tags = [] } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Missing content in request body." });
  }

  try {
    const result = await createQuizFromContent(content, instructions, {
      type: source_type,
      id: source_id,
      tags,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
}

module.exports = { generateQuiz, getQuizzes, getQuizDetails };

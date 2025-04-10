const { generateQuizFromPaper } = require("../services/geminiService");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

async function getAllQuizzes(filter = {}) {
    const quizzes = await Quiz.find(filter).sort({ created_at: -1 });
  
    const enriched = await Promise.all(
      quizzes.map(async (quiz) => {
        const count = await Question.countDocuments({ quiz_id: quiz._id });
        return {
          ...quiz.toObject(),
          questionCount: count, //dynamic count
        };
      })
    );
  
    return enriched;
  }
  
  async function getQuizById(quizId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
  
    const questions = await Question.find({ quiz_id: quizId }).sort({ question_number: 1 });
  
    return { quiz, questions };
  }

async function createQuizFromContent(content, instructions = "", source = {}) {
  const quizData = await generateQuizFromPaper(content, instructions);

  const newQuiz = new Quiz({
    title: quizData.title || "Untitled Quiz",
    description: quizData.description || "",
    tags: source.tags || [],
    instructions,
    source_type: source.type || null,
    source_id: source.id || null,
  });

  await newQuiz.save();

  const questionDocs = quizData.questions.map((q) => ({
    ...q,
    quiz_id: newQuiz._id,
  }));

//   console.log("✅ Saving Questions:", questionDocs);
  try {
    await Question.insertMany(questionDocs);
  } catch (err) {
    console.error("Error inserting questions:", err);
  }
  
  return {
    quiz_id: newQuiz,
    questions: questionDocs,
  };
}

module.exports = { createQuizFromContent, getAllQuizzes, getQuizById };

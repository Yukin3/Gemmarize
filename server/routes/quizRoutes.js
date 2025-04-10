const express = require("express");
const router = express.Router();
const { generateQuiz, getQuizzes, getQuizDetails } = require("../controllers/quizController");

router.get("/", getQuizzes); // GET /api/quizzes
router.get("/:id", getQuizDetails); // GET /api/quizzes/:id
router.post("/generate", generateQuiz); // POST /api/quizzes/generate

module.exports = router;

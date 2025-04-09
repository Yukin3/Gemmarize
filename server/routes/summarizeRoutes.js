const express = require("express");
const { summarizeController, getSummaryByPaperId } = require("../controllers/summarizeController");

const router = express.Router();


router.get("/summaries/:paperId", getSummaryByPaperId);
router.post("/summarize/:paperId", summarizeController);

module.exports = router;

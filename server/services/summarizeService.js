const Paper = require("../models/Paper");
const Summary = require("../models/Summary");
const { summarizeTextWithGemini } = require("./geminiService");

async function summarizePaper(paperId, overrideInstructions = "") {
  const paper = await Paper.findById(paperId);
  if (!paper) throw new Error("Paper not found");

  const instructions = overrideInstructions || paper.instructions || "";

  const { title, summary } = await summarizeTextWithGemini(paper.content, instructions);

  const generatedTitle = paper.title?.replace(/\.[^/.]+$/, "") || "Untitled Summary";

  const summaryDoc = new Summary({
    paper_id: paper._id,
    title,
    summary_text: summary,
    instructions,
    highlights: [], 
  });
  

  await summaryDoc.save();
  return summaryDoc;
}

async function getSummaryByPaperId(paperId) {
  const summary = await Summary.findOne({ paper_id: paperId });
  if (!summary) {
    throw new Error("Summary not found");
  }

  return summary;
}

module.exports =
 {
   summarizePaper,
   getSummaryByPaperId

};

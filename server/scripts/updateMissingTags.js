const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Paper = require("../models/Paper");
const { generateTagsFromPaper } = require("../services/geminiService");

dotenv.config();

async function tagMissingPapers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const untaggedPapers = await Paper.find({ $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }] });

    if (untaggedPapers.length === 0) {
      console.log("🎉 All papers already have tags!");
      return;
    }

    console.log(`🔍 Found ${untaggedPapers.length} paper(s) without tags.`);

    for (const paper of untaggedPapers) {
      try {
        const tags = await generateTagsFromPaper(paper);
        paper.tags = tags;
        await paper.save();
        console.log(`✅ Tagged paper "${paper.title}" with: [${tags.join(", ")}]`);
      } catch (err) {
        console.error(`❌ Failed to tag paper "${paper.title}":`, err.message);
      }
    }

    console.log("🏁 Tagging process complete.");
    process.exit(0);
  } catch (err) {
    console.error("🔥 Error during batch tagging:", err);
    process.exit(1);
  }
}

tagMissingPapers();

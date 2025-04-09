require("dotenv").config();
const connectToDB = require("../config/db");
const Paper = require("../models/Paper");

async function run() {
  await connectToDB(); // wait for successful connection

  const paper = new Paper({
    title: "Test Paper",
    file_name: "test.pdf",
    content: "This is some test content.",
  });

  await paper.save();
  console.log("✅ Inserted:", paper);
  process.exit(0); // exit cleanly
}

run().catch((err) => {
  console.error("❌ Error running test:", err);
  process.exit(1);
});

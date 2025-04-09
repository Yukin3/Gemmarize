const { handleUpload } = require("../services/uploadService");


async function uploadController(req, res) {
  try {
    const { contentType, text, instructions } = req.body;
    const file = req.file; // from multer

    const paper = await handleUpload({ file, text, contentType, instructions });

    res.status(201).json({
      message: "Paper uploaded successfully",
      paperId: paper._id,
      title: paper.title,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

module.exports = { uploadController };

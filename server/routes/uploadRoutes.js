const express = require("express");
const multer = require("multer");
const { uploadController } = require("../controllers/uploadController");


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // buffer-based 

router.post("/upload", upload.single("file"), uploadController);


module.exports = router;

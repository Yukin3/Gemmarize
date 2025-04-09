require('dotenv').config();  
const express = require("express");
const app = express();
const cors = require("cors");
const connectToDB = require("./config/db");



//middleware
app.use(cors());
app.use(express.json())
connectToDB();



app.get("/", (req, res) => {
    res.send("Gemmarize backend is up and running, CORS allowed."); 
});


const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);
const summarizeRoutes = require("./routes/summarizeRoutes");
app.use("/api", summarizeRoutes);
const paperRoutes = require("./routes/paperRoutes")
app.use("/api", paperRoutes);
const flashcardRoutes = require("./routes/flashcardRoutes")
app.use("/api/flashcards", flashcardRoutes);






app.use((req, res, next) => {
        console.log("🛰️ CORS origin check:", req.headers.origin);
        console.log("➡️ Path:", req.path);
        next();
});
    


app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
  console.log(`Visit  localhost:${PORT}`);

});


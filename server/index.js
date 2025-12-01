require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// -------------------
// Middleware
// -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------
// Connect MongoDB
// -------------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

// -------------------
// API Routes
// -------------------
// IMPORTANT: API routes MUST be defined BEFORE frontend serving
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));

// -------------------
// Serve frontend (public folder)
// -------------------
const publicPath = path.join(__dirname, "..", "public");

// Serve static assets first
app.use(express.static(publicPath));

// Fallback route for SPA frontend
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// -------------------
// Start Server
// -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

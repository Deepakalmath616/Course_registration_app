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
// MongoDB Connection
// -------------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

// -------------------
// API Routes
// -------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));

// -------------------
// Serve frontend (public inside server)
// -------------------
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Default route: login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "login.html"));
});

// SPA fallback for other non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, "login.html"));
});

// -------------------
// Start Server
// -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

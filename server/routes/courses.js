const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("students", "_id username");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REGISTER course
router.post("/register", async (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId)
    return res.status(400).json({ error: "Missing userId or courseId" });

  try {
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ error: "Course not found" });

    // if already registered
    if (course.students.includes(userId)) {
      return res.status(400).json({ error: "Already registered" });
    }

    course.students.push(userId);
    await course.save();

    res.json({ message: "Registered successfully!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

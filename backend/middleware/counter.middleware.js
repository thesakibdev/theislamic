// middleware/counter.middleware.js
const Counter = require("../models/visit.model");
const express = require("express");
const router = express.Router();

// Middleware function to track visits
const trackCounter = async (req, res, next) => {
  if (!req.path.startsWith("/admin")) {
    try {
      // Atomically increment the counter
      await Counter.findOneAndUpdate(
        { name: "visits" },
        { $inc: { value: 1 } },
        { upsert: true, new: true } // Create if it doesn't exist
      );
    } catch (error) {
      console.error("Counter error:", error);
    }
  }
  next();
};

// Controller function to get total visits
const getTotalVisits = async (req, res) => {
  try {
    const counter = await Counter.findOne({ name: "visits" });
    const result = counter ? counter.value : 0;

    res.status(200).json({ error: false, data: result });
  } catch (error) {
    console.error("Counter error:", error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

// Define route
router.get("/total/counter", getTotalVisits);

// Export both the middleware and router
module.exports = {
  trackCounter,
  counterRouter: router,
};

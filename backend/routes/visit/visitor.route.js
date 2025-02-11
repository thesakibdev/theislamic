// routes/analytics.js
const express = require("express");
const router = express.Router();
const {
  getVisitorCount,
} = require("../../controllers/visitor/visitor.controller");

// Total visits
router.get("/total", getVisitorCount);

module.exports = router;

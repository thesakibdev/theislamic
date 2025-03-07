// models/Visit.js
const mongoose = require("mongoose");

// const visitSchema = new mongoose.Schema({
//   ip: String,
//   userAgent: String,
//   path: String, // Optional: Track specific pages
//   timestamp: { type: Date, default: Date.now },
// });

const visitorSchema = new mongoose.Schema({
  ip: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visit", visitorSchema);

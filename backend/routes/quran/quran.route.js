const express = require("express");
const {
  createVerse,
} = require("../../controllers/quran/quran.controller");

const router = express.Router();

// Verse Routes
router.post("/chapter/surah/verse", createVerse);


module.exports = router;
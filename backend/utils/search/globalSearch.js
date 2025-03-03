const express = require("express");
const router = express.Router();
const Hadith = require("../../models/hadith.model");
const VerseOtherData = require("../../models/verseOther.model");
const Surah = require("../../models/surah.model");

// Search Controller
router.get("/search", async (req, res) => {
  try {
    const { query } = req;
    const hadithConditions = [];
    const verseConditions = [];
    const surahConditions = {};

    // Build search conditions for Hadith
    if (query.note) {
      hadithConditions.push({
        "parts.chapters.hadithList.note": { $regex: query.note, $options: "i" },
      });
    }
    if (query.keywords) {
      hadithConditions.push({
        "parts.chapters.hadithList.keywords": {
          $in: query.keywords.split(","),
        },
      });
    }
    if (query.hadithInternationalNumber) {
      hadithConditions.push({
        "parts.chapters.hadithList.internationalNumber": parseInt(
          query.hadithInternationalNumber
        ),
      });
    }

    // Build search conditions for VerseOtherData
    if (query.totalVerseNumber) {
      verseConditions.push({ verseNumber: parseInt(query.totalVerseNumber) });
    }
    if (query.note) {
      verseConditions.push({ note: { $regex: query.note, $options: "i" } });
    }
    if (query.keywords) {
      verseConditions.push({ keywords: { $in: query.keywords.split(",") } });
    }

    // Build search conditions for Surah
    if (query.surahName) {
      surahConditions.name = { $regex: query.surahName, $options: "i" };
    }
    if (query.juzNumber) {
      surahConditions.juzNumber = { $in: [parseInt(query.juzNumber)] };
    }

    // Execute queries
    const hadithResults =
      hadithConditions.length > 0
        ? await Hadith.find({ $or: hadithConditions })
        : [];
    const verseResults =
      verseConditions.length > 0
        ? await VerseOtherData.find({ $or: verseConditions })
        : [];
    const surahResults =
      Object.keys(surahConditions).length > 0
        ? await Surah.find(surahConditions)
        : [];

    res.json({ hadithResults, verseResults, surahResults });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;


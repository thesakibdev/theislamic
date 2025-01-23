const express = require("express");
const router = express.Router();
const {
  addVerseToSurah,
  getAllSurahs,
  getAllSurahsPaginated,
  deleteVerse,
  editVerse,
} = require("../../controllers/surah/surah.controller");

router.post("/surah/add-verse", addVerseToSurah);

router.put("/surah/:surahNumber/verse/:verseNumber", editVerse);

router.delete("/surah/:surahNumber/verse/:verseNumber", deleteVerse);

router.get("/surah/all", getAllSurahs);

router.get("/surah/paginated", getAllSurahsPaginated);

module.exports = router;

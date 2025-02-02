const express = require("express");
const router = express.Router();
const {
  addVerse,
  addVerseOtherData,
  getAllSurahs,
  getAllSurahsPaginated,
  deleteVerse,
  editVerse,
} = require("../../controllers/surah/surah.controller");

router.post("/surah/add/verse", addVerse);
router.post("/surah/add/verse-other", addVerseOtherData);

router.put("/surah/:surahNumber/verse/:verseNumber", editVerse);

router.delete("/surah/:surahNumber/verse/:verseNumber", deleteVerse);

router.get("/surah/all", getAllSurahs);

router.get("/surah/paginated", getAllSurahsPaginated);

module.exports = router;

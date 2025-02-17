const express = require("express");
const router = express.Router();
const {
  // main verses
  addVerse,
  editArabicAyah,
  deleteArabicAyah,

  // verseOtherData
  addVerseOtherData,
  editVerseOtherData,
  deleteVerseOtherData,

  // get main surahs
  getAllSurahs,
  getSurahsName,
  getAllSurahsPaginated,
} = require("../../controllers/surah/surah.controller");

router.post("/surah/add/verse", addVerse);
router.put(
  "/surahs/:surahNumber/verses/:verseNumber/edit-arabic",
  editArabicAyah
);
router.delete("/surahs/:surahNumber/verses/:verseNumber", deleteArabicAyah);

// verse data
router.post("/surah/add/verse-other", addVerseOtherData);
router.put(
  "/surah/verse-other-data/:surahNumber/:verseNumber/:language",
  editVerseOtherData
);
router.delete(
  "/surah/verse-other-data/:surahNumber/:verseNumber/:language",
  deleteVerseOtherData
);

router.get("/surah/all", getAllSurahs);
router.get("/surah/all-name", getSurahsName);

router.get("/surah/paginated", getAllSurahsPaginated);

module.exports = router;

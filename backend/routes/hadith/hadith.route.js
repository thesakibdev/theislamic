const express = require("express");

const {
  addHadith,
  editHadith,
  deleteHadith,
  addHadithOtherLanguage,
  editHadithOtherLanguage,
  deleteHadithOtherLanguage,
  getAllHadithPaginated,
  getAllHadith,
} = require("../../controllers/hadith/hadith.controller");

const router = express.Router();

// hadith route
router.post("/add", addHadith);
router.put("/edit/:id", editHadith);
router.delete("/delete/:id", deleteHadith);

// hadithOtherLanguage route
router.post("/add/other-language", addHadithOtherLanguage);
router.put("/edit/other-language/:id", editHadithOtherLanguage);
router.delete("/delete/other-language/:id", deleteHadithOtherLanguage);
// hadithOtherLanguage route

// get all hadiths
router.get("/get/all", getAllHadithPaginated);
router.get("/get/all/hadith", getAllHadith);

module.exports = router;

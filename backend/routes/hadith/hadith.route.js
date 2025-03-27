const express = require("express");

const {
  addHadith,
  editHadith,
  deleteHadith,
  getHadithByBook,
  getAllHadiths,
} = require("../../controllers/hadith/hadith.controller");

const router = express.Router();

// hadith route
router.post("/add", addHadith);
router.put("/edit/:id", editHadith);
router.delete("/delete/:id", deleteHadith);

// get all hadiths
router.get("/get/all", getHadithByBook);
router.get("/get/all/hadith", getAllHadiths);

module.exports = router;

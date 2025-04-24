const express = require("express");
const {
  addTafsir,
  getTafsir,
  editTafsir,
  deleteTafsir,
  getAllTafsirByTotalVerseNumber,
} = require("../../controllers/tafsir/tafsir.controller");

const router = express.Router();

router.post("/add", addTafsir);
router.get("/get", getTafsir);
router.put("/edit/:language/:id/:bookName", editTafsir);
router.delete("/delete/:language/:id/:bookName", deleteTafsir);

// client side router
router.get("/get/single",getAllTafsirByTotalVerseNumber)

module.exports = router;

const express = require("express");
const {
  addTafsir,
  getTafsir,
  editTafsir,
  deleteTafsir,
} = require("../../controllers/tafsir/tafsir.controller");

const router = express.Router();

router.post("/add", addTafsir);
router.get("/get", getTafsir);
router.put("/edit/:language/:id", editTafsir);
router.delete("/delete/:language/:id", deleteTafsir);

module.exports = router;

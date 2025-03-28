const express = require("express");
const {
  addTafsir,
  getTafsir,
} = require("../../controllers/tafsir/tafsir.controller");

const router = express.Router();

router.post("/add", addTafsir);
router.get("/get", getTafsir);

module.exports = router;

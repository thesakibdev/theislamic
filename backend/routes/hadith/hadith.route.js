const express = require("express");

const {
  addHadith,
  editHadith,
  deleteHadith,
} = require("../../controllers/hadith/hadith.controller");

const router = express.Router();

router.post("/add", addHadith);

router.put("/edit/:id", editHadith);

router.delete("/delete/:id", deleteHadith);

module.exports = router;

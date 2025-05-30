const express = require("express");
const router = express.Router();
const {
  createTafsir,
  editTafsir,
  deleteTafsir,
  paginateTafsir,
} = require("../../controllers/tafsir/tafsir.controller");

router.post("/tafsir/create", createTafsir);
router.put("/tafsir/edit", editTafsir);
router.delete("/tafsir/delete", deleteTafsir);
router.get("/tafsir/get", paginateTafsir);

module.exports = router;

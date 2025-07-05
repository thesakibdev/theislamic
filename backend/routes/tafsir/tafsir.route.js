const express = require("express");
const router = express.Router();
const {
  createTafsir,
  editTafsir,
  deleteTafsir,
  paginateTafsir,
  getAllTafsir,
} = require("../../controllers/tafsir/tafsir.controller");

router.post("/tafsir/create", createTafsir);
router.put("/tafsir/edit/:parentId/:tafsirId", editTafsir);
router.delete("/tafsir/delete/:parentId/:tafsirId", deleteTafsir);
router.get("/tafsir/get", paginateTafsir);
router.get("/tafsir-list", getAllTafsir);

module.exports = router;

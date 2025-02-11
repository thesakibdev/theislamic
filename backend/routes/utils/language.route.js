const express = require("express");
const router = express.Router();

const Language = require("../../utils/language/language.model");

router.get("/languages", async (req, res) => {
  try {
    const languages = await Language.find({});
    res.status(200).json({message: "success", data: languages});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
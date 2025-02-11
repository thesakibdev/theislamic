const express = require("express");
const router = express.Router();

const BookList = require("../../utils/hadith-bookList/hadith-bookList");

router.get("/book-list", async (req, res) => {
  try {
    const bookList = await BookList.find({});
    res.status(200).json({message: "success", data: bookList});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
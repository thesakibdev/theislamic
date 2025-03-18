const express = require("express");
const router = express.Router();
const Hadith = require("../../models/hadith.model");
const { search } = require("../../utils/search/globalSearch");
const ResponseHandler = require("../../helper/ResponseHandler");

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters ={
        bookName:req.query.bookName,
        partNumber:req.query.partNumber,
        chapterNumber:req.query.chapterNumber,
        hadithNumber:req.query.hadithNumber,
        note:req.query.note,
        keywords:req.query.keywords,
    }

    const searchCriteria = {};

    if (query) {
        searchCriteria.$text = { $search: query };
      }
    
    
        // Execute the search
        const hadithResult = await Hadith.find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
  
      const hadithResultCount = await Hadith.countDocuments(searchCriteria);  

      return ResponseHandler.success(res, success.message, 201, data = {
        hadithResult,
        hadithResultCount,
        currentPage: page,
        totalPage: Math.ceil(hadithResultCount / limit),
      });

  } catch (error) {
    console.log(error);
    return ResponseHandler.error(res, error.message, 500);
  }
});

module.exports = router;

const Surah = require("../../models/surah.model");
const Hadith = require("../../models/hadith.model");
const ResponseHandler = require("../../helper/ResponseHandler");

const search = async (req, res) => {
  const { query } = req.query;
  console.log("Search Query:", query);

  if (!query) return ResponseHandler.error(res, 400, "Query is required");

  try {
    // Text search only on indexed fields
    const surahResults = await Surah.find({ $text: { $search: query } });
    console.log("Surah Results:", surahResults);
    const hadithTextResults = await Hadith.find({ $text: { $search: query } });

    // Regex search on nested fields
    const hadithRegexResults = await Hadith.find({
      $or: [
        { "parts.chapters.hadithList.note": new RegExp(query, "i") },
        { "parts.chapters.hadithList.keywords": new RegExp(query, "i") },
      ],
    });

    // Merging results (avoiding duplicates)
    const hadithResults = [...hadithTextResults, ...hadithRegexResults];

    const results = [...surahResults, ...hadithResults];

    console.log("Total Results Found:", results.length);
    return ResponseHandler.success(res, "Search successful", results);
  } catch (error) {
    console.error("Search Error:", error);
    return ResponseHandler.error(res, 500, "Something went wrong");
  }
};

module.exports = { search };

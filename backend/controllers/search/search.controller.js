const Surah = require("../../models/surah.model");
const Hadith = require("../../models/hadith.model");
const VerseOtherData = require("../../models/verseOther.model");
const ResponseHandler = require("../../helper/ResponseHandler");

const search = async (req, res) => {
  try {
    const { query, language = "en" } = req.query; // Default language set to "Pur"

    // Validate query parameter
    if (!query || query.trim() === "") {
      return ResponseHandler.error(res, 400, "Query is required");
    }

    // 1. Search Hadiths with Language Filter
    const hadithResults = await Hadith.aggregate([
      { $unwind: "$parts" },
      { $unwind: "$parts.chapters" },
      { $unwind: "$parts.chapters.hadithList" },
      {
        $match: {
          language: language, 
          $or: [
            {
              "parts.chapters.hadithList.hadithArabic": {
                $regex: query,
                $options: "i",
              },
            },
            {
              "parts.chapters.hadithList.hadithEnglish": {
                $regex: query,
                $options: "i",
              },
            },
            {
              "parts.chapters.hadithList.translation": {
                $regex: query,
                $options: "i",
              },
            },
            {
              "parts.chapters.hadithList.transliteration": {
                $regex: query,
                $options: "i",
              },
            },
            {
              "parts.chapters.hadithList.note": {
                $regex: query,
                $options: "i",
              },
            },
            {
              "parts.chapters.hadithList.keywords": {
                $regex: query,
                $options: "i",
              },
            },
            {
              "parts.chapters.hadithList.narrator": {
                $regex: query,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          bookName: 1,
          language: 1,
          "parts.partName": 1,
          "parts.partNumber": 1,
          "parts.chapters.chapterName": 1,
          "parts.chapters.chapterNumber": 1,
          "parts.chapters.hadithList": 1,
        },
      },
    ]);

    // 2. Search Surahs (assuming they don't need language filtering)
    const surahResults = await Surah.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    // 3. Search VerseOtherData with Language Filter
    const verseOtherResults = await VerseOtherData.aggregate([
      { $unwind: "$verses" },
      {
        $match: {
          language: language, // Language filter added here
          $or: [
            { "verses.translation": { $regex: query, $options: "i" } },
            { "verses.transliteration": { $regex: query, $options: "i" } },
            { "verses.note": { $regex: query, $options: "i" } },
            { "verses.keywords": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          surahNumber: 1,
          language: 1,
          verseNumber: "$verses.verseNumber",
          translation: "$verses.translation",
          transliteration: "$verses.transliteration",
          note: "$verses.note",
          keywords: "$verses.keywords",
        },
      },
    ]);

    // Combine all results
    const results = [...surahResults, ...hadithResults, ...verseOtherResults];

    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return ResponseHandler.success(res, "Search successful", {
      total: results.length,
      page,
      limit,
      results: paginatedResults,
    });
  } catch (error) {
    console.error("Search Error:", error.message);
    return ResponseHandler.error(res, 500, "Internal Server Error");
  }
};

module.exports = { search };

const Surah = require("../../models/surah.model");
const Hadith = require("../../models/hadith.model");
const ResponseHandler = require("../../helper/ResponseHandler");

/**
 * সার্চ কন্ট্রোলার - সূরা এবং হাদিথ ডাটাবেসে কোয়েরি সার্চ করে
 * @param {Object} req - রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - রেসপন্স অবজেক্ট
 */
const search = async (req, res) => {
  try {
    const { query } = req.query;

    // কোয়েরি ভ্যালিডেশন
    if (!query || query.trim() === "") {
      return ResponseHandler.error(res, 400, "Query is required");
    }

    console.log("Search Query:", query);

    // হাদিথ সার্চ - শুধুমাত্র ম্যাচিং হাদিথগুলি খুঁজে বের করা
    const hadithResults = await Hadith.aggregate([
      // Unwind the nested arrays to access individual hadith
      { $unwind: "$parts" },
      { $unwind: "$parts.chapters" },
      { $unwind: "$parts.chapters.hadithList" },

      // Match documents containing the search query
      {
        $match: {
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

      // Project only the matching hadith and its context
      {
        $project: {
          _id: 1,
          bookName: 1,
          "parts.partName": 1,
          "parts.partNumber": 1,
          "parts.chapters.chapterName": 1,
          "parts.chapters.chapterNumber": 1,
          "parts.chapters.hadithList": 1,
        },
      },
    ]);

    // সূরা সার্চ - ম্যাচিং আয়াতগুলি খুঁজে বের করা
    // Note: You would need a similar aggregation for Surah data
    // This is a placeholder based on your structure
    const surahResults = await Surah.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    // সব রেজাল্ট একত্রিত করা
    const results = [...surahResults, ...hadithResults];

    // পেজিনেশন প্যারামিটার
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // পেজিনেটেড রেজাল্ট
    const paginatedResults = results.slice(startIndex, endIndex);

    console.log("Total Results Found:", results.length);

    return ResponseHandler.success(res, "Search successful", {
      total: results.length,
      page,
      limit,
      results: paginatedResults,
    });
  } catch (error) {
    console.error("Search Error:", error.message);
    return ResponseHandler.error(res, 500, "Something went wrong");
  }
};

module.exports = { search };

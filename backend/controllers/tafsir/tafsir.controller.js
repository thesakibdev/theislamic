const Tafsir = require("../../models/tafsir.model");
const Surah = require("../../models/surah.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");
const ResponseHandler = require("../../helper/ResponseHandler");

const addTafsir = async (req, res) => {
  try {
    const { bookName, language, tafsirData } = req.body;

    // Validate language
    const allowedLanguages = ["bn", "en"];
    if (!allowedLanguages.includes(language)) {
      return ResponseHandler.error(
        res,
        "Only Bengali (bn) and English (en) tafsir are allowed.",
        400
      );
    }

    // Validate required fields
    if (!bookName || !language || !tafsirData?.totalVerseNumber) {
      return ResponseHandler.error(res, "All fields are required.", 400);
    }

    const totalVerseNumber = Number(tafsirData.totalVerseNumber);

    // Verify that the verse exists
    const surah = await Surah.findOne({
      "verses.totalVerseNumber": totalVerseNumber,
    });

    if (!surah) {
      return ResponseHandler.error(
        res,
        `Verse with number ${totalVerseNumber} not found.`,
        400
      );
    }

    // Format tafsir data according to our schema
    const formattedTafsirData = {
      totalVerseNumber,
      mainContent: tafsirData.mainContent || "",
      OtherLanguageContent: tafsirData.OtherLanguageContent || "",
      note: tafsirData.note || "",
    };

    // Check if this tafsir document already exists
    let tafsir = await Tafsir.findOne({ bookName, language });

    if (tafsir) {
      // Check if the specific verse tafsir already exists
      const alreadyExists = tafsir.tafsirData.some(
        (item) => item.totalVerseNumber === totalVerseNumber
      );

      if (alreadyExists) {
        return ResponseHandler.error(
          res,
          `${bookName} (${language}) already contains tafsir for verse ${totalVerseNumber}.`,
          400
        );
      }

      // Add new tafsir data to existing document
      tafsir.tafsirData.push(formattedTafsirData);
      await tafsir.save();
    } else {
      // Create new tafsir document
      tafsir = new Tafsir({
        bookName,
        language,
        tafsirData: [formattedTafsirData],
      });

      await tafsir.save();
    }

    // Clear cache
    invalidateCache();

    return ResponseHandler.success(
      res,
      `Tafsir for ${bookName} (${language}) verse ${totalVerseNumber} added successfully.`,
      201
    );
  } catch (error) {
    console.error("Error adding tafsir:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return ResponseHandler.error(
        res,
        "This tafsir entry already exists.",
        409
      );
    }

    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Edit an existing tafsir entry

const editTafsir = async (req, res) => {
  try {
    const { language, id } = req.params;
    const { mainContent, OtherLanguageContent, note } = req.body;

    // Validate that at least one field is provided for update
    if (!mainContent && !OtherLanguageContent && note === undefined) {
      return ResponseHandler.error(
        res,
        "At least one field to update must be provided.",
        400
      );
    }

    // Build update object dynamically
    const updateFields = {};
    if (mainContent !== undefined)
      updateFields["tafsirData.$.mainContent"] = mainContent;
    if (OtherLanguageContent !== undefined)
      updateFields["tafsirData.$.OtherLanguageContent"] = OtherLanguageContent;
    if (note !== undefined) updateFields["tafsirData.$.note"] = note;

    const updated = await Tafsir.findOneAndUpdate(
      { language, "tafsirData._id": id },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return ResponseHandler.error(res, "Tafsir entry not found.", 404);
    }

    invalidateCache();

    return ResponseHandler.success(res, "Tafsir updated successfully.", 200);
  } catch (error) {
    console.error("Error editing tafsir:", error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Delete a tafsir entry
const deleteTafsir = async (req, res) => {
  try {
    const { language, id } = req.params;

    if (!language || !id) {
      return ResponseHandler.error(res, "Language and ID are required.", 400);
    }

    const tafsir = await Tafsir.findOne({ language });

    if (!tafsir) {
      return ResponseHandler.error(res, "Tafsir collection not found.", 404);
    }

    // Check if the tafsir entry exists before attempting to delete
    const tafsirEntry = tafsir.tafsirData.id(id);
    if (!tafsirEntry) {
      return ResponseHandler.error(res, "Tafsir entry not found.", 404);
    }

    const updated = await Tafsir.findOneAndUpdate(
      { language },
      { $pull: { tafsirData: { _id: id } } },
      { new: true }
    );

    invalidateCache();

    // Check if tafsirData is empty, if so, delete the entire document
    if (updated && updated.tafsirData.length === 0) {
      await Tafsir.deleteOne({ _id: updated._id });
      return ResponseHandler.success(
        res,
        "Tafsir entry deleted and empty document removed.",
        200
      );
    }

    return ResponseHandler.success(
      res,
      "Tafsir entry deleted successfully.",
      200
    );
  } catch (error) {
    console.error("Error deleting tafsir:", error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Get tafsir for a specific verse
const getTafsir = async (req, res) => {
  try {
    const {
      language,
      totalVerseNumber,
      bookName,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert to appropriate types
    const verseNumber = totalVerseNumber ? parseInt(totalVerseNumber) : null;
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    // Validate parameters
    if (!verseNumber) {
      return res.status(400).json({
        success: false,
        message: "Verse number is required",
      });
    }

    // Generate a unique cache key based on query parameters
    const cacheKey = `tafsir_${language || "all"}_${
      bookName || "all"
    }_${verseNumber}_${currentPage}_${itemsPerPage}`;

    // Try to get data from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Build query
    const query = {};
    if (language) query.language = language;
    if (bookName) query.bookName = bookName;

    // Use aggregation to get tafsir data for the specific verse
    const tafsirResults = await Tafsir.aggregate([
      { $match: query },
      { $unwind: "$tafsirData" },
      { $match: { "tafsirData.totalVerseNumber": verseNumber } },
      { $skip: (currentPage - 1) * itemsPerPage },
      { $limit: itemsPerPage },
      {
        $project: {
          _id: 1,
          bookName: 1,
          language: 1,
          tafsirData: 1,
        },
      },
    ]);

    // If no tafsir found
    if (tafsirResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tafsir not found for the specified verse",
      });
    }

    // Get the verse information from Surah
    const surah = await Surah.findOne(
      { "verses.totalVerseNumber": verseNumber },
      {
        surahName: 1,
        surahNumber: 1,
        "verses.$": 1,
      }
    );

    if (!surah || !surah.verses || surah.verses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Verse information not found",
      });
    }

    const verse = surah.verses[0];

    // Count total documents for pagination
    const totalDocs = await Tafsir.aggregate([
      { $match: query },
      { $unwind: "$tafsirData" },
      { $match: { "tafsirData.totalVerseNumber": verseNumber } },
      { $count: "total" },
    ]);

    const total = totalDocs.length > 0 ? totalDocs[0].total : 0;

    // Format the response data according to the required structure
    const formattedData = tafsirResults.map((tafsir) => ({
      bookName: tafsir.bookName,
      language: tafsir.language,
      surahName: surah.surahName,
      surahNumber: surah.surahNumber,
      verseNumber: verse.verseNumber,
      totalVerseNumber: verseNumber,
      mainContent: tafsir.tafsirData.mainContent,
      OtherLanguageContent: tafsir.tafsirData.OtherLanguageContent,
      note: tafsir.tafsirData.note || "",
      tafsirId: tafsir._id,
    }));

    // Prepare response with pagination info
    const responseData = {
      success: true,
      currentPage,
      totalPages: Math.ceil(total / itemsPerPage),
      totalItems: total,
      data: formattedData,
    };

    // Store in cache (1 hour expiration - adjust as needed)
    setCache(cacheKey, JSON.stringify(responseData), 3600);

    // Return response
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching tafsir:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { addTafsir, getTafsir, editTafsir, deleteTafsir };

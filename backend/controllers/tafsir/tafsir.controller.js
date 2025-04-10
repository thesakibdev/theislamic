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

const editTafsir = async (req, res) => {
  try {
    const { language, id, bookName } = req.params;
    const { mainContent, OtherLanguageContent, note } = req.body;

    // Validate that all required params are provided
    if (!language || !id || !bookName) {
      return ResponseHandler.error(
        res,
        "Language, ID, and Book Name are required.",
        400
      );
    }

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

    // Find and update the document using language, bookName, and the specific tafsir entry id
    const updated = await Tafsir.findOneAndUpdate(
      {
        language,
        bookName,
        "tafsirData._id": id,
      },
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
    const { language, id, bookName } = req.params;

    // Validate that all required params are provided
    if (!language || !id || !bookName) {
      return ResponseHandler.error(
        res,
        "Language, ID, and Book Name are required.",
        400
      );
    }

    // First find the document to check if the entry exists
    const tafsir = await Tafsir.findOne({ language, bookName });

    if (!tafsir) {
      return ResponseHandler.error(res, "Tafsir collection not found.", 404);
    }

    // Check if the tafsir entry exists before attempting to delete
    const tafsirEntry = tafsir.tafsirData.id(id);
    if (!tafsirEntry) {
      return ResponseHandler.error(res, "Tafsir entry not found.", 404);
    }

    // Remove the specific tafsir entry from the tafsirData array
    const updated = await Tafsir.findOneAndUpdate(
      { language, bookName },
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
    const { language, bookName, page = 1, limit = 10 } = req.query;

    // Convert to appropriate types
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    // Validate parameters
    if (!bookName) {
      return res.status(400).json({
        success: false,
        message: "Book name is required",
      });
    }

    // Generate a unique cache key based on query parameters
    const cacheKey = `tafsir_${
      language || "all"
    }_${bookName}_${currentPage}_${itemsPerPage}`;

    // Try to get data from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Build query
    const query = { bookName: bookName };
    if (language) query.language = language;

    // First get the tafsir document that matches our criteria
    const tafsirDoc = await Tafsir.findOne(query);

    if (!tafsirDoc) {
      return res.status(404).json({
        success: false,
        message: "Tafsir book not found",
      });
    }

    // Sort tafsir data by totalVerseNumber to ensure they're in order
    const sortedTafsirData = tafsirDoc.tafsirData.sort(
      (a, b) => a.totalVerseNumber - b.totalVerseNumber
    );

    // Apply pagination to the tafsir data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTafsirData = sortedTafsirData.slice(startIndex, endIndex);

    // If no tafsir data after pagination
    if (paginatedTafsirData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tafsir data found for this page",
      });
    }

    // Get all the verse numbers needed for this page
    const verseNumbers = paginatedTafsirData.map(
      (item) => item.totalVerseNumber
    );

    // Get all the surah information for these verses in one query
    const surahs = await Surah.find({
      "verses.totalVerseNumber": { $in: verseNumbers },
    });

    console.log(
      "Surahs names:",
      surahs.map((s) => s.name)
    );

    // Create a map of totalVerseNumber to verse and surah information
    const verseMap = {};

    surahs.forEach((surah) => {
      // Get the surah name directly from the top level property
      const surahName = surah.name;

      surah.verses.forEach((verse) => {
        if (verseNumbers.includes(verse.totalVerseNumber)) {
          verseMap[verse.totalVerseNumber] = {
            surahName: surahName,
            surahNumber: surah.surahNumber,
            verseNumber: verse.verseNumber,
            arabicAyah: verse.arabicAyah,
          };
        }
      });
    });

    // Format the response data
    const formattedData = paginatedTafsirData.map((tafsirItem) => {
      const verseInfo = verseMap[tafsirItem.totalVerseNumber] || {};

      return {
        bookName: tafsirDoc.bookName,
        language: tafsirDoc.language,
        surahName: verseInfo.surahName || "Unknown",
        surahNumber: verseInfo.surahNumber || 0,
        verseNumber: verseInfo.verseNumber || 0,
        totalVerseNumber: tafsirItem.totalVerseNumber,
        arabicAyah: verseInfo.arabicAyah || "",
        mainContent: tafsirItem.mainContent,
        OtherLanguageContent: tafsirItem.OtherLanguageContent,
        note: tafsirItem.note || "",
        tafsirId: tafsirDoc._id,
      };
    });

    // Prepare response with pagination info
    const responseData = {
      success: true,
      currentPage,
      totalPages: Math.ceil(sortedTafsirData.length / itemsPerPage),
      totalItems: sortedTafsirData.length,
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

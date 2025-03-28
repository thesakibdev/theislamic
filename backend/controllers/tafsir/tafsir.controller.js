const Tafsir = require("../../models/tafsir.model");
const Surah = require("../../models/surah.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");
const ResponseHandler = require("../../helper/ResponseHandler");

const addTafsir = async (req, res) => {
  try {
    const { bookName, language, tafsirData } = req.body;

    if (!bookName || !language) {
      return ResponseHandler.error(res, "All fields are required.", 400);
    }

    const tafsir = await Tafsir.findOne({
      bookName,
      language,
    });

    // Find Surah where any verse has the given totalVerseNumber
    const surah = await Surah.findOne({
      "verses.totalVerseNumber": parseInt(tafsirData.totalVerseNumber, 10),
    });

    if (!surah) {
      return ResponseHandler.error(
        res,
        `${tafsirData.totalVerseNumber} no. Verse's surah not found.`,
        400
      );
    }

    const formattedSurahData = {
      _id: surah._id,
      surahNumber: surah.surahNumber,
    };

    console.log("formattedSurahData", formattedSurahData);

    if (tafsir) {
      const existingTafsirData = tafsir.tafsirData.find(
        (data) => data.totalVerseNumber === tafsirData.totalVerseNumber
      );

      if (existingTafsirData) {
        return ResponseHandler.error(
          res,
          `${bookName}'s ( ${language} ) language's ${tafsirData.totalVerseNumber} no. Verse's tafsir already exists.`,
          400
        );
      }

      const formattedTafsirData = {
        surahInfo: formattedSurahData,
        ...tafsirData,
      };

      // Update the tafsir document
      tafsir.tafsirData.push(formattedTafsirData);
      await tafsir.save();

      invalidateCache();

      return ResponseHandler.success(
        res,
        `${bookName}'s ${language}language's ${tafsirData.totalVerseNumber} Verse's tafsir updated successfully.`,
        200
      );
    } else {
      const formattedTafsirData = {
        surahInfo: formattedSurahData,
        ...tafsirData,
      };
      // Create a new tafsir document
      const newTafsir = new Tafsir({
        bookName,
        language,
        tafsirData: [formattedTafsirData],
      });
      await newTafsir.save();

      invalidateCache();

      return ResponseHandler.success(
        res,
        "New tafsir document created successfully.",
        200
      );
    }
  } catch (error) {
    console.log(error);
    ResponseHandler.error(res, "Server error.", 500);
  }
};

const getTafsir = async (req, res) => {
  const { bookName, language = "en" } = req.query;

  try {
    // Check if bookName is provided
    if (!bookName) {
      const allBooks = await Tafsir.distinct("bookName");
      return ResponseHandler.success(res, "Please provide a book name", 200, {
        availableBooks: allBooks || [],
      });
    }

    // Create cache key
    const cacheKey = `tafsirs_book_${bookName}_language_${language}`;

    // Try cache first
    let cachedTafsirs = null;
    try {
      cachedTafsirs = await getCache(cacheKey);
      if (cachedTafsirs)
        return ResponseHandler.success(res, cachedTafsirs, 200);
    } catch (cacheError) {
      console.log("Cache error:", cacheError.message);
    }

    // Fetch book with language
    const selectedBook = await Tafsir.findOne({
      bookName: { $regex: new RegExp(`^${bookName}$`, "i") }, // Case-insensitive match
      language: { $regex: new RegExp(`^${language}$`, "i") }, // Case-insensitive match
    });

    if (!selectedBook) {
      return ResponseHandler.error(
        res,
        `Book with name "${bookName}" in "${language}" not found.`,
        404
      );
    }

    // Find Surah where any verse has the given totalVerseNumber
    const surah = await Surah.findById(selectedBook.tafsirData[0].surahInfo._id);
  } catch (error) {
    console.log(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

module.exports = { addTafsir, getTafsir };

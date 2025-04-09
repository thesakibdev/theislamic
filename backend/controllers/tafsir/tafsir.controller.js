const Tafsir = require("../../models/tafsir.model");
const Surah = require("../../models/surah.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");
const ResponseHandler = require("../../helper/ResponseHandler");

const addTafsir = async (req, res) => {
  try {
    const { bookName, language, tafsirData } = req.body;

    const allowedLanguages = ["bn", "en"];
    if (!allowedLanguages.includes(language)) {
      return ResponseHandler.error(
        res,
        "Only Bengali (bn) and English (en) tafsir are allowed.",
        400
      );
    }

    if (
      !bookName ||
      !language ||
      !tafsirData?.surahNumber ||
      !tafsirData?.totalVerseNumber
    ) {
      return ResponseHandler.error(res, "All fields are required.", 400);
    }

    const globalVerseNumber = Number(tafsirData.totalVerseNumber);
    const surahNumber = Number(tafsirData.surahNumber);

    const tafsir = await Tafsir.findOne({ bookName, language });

    const surah = await Surah.findOne({
      "verses.totalVerseNumber": globalVerseNumber,
    });

    if (!surah) {
      return ResponseHandler.error(
        res,
        `${globalVerseNumber} no. Verse's Surah not found.`,
        400
      );
    }

    const formattedTafsirData = {
      ...tafsirData,
    };

    if (tafsir) {
      const alreadyExists = tafsir.tafsirData.some(
        (item) =>
          item.surahNumber === surahNumber &&
          item.totalVerseNumber === globalVerseNumber
      );

      if (alreadyExists) {
        return ResponseHandler.error(
          res,
          `${bookName} (${language}) already contains tafsir for Surah ${surahNumber}, Verse ${globalVerseNumber}.`,
          400
        );
      }

      tafsir.tafsirData.push(formattedTafsirData);
      await tafsir.save();

      invalidateCache();

      return ResponseHandler.success(
        res,
        `${bookName} (${language}) tafsir added for Surah ${surahNumber}, Verse ${globalVerseNumber}.`,
        200
      );
    } else {
      const newTafsir = new Tafsir({
        bookName,
        language,
        tafsirData: [formattedTafsirData],
      });

      await newTafsir.save();

      invalidateCache();

      return ResponseHandler.success(
        res,
        `New tafsir document created for ${bookName} (${language}).`,
        200
      );
    }
  } catch (error) {
    console.log(error);
    return ResponseHandler.error(res, "Server error.", 500);
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
    const surah = await Surah.findById(
      selectedBook.tafsirData[0].surahInfo._id
    );
  } catch (error) {
    console.log(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

module.exports = { addTafsir, getTafsir };

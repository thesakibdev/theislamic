const Surah = require("../../models/surah.model");
const verseOtherData = require("../../models/verseOther.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");

// Add a verse to a surah

// new
const addVerse = async (req, res) => {
  const { surahNumber, name, juzNumber, verse } = req.body;

  try {
    // data normalization
    const normalizedName = name.trim();
    const normalizedSurahNumber = parseInt(surahNumber, 10);
    const normalizedJuzNumber = juzNumber.map(Number);

    // data validation
    if (!normalizedSurahNumber || isNaN(normalizedSurahNumber)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid surahNumber." });
    }
    if (!normalizedName) {
      return res.status(400).json({ error: true, message: "Invalid name." });
    }
    if (
      !normalizedJuzNumber ||
      !Array.isArray(normalizedJuzNumber) ||
      normalizedJuzNumber.length === 0
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid juzNumber." });
    }

    // check if surah already exists
    const surah = await Surah.findOne({
      surahNumber: normalizedSurahNumber,
      name: normalizedName,
      juzNumber: { $all: normalizedJuzNumber },
    });

    if (surah) {
      // check if verse already exists
      const existingVerse = surah.verses.find(
        (v) => v.verseNumber === verse.verseNumber
      );
      if (existingVerse) {
        return res.status(400).json({
          error: true,
          message: `আয়াত ${verse.verseNumber} ইতিমধ্যে সূরা ${normalizedSurahNumber}-এ আছে।`,
        });
      }

      // add verse
      surah.verses.push(verse);
      await surah.save();

      // invalidate cache
      invalidateCache();

      return res
        .status(200)
        .json({ message: "আয়াত সফলভাবে যোগ হয়েছে।", surah });
    } else {
      // create new surah
      const newSurah = new Surah({
        surahNumber: normalizedSurahNumber,
        name: normalizedName,
        juzNumber: normalizedJuzNumber,
        verses: [verse],
      });

      await newSurah.save();

      // invalidate cache
      invalidateCache();

      return res
        .status(201)
        .json({ message: "নতুন সূরা ও আয়াত যোগ হয়েছে।", surah: newSurah });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: true, message: "সার্ভার এরর।" });
  }
};

const editArabicAyah = async (req, res) => {
  const { surahNumber, verseNumber } = req.params;
  const { verse, juzNumber } = req.body;

  try {
    const normalizedSurahNumber = Number(surahNumber);
    const normalizedVerseNumber = Number(verseNumber);
    const normalizedTotalVerseNumber = verse?.totalVerseNumber;

    if (!normalizedSurahNumber || isNaN(normalizedSurahNumber)) {
      return res.status(400).json({ error: true, message: "অবৈধ সূরা নম্বর।" });
    }
    if (!normalizedVerseNumber || isNaN(normalizedVerseNumber)) {
      return res.status(400).json({ error: true, message: "অবৈধ আয়াত নম্বর।" });
    }

    const updatedSurah = await Surah.findOneAndUpdate(
      {
        surahNumber: normalizedSurahNumber,
        "verses.verseNumber": normalizedVerseNumber,
      },
      {
        $set: {
          "verses.$.arabicAyah": verse?.arabicAyah || null,
          "verses.$.totalVerseNumber": normalizedTotalVerseNumber, // Add this line
          ...(juzNumber && { juzNumber }), // Optional update for juzNumber
        },
      },
      {
        new: true,
      }
    );

    if (!updatedSurah) {
      return res.status(404).json({
        error: true,
        message: "সূরা বা আয়াত খুঁজে পাওয়া যায়নি।",
      });
    }

    // invalidate cache
    invalidateCache();

    res.status(200).json({
      success: true,
      message: "সফলভাবে আপডেট করা হয়েছে।",
      updatedSurah,
    });
  } catch (error) {
    console.error("আপডেটে সমস্যা:", error);
    res.status(500).json({
      error: true,
      message: "সার্ভারে সমস্যা হয়েছে।",
    });
  }
};

const deleteArabicAyah = async (req, res) => {
  const { surahNumber, verseNumber } = req.params;

  try {
    // Validate inputs
    const normalizedSurahNumber = Number(surahNumber);
    const normalizedVerseNumber = Number(verseNumber);

    if (!normalizedSurahNumber || isNaN(normalizedSurahNumber)) {
      return res.status(400).json({
        error: true,
        message: "অবৈধ সূরা নম্বর।",
      });
    }

    if (!normalizedVerseNumber || isNaN(normalizedVerseNumber)) {
      return res.status(400).json({
        error: true,
        message: "অবৈধ আয়াত নম্বর।",
      });
    }

    // Find the Surah and remove the specific verse
    const updatedSurah = await Surah.findOneAndUpdate(
      { surahNumber: normalizedSurahNumber },
      {
        $pull: {
          verses: { verseNumber: normalizedVerseNumber },
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedSurah) {
      return res.status(404).json({
        error: true,
        message: "সূরা খুঁজে পাওয়া যায়নি।",
      });
    }

    // invalidate cache
    invalidateCache();

    res.status(200).json({
      success: true,
      message: "আয়াত সফলভাবে ডিলিট করা হয়েছে।",
      updatedSurah,
    });
  } catch (error) {
    console.error("ডিলিটে সমস্যা:", error);
    res.status(500).json({
      error: true,
      message: "সার্ভারে সমস্যা হয়েছে।",
    });
  }
};

// verse other data controller
const addVerseOtherData = async (req, res) => {
  const {
    surahNumber,
    verseNumber,
    language,
    translation,
    transliteration,
    note,
    keywords,
  } = req.body;

  try {
    // Normalize input data
    const normalSurahNumber = Number(surahNumber);
    const normalVerseNumber = Number(verseNumber);
    const normalLanguage = language?.trim().toLowerCase();
    const normalTranslation = translation?.trim();
    const normalTransliteration = transliteration?.trim();
    const normalNote = note ? note.trim() : "";
    const normalKeywords = Array.isArray(keywords)
      ? keywords.map((k) => k.trim())
      : [];

    // Validate inputs
    if (!normalSurahNumber || isNaN(normalSurahNumber)) {
      return res.status(400).json({
        error: true,
        message: "Invalid surahNumber.",
      });
    }
    if (!normalVerseNumber || isNaN(normalVerseNumber)) {
      return res.status(400).json({
        error: true,
        message: "Invalid verseNumber.",
      });
    }
    if (!normalLanguage) {
      return res.status(400).json({
        error: true,
        message: "Please provide a valid language.",
      });
    }

    // Check if the document for the surah and language exists
    let verseData = await verseOtherData.findOne({
      surahNumber: normalSurahNumber,
      language: normalLanguage,
    });

    if (!verseData) {
      // Create a new document if it doesn't exist
      verseData = new verseOtherData({
        surahNumber: normalSurahNumber,
        language: normalLanguage,
        verses: [],
      });
    }

    // Check if the verse already exists in the document
    const existingVerse = verseData.verses.find(
      (v) => v.verseNumber === normalVerseNumber
    );

    if (existingVerse) {
      return res.status(400).json({
        error: true,
        message: `Verse ${normalVerseNumber} already exists in ${normalLanguage} language.`,
      });
    }

    // Add the new verse to the verses array
    verseData.verses.push({
      verseNumber: normalVerseNumber,
      translation: normalTranslation,
      transliteration: normalTransliteration,
      note: normalNote,
      keywords: normalKeywords,
    });

    // Save the updated document
    await verseData.save();

    // Invalidate cache
    invalidateCache();

    return res.status(201).json({
      message: "New verse data has been added successfully.",
      verseOtherData: verseData,
    });
  } catch (error) {
    console.error("Error adding verse data:", error);
    res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
};

const editVerseOtherData = async (req, res) => {
  const { surahNumber, verseNumber, language } = req.params;
  const { translation, transliteration, note, keywords } = req.body;

  try {
    // Normalize input data
    const normalSurahNumber = Number(surahNumber);
    const normalVerseNumber = Number(verseNumber);
    const normalLanguage = language?.trim().toLowerCase();

    const normalTranslation = translation?.trim();
    const normalTransliteration = transliteration?.trim();
    const normalNote = note ? note.trim() : "";
    const normalKeywords = Array.isArray(keywords)
      ? keywords.map((k) => k.trim())
      : [];

    // Validate input data
    if (!normalSurahNumber || isNaN(normalSurahNumber)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid surahNumber." });
    }
    if (!normalVerseNumber || isNaN(normalVerseNumber)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid verseNumber." });
    }
    if (!normalLanguage) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid language." });
    }

    // Update the specific verse inside the verses array
    const updatedVerse = await verseOtherData.findOneAndUpdate(
      {
        surahNumber: normalSurahNumber,
        language: normalLanguage,
        "verses.verseNumber": normalVerseNumber,
      },
      {
        $set: {
          "verses.$.translation": normalTranslation,
          "verses.$.transliteration": normalTransliteration,
          "verses.$.note": normalNote,
          "verses.$.keywords": normalKeywords,
        },
      },
      { new: true } // Return updated document
    );

    if (!updatedVerse) {
      return res.status(404).json({
        error: true,
        message: `আয়াত ${normalVerseNumber} ${normalLanguage} ভাষায় পাওয়া যায়নি।`,
      });
    }

    // Invalidate cache if applicable
    invalidateCache();

    return res.status(200).json({
      message: `আয়াত ${normalVerseNumber} এর ${normalLanguage} ভাষায় সংরক্ষণ করা হয়েছে।`,
      verseOtherData: updatedVerse,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "সার্ভার এরর।" });
  }
};

const deleteVerseOtherData = async (req, res) => {
  const { surahNumber, verseNumber, language } = req.params;

  try {
    const normalSurahNumber = Number(surahNumber);
    const normalVerseNumber = Number(verseNumber);
    const normalLanguage = language?.trim().toLowerCase();

    if (!normalSurahNumber || isNaN(normalSurahNumber)) {
      return res.status(400).json({ error: true, message: "অবৈধ সূরা নম্বর।" });
    }
    if (!normalVerseNumber || isNaN(normalVerseNumber)) {
      return res
        .status(400)
        .json({ error: true, message: "অবৈধ আয়াত নম্বর।" });
    }
    if (!normalLanguage) {
      return res.status(400).json({ error: true, message: "অবৈধ ভাষা।" });
    }

    // Find the document and update it by pulling the matching verse
    const updatedDocument = await verseOtherData.findOneAndUpdate(
      {
        surahNumber: normalSurahNumber,
        language: normalLanguage,
      },
      {
        $pull: {
          verses: { verseNumber: normalVerseNumber },
        },
      },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        error: true,
        message: `সূরা ${normalSurahNumber} এর ${normalLanguage} ভাষার তথ্য খুঁজে পাওয়া যায়নি।`,
      });
    }

    // Check if any verse was actually removed
    // Compare the updated document with the original to ensure deletion happened
    const originalDoc = await verseOtherData.findOne({
      surahNumber: normalSurahNumber,
      language: normalLanguage,
    });

    if (
      originalDoc &&
      originalDoc.verses.some((v) => v.verseNumber === normalVerseNumber)
    ) {
      return res.status(404).json({
        error: true,
        message: `আয়াত ${normalVerseNumber} (${normalLanguage}) খুঁজে পাওয়া যায়নি।`,
      });
    }

    // If we get here, the verse was successfully removed
    // Invalidate cache if you're using caching
    if (typeof invalidateCache === "function") {
      invalidateCache();
    }

    return res.status(200).json({
      success: true,
      message: `আয়াত ${normalVerseNumber} (${normalLanguage}) ডিলিট করা হয়েছে।`,
      updatedData: updatedDocument,
    });
  } catch (error) {
    console.error("ডিলিট করতে সমস্যা:", error);
    res.status(500).json({
      error: true,
      message: "সার্ভারে সমস্যা হয়েছে।",
    });
  }
};

// get full surah list with verses
const getAllSurahs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
    const pageNumber = parseInt(page, 10 || 1);
    const pageLimit = parseInt(limit, 10 || 1);

    const cacheKey = `allSurahs-page-${pageNumber}-limit-${pageLimit}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json({ surahs: cachedData });
    }

    const totalSurahs = await Surah.countDocuments();

    const surahs = await Surah.find()
      .select(
        "name surahNumber juzNumber verses.verseNumber verses.arabicAyah verses.totalVerseNumber"
      )
      .sort({ surahNumber: 1 })
      .skip((pageNumber - 1) * pageLimit) // Skip documents for pagination
      .limit(pageLimit) // Limit the number of documents fetched
      .lean();

    const formattedSurahs = surahs.map((surah, index) => ({
      _id: surah._id,
      serializedNumber: (pageNumber - 1) * pageLimit + index + 1, // Maintain serialization across pages
      surahName: surah.name,
      surahNumber: surah.surahNumber,
      juzNumber: surah.juzNumber,
      verses: surah.verses.map((verse) => ({
        _id: verse._id,
        verseNumber: verse.verseNumber,
        arabicAyah: verse.arabicAyah,
        totalVerseNumber: verse.totalVerseNumber,
      })),
    }));

    setCache(cacheKey, formattedSurahs);

    return res.status(200).json({
      surahs: formattedSurahs,
      totalSurahs,
      totalPages: Math.ceil(totalSurahs / pageLimit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return res.status(500).json({ error: true, message: "Server error." });
  }
};

// get surahs name
const getSurahsName = async (req, res) => {
  try {
    const cacheKey = "surahNames";
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const surahs = await Surah.aggregate([{ $sort: { surahNumber: 1 } }]);

    const formattedSurahs = surahs.map((surah) => ({
      _id: surah._id,
      surahName: surah.name,
      surahNumber: surah.surahNumber,
      juzNumber: surah.juzNumber,
      totalAyah: surah.verses.length,
    }));

    setCache(cacheKey, formattedSurahs);

    return res.status(200).json(formattedSurahs);
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return res.status(500).json({ error: true, message: "Server error." });
  }
};

const getAllSurahsPaginated = async (req, res) => {
  const { surahNumber, language = "en" } = req.query;

  try {
    if (!surahNumber) {
      return res.status(400).json({ error: "Surah number is required." });
    }

    const cacheKey = `surah_${surahNumber}_lang_${language}`;
    const cachedSurah = getCache(cacheKey);

    if (cachedSurah) {
      return res.status(200).json(cachedSurah);
    }

    // Fetch Surah without using $unwind
    const surah = await Surah.findOne(
      { surahNumber: parseInt(surahNumber, 10) },
      "surahNumber name juzNumber verses.verseNumber verses.arabicAyah verses.totalVerseNumber"
    ).lean();

    if (!surah) {
      return res.status(404).json({ error: "Surah not found." });
    }

    // Fetch translations only for the requested language
    const verseOtherDataByLanguage = await verseOtherData
      .findOne(
        { language, surahNumber: parseInt(surahNumber, 10) },
        "verses.verseNumber verses.translation verses.transliteration verses.note verses.keywords"
      )
      .lean();

    // Map verses and attach translations, sorted by verseNumber
    const formattedSurah = {
      _id: surah._id,
      surahName: surah.name,
      surahNumber: surah.surahNumber,
      juzNumber: surah.juzNumber,
      verses: surah.verses
        .map((verse) => {
          const translationData = verseOtherDataByLanguage?.verses?.find(
            (v) => v.verseNumber === verse.verseNumber
          );

          return {
            _id: verse._id,
            verseNumber: verse.verseNumber,
            arabicAyah: verse.arabicAyah,
            totalVerseNumber: verse.totalVerseNumber,
            verseOtherData: translationData
              ? {
                  language,
                  translation: translationData.translation,
                  transliteration: translationData.transliteration,
                  note: translationData.note,
                  keywords: translationData.keywords || [],
                }
              : null,
          };
        })
        .sort((a, b) => a.verseNumber - b.verseNumber), // Sorting verses by verseNumber
    };

    // Cache the response
    setCache(cacheKey, formattedSurah, 600);
    res.status(200).json(formattedSurah);
  } catch (err) {
    console.error("Error in getSurahsByNumberAndLanguage:", err);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  // main verses
  addVerse,
  editArabicAyah,
  deleteArabicAyah,

  // verseOtherData
  addVerseOtherData,
  editVerseOtherData,
  deleteVerseOtherData,

  // get main surahs
  getAllSurahs,
  getSurahsName,
  getAllSurahsPaginated,
};

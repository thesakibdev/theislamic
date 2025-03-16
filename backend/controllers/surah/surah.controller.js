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
    const normalSurahNumber = Number(surahNumber);
    const normalVerseNumber = Number(verseNumber);

    const normalLanguage = language?.trim().toLowerCase();
    const normalTranslation = translation?.trim();
    const normalTransliteration = transliteration?.trim();

    const normalNote = note ? note.trim() : "";
    const normalKeywords = Array.isArray(keywords)
      ? keywords.map((k) => k.trim())
      : [];

    if (!normalSurahNumber || isNaN(normalSurahNumber)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid normalSurahNumber." });
    }
    if (!normalVerseNumber || isNaN(normalVerseNumber)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid verseNumber." });
    }
    if (!normalLanguage) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide a language." });
    }

    const existingVerse = await verseOtherData.findOne({
      surahNumber: normalSurahNumber,
      verseNumber: normalVerseNumber,
      language: normalLanguage,
    });

    if (existingVerse) {
      return res.status(400).json({
        error: true,
        message: `আয়াত ${normalVerseNumber} ইতিমধ্যে ${normalLanguage} ভাষায় আছে।`,
      });
    }

    const newVerse = new verseOtherData({
      surahNumber: normalSurahNumber,
      verseNumber: normalVerseNumber,
      language: normalLanguage,
      translation: normalTranslation,
      transliteration: normalTransliteration,
      note: normalNote,
      keywords: normalKeywords,
    });

    await newVerse.save();

    // invalidate cache
    invalidateCache();

    return res.status(201).json({
      message: "নতুন ভাষায় আয়াত সংরক্ষণ করা হয়েছে।",
      verseOtherData: newVerse,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "সার্ভার এরর।" });
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

    // Find the existing verse data
    const existingVerse = await verseOtherData.findOne({
      surahNumber: normalSurahNumber,
      verseNumber: normalVerseNumber,
      language: normalLanguage,
    });

    if (!existingVerse) {
      return res.status(404).json({
        error: true,
        message: `আয়াত ${normalVerseNumber} ${normalLanguage} ভাষায় পাওয়া যায়নি।`,
      });
    }

    // Update the fields if provided
    if (normalTranslation) {
      existingVerse.translation = normalTranslation;
    }
    if (normalTransliteration) {
      existingVerse.transliteration = normalTransliteration;
    }
    if (normalNote !== undefined) {
      existingVerse.note = normalNote;
    }
    if (normalKeywords.length > 0) {
      existingVerse.keywords = normalKeywords;
    }

    // Save the updated verse data
    await existingVerse.save();

    // invalidate cache
    invalidateCache();

    return res.status(200).json({
      message: `আয়াত ${normalVerseNumber} এর ${normalLanguage} ভাষায় সংরক্ষণ করা হয়েছে।`,
      verseOtherData: existingVerse,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "সার্ভার এরর।" });
  }
};

const deleteVerseOtherData = async (req, res) => {
  const { surahNumber, verseNumber, language } = req.params;

  try {
    // Normalize and validate input
    const normalSurahNumber = Number(surahNumber);
    const normalVerseNumber = Number(verseNumber);
    const normalLanguage = language?.trim().toLowerCase();

    // Validate inputs
    if (!normalSurahNumber || isNaN(normalSurahNumber)) {
      return res.status(400).json({
        error: true,
        message: "অবৈধ সূরা নম্বর।",
      });
    }
    if (!normalVerseNumber || isNaN(normalVerseNumber)) {
      return res.status(400).json({
        error: true,
        message: "অবৈধ আয়াত নম্বর।",
      });
    }
    if (!normalLanguage) {
      return res.status(400).json({
        error: true,
        message: "অবৈধ ভাষা।",
      });
    }

    // Find and delete the verse
    const deletedVerse = await verseOtherData.findOneAndDelete({
      surahNumber: normalSurahNumber,
      verseNumber: normalVerseNumber,
      language: normalLanguage,
    });

    if (!deletedVerse) {
      return res.status(404).json({
        error: true,
        message: `আয়াত ${normalVerseNumber} (${normalLanguage}) খুঁজে পাওয়া যায়নি।`,
      });
    }

    // invalidate cache
    invalidateCache();

    return res.status(200).json({
      success: true,
      message: `আয়াত ${normalVerseNumber} এর (${normalLanguage}) ডিলিট করা হয়েছে।`,
      deletedData: deletedVerse,
    });
  } catch (error) {
    console.error("ডিলিট করতে সমস্যা:", error);
    res.status(500).json({
      error: true,
      message: "সার্ভারে সমস্যা হয়েছে।",
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

const getVerseOtherData = async (req, res) => {
  try {
    const { surahNumber: surahNumberParam, language } = req.query;

    // Validate required parameters
    if (!surahNumberParam || !language) {
      return res.status(400).json({
        error: "Both surahNumber and language parameters are required",
      });
    }

    const surahNumber = parseInt(surahNumberParam, 10);

    // Validate number conversion
    if (isNaN(surahNumber)) {
      return res.status(400).json({
        error: "Invalid surahNumber format. Must be a number",
      });
    }

    const result = await verseOtherData.aggregate([
      {
        $match: {
          surahNumber: surahNumber,
          language: language.toString(),
        },
      },
      {
        $sort: { verseNumber: 1 },
      },
      {
        $group: {
          _id: "$surahNumber",
          verses: {
            $push: {
              verseNumber: "$verseNumber",
              translation: "$translation",
              transliteration: "$transliteration",
              note: "$note",
              keyword: { $ifNull: [{ $arrayElemAt: ["$keywords", 0] }, ""] },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          surahName: "", // Add surah name if available
          surahNumber: "$_id",
          language: language.toString(),
          verses: 1,
        },
      },
    ]);

    return res.status(200).json(result.length > 0 ? result[0] : {});
  } catch (error) {
    console.error("Error fetching formatted data:", error);
    return res.status(500).json({ error: "Internal server error" });
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
  const { page = 1, limit = 1 } = req.query;

  try {
    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 1;

    const cacheKey = `surahsPage_${currentPage}_limit_${pageLimit}`;
    const cachedSurahs = getCache(cacheKey);

    if (cachedSurahs) {
      return res.status(200).json(cachedSurahs);
    }

    // First, fetch only the Surahs (without unwinding verses)
    const surahs = await Surah.aggregate([
      { $sort: { surahNumber: 1 } },
      { $skip: (currentPage - 1) * pageLimit },
      { $limit: pageLimit },
    ]);

    // Then, for each Surah, fetch its sorted verses separately
    for (let surah of surahs) {
      const verses = await Surah.aggregate([
        { $match: { _id: surah._id } },
        { $unwind: "$verses" },
        { $sort: { "verses.verseNumber": 1 } },
        {
          $group: {
            _id: "$_id",
            verses: { $push: "$verses" },
          },
        },
      ]);

      surah.verses = verses.length > 0 ? verses[0].verses : [];
    }

    const VerseOtherData = await verseOtherData.find().lean();

    const formattedSurahs = surahs.map((surah) => ({
      _id: surah._id,
      surahName: surah.name,
      surahNumber: surah.surahNumber,
      juzNumber: surah.juzNumber,
      verses: surah.verses.map((verse) => ({
        _id: verse._id,
        verseNumber: verse.verseNumber,
        arabicAyah: verse.arabicAyah,
        totalVerseNumber: verse.totalVerseNumber,
        verseOtherData: VerseOtherData.filter(
          (data) =>
            data.surahNumber === surah.surahNumber &&
            data.verseNumber === verse.verseNumber
        ).map(({ surahNumber, verseNumber, ...rest }) => rest),
      })),
    }));

    const count = await Surah.countDocuments();

    const paginatedData = {
      surahs: formattedSurahs,
      totalSurahs: count,
      totalPages: Math.ceil(count / pageLimit),
      currentPage,
    };

    setCache(cacheKey, paginatedData, 600);
    res.status(200).json(paginatedData);
  } catch (err) {
    console.error(err);
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
  getVerseOtherData,

  // get main surahs
  getAllSurahs,
  getSurahsName,
  getAllSurahsPaginated,
};

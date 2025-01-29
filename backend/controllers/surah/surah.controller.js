const Surah = require("../../models/surah.model");

// Add a verse to a surah
const addVerseToSurah = async (req, res) => {
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
      return res
        .status(201)
        .json({ message: "নতুন সূরা ও আয়াত যোগ হয়েছে।", surah: newSurah });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: true, message: "সার্ভার এরর।" });
  }
};

const editVerse = async (req, res) => {
  try {
    const { surahNumber: surahNumberParam, verseNumber: verseNumberParam } =
      req.params;
    const { verse } = req.body;

    // নর্মালাইজেশন: স্ট্রিং → নাম্বার
    const normalizedSurahNumber = parseInt(surahNumberParam, 10);
    const normalizedVerseNumber = parseInt(verseNumberParam, 10);

    if (!verse) {
      return res.status(400).json({ message: "আয়াত ডেটা প্রয়োজন।" });
    }

    // ভার্সের ডাটা নর্মালাইজেশন
    const {
      arabicText,
      translations,
      transliteration,
      keywords,
      globalVerseNumber,
    } = verse;

    const normalizedGlobalJuzNumber = parseInt(globalVerseNumber, 10); // স্ট্রিং → নাম্বার

    // ভ্যালিডেশন: কমপক্ষে একটি ফিল্ড প্রোভাইড করা হয়েছে কিনা
    const isValidUpdate =
      (arabicText && typeof arabicText === "string") ||
      (translations && Array.isArray(translations)) ||
      (transliteration && Array.isArray(transliteration)) ||
      (keywords && Array.isArray(keywords)) ||
      !isNaN(normalizedGlobalJuzNumber); // নর্মালাইজড ভ্যালু দিয়ে চেক

    if (!isValidUpdate) {
      return res.status(400).json({
        message: "আপডেটের জন্য কমপক্ষে একটি বৈধ ফিল্ড প্রয়োজন।",
      });
    }

    // সূরা খুঁজুন (নর্মালাইজড surahNumber দিয়ে)
    const surah = await Surah.findOne({ surahNumber: normalizedSurahNumber });
    if (!surah) {
      return res.status(404).json({ message: "সূরা পাওয়া যায়নি।" });
    }

    // আয়াত খুঁজুন (নর্মালাইজড verseNumber দিয়ে)
    const verseToUpdate = surah.verses.find(
      (v) => v.verseNumber === normalizedVerseNumber
    );
    if (!verseToUpdate) {
      return res.status(404).json({ message: "আয়াত পাওয়া যায়নি।" });
    }

    // আপডেট করুন (নর্মালাইজড ডাটা দিয়ে)
    if (arabicText) verseToUpdate.arabicText = arabicText;
    if (translations) verseToUpdate.translations = translations;
    if (transliteration) verseToUpdate.transliteration = transliteration;
    if (keywords) verseToUpdate.keywords = keywords;
    if (!isNaN(normalizedGlobalJuzNumber)) {
      verseToUpdate.globalVerseNumber = normalizedGlobalJuzNumber;
    }

    await surah.save();

    res.status(200).json({
      message: "আয়াত সফলভাবে আপডেট হয়েছে।",
      surah,
    });
  } catch (error) {
    console.error("আয়াত আপডেটে সমস্যা:", error);
    res.status(500).json({ message: "সার্ভার সমস্যা।" });
  }
};

const getAllSurahs = async (req, res) => {
  try {
    const surahs = await Surah.find(); // Get all Surahs

    if (!surahs.length) {
      return res.status(404).json({ error: "No Surahs found." });
    }

    res.status(200).json({ surahs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

const getAllSurahsPaginated = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Defaults to page 1, 10 results per page

  try {
    const surahs = await Surah.find()
      .limit(limit * 1) // Convert limit to number
      .skip((page - 1) * limit)
      .exec();

    const count = await Surah.countDocuments();

    res.status(200).json({
      surahs,
      totalSurahs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

const deleteVerse = async (req, res) => {
  const { surahNumber, verseNumber } = req.params;

  try {
    // Find the Surah by its number
    const surah = await Surah.findOne({ surahNumber });

    if (!surah) {
      return res.status(404).json({ error: `Surah ${surahNumber} not found.` });
    }

    // Filter out the specific verse from the Surah's verses array
    const initialVerseCount = surah.verses.length;
    surah.verses = surah.verses.filter(
      (v) => v.verseNumber !== parseInt(verseNumber)
    );

    if (surah.verses.length === initialVerseCount) {
      return res.status(404).json({
        error: `Verse ${verseNumber} not found in Surah ${surahNumber}.`,
      });
    }

    // Save the updated Surah
    await surah.save();

    res.status(200).json({
      message: `Verse ${verseNumber} deleted successfully from Surah ${surahNumber}.`,
      surah,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  addVerseToSurah,
  editVerse,
  getAllSurahs,
  deleteVerse,
  getAllSurahsPaginated,
};

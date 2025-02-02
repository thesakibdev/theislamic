const Surah = require("../../models/surah.model");
const verseOtherData = require("../../models/verseOther.model");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

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

const editArabicAyah = async (req, res) => {
  const { surahNumber, verseNumber } = req.params;
  const { arabicAyah } = req.body;

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

    if (!arabicAyah || typeof arabicAyah !== "string") {
      return res.status(400).json({
        error: true,
        message: "আরবি আয়াত প্রদান করুন।",
      });
    }

    // Find the Surah and update the specific verse's arabicAyah
    const updatedSurah = await Surah.findOneAndUpdate(
      {
        surahNumber: normalizedSurahNumber,
        "verses.verseNumber": normalizedVerseNumber,
      },
      {
        $set: {
          "verses.$.arabicAyah": arabicAyah.trim(),
        },
      },
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedSurah) {
      return res.status(404).json({
        error: true,
        message: "সূরা বা আয়াত খুঁজে পাওয়া যায়নি।",
      });
    }

    res.status(200).json({
      success: true,
      message: "আরবি আয়াত সফলভাবে আপডেট করা হয়েছে।",
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
    if (!normalLanguage || !normalTranslation || !normalTransliteration) {
      return res.status(400).json({ error: true, message: "Invalid data." });
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

    return res.status(200).json({
      message: "আয়াত আপডেট করা হয়েছে।",
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

    return res.status(200).json({
      success: true,
      message: "আয়াত ডিলিট করা হয়েছে।",
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
    const surahs = await Surah.find().lean(); // Fetch Surahs with verses
    const VerseOtherData = await verseOtherData.find().lean(); // Fetch additional verse data

    // Map Surahs to include verseOtherData without redundant fields
    const formattedSurahs = surahs.map((surah) => {
      return {
        _id: surah._id,
        surahName: surah.name,
        surahNumber: surah.surahNumber,
        juzNumber: surah.juzNumber,
        verses: surah.verses.map((verse) => {
          return {
            _id: verse._id,
            verseNumber: verse.verseNumber,
            arabicAyah: verse.arabicAyah,
            verseOtherData: VerseOtherData.filter(
              (data) =>
                data.surahNumber === surah.surahNumber &&
                data.verseNumber === verse.verseNumber
            ).map(({ surahNumber, verseNumber, ...rest }) => rest), // Remove redundant fields
          };
        }),
      };
    });

    return res.status(200).json({ surahs: formattedSurahs });
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return res.status(500).json({ error: true, message: "Server error." });
  }
};

const getAllSurahsPaginated = async (req, res) => {
  const { page = 1, limit = 1 } = req.query;

  try {
    const cacheKey = `surahsPage_${page}_limit_${limit}`;
    const cachedSurahs = cache.get(cacheKey);

    if (cachedSurahs) {
      console.log("Serving from cache");
      return res.status(200).json(cachedSurahs);
    }

    // Using aggregation pipeline to sort verses
    const surahs = await Surah.aggregate([
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit * 1,
      },
      {
        // Unwind verses array to sort them
        $unwind: "$verses",
      },
      {
        // Sort verses by verseNumber
        $sort: {
          surahNumber: 1,
          "verses.verseNumber": 1,
        },
      },
      {
        // Group back the verses for each surah
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          surahNumber: { $first: "$surahNumber" },
          juzNumber: { $first: "$juzNumber" },
          verses: { $push: "$verses" },
        },
      },
    ]);

    const VerseOtherData = await verseOtherData.find().lean();

    const formattedSurahs = surahs.map((surah) => {
      return {
        _id: surah._id,
        surahName: surah.name,
        surahNumber: surah.surahNumber,
        juzNumber: surah.juzNumber,
        verses: surah.verses.map((verse) => {
          return {
            _id: verse._id,
            verseNumber: verse.verseNumber,
            arabicAyah: verse.arabicAyah,
            verseOtherData: VerseOtherData.filter(
              (data) =>
                data.surahNumber === surah.surahNumber &&
                data.verseNumber === verse.verseNumber
            ).map(({ surahNumber, verseNumber, ...rest }) => rest),
          };
        }),
      };
    });

    const count = await Surah.countDocuments();

    const paginatedData = {
      surahs: formattedSurahs,
      totalSurahs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };

    cache.set(cacheKey, paginatedData);
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

  // get main surahs
  getAllSurahs,
  getAllSurahsPaginated,
};

const Quran = require("../../models/quran.model");

const createVerse = async (req, res) => {
  try {
    const {
      chapterNumber,
      surahNumber,
      surahName,
      verseNumber,
      arabicText,
      translations,
      transliteration,
    } = req.body;

    // Construct the query paths dynamically
    const chapterPath = `chapters.${chapterNumber - 1}`;
    const surahPath = `${chapterPath}.surahs.${surahNumber - 1}`;
    const versePath = `${surahPath}.verses`;

    // Check for existing verse with the same verseNumber in the surah
    const existingVerse = await Quran.findOne({
      [surahPath + ".verses.verseNumber"]: verseNumber,
    });

    if (existingVerse) {
      return res.status(400).json({
        success: false,
        message: `A verse with verseNumber ${verseNumber} already exists in this surah.`,
      });
    }

    // Update or create the verse atomically
    const result = await Quran.findOneAndUpdate(
      { bookName: "The Quran" }, // Match the Quran document
      {
        $set: {
          // Ensure the chapter exists
          [`${chapterPath}.chapterNumber`]: chapterNumber,
          // Ensure the surah exists
          [`${surahPath}.surahNumber`]: surahNumber,
          [`${surahPath}.surahName`]: surahName,
        },
        $push: {
          // Add the verse to the surah's verse array
          [versePath]: {
            verseNumber,
            arabicText,
            translations,
            transliteration,
          },
        },
      },
      {
        upsert: true, // Create the document if it doesn't exist
        new: true, // Return the updated document
      }
    );

    return res.status(200).json({
      success: true,
      message: "Verse added successfully.",
      book: result,
    });
  } catch (error) {
    console.error("Error in createVerse:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the verse.",
      error: error.message,
    });
  }
};

module.exports = { createVerse };

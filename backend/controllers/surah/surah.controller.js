const Surah = require("../../models/surah.model");

const addVerseToSurah = async (req, res) => {
  const { surahNumber, name, juzNumber, verse } = req.body;

  try {
    // Validate input
    if (!surahNumber) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required field: surahNumber." });
    }
    if (!name) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required field: name." });
    }
    if (!juzNumber || !Array.isArray(juzNumber) || juzNumber.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Missing or invalid field: juzNumber." });
    }
    if (!verse) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required field: verse." });
    }
    if (!verse.verseNumber) {
      return res.status(400).json({
        error: true,
        message: "Missing required field: verseNumber in verse object.",
      });
    }
    if (!verse.arabicText) {
      return res
        .status(400)
        .json({
          error: true,
          message: "Missing required field: arabicText in verse object.",
        });
    }

    // Check if the Surah exists with matching surahNumber, name, and juzNumber
    let surah = await Surah.findOne({
      surahNumber,
      name,
      juzNumber: { $all: juzNumber }, // Ensure all provided Juz numbers are matched
    });

    if (surah) {
      // If Surah exists, check if the verse already exists
      const existingVerse = surah.verses.find(
        (v) => Number(v.verseNumber) === Number(verse.verseNumber)
      );
      if (existingVerse) {
        return res.status(400).json({
          message: `Verse ${verse.verseNumber} already exists in Surah ${surahNumber}.`,
          error: true,
        });
      }

      // Add the new verse to the Surah
      surah.verses.push(verse);
      await surah.save();

      return res
        .status(200)
        .json({ message: "Verse added successfully to Surah.", surah });
    }

    // If no matching Surah is found, create a new Surah with the first verse
    const newSurah = new Surah({
      surahNumber,
      name,
      juzNumber,
      verses: [verse], // Add the first verse
    });

    await newSurah.save();

    return res.status(201).json({
      message: "Surah created and verse added successfully.",
      surah: newSurah,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

const editVerse = async (req, res) => {
  try {
    const { surahNumber, verseNumber } = req.params;
    const { verse } = req.body;

    if (!verse) {
      return res.status(400).json({ message: "Verse data is required" });
    }

    const { arabicText, translations, transliteration, keywords } = verse;

    // Validate the required fields
    if (
      !(
        (arabicText && typeof arabicText === "string") ||
        (translations && Array.isArray(translations)) ||
        (transliteration && Array.isArray(transliteration)) ||
        (keywords && Array.isArray(keywords))
      )
    ) {
      return res.status(400).json({
        message: "At least one valid field must be provided for update",
      });
    }

    // Find the Surah by surahNumber
    const surah = await Surah.findOne({ surahNumber });
    if (!surah) {
      return res.status(404).json({ message: "Surah not found" });
    }

    // Find the specific verse by verseNumber
    const verseToUpdate = surah.verses.find(
      (v) => v.verseNumber === parseInt(verseNumber)
    );
    if (!verseToUpdate) {
      return res.status(404).json({ message: "Verse not found" });
    }

    // Update the fields only if provided in the request body
    if (arabicText) verseToUpdate.arabicText = arabicText;
    if (translations && Array.isArray(translations))
      verseToUpdate.translations = translations;
    if (transliteration && Array.isArray(transliteration))
      verseToUpdate.transliteration = transliteration;
    if (keywords && Array.isArray(keywords)) verseToUpdate.keywords = keywords;

    // Save the updated Surah document
    await surah.save();

    res.status(200).json({
      message: "Verse updated successfully",
      surah,
    });
  } catch (error) {
    console.error("Error updating verse:", error);
    res.status(500).json({ message: "Server error" });
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

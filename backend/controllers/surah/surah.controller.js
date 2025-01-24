const Surah = require("../../models/surah.model");

const addVerseToSurah = async (req, res) => {
  const { surahNumber, name, juzNumber, verse } = req.body;


  try {
    // Validate input
    if (!surahNumber || !verse || !verse.verseNumber || !verse.arabicText) {
      return res.status(400).json({
        error:
          "Missing required fields: surahNumber, verseNumber, or arabicText.",
      });
    }

    // Check if the Surah already exists
    let surah = await Surah.findOne({ surahNumber });

    if (surah) {
      // If Surah exists, check if the verse already exists
      const existingVerse = surah.verses.find(
        (v) => v.verseNumber === verse.verseNumber
      );
      if (existingVerse) {
        return res.status(400).json({
          error: `Verse ${verse.verseNumber} already exists in Surah ${surahNumber}.`,
        });
      }

      // Add the new verse to the Surah
      surah.verses.push(verse);
      await surah.save();

      return res
        .status(200)
        .json({ message: "Verse added successfully to Surah.", surah });
    }

    // If Surah doesn't exist, create a new Surah with the first verse
    const newSurah = new Surah({
      surahNumber,
      name: name || `Surah ${surahNumber}`, // Default name if not provided
      juzNumber: juzNumber, // Default to Juz 1 if not provided
      verses: [verse], // Add the first verse
    });

    await newSurah.save();

    return res.status(201).json({
      message: "Surah created and verse added successfully.",
      surah: newSurah,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

const editVerse = async (req, res) => {
  const { surahNumber, verseNumber } = req.params;
  const updates = req.body; // Contains fields to update\\

  try {
    // Find the specific Surah
    const surah = await Surah.findOne({ surahNumber });

    if (!surah) {
      return res.status(404).json({ error: "Surah not found." });
    }

    // Find the specific Verse in the Surah
    const verse = surah.verses.find(
      (v) => v.verseNumber === parseInt(verseNumber)
    );

    if (!verse) {
      return res.status(404).json({ error: "Verse not found in the Surah." });
    }

    // Update fields dynamically in the specific verse
    for (const key in updates) {
      if (
        key === "translations" ||
        key === "transliteration" ||
        key === "keywords"
      ) {
        // Handle arrays and nested objects
        if (Array.isArray(updates[key])) {
          verse[key] = updates[key]; // Replace with the new array
        } else {
          return res.status(400).json({ error: `${key} must be an array.` });
        }
      } else {
        verse[key] = updates[key]; // Directly update simple fields
      }
    }

    // Save the updated Surah
    await surah.save();

    res.status(200).json({
      message: "Verse updated successfully.",
      updatedVerse: verse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating the verse." });
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

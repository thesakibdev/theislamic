const Tafsir = require("../../models/tafsir.model");
const Surah = require("../../models/surah.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");
const ResponseHandler = require("../../helper/ResponseHandler");

// Create new Tafsir
const createTafsir = async (req, res) => {
  try {
    const { language, bookName, totalVerseNumber, content, note } = req.body;

    const normalBookName = bookName.trim();
    const normalContent = content.trim();

    // check language
    if (!["bn", "en"].includes(language)) {
      return ResponseHandler.error(
        res,
        "Only 'bn' and 'en' languages are allowed.",
        400
      );
    }

    const surahInfo = await Surah.findOne({
      "verses.totalVerseNumber": totalVerseNumber,
    });
    if (!surahInfo) {
      return ResponseHandler.error(res, "Surah not found", 404);
    }

    const existingTafsir = await Tafsir.findOne({ language, totalVerseNumber });
    if (existingTafsir) {
      return ResponseHandler.error(
        res,
        "Tafsir already exists for this verse in this language.",
        400
      );
    }

    const verse = surahInfo.verses.find(
      (v) => v.totalVerseNumber === totalVerseNumber
    );

    const newTafsir = new Tafsir({
      language,
      bookName: normalBookName,
      surahName: surahInfo.name,
      totalVerseNumber,
      arabicAyah: verse.arabicAyah,
      content: normalContent,
      note,
    });

    await newTafsir.save();
    invalidateCache();

    return ResponseHandler.success(
      res,
      "New Tafsir Added Successfully!",
      newTafsir,
      201
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Update Tafsir
const editTafsir = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookName, content, note } = req.body;

    const updated = await Tafsir.findByIdAndUpdate(
      id,
      {
        $set: {
          bookName: bookName?.trim(),
          content: content?.trim(),
          note,
        },
      },
      { new: true }
    );

    if (!updated) {
      return ResponseHandler.error(res, "Tafsir not found", 404);
    }

    invalidateCache();

    return ResponseHandler.success(
      res,
      200,
      updated,
      "Tafsir updated successfully!"
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Delete Tafsir
const deleteTafsir = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Tafsir.findByIdAndDelete(id);
    if (!deleted) {
      return ResponseHandler.error(res, "Tafsir not found", 404);
    }

    invalidateCache();

    return ResponseHandler.success(
      res,
      200,
      deleted,
      "Tafsir deleted successfully!"
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Search Tafsirs
const searchTafsirs = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `tafsir_search_${query}_${page}_${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const searchQuery = {
      $or: [
        { surahName: { $regex: query, $options: "i" } },
        { bookName: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { note: { $regex: query, $options: "i" } },
      ],
    };

    const tafsirs = await Tafsir.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ totalVerseNumber: 1 });

    const total = await Tafsir.countDocuments(searchQuery);

    const response = {
      tafsirs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    cache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Tafsirs with pagination
const paginateTafsir = async (req, res) => {
  try {
    const { page = 1, limit = 10, language } = req.query;

    const query = {};
    if (language) query.language = language;

    const tafsirs = await Tafsir.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ totalVerseNumber: 1 });

    const total = await Tafsir.countDocuments(query);

    return ResponseHandler.success(res, 200, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      tafsirs,
    });
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Get Tafsir by totalVerse number
const getTafsirByVerse = async (req, res) => {
  try {
    const { totalVerse } = req.params;
    const cacheKey = `tafsir_verse_${totalVerse}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const tafsir = await Tafsir.findOne({ totalVerseNumber: totalVerse });

    if (!tafsir) {
      return res.status(404).json({ message: "Tafsir not found" });
    }

    cache.set(cacheKey, tafsir);
    res.json(tafsir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Tafsir by ID
const getTafsirById = async (req, res) => {
  try {
    const cacheKey = `tafsir_${req.params.id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const tafsir = await Tafsir.findById(req.params.id);
    if (!tafsir) {
      return res.status(404).json({ message: "Tafsir not found" });
    }

    cache.set(cacheKey, tafsir);
    res.json(tafsir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTafsir,
  editTafsir,
  deleteTafsir,
  searchTafsirs,
  paginateTafsir,
  getTafsirById,
  getTafsirByVerse,
};

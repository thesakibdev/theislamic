const Tafsir = require("../../models/tafsir.model");
const Surah = require("../../models/surah.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");
const ResponseHandler = require("../../helper/ResponseHandler");

// Create new Tafsir
const createTafsir = async (req, res) => {
  try {
    const { language, tafseer } = req.body;
    const { bookName, totalVerseNumber, content, note } = tafseer;

    const normalBookName = bookName?.trim() || "";
    const normalContent = content?.trim() || "";

    if (!["bn", "en"].includes(language)) {
      return ResponseHandler.error(
        res,
        "Only 'bn' and 'en' languages are allowed.",
        400
      );
    }

    // Find the Surah containing this verse
    const surahInfo = await Surah.findOne({
      "verses.totalVerseNumber": totalVerseNumber,
    });

    if (!surahInfo) {
      return ResponseHandler.error(res, "Surah not found", 404);
    }

    const verse = surahInfo.verses.find(
      (v) => v.totalVerseNumber === totalVerseNumber
    );

    if (!verse) {
      return ResponseHandler.error(res, "Verse not found", 404);
    }

    // Check if tafsir already exists for this verse and language
    const existingTafsir = await Tafsir.findOne({
      language,
      surahNumber: surahInfo.surahNumber,
      "tafsir.totalVerseNumber": totalVerseNumber,
    });

    if (existingTafsir) {
      return ResponseHandler.error(
        res,
        "Tafsir already exists for this verse in this language.",
        400
      );
    }

    // Check if Tafsir document for this language and surahNumber exists
    let tafsirDoc = await Tafsir.findOne({
      language,
      surahNumber: surahInfo.surahNumber,
    });

    const tafsirEntry = {
      bookName: normalBookName,
      totalVerseNumber,
      arabicAyah: verse.arabicAyah,
      content: normalContent,
      note,
    };

    if (tafsirDoc) {
      // ❌ Check if tafsir already exists in the array
      const exists = tafsirDoc.tafseer.some(
        (t) => t.totalVerseNumber === totalVerseNumber
      );

      if (exists) {
        return ResponseHandler.error(
          res,
          "Tafsir already exists for this verse in this language.",
          400
        );
      }

      // ✅ Push new tafsir to existing doc
      tafsirDoc.tafseer.push(tafsirEntry);
      await tafsirDoc.save();
    } else {
      // Create new document
      tafsirDoc = new Tafsir({
        language,
        surahName: surahInfo.name,
        surahNumber: surahInfo.surahNumber,
        tafseer: [tafsirEntry],
      });
      await tafsirDoc.save();
    }

    invalidateCache();

    return ResponseHandler.success(
      res,
      "New Tafsir Added Successfully!",
      tafsirDoc,
      201
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Update Specific Tafsir from tafseer array
const editTafsir = async (req, res) => {
  try {
    const { id, tafsirId } = req.params; // id = main Tafsir doc ID, tafsirId = tafseer._id
    const { bookName, content, note } = req.body;

    const updated = await Tafsir.findOneAndUpdate(
      { _id: id, "tafseer._id": tafsirId },
      {
        $set: {
          "tafseer.$.bookName": bookName?.trim(),
          "tafseer.$.content": content?.trim(),
          "tafseer.$.note": note,
        },
      },
      { new: true }
    );

    if (!updated) {
      return ResponseHandler.error(res, "Tafsir not found", 404);
    }

    invalidateCache();
    return ResponseHandler.success(res, "Tafsir updated successfully!", updated, 200);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Delete a Specific Tafsir from tafseer array
const deleteTafsir = async (req, res) => {
  try {
    const { id, tafsirId } = req.params;

    const updated = await Tafsir.findByIdAndUpdate(
      id,
      { $pull: { tafseer: { _id: tafsirId } } },
      { new: true }
    );

    if (!updated) {
      return ResponseHandler.error(res, "Tafsir not found", 404);
    }

    invalidateCache();
    return ResponseHandler.success(res, "Tafsir deleted successfully!", updated, 200);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

// Paginate Tafsir by Surah (1 page = 1 Surah)
const paginateTafsir = async (req, res) => {
  try {
    const { surahNumber, language } = req.query;

    if (!surahNumber) {
      return ResponseHandler.error(res, "surahNumber is required", 400);
    }

    const query = { surahNumber: Number(surahNumber) };
    if (language) query.language = language;

    const tafsir = await Tafsir.findOne(query);

    if (!tafsir) {
      return ResponseHandler.error(res, "Tafsir not found", 404);
    }

    return ResponseHandler.success(
      res,
      "Surah Tafsir fetched successfully!",
      tafsir,
      200
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
};

const getAllTafsir = async (req, res) => {
  try {
    const { language, page = 1 } = req.query;
    if (!language) {
      return ResponseHandler.error(res, "Language is required.", 400);
    }
    const pageSize = 10;
    // Find all tafsir docs for the language
    const tafsirDocs = await Tafsir.find({ language });
    // Flatten all tafseer arrays into one array
    let allTafseer = [];
    tafsirDocs.forEach(doc => {
      if (Array.isArray(doc.tafseer)) {
        doc.tafseer.forEach(t => {
          allTafseer.push({
            ...t._doc,
            surahName: doc.surahName,
            surahNumber: doc.surahNumber,
            language: doc.language,
            parentId: doc._id,
          });
        });
      }
    });
    // Sort by totalVerseNumber ascending
    allTafseer.sort((a, b) => a.totalVerseNumber - b.totalVerseNumber);
    // Pagination
    const total = allTafseer.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = allTafseer.slice(start, end);
    const tafseer = paginated
    return ResponseHandler.success(res, "Tafsir fetched successfully!", {
      total,
      page: Number(page),
      pageSize,
      tafseer,
    }, 200);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.", 500);
  }
}

module.exports = {
  createTafsir,
  editTafsir,
  deleteTafsir,
  paginateTafsir,
  getAllTafsir,
};

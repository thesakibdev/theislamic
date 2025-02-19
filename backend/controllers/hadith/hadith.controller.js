const Hadith = require("../../models/hadith.model");
const HadithOtherLanguage = require("../../models/hadithOtherLanguage.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");

const addHadith = async (req, res) => {
  const {
    bookName,
    partName,
    partNumber,
    chapterName,
    chapterNumber,
    hadithList,
  } = req.body;

  try {
    // Normalize Data
    const normalizedBookName = bookName.trim();
    const normalizedPartName = partName.trim();
    const normalizedPartNumber = Number(partNumber);
    const normalizedChapterName = chapterName.trim();
    const normalizedChapterNumber = Number(chapterNumber);

    // Step 1: Find document by bookName + partNumber + chapterNumber
    let hadithDoc = await Hadith.findOne({
      bookName: normalizedBookName,
      partNumber: normalizedPartNumber,
      chapterNumber: normalizedChapterNumber,
    });

    if (hadithDoc) {
      // Step 2: Check if hadithNumber already exists in hadithList
      const existingHadith = hadithDoc.hadithList.find(
        (h) => h.hadithNumber === hadithList.hadithNumber
      );

      if (existingHadith) {
        return res.status(400).json({
          error: true,
          message: "Hadith already exists in this book, part, and chapter.",
        });
      }

      // Step 3: Push new hadith to hadithList and save
      hadithDoc.hadithList.push(hadithList);
      await hadithDoc.save();

      // Invalidate cache (if needed)
      invalidateCache();

      return res.status(200).json({
        success: true,
        message: "New hadith added to existing book, part, and chapter.",
        hadith: hadithDoc,
      });
    } else {
      // Step 4: Create a new document if bookName + partNumber + chapterNumber does not exist
      const newHadith = new Hadith({
        bookName: normalizedBookName,
        partName: normalizedPartName,
        partNumber: normalizedPartNumber,
        chapterName: normalizedChapterName,
        chapterNumber: normalizedChapterNumber,
        hadithList: [hadithList], // Store hadith as an array
      });

      await newHadith.save();
      invalidateCache();

      return res.status(201).json({
        success: true,
        message: "New hadith document created successfully.",
        hadith: newHadith,
      });
    }
  } catch (err) {
    console.error("Error in addHadith:", err);
    res.status(500).json({
      error: true,
      message: "Internal server error.",
      details: err.message,
    });
  }
};

const editHadith = async (req, res) => {
  const { id } = req.params;
  const { hadithNumber, internationalNumber, hadithArabic, note } = req.body;
  try {
    const normalizedHadithNumber = Number(hadithNumber);
    const normalizedInternationalNumber = Number(internationalNumber);
    const normalizedHadithArabic = hadithArabic.trim();

    if (!normalizedHadithNumber || isNaN(normalizedHadithNumber)) {
      return res.status(400).json({
        error: true,
        message: "Invalid hadithNumber.",
      });
    }
    if (
      !normalizedInternationalNumber ||
      isNaN(normalizedInternationalNumber)
    ) {
      return res.status(400).json({
        error: true,
        message: "Invalid internationalNumber.",
      });
    }
    if (!normalizedHadithArabic) {
      return res.status(400).json({
        error: true,
        message: "Invalid hadithArabic.",
      });
    }

    const updatedHadith = await Hadith.findOneAndUpdate(
      { "hadithList._id": id },
      {
        $set: {
          "hadithList.$.hadithNumber": normalizedHadithNumber,
          "hadithList.$.internationalNumber": normalizedInternationalNumber,
          "hadithList.$.hadithArabic": normalizedHadithArabic,
          "hadithList.$.note": note,
        },
      },
      { new: true }
    );
    if (!updatedHadith) {
      return res.status(404).json({
        success: false,
        message: "Hadith not found.",
      });
    }

    // Invalidate the cache
    invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Hadith updated successfully.",
      hadith: updatedHadith,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error from editing hadith",
    });
  }
};

const deleteHadith = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHadith = await Hadith.findOneAndUpdate(
      { "hadithList._id": id },
      { $pull: { hadithList: { _id: id } } },
      { new: true }
    );
    if (!deletedHadith) {
      return res.status(404).json({
        success: false,
        message: "Hadith not found.",
      });
    }

    // Invalidate the cache
    invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Hadith deleted successfully.",
      hadith: deletedHadith,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error from deleting hadith",
    });
  }
};

// hadith other language data
const addHadithOtherLanguage = async (req, res) => {
  const {
    language,
    bookName,
    partNumber,
    chapterNumber,
    hadithNumber,
    hadithText,
    referenceBook,
    note,
  } = req.body;

  try {
    // Data normalization
    const normalLanguage = language?.trim().toLowerCase();
    const normalBookName = bookName?.trim();
    const normalPartNumber = parseInt(partNumber, 10);
    const normalChapterNumber = parseInt(chapterNumber, 10);
    const normalHadithNumber = parseInt(hadithNumber, 10);
    const normalHadithText = hadithText?.trim();
    const normalReferenceBook = referenceBook?.trim();
    const normalNote = note?.trim();

    // Number validation helper function
    const validateNumber = (num) => Number.isInteger(num) && num > 0;

    // Data validation
    if (!normalLanguage)
      return res
        .status(400)
        .json({ error: true, message: "Invalid language." });
    if (!normalBookName)
      return res
        .status(400)
        .json({ error: true, message: "Invalid bookName." });
    if (!validateNumber(normalPartNumber))
      return res
        .status(400)
        .json({ error: true, message: "Invalid partNumber." });
    if (!validateNumber(normalChapterNumber))
      return res
        .status(400)
        .json({ error: true, message: "Invalid chapterNumber." });
    if (!validateNumber(normalHadithNumber))
      return res
        .status(400)
        .json({ error: true, message: "Invalid hadithNumber." });
    if (!normalHadithText)
      return res
        .status(400)
        .json({ error: true, message: "Invalid hadithText." });

    // Check if the hadith already exists
    const existingHadith = await HadithOtherLanguage.findOne({
      language: normalLanguage,
      bookName: normalBookName,
      partNumber: normalPartNumber,
      chapterNumber: normalChapterNumber,
      hadithNumber: normalHadithNumber,
    }).lean();

    if (existingHadith) {
      return res
        .status(400)
        .json({ error: true, message: "Hadith already exists." });
    }

    // Create and save new hadith
    const newHadithData = new HadithOtherLanguage({
      language: normalLanguage,
      bookName: normalBookName,
      partNumber: normalPartNumber,
      chapterNumber: normalChapterNumber,
      hadithNumber: normalHadithNumber,
      hadithText: normalHadithText,
      referenceBook: normalReferenceBook,
      note: normalNote,
    });

    await newHadithData.save();

    // Invalidate the cache
    invalidateCache();

    return res.status(201).json({
      success: true,
      message: "New hadith document created successfully.",
      hadith: newHadithData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding hadith in other language.",
    });
  }
};

const editHadithOtherLanguage = async (req, res) => {
  const { id } = req.params;

  const {
    language,
    bookName,
    partNumber,
    chapterNumber,
    hadithNumber,
    hadithText,
    referenceBook,
    note,
  } = req.body;

  try {
    // Data normalization
    const normalLanguage = language?.trim().toLowerCase();
    const normalBookName = bookName?.trim();
    const normalPartNumber = parseInt(partNumber, 10);
    const normalChapterNumber = parseInt(chapterNumber, 10);
    const normalHadithNumber = parseInt(hadithNumber, 10);
    const normalHadithText = hadithText?.trim();
    const normalReferenceBook = referenceBook?.trim();
    const normalNote = note?.trim();

    // Number validation helper function
    const validateNumber = (num) => Number.isInteger(num) && num > 0;

    // Data validation
    if (!normalLanguage)
      return res
        .status(400)
        .json({ error: true, message: "Invalid language." });
    if (!normalBookName)
      return res
        .status(400)
        .json({ error: true, message: "Invalid bookName." });
    if (!validateNumber(normalPartNumber))
      return res
        .status(400)
        .json({ error: true, message: "Invalid partNumber." });
    if (!validateNumber(normalChapterNumber))
      return res
        .status(400)
        .json({ error: true, message: "Invalid chapterNumber." });
    if (!validateNumber(normalHadithNumber))
      return res
        .status(400)
        .json({ error: true, message: "Invalid hadithNumber." });
    if (!normalHadithText)
      return res
        .status(400)
        .json({ error: true, message: "Invalid hadithText." });

    // find the existing hadith data
    const updatedHadithData = await HadithOtherLanguage.findOneAndUpdate(
      { _id: id },
      {
        language: normalLanguage,
        bookName: normalBookName,
        partNumber: normalPartNumber,
        chapterNumber: normalChapterNumber,
        hadithNumber: normalHadithNumber,
        hadithText: normalHadithText,
        referenceBook: normalReferenceBook,
        note: normalNote,
      },
      { new: true }
    );

    if (!updatedHadithData) {
      return res
        .status(404)
        .json({ error: true, message: "Hadith not found." });
    }

    // Invalidate the cache
    invalidateCache();

    if (updatedHadithData) {
      return res.status(200).json({
        success: true,
        message: "Hadith updated successfully.",
        hadith: updatedHadithData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding hadith in other language.",
    });
  }
};

const deleteHadithOtherLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHadith = await HadithOtherLanguage.findByIdAndDelete(id);
    if (!deletedHadith) {
      return res.status(404).json({
        success: false,
        message: "Hadith not found.",
      });
    }

    // Invalidate the cache
    invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Hadith deleted successfully.",
      hadith: deletedHadith,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error from deleting hadith",
    });
  }
};

const getAllHadithPaginated = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    const cacheKey = `hadithsPage_${currentPage}_limit_${pageLimit}`;
    const cachedHadiths = await getCache(cacheKey);

    if (cachedHadiths) {
      return res.status(200).json(cachedHadiths);
    }

    const hadiths = await Hadith.aggregate([
      { $sort: { bookName: 1, partNumber: 1, chapterNumber: 1 } },
      { $skip: (currentPage - 1) * pageLimit },
      { $limit: pageLimit },
    ]);

    for (let hadith of hadiths) {
      const hadiths = await Hadith.aggregate([
        { $match: { _id: hadith._id } },
        { $unwind: "$hadithList" },
        { $sort: { "hadithList.hadithNumber": 1 } },
        {
          $group: {
            _id: "$_id",
            hadithList: { $push: "$hadithList" },
          },
        },
      ]);

      hadith.hadithList = hadiths.length > 0 ? hadiths[0].hadithList : [];
    }

    const hadithOtherLanguage = await HadithOtherLanguage.find().lean();

    const formattedHadiths = hadiths.map((hadith) => ({
      _id: hadith._id,
      bookName: hadith.bookName,
      partNumber: hadith.partNumber,
      partName: hadith.partName,
      chapterName: hadith.chapterName,
      chapterNumber: hadith.chapterNumber,
      hadithList: hadith.hadithList.map((hadithItem) => ({
        _id: hadithItem._id,
        hadithNumber: hadithItem.hadithNumber,
        internationalNumber: hadithItem.internationalNumber,
        hadithArabic: hadithItem.hadithArabic,
        narrator: hadithItem.narrator,
        referenceBook: hadithItem.referenceBook,
        similarities: hadithItem.similarities,
        translation: hadithItem.translation,
        transliteration: hadithItem.transliteration,
        note: hadithItem.note,
        hadithOtherLanguage: hadithOtherLanguage
          .filter(
            (hl) =>
              hl.bookName === hadith.bookName &&
              hl.partNumber === hadith.partNumber &&
              hl.chapterNumber === hadith.chapterNumber &&
              hl.hadithNumber === hadithItem.hadithNumber
          )
          .map(
            ({ bookName, partNumber, chapterNumber, hadithNumber, ...rest }) =>
              rest
          ),
      })),
    }));

    const count = await Hadith.countDocuments();

    const paginatedData = {
      hadiths: formattedHadiths,
      totalHadiths: count,
      totalPages: Math.ceil(count / pageLimit),
      currentPage,
    };

    // Cache the response for 10 minutes
    setCache(cacheKey, paginatedData, 600);

    res.status(200).json({
      success: true,
      message: "Hadiths fetched successfully",
      paginatedData,
    });
  } catch (error) {
    console.error("Error fetching hadiths:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hadiths",
    });
  }
};

module.exports = {
  addHadith,
  editHadith,
  deleteHadith,
  addHadithOtherLanguage,
  editHadithOtherLanguage,
  deleteHadithOtherLanguage,
  getAllHadithPaginated,
};

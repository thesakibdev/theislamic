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
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const cacheKey = `hadithsPage_${currentPage}_limit_${pageLimit}`;
    const cachedHadiths = await getCache(cacheKey);

    if (cachedHadiths) {
      return res.status(200).json(cachedHadiths);
    }

    // Aggregation পাইপলাইন
    const aggregationPipeline = [
      { $unwind: "$hadithList" }, // প্রতিটি হাদিসকে আলাদা ডকুমেন্ট করা
      {
        $sort: {
          bookName: 1,
          partNumber: 1,
          chapterNumber: 1,
          "hadithList.hadithNumber": 1,
        },
      },
      {
        $group: {
          _id: {
            bookName: "$bookName",
            partNumber: "$partNumber",
            chapterNumber: "$chapterNumber",
          },
          bookName: { $first: "$bookName" },
          partNumber: { $first: "$partNumber" },
          partName: { $first: "$partName" },
          chapterNumber: { $first: "$chapterNumber" },
          chapterName: { $first: "$chapterName" },
          hadiths: { $push: "$hadithList" }, // আলাদা করা হাদিসগুলো সংগ্রহ
          totalHadiths: { $sum: 1 }, // প্রতিটি গ্রুপের হাদিস কাউন্ট
        },
      },
      { $sort: { bookName: 1, partNumber: 1, chapterNumber: 1 } },
      {
        $group: {
          _id: {
            bookName: "$bookName",
            partNumber: "$partNumber",
          },
          bookName: { $first: "$bookName" },
          partNumber: { $first: "$partNumber" },
          partName: { $first: "$partName" },
          chapters: {
            $push: {
              chapterNumber: "$chapterNumber",
              chapterName: "$chapterName",
              hadiths: "$hadiths",
              totalChapterHadiths: "$totalHadiths",
            },
          },
          totalPartHadiths: { $sum: "$totalHadiths" }, // পার্টের মোট হাদিস
        },
      },
      { $sort: { bookName: 1, partNumber: 1 } },
      {
        $group: {
          _id: "$bookName",
          bookName: { $first: "$bookName" },
          parts: {
            $push: {
              partNumber: "$partNumber",
              partName: "$partName",
              chapters: "$chapters",
              totalPartHadiths: "$totalPartHadiths",
            },
          },
          totalBookHadiths: { $sum: "$totalPartHadiths" }, // বইয়ের মোট হাদিস
        },
      },
      { $sort: { bookName: 1 } },
      { $skip: (currentPage - 1) * pageLimit },
      { $limit: pageLimit },
    ];

    const [result] = await Hadith.aggregate(aggregationPipeline);

    // অনুবাদিত হাদিস সংগ্রহ
    const hadithOtherLanguage = await HadithOtherLanguage.find().lean();

    // রেস্পন্স ফরম্যাটিং
    const formattedResponse = {
      bookName: result?.bookName || "",
      totalBookHadiths: result?.totalBookHadiths || 0,
      parts:
        result?.parts?.map((part) => ({
          partNumber: part.partNumber,
          partName: part.partName,
          totalPartHadiths: part.totalPartHadiths,
          chapters: part.chapters.map((chapter) => ({
            chapterNumber: chapter.chapterNumber,
            chapterName: chapter.chapterName,
            totalChapterHadiths: chapter.totalChapterHadiths,
            hadithList: chapter.hadiths
              .sort((a, b) => a.hadithNumber - b.hadithNumber)
              .map((hadith) => ({
                ...hadith,
                hadithOtherLanguage: hadithOtherLanguage
                  .filter(
                    (hl) =>
                      hl.bookName === result.bookName &&
                      hl.partNumber === part.partNumber &&
                      hl.chapterNumber === chapter.chapterNumber &&
                      hl.hadithNumber === hadith.hadithNumber
                  )
                  .map(
                    ({
                      bookName,
                      partNumber,
                      chapterNumber,
                      hadithNumber,
                      ...rest
                    }) => rest
                  ),
              })),
          })),
        })) || [],
    };

    const totalBooks = await Hadith.distinct("bookName").countDocuments();

    const paginatedData = {
      data: formattedResponse,
      currentPage,
      totalPages: Math.ceil(totalBooks / pageLimit),
      totalBooks,
      itemsPerPage: pageLimit,
    };

    // Cache 10 মিনিটের জন্য
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

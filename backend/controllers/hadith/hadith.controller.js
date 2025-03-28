const Hadith = require("../../models/hadith.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");

// const addHadith = async (req, res) => {
//   const {
//     bookName,
//     partName,
//     partNumber,
//     chapterName,
//     chapterNumber,
//     hadithList,
//   } = req.body;

//   try {
//     // Normalize Data
//     const normalizedBookName = bookName.trim();
//     const normalizedPartName = partName.trim();
//     const normalizedPartNumber = Number(partNumber);
//     const normalizedChapterName = chapterName.trim();
//     const normalizedChapterNumber = Number(chapterNumber);

//     // Step 1: Find document by bookName + partNumber + chapterNumber
//     let hadithDoc = await Hadith.findOne({
//       bookName: normalizedBookName,
//       partNumber: normalizedPartNumber,
//       chapterNumber: normalizedChapterNumber,
//     });

//     if (hadithDoc) {
//       // Step 2: Check if hadithNumber already exists in hadithList
//       const existingHadith = hadithDoc.hadithList.find(
//         (h) => h.hadithNumber === hadithList.hadithNumber
//       );

//       if (existingHadith) {
//         return res.status(400).json({
//           error: true,
//           message: "Hadith already exists in this book, part, and chapter.",
//         });
//       }

//       // Step 3: Push new hadith to hadithList and save
//       hadithDoc.hadithList.push(hadithList);
//       await hadithDoc.save();

//       // Invalidate cache (if needed)
//       invalidateCache();

//       return res.status(200).json({
//         success: true,
//         message: "New hadith added to existing book, part, and chapter.",
//         hadith: hadithDoc,
//       });
//     } else {
//       // Step 4: Create a new document if bookName + partNumber + chapterNumber does not exist
//       const newHadith = new Hadith({
//         bookName: normalizedBookName,
//         partName: normalizedPartName,
//         partNumber: normalizedPartNumber,
//         chapterName: normalizedChapterName,
//         chapterNumber: normalizedChapterNumber,
//         hadithList: [hadithList], // Store hadith as an array
//       });

//       await newHadith.save();
//       invalidateCache();

//       return res.status(201).json({
//         success: true,
//         message: "New hadith document created successfully.",
//         hadith: newHadith,
//       });
//     }
//   } catch (err) {
//     console.error("Error in addHadith:", err);
//     res.status(500).json({
//       error: true,
//       message: "Internal server error.",
//       details: err.message,
//     });
//   }
// };

const addHadith = async (req, res) => {
  const {
    bookName,
    language,
    partName,
    partNumber,
    chapterName,
    chapterNumber,
    hadithList,
  } = req.body;

  try {
    // Normalize Data
    const normalizedBookName = bookName?.trim();
    const normalizedLanguage = language?.trim();
    const normalizedPartName = partName?.trim();
    const normalizedPartNumber = Number(partNumber);
    const normalizedChapterName = chapterName?.trim();
    const normalizedChapterNumber = Number(chapterNumber);

    // Validate input
    if (!normalizedBookName || !normalizedLanguage) {
      return res.status(400).json({
        error: true,
        message: "Book name and language are required.",
      });
    }

    // Find book by name and language
    let hadithDoc = await Hadith.findOne({
      bookName: normalizedBookName,
      language: normalizedLanguage,
    });

    // If no book exists, create a new one
    if (!hadithDoc) {
      hadithDoc = new Hadith({
        bookName: normalizedBookName,
        language: normalizedLanguage,
        parts: [
          {
            partName: normalizedPartName,
            partNumber: normalizedPartNumber,
            chapters: [
              {
                chapterName: normalizedChapterName,
                chapterNumber: normalizedChapterNumber,
                hadithList: [hadithList],
              },
            ],
          },
        ],
      });

      await hadithDoc.save();

      invalidateCache();

      return res.status(201).json({
        success: true,
        message: "New hadith book created successfully.",
        hadith: hadithDoc,
      });
    }

    // Check if hadith already exists in this book and language
    const existingHadith = hadithDoc.parts.some((part) =>
      part.chapters.some((chapter) =>
        chapter.hadithList.some(
          (hadith) => hadith.hadithNumber === hadithList.hadithNumber
        )
      )
    );

    if (existingHadith) {
      return res.status(400).json({
        error: true,
        message: `Hadith number ${hadithList.hadithNumber} already exists in this book and language.`,
      });
    }

    // Find or create part
    let part = hadithDoc.parts.find(
      (p) => p.partNumber === normalizedPartNumber
    );

    if (!part) {
      hadithDoc.parts.push({
        partName: normalizedPartName,
        partNumber: normalizedPartNumber,
        chapters: [
          {
            chapterName: normalizedChapterName,
            chapterNumber: normalizedChapterNumber,
            hadithList: [hadithList],
          },
        ],
      });

      await hadithDoc.save();

      invalidateCache();

      return res.status(201).json({
        success: true,
        message: "New part added with hadith.",
        hadith: hadithDoc,
      });
    }

    // Find or create chapter
    let chapter = part.chapters.find(
      (c) => c.chapterNumber === normalizedChapterNumber
    );

    if (!chapter) {
      part.chapters.push({
        chapterName: normalizedChapterName,
        chapterNumber: normalizedChapterNumber,
        hadithList: [hadithList],
      });

      await hadithDoc.save();

      invalidateCache();

      return res.status(201).json({
        success: true,
        message: "New chapter added with hadith.",
        hadith: hadithDoc,
      });
    }

    // Add new hadith to the existing chapter
    chapter.hadithList.push(hadithList);
    await hadithDoc.save();

    invalidateCache();

    return res.status(200).json({
      success: true,
      message: "New hadith added successfully.",
      hadith: hadithDoc,
    });
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
  const {
    bookName,
    language,
    partNumber,
    chapterNumber,
    hadithNumber,
    updatedData,
  } = req.body;

  try {
    // Validate input
    if (!bookName || !language) {
      return res.status(400).json({
        error: true,
        message: "Book name and language are required.",
      });
    }

    // Find the hadith document
    const hadithDoc = await Hadith.findOne({
      bookName,
      language,
    });

    if (!hadithDoc) {
      return res.status(404).json({
        error: true,
        message: `Book with name "${bookName}" in "${language}" not found.`,
      });
    }

    // Find the part
    const part = hadithDoc.parts.find(
      (p) => p.partNumber === Number(partNumber)
    );

    if (!part) {
      return res.status(404).json({
        error: true,
        message: `Part number ${partNumber} not found in book "${bookName}".`,
      });
    }

    // Find the chapter
    const chapter = part.chapters.find(
      (c) => c.chapterNumber === Number(chapterNumber)
    );

    if (!chapter) {
      return res.status(404).json({
        error: true,
        message: `Chapter number ${chapterNumber} not found in part ${partNumber} of book "${bookName}".`,
      });
    }

    // Find the hadith
    const hadithIndex = chapter.hadithList.findIndex(
      (h) => h.hadithNumber === Number(hadithNumber)
    );

    if (hadithIndex === -1) {
      return res.status(404).json({
        error: true,
        message: `Hadith number ${hadithNumber} not found in chapter ${chapterNumber} of part ${partNumber} in book "${bookName}".`,
      });
    }

    // Check if updating hadithNumber and if the new number already exists
    if (
      updatedData.hadithNumber &&
      updatedData.hadithNumber !== chapter.hadithList[hadithIndex].hadithNumber
    ) {
      const existingHadith = chapter.hadithList.find(
        (h) => h.hadithNumber === Number(updatedData.hadithNumber)
      );

      if (existingHadith) {
        return res.status(400).json({
          error: true,
          message: `Hadith number ${updatedData.hadithNumber} already exists in this chapter.`,
        });
      }
    }

    // Update the hadith data
    const hadithToUpdate = chapter.hadithList[hadithIndex];

    // Update each field that is present in updatedData
    Object.keys(updatedData).forEach((key) => {
      // Check if the field exists in the schema before updating
      if (key in hadithToUpdate) {
        hadithToUpdate[key] = updatedData[key];
      }
    });

    // Save the updated document
    await hadithDoc.save();

    invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Hadith updated successfully.",
      hadith: hadithDoc,
    });
  } catch (err) {
    console.error("Error in editHadith:", err);
    res.status(500).json({
      error: true,
      message: "Internal server error.",
      details: err.message,
    });
  }
};

const deleteHadith = async (req, res) => {
  const { bookName, language, partNumber, chapterNumber, hadithNumber } =
    req.body;

  try {
    // Validate input
    if (!bookName || !language) {
      return res.status(400).json({
        error: true,
        message: "Book name and language are required.",
      });
    }

    // Find the hadith document
    const hadithDoc = await Hadith.findOne({
      bookName,
      language,
    });

    if (!hadithDoc) {
      return res.status(404).json({
        error: true,
        message: `Book with name "${bookName}" in "${language}" not found.`,
      });
    }

    // Find the part
    const part = hadithDoc.parts.find(
      (p) => p.partNumber === Number(partNumber)
    );

    if (!part) {
      return res.status(404).json({
        error: true,
        message: `Part number ${partNumber} not found in book "${bookName}".`,
      });
    }

    // Find the chapter
    const chapter = part.chapters.find(
      (c) => c.chapterNumber === Number(chapterNumber)
    );

    if (!chapter) {
      return res.status(404).json({
        error: true,
        message: `Chapter number ${chapterNumber} not found in part ${partNumber} of book "${bookName}".`,
      });
    }

    // Find the hadith
    const hadithIndex = chapter.hadithList.findIndex(
      (h) => h.hadithNumber === Number(hadithNumber)
    );

    if (hadithIndex === -1) {
      return res.status(404).json({
        error: true,
        message: `Hadith number ${hadithNumber} not found in chapter ${chapterNumber} of part ${partNumber} in book "${bookName}".`,
      });
    }

    // Remove the hadith
    chapter.hadithList.splice(hadithIndex, 1);

    // If the chapter becomes empty (no hadiths), remove the chapter
    if (chapter.hadithList.length === 0) {
      const chapterIndex = part.chapters.findIndex(
        (c) => c.chapterNumber === Number(chapterNumber)
      );
      part.chapters.splice(chapterIndex, 1);

      // If the part becomes empty (no chapters), remove the part
      if (part.chapters.length === 0) {
        const partIndex = hadithDoc.parts.findIndex(
          (p) => p.partNumber === Number(partNumber)
        );
        hadithDoc.parts.splice(partIndex, 1);

        // If the book becomes empty (no parts), remove the book
        if (hadithDoc.parts.length === 0) {
          await Hadith.deleteOne({ _id: hadithDoc._id });
          return res.status(200).json({
            success: true,
            message:
              "Hadith, chapter, part, and book deleted successfully as they became empty.",
          });
        }
      }
    }

    // Save the updated document
    await hadithDoc.save();

    invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Hadith deleted successfully.",
      hadith: hadithDoc,
    });
  } catch (err) {
    console.error("Error in deleteHadith:", err);
    res.status(500).json({
      error: true,
      message: "Internal server error.",
      details: err.message,
    });
  }
};

const getAllHadithsPaginated = async (req, res) => {
  const { page = 1, limit = 10, hadithPage = 1, hadithLimit = 5 } = req.query;

  try {
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const hadithCurrentPage = Math.max(parseInt(hadithPage, 10) || 1, 1);
    const hadithPageLimit = Math.max(parseInt(hadithLimit, 10) || 5, 1);

    // Create cache key for hadith pagination
    const cacheKey = `hadithsPage_${currentPage}_limit_${pageLimit}_hadithPage_${hadithCurrentPage}_hadithLimit_${hadithPageLimit}`;
    const cachedHadiths = await getCache(cacheKey);

    if (cachedHadiths) {
      return res.status(200).json(cachedHadiths);
    }

    // Aggregation pipeline for books & parts pagination
    const aggregationPipeline = [
      { $sort: { bookName: 1, "parts.partNumber": 1 } },
      { $skip: (currentPage - 1) * pageLimit },
      { $limit: pageLimit },
    ];

    const hadiths = await Hadith.aggregate(aggregationPipeline);
    const totalHadiths = await Hadith.countDocuments();
    const hadithOtherLanguage = await HadithOtherLanguage.find().lean();

    // Format the response with paginated hadithList
    const formattedHadiths = hadiths.map((hadith) => ({
      bookName: hadith.bookName,
      parts: hadith.parts
        .sort((a, b) => a.partNumber - b.partNumber)
        .map((part) => ({
          partName: part.partName,
          partNumber: part.partNumber,
          chapters: part.chapters
            .sort((a, b) => a.chapterNumber - b.chapterNumber)
            .map((chapter) => {
              // HadithList pagination
              const totalHadithCount = chapter.hadithList.length;
              const paginatedHadithList = chapter.hadithList
                .sort((a, b) => a.hadithNumber - b.hadithNumber)
                .slice(
                  (hadithCurrentPage - 1) * hadithPageLimit,
                  hadithCurrentPage * hadithPageLimit
                )
                .map((h) => {
                  const otherLanguages = hadithOtherLanguage
                    .filter(
                      (hl) =>
                        hl.bookName === hadith.bookName &&
                        hl.partNumber === part.partNumber &&
                        hl.chapterNumber === chapter.chapterNumber &&
                        hl.hadithNumber === h.hadithNumber
                    )
                    .map(
                      ({
                        bookName,
                        partNumber,
                        chapterNumber,
                        hadithNumber,
                        ...rest
                      }) => rest
                    );

                  return {
                    ...h,
                    hadithOtherLanguage: otherLanguages,
                  };
                });

              return {
                chapterName: chapter.chapterName,
                chapterNumber: chapter.chapterNumber,
                hadithList: paginatedHadithList,
                hadithPagination: {
                  hadithCurrentPage,
                  totalHadithPages: Math.ceil(
                    totalHadithCount / hadithPageLimit
                  ),
                  totalHadithCount,
                },
              };
            }),
        })),
      _id: hadith._id,
      createdAt: hadith.createdAt,
      updatedAt: hadith.updatedAt,
      __v: hadith.__v,
    }));

    // Final paginated response
    const paginatedData = {
      data: formattedHadiths,
      currentPage,
      totalPages: Math.ceil(totalHadiths / pageLimit),
      totalItems: totalHadiths,
      itemsPerPage: pageLimit,
    };

    // Cache for 10 minutes
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

const getHadithByBook = async (req, res) => {
  const { bookName, language = "en" } = req.query;

  try {
    // Check if bookName is provided
    if (!bookName) {
      // Return list of available books
      const allBooks = await Hadith.distinct("bookName");
      return res.status(200).json({
        success: true,
        message: "Please provide a book name",
        data: { availableBooks: allBooks || [] },
      });
    }

    // Create cache key
    const cacheKey = `hadiths_book_${bookName}_language_${language}`;

    // Try cache first
    let cachedHadiths = null;
    try {
      cachedHadiths = await getCache(cacheKey);
      if (cachedHadiths) return res.status(200).json(cachedHadiths);
    } catch (cacheError) {
      console.log("Cache error:", cacheError.message);
    }

    // Fetch book with language
    const selectedBook = await Hadith.findOne({
      bookName: { $regex: new RegExp(`^${bookName}$`, "i") }, // Case-insensitive match
      language: { $regex: new RegExp(`^${language}$`, "i") },
    }).lean();

    if (!selectedBook) {
      const allBooks = await Hadith.distinct("bookName");
      return res.status(404).json({
        success: false,
        message: `"${bookName}" in "${language}" not found`,
        data: { availableBooks: allBooks || [] },
      });
    }

    // Simplified response formatting
    const formattedBook = {
      ...selectedBook,
      parts: (selectedBook.parts || [])
        .sort((a, b) => a.partNumber - b.partNumber)
        .map((part) => ({
          ...part,
          chapters: (part.chapters || [])
            .sort((a, b) => a.chapterNumber - b.chapterNumber)
            .map((chapter) => ({
              ...chapter,
              hadithList: (chapter.hadithList || [])
                .sort((a, b) => a.hadithNumber - b.hadithNumber)
                .map((h) => ({
                  id: h._id,
                  hadithNumber: h.hadithNumber,
                  internationalNumber: h.internationalNumber,
                  narrator: h.narrator,
                  hadithArabic: h.hadithArabic,
                  translation: h.translation,
                  transliteration: h.transliteration,
                  referenceBook: h.referenceBook,
                  similarities: h.similarities,
                  note: h.note,
                  keywords: h.keywords || [],
                })),
            })),
        })),
    };

    const responseData = {
      success: true,
      message: "Hadith book fetched successfully",
      data: {
        data: formattedBook,
        selectedBook: bookName,
        language,
        availableLanguages: await Hadith.distinct("language", { bookName }),
      },
    };

    // Update cache
    try {
      await setCache(cacheKey, responseData, 600);
    } catch (cacheError) {
      console.log("Cache set error:", cacheError.message);
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching hadith book:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hadith book",
      error: error.message,
    });
  }
};

const getAllHadiths = async (req, res) => {
  try {
    // Create cache key for all hadiths
    const cacheKey = "allHadiths";
    const cachedHadiths = await getCache(cacheKey);

    if (cachedHadiths) {
      return res.status(200).json(cachedHadiths);
    }

    // Use lean() to get plain JavaScript objects instead of Mongoose documents
    const hadiths = await Hadith.find().sort({ bookName: 1 }).lean();
    const totalHadiths = hadiths.length;
    const hadithOtherLanguage = await HadithOtherLanguage.find().lean();

    // Format the response with complete hadithList
    const formattedHadiths = hadiths.map((hadith) => ({
      bookName: hadith.bookName,
      parts: hadith.parts
        .sort((a, b) => a.partNumber - b.partNumber)
        .map((part) => ({
          partName: part.partName,
          partNumber: part.partNumber,
          chapters: part.chapters
            .sort((a, b) => a.chapterNumber - b.chapterNumber)
            .map((chapter) => {
              // Include all hadiths without pagination
              const hadithList = chapter.hadithList
                .sort((a, b) => a.hadithNumber - b.hadithNumber)
                .map((h) => {
                  const otherLanguages = hadithOtherLanguage
                    .filter(
                      (hl) =>
                        hl.bookName === hadith.bookName &&
                        hl.partNumber === part.partNumber &&
                        hl.chapterNumber === chapter.chapterNumber &&
                        hl.hadithNumber === h.hadithNumber
                    )
                    .map(
                      ({
                        bookName,
                        partNumber,
                        chapterNumber,
                        hadithNumber,
                        ...rest
                      }) => rest
                    );

                  return {
                    ...h,
                    hadithOtherLanguage: otherLanguages,
                  };
                });

              return {
                chapterName: chapter.chapterName,
                chapterNumber: chapter.chapterNumber,
                hadithList: hadithList,
              };
            }),
        })),
      _id: hadith._id,
      createdAt: hadith.createdAt,
      updatedAt: hadith.updatedAt,
      __v: hadith.__v,
    }));

    const responseData = {
      data: formattedHadiths,
      totalItems: totalHadiths,
    };

    // Cache for 10 minutes
    setCache(cacheKey, responseData, 600);

    res.status(200).json({
      success: true,
      message: "Hadiths fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching hadiths:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hadiths",
      error: error.message,
    });
  }
};

module.exports = {
  addHadith,
  editHadith,
  deleteHadith,
  getHadithByBook,
  getAllHadiths,
};

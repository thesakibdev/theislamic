const Hadith = require("../../models/hadith.model");
const HadithOtherLanguage = require("../../models/hadithOtherLanguage.model");
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
    partName,
    partNumber,
    chapterName,
    chapterNumber,
    hadithList,
  } = req.body;

  try {
    // Normalize Data
    const normalizedBookName = bookName?.trim();
    const normalizedPartName = partName?.trim();
    const normalizedPartNumber = Number(partNumber);
    const normalizedChapterName = chapterName?.trim();
    const normalizedChapterNumber = Number(chapterNumber);

    // Check if hadith with same combination already exists
    const existingHadith = await Hadith.findOne({
      bookName: normalizedBookName,
      "parts.partNumber": normalizedPartNumber,
      "parts.chapters.chapterNumber": normalizedChapterNumber,
      "parts.chapters.hadithList.hadithNumber": hadithList.hadithNumber,
    });

    if (existingHadith) {
      return res.status(400).json({
        error: true,
        message: `Hadith with bookName=${normalizedBookName}, partNumber=${normalizedPartNumber}, chapterNumber=${normalizedChapterNumber}, hadithNumber=${hadithList.hadithNumber} already exists.`,
      });
    }

    // Step 1: Find the book by bookName
    let hadithDoc = await Hadith.findOne({ bookName: normalizedBookName });

    if (!hadithDoc) {
      hadithDoc = new Hadith({
        bookName: normalizedBookName,
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

    // Step 2: Find the part within the book
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

    // Step 3: Find the chapter within the part
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

    // Step 4: Check if hadith already exists in the chapter
    const existingHadithInChapter = chapter.hadithList.find(
      (h) => h.hadithNumber === hadithList.hadithNumber
    );

    if (existingHadithInChapter) {
      return res.status(400).json({
        error: true,
        message: "Hadith already exists in this chapter.",
      });
    }

    // Step 5: Add new hadith to the existing chapter
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
  const { bookName, partNumber, chapterNumber, hadithNumber, updatedData } =
    req.body;

  console.log("Edit Hadith Request:", req.body);

  try {
    // Find the hadith document
    const hadithDoc = await Hadith.findOne({ bookName });

    if (!hadithDoc) {
      return res.status(404).json({
        error: true,
        message: `Book with name "${bookName}" not found.`,
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
  const { bookName, partNumber, chapterNumber, hadithNumber } = req.body;

  console.log("Delete Hadith Request:", req.body);

  try {
    // Find the hadith document
    const hadithDoc = await Hadith.findOne({ bookName });

    if (!hadithDoc) {
      return res.status(404).json({
        error: true,
        message: `Book with name "${bookName}" not found.`,
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

    // If the chapter becomes empty (no hadiths), you might want to remove the chapter
    if (chapter.hadithList.length === 0) {
      const chapterIndex = part.chapters.findIndex(
        (c) => c.chapterNumber === Number(chapterNumber)
      );
      part.chapters.splice(chapterIndex, 1);

      // If the part becomes empty (no chapters), you might want to remove the part
      if (part.chapters.length === 0) {
        const partIndex = hadithDoc.parts.findIndex(
          (p) => p.partNumber === Number(partNumber)
        );
        hadithDoc.parts.splice(partIndex, 1);

        // If the book becomes empty (no parts), you might want to remove the book
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

// const getAllHadithPaginated = async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;

//   try {
//     const currentPage = Math.max(parseInt(page, 10) || 1, 1);
//     const pageLimit = Math.max(parseInt(limit, 10) || 10, 1);

//     const cacheKey = `hadithsPage_${currentPage}_limit_${pageLimit}`;
//     const cachedHadiths = await getCache(cacheKey);

//     if (cachedHadiths) {
//       return res.status(200).json(cachedHadiths);
//     }

//     // Aggregation পাইপলাইন
//     const aggregationPipeline = [
//       { $unwind: "$hadithList" }, // প্রতিটি হাদিসকে আলাদা ডকুমেন্ট করা
//       {
//         $sort: {
//           bookName: 1,
//           partNumber: 1,
//           chapterNumber: 1,
//           "hadithList.hadithNumber": 1,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             bookName: "$bookName",
//             partNumber: "$partNumber",
//             chapterNumber: "$chapterNumber",
//           },
//           bookName: { $first: "$bookName" },
//           partNumber: { $first: "$partNumber" },
//           partName: { $first: "$partName" },
//           chapterNumber: { $first: "$chapterNumber" },
//           chapterName: { $first: "$chapterName" },
//           hadiths: { $push: "$hadithList" }, // আলাদা করা হাদিসগুলো সংগ্রহ
//           totalHadiths: { $sum: 1 }, // প্রতিটি গ্রুপের হাদিস কাউন্ট
//         },
//       },
//       { $sort: { bookName: 1, partNumber: 1, chapterNumber: 1 } },
//       {
//         $group: {
//           _id: {
//             bookName: "$bookName",
//             partNumber: "$partNumber",
//           },
//           bookName: { $first: "$bookName" },
//           partNumber: { $first: "$partNumber" },
//           partName: { $first: "$partName" },
//           chapters: {
//             $push: {
//               chapterNumber: "$chapterNumber",
//               chapterName: "$chapterName",
//               hadiths: "$hadiths",
//               totalChapterHadiths: "$totalHadiths",
//             },
//           },
//           totalPartHadiths: { $sum: "$totalHadiths" }, // পার্টের মোট হাদিস
//         },
//       },
//       { $sort: { bookName: 1, partNumber: 1 } },
//       {
//         $group: {
//           _id: "$bookName",
//           bookName: { $first: "$bookName" },
//           parts: {
//             $push: {
//               partNumber: "$partNumber",
//               partName: "$partName",
//               chapters: "$chapters",
//               totalPartHadiths: "$totalPartHadiths",
//             },
//           },
//           totalBookHadiths: { $sum: "$totalPartHadiths" }, // বইয়ের মোট হাদিস
//         },
//       },
//       { $sort: { bookName: 1 } },
//       { $skip: (currentPage - 1) * pageLimit },
//       { $limit: pageLimit },
//     ];

//     const [result] = await Hadith.aggregate(aggregationPipeline);

//     // অনুবাদিত হাদিস সংগ্রহ
//     const hadithOtherLanguage = await HadithOtherLanguage.find().lean();

//     // রেস্পন্স ফরম্যাটিং
//     const formattedResponse = {
//       bookName: result?.bookName || "",
//       totalBookHadiths: result?.totalBookHadiths || 0,
//       parts:
//         result?.parts?.map((part) => ({
//           partNumber: part.partNumber,
//           partName: part.partName,
//           totalPartHadiths: part.totalPartHadiths,
//           chapters: part.chapters.map((chapter) => ({
//             chapterNumber: chapter.chapterNumber,
//             chapterName: chapter.chapterName,
//             totalChapterHadiths: chapter.totalChapterHadiths,
//             hadithList: chapter.hadiths
//               .sort((a, b) => a.hadithNumber - b.hadithNumber)
//               .map((hadith) => ({
//                 ...hadith,
//                 hadithOtherLanguage: hadithOtherLanguage
//                   .filter(
//                     (hl) =>
//                       hl.bookName === result.bookName &&
//                       hl.partNumber === part.partNumber &&
//                       hl.chapterNumber === chapter.chapterNumber &&
//                       hl.hadithNumber === hadith.hadithNumber
//                   )
//                   .map(
//                     ({
//                       bookName,
//                       partNumber,
//                       chapterNumber,
//                       hadithNumber,
//                       ...rest
//                     }) => rest
//                   ),
//               })),
//           })),
//         })) || [],
//     };

//     const totalBooks = await Hadith.distinct("bookName").countDocuments();

//     const paginatedData = {
//       data: formattedResponse,
//       currentPage,
//       totalPages: Math.ceil(totalBooks / pageLimit),
//       totalBooks,
//       itemsPerPage: pageLimit,
//     };

//     // Cache 10 মিনিটের জন্য
//     setCache(cacheKey, paginatedData, 600);

//     res.status(200).json({
//       success: true,
//       message: "Hadiths fetched successfully",
//       paginatedData,
//     });
//   } catch (error) {
//     console.error("Error fetching hadiths:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching hadiths",
//     });
//   }
// };

const getAllHadithPaginated = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.max(parseInt(limit, 10) || 10, 1);

    // Create cache key based on pagination parameters
    const cacheKey = `hadithsPage_${currentPage}_limit_${pageLimit}`;
    const cachedHadiths = await getCache(cacheKey);

    // Return cached data if available
    if (cachedHadiths) {
      return res.status(200).json(cachedHadiths);
    }

    // Aggregation pipeline for sorting and pagination
    const aggregationPipeline = [
      // Sort by bookName, partNumber, chapterNumber, and hadithNumber
      {
        $sort: {
          bookName: 1,
          "parts.partNumber": 1,
        },
      },
      // Skip and limit for pagination
      { $skip: (currentPage - 1) * pageLimit },
      { $limit: pageLimit },
    ];

    // Execute aggregation
    const hadiths = await Hadith.aggregate(aggregationPipeline);

    // Count total documents for pagination
    const totalHadiths = await Hadith.countDocuments();

    // Get all hadith translations in other languages
    const hadithOtherLanguage = await HadithOtherLanguage.find().lean();

    // Format the response with serialized data
    const formattedHadiths = hadiths.map((hadith) => {
      return {
        bookName: hadith.bookName,
        parts: hadith.parts
          // Sort parts by partNumber
          .sort((a, b) => a.partNumber - b.partNumber)
          .map((part) => {
            return {
              partName: part.partName,
              partNumber: part.partNumber,
              chapters: part.chapters
                // Sort chapters by chapterNumber
                .sort((a, b) => a.chapterNumber - b.chapterNumber)
                .map((chapter) => {
                  return {
                    chapterName: chapter.chapterName,
                    chapterNumber: chapter.chapterNumber,
                    hadithList: chapter.hadithList
                      // Sort hadiths by hadithNumber
                      .sort((a, b) => a.hadithNumber - b.hadithNumber)
                      .map((h) => {
                        // Find corresponding translations in other languages
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

                        // Return the hadith with other language translations
                        return {
                          ...h,
                          hadithOtherLanguage: otherLanguages,
                        };
                      }),
                  };
                }),
            };
          }),
        _id: hadith._id,
        createdAt: hadith.createdAt,
        updatedAt: hadith.updatedAt,
        __v: hadith.__v,
      };
    });

    // Create pagination data
    const paginatedData = {
      data: formattedHadiths,
      currentPage,
      totalPages: Math.ceil(totalHadiths / pageLimit),
      totalItems: totalHadiths,
      itemsPerPage: pageLimit,
    };

    // Cache the response for 10 minutes (600 seconds)
    setCache(cacheKey, paginatedData, 600);

    // Send the formatted response
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

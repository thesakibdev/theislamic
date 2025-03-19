const ResponseHandler = require("../../helper/ResponseHandler");
const Hadith = require("../../models/hadith.model");

const search = async (req, res) => {
  const {
    bookName,
    partNumber,
    chapterNumber,
    hadithNumber,
    note,
    keywords,
    ...rest
  } = filters;

  try {
    const searchQuery = {
      $text: { $search: query },
      ...rest,
      // $or: [
      //   { bookName: { $regex: query, $options: 'i' } },
      //   { partNumber: { $regex: query, $options: 'i' } },
      //   { chapterNumber: { $regex: query, $options: 'i' } },
      //   { hadithNumber: { $regex: query, $options: 'i' } },
      //   { note: { $regex: query, $options: 'i' } },
      //   { keywords: { $regex: query, $options: 'i' } },
      //   { hadithText: { $regex: query, $options: 'i' } },
      // ]
    };

    if (bookName) {
      searchQuery["bookName"] = { $regex: bookName, $options: "i" };
    }
    if (partNumber) {
      searchQuery["bookName"] = { $regex: bookName, $options: "i" };
    }
    if (chapterNumber) {
      searchQuery["chapterNumber) "] = { $regex: chapterNumber, $options: "i" };
    }
    if (hadithNumber) {
      searchQuery["hadithNumber"] = { $regex: hadithNumber, $options: "i" };
    }
    if (note) {
      searchQuery["note"] = { $regex: note, $options: "i" };
    }
    if (keywords) {
      searchQuery["keywords"] = { $regex: keywords, $options: "i" };
    }

    const hadithResult = await Hadith.find(searchQuery);

    return ResponseHandler.success(res, {
      success: true,
      message: "Search successful",
      data: hadithResult,
    });
  } catch (error) {
    console.error("Search error:", error);
    return ResponseHandler.error(res, {
      success: false,
      message: "Search error",
      error: error.message,
    });
  }
};

module.exports = { search };

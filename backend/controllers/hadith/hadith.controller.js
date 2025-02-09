const Hadith = require("../../models/hadith.model");

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
    // Data normalization
    const normalizedHadithName = bookName.trim();
    const normalizedPartName = partName.trim();
    const normalizedPartNumber = Number(partNumber);
    const normalizedChapterName = chapterName.trim();
    const normalizedChapterNumber = Number(chapterNumber);

    // Data validation
    if (!normalizedHadithName) {
      return res.status(400).json({
        error: true,
        message: "Invalid bookName.",
      });
    }
    if (!normalizedPartName) {
      return res.status(400).json({
        error: true,
        message: "Invalid partName.",
      });
    }
    if (!normalizedPartNumber || isNaN(normalizedPartNumber)) {
      return res.status(400).json({
        error: true,
        message: "Invalid partNumber.",
      });
    }
    if (!normalizedChapterName) {
      return res.status(400).json({
        error: true,
        message: "Invalid chapterName.",
      });
    }
    if (!normalizedChapterNumber || isNaN(normalizedChapterNumber)) {
      return res.status(400).json({
        error: true,
        message: "Invalid chapterNumber.",
      });
    }
    if (!hadithList || !hadithList.hadithNumber || !hadithList.hadithArabic) {
      return res.status(400).json({
        error: true,
        message:
          "Invalid hadithList. Ensure hadithNumber and hadithArabic are provided.",
      });
    }

    // Check if the hadith already exists
    let hadith = await Hadith.findOne({
      bookName: normalizedHadithName,
      partName: normalizedPartName,
      partNumber: normalizedPartNumber,
      chapterName: normalizedChapterName,
      chapterNumber: normalizedChapterNumber,
    });

    if (hadith) {
      // Check if the hadith number already exists in the hadithList
      const existingHadith = hadith.hadithList.find(
        (h) => h.hadithNumber === hadithList.hadithNumber
      );

      if (existingHadith) {
        return res.status(400).json({
          error: true,
          message: "Hadith already exists.",
        });
      }

      // Add the new hadith to the existing hadithList
      hadith.hadithList.push(hadithList);
      await hadith.save();

      return res.status(200).json({
        success: true,
        message: "Hadith added successfully to existing document.",
        hadith,
      });
    } else {
      // Create a new hadith document
      const newHadith = new Hadith({
        bookName: normalizedHadithName,
        partName: normalizedPartName,
        partNumber: normalizedPartNumber,
        chapterName: normalizedChapterName,
        chapterNumber: normalizedChapterNumber,
        hadithList: [hadithList],
      });

      await newHadith.save();

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

module.exports = { addHadith, editHadith, deleteHadith };

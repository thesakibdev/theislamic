const Hadith = require("../../models/hadith.model");

const addHadith = async (req, res) => {
  const {
    bookName,
    partName,
    partNumber,
    chapterName,
    chapterNumber,
    hadithNumber,
    internationalNumber,
    narrator,
    hadithArabic,
    referenceBook,
    note,
  } = req.body;
  try {
    const savedHadith = await Hadith.save();
    res.status(200).json(savedHadith);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { addHadith };


// bookName = []
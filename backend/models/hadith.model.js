const mongoose = require("mongoose");

const hadithSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  partName: { type: String, required: true },
  partNumber: { type: Number, required: true },
  chapterName: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  hadithNumber: { type: Number, required: true },
  internationalNumber: { type: Number, required: true },
  narrator: { type: String, required: true },
  hadithArabic: { type: String, required: true },
  referenceBook: { type: String, required: true },
  note: { type: String, required: true },
});

module.exports = mongoose.model("Hadith", hadithSchema);

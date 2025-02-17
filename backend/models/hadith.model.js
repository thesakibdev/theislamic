const mongoose = require("mongoose");

const hadithListSchema = new mongoose.Schema({
  hadithNumber: { type: Number, required: true },
  internationalNumber: { type: Number, required: true },
  narrator: { type: String, required: true },
  hadithArabic: { type: String, required: true },
  referenceBook: { type: String, required: true },
  similarities: { type: String },
  translation: { type: String },
  transliteration: { type: String },
  note: { type: String },
});

const hadithSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  partName: { type: String, required: true },
  partNumber: { type: Number, required: true },
  chapterName: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  hadithList: [hadithListSchema],
});

// Create compound unique index on bookName + partNumber + chapterNumber
hadithSchema.index(
  { bookName: 1, partNumber: 1, chapterNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Hadith", hadithSchema);

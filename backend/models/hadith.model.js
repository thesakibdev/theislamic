const mongoose = require("mongoose");

const hadithListSchema = new mongoose.Schema({
  hadithNumber: { type: Number, required: true, unique: true },
  internationalNumber: { type: Number, required: true, unique: true },
  narrator: { type: String, required: true },
  hadithArabic: { type: String, required: true },
  referenceBook: { type: String, required: true },
  note: { type: String },
});

const hadithSchema = new mongoose.Schema({
  bookName: { type: String, required: true, unique: true },
  partName: { type: String, required: true},
  partNumber: { type: Number, required: true },
  chapterName: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  hadithList: [hadithListSchema],
});

module.exports = mongoose.model("Hadith", hadithSchema);

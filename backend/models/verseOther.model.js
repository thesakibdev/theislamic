const mongoose = require("mongoose");

const verseOtherSchema = new mongoose.Schema({
  surahNumber: {
    type: Number,
    required: true,
  },
  verseNumber: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  transliteration: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  keywords: {
    type: [String],
    default: [],
  },
});

verseOtherSchema.index(
  { surahNumber: 1, verseNumber: 1, language: 1 },
  { unique: true }
);

const verseOtherData = mongoose.model("VerseOtherData", verseOtherSchema);

module.exports = verseOtherData;

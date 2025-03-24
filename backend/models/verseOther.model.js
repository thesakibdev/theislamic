const mongoose = require("mongoose");

const verseOtherSchema = new mongoose.Schema({
  surahNumber: { type: Number, required: true },
  language: { type: String, required: true },
  verses: [
    {
      verseNumber: { type: Number, required: true },
      translation: { type: String },
      transliteration: { type: String },
      note: { type: String },
      keywords: { type: [String], default: [] },
    },
  ],
});

verseOtherSchema.index({ surahNumber: 1, language: 1 }, { unique: true });

// Full-Text Search Index
verseOtherSchema.index({
  surahName: "text",
  "verses.text": "text",
  "verses.translation": "text",
  "verses.transliteration": "text",
  "verses.note": "text",
  "verses.keywords": "text",
});

const verseOtherData = mongoose.model("VerseOtherData", verseOtherSchema);

module.exports = verseOtherData;

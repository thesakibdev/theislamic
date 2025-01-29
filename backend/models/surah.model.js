const mongoose = require("mongoose");

// Verse Schema
const VerseSchema = new mongoose.Schema({
  verseNumber: { type: Number, required: true },
  arabicText: { type: String, required: true },
  translations: [
    {
      type: Object,
      default: {},
    },
  ],
  transliteration: [
    {
      type: Object,
      default: {},
    },
  ],
  keywords: { type: [String], default: [] },
  globalVerseNumber: { type: Number, required: false, default: 0 },
});

// Surah Schema
const SurahSchema = new mongoose.Schema({
  surahNumber: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  juzNumber: { type: [Number], required: true },
  verses: [VerseSchema],
});

SurahSchema.index({ surahNumber: 1, name: 1 }, { unique: true });

const Surah = mongoose.model("Surah", SurahSchema);
module.exports = Surah;

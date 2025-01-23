const mongoose = require("mongoose");

// Verse Schema
const VerseSchema = new mongoose.Schema({
  verseNumber: { type: Number, required: true },
  arabicText: { type: String, required: true },
  translations: [
    {
      ban: { type: String },
      eng: { type: String },
    },
  ],
  transliteration: [
    {
      eng: { type: String },
      ban: { type: String },
    },
  ],
  keywords: { type: [String], default: [] },
});

// Surah Schema
const SurahSchema = new mongoose.Schema({
  surahNumber: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  juzNumber: { type: [Number], required: true }, // Reference to the Juz
  verses: [VerseSchema], // Array of verses
});

const Surah = mongoose.model("Surah", SurahSchema);

module.exports = Surah;

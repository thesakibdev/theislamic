const mongoose = require("mongoose");


// Verse Schema
const verseSchema = new mongoose.Schema({
  verseNumber: {
    type: Number,
    required: true,
  },
  arabicAyah: {
    type: String,
    required: true,
  },
  totalVerseNumber: {
    type: Number,
    required: true,
  },
});

// Surah Schema
const SurahSchema = new mongoose.Schema({
  surahNumber: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  juzNumber: { type: [Number], required: true },
  verses: [verseSchema],
});

SurahSchema.index({ surahNumber: 1, name: 1 }, { unique: true });

const Surah = mongoose.model("Surah", SurahSchema);

module.exports = Surah;

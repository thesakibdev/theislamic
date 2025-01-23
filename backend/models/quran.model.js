const mongoose = require("mongoose");

// Verse Schema
const verseSchema = new mongoose.Schema({
  verseNumber: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value > 0 && value <= 6236;
      },
      message: "Verse number must be between 1 and 6236",
    },
  },
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
});

// Surah Schema
const surahSchema = new mongoose.Schema({
  surahNumber: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value > 0 && value <= 114;
      },
      message: "Surah number must be between 1 and 114",
    },
  },
  surahName: { type: String, required: true },
  surahNameTranslated: {
    type: Map,
    of: String,
  },
  verses: [verseSchema],
});

// Chapter Schema
const chapterSchema = new mongoose.Schema({
  chapterNumber: { type: Number, required: true },
  surahs: [surahSchema],
});

// Main Book Schema
const bookSchema = new mongoose.Schema({
  bookName: { type: String, default: "The Quran" },
  chapters: {
    type: [chapterSchema],
    validate: {
      validator: function (value) {
        return value.length <= 30;
      },
      message: "Maximum 30 chapters allowed",
    },
  },
});

// Add compound indexes for unique combinations
bookSchema.index({ "chapters.chapterNumber": 1 });
bookSchema.index({ "chapters.surahs.surahNumber": 1 });
bookSchema.index({ "chapters.surahs.verses.verseNumber": 1 });

const Quran = mongoose.model("Quran", bookSchema);

module.exports = Quran;

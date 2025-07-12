const mongoose = require("mongoose");

const searchIndexSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["hadith", "tafsir", "verseOther", "surah"],
    required: true,
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  bookName: String,
  name: String,
  surahNumber: Number,
  verseNumber: Number,
  totalVerseNumber: Number,
  translation: String,
  content: String,
  note: String,
  keywords: [String],
  arabicAyah: String,
});

// Text index for search functionality
searchIndexSchema.index({
  bookName: "text",
  name: "text",
  translation: "text",
  content: "text",
  note: "text",
  keywords: "text",
  arabicAyah: "text",
});

// Compound index to prevent duplicates
searchIndexSchema.index({ type: 1, refId: 1 }, { unique: true });

const SearchIndex = mongoose.model("SearchIndex", searchIndexSchema);
module.exports = SearchIndex;
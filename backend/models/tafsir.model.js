const mongoose = require("mongoose");

const tafsirDataSchema = new mongoose.Schema({
  surahInfo: {
    _id: mongoose.Schema.Types.ObjectId,
    surahNumber: Number,
  },
  totalVerseNumber: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
});

// tafsir model
const tafsirSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
    },
    bookName: {
      type: String,
      required: true,
    },
    tafsirData: [tafsirDataSchema],
  },
  {
    timestamps: true,
  }
);

// Full-text search index তৈরি করা আলাদাভাবে handle করতে হবে
tafsirSchema.index(
  {
    language: "text",
    bookName: "text",
    content: "text",
    note: "text",
  },
  {
    default_language: "none",
    language_override: "none",
    name: "tafsir_text_search",
  }
);

// Unique index (একই বই, ভাষা, ও সূরার জন্য একই Tafsir না থাকার নিশ্চয়তা দেয়)
tafsirSchema.index(
  { language: 1, bookName: 1, surah: 1, totalVerseNumber: 1 },
  { unique: true }
);

const Tafsir = mongoose.model("Tafsir", tafsirSchema);

module.exports = Tafsir;

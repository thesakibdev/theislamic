const mongoose = require("mongoose");

// tafsir.model.js
const tafsirDataSchema = new mongoose.Schema({
  totalVerseNumber: {
    type: Number,
    required: true,
  },
  mainContent: {
    type: String,
    required: true,
  },
  OtherLanguageContent: {
    type: String,
    required: true,
  },
  note: String,
});

const tafsirSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    bookName: { type: String, required: true },
    tafsirData: [tafsirDataSchema],
  },
  { timestamps: true }
);

// Create a compound index on language and bookName
tafsirSchema.index(
  { language: 1, bookName: 1, "tafsirData.totalVerseNumber": 1 },
  { unique: true }
);

const Tafsir = mongoose.model("Tafsir", tafsirSchema);
module.exports = Tafsir;

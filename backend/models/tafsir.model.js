const mongoose = require("mongoose");

// tafsir.model.js
const tafsirDataSchema = new mongoose.Schema({
  surahNumber: {
    type: Number,
    required: true,
  },
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

const Tafsir = mongoose.model("Tafsir", tafsirSchema);
module.exports = Tafsir;

const mongoose = require("mongoose");

// tafsir model
const tafsirSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  surahName: {
    type: String,
    required: true,
  },
  totalVerseNumber: {
    type: Number,
    required: true,
  },
  arabicAyah: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

const Tafsir = mongoose.model("Tafsir", tafsirSchema);

module.exports = Tafsir;

const mongoose = require("mongoose");

const hadithSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: [true, "Book name is required"],
      trim: true,
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
    },
    parts: [
      {
        partName: { type: String, required: true, trim: true },
        partNumber: { type: Number, required: true },
        chapters: [
          {
            chapterName: { type: String, trim: true },
            chapterNumber: { type: Number, required: true },
            hadithList: [
              {
                hadithNumber: { type: Number, required: true },
                internationalNumber: Number,
                narrator: { type: String, trim: true },
                hadithArabic: { type: String, trim: true, required: true },
                translation: { type: String, trim: true },
                transliteration: { type: String, trim: true },
                referenceBook: { type: String, trim: true },
                similarities: { type: String, trim: true },
                quranic: { type: String, trim: true },
                note: { type: String, trim: true },
                keywords: { type: [String], default: [] },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    indexes: [
      {
        // কম্পাউন্ড ইউনিক ইনডেক্স
        fields: { bookName: 1, language: 1 },
        unique: true,
        name: "unique_book_language",
      },
      {
        // টেক্সট সার্চ ইনডেক্স (সংশোধিত)
        fields: {
          bookName: "text",
          "parts.chapters.hadithList.translation": "text",
          "parts.chapters.hadithList.hadithArabic": "text",
          "parts.chapters.hadithList.keywords": "text",
        },
        options: {
          default_language: "none",
          language_override: "none",
          name: "hadith_text_search",
        },
      },
    ],
  }
);

// Custom Validation for Unique Part Numbers
hadithSchema.path("parts").validate(function (parts) {
  const partNumbers = new Set();
  for (const part of parts) {
    if (partNumbers.has(part.partNumber)) return false;
    partNumbers.add(part.partNumber);
  }
  return true;
}, "Duplicate part number in the same book");

// Custom Validation for Unique Chapter Numbers within a Part
hadithSchema
  .path("parts")
  .schema.path("chapters")
  .validate(function (chapters) {
    const chapterNumbers = new Set();
    for (const chapter of chapters) {
      if (chapterNumbers.has(chapter.chapterNumber)) return false;
      chapterNumbers.add(chapter.chapterNumber);
    }
    return true;
  }, "Duplicate chapter number in the same part");

// Custom Validation for Unique Hadith Numbers within a Chapter
hadithSchema
  .path("parts")
  .schema.path("chapters")
  .schema.path("hadithList")
  .validate(function (hadithList) {
    const hadithNumbers = new Set();
    for (const hadith of hadithList) {
      if (hadithNumbers.has(hadith.hadithNumber)) return false;
      hadithNumbers.add(hadith.hadithNumber);
    }
    return true;
  }, "Duplicate hadith number in the same chapter");

// Enhanced text search index
// hadithSchema.index({
//   bookName: "text",
//   "parts.chapters.hadithList.internationalNumber": "text",
//   "parts.chapters.hadithList.note": "text",
//   "parts.chapters.hadithList.keywords": "text",
//   "parts.chapters.hadithList.translation": "text",
//   "parts.chapters.hadithList.transliteration": "text",
//   "parts.chapters.hadithList.hadithArabic": "text",
// });

const Hadith = mongoose.model("Hadith", hadithSchema);

module.exports = Hadith;

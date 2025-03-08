const mongoose = require("mongoose");

const hadithSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: [true, "Book name is required"],
      trim: true,
    },
    parts: [
      {
        partName: {
          type: String,
          required: [true, "Part name is required"],
          trim: true,
        },
        partNumber: {
          type: Number,
          required: [true, "Part number is required"],
        },
        chapters: [
          {
            chapterName: {
              type: String,
              trim: true,
            },
            chapterNumber: {
              type: Number,
              required: [true, "Chapter number is required"],
            },
            hadithList: [
              {
                hadithNumber: {
                  type: Number,
                  required: [true, "Hadith number is required"],
                },
                internationalNumber: {
                  type: Number,
                },
                narrator: {
                  type: String,
                  trim: true,
                },
                hadithArabic: {
                  type: String,
                  trim: true,
                  required: true,
                },
                hadithBangla: {
                  type: String,
                  trim: true,
                },
                hadithEnglish: {
                  type: String,
                  trim: true,
                },
                hadithHindi: {
                  type: String,
                  trim: true,
                },
                hadithIndonesia: {
                  type: String,
                  trim: true,
                },
                hadithUrdu: {
                  type: String,
                  trim: true,
                },
                referenceBook: {
                  type: String,
                  trim: true,
                },
                similarities: {
                  type: String,
                  trim: true,
                },
                translation: {
                  type: String,
                  trim: true,
                },
                transliteration: {
                  type: String,
                  trim: true,
                },
                note: {
                  type: String,
                  trim: true,
                },
                keywords: {
                  type: [String],
                  default: [],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Custom validation to ensure unique part numbers within each book
hadithSchema.path("parts").validate(function (parts) {
  if (!parts || !Array.isArray(parts)) {
    return true;
  }

  const partNumbers = new Set();
  for (const part of parts) {
    if (part.partNumber === undefined) {
      return false; // Invalid if partNumber is undefined
    }
    if (partNumbers.has(part.partNumber)) {
      return false; // Duplicate found
    }
    partNumbers.add(part.partNumber);
  }
  return true;
}, "Part numbers must be unique within each book");

// Custom validation to ensure unique chapter numbers within each part
hadithSchema.path("parts").validate(function (parts) {
  for (const part of parts) {
    if (!part.chapters || !Array.isArray(part.chapters)) {
      continue;
    }

    const chapterNumbers = new Set();
    for (const chapter of part.chapters) {
      if (chapter.chapterNumber === undefined) {
        return false; // Invalid if chapterNumber is undefined
      }
      if (chapterNumbers.has(chapter.chapterNumber)) {
        return false; // Duplicate found
      }
      chapterNumbers.add(chapter.chapterNumber);
    }
  }
  return true;
}, "Chapter numbers must be unique within each part");

// Custom validation to ensure unique hadith numbers within each chapter
hadithSchema.path("parts").validate(function (parts) {
  for (const part of parts) {
    if (!part.chapters || !Array.isArray(part.chapters)) {
      continue;
    }

    for (const chapter of part.chapters) {
      if (!chapter.hadithList || !Array.isArray(chapter.hadithList)) {
        continue;
      }

      const hadithNumbers = new Set();
      for (const hadith of chapter.hadithList) {
        if (hadith.hadithNumber === undefined) {
          return false; // Invalid if hadithNumber is undefined
        }
        if (hadithNumbers.has(hadith.hadithNumber)) {
          return false; // Duplicate found
        }
        hadithNumbers.add(hadith.hadithNumber);
      }
    }
  }
  return true;
}, "Hadith numbers must be unique within each chapter");

// Pre-save middleware to check for duplicate hadiths across the entire collection
hadithSchema.pre("save", async function (next) {
  try {
    const Hadith = mongoose.model("Hadith");

    // For new documents, check if there are any documents with the same bookName
    if (this.isNew) {
      const existingBook = await Hadith.findOne({ bookName: this.bookName });
      if (existingBook && existingBook._id.toString() !== this._id.toString()) {
        throw new Error(`Book with name "${this.bookName}" already exists`);
      }
    }

    // For each part, chapter, and hadith, check for duplicates
    for (const part of this.parts) {
      for (const chapter of part.chapters) {
        for (const hadith of chapter.hadithList) {
          // Check if there's already a hadith with the same combination of
          // bookName, partNumber, chapterNumber, and hadithNumber
          const exists = await Hadith.findOne({
            bookName: this.bookName,
            "parts.partNumber": part.partNumber,
            "parts.chapters.chapterNumber": chapter.chapterNumber,
            "parts.chapters.hadithList.hadithNumber": hadith.hadithNumber,
          });

          if (exists && exists._id.toString() !== this._id.toString()) {
            throw new Error(
              `Duplicate hadith found: bookName=${this.bookName}, partNumber=${part.partNumber}, chapterNumber=${chapter.chapterNumber}, hadithNumber=${hadith.hadithNumber}`
            );
          }
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Hadith = mongoose.model("Hadith", hadithSchema);

module.exports = Hadith;

const SearchIndex = require("../../models/search.model");
const Hadith = require("../../models/hadith.model");
const Tafsir = require("../../models/tafsir.model");
const VerseOtherData = require("../../models/verseOther.model");
const Surah = require("../../models/surah.model");

async function syncHadithToIndex() {
  // Clear existing hadith data
  await SearchIndex.deleteMany({ type: "hadith" });
  
  const allHadith = await Hadith.find();
  const searchDocs = [];

  for (const doc of allHadith) {
    for (const part of doc.parts || []) {
      for (const chapter of part.chapters || []) {
        for (const hadith of chapter.hadithList || []) {
          searchDocs.push({
            type: "hadith",
            refId: doc._id,
            bookName: doc.bookName || "",
            translation: hadith.translation || "",
            content: hadith.hadithArabic || "",
            note: hadith.note || "",
            keywords: hadith.keywords || [],
            arabicAyah: "",
            surahNumber: null,
            verseNumber: null,
            totalVerseNumber: null,
            name: ""
          });
        }
      }
    }
  }

  if (searchDocs.length > 0) {
    await SearchIndex.insertMany(searchDocs);
  }
  console.log("✅ Hadith data synced to SearchIndex.");
}

async function syncTafsirToIndex() {
  // Clear existing tafsir data
  await SearchIndex.deleteMany({ type: "tafsir" });
  
  const allTafsir = await Tafsir.find();
  const searchDocs = [];

  for (const doc of allTafsir) {
    for (const tafsir of doc.tafseer || []) {
      searchDocs.push({
        type: "tafsir",
        refId: doc._id,
        bookName: tafsir.bookName || "",
        translation: "",
        content: tafsir.content || "",
        note: tafsir.note || "",
        keywords: [],
        arabicAyah: tafsir.arabicAyah || "",
        surahNumber: null,
        verseNumber: null,
        totalVerseNumber: null,
        name: ""
      });
    }
  }

  if (searchDocs.length > 0) {
    await SearchIndex.insertMany(searchDocs);
  }
  console.log("✅ Tafsir data synced to SearchIndex.");
}

async function syncVerseOtherToIndex() {
  // Clear existing verseOther data
  await SearchIndex.deleteMany({ type: "verseOther" });
  
  const allVerseDocs = await VerseOtherData.find();
  const searchDocs = [];

  for (const doc of allVerseDocs) {
    for (const verse of doc.verses || []) {
      searchDocs.push({
        type: "verseOther",
        refId: doc._id,
        bookName: "",
        translation: verse.translation || "",
        content: "",
        note: verse.note || "",
        keywords: verse.keywords || [],
        arabicAyah: "",
        surahNumber: null,
        verseNumber: null,
        totalVerseNumber: null,
        name: ""
      });
    }
  }

  if (searchDocs.length > 0) {
    await SearchIndex.insertMany(searchDocs);
  }
  console.log("✅ VerseOtherData synced to SearchIndex.");
}

async function syncSurahToIndex() {
  // Clear existing surah data
  await SearchIndex.deleteMany({ type: "surah" });
  
  const allSurah = await Surah.find();
  const searchDocs = [];

  for (const doc of allSurah) {
    searchDocs.push({
      type: "surah",
      refId: doc._id,
      name: doc.name || "",
      surahNumber: doc.surahNumber || null,
      verses: doc.verses || [],
      bookName: "",
      translation: "",
      content: "",
      note: "",
      keywords: [],
      arabicAyah: "",
      verseNumber: null,
      totalVerseNumber: null
    });
  }

  if (searchDocs.length > 0) {
    await SearchIndex.insertMany(searchDocs);
  }
  console.log("✅ Surah data synced to SearchIndex.");
}

// Search Handler
const searchHandler = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "No query provided" });
    }

    const regex = new RegExp(q, "i");
    
    // Check if query is a number
    const isNumber = !isNaN(q) && !isNaN(parseFloat(q));
    const numberValue = isNumber ? parseInt(q) : null;

    // Build search conditions
    const searchConditions = [
      { bookName: regex },
      { name: regex },
      { note: regex },
      { keywords: regex },
      { translation: regex },
      { content: regex },
      { arabicAyah: regex }
    ];

    // Add number-based searches only if query is a number
    if (isNumber) {
      searchConditions.push(
        { surahNumber: numberValue },
        { verseNumber: numberValue },
        { totalVerseNumber: numberValue }
      );
    }

    const results = await SearchIndex.find({
      $or: searchConditions
    }).limit(50);

    res.json({ 
      success: true, 
      count: results.length, 
      results,
      query: q,
      isNumber: isNumber
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  syncHadithToIndex,
  syncTafsirToIndex,
  syncVerseOtherToIndex,
  syncSurahToIndex,
  searchHandler,
};

const mongoose = require("mongoose");
const Surah = require("./models/surah.model"); // আপনার Surah মডেলের পাথ

const migrateData = async () => {
  try {
    // MongoDB-তে কানেক্ট করুন
    await mongoose.connect(
      "mongodb+srv://mahbub:mahbub@theislamicdb.2g6v7.mongodb.net/theislamicdb?retryWrites=true&w=majority&appName=theislamicdb",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // সব সূরা ফেচ করুন
    const allSurahs = await Surah.find({});

    for (const surah of allSurahs) {
      // ডাটা নর্মালাইজেশন
      const normalizedSurahNumber = parseInt(surah.surahNumber, 10);
      const normalizedName = surah.name.trim();
      const normalizedJuzNumber = surah.juzNumber.map(Number);

      // ডাটা আপডেট করুন
      surah.surahNumber = normalizedSurahNumber;
      surah.name = normalizedName;
      surah.juzNumber = normalizedJuzNumber;

      // সেভ করুন
      await surah.save();
      console.log(`সূরা ${surah.surahNumber} আপডেট হয়েছে!`);
    }

    console.log("মাইগ্রেশন সম্পূর্ণ হয়েছে!");
    process.exit(0);
  } catch (err) {
    console.error("মাইগ্রেশন ফেইলড:", err);
    process.exit(1);
  }
};

migrateData();

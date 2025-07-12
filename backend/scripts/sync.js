const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../lib/db");
dotenv.config();

const {
  syncHadithToIndex,
  syncTafsirToIndex,
  syncVerseOtherToIndex,
  syncSurahToIndex,
} = require("../controllers/search/search.controller");

// Disconnect database function
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    return true;
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error.message);
    return false;
  }
};

// Main sync function
const syncAllData = async () => {
  try {
    console.log("🔄 Starting data sync...");
    
    await syncHadithToIndex();
    await syncTafsirToIndex();
    await syncVerseOtherToIndex();
    await syncSurahToIndex();
    
    console.log("🎉 All data synced to SearchIndex successfully!");
    return { success: true, message: "All data synced successfully" };
  } catch (error) {
    console.error("❌ Error during sync:", error.message);
    console.error("Stack trace:", error.stack);
    return { success: false, error: error.message };
  }
};

// Individual sync functions
const syncHadith = async () => {
  try {
    await syncHadithToIndex();
    return { success: true, message: "Hadith data synced successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const syncTafsir = async () => {
  try {
    await syncTafsirToIndex();
    return { success: true, message: "Tafsir data synced successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const syncVerseOther = async () => {
  try {
    await syncVerseOtherToIndex();
    return { success: true, message: "VerseOther data synced successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const syncSurah = async () => {
  try {
    await syncSurahToIndex();
    return { success: true, message: "Surah data synced successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Complete sync process with connection management
const runCompleteSync = async () => {
  try {
    await connectDB();
    const result = await syncAllData();
    await disconnectDB();
    return result;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return { success: false, error: "Database connection failed" };
  }
};

runCompleteSync();

// Export all functions
module.exports = {
  connectDB,
  disconnectDB,
  syncAllData,
  syncHadith,
  syncTafsir,
  syncVerseOther,
  syncSurah,
  runCompleteSync
};

// If this file is run directly (not imported), execute the complete sync
if (require.main === module) {
  runCompleteSync().then((result) => {
    if (result.success) {
      console.log("✅ Sync completed successfully");
      process.exit(0);
    } else {
      console.error("❌ Sync failed:", result.error);
      process.exit(1);
    }
  });
}


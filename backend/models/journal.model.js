const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Journal entry date is required"],
      default: Date.now,
    },
    referenceNumber: {
      type: String,
      required: [true, "Reference number is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Journal entry description is required"],
      trim: true,
    },
    entries: [
      {
        accountName: {
          type: String,
          required: [true, "Account name is required"],
          trim: true,
        },
        accountType: {
          type: String,
          required: [true, "Account type is required"],
          enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"],
        },
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        debit: {
          type: Number,
          default: 0,
        },
        credit: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalDebit: {
      type: Number,
      required: [true, "Total debit is required"],
    },
    totalCredit: {
      type: Number,
      required: [true, "Total credit is required"],
    },
    // Additional metadata
    category: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    isPosted: {
      type: Boolean,
      default: false,
    },
    postedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
journalEntrySchema.index({ date: -1 });
journalEntrySchema.index({ "entries.accountName": 1 });

// Pre-save middleware to generate reference number
journalEntrySchema.pre("save", function (next) {
  if (!this.referenceNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    this.referenceNumber = `JE-${timestamp}-${random}`;
  }
  next();
});

// Pre-save middleware to calculate totals
journalEntrySchema.pre("save", function (next) {
  this.totalDebit = this.entries.reduce((sum, entry) => sum + entry.debit, 0);
  this.totalCredit = this.entries.reduce((sum, entry) => sum + entry.credit, 0);
  next();
});

// Static method to get journal entries by date range
journalEntrySchema.statics.getByDateRange = function (startDate, endDate, limit = 100) {
  const query = {};
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  
  return this.find(query)
    .sort({ date: -1, createdAt: -1 })
    .limit(limit)
    .populate("entries.accountId", "name type balance");
};

// Static method to get journal entries by account
journalEntrySchema.statics.getByAccount = function (accountName, startDate, endDate) {
  const query = {
    "entries.accountName": accountName,
  };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  
  return this.find(query)
    .sort({ date: -1 })
    .populate("entries.accountId", "name type balance");
};

// Static method to get trial balance
journalEntrySchema.statics.getTrialBalance = function (asOfDate = new Date()) {
  return this.aggregate([
    {
      $match: {
        date: { $lte: new Date(asOfDate) },
        isPosted: true,
      },
    },
    {
      $unwind: "$entries",
    },
    {
      $group: {
        _id: {
          accountName: "$entries.accountName",
          accountType: "$entries.accountType",
        },
        totalDebit: { $sum: "$entries.debit" },
        totalCredit: { $sum: "$entries.credit" },
      },
    },
    {
      $project: {
        accountName: "$_id.accountName",
        accountType: "$_id.accountType",
        debitTotal: "$totalDebit",
        creditTotal: "$totalCredit",
        balance: { $subtract: ["$totalDebit", "$totalCredit"] },
      },
    },
    {
      $sort: { accountType: 1, accountName: 1 },
    },
  ]);
};

module.exports = mongoose.model("JournalEntry", journalEntrySchema); 
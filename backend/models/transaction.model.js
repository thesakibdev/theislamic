const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, "Transaction description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
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
    transactionType: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: ["increase", "decrease"],
    },
    // Automatically determined fields
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    // Reference to the account
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    // For double-entry bookkeeping
    contraAccountName: {
      type: String,
      trim: true,
    },
    contraAccountType: {
      type: String,
      enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"],
    },
    contraAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    contraDebit: {
      type: Number,
      default: 0,
    },
    contraCredit: {
      type: Number,
      default: 0,
    },
    // Transaction reference number
    referenceNumber: {
      type: String,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ accountName: 1, date: -1 });
transactionSchema.index({ accountType: 1 });
transactionSchema.index({ referenceNumber: 1 });

// Pre-save middleware to generate reference number
transactionSchema.pre("save", function (next) {
  if (!this.referenceNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    this.referenceNumber = `TXN-${timestamp}-${random}`;
  }
  next();
});

// Pre-save middleware to determine debit/credit based on accounting rules
transactionSchema.pre("save", function (next) {
  // Determine if this is a debit or credit based on account type and transaction type
  const isDebit = this.determineDebitCredit();
  
  if (isDebit) {
    this.debit = this.amount;
    this.credit = 0;
  } else {
    this.debit = 0;
    this.credit = this.amount;
  }
  
  next();
});

// Method to determine debit/credit based on accounting rules
transactionSchema.methods.determineDebitCredit = function () {
  const { accountType, transactionType } = this;
  
  // Asset/Expense: increase = debit, decrease = credit
  if (accountType === "Asset" || accountType === "Expense") {
    return transactionType === "increase";
  }
  
  // Liability/Equity/Revenue: increase = credit, decrease = debit
  if (accountType === "Liability" || accountType === "Equity" || accountType === "Revenue") {
    return transactionType === "decrease";
  }
  
  return false;
};

// Static method to get transactions by account
transactionSchema.statics.getByAccount = function (accountName, startDate, endDate) {
  const query = { accountName };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  
  return this.find(query).sort({ date: -1 });
};

// Static method to get journal entries
transactionSchema.statics.getJournal = function (startDate, endDate, limit = 100) {
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
    .populate("accountId", "name type")
    .populate("contraAccountId", "name type");
};

// Static method to get balance sheet
transactionSchema.statics.getBalanceSheet = function (asOfDate = new Date()) {
  return this.aggregate([
    {
      $match: {
        date: { $lte: new Date(asOfDate) },
      },
    },
    {
      $group: {
        _id: {
          accountName: "$accountName",
          accountType: "$accountType",
        },
        totalDebit: { $sum: "$debit" },
        totalCredit: { $sum: "$credit" },
      },
    },
    {
      $project: {
        accountName: "$_id.accountName",
        accountType: "$_id.accountType",
        balance: { $subtract: ["$totalDebit", "$totalCredit"] },
      },
    },
    {
      $sort: { accountType: 1, accountName: 1 },
    },
  ]);
};

module.exports = mongoose.model("Transaction", transactionSchema); 
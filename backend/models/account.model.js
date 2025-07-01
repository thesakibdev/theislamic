const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      required: [true, "Account type is required"],
      enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
accountSchema.index({ name: 1, type: 1 });

// Virtual for formatted balance
accountSchema.virtual("formattedBalance").get(function () {
  return this.balance.toFixed(2);
});

// Method to update balance
accountSchema.methods.updateBalance = function (amount, isDebit) {
  if (this.type === "Asset" || this.type === "Expense") {
    // Asset/Expense: Debit increases, Credit decreases
    this.balance += isDebit ? amount : -amount;
  } else {
    // Liability/Equity/Revenue: Credit increases, Debit decreases
    this.balance += isDebit ? -amount : amount;
  }
  return this.save();
};

// Static method to get accounts by type
accountSchema.statics.getByType = function (type) {
  return this.find({ type, isActive: true }).sort({ name: 1 });
};

// Static method to get balance sheet accounts
accountSchema.statics.getBalanceSheetAccounts = function () {
  return this.find({
    type: { $in: ["Asset", "Liability", "Equity"] },
    isActive: true,
  }).sort({ type: 1, name: 1 });
};

// Static method to get income statement accounts
accountSchema.statics.getIncomeStatementAccounts = function () {
  return this.find({
    type: { $in: ["Revenue", "Expense"] },
    isActive: true,
  }).sort({ type: 1, name: 1 });
};

module.exports = mongoose.model("Account", accountSchema);

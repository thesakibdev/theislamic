const Transaction = require("../../models/transactions.model");
const User = require("../../models/user.model");
const ResponseHandler = require("../../helper/ResponseHandler");
const axios = require("axios");
const mongoose = require("mongoose");

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, amount, comment, category, donorId } = req.body;

    // Validate required fields
    if (!type || !amount) {
      return ResponseHandler.error(res, "Type, amount are required", 400);
    }

    // Validate type
    if (!["income", "expense"].includes(type)) {
      return ResponseHandler.error(
        res,
        "Type must be either 'income' or 'expense'",
        400
      );
    }

    // Validate category
    if (category && !["sadaqah", "zakat", "fitrah", "other"].includes(category)) {
      return ResponseHandler.error(
        res,
        "Category must be either 'sadaqah', 'zakat', 'fitrah', or 'other'",
        400
      );
    }

    // Always convert donorId to ObjectId if present
    let donorObjectId;
    if (donorId) {
      if (mongoose.Types.ObjectId.isValid(donorId)) {
        donorObjectId = donorId;
      } else {
        return ResponseHandler.error(res, "Invalid donorId format", 400);
      }
    }

    const user = req.user;
    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    // Create transaction
    const transaction = new Transaction({
      type,
      amount: parseFloat(amount),
      comment: comment || "",
      category: category || "other",
      date: new Date(),
      editor: user._id,
      donorId: donorObjectId,
    });

    await transaction.save();

    // If donorId is provided, call donor add-history API
    if (donorId) {
      try {
        const donorApiUrl = `${
          process.env.BACKEND_URL || "http://localhost:5000"
        }/api/v1/donor/add-history/${donorId}`;
        const donorPayload = {
          amount: parseFloat(amount),
          donateDate: new Date().toISOString(),
          typeOfDonation: category || "other",
        };
        await axios.post(donorApiUrl, donorPayload, {
          headers: { "Content-Type": "application/json" },
        });
      } catch (donorErr) {
        console.error(
          "Failed to add transaction to donor history:",
          donorErr.message
        );
      }
    }

    return ResponseHandler.success(
      res,
      "Transaction created successfully",
      { transaction }
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter)
      .populate("editor", "name email")
      .populate("donorId", "name phone")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    return ResponseHandler.success(
      res,
      "Transactions retrieved successfully",
      {
        transactions,
        totalTransactions: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      }
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Get transaction summary with detailed breakdowns
const getTransactionSummary = async (req, res) => {
  try {
    // Calculate total income (from sadaqah, zakat, fitrah, and other income)
    const totalIncome = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Calculate total expense (only from "other" category)
    const totalExpense = await Transaction.aggregate([
      { $match: { type: "expense", category: "other" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Calculate breakdown by category for income
    const incomeByCategory = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    // Calculate total transactions
    const totalTransactions = await Transaction.countDocuments();

    // Get last transaction
    const lastTransaction = await Transaction.findOne()
      .sort({ date: -1 })
      .populate("editor", "name email")
      .populate("donorId", "name phone");

    // Calculate net balance
    const totalIncomeAmount = totalIncome.length > 0 ? totalIncome[0].total : 0;
    const totalExpenseAmount = totalExpense.length > 0 ? totalExpense[0].total : 0;
    const netBalance = totalIncomeAmount - totalExpenseAmount;

    // Format category breakdowns for income
    const formatIncomeBreakdown = (categoryData) => {
      const breakdown = {
        sadaqah: 0,
        zakat: 0,
        fitrah: 0,
        other: 0,
      };
      
      categoryData.forEach(item => {
        breakdown[item._id] = item.total;
      });
      
      return breakdown;
    };

    const summary = {
      totalIncome: totalIncomeAmount,
      totalExpense: totalExpenseAmount,
      netBalance,
      totalTransactions,
      lastTransaction,
      incomeBreakdown: formatIncomeBreakdown(incomeByCategory)
    };

    return ResponseHandler.success(
      res,
      "Transaction summary retrieved successfully",
      { summary }
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { type, amount, comment, category } = req.body;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return ResponseHandler.error(res, "Transaction not found", 404);
    }

    // Validate category if provided
    if (category && !["sadaqah", "zakat", "fitrah", "other"].includes(category)) {
      return ResponseHandler.error(
        res,
        "Category must be either 'sadaqah', 'zakat', 'fitrah', or 'other'",
        400
      );
    }

    // Update transaction
    transaction.type = type || transaction.type;
    transaction.amount = amount ? parseFloat(amount) : transaction.amount;
    transaction.comment = comment || transaction.comment;
    transaction.category = category || transaction.category;
    transaction.updatedAt = new Date();

    await transaction.save();

    return ResponseHandler.success(
      res,
      "Transaction updated successfully",
      { transaction }
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) {
      return ResponseHandler.error(res, "Transaction not found", 404);
    }

    return ResponseHandler.success(
      res,
      "Transaction deleted successfully",
      { message: "Transaction deleted successfully" }
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionSummary,
  updateTransaction,
  deleteTransaction,
};

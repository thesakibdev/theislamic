const Transaction = require("../../models/account.model");
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
      { transaction },
      "Transaction created successfully"
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const transactions = await Transaction.find()
      .populate("editor", "name email")
      .populate("donorId", "name phone")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments();

    return ResponseHandler.success(
      res,
      {
        transactions,
        totalTransactions: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      "Transactions retrieved successfully"
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Get transaction summary
const getTransactionSummary = async (req, res) => {
  try {
    // Calculate summary statistics
    const totalIncome = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalTransactions = await Transaction.countDocuments();

    const lastTransaction = await Transaction.findOne()
      .sort({ date: -1 })
      .populate("editor", "name email")
      .populate("donorId", "name phone");

    const summary = {
      totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0,
      totalExpense: totalExpense.length > 0 ? totalExpense[0].total : 0,
      totalTransactions,
      lastTransaction,
    };

    return ResponseHandler.success(
      res,
      summary,
      "Transaction summary retrieved successfully"
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

    // Update transaction
    transaction.type = type || transaction.type;
    transaction.amount = amount ? parseFloat(amount) : transaction.amount;
    transaction.comment = comment || transaction.comment;
    transaction.category = category || transaction.category;
    transaction.updatedAt = new Date();

    await transaction.save();

    return ResponseHandler.success(
      res,
      { transaction },
      "Transaction updated successfully"
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
      { message: "Transaction deleted successfully" },
      "Transaction deleted successfully"
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

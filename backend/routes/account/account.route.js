const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getAccountSummary,
  updateTransaction,
  deleteTransaction,
  getAllAccounts,
} = require("../../controllers/account/account.controller");
const authCheck = require("../../middleware/authCheck.middleware");

// Create a new transaction
router.post("/create", authCheck, createTransaction);

// Get all transactions for a user
router.get("/transactions/:userId", authCheck, getTransactions);

// Get account summary
router.get("/summary/:userId", authCheck, getAccountSummary);

// Update a transaction
router.put("/transaction/:transactionId", authCheck, updateTransaction);

// Delete a transaction
router.delete("/transaction/:transactionId", authCheck, deleteTransaction);

// Get all accounts (admin only)
router.get("/all", authCheck, getAllAccounts);

module.exports = router; 
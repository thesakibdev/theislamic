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
const checkUserRole = require("../../middleware/authCheck.middleware");

// Create a new transaction
router.post("/create", checkUserRole(['admin', "creator", "editor"]), createTransaction);

// Get all transactions for a user
router.get("/transactions/:userId", checkUserRole(['admin', "creator", "editor"]), getTransactions);

// Get account summary
router.get("/summary/:userId", checkUserRole(['admin', "creator", "editor"]), getAccountSummary);

// Update a transaction
router.put("/transaction/:transactionId", checkUserRole(['admin', "creator", "editor"]), updateTransaction);

// Delete a transaction
router.delete("/transaction/:transactionId", checkUserRole(['admin', "creator", "editor"]), deleteTransaction);

// Get all accounts (admin only)
router.get("/all", checkUserRole(['admin', "creator", "editor"]), getAllAccounts);

module.exports = router; 
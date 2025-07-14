const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionSummary,
  updateTransaction,
  deleteTransaction,
} = require("../../controllers/account/account.controller");
const checkUserRole = require("../../middleware/authCheck.middleware");

// Create a new transaction
router.post("/create", checkUserRole(['admin', "creator", "editor"]), createTransaction);

// Get all transactions
router.get("/transactions", checkUserRole(['admin', "creator", "editor"]), getTransactions);

// Get transaction summary
router.get("/summary", checkUserRole(['admin', "creator", "editor"]), getTransactionSummary);

// Update a transaction
router.put("/transaction/:transactionId", checkUserRole(['admin', "creator", "editor"]), updateTransaction);

// Delete a transaction
router.delete("/transaction/:transactionId", checkUserRole(['admin', "creator", "editor"]), deleteTransaction);


module.exports = router; 
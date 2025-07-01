const express = require("express");
const router = express.Router();
const {
  // Account Management
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,

  // Transaction Management
  addTransaction,
  getTransactions,
  getTransactionById,

  // Journal Management
  getJournal,
  getJournalById,

  // Ledger Management
  getAccountLedger,

  // Financial Reports
  getBalanceSheet,
  getIncomeStatement,
  getTrialBalance,

  // Dashboard
  getAccountingSummary,
} = require("../../controllers/accoount/account.controller");

// Account Management Routes
router.post("/accounts", createAccount);
router.get("/accounts", getAllAccounts);
router.get("/accounts/:id", getAccountById);
router.put("/accounts/:id", updateAccount);

// Transaction Management Routes
router.post("/transactions", addTransaction);
router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionById);

// Journal Management Routes
router.get("/journal", getJournal);
router.get("/journal/:id", getJournalById);

// Ledger Management Routes
router.get("/ledger/:accountName", getAccountLedger);

// Financial Reports Routes
router.get("/reports/balance-sheet", getBalanceSheet);
router.get("/reports/income-statement", getIncomeStatement);
router.get("/reports/trial-balance", getTrialBalance);

// Dashboard Routes
router.get("/summary", getAccountingSummary);

module.exports = router; 
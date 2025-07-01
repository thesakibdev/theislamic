const Account = require("../../models/account.model");
const Transaction = require("../../models/transaction.model");
const JournalEntry = require("../../models/journal.model");
const ResponseHandler = require("../../helper/ResponseHandler");

// Account Management
const createAccount = async (req, res) => {
  try {
    const { name, type, description } = req.body;

    // Check if account already exists
    const existingAccount = await Account.findOne({ name });
    if (existingAccount) {
      return ResponseHandler.error(res, "Account with this name already exists", 400);
    }

    const account = new Account({
      name,
      type,
      description,
    });

    await account.save();

    return ResponseHandler.success(res, "Account created successfully", account);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const { type, active } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    if (active !== undefined) {
      query.isActive = active === "true";
    }

    const accounts = await Account.find(query).sort({ type: 1, name: 1 });

    return ResponseHandler.success(res, "Accounts retrieved successfully", accounts);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);

    if (!account) {
      return ResponseHandler.error(res, "Account not found", 404);
    }

    return ResponseHandler.success(res, "Account retrieved successfully", account);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, isActive } = req.body;

    const account = await Account.findById(id);
    if (!account) {
      return ResponseHandler.error(res, "Account not found", 404);
    }

    // Check if new name conflicts with existing account
    if (name && name !== account.name) {
      const existingAccount = await Account.findOne({ name, _id: { $ne: id } });
      if (existingAccount) {
        return ResponseHandler.error(res, "Account with this name already exists", 400);
      }
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { name, type, description, isActive },
      { new: true, runValidators: true }
    );

    return ResponseHandler.success(res, "Account updated successfully", updatedAccount);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Transaction Management
const addTransaction = async (req, res) => {
  try {
    const { date, description, amount, accountName, accountType, transactionType, category, notes, referenceNumber } = req.body;

    // Find or create the main account
    let account = await Account.findOne({ name: accountName });
    if (!account) {
      account = new Account({
        name: accountName,
        type: accountType,
        description: `${accountType} account for ${accountName}`,
      });
      await account.save();
    }

    // Helper to generate reference number
    const getRefPrefix = (type) => (type ? type.slice(0, 2).toUpperCase() : "TR");
    const generateReferenceNumber = (type) => {
      const prefix = getRefPrefix(type);
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      return `${prefix}-${date}-${rand}`;
    };

    // Use user-provided referenceNumber or auto-generate
    const refNum = referenceNumber && referenceNumber.trim() !== "" 
      ? referenceNumber 
      : generateReferenceNumber(transactionType);

    // Single-entry logic for non-profit: only main account, no contra
    let mainDebit = 0, mainCredit = 0;
    // Asset
    if (accountType === "Asset") {
      if (transactionType === "increase") {
        mainDebit = amount;
      } else {
        mainCredit = amount;
      }
    }
    // Liability
    else if (accountType === "Liability") {
      if (transactionType === "increase") {
        mainCredit = amount;
      } else {
        mainDebit = amount;
      }
    }
    // Equity
    else if (accountType === "Equity") {
      if (transactionType === "increase") {
        mainCredit = amount;
      } else {
        mainDebit = amount;
      }
    }
    // Revenue
    else if (accountType === "Revenue") {
      if (transactionType === "increase") {
        mainCredit = amount;
      } else {
        mainDebit = amount;
      }
    }
    // Expense
    else if (accountType === "Expense") {
      if (transactionType === "increase") {
        mainDebit = amount;
      } else {
        mainCredit = amount;
      }
    }
    // Fallback
    else {
      return ResponseHandler.error(res, "Invalid account type.", 400);
    }

    // Create the main transaction (no contra fields)
    const transaction = new Transaction({
      date: date || new Date(),
      description,
      amount,
      accountName,
      accountType,
      transactionType,
      accountId: account._id,
      category,
      notes,
      referenceNumber: refNum,
      debit: mainDebit,
      credit: mainCredit,
    });

    await transaction.save();

    // Update account balance
    const isDebit = mainDebit > 0;
    await account.updateBalance(amount, isDebit);

    // Journal entry: only main entry
    const totalDebit = mainDebit;
    const totalCredit = mainCredit;
    const journalEntry = new JournalEntry({
      date: transaction.date,
      description: transaction.description,
      entries: [
        {
          accountName: transaction.accountName,
          accountType: transaction.accountType,
          accountId: transaction.accountId,
          debit: transaction.debit,
          credit: transaction.credit,
        },
      ],
      category: transaction.category,
      notes: transaction.notes,
      totalDebit,
      totalCredit,
      referenceNumber: refNum,
    });

    await journalEntry.save();

    // Mark journal entry as posted
    journalEntry.isPosted = true;
    journalEntry.postedAt = new Date();
    await journalEntry.save();

    return ResponseHandler.success(res, "Transaction added successfully", {
      transaction,
      journalEntry,
      accountBalance: account.balance,
    });
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const getTransactions = async (req, res) => {
  try {
    const { accountName, startDate, endDate, limit = 100 } = req.query;

    let transactions;
    if (accountName) {
      transactions = await Transaction.getByAccount(accountName, startDate, endDate);
    } else {
      transactions = await Transaction.getJournal(startDate, endDate, parseInt(limit));
    }

    return ResponseHandler.success(res, "Transactions retrieved successfully", transactions);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
      .populate("accountId", "name type balance")
      .populate("contraAccountId", "name type balance");

    if (!transaction) {
      return ResponseHandler.error(res, "Transaction not found", 404);
    }

    return ResponseHandler.success(res, "Transaction retrieved successfully", transaction);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Journal Management
const getJournal = async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    const journalEntries = await JournalEntry.getByDateRange(startDate, endDate, parseInt(limit));

    return ResponseHandler.success(res, "Journal entries retrieved successfully", journalEntries);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const getJournalById = async (req, res) => {
  try {
    const { id } = req.params;
    const journalEntry = await JournalEntry.findById(id)
      .populate("entries.accountId", "name type balance");

    if (!journalEntry) {
      return ResponseHandler.error(res, "Journal entry not found", 404);
    }

    return ResponseHandler.success(res, "Journal entry retrieved successfully", journalEntry);
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Ledger Management
const getAccountLedger = async (req, res) => {
  try {
    const { accountName } = req.params;
    const { startDate, endDate } = req.query;

    // Get account details
    const account = await Account.findOne({ name: accountName });
    if (!account) {
      return ResponseHandler.error(res, "Account not found", 404);
    }

    // Get transactions for this account
    const transactions = await Transaction.getByAccount(accountName, startDate, endDate);

    // Calculate running balance
    let runningBalance = 0;
    const ledgerEntries = transactions.map((transaction) => {
      const isDebit = transaction.determineDebitCredit();
      
      if (account.type === "Asset" || account.type === "Expense") {
        runningBalance += isDebit ? transaction.amount : -transaction.amount;
      } else {
        runningBalance += isDebit ? -transaction.amount : transaction.amount;
      }

      return {
        date: transaction.date,
        referenceNumber: transaction.referenceNumber,
        description: transaction.description,
        debit: transaction.debit,
        credit: transaction.credit,
        balance: runningBalance,
      };
    });

    return ResponseHandler.success(res, "Account ledger retrieved successfully", {
      account,
      ledgerEntries,
      currentBalance: account.balance,
    });
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Financial Reports
const getBalanceSheet = async (req, res) => {
  try {
    const { asOfDate } = req.query;
    const balanceSheetData = await Transaction.getBalanceSheet(asOfDate);

    // Group by account type
    const groupedData = {
      Assets: [],
      Liabilities: [],
      Equity: [],
    };

    balanceSheetData.forEach((item) => {
      if (item.accountType === "Asset") {
        groupedData.Assets.push(item);
      } else if (item.accountType === "Liability") {
        groupedData.Liabilities.push(item);
      } else if (item.accountType === "Equity") {
        groupedData.Equity.push(item);
      }
    });

    // Calculate totals
    const totalAssets = groupedData.Assets.reduce((sum, item) => sum + item.balance, 0);
    const totalLiabilities = groupedData.Liabilities.reduce((sum, item) => sum + item.balance, 0);
    const totalEquity = groupedData.Equity.reduce((sum, item) => sum + item.balance, 0);

    return ResponseHandler.success(res, "Balance sheet retrieved successfully", {
      asOfDate: asOfDate || new Date(),
      assets: groupedData.Assets,
      liabilities: groupedData.Liabilities,
      equity: groupedData.Equity,
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
    });
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const getIncomeStatement = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get revenue and expense accounts
    const revenueAccounts = await Account.getByType("Revenue");
    const expenseAccounts = await Account.getByType("Expense");

    // Get transactions for the period
    const query = {
      accountType: { $in: ["Revenue", "Expense"] },
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    // Calculate revenue and expenses
    const revenueData = revenueAccounts.map((account) => {
      const accountTransactions = transactions.filter(
        (t) => t.accountName === account.name
      );
      const totalRevenue = accountTransactions.reduce(
        (sum, t) => sum + t.credit,
        0
      );
      return {
        accountName: account.name,
        amount: totalRevenue,
      };
    });

    const expenseData = expenseAccounts.map((account) => {
      const accountTransactions = transactions.filter(
        (t) => t.accountName === account.name
      );
      const totalExpense = accountTransactions.reduce(
        (sum, t) => sum + t.debit,
        0
      );
      return {
        accountName: account.name,
        amount: totalExpense,
      };
    });

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    return ResponseHandler.success(res, "Income statement retrieved successfully", {
      period: { startDate, endDate },
      revenue: revenueData,
      expenses: expenseData,
      totalRevenue,
      totalExpenses,
      netIncome,
    });
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

const getTrialBalance = async (req, res) => {
  try {
    const { asOfDate } = req.query;
    const trialBalance = await JournalEntry.getTrialBalance(asOfDate);

    const totalDebits = trialBalance.reduce((sum, item) => sum + item.debitTotal, 0);
    const totalCredits = trialBalance.reduce((sum, item) => sum + item.creditTotal, 0);

    return ResponseHandler.success(res, "Trial balance retrieved successfully", {
      asOfDate: asOfDate || new Date(),
      trialBalance,
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
    });
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Dashboard/Summary
const getAccountingSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get account counts
    const totalAccounts = await Account.countDocuments({ isActive: true });
    const accountsByType = await Account.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    // Get transaction counts
    const transactionQuery = {};
    if (startDate && endDate) {
      transactionQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const totalTransactions = await Transaction.countDocuments(transactionQuery);

    // Get total balances by type
    const balanceByType = await Account.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$type", totalBalance: { $sum: "$balance" } } },
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(10)
      .populate("accountId", "name type");

    return ResponseHandler.success(res, "Accounting summary retrieved successfully", {
      summary: {
        totalAccounts,
        accountsByType,
        totalTransactions,
        balanceByType,
      },
      recentTransactions,
    });
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
};

module.exports = {
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
};

const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const ResponseHandler = require("../../helper/ResponseHandler");

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, amount, comment, category, editor } = req.body;
    
    // Validate required fields
    if (!type || !amount || !editor) {
      return ResponseHandler.error(res, "Type, amount, and editor are required", 400);
    }

    // Validate type
    if (!["income", "expense"].includes(type)) {
      return ResponseHandler.error(res, "Type must be either 'income' or 'expense'", 400);
    }

    const user = await User.findById(editor._id);
    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    // Get or create account for the user
    let account = await Account.findOne({ user: editor._id });
    
    if (!account) {
      account = new Account({ user: editor._id, balance: 0 });
    }

    // Create transaction
    const transaction = {
      type,
      amount: parseFloat(amount),
      comment: comment || "",
      category: category || "other",
      date: new Date(),
      editor: editor._id
    };

    // Add transaction to account
    account.transactions.push(transaction);

    // Update balance based on transaction type
    if (type === "income") {
      account.balance += parseFloat(amount);
    } else {
      account.balance -= parseFloat(amount);
    }

    account.updatedAt = new Date();
    await account.save();

    return ResponseHandler.success(
      res,
      { account, transaction },
      "Transaction created successfully"
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const account = await Account.findOne({ user: userId })
      .populate('transactions.editor', 'name email')
      .populate('user', 'name email');

    if (!account) {
      return ResponseHandler.error(res, "Account not found", 404);
    }

    // Paginate transactions
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = account.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(startIndex, endIndex);

    const totalTransactions = account.transactions.length;
    const totalPages = Math.ceil(totalTransactions / limit);

    return ResponseHandler.success(
      res,
      {
        transactions: paginatedTransactions,
        balance: account.balance,
        totalTransactions,
        currentPage: parseInt(page),
        totalPages,
        hasNextPage: endIndex < totalTransactions,
        hasPrevPage: page > 1
      },
      "Transactions retrieved successfully"
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Get account summary
const getAccountSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const account = await Account.findOne({ user: userId });
    if (!account) {
      return ResponseHandler.error(res, "Account not found", 404);
    }

    // Calculate summary statistics
    const totalIncome = account.transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = account.transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const summary = {
      balance: account.balance,
      totalIncome,
      totalExpense,
      totalTransactions: account.transactions.length,
      lastTransaction: account.transactions.length > 0 
        ? account.transactions[account.transactions.length - 1] 
        : null
    };

    return ResponseHandler.success(
      res,
      summary,
      "Account summary retrieved successfully"
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

    const account = await Account.findOne({
      "transactions._id": transactionId
    });

    if (!account) {
      return ResponseHandler.error(res, "Transaction not found", 404);
    }

    const transaction = account.transactions.id(transactionId);
    if (!transaction) {
      return ResponseHandler.error(res, "Transaction not found", 404);
    }

    // Calculate the difference to update balance
    const oldAmount = transaction.amount;
    const oldType = transaction.type;
    const newAmount = parseFloat(amount);
    const newType = type;

    // Remove old transaction's effect on balance
    if (oldType === "income") {
      account.balance -= oldAmount;
    } else {
      account.balance += oldAmount;
    }

    // Add new transaction's effect on balance
    if (newType === "income") {
      account.balance += newAmount;
    } else {
      account.balance -= newAmount;
    }

    // Update transaction
    transaction.type = newType;
    transaction.amount = newAmount;
    transaction.comment = comment || transaction.comment;
    transaction.category = category || transaction.category;
    transaction.date = new Date();

    account.updatedAt = new Date();
    await account.save();

    return ResponseHandler.success(
      res,
      { account, transaction },
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

    const account = await Account.findOne({
      "transactions._id": transactionId
    });

    if (!account) {
      return ResponseHandler.error(res, "Transaction not found", 404);
    }

    const transaction = account.transactions.id(transactionId);
    if (!transaction) {
      return ResponseHandler.error(res, "Transaction not found", 404);
    }

    // Remove transaction's effect on balance
    if (transaction.type === "income") {
      account.balance -= transaction.amount;
    } else {
      account.balance += transaction.amount;
    }

    // Remove transaction
    account.transactions.pull(transactionId);
    account.updatedAt = new Date();
    await account.save();

    return ResponseHandler.success(
      res,
      { account },
      "Transaction deleted successfully"
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

// Get all accounts (for admin)
const getAllAccounts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const accounts = await Account.find()
      .populate('user', 'name email')
      .populate('transactions.editor', 'name email')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Account.countDocuments();

    return ResponseHandler.success(
      res,
      {
        accounts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      },
      "Accounts retrieved successfully"
    );
  } catch (error) {
    console.log("error from server", error);
    return ResponseHandler.error(res, error.message, 500);
  }
};

module.exports = { 
  createTransaction,
  getTransactions,
  getAccountSummary,
  updateTransaction,
  deleteTransaction,
  getAllAccounts
};

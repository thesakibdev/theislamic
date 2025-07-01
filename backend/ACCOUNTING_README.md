# Smart Accounting Backend System

A comprehensive, modular accounting backend system built with Node.js, Express.js, and MongoDB that implements double-entry bookkeeping with automatic debit/credit determination.

## 🚀 Features

### Core Accounting Features
- **Double-Entry Bookkeeping**: Automatic creation of balanced journal entries
- **Smart Debit/Credit Rules**: 
  - Asset/Expense: Increase = Debit, Decrease = Credit
  - Liability/Equity/Revenue: Increase = Credit, Decrease = Debit
- **Automatic Account Creation**: Accounts are created automatically when referenced in transactions
- **Real-time Balance Updates**: Account balances update automatically with each transaction
- **Transaction Reference Numbers**: Unique reference numbers for audit trails

### Financial Reports
- **Balance Sheet**: Assets, Liabilities, and Equity as of any date
- **Income Statement**: Revenue and Expenses for any period
- **Trial Balance**: Verification that debits equal credits
- **Account Ledgers**: Detailed transaction history with running balances
- **General Journal**: Complete audit trail of all transactions

### API Endpoints
- **Account Management**: CRUD operations for chart of accounts
- **Transaction Management**: Add and retrieve transactions
- **Journal Management**: View journal entries
- **Ledger Management**: Account-specific transaction history
- **Financial Reports**: Generate standard financial statements
- **Dashboard**: Summary statistics and recent activity

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (if not already done)
2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

## 🧪 Testing the System

Run the comprehensive test script to verify all functionality:

```bash
node test-accounting.js
```

This will:
- Create sample accounts
- Add various types of transactions
- Generate financial reports
- Validate double-entry bookkeeping
- Display account balances and summaries

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1/accounting
```

### Quick Start Examples

#### 1. Create an Account
```bash
curl -X POST http://localhost:5000/api/v1/accounting/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cash",
    "type": "Asset",
    "description": "Cash on hand and in bank"
  }'
```

#### 2. Add a Transaction
```bash
curl -X POST http://localhost:5000/api/v1/accounting/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "description": "Received payment from customer",
    "amount": 1000.00,
    "accountName": "Cash",
    "accountType": "Asset",
    "transactionType": "increase",
    "contraAccountName": "Sales Revenue",
    "contraAccountType": "Revenue"
  }'
```

#### 3. Get Balance Sheet
```bash
curl http://localhost:5000/api/v1/accounting/reports/balance-sheet
```

#### 4. Get Account Ledger
```bash
curl http://localhost:5000/api/v1/accounting/ledger/Cash
```

## 🏗️ System Architecture

### Models

#### Account Model (`models/account.model.js`)
- Manages chart of accounts
- Tracks account balances
- Provides balance update methods
- Includes account type validation

#### Transaction Model (`models/transaction.model.js`)
- Stores individual transactions
- Automatically determines debit/credit
- Generates unique reference numbers
- Links to accounts via ObjectId

#### Journal Entry Model (`models/journal.model.js`)
- Implements double-entry bookkeeping
- Ensures debits equal credits
- Provides audit trail
- Supports posting status

### Controllers

#### Account Controller (`controllers/accoount/account.controller.js`)
- Account CRUD operations
- Transaction management
- Journal and ledger operations
- Financial report generation
- Dashboard summaries

### Routes

#### Account Routes (`routes/account/account.route.js`)
- RESTful API endpoints
- Organized by functionality
- Clear URL structure
- Proper HTTP methods

## 📊 Accounting Rules Implementation

The system implements standard accounting rules:

### Debit/Credit Rules
```javascript
// Asset/Expense accounts
if (accountType === "Asset" || accountType === "Expense") {
  return transactionType === "increase" ? "debit" : "credit";
}

// Liability/Equity/Revenue accounts
if (accountType === "Liability" || accountType === "Equity" || accountType === "Revenue") {
  return transactionType === "increase" ? "credit" : "debit";
}
```

### Balance Update Logic
```javascript
// Asset/Expense: Debit increases, Credit decreases
if (account.type === "Asset" || account.type === "Expense") {
  account.balance += isDebit ? amount : -amount;
} else {
  // Liability/Equity/Revenue: Credit increases, Debit decreases
  account.balance += isDebit ? -amount : amount;
}
```

## 🔄 Transaction Flow

1. **User Input**: Date, description, amount, account name, account type, transaction type
2. **Account Lookup**: Find or create the main account
3. **Contra Account**: Find or create the contra account (if provided)
4. **Transaction Creation**: Create transaction record with automatic debit/credit determination
5. **Balance Updates**: Update both account balances
6. **Journal Entry**: Create double-entry journal entry
7. **Posting**: Mark journal entry as posted
8. **Response**: Return transaction details and updated balances

## 📈 Financial Reports

### Balance Sheet
- Assets, Liabilities, and Equity as of a specific date
- Automatic calculation of totals
- Proper accounting equation validation

### Income Statement
- Revenue and Expenses for a specific period
- Net income calculation
- Period-based filtering

### Trial Balance
- Verification that debits equal credits
- Account-by-account breakdown
- Balance validation

### Account Ledger
- Transaction history for specific accounts
- Running balance calculation
- Date range filtering

## 🔒 Data Integrity

- **Double-Entry Validation**: Ensures debits equal credits
- **Account Type Validation**: Enforces proper account classifications
- **Reference Number Uniqueness**: Prevents duplicate transactions
- **Balance Consistency**: Real-time balance updates
- **Audit Trail**: Complete transaction history

## 🚀 Performance Features

- **Database Indexing**: Optimized queries for large datasets
- **Pagination**: Limit results for better performance
- **Selective Population**: Load only necessary related data
- **Aggregation Pipelines**: Efficient report generation

## 📝 Error Handling

- **Validation Errors**: Proper input validation with clear messages
- **Business Logic Errors**: Accounting rule violations
- **Database Errors**: Connection and query error handling
- **Consistent Response Format**: Standardized error responses

## 🔧 Configuration

### Environment Variables
```env
PORT=5000                    # Server port
MONGODB_URI=mongodb://...    # MongoDB connection string
JWT_SECRET=your_secret       # JWT signing secret
NODE_ENV=development         # Environment mode
```

### Database Configuration
- MongoDB with Mongoose ODM
- Automatic connection management
- Schema validation
- Index optimization

## 🧪 Testing

### Manual Testing
Use the provided test script:
```bash
node test-accounting.js
```

### API Testing
Use tools like Postman or curl to test endpoints:
- Create accounts
- Add transactions
- Generate reports
- Verify balances

### Validation Testing
- Test accounting rules
- Verify double-entry bookkeeping
- Check balance calculations
- Validate report accuracy

## 📚 Additional Resources

- **API Documentation**: See `accountingApiDoc.md` for complete API reference
- **Test Script**: `test-accounting.js` for system validation
- **Models**: Detailed schema definitions in `models/` directory
- **Controllers**: Business logic in `controllers/accoount/` directory

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain accounting principles
3. Add proper error handling
4. Include tests for new features
5. Update documentation

## 📄 License

This project is part of the larger Islamic application system.

## 🆘 Support

For issues or questions:
1. Check the API documentation
2. Review the test script examples
3. Verify accounting rules implementation
4. Check database connectivity

---

**Note**: This accounting system is designed to be production-ready with proper validation, error handling, and audit trails. It follows standard accounting principles and provides a solid foundation for financial management applications. 
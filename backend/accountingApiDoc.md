# Accounting System API Documentation

## Overview
This is a smart and modular accounting backend system that implements double-entry bookkeeping with automatic debit/credit determination based on standard accounting rules.

## Base URL
```
http://localhost:5000/api/v1/accounting
```

## Accounting Rules
- **Asset/Expense**: Increase = Debit, Decrease = Credit
- **Liability/Equity/Revenue**: Increase = Credit, Decrease = Debit

## Account Management

### Create Account
**POST** `/accounts`

Create a new account in the chart of accounts.

**Request Body:**
```json
{
  "name": "Cash",
  "type": "Asset",
  "description": "Cash on hand and in bank"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Cash",
    "type": "Asset",
    "balance": 0,
    "description": "Cash on hand and in bank",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Accounts
**GET** `/accounts`

Retrieve all accounts with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by account type (Asset, Liability, Equity, Revenue, Expense)
- `active` (optional): Filter by active status (true/false)

**Example:**
```
GET /accounts?type=Asset&active=true
```

### Get Account by ID
**GET** `/accounts/:id`

Retrieve a specific account by its ID.

### Update Account
**PUT** `/accounts/:id`

Update an existing account.

**Request Body:**
```json
{
  "name": "Cash Account",
  "type": "Asset",
  "description": "Updated description",
  "isActive": true
}
```

## Transaction Management

### Add Transaction
**POST** `/transactions`

Add a new transaction. The system automatically determines debit/credit based on accounting rules.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "description": "Received payment from customer",
  "amount": 1000.00,
  "accountName": "Cash",
  "accountType": "Asset",
  "transactionType": "increase",
  "contraAccountName": "Accounts Receivable",
  "contraAccountType": "Asset",
  "category": "Sales",
  "notes": "Payment for invoice #123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction added successfully",
  "data": {
    "transaction": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "date": "2024-01-15T00:00:00.000Z",
      "description": "Received payment from customer",
      "amount": 1000,
      "accountName": "Cash",
      "accountType": "Asset",
      "transactionType": "increase",
      "debit": 1000,
      "credit": 0,
      "referenceNumber": "TXN-1705312200000-001",
      "category": "Sales",
      "notes": "Payment for invoice #123"
    },
    "journalEntry": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "referenceNumber": "JE-1705312200000-001",
      "totalDebit": 1000,
      "totalCredit": 1000,
      "isPosted": true
    },
    "accountBalance": 1000,
    "contraAccountBalance": -1000
  }
}
```

### Get Transactions
**GET** `/transactions`

Retrieve transactions with optional filtering.

**Query Parameters:**
- `accountName` (optional): Filter by account name
- `startDate` (optional): Start date for filtering (YYYY-MM-DD)
- `endDate` (optional): End date for filtering (YYYY-MM-DD)
- `limit` (optional): Limit number of results (default: 100)

**Examples:**
```
GET /transactions
GET /transactions?accountName=Cash&startDate=2024-01-01&endDate=2024-01-31
GET /transactions?limit=50
```

### Get Transaction by ID
**GET** `/transactions/:id`

Retrieve a specific transaction by its ID.

## Journal Management

### Get Journal
**GET** `/journal`

Retrieve journal entries with optional date filtering.

**Query Parameters:**
- `startDate` (optional): Start date for filtering (YYYY-MM-DD)
- `endDate` (optional): End date for filtering (YYYY-MM-DD)
- `limit` (optional): Limit number of results (default: 100)

### Get Journal Entry by ID
**GET** `/journal/:id`

Retrieve a specific journal entry by its ID.

## Ledger Management

### Get Account Ledger
**GET** `/ledger/:accountName`

Retrieve the ledger for a specific account with running balance.

**Query Parameters:**
- `startDate` (optional): Start date for filtering (YYYY-MM-DD)
- `endDate` (optional): End date for filtering (YYYY-MM-DD)

**Example:**
```
GET /ledger/Cash?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "message": "Account ledger retrieved successfully",
  "data": {
    "account": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Cash",
      "type": "Asset",
      "balance": 1500
    },
    "ledgerEntries": [
      {
        "date": "2024-01-15T00:00:00.000Z",
        "referenceNumber": "TXN-1705312200000-001",
        "description": "Received payment from customer",
        "debit": 1000,
        "credit": 0,
        "balance": 1000
      },
      {
        "date": "2024-01-16T00:00:00.000Z",
        "referenceNumber": "TXN-1705398600000-002",
        "description": "Paid rent",
        "debit": 0,
        "credit": 500,
        "balance": 500
      }
    ],
    "currentBalance": 1500
  }
}
```

## Financial Reports

### Get Balance Sheet
**GET** `/reports/balance-sheet`

Generate a balance sheet as of a specific date.

**Query Parameters:**
- `asOfDate` (optional): Date for balance sheet (YYYY-MM-DD, default: today)

**Response:**
```json
{
  "success": true,
  "message": "Balance sheet retrieved successfully",
  "data": {
    "asOfDate": "2024-01-31T00:00:00.000Z",
    "assets": [
      {
        "accountName": "Cash",
        "accountType": "Asset",
        "balance": 1500
      },
      {
        "accountName": "Accounts Receivable",
        "accountType": "Asset",
        "balance": 2000
      }
    ],
    "liabilities": [
      {
        "accountName": "Accounts Payable",
        "accountType": "Liability",
        "balance": 1000
      }
    ],
    "equity": [
      {
        "accountName": "Owner's Equity",
        "accountType": "Equity",
        "balance": 2500
      }
    ],
    "totalAssets": 3500,
    "totalLiabilities": 1000,
    "totalEquity": 2500,
    "totalLiabilitiesAndEquity": 3500
  }
}
```

### Get Income Statement
**GET** `/reports/income-statement`

Generate an income statement for a specific period.

**Query Parameters:**
- `startDate` (optional): Start date for the period (YYYY-MM-DD)
- `endDate` (optional): End date for the period (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "message": "Income statement retrieved successfully",
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "revenue": [
      {
        "accountName": "Sales Revenue",
        "amount": 5000
      }
    ],
    "expenses": [
      {
        "accountName": "Rent Expense",
        "amount": 1000
      },
      {
        "accountName": "Utilities Expense",
        "amount": 500
      }
    ],
    "totalRevenue": 5000,
    "totalExpenses": 1500,
    "netIncome": 3500
  }
}
```

### Get Trial Balance
**GET** `/reports/trial-balance`

Generate a trial balance as of a specific date.

**Query Parameters:**
- `asOfDate` (optional): Date for trial balance (YYYY-MM-DD, default: today)

**Response:**
```json
{
  "success": true,
  "message": "Trial balance retrieved successfully",
  "data": {
    "asOfDate": "2024-01-31T00:00:00.000Z",
    "trialBalance": [
      {
        "accountName": "Cash",
        "accountType": "Asset",
        "debitTotal": 2000,
        "creditTotal": 500,
        "balance": 1500
      }
    ],
    "totalDebits": 2000,
    "totalCredits": 2000,
    "isBalanced": true
  }
}
```

## Dashboard

### Get Accounting Summary
**GET** `/summary`

Get a summary of accounting data for dashboard display.

**Query Parameters:**
- `startDate` (optional): Start date for filtering (YYYY-MM-DD)
- `endDate` (optional): End date for filtering (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "message": "Accounting summary retrieved successfully",
  "data": {
    "summary": {
      "totalAccounts": 10,
      "accountsByType": [
        { "_id": "Asset", "count": 4 },
        { "_id": "Liability", "count": 2 },
        { "_id": "Equity", "count": 1 },
        { "_id": "Revenue", "count": 2 },
        { "_id": "Expense", "count": 1 }
      ],
      "totalTransactions": 150,
      "balanceByType": [
        { "_id": "Asset", "totalBalance": 5000 },
        { "_id": "Liability", "totalBalance": 2000 },
        { "_id": "Equity", "totalBalance": 3000 }
      ]
    },
    "recentTransactions": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "date": "2024-01-31T10:30:00.000Z",
        "description": "Received payment",
        "amount": 1000,
        "accountName": "Cash",
        "accountType": "Asset"
      }
    ]
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Example Usage Scenarios

### Scenario 1: Recording a Sale
```json
POST /transactions
{
  "date": "2024-01-15",
  "description": "Sale of goods",
  "amount": 500.00,
  "accountName": "Cash",
  "accountType": "Asset",
  "transactionType": "increase",
  "contraAccountName": "Sales Revenue",
  "contraAccountType": "Revenue"
}
```

### Scenario 2: Recording an Expense
```json
POST /transactions
{
  "date": "2024-01-16",
  "description": "Paid rent",
  "amount": 1000.00,
  "accountName": "Rent Expense",
  "accountType": "Expense",
  "transactionType": "increase",
  "contraAccountName": "Cash",
  "contraAccountType": "Asset"
}
```

### Scenario 3: Recording a Purchase on Credit
```json
POST /transactions
{
  "date": "2024-01-17",
  "description": "Purchased inventory on credit",
  "amount": 2000.00,
  "accountName": "Inventory",
  "accountType": "Asset",
  "transactionType": "increase",
  "contraAccountName": "Accounts Payable",
  "contraAccountType": "Liability"
}
```

## Notes

1. The system automatically creates accounts if they don't exist when adding transactions
2. All monetary values are stored as numbers (floating-point)
3. The system enforces double-entry bookkeeping rules
4. Journal entries are automatically created and posted for each transaction
5. Account balances are automatically updated when transactions are added
6. All dates should be in ISO format (YYYY-MM-DD) or ISO datetime format 
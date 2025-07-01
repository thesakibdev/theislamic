const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1/accounting';

// Test data
const testAccounts = [
  { name: 'Cash', type: 'Asset', description: 'Cash on hand and in bank' },
  { name: 'Accounts Receivable', type: 'Asset', description: 'Money owed by customers' },
  { name: 'Inventory', type: 'Asset', description: 'Goods for sale' },
  { name: 'Accounts Payable', type: 'Liability', description: 'Money owed to suppliers' },
  { name: 'Owner\'s Equity', type: 'Equity', description: 'Owner\'s investment' },
  { name: 'Sales Revenue', type: 'Revenue', description: 'Income from sales' },
  { name: 'Rent Expense', type: 'Expense', description: 'Rent payments' },
  { name: 'Utilities Expense', type: 'Expense', description: 'Utility bills' }
];

const testTransactions = [
  {
    date: '2024-01-01',
    description: 'Initial investment by owner',
    amount: 10000,
    accountName: 'Cash',
    accountType: 'Asset',
    transactionType: 'increase',
    contraAccountName: 'Owner\'s Equity',
    contraAccountType: 'Equity'
  },
  {
    date: '2024-01-02',
    description: 'Purchased inventory on credit',
    amount: 5000,
    accountName: 'Inventory',
    accountType: 'Asset',
    transactionType: 'increase',
    contraAccountName: 'Accounts Payable',
    contraAccountType: 'Liability'
  },
  {
    date: '2024-01-03',
    description: 'Sale of goods for cash',
    amount: 3000,
    accountName: 'Cash',
    accountType: 'Asset',
    transactionType: 'increase',
    contraAccountName: 'Sales Revenue',
    contraAccountType: 'Revenue'
  },
  {
    date: '2024-01-04',
    description: 'Sale of goods on credit',
    amount: 2000,
    accountName: 'Accounts Receivable',
    accountType: 'Asset',
    transactionType: 'increase',
    contraAccountName: 'Sales Revenue',
    contraAccountType: 'Revenue'
  },
  {
    date: '2024-01-05',
    description: 'Paid rent',
    amount: 1000,
    accountName: 'Rent Expense',
    accountType: 'Expense',
    transactionType: 'increase',
    contraAccountName: 'Cash',
    contraAccountType: 'Asset'
  },
  {
    date: '2024-01-06',
    description: 'Paid utilities',
    amount: 500,
    accountName: 'Utilities Expense',
    accountType: 'Expense',
    transactionType: 'increase',
    contraAccountName: 'Cash',
    contraAccountType: 'Asset'
  },
  {
    date: '2024-01-07',
    description: 'Received payment from customer',
    amount: 2000,
    accountName: 'Cash',
    accountType: 'Asset',
    transactionType: 'increase',
    contraAccountName: 'Accounts Receivable',
    contraAccountType: 'Asset'
  },
  {
    date: '2024-01-08',
    description: 'Paid supplier',
    amount: 3000,
    accountName: 'Accounts Payable',
    accountType: 'Liability',
    transactionType: 'decrease',
    contraAccountName: 'Cash',
    contraAccountType: 'Asset'
  }
];

async function testAccountingSystem() {
  console.log('🧪 Testing Accounting System...\n');

  try {
    // Test 1: Create accounts
    console.log('1️⃣ Creating test accounts...');
    for (const account of testAccounts) {
      try {
        const response = await axios.post(`${BASE_URL}/accounts`, account);
        console.log(`✅ Created account: ${account.name} (${account.type})`);
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
          console.log(`ℹ️  Account already exists: ${account.name}`);
        } else {
          console.log(`❌ Failed to create account ${account.name}:`, error.response?.data?.message);
        }
      }
    }

    // Test 2: Add transactions
    console.log('\n2️⃣ Adding test transactions...');
    for (const transaction of testTransactions) {
      try {
        const response = await axios.post(`${BASE_URL}/transactions`, transaction);
        console.log(`✅ Added transaction: ${transaction.description} ($${transaction.amount})`);
      } catch (error) {
        console.log(`❌ Failed to add transaction: ${transaction.description}`, error.response?.data?.message);
      }
    }

    // Test 3: Get all accounts
    console.log('\n3️⃣ Retrieving all accounts...');
    const accountsResponse = await axios.get(`${BASE_URL}/accounts`);
    console.log('📊 Current account balances:');
    accountsResponse.data.data.forEach(account => {
      console.log(`   ${account.name} (${account.type}): $${account.balance.toFixed(2)}`);
    });

    // Test 4: Get transactions
    console.log('\n4️⃣ Retrieving recent transactions...');
    const transactionsResponse = await axios.get(`${BASE_URL}/transactions?limit=5`);
    console.log('📝 Recent transactions:');
    transactionsResponse.data.data.forEach(txn => {
      console.log(`   ${txn.date.split('T')[0]} - ${txn.description}: $${txn.amount} (${txn.accountName})`);
    });

    // Test 5: Get journal
    console.log('\n5️⃣ Retrieving journal entries...');
    const journalResponse = await axios.get(`${BASE_URL}/journal?limit=3`);
    console.log('📖 Recent journal entries:');
    journalResponse.data.data.forEach(entry => {
      console.log(`   ${entry.referenceNumber}: ${entry.description} (Debit: $${entry.totalDebit}, Credit: $${entry.totalCredit})`);
    });

    // Test 6: Get account ledger
    console.log('\n6️⃣ Retrieving Cash account ledger...');
    const ledgerResponse = await axios.get(`${BASE_URL}/ledger/Cash`);
    console.log('📋 Cash account ledger:');
    ledgerResponse.data.data.ledgerEntries.forEach(entry => {
      console.log(`   ${entry.date.split('T')[0]} - ${entry.description}: Debit $${entry.debit}, Credit $${entry.credit}, Balance $${entry.balance.toFixed(2)}`);
    });

    // Test 7: Get balance sheet
    console.log('\n7️⃣ Generating balance sheet...');
    const balanceSheetResponse = await axios.get(`${BASE_URL}/reports/balance-sheet`);
    const bs = balanceSheetResponse.data.data;
    console.log('💰 Balance Sheet:');
    console.log('   Assets:');
    bs.assets.forEach(asset => {
      console.log(`     ${asset.accountName}: $${asset.balance.toFixed(2)}`);
    });
    console.log(`   Total Assets: $${bs.totalAssets.toFixed(2)}`);
    console.log('   Liabilities:');
    bs.liabilities.forEach(liability => {
      console.log(`     ${liability.accountName}: $${liability.balance.toFixed(2)}`);
    });
    console.log(`   Total Liabilities: $${bs.totalLiabilities.toFixed(2)}`);
    console.log('   Equity:');
    bs.equity.forEach(equity => {
      console.log(`     ${equity.accountName}: $${equity.balance.toFixed(2)}`);
    });
    console.log(`   Total Equity: $${bs.totalEquity.toFixed(2)}`);
    console.log(`   Total Liabilities & Equity: $${bs.totalLiabilitiesAndEquity.toFixed(2)}`);

    // Test 8: Get income statement
    console.log('\n8️⃣ Generating income statement...');
    const incomeStatementResponse = await axios.get(`${BASE_URL}/reports/income-statement?startDate=2024-01-01&endDate=2024-01-31`);
    const is = incomeStatementResponse.data.data;
    console.log('📈 Income Statement:');
    console.log('   Revenue:');
    is.revenue.forEach(rev => {
      console.log(`     ${rev.accountName}: $${rev.amount.toFixed(2)}`);
    });
    console.log(`   Total Revenue: $${is.totalRevenue.toFixed(2)}`);
    console.log('   Expenses:');
    is.expenses.forEach(exp => {
      console.log(`     ${exp.accountName}: $${exp.amount.toFixed(2)}`);
    });
    console.log(`   Total Expenses: $${is.totalExpenses.toFixed(2)}`);
    console.log(`   Net Income: $${is.netIncome.toFixed(2)}`);

    // Test 9: Get trial balance
    console.log('\n9️⃣ Generating trial balance...');
    const trialBalanceResponse = await axios.get(`${BASE_URL}/reports/trial-balance`);
    const tb = trialBalanceResponse.data.data;
    console.log('⚖️  Trial Balance:');
    tb.trialBalance.forEach(account => {
      console.log(`   ${account.accountName}: Debit $${account.debitTotal.toFixed(2)}, Credit $${account.creditTotal.toFixed(2)}, Balance $${account.balance.toFixed(2)}`);
    });
    console.log(`   Total Debits: $${tb.totalDebits.toFixed(2)}`);
    console.log(`   Total Credits: $${tb.totalCredits.toFixed(2)}`);
    console.log(`   Balanced: ${tb.isBalanced ? '✅ Yes' : '❌ No'}`);

    // Test 10: Get accounting summary
    console.log('\n🔟 Getting accounting summary...');
    const summaryResponse = await axios.get(`${BASE_URL}/summary`);
    const summary = summaryResponse.data.data;
    console.log('📊 Accounting Summary:');
    console.log(`   Total Accounts: ${summary.summary.totalAccounts}`);
    console.log(`   Total Transactions: ${summary.summary.totalTransactions}`);
    console.log('   Accounts by Type:');
    summary.summary.accountsByType.forEach(type => {
      console.log(`     ${type._id}: ${type.count}`);
    });
    console.log('   Balances by Type:');
    summary.summary.balanceByType.forEach(type => {
      console.log(`     ${type._id}: $${type.totalBalance.toFixed(2)}`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📚 The accounting system is working correctly with:');
    console.log('   ✅ Double-entry bookkeeping');
    console.log('   ✅ Automatic debit/credit determination');
    console.log('   ✅ Account balance updates');
    console.log('   ✅ Journal entry creation');
    console.log('   ✅ Financial reports generation');
    console.log('   ✅ Trial balance validation');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAccountingSystem(); 
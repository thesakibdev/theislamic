import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FaChartLine, 
  FaBook, 
  FaCalculator, 
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaChartBar,
  FaPlus,
  FaEye
} from "react-icons/fa";
import { useGetAccountingSummaryQuery } from "@/slices/admin/accounting";
import AccountManagement from "./accounting/AccountManagement";
import TransactionManagement from "./accounting/TransactionManagement";
import JournalView from "./accounting/JournalView";
import LedgerView from "./accounting/LedgerView";
import BalanceSheet from "./accounting/BalanceSheet";
import IncomeStatement from "./accounting/IncomeStatement";
import TrialBalance from "./accounting/TrialBalance";

export default function Accounting() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: summary, isLoading: summaryLoading } = useGetAccountingSummaryQuery();

  const summaryData = summary?.data?.summary || {};
  const recentTransactions = summary?.data?.recentTransactions || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      Asset: 'text-green-600',
      Liability: 'text-red-600',
      Equity: 'text-blue-600',
      Revenue: 'text-purple-600',
      Expense: 'text-orange-600'
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounting Dashboard</h1>
        <p className="text-gray-600">Manage your financial records and generate reports</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <FaChartLine />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <FaBook />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FaCalculator />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <FaFileInvoiceDollar />
            Journal
          </TabsTrigger>
          <TabsTrigger value="ledger" className="flex items-center gap-2">
            <FaEye />
            Ledger
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="flex items-center gap-2">
            <FaBalanceScale />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="income-statement" className="flex items-center gap-2">
            <FaChartBar />
            Income Statement
          </TabsTrigger>
          <TabsTrigger value="trial-balance" className="flex items-center gap-2">
            <FaBalanceScale />
            Trial Balance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {summaryLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                    <FaBook className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                                         <div className="text-2xl font-bold">{summaryData?.totalAccounts ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Active accounts in system</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <FaCalculator className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                                         <div className="text-2xl font-bold">{summaryData?.totalTransactions ?? 0}</div>
                    <p className="text-xs text-muted-foreground">All time transactions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                    <FaChartLine className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                                             {formatCurrency(summaryData?.balanceByType?.find(b => b._id === 'Asset')?.totalBalance ?? 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Current asset value</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                    <FaBalanceScale className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                                             {formatCurrency(summaryData?.balanceByType?.find(b => b._id === 'Liability')?.totalBalance ?? 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Current liabilities</p>
                  </CardContent>
                </Card>
              </div>

              {/* Account Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accounts by Type</CardTitle>
                    <CardDescription>Distribution of accounts across different types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                                             {summaryData?.accountsByType?.map((type, index) => (
                         <div key={index} className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <div className={`w-3 h-3 rounded-full ${getAccountTypeColor(type?._id).replace('text-', 'bg-')}`}></div>
                             <span className="font-medium">{type?._id}</span>
                           </div>
                           <span className="text-sm text-gray-600">{type?.count ?? 0} accounts</span>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                                             {recentTransactions?.slice(0, 5).map((transaction, index) => (
                         <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                           <div>
                             <p className="font-medium text-sm">{transaction?.description}</p>
                             <p className="text-xs text-gray-600">
                               {new Date(transaction?.date).toLocaleDateString()} • {transaction?.accountName}
                             </p>
                           </div>
                           <div className="text-right">
                             <p className={`font-bold text-sm ${transaction?.debit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                               {formatCurrency(transaction?.amount)}
                             </p>
                             <p className="text-xs text-gray-600">{transaction?.accountType}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common accounting tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      onClick={() => setActiveTab("accounts")}
                      className="flex items-center gap-2"
                    >
                      <FaPlus />
                      Add Account
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("transactions")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FaCalculator />
                      Add Transaction
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("balance-sheet")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FaBalanceScale />
                      View Balance Sheet
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("income-statement")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FaChartBar />
                      View Income Statement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="accounts">
          <AccountManagement />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionManagement />
        </TabsContent>

        <TabsContent value="journal">
          <JournalView />
        </TabsContent>

        <TabsContent value="ledger">
          <LedgerView />
        </TabsContent>

        <TabsContent value="balance-sheet">
          <BalanceSheet />
        </TabsContent>

        <TabsContent value="income-statement">
          <IncomeStatement />
        </TabsContent>

        <TabsContent value="trial-balance">
          <TrialBalance />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
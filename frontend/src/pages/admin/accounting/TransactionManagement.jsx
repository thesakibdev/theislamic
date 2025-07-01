import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaPlus, FaEye, FaFilter } from "react-icons/fa";
import { useAddTransactionMutation, useGetTransactionsQuery, useGetAllAccountsQuery } from "@/slices/admin/accounting";
import { toast } from "react-toastify";

export default function TransactionManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    accountName: "",
    startDate: "",
    endDate: "",
  });

  const { data: transactions, isLoading } = useGetTransactionsQuery({
    accountName: filters.accountName || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    limit: 50,
  });

  const { data: accounts } = useGetAllAccountsQuery();
  const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    amount: "",
    accountName: "",
    accountType: "",
    transactionType: "",
    contraAccountName: "",
    contraAccountType: "",
    category: "",
    notes: "",
    referenceNumber: "",
  });

  const accountTypes = [
    { value: "Asset", label: "Asset" },
    { value: "Liability", label: "Liability" },
    { value: "Equity", label: "Equity" },
    { value: "Revenue", label: "Revenue" },
    { value: "Expense", label: "Expense" },
  ];

  const transactionTypes = [
    { value: "increase", label: "Increase" },
    { value: "decrease", label: "Decrease" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getTransactionTypeColor = (type) => {
    return type === "increase" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };

  // Helper to generate reference number
  const getRefPrefix = (type) => (type ? type.slice(0, 2).toUpperCase() : "TR");
  const generateReferenceNumber = (type) => {
    const prefix = getRefPrefix(type);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}-${date}-${rand}`;
  };

  // Auto-generate referenceNumber when transactionType changes, unless user has typed a custom value
  useEffect(() => {
    if (!formData.referenceNumber || formData.referenceNumber.startsWith(getRefPrefix(formData.transactionType))) {
      setFormData((prev) => ({
        ...prev,
        referenceNumber: generateReferenceNumber(formData.transactionType)
      }));
    }
    // eslint-disable-next-line
  }, [formData.transactionType]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      await addTransaction(transactionData).unwrap();
      toast.success("Transaction added successfully!");
      setIsAddDialogOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: "",
        amount: "",
        accountName: "",
        accountType: "",
        transactionType: "",
        contraAccountName: "",
        contraAccountType: "",
        category: "",
        notes: "",
        referenceNumber: "",
      });
    } catch (error) {
      toast.error(error.data?.message || "Failed to add transaction");
    }
  };

  const handleAccountTypeChange = (value) => {
    setFormData({ ...formData, accountType: value });
    // Auto-fill account name if it's a common account type
    const commonAccounts = {
      Asset: ["Cash", "Accounts Receivable", "Inventory", "Equipment"],
      Liability: ["Accounts Payable", "Notes Payable", "Accrued Expenses"],
      Equity: ["Owner's Equity", "Retained Earnings", "Common Stock"],
      Revenue: ["Sales Revenue", "Service Revenue", "Interest Income"],
      Expense: ["Rent Expense", "Utilities Expense", "Salaries Expense", "Cost of Goods Sold"],
    };
    
    if (commonAccounts[value] && commonAccounts[value].length > 0) {
      setFormData({ ...formData, accountType: value, accountName: commonAccounts[value][0] });
    }
  };

  const filteredTransactions = transactions?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transaction Management</h2>
          <p className="text-gray-600">Add and view financial transactions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FaPlus />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>Create a new financial transaction with automatic debit/credit determination</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Transaction Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Received payment from customer"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={formData.accountType} onValueChange={handleAccountTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    placeholder="e.g., Cash, Sales Revenue"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select value={formData.transactionType} onValueChange={(value) => setFormData({ ...formData, transactionType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    placeholder="Auto-generated or enter your own"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Sales, Expenses"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add Transaction"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaFilter />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-account">Account Name</Label>
              <Select value={filters.accountName || "all"} onValueChange={(value) => setFilters({ ...filters, accountName: value === "all" ? "" : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts?.data?.map((account) => (
                    <SelectItem key={account._id} value={account.name}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-start-date">Start Date</Label>
              <Input
                id="filter-start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="filter-end-date">End Date</Label>
              <Input
                id="filter-end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{transaction?.description}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction?.transactionType)}`}>
                        {transaction?.transactionType}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(transaction?.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(transaction?.amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Ref: {transaction?.referenceNumber}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                      <div>
                      <span className="font-medium">Account:</span>
                      <div>{transaction?.accountName}</div>
                      <div className="text-gray-600">{transaction?.accountType}</div>
                    </div>
                    <div>
                      <span className="font-medium">Debit:</span>
                      <div className={transaction?.debit > 0 ? 'text-red-600 font-bold' : 'text-gray-400'}>
                        {formatCurrency(transaction?.debit)}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Credit:</span>
                      <div className={transaction?.credit > 0 ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {formatCurrency(transaction?.credit)}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <div className="text-gray-600">{transaction?.category || 'N/A'}</div>
                    </div>
                </div>
                {transaction?.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {transaction?.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTransactions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <FaEye className="h-8 w-8 mx-auto mb-2" />
              <p>No transactions found</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { 
  useGetAllAccountsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation 
} from "@/slices/admin/account";
import { useGetMinimalDonorsQuery } from "@/slices/admin/donor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Loading from "@/components/common/Loading";

export default function Account() {
  const { user } = useSelector((state) => state.auth);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDonorId, setSelectedDonorId] = useState("");

  const { data: accountsData, isLoading: accountsLoading } = useGetAllAccountsQuery({
    page: currentPage,
    limit: 10
  });

  // Use RTK Query for minimal donors
  const { data: minimalDonors = [], isLoading: donorsLoading } = useGetMinimalDonorsQuery();
  console.log("minimalDonors", minimalDonors);

  const [createTransaction, { isLoading: creating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updating }] = useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: deleting }] = useDeleteTransactionMutation();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const transactionType = watch("type");

  const handleCreateTransaction = async (data) => {
    try {
      const payload = {
        ...data,
        editor: { _id: user.id },
      };
      if (selectedDonorId) {
        payload.donorId = selectedDonorId;
      }
      await createTransaction(payload).unwrap();
      toast.success("Transaction created successfully");
      setIsAddDialogOpen(false);
      setSelectedDonorId("");
      reset();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create transaction");
    }
  };

  const handleUpdateTransaction = async (data) => {
    try {
      await updateTransaction({
        transactionId: editingTransaction._id,
        ...data
      }).unwrap();

      toast.success("Transaction updated successfully");
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
      reset();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(transactionId).unwrap();
        toast.success("Transaction deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete transaction");
      }
    }
  };

  const openEditDialog = (transaction) => {
    setEditingTransaction(transaction);
    setValue("type", transaction.type);
    setValue("amount", transaction.amount);
    setValue("comment", transaction.comment);
    setValue("category", transaction.category);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  // if (accountsLoading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Account Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-white hover:bg-blue-600 duration-300">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreateTransaction)} className="space-y-4">
              {/* Donor selection dropdown */}
              <div>
                <Label htmlFor="donor">Donor (optional)</Label>
                <Select
                  value={selectedDonorId || undefined}
                  onValueChange={setSelectedDonorId}
                  disabled={donorsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select donor (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {minimalDonors.map((donor) => (
                      <SelectItem key={donor._id} value={donor._id}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {donor.avatar && (
                            <img src={donor.avatar} alt={donor.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                          )}
                          {donor.name} {donor.phone ? `(${donor.phone})` : donor.email ? `(${donor.email})` : ''}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Transaction Type</Label>
                <Select onValueChange={(value) => setValue("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("amount", { required: "Amount is required", min: 0 })}
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sadaqah">Sadaqah</SelectItem>
                    <SelectItem value="zakat">Zakat</SelectItem>
                    <SelectItem value="fitrah">Fitrah</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comment">Comment</Label>
                <Input {...register("comment")} placeholder="Optional comment" />
              </div>
              <Button type="submit" disabled={creating} className="w-full">
                {creating ? "Creating..." : "Create Transaction"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountsData?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(accountsData?.accounts?.reduce((sum, account) => sum + account.balance, 0) || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {accountsData?.accounts?.reduce((sum, account) => sum + account.transactions.length, 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Balance</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Total Transactions</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Last Updated</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accountsData?.accounts?.map((account) => (
                  <tr key={account._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      <div>
                        <div className="font-medium">{account.user?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{account.user?.email || "N/A"}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(account.balance)}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{account.transactions.length}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(account.updatedAt)}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAccount(account)}
                        className="mr-2"
                      >
                        View Transactions
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {accountsData?.totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {accountsData.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(accountsData.totalPages, prev + 1))}
                disabled={currentPage === accountsData.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Account Transactions */}
      {/* {selectedAccount && (
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions for {selectedAccount.user?.name || selectedAccount.user?.email}
              <span className="ml-2 text-sm font-normal">
                (Balance: {formatCurrency(selectedAccount.balance)})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Comment</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Editor</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAccount.transactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{formatDate(transaction.date)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">{transaction.category}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.comment || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.editor?.name || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(transaction)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTransaction(transaction._id)}
                            disabled={deleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateTransaction)} className="space-y-4">
            <div>
              <Label htmlFor="type">Transaction Type</Label>
              <Select onValueChange={(value) => setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register("amount", { required: "Amount is required", min: 0 })}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sadaqah">Sadaqah</SelectItem>
                  <SelectItem value="zakat">Zakat</SelectItem>
                  <SelectItem value="fitrah">Fitrah</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comment">Comment</Label>
              <Input {...register("comment")} placeholder="Optional comment" />
            </div>

            <Button type="submit" disabled={updating} className="w-full">
              {updating ? "Updating..." : "Update Transaction"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
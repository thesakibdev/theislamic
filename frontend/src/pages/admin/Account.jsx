import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  useGetAllAccountsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
  useGetAccountSummaryQuery,
} from "@/slices/admin/account";
import { useGetMinimalDonorsQuery } from "@/slices/admin/donor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";
import Loading from "@/components/common/Loading";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import AccountSummary from "@/components/admin/AccountSummary";
import TransactionsTable from "@/components/admin/TransactionsTable";

export default function Account() {
  const { user } = useSelector((state) => state.auth);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isIncomeBreakdownDialogOpen, setIsIncomeBreakdownDialogOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDonorId, setSelectedDonorId] = useState("");

  const { data: accountsData, isLoading: accountsLoading } =
    useGetAllAccountsQuery({
      page: currentPage,
      limit: 10,
    });

  // Use RTK Query for minimal donors
  const { data: minimalDonors = [], isLoading: donorsLoading } =
    useGetMinimalDonorsQuery();
  console.log("minimalDonors", minimalDonors);

  // Transactions and summary hooks
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetTransactionsQuery({ page: currentPage, limit: 10 });
  const { data: summary, isLoading: summaryLoading } =
    useGetAccountSummaryQuery();
  console.log("summary", summary);
  console.log("transactionsData", transactionsData);

  const [createTransaction, { isLoading: creating }] =
    useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updating }] =
    useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: deleting }] =
    useDeleteTransactionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
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
        ...data,
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  // if (accountsLoading) return <Loading />;

  // ExcelJS download handler
  const handleDownloadExcel = async () => {
    if (!transactionsData?.transactions?.length) return;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    // Define columns
    worksheet.columns = [
      { header: "Date", key: "date", width: 22 },
      { header: "Type", key: "type", width: 12 },
      { header: "Amount", key: "amount", width: 16 },
      { header: "Category", key: "category", width: 16 },
      { header: "Comment", key: "comment", width: 24 },
      { header: "Editor", key: "editor", width: 20 },
    ];

    // Add rows
    transactionsData.transactions.forEach((t) => {
      worksheet.addRow({
        date: formatDate(t.date),
        type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        amount: (t.type === "income" ? "+" : "-") + t.amount,
        category: t.category,
        comment: t.comment || "-",
        editor: t.editor?.name || "N/A",
      });
    });

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 24;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 13 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2563EB" }, // Tailwind blue-600
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      row.height = 20;
      row.eachCell((cell) => {
        cell.font = { size: 12 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Auto filter
    worksheet.autoFilter = {
      from: 'A1',
      to: 'F1'
    };

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "transactions.xlsx");
  };

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
            <form
              onSubmit={handleSubmit(handleCreateTransaction)}
              className="space-y-4"
            >
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
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {donor.avatar && (
                            <img
                              src={donor.avatar}
                              alt={donor.name}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                              }}
                            />
                          )}
                          {donor.name}{" "}
                          {donor.phone
                            ? `(${donor.phone})`
                            : donor.email
                            ? `(${donor.email})`
                            : ""}
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
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    required: "Amount is required",
                    min: 0,
                  })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.amount.message}
                  </p>
                )}
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
                <Input
                  {...register("comment")}
                  placeholder="Optional comment"
                />
              </div>
              <Button type="submit" disabled={creating} className="w-full">
                {creating ? "Creating..." : "Create Transaction"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Summary Cards */}
      <AccountSummary
        summary={summary}
        onIncomeBreakdownOpen={() => setIsIncomeBreakdownDialogOpen(true)}
      />
      {/* Transactions Table (Excel-like) */}
      {transactionsData?.transactions?.length > 0 && (
        <TransactionsTable
          transactionsData={transactionsData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onDownloadExcel={handleDownloadExcel}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleUpdateTransaction)}
            className="space-y-4"
          >
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
                {...register("amount", {
                  required: "Amount is required",
                  min: 0,
                })}
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

      {/* Income Breakdown Details Dialog */}
      <Dialog
        open={isIncomeBreakdownDialogOpen}
        onOpenChange={setIsIncomeBreakdownDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Income Breakdown Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Sadaqah</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(summary?.incomeBreakdown?.sadaqah || 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {summary?.incomeBreakdown?.sadaqah > 0
                      ? `${(
                          (summary.incomeBreakdown.sadaqah /
                            summary.totalIncome) *
                          100
                        ).toFixed(1)}% of total income`
                      : "0% of total income"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Zakat</span>
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(summary?.incomeBreakdown?.zakat || 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {summary?.incomeBreakdown?.zakat > 0
                      ? `${(
                          (summary.incomeBreakdown.zakat /
                            summary.totalIncome) *
                          100
                        ).toFixed(1)}% of total income`
                      : "0% of total income"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Fitrah</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(summary?.incomeBreakdown?.fitrah || 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {summary?.incomeBreakdown?.fitrah > 0
                      ? `${(
                          (summary.incomeBreakdown.fitrah /
                            summary.totalIncome) *
                          100
                        ).toFixed(1)}% of total income`
                      : "0% of total income"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Other</span>
                  </div>
                  <div className="text-xl font-bold text-yellow-600">
                    {formatCurrency(summary?.incomeBreakdown?.other || 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {summary?.incomeBreakdown?.other > 0
                      ? `${(
                          (summary.incomeBreakdown.other /
                            summary.totalIncome) *
                          100
                        ).toFixed(1)}% of total income`
                      : "0% of total income"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Total Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Income</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(summary?.totalIncome || 0)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Breakdown of all income categories and their percentages
                </div>
              </CardContent>
            </Card>

            {/* Additional Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Highest Category</div>
                <div className="text-lg font-semibold">
                  {(() => {
                    const breakdown = summary?.incomeBreakdown || {};
                    const categories = Object.entries(breakdown);
                    if (categories.length === 0) return "N/A";

                    const maxCategory = categories.reduce(
                      (max, [key, value]) =>
                        value > max.value ? { key, value } : max,
                      { key: categories[0][0], value: categories[0][1] }
                    );

                    return (
                      maxCategory.key.charAt(0).toUpperCase() +
                      maxCategory.key.slice(1)
                    );
                  })()}
                </div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  Categories with Income
                </div>
                <div className="text-lg font-semibold">
                  {(() => {
                    const breakdown = summary?.incomeBreakdown || {};
                    return Object.values(breakdown).filter((value) => value > 0)
                      .length;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

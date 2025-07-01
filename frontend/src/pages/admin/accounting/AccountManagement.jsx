import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import { useCreateAccountMutation, useGetAllAccountsQuery, useUpdateAccountMutation } from "@/slices/admin/accounting";
import { toast } from "react-toastify";

export default function AccountManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountType, setAccountType] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: accounts, isLoading } = useGetAllAccountsQuery({ active: activeFilter === "all" ? undefined : activeFilter === "active" });
  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });

  const accountTypes = [
    { value: "Asset", label: "Asset" },
    { value: "Liability", label: "Liability" },
    { value: "Equity", label: "Equity" },
    { value: "Revenue", label: "Revenue" },
    { value: "Expense", label: "Expense" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      Asset: 'text-green-600 bg-green-100',
      Liability: 'text-red-600 bg-red-100',
      Equity: 'text-blue-600 bg-blue-100',
      Revenue: 'text-purple-600 bg-purple-100',
      Expense: 'text-orange-600 bg-orange-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await createAccount(formData).unwrap();
      toast.success("Account created successfully!");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", type: "", description: "" });
    } catch (error) {
      toast.error(error.data?.message || "Failed to create account");
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      await updateAccount({ id: selectedAccount._id, ...formData }).unwrap();
      toast.success("Account updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedAccount(null);
      setFormData({ name: "", type: "", description: "" });
    } catch (error) {
      toast.error(error.data?.message || "Failed to update account");
    }
  };

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      description: account.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const filteredAccounts = accounts?.data?.filter(account => {
    if (accountType && account?.type !== accountType) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Account Management</h2>
          <p className="text-gray-600">Create and manage your chart of accounts</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FaPlus />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>Add a new account to your chart of accounts</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Cash, Accounts Receivable"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Account Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={accountType || "all"} onValueChange={setAccountType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {accountTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Accounts List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => (
            <Card key={account._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                                         <CardTitle className="text-lg">{account?.name}</CardTitle>
                     <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account?.type)}`}>
                       {account?.type}
                     </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(account)}
                    >
                      <FaEdit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                                 {account?.description && (
                   <CardDescription>{account?.description}</CardDescription>
                 )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Balance:</span>
                                         <span className={`font-bold ${account?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {formatCurrency(account?.balance)}
                     </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                                         <span className={`text-sm ${account?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                       {account?.isActive ? 'Active' : 'Inactive'}
                     </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                                         <span className="text-sm text-gray-600">
                       {new Date(account?.createdAt).toLocaleDateString()}
                     </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update account information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAccount} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Account Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cash, Accounts Receivable"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Account Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
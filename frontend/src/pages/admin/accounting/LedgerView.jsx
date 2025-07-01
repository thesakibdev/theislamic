import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAllAccountsQuery, useGetAccountLedgerQuery } from "@/slices/admin/accounting";
import { FaBookOpen } from "react-icons/fa";

export default function LedgerView() {
  const { data: accounts } = useGetAllAccountsQuery();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const { data: ledger, isLoading } = useGetAccountLedgerQuery(
    selectedAccount
      ? { accountName: selectedAccount, startDate: dateRange.startDate || undefined, endDate: dateRange.endDate || undefined }
      : { skip: true }
  );
  const ledgerEntries = ledger?.data?.ledgerEntries ?? [];
  const account = ledger?.data?.account;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Ledger</h2>
      <p className="text-gray-600 mb-4">View account-wise transaction history and running balance</p>
      <div className="flex gap-4 items-end mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Account</label>
          <select
            className="border rounded px-3 py-2 w-64"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">Select Account</option>
            {accounts?.data?.map((acc) => (
              <option key={acc._id} value={acc.name}>
                {acc.name} ({acc.type})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : selectedAccount && ledgerEntries.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{account?.name} Ledger</CardTitle>
            <CardDescription>Type: {account?.type} | Current Balance: <span className={account?.balance >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(account?.balance)}</span></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Ref</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Debit</th>
                    <th className="px-4 py-2 text-right">Credit</th>
                    <th className="px-4 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map((entry, idx) => (
                    <tr key={idx} className="border-b">
                                           <td className="px-4 py-2">{new Date(entry?.date).toLocaleDateString()}</td>
                     <td className="px-4 py-2">{entry?.referenceNumber}</td>
                     <td className="px-4 py-2">{entry?.description}</td>
                     <td className="px-4 py-2 text-right text-red-600">{formatCurrency(entry?.debit)}</td>
                     <td className="px-4 py-2 text-right text-green-600">{formatCurrency(entry?.credit)}</td>
                     <td className="px-4 py-2 text-right font-bold">{formatCurrency(entry?.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : selectedAccount ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <FaBookOpen className="h-8 w-8 mx-auto mb-2" />
              <p>No ledger entries found for this account</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
} 
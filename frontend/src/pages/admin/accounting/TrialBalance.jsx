import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTrialBalanceQuery } from "@/slices/admin/accounting";

export default function TrialBalance() {
  const { data: trialBalance, isLoading } = useGetTrialBalanceQuery();
  const data = trialBalance?.data ?? {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Trial Balance</h2>
      <p className="text-gray-600 mb-4">Debits and credits as of {data.asOfDate ? new Date(data.asOfDate).toLocaleDateString() : 'today'}</p>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Trial Balance</CardTitle>
            <CardDescription>Total Debits: {formatCurrency(data?.totalDebits)} | Total Credits: {formatCurrency(data?.totalCredits)} | {data?.isBalanced ? <span className="text-green-600 font-bold">Balanced</span> : <span className="text-red-600 font-bold">Not Balanced</span>}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Account</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-right">Debit</th>
                    <th className="px-4 py-2 text-right">Credit</th>
                    <th className="px-4 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.trialBalance?.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">{row?.accountName}</td>
                      <td className="px-4 py-2">{row?.accountType}</td>
                      <td className="px-4 py-2 text-right text-red-600">{formatCurrency(row?.debitTotal)}</td>
                      <td className="px-4 py-2 text-right text-green-600">{formatCurrency(row?.creditTotal)}</td>
                      <td className="px-4 py-2 text-right font-bold">{formatCurrency(row?.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
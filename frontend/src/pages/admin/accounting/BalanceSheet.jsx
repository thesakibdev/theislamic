import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBalanceSheetQuery } from "@/slices/admin/accounting";

export default function BalanceSheet() {
  const { data: balanceSheet, isLoading } = useGetBalanceSheetQuery();
  const data = balanceSheet?.data ?? {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Balance Sheet</h2>
      <p className="text-gray-600 mb-4">Assets, Liabilities, and Equity as of {data.asOfDate ? new Date(data.asOfDate).toLocaleDateString() : 'today'}</p>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>Total: {formatCurrency(data?.totalAssets)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                                 {data.assets?.map((asset, idx) => (
                   <li key={idx} className="flex justify-between">
                     <span>{asset?.accountName}</span>
                     <span className="font-bold text-green-600">{formatCurrency(asset?.balance)}</span>
                   </li>
                 ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Liabilities</CardTitle>
              <CardDescription>Total: {formatCurrency(data?.totalLiabilities)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.liabilities?.map((liab, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{liab?.accountName}</span>
                    <span className="font-bold text-red-600">{formatCurrency(liab?.balance)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Equity</CardTitle>
              <CardDescription>Total: {formatCurrency(data?.totalEquity)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.equity?.map((eq, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{eq?.accountName}</span>
                    <span className="font-bold text-blue-600">{formatCurrency(eq?.balance)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      <Card>
        <CardContent className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <span className="font-bold">Total Assets:</span> {formatCurrency(data?.totalAssets)}
          </div>
          <div>
            <span className="font-bold">Total Liabilities + Equity:</span> {formatCurrency(data?.totalLiabilitiesAndEquity)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
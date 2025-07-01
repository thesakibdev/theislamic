import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetIncomeStatementQuery } from "@/slices/admin/accounting";

export default function IncomeStatement() {
  const { data: incomeStatement, isLoading } = useGetIncomeStatementQuery();
  const data = incomeStatement?.data ?? {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Income Statement</h2>
      <p className="text-gray-600 mb-4">Revenue and Expenses for the selected period</p>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Total: {formatCurrency(data?.totalRevenue)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.revenue?.map((rev, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{rev?.accountName}</span>
                    <span className="font-bold text-green-600">{formatCurrency(rev?.amount)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Total: {formatCurrency(data?.totalExpenses)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.expenses?.map((exp, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{exp?.accountName}</span>
                    <span className="font-bold text-red-600">{formatCurrency(exp?.amount)}</span>
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
            <span className="font-bold">Total Revenue:</span> {formatCurrency(data?.totalRevenue)}
          </div>
          <div>
            <span className="font-bold">Total Expenses:</span> {formatCurrency(data?.totalExpenses)}
          </div>
          <div>
            <span className="font-bold">Net Income:</span> <span className={data?.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(data?.netIncome)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
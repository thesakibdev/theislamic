import { Button } from "@/components/ui/button";

export default function TransactionsTable({
  transactionsData,
  currentPage,
  onPageChange,
  onDownloadExcel,
  formatCurrency,
  formatDate,
}) {
  return (
    <div className="mt-8">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">All Transactions</h2>
        <Button onClick={onDownloadExcel} variant="outline">
          Download as Excel
        </Button>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Comment</th>
              <th className="border border-gray-300 px-4 py-2">Editor</th>
            </tr>
          </thead>
          <tbody>
            {transactionsData.transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{formatDate(transaction.date)}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2 font-bold">
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{transaction.category}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.comment || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.editor?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {transactionsData.totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {transactionsData.currentPage} of {transactionsData.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              onPageChange(
                Math.min(transactionsData.totalPages, currentPage + 1)
              )
            }
            disabled={currentPage === transactionsData.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 
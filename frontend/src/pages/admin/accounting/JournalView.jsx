import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetJournalQuery } from "@/slices/admin/accounting";
import { FaBook } from "react-icons/fa";

export default function JournalView() {
  const { data: journal, isLoading } = useGetJournalQuery({ limit: 50 });
  const journalEntries = journal?.data ?? [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">General Journal</h2>
      <p className="text-gray-600 mb-4">All double-entry journal entries</p>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <Card key={entry._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{entry?.description}</CardTitle>
                    <CardDescription>
                      {new Date(entry?.date).toLocaleDateString()} • Ref: {entry?.referenceNumber}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Total Debit</div>
                    <div className="font-bold text-red-600">{formatCurrency(entry?.totalDebit)}</div>
                    <div className="text-xs text-gray-600">Total Credit</div>
                    <div className="font-bold text-green-600">{formatCurrency(entry?.totalCredit)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entry?.entries?.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{line?.accountName}</span>
                      <span className="text-gray-600">({line?.accountType})</span>
                      <span className="text-red-600">{line?.debit > 0 ? formatCurrency(line?.debit) : ""}</span>
                      <span className="text-green-600">{line?.credit > 0 ? formatCurrency(line?.credit) : ""}</span>
                    </div>
                  ))}
                </div>
                {entry?.notes && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-medium">Notes:</span> {entry?.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 
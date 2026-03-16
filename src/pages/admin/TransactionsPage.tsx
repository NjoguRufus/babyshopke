import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/dashboard/StatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getTransactions } from "../../../backend/services/transactionService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleString();
  return new Date(v).toLocaleString();
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getTransactions();
        setTransactions(list);
      } catch (e) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalValue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const successCount = transactions.filter((t) => t.status === "success" || t.status === "paid").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const failedCount = transactions.filter((t) => t.status === "failed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground">Payment transactions.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold">{transactions.length}</p>
        </div>
        <div className="rounded-2xl border bg-emerald-50 border-emerald-200 p-4">
          <p className="text-xs text-muted-foreground">Successful</p>
          <p className="text-xl font-bold">{successCount}</p>
        </div>
        <div className="rounded-2xl border bg-amber-50 border-amber-200 p-4">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-xl font-bold">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total value</p>
          <p className="text-xl font-bold">KES {totalValue.toLocaleString()}</p>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && transactions.length === 0 && (
        <EmptyState title="No transactions" description="Payment transactions will appear here." />
      )}

      {!loading && transactions.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.transactionCode || "—"}</TableCell>
                  <TableCell className="text-xs">{t.orderId ? String(t.orderId).slice(0, 8) + "…" : "—"}</TableCell>
                  <TableCell className="text-xs capitalize">{t.method || "—"}</TableCell>
                  <TableCell className="text-xs">KES {Number(t.amount || 0).toLocaleString()}</TableCell>
                  <TableCell><StatusBadge value={t.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;

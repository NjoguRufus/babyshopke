import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getAdminPosSessions } from "../../../backend/services/adminPosService.js";

const formatDateTime = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleString();
  return new Date(v).toLocaleString();
};

const AdminPosHistoryPage = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getAdminPosSessions();
        setSessions(list.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)));
      } catch (e) {
        console.error(e);
        setError("Failed to load POS sessions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">POS History</h1>
        <p className="text-sm text-muted-foreground">
          See completed in-store sales recorded from the Products (POS) screen.
        </p>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && sessions.length === 0 && !error && (
        <EmptyState
          title="No POS sessions yet"
          description="Sales recorded from the POS screen will appear here."
        />
      )}

      {!loading && sessions.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cashier</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs truncate max-w-[120px]">
                    {s.cashierUserId || "—"}
                  </TableCell>
                  <TableCell className="text-xs truncate max-w-[120px]">
                    {s.customerName || "Walk-in"}
                  </TableCell>
                  <TableCell className="text-xs capitalize">
                    {s.paymentMethod || "cash"}
                  </TableCell>
                  <TableCell className="text-xs">
                    KES {Number(s.total || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {(s.items || []).reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(s.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminPosHistoryPage;


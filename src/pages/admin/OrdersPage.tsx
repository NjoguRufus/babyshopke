import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/dashboard/StatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from "../../../backend/services/orderService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleString();
  return new Date(v).toLocaleString();
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getAllOrders();
        setOrders(list);
      } catch (e) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (paymentFilter !== "all") list = list.filter((o) => o.paymentStatus === paymentFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => (o.orderNumber || "").toLowerCase().includes(q) || (o.userId || "").toLowerCase().includes(q));
    }
    return list;
  }, [orders, statusFilter, paymentFilter, search]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    try {
      const updated = await updatePaymentStatus(orderId, paymentStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track orders.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Order number or customer..."
          className="w-full md:max-w-xs rounded-lg border px-4 py-2 text-sm"
        />
        <select className="rounded-lg border px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="all">All payment</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && filtered.length === 0 && (
        <EmptyState title="No orders" description="Orders will appear here when customers checkout." />
      )}

      {!loading && filtered.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                  <TableCell className="text-xs truncate max-w-[120px]">{o.userId}</TableCell>
                  <TableCell className="text-xs">KES {Number(o.totalAmount || 0).toLocaleString()}</TableCell>
                  <TableCell><StatusBadge value={o.status} /></TableCell>
                  <TableCell><StatusBadge value={o.paymentStatus} /></TableCell>
                  <TableCell className="text-xs">{(o.items || []).length}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrdersByUser } from "../../../backend/services/orderService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleDateString();
  return new Date(v).toLocaleDateString();
};

const AccountOrdersPage = () => {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!firebaseUser) return;
      setLoading(true);
      try {
        const list = await getOrdersByUser(firebaseUser.uid);
        setOrders(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [firebaseUser]);

  if (!firebaseUser) {
    return <p className="text-sm text-muted-foreground">Log in to see your orders.</p>;
  }

  if (loading) return <LoadingSpinner />;

  if (!loading && orders.length === 0) {
    return <EmptyState title="No orders yet" description="Your orders will appear here after checkout." />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                <TableCell className="text-xs capitalize">{o.status}</TableCell>
                <TableCell className="text-xs capitalize">{o.paymentStatus}</TableCell>
                <TableCell className="text-xs">KES {Number(o.totalAmount || 0).toLocaleString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AccountOrdersPage;


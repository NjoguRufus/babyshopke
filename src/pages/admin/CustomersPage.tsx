import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/dashboard/StatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getUsers } from "../../../backend/services/userService.js";
import { getAllOrders } from "../../../backend/services/orderService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleDateString();
  return new Date(v).toLocaleDateString();
};

const CustomersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [u, o] = await Promise.all([getUsers(), getAllOrders()]);
        setUsers(u);
        setOrders(o);
      } catch (e) {
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ordersByUser = orders.reduce((acc, o) => {
    acc[o.userId] = (acc[o.userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const customers = users.filter((u) => u.role === "customer" || !u.role);
  const withFamily = users.filter((u) => u.familyAccountId).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground">Customer accounts and activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Users</p>
          <p className="text-xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Customers</p>
          <p className="text-xl font-bold">{customers.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">With Family</p>
          <p className="text-xl font-bold">{withFamily}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-xl font-bold">{orders.length}</p>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && users.length === 0 && (
        <EmptyState title="No customers" description="Customer accounts will appear here after signup." />
      )}

      {!loading && users.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="text-sm font-medium">{u.fullName || "—"}</TableCell>
                  <TableCell className="text-xs">{u.email}</TableCell>
                  <TableCell className="text-xs">{u.phone || "—"}</TableCell>
                  <TableCell><StatusBadge value={u.role || "customer"} /></TableCell>
                  <TableCell className="text-xs">{u.familyAccountId ? "Yes" : "—"}</TableCell>
                  <TableCell className="text-xs">{ordersByUser[u.id] ?? 0}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                  <TableCell><StatusBadge value={u.isActive !== false ? "active" : "inactive"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;

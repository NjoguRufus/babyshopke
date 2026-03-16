import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Package, ShoppingBag, TrendingDown, Banknote, Receipt } from "lucide-react";
import { getDashboardStats, getRecentOrders, getRecentActivities } from "../../../backend/services/adminService.js";
import { getProducts } from "../../../backend/services/productService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleDateString();
  return new Date(v).toLocaleDateString();
};

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, orders, acts, prods] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(8),
          getRecentActivities(10),
          getProducts(),
        ]);
        setStats(s);
        setRecentOrders(orders);
        setActivities(acts);
        setProducts(prods);
      } catch (e) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const topViewed = [...products].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0)).slice(0, 5);
  const topSelling = [...products].sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0)).slice(0, 5);
  const lowStock = products.filter((p) => (p.stockQty ?? 0) <= (p.lowStockThreshold ?? 5)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store.</p>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="h-4 w-4" />} />
            <StatCard label="Total Products" value={stats.totalProducts} icon={<Package className="h-4 w-4" />} />
            <StatCard label="Total Orders" value={stats.totalOrders} icon={<ShoppingBag className="h-4 w-4" />} />
            <StatCard label="Pending Orders" value={stats.pendingOrders} tone="warning" icon={<ShoppingBag className="h-4 w-4" />} />
            <StatCard label="Delivered" value={stats.deliveredOrders} tone="success" />
            <StatCard label="Low Stock" value={stats.lowStockProducts} tone="danger" icon={<TrendingDown className="h-4 w-4" />} />
            <StatCard label="Total Revenue" value={`KES ${Number(stats.totalRevenue || 0).toLocaleString()}`} icon={<Banknote className="h-4 w-4" />} />
            <StatCard label="Transactions" value={stats.totalTransactions} icon={<Receipt className="h-4 w-4" />} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <h2 className="text-sm font-semibold p-4 border-b">Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <EmptyState title="No orders yet" description="Orders will appear here." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                        <TableCell className="text-xs">KES {Number(o.totalAmount || 0).toLocaleString()}</TableCell>
                        <TableCell><StatusBadge value={o.status} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <h2 className="text-sm font-semibold p-4 border-b">Low Stock Products</h2>
              {lowStock.length === 0 ? (
                <EmptyState title="No low stock" description="All products are well stocked." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStock.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-sm">{p.name}</TableCell>
                        <TableCell className="text-xs font-mono">{p.sku}</TableCell>
                        <TableCell className="text-xs">{p.stockQty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <h2 className="text-sm font-semibold p-4 border-b">Recent Activity</h2>
            {activities.length === 0 ? (
              <EmptyState title="No activity yet" description="Activity logs will appear here." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-sm">{a.action || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.targetType || "—"} {a.targetId ? `#${String(a.targetId).slice(0, 8)}` : ""}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;

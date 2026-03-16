import { FormEvent, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getProducts, createProduct, updateProduct } from "../../../backend/services/productService.js";
import { getLowStockProducts, getInventoryHistory } from "../../../backend/services/inventoryService.js";
import { getCategories } from "../../../backend/services/categoryService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleString();
  return new Date(v).toLocaleString();
};

const InventoryPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    sku: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    stockQty: "",
    lowStockThreshold: "5",
    brand: "",
    ageMinMonths: "",
    ageMaxMonths: "",
    ageGroupTags: "",
    gender: "unisex",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [prods, low, cats] = await Promise.all([
          getProducts(),
          getLowStockProducts().catch(() => []),
          getCategories().catch(() => []),
        ]);
        setProducts(prods);
        setLowStock(low);
        setCategories(cats);
        const firstLow = low[0];
        if (firstLow?.id) {
          const h = await getInventoryHistory(firstLow.id);
          setHistory(h.slice(0, 15));
        } else {
          setHistory([]);
        }
      } catch (e) {
        setError("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const outOfStock = products.filter((p) => (p.stockQty ?? 0) === 0).length;
  const activeCount = products.filter((p) => p.isActive !== false).length;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  const toggleActive = async (product: any) => {
    try {
      const updated = await updateProduct(product.id, { isActive: !product.isActive });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, ...updated } : p)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Add and manage products, then track stock levels.</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? "Close" : "Add item"}
        </Button>
      </div>

      {showCreate && (
        <form
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            try {
              const created = await createProduct({
                name: form.name.trim(),
                slug: (form.slug || form.name).trim().toLowerCase().replace(/\s+/g, "-"),
                categoryId: form.categoryId || null,
                sku: form.sku || form.name.trim().toLowerCase().replace(/\s+/g, "-"),
                description: form.description,
                shortDescription: form.shortDescription,
                price: Number(form.price) || 0,
                comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
                stockQty: Number(form.stockQty) || 0,
                lowStockThreshold: Number(form.lowStockThreshold) || 5,
                brand: form.brand,
                ageMinMonths: form.ageMinMonths ? Number(form.ageMinMonths) : 0,
                ageMaxMonths: form.ageMaxMonths ? Number(form.ageMaxMonths) : 60,
                ageGroupTags: form.ageGroupTags
                  ? form.ageGroupTags.split(",").map((t) => t.trim()).filter(Boolean)
                  : [],
                gender: form.gender,
                isFeatured: form.isFeatured,
                isActive: form.isActive,
                images: [],
              });
              setProducts((prev) => [created, ...prev]);
              setForm({
                name: "",
                slug: "",
                categoryId: "",
                sku: "",
                description: "",
                shortDescription: "",
                price: "",
                comparePrice: "",
                stockQty: "",
                lowStockThreshold: "5",
                brand: "",
                ageMinMonths: "",
                ageMaxMonths: "",
                ageGroupTags: "",
                gender: "unisex",
                isFeatured: false,
                isActive: true,
              });
              setShowCreate(false);
            } catch (err) {
              console.error(err);
            }
          }}
          className="rounded-2xl border bg-card shadow-sm p-4 space-y-4"
        >
          <h2 className="text-sm font-semibold">Add product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <label className="font-medium text-xs">Name</label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Slug</label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated if left blank"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Category</label>
              <select
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">SKU</label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Price (KES)</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Compare at price (optional)</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.comparePrice}
                onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Stock quantity</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.stockQty}
                onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Low stock threshold</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.lowStockThreshold}
                onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Brand</label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Age min (months)</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.ageMinMonths}
                onChange={(e) => setForm((f) => ({ ...f, ageMinMonths: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Age max (months)</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.ageMaxMonths}
                onChange={(e) => setForm((f) => ({ ...f, ageMaxMonths: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Age group tags (comma separated)</label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.ageGroupTags}
                onChange={(e) => setForm((f) => ({ ...f, ageGroupTags: e.target.value }))}
                placeholder="e.g. 0-3m,3-6m"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-xs">Gender</label>
              <select
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="unisex">Unisex</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <label className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              />
              <span>Featured</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              <span>Active</span>
            </label>
          </div>
          <Button type="submit" size="sm">
            Save product
          </Button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Products</p>
          <p className="text-xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-xl font-bold">{activeCount}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Featured</p>
          <p className="text-xl font-bold">{featuredCount}</p>
        </div>
        <div className="rounded-2xl border bg-amber-50 border-amber-200 p-4">
          <p className="text-xs text-muted-foreground">Low Stock</p>
          <p className="text-xl font-bold">{lowStock.length}</p>
        </div>
        <div className="rounded-2xl border bg-red-50 border-red-200 p-4">
          <p className="text-xs text-muted-foreground">Out of Stock</p>
          <p className="text-xl font-bold">{outOfStock}</p>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && (
        <>
          <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
            <h2 className="text-sm font-semibold p-4 border-b">Products</h2>
            {products.length === 0 ? (
              <EmptyState title="No products" description="Add products to manage inventory." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.slice(0, 20).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{p.name}</TableCell>
                      <TableCell className="text-xs font-mono">{p.sku || "—"}</TableCell>
                      <TableCell className="text-xs">{p.stockQty ?? 0}</TableCell>
                      <TableCell className="text-xs">{p.lowStockThreshold ?? 5}</TableCell>
                      <TableCell className="text-xs">
                        {(p.stockQty ?? 0) <= (p.lowStockThreshold ?? 5) ? (
                          <span className="text-amber-600 font-medium">Low stock</span>
                        ) : (
                          <span className="text-emerald-600">OK</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => toggleActive(p)}>
                          {p.isActive !== false ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
            <h2 className="text-sm font-semibold p-4 border-b">Recent inventory history</h2>
            {history.length === 0 ? (
              <EmptyState title="No history" description="Stock movements will appear here." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Previous</TableHead>
                    <TableHead>New</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-xs">{h.type}</TableCell>
                      <TableCell className="text-xs">{h.quantity}</TableCell>
                      <TableCell className="text-xs">{h.previousStock}</TableCell>
                      <TableCell className="text-xs">{h.newStock}</TableCell>
                      <TableCell className="text-xs truncate max-w-[140px]">{h.reason || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(h.createdAt)}</TableCell>
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

export default InventoryPage;

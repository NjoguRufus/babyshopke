import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "../../../backend/services/productService.js";
import { getCategories } from "../../../backend/services/categoryService.js";
import { createAdminPosSession } from "../../../backend/services/adminPosService.js";

type PosItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

const ProductsPage = () => {
  const { firebaseUser } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [posItems, setPosItems] = useState<PosItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mpesa">("cash");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [prod, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prod);
        setCategories(cats);
      } catch (e) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isActive !== false);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => {
        const byText =
          (p.name || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q);

        const byAge =
          typeof p.ageMinMonths === "number" &&
          typeof p.ageMaxMonths === "number" &&
          q.match(/\d+/) &&
          (() => {
            const num = Number(q.match(/\d+/)![0]);
            return num >= (p.ageMinMonths ?? 0) && num <= (p.ageMaxMonths ?? 120);
          })();

        return byText || byAge;
      });
    }

    if (ageFilter !== "all") {
      list = list.filter((p) => {
        const tags: string[] = p.ageGroupTags || [];
        if (tags.includes(ageFilter)) return true;

        if (typeof p.ageMinMonths === "number" && typeof p.ageMaxMonths === "number") {
          const map: Record<string, [number, number]> = {
            "0-3m": [0, 3],
            "3-6m": [3, 6],
            "6-12m": [6, 12],
            "1-3y": [12, 36],
            "3+y": [36, 120],
          };
          const range = map[ageFilter];
          if (!range) return true;
          const [min, max] = range;
          return (p.ageMinMonths ?? 0) <= max && (p.ageMaxMonths ?? 120) >= min;
        }

        return false;
      });
    }
    return list;
  }, [products, search, ageFilter]);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name || "—";

  const handleAddToPosCart = (product: any) => {
    if (product.isActive === false) return;
    if ((product.stockQty ?? 0) <= 0) return;

    setPosItems((items) => {
      const existing = items.find((i) => i.productId === product.id);
      if (existing) {
        return items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price || 0),
          quantity: 1,
        },
      ];
    });
  };

  const posTotal = posItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (posItems.length === 0 || posTotal <= 0) return;
    setCheckingOut(true);
    setCheckoutMessage(null);
    try {
      await createAdminPosSession({
        cashierUserId: firebaseUser?.uid || null,
        customerName: customerName.trim() || null,
        items: posItems,
        total: posTotal,
        paymentMethod,
      });
      setPosItems([]);
      setCustomerName("");
      setPaymentMethod("cash");
      setCheckoutMessage("POS sale recorded successfully.");
    } catch (e) {
      console.error(e);
      setCheckoutMessage("Failed to record checkout. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products (POS)</h1>
          <p className="text-sm text-muted-foreground">
            Use this screen at the counter to pick items and build an in-store cart.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1 flex flex-col md:flex-row gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, SKU, brand or age..."
                className="w-full md:max-w-sm rounded-lg border px-4 py-2 text-sm"
              />
              <select
                className="w-full md:w-36 rounded-lg border px-3 py-2 text-sm bg-background"
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
              >
                <option value="all">All ages</option>
                <option value="0-3m">0–3 months</option>
                <option value="3-6m">3–6 months</option>
                <option value="6-12m">6–12 months</option>
                <option value="1-3y">1–3 years</option>
                <option value="3+y">3+ years</option>
              </select>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border bg-card p-1 text-xs">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-full ${viewMode === "cards" ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setViewMode("cards")}
              >
                Cards
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-full ${viewMode === "list" ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>

          {loading && <LoadingSpinner />}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && filtered.length === 0 && (
            <EmptyState
              title="No products match your search"
              description="Adjust the search or age filter to see items."
            />
          )}

          {!loading && filtered.length > 0 && viewMode === "cards" && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((p) => {
                const disabled = p.isActive === false || (p.stockQty ?? 0) <= 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAddToPosCart(p)}
                    disabled={disabled}
                    className={`text-left rounded-2xl border bg-card p-3 shadow-sm hover:shadow-md transition-shadow ${
                      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {categoryName(p.categoryId)}
                    </p>
                    <p className="text-sm font-semibold line-clamp-2">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      SKU: {p.sku || "—"}
                    </p>
                    <p className="text-sm font-bold mt-2">
                      KES {Number(p.price || 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Stock: {p.stockQty ?? 0}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {!loading && filtered.length > 0 && viewMode === "list" && (
            <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-xs">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Product</th>
                    <th className="px-3 py-2 text-left font-medium">Category</th>
                    <th className="px-3 py-2 text-left font-medium">SKU</th>
                    <th className="px-3 py-2 text-left font-medium">Price</th>
                    <th className="px-3 py-2 text-left font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const disabled = p.isActive === false || (p.stockQty ?? 0) <= 0;
                    return (
                      <tr
                        key={p.id}
                        className={`border-b last:border-b-0 ${
                          disabled ? "opacity-60" : "hover:bg-muted/60 cursor-pointer"
                        }`}
                        onClick={() => !disabled && handleAddToPosCart(p)}
                      >
                        <td className="px-3 py-2 align-middle max-w-[220px] truncate">
                          {p.name}
                        </td>
                        <td className="px-3 py-2 align-middle text-xs text-muted-foreground">
                          {categoryName(p.categoryId)}
                        </td>
                        <td className="px-3 py-2 align-middle text-xs font-mono">
                          {p.sku || "—"}
                        </td>
                        <td className="px-3 py-2 align-middle text-xs">
                          KES {Number(p.price || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 align-middle text-xs">
                          {p.stockQty ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-3">
          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Admin cart</h2>
                <p className="text-[11px] text-muted-foreground">
                  Tap products to add them here during checkout.
                </p>
              </div>
              {posItems.length > 0 && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setPosItems([])}
                >
                  Clear
                </Button>
              )}
            </div>

            {posItems.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No items yet. Select a product to start a cart.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {posItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex-1">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.quantity} × KES {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right text-xs font-semibold">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-2 border-t mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Total</span>
                <span className="text-base font-bold">
                  KES {posTotal.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <input
                  className="w-full rounded-lg border px-3 py-1.5 bg-background"
                  placeholder="Customer name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <select
                  className="w-full rounded-lg border px-3 py-1.5 bg-background"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as "cash" | "mpesa")}
                >
                  <option value="cash">Cash</option>
                  <option value="mpesa">M-Pesa</option>
                </select>
              </div>
              <Button
                size="sm"
                className="w-full mt-1"
                disabled={posItems.length === 0 || posTotal <= 0 || checkingOut}
                onClick={handleCheckout}
              >
                {checkingOut ? "Processing..." : "Checkout & mark paid"}
              </Button>
              {checkoutMessage && (
                <p className="text-[11px] text-muted-foreground">{checkoutMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

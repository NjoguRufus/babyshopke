import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ShopToolbar from "@/components/ShopToolbar";
import CategoryFilter from "@/components/CategoryFilter";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getProducts } from "../../../backend/services/productService.js";
import { getCategories } from "../../../backend/services/categoryService.js";

type Product = any;

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [prod, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prod);
        setCategories(cats);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const productsWithCategory = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        categoryName: categories.find((c) => c.id === p.categoryId)?.name,
      })),
    [products, categories],
  );

  const filtered = useMemo(() => {
    let list = productsWithCategory;
    if (activeCategoryId) {
      list = list.filter((p) => p.categoryId === activeCategoryId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "featured") {
      list = [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [productsWithCategory, activeCategoryId, search, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <header className="mb-6 space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold">Shop Baby Essentials</h1>
          <p className="text-sm text-muted-foreground">
            Discover curated baby products by category, age, and more.
          </p>
        </header>

        <ShopToolbar search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} />
        <CategoryFilter
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          activeCategoryId={activeCategoryId}
          onChange={setActiveCategoryId}
        />

        {loading && <LoadingSpinner />}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search term."
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopPage;


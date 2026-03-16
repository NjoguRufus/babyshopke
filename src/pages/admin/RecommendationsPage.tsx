import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getFeaturedProductsList, getPopularProducts } from "../../../backend/services/recommendationService.js";
import { getFamilyAccounts } from "../../../backend/services/familyService.js";

const RecommendationsPage = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [feat, pop, fam] = await Promise.all([
          getFeaturedProductsList().catch(() => []),
          getPopularProducts().catch(() => []),
          getFamilyAccounts(),
        ]);
        setFeatured(feat);
        setPopular(pop);
        setFamilies(fam);
      } catch (e) {
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recommendations</h1>
        <p className="text-sm text-muted-foreground">Product recommendations by age and popularity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Featured products</p>
          <p className="text-xl font-bold">{featured.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Popular (by views)</p>
          <p className="text-xl font-bold">{popular.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Families with profiles</p>
          <p className="text-xl font-bold">{families.length}</p>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && (
        <>
          <div className="rounded-2xl border bg-card shadow-sm p-4">
            <h2 className="text-sm font-semibold mb-3">Featured products</h2>
            {featured.length === 0 ? (
              <EmptyState title="No featured products" description="Mark products as featured to show here." />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.slice(0, 8).map((p) => (
                  <div key={p.id} className="rounded-xl border p-3">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">KES {Number(p.price || 0).toLocaleString()}</p>
                    <p className="text-xs text-primary mt-1">Featured • In stock: {p.stockQty ?? 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-card shadow-sm p-4">
            <h2 className="text-sm font-semibold mb-3">Popular (most viewed)</h2>
            {popular.length === 0 ? (
              <EmptyState title="No data" description="Views will drive popular recommendations." />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popular.slice(0, 8).map((p) => (
                  <div key={p.id} className="rounded-xl border p-3">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Views: {p.totalViews ?? 0}</p>
                    <p className="text-xs">KES {Number(p.price || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationsPage;

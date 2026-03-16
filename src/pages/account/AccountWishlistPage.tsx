import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/ProductCard";
import { getWishlist } from "../../../backend/services/wishlistService.js";
import { getProductById } from "../../../backend/services/productService.js";

const AccountWishlistPage = () => {
  const { firebaseUser } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!firebaseUser) return;
      setLoading(true);
      try {
        const entries = await getWishlist(firebaseUser.uid);
        const uniqueIds = Array.from(new Set(entries.map((w: any) => w.productId)));
        const prods = await Promise.all(uniqueIds.map((id) => getProductById(id)));
        setProducts(prods.filter(Boolean));
      } finally {
        setLoading(false);
      }
    })();
  }, [firebaseUser]);

  if (!firebaseUser) {
    return <p className="text-sm text-muted-foreground">Log in to see your wishlist.</p>;
  }

  if (loading) return <LoadingSpinner />;

  if (!loading && products.length === 0) {
    return (
      <EmptyState
        title="No wishlist items"
        description="Tap the heart on any product to save it here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default AccountWishlistPage;


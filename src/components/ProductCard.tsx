import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommerce } from "@/context/CommerceContext";
import { useNavigate } from "react-router-dom";

type Props = {
  product: {
    id: string;
    name: string;
    slug?: string;
    images?: string[];
    price: number;
    comparePrice?: number | null;
    categoryName?: string;
    stockQty?: number;
  };
};

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  const { addToCart, wishlistProductIds, toggleWishlist } = useCommerce();
  const inWishlist = wishlistProductIds.includes(product.id);
  const outOfStock = (product.stockQty ?? 0) <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart({
      productId: product.id,
      sku: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
      stockSnapshot: product.stockQty ?? 0,
    });
  };

  return (
    <div className="group rounded-2xl border bg-card shadow-soft hover:shadow-card overflow-hidden flex flex-col">
      <div className="relative bg-secondary p-4">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-card/90 hover:bg-card shadow-soft transition-colors"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "text-accent fill-accent" : "text-muted-foreground"}`} />
        </button>
      </div>
      <div className="flex-1 p-4 space-y-2 flex flex-col">
        {product.categoryName && (
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{product.categoryName}</p>
        )}
        <button
          type="button"
          className="text-sm font-semibold text-left line-clamp-2 hover:underline"
          onClick={() =>
            navigate(
              product.slug ? `/product/${product.slug}` : `/product/${encodeURIComponent(product.id)}`,
            )
          }
        >
          {product.name}
        </button>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-extrabold text-foreground">
            KSH {product.price.toLocaleString()}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs line-through text-muted-foreground">
              KSH {product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {outOfStock ? "Out of stock" : "In stock"}
        </p>
        <Button
          size="sm"
          className="mt-2 w-full inline-flex items-center justify-center gap-2"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? "Sold out" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;


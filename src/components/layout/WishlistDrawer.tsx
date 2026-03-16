import { X, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCommerce } from "@/context/CommerceContext";
import EmptyState from "@/components/common/EmptyState";
import { useNavigate } from "react-router-dom";

const WishlistDrawer = () => {
  const { wishlistOpen, closeWishlist, wishlistProductIds } = useCommerce();
  const navigate = useNavigate();

  return (
    <Sheet open={wishlistOpen} onOpenChange={(open) => (open ? undefined : closeWishlist())}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle>Wishlist ({wishlistProductIds.length})</SheetTitle>
          <button
            type="button"
            onClick={closeWishlist}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {wishlistProductIds.length === 0 && (
            <EmptyState
              title="No saved items yet"
              description="Tap the heart icon on a product to save it to your wishlist."
              action={
                <Button
                  size="sm"
                  onClick={() => {
                    closeWishlist();
                    navigate("/shop");
                  }}
                >
                  Browse products
                </Button>
              }
            />
          )}

          {wishlistProductIds.length > 0 && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Wishlist items will appear here. Use the heart button on product cards to add or remove products.
              </p>
              <p className="flex items-center gap-2 text-xs">
                <Heart className="h-4 w-4 text-accent" />
                Wishlist product loading can be enhanced to show full product details.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;


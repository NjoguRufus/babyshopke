import { X, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCommerce } from "@/context/CommerceContext";
import EmptyState from "@/components/common/EmptyState";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { cartOpen, closeCart, cartItems, cartLoading, updateCartQuantity, removeFromCart } = useCommerce();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle>Cart ({cartItems.length})</SheetTitle>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartLoading && <p className="text-sm text-muted-foreground">Loading cart...</p>}
          {!cartLoading && cartItems.length === 0 && (
            <EmptyState
              title="Your cart is empty"
              description="Browse our products and add your baby essentials."
              action={
                <Button
                  size="sm"
                  onClick={() => {
                    closeCart();
                    navigate("/shop");
                  }}
                >
                  Go to shop
                </Button>
              }
            />
          )}

          {cartItems.map((item) => (
            <div key={item.productId} className="flex gap-3 rounded-xl border p-3">
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-xs">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span className="text-muted-foreground">No image</span>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-tight">{item.name}</p>
                <p className="text-xs text-muted-foreground">KSH {item.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    className="h-7 w-7 rounded-full border flex items-center justify-center"
                    onClick={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    className="h-7 w-7 rounded-full border flex items-center justify-center"
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-xs text-red-500 hover:underline"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t px-6 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">KSH {subtotal.toLocaleString()}</span>
          </div>
          <Button
            className="w-full"
            disabled={cartItems.length === 0}
            onClick={() => {
              closeCart();
              navigate("/checkout");
            }}
          >
            Proceed to checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;


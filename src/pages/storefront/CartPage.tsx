import { useNavigate } from "react-router-dom";
import { useCommerce } from "@/context/CommerceContext";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const { cartItems, cartCount, updateCartQuantity, removeFromCart } = useCommerce();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartCount === 0) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-muted-foreground text-sm">Your cart is empty for now.</p>
        <Button size="sm" onClick={() => navigate("/shop")}>
          Browse products
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3"
            >
              <div className="flex items-center gap-3 flex-1">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center border rounded-full text-xs">
                  <button
                    type="button"
                    className="px-2 py-1"
                    onClick={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-2 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                  <button
                    type="button"
                    className="px-2 py-1"
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => removeFromCart(item.productId)}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border bg-card p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cartCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Shipping and discounts will be calculated at checkout.
            </p>
            <Button className="w-full mt-2" size="sm" onClick={() => navigate("/checkout")}>
              Go to checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;


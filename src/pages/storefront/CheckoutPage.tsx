import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCommerce } from "@/context/CommerceContext";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { createOrder } from "../../../backend/services/orderService.js";

const CheckoutPage = () => {
  const { firebaseUser } = useAuth();
  const { cartItems, cartCount } = useCommerce();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    deliveryMethod: "delivery" as "delivery" | "pickup",
    paymentMethod: "cod" as "cod" | "mpesa",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!firebaseUser) {
    return (
      <div className="p-4">
        <EmptyState
          title="Log in to checkout"
          description="You need an account to place an order."
          actionLabel="Go to login"
          onAction={() => navigate("/login")}
        />
      </div>
    );
  }

  if (cartCount === 0 && !orderSuccess) {
    return (
      <div className="p-4">
        <EmptyState
          title="Your cart is empty"
          description="Add a few items before checking out."
          actionLabel="Browse products"
          onAction={() => navigate("/shop")}
        />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    if (cartCount === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const shippingAddress = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        deliveryMethod: form.deliveryMethod,
      };
      const order = await createOrder(
        firebaseUser.uid,
        shippingAddress,
        form.paymentMethod,
        form.notes,
      );
      setOrderSuccess(order);
    } catch (err) {
      console.error(err);
      setError("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Order successful 🎉</h1>
        <p className="text-sm text-muted-foreground">
          Your order <span className="font-mono">{orderSuccess.orderNumber}</span> has been placed.
        </p>
        <div className="rounded-xl border bg-card p-4 text-sm space-y-2">
          <p>
            <span className="font-medium">Total:</span>{" "}
            KES {Number(orderSuccess.totalAmount || 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            You can track this order in your account orders page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate("/account/orders")}>
            View my orders
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/shop")}>
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="text-sm text-muted-foreground">
        Confirm your details and how you’d like to receive and pay for your order.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border bg-card p-4 text-sm">
          <h2 className="text-sm font-semibold mb-1">Contact & delivery</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Full name</label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Phone number</label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-background"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Delivery method</label>
            <select
              className="w-full rounded-lg border px-3 py-2 bg-background"
              value={form.deliveryMethod}
              onChange={(e) =>
                setForm((f) => ({ ...f, deliveryMethod: e.target.value as "delivery" | "pickup" }))
              }
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pick up at store</option>
            </select>
          </div>

          {form.deliveryMethod === "delivery" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium">Address line 1</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 bg-background"
                  value={form.addressLine1}
                  onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Address line 2 (optional)</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 bg-background"
                  value={form.addressLine2}
                  onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">City / Town</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 bg-background"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium">Payment method</label>
            <select
              className="w-full rounded-lg border px-3 py-2 bg-background"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm((f) => ({ ...f, paymentMethod: e.target.value as "cod" | "mpesa" }))
              }
            >
              <option value="cod">Cash on delivery / Pick up</option>
              <option value="mpesa">M-Pesa (mark as paid later)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Order notes (optional)</label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 bg-background min-h-[60px]"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            type="submit"
            size="sm"
            className="mt-1"
            disabled={submitting || cartCount === 0}
          >
            {submitting ? "Placing order..." : "Place order"}
          </Button>
        </form>

        <div className="space-y-3">
          <div className="rounded-xl border bg-card p-4 text-sm space-y-2">
            <h2 className="text-sm font-semibold mb-1">Order summary</h2>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.quantity} × KES {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs font-semibold">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t mt-2">
              <span className="text-xs font-medium">Subtotal</span>
              <span className="font-semibold">
                KES {subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Shipping and final payment will be confirmed by admin based on your delivery choice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


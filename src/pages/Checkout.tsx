import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserPageLayout from "@/components/UserPageLayout";

const Checkout = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Jane Wanjiku");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("MPESA_SIM");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Fill all required checkout fields.");
      return;
    }

    toast.success("Order placed successfully.");
    navigate("/orders");
  };

  return (
    <UserPageLayout title="Checkout" description="Finalize your order details and payment option.">
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              placeholder="07XXXXXXXX"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Address</label>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={3}
              className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Delivery Option</label>
              <select
                value={deliveryOption}
                onChange={(event) => setDeliveryOption(event.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              >
                <option value="MPESA_SIM">MPESA_SIM</option>
                <option value="COD">COD</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-full bg-accent text-accent-foreground font-bold">
            Place Order
          </button>
        </form>
      </div>
    </UserPageLayout>
  );
};

export default Checkout;


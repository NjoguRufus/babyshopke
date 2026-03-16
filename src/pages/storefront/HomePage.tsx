import Index from "@/pages/Index";
import CartDrawer from "@/components/layout/CartDrawer";
import WishlistDrawer from "@/components/layout/WishlistDrawer";

const HomePage = () => {
  return (
    <>
      <Index />
      <CartDrawer />
      <WishlistDrawer />
    </>
  );
};

export default HomePage;


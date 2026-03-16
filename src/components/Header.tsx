import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "@/context/CommerceContext";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, wishlistCount, openCart, openWishlist } = useCommerce();
  const { firebaseUser } = useAuth();

  return (
    <header className="w-full">
      {/* Main Nav */}
      <nav className="bg-card px-4 md:px-8 py-3 flex items-center justify-between gap-4 max-w-[1400px] mx-auto">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <ShoppingCart className="w-7 h-7 text-primary" />
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight">
            <span className="text-primary">Baby</span>
            <span className="text-accent">ShopKe</span>
          </span>
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary transition-colors relative"
            onClick={openWishlist}
          >
            <Heart className="w-5 h-5 text-accent" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center px-1">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary transition-colors relative"
            onClick={openCart}
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={() => navigate(firebaseUser ? "/account" : "/login")}
          >
            <User className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </nav>

      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold tracking-wide">
        🚚 Free Shipping on orders over KSH 5,000 🇰🇪
      </div>
    </header>
  );
};

export default Header;

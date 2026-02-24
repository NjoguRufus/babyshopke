import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import AgeFilterSection from "@/components/AgeFilterSection";
import BottomCards from "@/components/BottomCards";

const Index = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const scrollTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShopNow = () => {
    navigate("/shop");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory((prev) => {
      const next = prev === category ? null : category;
      toast(next ? `Filtering by ${next}` : "Category filter cleared");
      return next;
    });
    scrollTo("products");
  };

  const handleWishlistToggle = (productName: string, nextState: boolean) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (nextState) {
        next.add(productName);
        toast(`${productName} added to wishlist`);
      } else {
        next.delete(productName);
        toast(`${productName} removed from wishlist`);
      }
      return next;
    });
  };

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
    toast(`${productName} added to cart`);
  };

  const handleSearchSubmit = (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    scrollTo("products");
    toast(trimmedQuery ? `Showing results for "${trimmedQuery}"` : "Showing all products");
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleUserClick = () => {
    navigate("/account");
  };

  const handleGetStarted = () => {
    navigate("/get-started");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        onWishlistClick={handleWishlistClick}
        onCartClick={handleCartClick}
        onUserClick={handleUserClick}
        onSearchSubmit={handleSearchSubmit}
      />
      <HeroSection onShopNow={handleShopNow} />
      <CategorySection activeCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
      <AgeFilterSection
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        wishlist={wishlist}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
      />
      <BottomCards onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Index;

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCart, addToCart as svcAddToCart, updateCartItem, removeFromCart } from "../../backend/services/cartService.js";
import { addToWishlist as svcAddToWishlist, removeFromWishlist as svcRemoveFromWishlist, getWishlist as svcGetWishlist } from "../../backend/services/wishlistService.js";

type CartItem = {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stockSnapshot?: number;
};

type CommerceContextValue = {
  cartItems: CartItem[];
  wishlistProductIds: string[];
  cartOpen: boolean;
  wishlistOpen: boolean;
  cartLoading: boolean;
  wishlistLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  cartCount: number;
  wishlistCount: number;
};

const CommerceContext = createContext<CommerceContextValue | undefined>(undefined);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const { firebaseUser } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Load cart & wishlist on auth change
  useEffect(() => {
    if (!firebaseUser) {
      setCartItems([]);
      setWishlistProductIds([]);
      return;
    }

    const userId = firebaseUser.uid;
    (async () => {
      setCartLoading(true);
      setWishlistLoading(true);
      try {
        const [cart, wishlist] = await Promise.all([getCart(userId), svcGetWishlist(userId)]);
        setCartItems(cart.items || []);
        setWishlistProductIds(wishlist.map((w) => w.productId));
      } catch (e) {
        console.error("Failed to load cart/wishlist", e);
      } finally {
        setCartLoading(false);
        setWishlistLoading(false);
      }
    })();
  }, [firebaseUser]);

  const addToCart = async (item: CartItem) => {
    if (!firebaseUser) return;
    setCartLoading(true);
    try {
      const updated = await svcAddToCart(firebaseUser.uid, item);
      setCartItems(updated.items || []);
      setCartOpen(true);
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartQuantityFn = async (productId: string, quantity: number) => {
    if (!firebaseUser) return;
    setCartLoading(true);
    try {
      const updated = await updateCartItem(firebaseUser.uid, productId, quantity);
      setCartItems(updated.items || []);
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCartFn = async (productId: string) => {
    if (!firebaseUser) return;
    setCartLoading(true);
    try {
      const updated = await removeFromCart(firebaseUser.uid, productId);
      setCartItems(updated.items || []);
    } finally {
      setCartLoading(false);
    }
  };

  const toggleWishlistFn = async (productId: string) => {
    if (!firebaseUser) return;
    setWishlistLoading(true);
    try {
      if (wishlistProductIds.includes(productId)) {
        await svcRemoveFromWishlist(firebaseUser.uid, productId);
        setWishlistProductIds((ids) => ids.filter((id) => id !== productId));
      } else {
        await svcAddToWishlist(firebaseUser.uid, productId);
        setWishlistProductIds((ids) => [...ids, productId]);
        setWishlistOpen(true);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const value: CommerceContextValue = useMemo(
    () => ({
      cartItems,
      wishlistProductIds,
      cartOpen,
      wishlistOpen,
      cartLoading,
      wishlistLoading,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openWishlist: () => setWishlistOpen(true),
      closeWishlist: () => setWishlistOpen(false),
      toggleCart: () => setCartOpen((o) => !o),
      addToCart,
      updateCartQuantity: updateCartQuantityFn,
      removeFromCart: removeFromCartFn,
      toggleWishlist: toggleWishlistFn,
      cartCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
      wishlistCount: wishlistProductIds.length,
    }),
    [
      cartItems,
      wishlistProductIds,
      cartOpen,
      wishlistOpen,
      cartLoading,
      wishlistLoading,
    ],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) {
    throw new Error("useCommerce must be used within CommerceProvider");
  }
  return ctx;
}


import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminRoute from "@/components/layout/AdminRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";
import HomePage from "@/pages/storefront/HomePage";
import ProductDetailsPage from "@/pages/storefront/ProductDetailsPage";
import CartPage from "@/pages/storefront/CartPage";
import WishlistPage from "@/pages/storefront/WishlistPage";
import CheckoutPage from "@/pages/storefront/CheckoutPage";
import ProfilePage from "@/pages/storefront/ProfilePage";
import AccountLayout from "@/components/layout/AccountLayout";
import AccountProfilePage from "@/pages/account/AccountProfilePage";
import AccountOrdersPage from "@/pages/account/AccountOrdersPage";
import AccountWishlistPage from "@/pages/account/AccountWishlistPage";
import AccountFamilyPage from "@/pages/account/AccountFamilyPage";
import ShopPage from "@/pages/storefront/ShopPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import InventoryPage from "@/pages/admin/InventoryPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import FamiliesPage from "@/pages/admin/FamiliesPage";
import TransactionsPage from "@/pages/admin/TransactionsPage";
import RecommendationsPage from "@/pages/admin/RecommendationsPage";
import ActivityLogsPage from "@/pages/admin/ActivityLogsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import AdminPosHistoryPage from "@/pages/admin/AdminPosHistoryPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Legacy home for now */}
      <Route path="/legacy" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:slug" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<ProtectedRoute element={<CartPage />} />} />
      <Route path="/wishlist" element={<ProtectedRoute element={<WishlistPage />} />} />
      <Route path="/checkout" element={<ProtectedRoute element={<CheckoutPage />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />

      <Route path="/account" element={<ProtectedRoute element={<AccountLayout />} />}>
        <Route index element={<AccountProfilePage />} />
        <Route path="profile" element={<AccountProfilePage />} />
        <Route path="orders" element={<AccountOrdersPage />} />
        <Route path="wishlist" element={<AccountWishlistPage />} />
        <Route path="family" element={<AccountFamilyPage />} />
      </Route>

      <Route
        path="/admin"
        element={<AdminRoute element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/products"
        element={<AdminRoute element={<AdminLayout><ProductsPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/orders"
        element={<AdminRoute element={<AdminLayout><OrdersPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/inventory"
        element={<AdminRoute element={<AdminLayout><InventoryPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/customers"
        element={<AdminRoute element={<AdminLayout><CustomersPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/families"
        element={<AdminRoute element={<AdminLayout><FamiliesPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/transactions"
        element={<AdminRoute element={<AdminLayout><TransactionsPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/recommendations"
        element={<AdminRoute element={<AdminLayout><RecommendationsPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/activity-logs"
        element={<AdminRoute element={<AdminLayout><ActivityLogsPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/settings"
        element={<AdminRoute element={<AdminLayout><SettingsPage /></AdminLayout>} />}
      />
      <Route
        path="/admin/pos-history"
        element={<AdminRoute element={<AdminLayout><AdminPosHistoryPage /></AdminLayout>} />}
      />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;


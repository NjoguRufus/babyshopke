import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface UserPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  cartCount?: number;
}

const UserPageLayout = ({ title, description, children, cartCount = 0 }: UserPageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        onWishlistClick={() => navigate("/wishlist")}
        onCartClick={() => navigate("/cart")}
        onUserClick={() => navigate("/account")}
        onSearchSubmit={() => navigate("/")}
      />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{title}</h1>
          {description ? (
            <p className="text-muted-foreground mt-2">{description}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
};

export default UserPageLayout;


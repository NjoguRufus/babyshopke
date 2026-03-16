import { ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children?: ReactNode;
};

const tabs = [
  { to: "/account/profile", label: "Profile" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/wishlist", label: "Wishlist" },
  { to: "/account/family", label: "Family" },
];

const AccountLayout = ({ children }: Props) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-baby-mint/40 via-background to-baby-peach/40">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {userProfile?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Welcome back, {userProfile?.fullName || "friend"} 👶
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage your profile, orders, wishlist and family details from one cozy place.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hidden md:inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
          >
            ← Back
          </button>
        </header>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-60">
            <nav className="space-y-1 rounded-2xl bg-card/80 border shadow-soft p-2">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-glow-primary"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">View</span>
                </NavLink>
              ))}
            </nav>
          </aside>
          <main className="flex-1 bg-card/90 border rounded-2xl shadow-card p-4 md:p-6">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;


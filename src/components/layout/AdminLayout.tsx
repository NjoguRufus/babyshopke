import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Boxes, Users, Users2, Receipt, Sparkles, ListTree, Settings, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
};

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/pos-history", label: "POS History", icon: Calculator },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/families", label: "Families", icon: Users2 },
  { to: "/admin/transactions", label: "Transactions", icon: Receipt },
  { to: "/admin/recommendations", label: "Recommendations", icon: Sparkles },
  { to: "/admin/activity-logs", label: "Activity Logs", icon: ListTree },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }: Props) => {
  const { userProfile, logout } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <Link to="/admin" className="flex items-center gap-2 px-2 py-1">
            <span className="font-bold text-lg">BabyShopKe Admin</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.to}>
                    <NavLink to={item.to}>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <div className="font-semibold">Admin Dashboard</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {userProfile?.fullName || userProfile?.email}
            </span>
            <Button size="sm" variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 bg-muted/30">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;


import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/use-subscriber";
import { UserButton } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  BarChart3,
  ChevronLeft,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import logo from "@/assets/logo.png";

const adminNav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Subscribers", to: "/admin/subscribers", icon: Users },
  { label: "Content Approval", to: "/admin/content", icon: FileCheck },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
          <button onClick={() => navigate("/portal")} className="text-primary hover:underline text-sm">
            Return to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <img src={logo} alt="HWH" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-foreground">Admin Panel</p>
            <p className="text-xs text-muted-foreground">Her Wellness Harmony</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {adminNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <button onClick={() => navigate("/portal")}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />Back to Portal
          </button>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

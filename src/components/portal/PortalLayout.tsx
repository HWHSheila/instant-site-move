import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Route,
  Bot,
  FileText,
  Users,
  ArrowUpCircle,
  UserCircle,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import logo from "@/assets/logo.png";

const portalNav = [
  { label: "Dashboard", to: "/portal", icon: LayoutDashboard, end: true },
  { label: "Start Here", to: "/portal/start-here", icon: Compass },
  { label: "Pattern Library", to: "/portal/patterns", icon: BookOpen },
  { label: "Guided Pathways", to: "/portal/pathways", icon: Route },
  { label: "AI Coaching", to: "/portal/ai-coaching", icon: Bot },
  { label: "Weekly Notes", to: "/portal/weekly-notes", icon: FileText },
  { label: "Community", to: "/portal/community", icon: Users },
  { label: "Upgrade", to: "/portal/upgrade", icon: ArrowUpCircle },
  { label: "Account", to: "/portal/account", icon: UserCircle },
];

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <img src={logo} alt="Her Wellness Harmony" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-foreground">Member Portal</p>
            <p className="text-xs text-muted-foreground">Root-Cause Coaching</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {portalNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to main site
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Her Wellness Harmony" className="w-8 h-8 object-contain" />
            <span className="font-display text-sm font-semibold text-foreground">Member Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Nav */}
      {sidebarOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-foreground/30 z-40" onClick={() => setSidebarOpen(false)} />
          <div className="md:hidden fixed inset-y-0 left-0 w-72 bg-card z-50 flex flex-col animate-in slide-in-from-left">
            <div className="flex items-center justify-between px-4 h-14 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Her Wellness Harmony" className="w-8 h-8 object-contain" />
                <span className="font-display text-sm font-semibold text-foreground">Portal</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {portalNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => { setSidebarOpen(false); navigate("/"); }}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to main site
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 mt-14 md:mt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

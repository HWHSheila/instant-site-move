import { useState, useEffect, createContext, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
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
  Video,
  Calendar,
  Library,
  Sparkles,
  Target,
  Eye,
  ChevronDown,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useSupabase, useClerkUserId } from "@/hooks/use-supabase";

// ── Preview Tier Context ──────────────────────────────────────────────────────

type Tier = "admin" | "awareness" | "foundation" | "guided" | "restoration" | "integration";

interface PreviewTierContextValue {
  previewTier: Tier;
  isAdmin: boolean;
}

const PreviewTierContext = createContext<PreviewTierContextValue>({
  previewTier: "admin",
  isAdmin: false,
});

export function usePreviewTier() {
  return useContext(PreviewTierContext);
}

// ── Nav items ─────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  section?: boolean;
  indent?: boolean;
  adminOnly?: boolean;
}

const portalNav: NavItem[] = [
  { label: "Dashboard", to: "/portal", icon: LayoutDashboard, end: true },

  // Content Studio — admin only
  { label: "Content Studio", to: "/portal/studio", icon: Video, section: true, adminOnly: true },
  { label: "Script Generator", to: "/portal/studio/generate", icon: Sparkles, indent: true, adminOnly: true },
  { label: "Content Library", to: "/portal/studio/library", icon: Library, indent: true, adminOnly: true },
  { label: "Content Calendar", to: "/portal/studio/calendar", icon: Calendar, indent: true, adminOnly: true },
  { label: "Campaigns", to: "/portal/studio/campaigns", icon: Target, indent: true, adminOnly: true },

  // Member nav
  { label: "Member Content", to: "/portal/content", icon: BookOpen },
  { label: "Start Here", to: "/portal/start-here", icon: Compass },
  { label: "Pattern Library", to: "/portal/patterns", icon: BookOpen },
  { label: "Guided Pathways", to: "/portal/pathways", icon: Route },
  { label: "Ask the HWH Coach", to: "/portal/HWHcoach", icon: Bot },
  { label: "Weekly Notes", to: "/portal/weekly-notes", icon: FileText },
  { label: "Community", to: "/portal/community", icon: Users },
  { label: "Deep Support Coaching", to: "/portal/coaching", icon: ArrowUpCircle },
  { label: "Account", to: "/portal/account", icon: UserCircle },
];

const TIER_OPTIONS: { value: Tier; label: string }[] = [
  { value: "admin", label: "Admin view (you)" },
  { value: "awareness", label: "Awareness tier" },
  { value: "foundation", label: "Foundation tier" },
  { value: "guided", label: "Guided tier" },
  { value: "restoration", label: "Restoration tier" },
  { value: "integration", label: "Integration tier" },
];

// ── Layout ────────────────────────────────────────────────────────────────────

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [previewTier, setPreviewTier] = useState<Tier>("admin");
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const supabase = useSupabase();
  const clerkUserId = useClerkUserId();

  useEffect(() => {
    if (!clerkUserId) return;
    supabase
      .from("admin_users")
      .select("clerk_user_id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data);
      });
  }, [supabase, clerkUserId]);

  const visibleNav = isAdmin ? portalNav : portalNav.filter(item => !item.adminOnly);

  const previewLabel = TIER_OPTIONS.find(o => o.value === previewTier)?.label ?? "Admin view";

  const NavItems = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {visibleNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onLinkClick}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              item.indent && "ml-4 text-xs",
              item.section && "font-semibold text-primary mt-4"
            )
          }
        >
          <item.icon className={cn("shrink-0", item.indent ? "w-4 h-4" : "w-5 h-5")} />
          {item.label}
        </NavLink>
      ))}
    </>
  );

  const PreviewBanner = () => {
    if (!isAdmin || previewTier === "admin") return null;
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
        <Eye className="w-3.5 h-3.5 shrink-0" />
        Previewing as <span className="font-semibold">{previewLabel}</span> — content filtered accordingly.
        <button
          className="ml-auto underline hover:no-underline"
          onClick={() => setPreviewTier("admin")}
        >
          Exit preview
        </button>
      </div>
    );
  };

  const PreviewTierPicker = () => {
    if (!isAdmin) return null;
    return (
      <div className="relative">
        <button
          onClick={() => setTierDropdownOpen(o => !o)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            {previewTier === "admin" ? "Preview as member" : previewLabel}
          </span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", tierDropdownOpen && "rotate-180")} />
        </button>
        {tierDropdownOpen && (
          <div className="absolute bottom-full mb-1 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
            {TIER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setPreviewTier(opt.value); setTierDropdownOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors",
                  previewTier === opt.value && "bg-primary/10 text-primary font-medium"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <PreviewTierContext.Provider value={{ previewTier, isAdmin }}>
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
            <NavItems />
          </nav>
          <div className="p-4 border-t border-border space-y-3">
            <PreviewTierPicker />
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <span className="text-xs text-muted-foreground">Account</span>
            </div>
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
                <NavItems onLinkClick={() => setSidebarOpen(false)} />
              </nav>
              <div className="p-4 border-t border-border space-y-3">
                <PreviewTierPicker />
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-xs text-muted-foreground">Account</span>
                </div>
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
        <main className="flex-1 md:ml-64 mt-14 md:mt-0 min-h-screen flex flex-col">
          <PreviewBanner />
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </PreviewTierContext.Provider>
  );
}

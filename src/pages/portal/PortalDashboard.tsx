import { SEO } from "@/components/SEO";
import { Compass, BookOpen, Route, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Start Here", description: "Begin your root-cause journey", to: "/portal/start-here", icon: Compass },
  { label: "Pattern Library", description: "Explore common body patterns", to: "/portal/patterns", icon: BookOpen },
  { label: "Guided Pathways", description: "Follow step-by-step coaching", to: "/portal/pathways", icon: Route },
  { label: "Ask the HWH Coach", description: "Ask your coaching assistant", to: "/portal/HWHcoach", icon: Bot },
];

export default function PortalDashboard() {
  return (
    <>
      <SEO title="Member Dashboard" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            Her Wellness Harmony Membership Portal
          </h1>
          <p className="text-muted-foreground mt-1">Root-Cause Guided Coaching + Support</p>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/15 p-5 md:p-6">
          <p className="font-display text-lg font-medium text-foreground">Welcome back 👋</p>
          <p className="text-sm text-muted-foreground mt-1">
            Pick up where you left off or explore a new section of your coaching journey.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-medium text-foreground mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

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

        <div className="rounded-xl bg-primary/5 border border-primary/15 p-5 md:p-6 space-y-3">
          <p className="font-display text-lg font-medium text-foreground">Welcome to the Her Wellness Harmony Portal</p>
          <p className="text-sm text-muted-foreground">Here's how to get the most out of your membership:</p>
          <ul className="text-sm text-muted-foreground space-y-2 list-none pl-0">
            <li><strong className="text-foreground">New here?</strong> Start with <strong>"Start Here"</strong> to understand the root-cause framework that guides everything inside this portal.</li>
            <li><strong className="text-foreground">Experiencing symptoms?</strong> Explore the <strong>"Pattern Library"</strong> to learn what your body may be signaling and why.</li>
            <li><strong className="text-foreground">Ready to take action?</strong> Follow <strong>"Guided Pathways"</strong> to begin stabilizing your system step by step.</li>
          </ul>
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

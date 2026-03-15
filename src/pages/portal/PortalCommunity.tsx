import { SEO } from "@/components/SEO";
import { Users } from "lucide-react";

export default function PortalCommunity() {
  return (
    <>
      <SEO title="Community" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Community</h1>
          <p className="text-muted-foreground mt-1">
            Connect with other members on their root-cause coaching journey.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 md:p-12 flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <Users className="w-8 h-8" />
          </div>
          <p className="font-display text-lg font-medium text-foreground">Community Space Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            A supportive space where members can share experiences, ask questions, and encourage each other through their wellness journey.
          </p>
        </div>
      </div>
    </>
  );
}

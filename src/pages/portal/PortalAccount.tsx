import { SEO } from "@/components/SEO";
import { UserCircle } from "lucide-react";

export default function PortalAccount() {
  return (
    <>
      <SEO title="Account" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Account</h1>
          <p className="text-muted-foreground mt-1">Manage your membership and profile settings.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 md:p-12 flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <UserCircle className="w-8 h-8" />
          </div>
          <p className="font-display text-lg font-medium text-foreground">Account Settings</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Account management features including profile details, membership status, and preferences will be available here.
          </p>
        </div>
      </div>
    </>
  );
}

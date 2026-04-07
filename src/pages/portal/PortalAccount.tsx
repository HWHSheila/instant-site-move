import { useState } from "react";
import { SEO } from "@/components/SEO";
import { UserProfile } from "@clerk/clerk-react";
import { useSubscriber } from "@/hooks/use-subscriber";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TIER_LABELS: Record<string, string> = {
  awareness: "Root-Cause Pattern Awareness",
  foundation: "Foundation",
  guided: "Guided",
  restoration: "Restoration",
  integration: "Integration",
};

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  none: { label: "No Subscription", variant: "secondary" },
  trial: { label: "Free Trial", variant: "default" },
  active: { label: "Active", variant: "default" },
  past_due: { label: "Past Due", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

export default function PortalAccount() {
  const { subscriber } = useSubscriber();
  const supabase = useSupabase();
  const [loadingPortal, setLoadingPortal] = useState(false);

  const tier = subscriber?.tier;
  const paymentStatus = subscriber?.payment_status || "none";
  const statusInfo = STATUS_LABELS[paymentStatus] || STATUS_LABELS.none;

  async function openBillingPortal() {
    if (!subscriber) return;
    setLoadingPortal(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
        {
          body: {
            subscriber_id: subscriber.id,
            return_url: `${window.location.origin}/portal/account`,
          },
        }
      );

      if (error) throw error;

      if (data?.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.error("Unable to open billing portal");
      }
    } catch (err) {
      console.error("Billing portal error:", err);
      toast.error("Failed to open billing portal. Please try again.");
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <>
      <SEO title="Account" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Account</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and subscription.</p>
        </div>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {tier ? TIER_LABELS[tier] || tier : "No active tier"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscriber?.email}
                </p>
              </div>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>

            {subscriber?.trial_end_date && paymentStatus === "trial" && (
              <p className="text-sm text-muted-foreground">
                Trial ends:{" "}
                {new Date(subscriber.trial_end_date).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
            )}

            <div className="flex gap-3">
              {subscriber?.stripe_customer_id && (
                <Button
                  variant="outline"
                  onClick={openBillingPortal}
                  disabled={loadingPortal}
                >
                  {loadingPortal ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Manage Billing
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clerk Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-0",
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

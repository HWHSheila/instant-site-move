import { useState } from "react";
import { SEO } from "@/components/SEO";
import { useSubscriber } from "@/hooks/use-subscriber";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface TierConfig {
  key: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
}

const TIERS: TierConfig[] = [
  {
    key: "awareness",
    name: "Root-Cause Pattern Awareness",
    price: "$9/mo",
    tagline: "I can see my patterns",
    features: [
      "Pattern results & personalized roadmap",
      "Symptom tracking tools",
      "Access to Pattern Library (educational)",
      "Community access",
    ],
  },
  {
    key: "foundation",
    name: "Foundation",
    price: "$29/mo",
    tagline: "I understand my patterns",
    features: [
      "Everything in Awareness",
      "Core educational modules for your pathway",
      "Weekly coaching notes",
      "Content Studio basic access",
    ],
  },
  {
    key: "guided",
    name: "Guided",
    price: "$69/mo",
    tagline: "I'm starting to apply this",
    features: [
      "Everything in Foundation",
      "Practical direction & light sequencing",
      "AI coaching assistant",
      "Content Studio full access",
    ],
  },
  {
    key: "restoration",
    name: "Restoration",
    price: "$119/mo",
    tagline: "I'm being guided through this",
    features: [
      "Everything in Guided",
      "Full guided pathway with structured sequencing",
      "Ongoing prioritization & adaptive check-ins",
      "Priority community support",
    ],
  },
  {
    key: "integration",
    name: "Integration",
    price: "$299/mo",
    tagline: "This is being interpreted for me",
    features: [
      "Everything in Restoration",
      "Deepest personalization & interpretation",
      "Highest-touch support",
      "Direct coaching access",
    ],
  },
];

export default function PortalUpgrade() {
  const { subscriber } = useSubscriber();
  const supabase = useSupabase();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const currentTier = subscriber?.tier;

  async function handleCheckout(tier: string) {
    if (!subscriber) return;
    setLoadingTier(tier);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            subscriber_id: subscriber.id,
            tier,
            success_url: `${window.location.origin}/portal?checkout=success`,
            cancel_url: `${window.location.origin}/portal/coaching?checkout=cancelled`,
          },
        }
      );

      if (error) throw error;

      if (data?.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <>
      <SEO title="Membership Tiers" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            Membership Tiers
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose the level of support that matches where you are in your
            journey. All tiers include a 21-day free trial.
          </p>
        </div>

        <div className="space-y-4">
          {TIERS.map((tier) => {
            const isCurrent = currentTier === tier.key;
            const isHigher =
              currentTier &&
              TIERS.findIndex((t) => t.key === tier.key) >
                TIERS.findIndex((t) => t.key === currentTier);

            return (
              <Card
                key={tier.key}
                className={
                  isCurrent
                    ? "border-primary border-2 bg-primary/5"
                    : "border-border"
                }
              >
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-semibold">
                          {tier.name}
                        </h3>
                        {isCurrent && (
                          <Badge className="bg-primary text-primary-foreground">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{tier.tagline}"
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary shrink-0">
                      {tier.price}
                    </p>
                  </div>

                  <ul className="space-y-1.5">
                    {tier.features.map((f, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {!isCurrent && (
                    <Button
                      className="w-full"
                      variant={isHigher ? "default" : "outline"}
                      onClick={() => handleCheckout(tier.key)}
                      disabled={loadingTier === tier.key}
                    >
                      {loadingTier === tier.key ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Starting checkout...
                        </>
                      ) : (
                        `Start 21-Day Free Trial`
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          All subscriptions begin with a 21-day free trial. Cancel anytime.
          Manage your subscription from the Account page.
        </p>
      </div>
    </>
  );
}

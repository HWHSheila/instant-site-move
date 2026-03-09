import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  published_at: string | null;
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h2 class="font-display text-2xl font-medium text-primary-foreground mt-10 mb-4">${trimmed.slice(3)}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h3 class="font-display text-xl font-medium text-primary-foreground mt-8 mb-3">${trimmed.slice(4)}</h3>`);
    } else if (trimmed.startsWith("- ")) {
      if (!inList) { html.push('<ul class="list-disc list-inside space-y-2 mb-6 text-primary-foreground/80">'); inList = true; }
      const itemContent = trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary-foreground">$1</strong>');
      html.push(`<li>${itemContent}</li>`);
    } else if (trimmed.match(/^\d+\.\s/)) {
      if (inList) { html.push("</ul>"); inList = false; }
      const itemContent = trimmed.replace(/^\d+\.\s/, "").replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary-foreground">$1</strong>');
      html.push(`<p class="text-primary-foreground/80 leading-relaxed mb-2 pl-4">${itemContent}</p>`);
    } else if (trimmed === "") {
      if (inList) { html.push("</ul>"); inList = false; }
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      const processed = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary-foreground">$1</strong>');
      html.push(`<p class="text-primary-foreground/80 leading-relaxed mb-4">${processed}</p>`);
    }
  }
  if (inList) html.push("</ul>");

  return html.join("\n");
}

const ctaConfig: Record<string, { href: string; label: string }> = {
  "gut-health-hormonal-balance": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "why-healing-does-not-have-to-be-complicated": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "metabolic-signaling-explained": {
    href: "/free-guide",
    label: "Get the Free Guide",
  },
  "stress-digestive-health-connection": {
    href: "/free-guide",
    label: "Get the Free Guide",
  },
  "eating-less-is-not-the-answer": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "your-health-is-not-too-complicated": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "why-you-are-bloated-every-night": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "fat-is-not-ruining-your-digestion": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "why-fixing-insulin-resistance-makes-things-worse": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "your-morning-routine-is-backfiring": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "why-fasting-backfires-for-many-women": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "when-fasting-stops-working": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "why-caffeine-can-backfire-in-the-morning": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "i-gain-weight-when-i-restrict-carbs": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "supplements-help-at-first-and-then-stop-working": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "if-keto-does-not-work-just-try-harder": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "i-wake-up-tired-no-matter-what-i-do": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "gut-issues-only-happen-when-you-have-diarrhea-or-pain": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "how-short-term-stress-disrupts-gut-health-and-hormones": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "four-factors-that-influence-hormone-production": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "why-you-bloat-more-at-night-than-after-eating": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "why-blood-sugar-spikes-even-when-you-eat-healthy": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "why-digestion-slows-down-when-stressed": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "metabolism-is-more-than-calories-in-vs-calories-out": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "why-metabolism-adapts-when-you-dont-eat-enough": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "why-your-cycle-gets-worse-when-routine-shifts": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "bloating-doesnt-mean-you-need-to-restrict-more": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "wellness-guidance-that-respects-womens-biology": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "shame-around-weight-gain-and-exhaustion": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "feel-inflamed-even-though-labs-are-fine": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "poor-sleep-cortisol-rhythm-disruption": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "normal-labs-do-not-mean-you-are-fine": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "cycle-symptoms-shift-wildly-month-to-month": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "carbs-are-not-the-enemy": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "more-caffeine-is-not-the-answer": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "every-protocol-ignores-gut-metabolism-hormone-patterns": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "energy-crashes-every-afternoon": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "cravings-get-worse-when-you-restrict": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "stress-affects-hormones-more-than-you-think": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "dieting-harder-will-not-help-you-heal": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "gut-reacts-to-random-foods": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "low-calorie-does-not-fix-metabolism": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "body-crashes-after-certain-meals": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "women-do-need-carbs-for-hormonal-health": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "cravings-do-not-mean-you-lack-willpower": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "why-protein-feels-hard-in-the-morning": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "fasting-does-not-reset-everything-for-women": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "does-protein-make-you-feel-worse": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "i-thought-i-ruined-my-metabolism": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "wake-up-puffy-every-morning": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "energy-drops-after-caffeine": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "cycle-symptoms-are-not-just-normal": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "felt-punished-for-trying-to-get-healthy": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "cant-absorb-nutrients-eating-healthy": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "inflammation-is-not-just-normal-for-women": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "skin-flares-with-foods-or-stress": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "supplementing-more-wont-fix-absorption": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
  "crash-after-eating-healthy-food": {
    href: "/free-guide",
    label: "Get the Free Root Cause Reset Guide",
  },
  "healing-roadmap-without-extremes": {
    href: "/30day-roadmap",
    label: "Get the 30-Day Gut Reset Roadmap",
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data as BlogPostData;
    },
    enabled: !!slug,
  });

  const cta = slug ? ctaConfig[slug] : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={post ? `${post.title} — Her Wellness Harmony` : "Blog — Her Wellness Harmony"}
        description={post?.excerpt || "Insights on gut health, metabolism, hormones, and root-cause wellness for women."}
      />

      <div
        className="flex-1 relative"
        style={{
          background: `
            linear-gradient(
              175deg,
              hsl(150 40% 18%) 0%,
              hsl(150 35% 24%) 12%,
              hsl(150 28% 32%) 30%,
              hsl(145 22% 42%) 50%,
              hsl(145 20% 38%) 65%,
              hsl(150 28% 28%) 80%,
              hsl(150 38% 18%) 100%
            )
          `,
        }}
      >
        <Header />

        <main className="pt-32 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 text-sm font-semibold tracking-wide uppercase font-body"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-card/10 rounded w-3/4" />
                <div className="h-4 bg-card/10 rounded w-1/4" />
                <div className="h-64 bg-card/10 rounded mt-8" />
              </div>
            ) : post ? (
              <article>
                {post.published_at && (
                  <p className="text-accent/80 text-sm mb-4 font-body">
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </p>
                )}

                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-primary-foreground mb-8">
                  {post.title}
                </h1>

                {post.featured_image && (
                  <div className="rounded-xl overflow-hidden mb-10">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div
                  className="font-body"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                />

                {cta && (
                  <div className="mt-12 text-center">
                    <Link
                      to={cta.href}
                      className="inline-block rounded-full px-8 py-4 text-base font-semibold transition-colors bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {cta.label}
                    </Link>
                  </div>
                )}
              </article>
            ) : (
              <div className="text-center py-20">
                <h1 className="font-display text-3xl text-primary-foreground mb-4">Post Not Found</h1>
                <Link to="/blog" className="text-accent hover:text-accent/80 transition-colors">
                  Return to Blog
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
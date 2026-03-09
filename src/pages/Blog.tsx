import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
}

export default function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
    staleTime: 0,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Blog — Her Wellness Harmony"
        description="Insights on gut health, metabolism, hormones, and root-cause wellness for women."
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero */}
            <div className="text-center mb-16">
              <p className="section-label mb-4 text-accent">Blog</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-primary-foreground mb-6">
                Her Wellness Harmony Blog
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Insights on gut health, metabolism, hormones, and root-cause wellness for women.
              </p>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card/10 backdrop-blur-sm rounded-xl p-6 animate-pulse h-64" />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-card/10 backdrop-blur-sm border border-primary-foreground/10 rounded-xl overflow-hidden hover:bg-card/20 transition-all duration-300"
                  >
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.published_at && (
                        <p className="text-sm text-accent/80 mb-2 font-body">
                          {format(new Date(post.published_at), "MMMM d, yyyy")}
                        </p>
                      )}
                      <h2 className="font-display text-xl font-medium text-primary-foreground mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4 font-body">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="text-accent text-sm font-semibold tracking-wide uppercase font-body">
                        Read More →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-primary-foreground/60 text-lg">
                No posts yet. Check back soon!
              </p>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

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
  // Simple markdown-to-HTML for blog content
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

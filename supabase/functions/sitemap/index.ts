import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://www.herwellnessharmony.com";

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/free-guide", priority: "0.8", changefreq: "monthly" },
  { path: "/30day-roadmap", priority: "0.8", changefreq: "monthly" },
  { path: "/glp1-signal", priority: "0.7", changefreq: "monthly" },
  { path: "/glp1-option", priority: "0.7", changefreq: "monthly" },
  { path: "/90day-phase1", priority: "0.7", changefreq: "monthly" },
  { path: "/4-week-coaching", priority: "0.7", changefreq: "monthly" },
  { path: "/90day-coaching", priority: "0.7", changefreq: "monthly" },
  { path: "/6month-coaching", priority: "0.7", changefreq: "monthly" },
  { path: "/12month-coaching", priority: "0.7", changefreq: "monthly" },
  { path: "/strategy-call", priority: "0.7", changefreq: "monthly" },
  { path: "/wellness-consultation", priority: "0.7", changefreq: "monthly" },
  { path: "/lab-review", priority: "0.6", changefreq: "monthly" },
  { path: "/follow-up-session", priority: "0.6", changefreq: "monthly" },
  { path: "/supplement-review", priority: "0.6", changefreq: "monthly" },
  { path: "/routine-blueprint", priority: "0.6", changefreq: "monthly" },
  { path: "/free-strategy-intake", priority: "0.7", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
];

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .order("published_at", { ascending: false });

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  if (posts) {
    for (const post of posts) {
      const lastmod = (post.updated_at || post.published_at || today).split("T")[0];
      xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

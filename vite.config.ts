import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const SUPABASE_URL = "https://npwitirccxyphbtxyfbs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wd2l0aXJjY3h5cGhidHh5ZmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzI4NjQsImV4cCI6MjA4NjY0ODg2NH0.iavpl8XB94bkMTMRSnyIGtvLrUDj8jFbPtpEiazl-pQ";
const SITE_URL = "https://www.herwellnessharmony.com";

function sitemapPlugin() {
  return {
    name: "generate-sitemap",
    async closeBundle() {
      const fs = await import("fs");
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

      let blogUrls = "";
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at,published_at&order=published_at.desc`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        if (res.ok) {
          const posts = await res.json() as Array<{slug: string; updated_at: string | null; published_at: string | null}>;
          const today = new Date().toISOString().split("T")[0];
          for (const post of posts) {
            const lastmod = (post.updated_at || post.published_at || today).split("T")[0];
            blogUrls += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
          }
        }
      } catch (e) {
        console.warn("Failed to fetch blog posts for sitemap:", e);
      }

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      for (const page of staticPages) {
        xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
      }
      xml += blogUrls;
      xml += `</urlset>`;

      fs.writeFileSync("dist/sitemap.xml", xml);
      console.log("✅ sitemap.xml generated with blog posts");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), sitemapPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

import { Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

// TikTok icon component (not available in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

// YouTube icon component
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-wellness-forest border-t border-wellness-forest-dark">
      <div className="container-wellness">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Her Wellness Harmony" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-display text-primary-foreground">Her Wellness Harmony</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/herwellnessharmony"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.tiktok.com/@herwellnessharmony"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com/@HerWellnessHarmony"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="YouTube"
            >
              <YouTubeIcon className="w-6 h-6" />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://www.herwellnessharmony.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="https://www.herwellnessharmony.com/disclaimer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Disclaimer
            </a>
            <a
              href="https://www.herwellnessharmony.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-sm text-primary-foreground/60 text-center">
          © {currentYear} Her Wellness Harmony. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

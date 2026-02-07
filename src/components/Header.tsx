import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "E-Books", href: "#ebooks" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container-wellness">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-wellness-forest flex items-center justify-center">
              <span className="text-primary-foreground font-display text-xs md:text-sm leading-tight text-center">
                Her<br/>Wellness
              </span>
            </div>
            <span className="font-display text-lg md:text-xl font-medium text-foreground">
              Her Wellness Harmony
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground rounded-full px-6"
            >
              <a href="https://www.herwellnessharmony.com/ready" target="_blank" rel="noopener noreferrer">
                Free Guide
              </a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground rounded-full w-full mt-2"
              >
                <a href="https://www.herwellnessharmony.com/ready" target="_blank" rel="noopener noreferrer">
                  Free Guide
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

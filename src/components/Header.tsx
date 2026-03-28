import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "About", href: "/#about", isRoute: false },
  { label: "Services", href: "/#services", isRoute: false },
  { label: "E-Books", href: "/#ebooks", isRoute: false },
  { label: "Essential Oils", href: "/#essential-oils", isRoute: false },
  { label: "Contact", href: "/#contact-info", isRoute: false },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute: boolean) => {
    if (isRoute) {
      // It's a full route, let the link work normally
      return;
    }

    e.preventDefault();
    
    // Check if we're on the home page
    if (location.pathname === "/") {
      // Just scroll to the section
      const sectionId = href.replace("/#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page first, then scroll
      navigate("/");
      setTimeout(() => {
        const sectionId = href.replace("/#", "");
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container-wellness">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Her Wellness Harmony" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
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
                onClick={(e) => handleNavClick(e, link.href, link.isRoute)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground rounded-full px-6"
            >
              <a href="/free-guide">
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
                  onClick={(e) => {
                    handleNavClick(e, link.href, link.isRoute);
                    setMobileMenuOpen(false);
                  }}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground rounded-full w-full mt-2"
              >
                <a href="/free-guide">
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

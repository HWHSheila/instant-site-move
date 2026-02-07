export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-wellness-forest-dark border-t border-wellness-forest">
      <div className="container-wellness">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-wellness-forest flex items-center justify-center">
              <span className="text-primary-foreground font-display text-[8px] leading-tight text-center">
                Her<br/>Wellness
              </span>
            </div>
            <span className="font-display text-primary-foreground">Her Wellness Harmony</span>
          </div>

          <p className="text-sm text-primary-foreground/70">
            © {currentYear} Her Wellness Harmony. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Privacy Policy" />
      <Header />
      
      <main className="flex-grow pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">Legal</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-sm text-muted-foreground">
                Last updated: February 2026
              </p>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">1. Introduction</h2>
                <p>
                  Her Wellness Harmony ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">2. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, and any other information you voluntarily provide when subscribing to our newsletter, purchasing products, or contacting us.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referring websites.</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, and IP address for analytics and security purposes.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Deliver products and services you have requested</li>
                  <li>Send newsletters and promotional communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Respond to customer service requests</li>
                  <li>Protect against fraudulent or unauthorized activity</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">4. Email Communications</h2>
                <p>
                  When you subscribe to our newsletter or download free resources, you consent to receive email communications from us. You can unsubscribe at any time by clicking the "unsubscribe" link in any email or by contacting us directly.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">5. Third-Party Services</h2>
                <p>
                  We may use third-party services for email marketing (such as Systeme.io), payment processing, and analytics. These services have their own privacy policies, and we encourage you to review them. We do not sell your personal information to third parties.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">6. Cookies and Tracking</h2>
                <p>
                  Our website may use cookies and similar tracking technologies to enhance your experience and gather usage data. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">7. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">8. Your Rights</h2>
                <p>Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at{" "}
                  <a 
                    href="mailto:support@herwellnessharmony.com" 
                    className="text-wellness-forest hover:text-wellness-forest-dark underline"
                  >
                    support@herwellnessharmony.com
                  </a>.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">9. Children's Privacy</h2>
                <p>
                  Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. The updated version will be indicated by the "Last updated" date at the top of this page.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">11. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy, please contact us at{" "}
                  <a 
                    href="mailto:support@herwellnessharmony.com" 
                    className="text-wellness-forest hover:text-wellness-forest-dark underline"
                  >
                    support@herwellnessharmony.com
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

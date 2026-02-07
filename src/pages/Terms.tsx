import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">Legal</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-sm text-muted-foreground">
                Last updated: February 2026
              </p>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using the Her Wellness Harmony website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">2. Description of Services</h2>
                <p>
                  Her Wellness Harmony provides wellness education, coaching services, and digital products including e-books and guides related to gut health, hormonal balance, and overall well-being. Our services are intended for educational and informational purposes only.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">3. User Responsibilities</h2>
                <p>You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information when registering or making purchases</li>
                  <li>Use our services for lawful purposes only</li>
                  <li>Not reproduce, distribute, or sell our content without permission</li>
                  <li>Respect the intellectual property rights of Her Wellness Harmony</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">4. Intellectual Property</h2>
                <p>
                  All content on this website, including text, graphics, logos, images, audio, video, and digital downloads, is the property of Her Wellness Harmony and is protected by copyright and intellectual property laws. You may not reproduce, modify, or distribute any content without express written permission.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">5. Digital Products</h2>
                <p>
                  Upon purchase of digital products (e-books, guides, etc.), you are granted a non-exclusive, non-transferable license for personal use only. Sharing, reselling, or distributing purchased digital products is strictly prohibited.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">6. Payment and Refunds</h2>
                <p>
                  All payments are processed securely through our payment providers. Due to the digital nature of our products, refunds are handled on a case-by-case basis. Please contact us within 14 days of purchase if you have concerns about your order.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">7. Limitation of Liability</h2>
                <p>
                  Her Wellness Harmony and its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or any content provided.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">8. Modifications to Terms</h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services constitutes acceptance of any modifications.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">9. Contact Information</h2>
                <p>
                  For questions about these Terms of Service, please contact us at{" "}
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

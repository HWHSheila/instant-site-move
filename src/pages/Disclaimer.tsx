import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Disclaimer" />
      <Header />
      
      <main className="flex-grow pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">Legal</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-8">
              Disclaimer
            </h1>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-sm text-muted-foreground">
                Last updated: February 2026
              </p>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Health and Wellness Disclaimer</h2>
                <p>
                  The information provided by Her Wellness Harmony through this website, e-books, guides, social media, and any other content is for <strong>educational and informational purposes only</strong>. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Not Medical Advice</h2>
                <p>
                  The content shared by Her Wellness Harmony is not intended to diagnose, treat, cure, or prevent any disease or health condition. Always seek the advice of your physician, registered dietitian, or other qualified healthcare provider with any questions you may have regarding a medical condition or before starting any new diet, supplement, or wellness program.
                </p>
                <p>
                  Never disregard professional medical advice or delay seeking it because of something you have read on this website or in our materials.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Individual Results May Vary</h2>
                <p>
                  Testimonials, case studies, and examples shared on this website represent individual experiences. Results vary based on individual factors including but not limited to: starting health status, adherence to recommendations, genetic factors, lifestyle choices, and pre-existing conditions. We make no guarantees regarding specific health outcomes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Nutritional Information</h2>
                <p>
                  Any nutritional information, recipes, or dietary suggestions provided are for general educational purposes. They are not tailored to your individual health needs and may not be appropriate for everyone. Consult with a qualified healthcare professional before making significant changes to your diet, especially if you have food allergies, intolerances, or medical conditions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Supplement Disclaimer</h2>
                <p>
                  Any mention of supplements or nutritional products is for informational purposes only. Supplements are not regulated by the FDA in the same way as medications. Always consult your healthcare provider before starting any new supplement, especially if you are pregnant, nursing, taking medications, or have existing health conditions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Affiliate Disclosure</h2>
                <p>
                  Her Wellness Harmony may participate in affiliate programs. This means we may receive a commission if you purchase products through links on our website. This does not affect the price you pay or our recommendations—we only recommend products we genuinely believe in and have personally used or thoroughly researched.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">External Links</h2>
                <p>
                  Our website may contain links to external websites or resources. We are not responsible for the content, accuracy, or practices of these third-party sites. Inclusion of any link does not imply endorsement.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Limitation of Liability</h2>
                <p>
                  By using this website and our services, you agree that Her Wellness Harmony, its owner, employees, and affiliates are not liable for any damages, injuries, or losses that may result from the use of information provided. You assume full responsibility for how you choose to use the information shared.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-display font-medium text-foreground">Questions</h2>
                <p>
                  If you have any questions about this disclaimer, please contact us at{" "}
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

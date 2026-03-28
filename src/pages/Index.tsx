import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About, WorkingWith } from "@/components/About";
import { Services } from "@/components/Services";
import { EBooks } from "@/components/EBooks";
import { EssentialOils } from "@/components/EssentialOils";
import { Contact } from "@/components/Contact";
import { ContactInfo } from "@/components/ContactInfo";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Her Wellness Harmony"
        description="Root-cause wellness for women… Gut → Metabolism → Hormones… structured resets without chaos."
        ogImage="https://www.herwellnessharmony.com/og-preview-3.png"
        ogUrl="https://www.herwellnessharmony.com"
      />
      <Header />
      <Hero />
      <About />
      <WorkingWith />
      <Services />
      <EBooks />
      <EssentialOils />
      <Contact />
      <ContactInfo />
      <Footer />
    </div>
  );
};

export default Index;

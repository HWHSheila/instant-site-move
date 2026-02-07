import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About, WorkingWith } from "@/components/About";
import { Services } from "@/components/Services";
import { EBooks } from "@/components/EBooks";
import { Contact } from "@/components/Contact";
import { ContactInfo } from "@/components/ContactInfo";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <Header />
      <Hero />
      <About />
      <WorkingWith />
      <Services />
      <EBooks />
      <Contact />
      <ContactInfo />
      <Footer />
    </div>
  );
};

export default Index;

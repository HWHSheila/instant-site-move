import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About, WorkingWith } from "@/components/About";
import { Services } from "@/components/Services";
import { EBooks } from "@/components/EBooks";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <WorkingWith />
      <Services />
      <EBooks />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;

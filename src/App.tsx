import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import FreeGuide from "./pages/FreeGuide";
import FreeGuideThankYou from "./pages/FreeGuideThankYou";
import ThankYouRoadmap from "./pages/ThankYouRoadmap";
import GutRoadmap from "./pages/GutRoadmap";
import RootCauseFree from "./pages/RootCauseFree";
import GLP1Signal from "./pages/GLP1Signal";
import GLP1Confirm from "./pages/GLP1Confirm";
import GLP1ThankYou from "./pages/GLP1ThankYou";
import GLP1BundleConfirm from "./pages/GLP1BundleConfirm";
import GLP1BundleThankYou from "./pages/GLP1BundleThankYou";
import GLP1Option from "./pages/GLP1Option";
import Confirm from "./pages/Confirm";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/free-guide" element={<FreeGuide />} />
          <Route path="/free-guide/thank-you" element={<FreeGuideThankYou />} />
          <Route path="/thank-you-roadmap" element={<ThankYouRoadmap />} />
          <Route path="/gutroadmap" element={<GutRoadmap />} />
          <Route path="/root-cause-free" element={<RootCauseFree />} />
          <Route path="/glp1-signal" element={<GLP1Signal />} />
          <Route path="/glp1-confirm" element={<GLP1Confirm />} />
          <Route path="/glp1-thankyou" element={<GLP1ThankYou />} />
          <Route path="/glp1-option" element={<GLP1Option />} />
          <Route path="/glp1-bundle-confirm" element={<GLP1BundleConfirm />} />
          <Route path="/glp1-bundle-thankyou" element={<GLP1BundleThankYou />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

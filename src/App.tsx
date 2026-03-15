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
import Phase1GutReset from "./pages/Phase1GutReset";
import ThirtyDayRoadmap from "./pages/ThirtyDayRoadmap";
import FourWeekCoaching from "./pages/FourWeekCoaching";
import FourWeekConfirm from "./pages/FourWeekConfirm";
import FourWeekThankYou from "./pages/FourWeekThankYou";
import Confirm from "./pages/Confirm";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import StrategyCall from "./pages/StrategyCall";
import WellnessConsultation from "./pages/WellnessConsultation";
import LabReview from "./pages/LabReview";
import FollowUpSession from "./pages/FollowUpSession";
import SupplementReview from "./pages/SupplementReview";
import RoutineBlueprint from "./pages/RoutineBlueprint";
import FreeStrategyIntake from "./pages/FreeStrategyIntake";
import StrategyIntakeThankYou from "./pages/StrategyIntakeThankYou";
import NinetyDayCoaching from "./pages/NinetyDayCoaching";
import NinetyDayCoachingConfirm from "./pages/NinetyDayCoachingConfirm";
import NinetyDayCoachingThankYou from "./pages/NinetyDayCoachingThankYou";
import SixMonthCoaching from "./pages/SixMonthCoaching";
import SixMonthCoachingConfirm from "./pages/SixMonthCoachingConfirm";
import SixMonthCoachingThankYou from "./pages/SixMonthCoachingThankYou";
import TwelveMonthCoaching from "./pages/TwelveMonthCoaching";
import TwelveMonthCoachingConfirm from "./pages/TwelveMonthCoachingConfirm";
import TwelveMonthCoachingThankYou from "./pages/TwelveMonthCoachingThankYou";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { PortalLayout } from "./components/portal/PortalLayout";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalStartHere from "./pages/portal/PortalStartHere";
import PortalPatterns from "./pages/portal/PortalPatterns";
import PortalPathways from "./pages/portal/PortalPathways";
import PortalAICoaching from "./pages/portal/PortalAICoaching";
import PortalWeeklyNotes from "./pages/portal/PortalWeeklyNotes";
import PortalCommunity from "./pages/portal/PortalCommunity";
import PortalUpgrade from "./pages/portal/PortalUpgrade";
import PortalAccount from "./pages/portal/PortalAccount";


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
          <Route path="/90day-phase1" element={<Phase1GutReset />} />
            <Route path="/30day-roadmap" element={<ThirtyDayRoadmap />} />
            <Route path="/glp1-bundle-confirm" element={<GLP1BundleConfirm />} />
            <Route path="/glp1-bundle-thankyou" element={<GLP1BundleThankYou />} />
            <Route path="/4-week-coaching" element={<FourWeekCoaching />} />
            <Route path="/4-week-confirm" element={<FourWeekConfirm />} />
            <Route path="/4-week-thankyou" element={<FourWeekThankYou />} />
            <Route path="/confirm" element={<Confirm />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/strategy-call" element={<StrategyCall />} />
          <Route path="/wellness-consultation" element={<WellnessConsultation />} />
          <Route path="/lab-review" element={<LabReview />} />
          <Route path="/follow-up-session" element={<FollowUpSession />} />
          <Route path="/supplement-review" element={<SupplementReview />} />
          <Route path="/routine-blueprint" element={<RoutineBlueprint />} />
          <Route path="/free-strategy-intake" element={<FreeStrategyIntake />} />
          <Route path="/strategy-intake-thankyou" element={<StrategyIntakeThankYou />} />
          <Route path="/90day-coaching" element={<NinetyDayCoaching />} />
          <Route path="/90day-coaching-confirm" element={<NinetyDayCoachingConfirm />} />
          <Route path="/90day-coaching-thankyou" element={<NinetyDayCoachingThankYou />} />
          <Route path="/6month-coaching" element={<SixMonthCoaching />} />
          <Route path="/6month-coaching-confirm" element={<SixMonthCoachingConfirm />} />
          <Route path="/6month-coaching-thankyou" element={<SixMonthCoachingThankYou />} />
          <Route path="/12month-coaching" element={<TwelveMonthCoaching />} />
          <Route path="/12month-coaching-confirm" element={<TwelveMonthCoachingConfirm />} />
          <Route path="/12month-coaching-thankyou" element={<TwelveMonthCoachingThankYou />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Membership Portal */}
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<PortalDashboard />} />
            <Route path="dashboard" element={<PortalDashboard />} />
            <Route path="start-here" element={<PortalStartHere />} />
            <Route path="patterns" element={<PortalPatterns />} />
            <Route path="pathways" element={<PortalPathways />} />
            <Route path="HWHcoach" element={<PortalAICoaching />} />
            <Route path="weekly-notes" element={<PortalWeeklyNotes />} />
            <Route path="community" element={<PortalCommunity />} />
            <Route path="coaching" element={<PortalUpgrade />} />
            <Route path="account" element={<PortalAccount />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

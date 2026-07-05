import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useSubscriber, useJourneyProgress } from "@/hooks/use-subscriber";
import {
  useMiniAssessments,
  useAssessmentSchedule,
  useSubmitMiniAssessment,
  dayNumberForType,
} from "@/hooks/use-mini-assessments";
import { BASELINE_RATING_ITEMS } from "@/lib/assessment-data";
import { assessmentLabel, type AssessmentType } from "@/lib/mini-assessment-schedule";
import { RatingSlider } from "@/components/portal/RatingSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";

function buildDefaultRatings(): Record<string, number> {
  const ratings: Record<string, number> = {};
  for (const cat of BASELINE_RATING_ITEMS) {
    for (const item of cat.items) {
      ratings[item.key] = 5;
    }
  }
  return ratings;
}

export default function PortalMiniAssessment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supabase = useSupabase();
  const { subscriber } = useSubscriber();
  const { data: progress } = useJourneyProgress(subscriber?.id);
  const { data: assessments = [], isLoading } = useMiniAssessments(subscriber?.id);
  const { dayNumber, dueType } = useAssessmentSchedule(subscriber, progress, assessments);
  const submitAssessment = useSubmitMiniAssessment(subscriber?.id);

  const requestedType = searchParams.get("type") as AssessmentType | null;
  const assessmentType = requestedType ?? dueType;

  const [ratings, setRatings] = useState<Record<string, number>>(buildDefaultRatings);
  const [openImproved, setOpenImproved] = useState("");
  const [openChallenging, setOpenChallenging] = useState("");
  const [openNote, setOpenNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const alreadyDone = useMemo(
    () => assessments.some((a) => a.assessment_type === assessmentType),
    [assessments, assessmentType]
  );

  const setRating = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const fireMiniAssessmentTrigger = async (type: AssessmentType) => {
    if (!subscriber?.email) return;
    const triggerMap: Partial<Record<AssessmentType, string>> = {
      day_11: "day_11_mini_assessment",
      day_21: "day_21_mini_assessment",
      semi_monthly: "semi_monthly_check_in",
    };
    const triggerName = triggerMap[type];
    if (!triggerName) return;

    try {
      await supabase.functions.invoke("fire-mailerlite-trigger", {
        body: {
          trigger_name: triggerName,
          subscriber_id: subscriber.id,
          email: subscriber.email,
          trigger_data: { assessment_type: type, day_number: dayNumber },
        },
      });
    } catch {
      // Non-blocking — trigger logging is best-effort until Sheila provides API key
    }
  };

  const handleSubmit = async () => {
    if (!assessmentType || !subscriber) return;

    try {
      await submitAssessment.mutateAsync({
        assessment_type: assessmentType,
        day_number: dayNumberForType(assessmentType, dayNumber),
        ratings,
        open_text_improved: openImproved,
        open_text_challenging: openChallenging,
        open_text_note_to_sheila: openNote,
      });
      await fireMiniAssessmentTrigger(assessmentType);
      setSubmitted(true);
      toast.success("Check-in saved. Thank you!");
    } catch {
      toast.error("Could not save your check-in. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subscriber?.assessment_completed) {
    return (
      <>
        <SEO title="Progress Check-In" noindex />
        <div className="space-y-4 text-center max-w-lg mx-auto py-12">
          <h1 className="font-display text-2xl font-semibold">Complete Your Assessment First</h1>
          <p className="text-muted-foreground">
            Your Day 1 baseline is captured as part of the Wellness Assessment.
          </p>
          <Button onClick={() => navigate("/portal/intake")}>Take Assessment</Button>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <SEO title="Check-In Complete" noindex />
        <div className="space-y-6 max-w-lg mx-auto text-center py-12">
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto" />
          <h1 className="font-display text-2xl font-semibold">Check-In Saved</h1>
          <p className="text-muted-foreground">
            Your responses have been recorded. View your progress comparison anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/portal/progress")}>View My Progress</Button>
            <Button variant="outline" onClick={() => navigate("/portal/pathways")}>
              Back to Roadmap
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!assessmentType) {
    return (
      <>
        <SEO title="Progress Check-In" noindex />
        <div className="space-y-4 text-center max-w-lg mx-auto py-12">
          <h1 className="font-display text-2xl font-semibold">No Check-In Due Yet</h1>
          <p className="text-muted-foreground">
            Your next progress check-in unlocks on Day 11, Day 21, and every 15 days after that.
            You are on Day {dayNumber || 1}.
          </p>
          <Button variant="outline" onClick={() => navigate("/portal/progress")}>
            View Progress
          </Button>
        </div>
      </>
    );
  }

  if (alreadyDone) {
    return (
      <>
        <SEO title="Progress Check-In" noindex />
        <div className="space-y-4 text-center max-w-lg mx-auto py-12">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          <h1 className="font-display text-2xl font-semibold">Already Completed</h1>
          <p className="text-muted-foreground">
            You have already submitted your {assessmentLabel(assessmentType)}.
          </p>
          <Button onClick={() => navigate("/portal/progress")}>View Comparison</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={assessmentLabel(assessmentType)} noindex />
      <div className="space-y-6 max-w-2xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/portal/progress")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Progress
        </Button>

        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">
            {assessmentLabel(assessmentType)}
          </h1>
          <p className="text-muted-foreground mt-1">
            Rate your current experience (1 = severe/constant, 10 = none/resolved). Day {dayNumber}.
          </p>
        </div>

        {BASELINE_RATING_ITEMS.map((cat) => (
          <Card key={cat.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-primary">{cat.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cat.items.map((item) => (
                <RatingSlider
                  key={item.key}
                  label={item.label}
                  value={ratings[item.key] ?? 5}
                  onChange={(v) => setRating(item.key, v)}
                />
              ))}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reflections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="open_improved">
                What has felt different or improved since your last check-in?
              </Label>
              <Textarea
                id="open_improved"
                value={openImproved}
                onChange={(e) => setOpenImproved(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="open_challenging">
                What is still present or challenging?
              </Label>
              <Textarea
                id="open_challenging"
                value={openChallenging}
                onChange={(e) => setOpenChallenging(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="open_note">
                Is there anything you want Sheila to know about where you are right now?
              </Label>
              <Textarea
                id="open_note"
                value={openNote}
                onChange={(e) => setOpenNote(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleSubmit}
          disabled={submitAssessment.isPending}
        >
          {submitAssessment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Submit Check-In
        </Button>
      </div>
    </>
  );
}

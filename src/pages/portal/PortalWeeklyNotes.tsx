import { SEO } from "@/components/SEO";
import { FileText } from "lucide-react";

const placeholderNotes = [
  {
    date: "March 15, 2026",
    title: "Why morning routines matter more than you think",
    preview: "The first 90 minutes of your day set the tone for your digestive rhythm, cortisol curve, and energy pacing...",
  },
  {
    date: "March 8, 2026",
    title: "A note on cravings and stress patterns",
    preview: "When cravings show up at the same time each day, it often reflects a pattern in blood sugar regulation rather than willpower...",
  },
];

export default function PortalWeeklyNotes() {
  return (
    <>
      <SEO title="Weekly Coaching Notes" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Weekly Coaching Notes</h1>
          <p className="text-muted-foreground mt-1">
            Short coaching insights and reminders posted regularly.
          </p>
        </div>

        <div className="space-y-4">
          {placeholderNotes.map((note) => (
            <div key={note.title} className="p-5 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground">{note.date}</p>
              <p className="font-display text-base font-semibold text-foreground mt-1">{note.title}</p>
              <p className="text-sm text-muted-foreground mt-2">{note.preview}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
          <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">New coaching notes are posted weekly. Check back for fresh insights.</p>
        </div>
      </div>
    </>
  );
}

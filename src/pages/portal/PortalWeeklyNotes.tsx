import { SEO } from "@/components/SEO";
import { FileText, Loader2 } from "lucide-react";
import { useMemberContentPosts } from "@/hooks/use-member-content-posts";
import { useSubscriber } from "@/hooks/use-subscriber";
import { usePreviewTier } from "@/components/portal/PortalLayout";

export default function PortalWeeklyNotes() {
  const { subscriber } = useSubscriber();
  const { previewTier, isAdmin } = usePreviewTier();
  const { data: notes = [], isLoading } = useMemberContentPosts("weekly_note", false);

  const effectiveTier =
    isAdmin && previewTier !== "admin" ? previewTier : subscriber?.tier;

  const visible = notes.filter((note) => {
    if (isAdmin && previewTier === "admin") return true;
    if (!effectiveTier) return false;
    return note.tier_access.includes(effectiveTier);
  });

  return (
    <>
      <SEO title="Weekly Coaching Notes" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            Weekly Coaching Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            Short coaching insights and reminders posted regularly.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              New coaching notes are posted weekly. Check back for fresh insights.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((note) => (
              <div key={note.id} className="p-5 rounded-xl border border-border bg-card">
                <p className="text-xs text-muted-foreground">
                  {note.published_at
                    ? new Date(note.published_at).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })
                    : ""}
                </p>
                <p className="font-display text-base font-semibold text-foreground mt-1">
                  {note.title}
                </p>
                <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {note.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

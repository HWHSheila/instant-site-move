import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Loader2,
  Save,
  Search,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

type PortalVideo = {
  id: string;
  video_code: string;
  title: string;
  phase: string;
  sub_category: string;
  production_status: string;
};

type ScriptResult = {
  learning_objective: string;
  introduction: string;
  core_educational_content: string;
  practical_application: string;
  gmh_cascade_connection: string;
  transition: string;
  action_items: string[];
  reflection_prompt: string | null;
  legal_disclaimer: string;
};

const SECONDARY_STRENGTHS = [
  { value: "analytical", label: "Analytical", desc: "Logical cause-and-effect, data-driven" },
  { value: "relator", label: "Relator", desc: "Warm personal connection, relatable" },
  { value: "futuristic", label: "Futuristic", desc: "Forward-looking vision, possibility" },
];

const SCRIPT_SECTIONS = [
  { key: "learning_objective", label: "Learning Objective" },
  { key: "introduction", label: "Introduction" },
  { key: "core_educational_content", label: "Core Educational Content" },
  { key: "practical_application", label: "Practical Application" },
  { key: "gmh_cascade_connection", label: "GMH Cascade Connection" },
  { key: "transition", label: "Transition" },
] as const;

export default function PortalScriptGenerator() {
  const supabase = useSupabase();
  const [videos, setVideos] = useState<PortalVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<PortalVideo | null>(null);
  const [secondaryStrength, setSecondaryStrength] = useState("analytical");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [script, setScript] = useState<ScriptResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(SCRIPT_SECTIONS.map(s => s.key)));

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("portal_videos")
        .select("id, video_code, title, phase, sub_category, production_status")
        .order("phase")
        .order("sequence_order");
      if (error) toast.error("Failed to load videos");
      else setVideos((data as PortalVideo[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [supabase]);

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
    || v.video_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateScript = async () => {
    if (!selectedVideo) { toast.error("Select a video first"); return; }
    setGenerating(true);
    setScript(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const resp = await fetch(`${supabaseUrl}/functions/v1/generate-portal-script`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({
          videoCode: selectedVideo.video_code,
          videoTitle: selectedVideo.title,
          phase: selectedVideo.phase,
          subCategory: selectedVideo.sub_category,
          secondaryStrength,
        }),
      });

      const result = await resp.json();
      if (!result.success) throw new Error(result.error || "Generation failed");
      setScript(result.script);
      toast.success("Script generated");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const saveScript = async () => {
    if (!script || !selectedVideo) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("portal_video_scripts").upsert({
        video_code: selectedVideo.video_code,
        learning_objective: script.learning_objective,
        introduction: script.introduction,
        core_educational_content: script.core_educational_content,
        practical_application: script.practical_application,
        gmh_cascade_connection: script.gmh_cascade_connection,
        transition: script.transition,
        action_items: script.action_items || [],
        reflection_prompt: script.reflection_prompt,
        generated_at: new Date().toISOString(),
      }, { onConflict: "video_code" });

      if (error) throw error;

      if (selectedVideo.production_status === "not_started") {
        await supabase.from("portal_videos")
          .update({ production_status: "scripted", secondary_strength: secondaryStrength })
          .eq("id", selectedVideo.id);
        setVideos(prev => prev.map(v => v.id === selectedVideo.id
          ? { ...v, production_status: "scripted" } : v));
      }

      toast.success("Script saved");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const copyFullScript = () => {
    if (!script) return;
    const text = SCRIPT_SECTIONS.map(s => `${s.label.toUpperCase()}\n${(script as Record<string, unknown>)[s.key]}`).join("\n\n")
      + (script.action_items?.length ? `\n\nACTION ITEMS\n${script.action_items.map((a, i) => `${i + 1}. ${a}`).join("\n")}` : "")
      + (script.reflection_prompt ? `\n\nREFLECTION\n${script.reflection_prompt}` : "")
      + `\n\nDISCLAIMER\n${script.legal_disclaimer}`;
    navigator.clipboard.writeText(text);
    toast.success("Script copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Portal Script Generator
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate educational lesson scripts for portal videos.
          Primary strength: <span className="font-medium text-foreground">Command</span> (locked).
        </p>
      </div>

      {/* Step 1: Pick Video */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1. Select Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search videos..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          {loading ? (
            <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {filteredVideos.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVideo(v); setScript(null); }}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between gap-2 hover:bg-muted transition-colors ${selectedVideo?.id === v.id ? "bg-primary/10" : ""}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground w-12 shrink-0">{v.video_code}</span>
                    <span className="truncate">{v.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{v.phase}</span>
                    {v.production_status === "scripted" && <Badge className="bg-yellow-100 text-yellow-700 text-xs">Scripted</Badge>}
                    {selectedVideo?.id === v.id && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          )}
          {selectedVideo && (
            <div className="text-sm bg-muted/50 rounded-lg p-3 space-y-1">
              <p><span className="text-muted-foreground">Selected:</span> <span className="font-medium">{selectedVideo.video_code} — {selectedVideo.title}</span></p>
              <p className="text-muted-foreground">{selectedVideo.phase} → {selectedVideo.sub_category}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Secondary Strength */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">2. Choose Secondary Strength</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SECONDARY_STRENGTHS.map(s => (
              <button
                key={s.value}
                onClick={() => setSecondaryStrength(s.value)}
                className={`text-left p-3 rounded-lg border-2 transition-colors ${secondaryStrength === s.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"}`}
              >
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Generate */}
      <Button
        className="w-full"
        size="lg"
        disabled={!selectedVideo || generating}
        onClick={generateScript}
      >
        {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
          : <><Sparkles className="w-4 h-4 mr-2" />Generate Script</>}
      </Button>

      {/* Script Output */}
      {script && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated Script</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyFullScript}>
                <Copy className="w-4 h-4 mr-2" />Copy
              </Button>
              <Button size="sm" onClick={saveScript} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                  : <><Save className="w-4 h-4 mr-2" />Save Script</>}
              </Button>
            </div>
          </div>

          {SCRIPT_SECTIONS.map(s => (
            <Card key={s.key}>
              <button
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection(s.key)}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                {expandedSections.has(s.key)
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {expandedSections.has(s.key) && (
                <CardContent className="pt-0 pb-4 px-5">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {(script as Record<string, unknown>)[s.key] as string}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Action Items */}
          {script.action_items && script.action_items.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {script.action_items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reflection Prompt */}
          {script.reflection_prompt && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-amber-700">Reflection Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-amber-900">{script.reflection_prompt}</p>
              </CardContent>
            </Card>
          )}

          {/* Legal Disclaimer */}
          <Card className="border-muted">
            <CardContent className="py-3 px-5">
              <p className="text-xs text-muted-foreground italic">{script.legal_disclaimer}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

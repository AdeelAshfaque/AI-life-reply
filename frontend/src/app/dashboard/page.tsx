"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDiary,
  getGraph,
  getMemories,
  getTimeline,
  getWeeklyInsights,
  searchMemories,
  uploadMemory,
  type DiaryEntry,
  type GraphResponse,
  type MemoryItem,
  type TimelineItem,
} from "@/lib/api";

type WeeklyInsights = {
  studied_days: number;
  football_days: number;
  university_days: number;
  top_people: string[];
  top_locations: string[];
};

export default function DashboardPage() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("When did I last play football?");
  const [searchAnswer, setSearchAnswer] = useState<string>("Ask a question above to look up vectors.");
  const [insights, setInsights] = useState<WeeklyInsights | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("System standby.");

  // Safely hydrate the interface without allowing single route rejections to stall execution loops
  useEffect(() => {
    console.log("Dashboard pipeline initializing standard fetching sequences...");

    getMemories()
      .then((res) => setMemories(res?.items || []))
      .catch((err) => console.error("Error fetching memories:", err));

    getTimeline()
      .then((res) => setTimeline(res?.items || []))
      .catch((err) => console.error("Error fetching timeline:", err));

    getDiary()
      .then((res) => setDiary(res))
      .catch((err) => console.error("Error fetching diary summary:", err));

    getGraph("Ali")
      .then((res) => setGraph(res))
      .catch((err) => console.error("Error building focus graph node maps:", err));

    getWeeklyInsights()
      .then((res) => setInsights(res))
      .catch((err) => console.error("Error aggregating analytical insights:", err));
  }, []);

  const graphHighlights = useMemo(() => graph?.nodes ?? ["Ali", "Football", "Library"], [graph]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`Action triggered: Uploading tracking sequence for ${file.name}`);
    setUploadStatus(`Uploading stream component: ${file.name}...`);

    try {
      const response = await uploadMemory(file);
      console.log("Upload payload successfully committed:", response);
      setUploadStatus(`Successfully Saved: ${response.title}`);
      
      // Instantly refresh localized historical states 
      const freshMemories = await getMemories();
      setMemories(freshMemories.items || []);
      const freshTimeline = await getTimeline();
      setTimeline(freshTimeline.items || []);
    } catch (error) {
      console.error("Upload process encountered a network fault:", error);
      setUploadStatus("Upload failed. Verify local storage routes or CORS constraints.");
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    
    console.log(`Action triggered: Querying memory vector space for: "${searchQuery}"`);
    setSearchAnswer("Scanning structural indexes...");

    try {
      const response = await searchMemories(searchQuery);
      console.log("Search query resolved successfully:", response);
      setSearchAnswer(response.answer || "No string output provided by context algorithms.");
    } catch (error) {
      console.error("Vector lookup sequence was rejected:", error);
      setSearchAnswer("Search execution context timed out. Check terminal routing output.");
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100 font-light pb-20">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        
        {/* Simple Minimalistic Header Bar */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">AI Life Replay</p>
            <h1 className="mt-1 text-3xl font-medium tracking-tight text-white">Dashboard</h1>
          </div>
          
          <div className="flex flex-wrap gap-6">
            {[
              ["Memories Index", String(memories.length)],
              ["Graph links", String(graph?.edges?.length ?? 0)],
              ["Latency", "< 1 sec"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-[100px]">
                <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-xl font-semibold text-white mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </header>

        {/* Action Center Layout Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Document Upload Asset Manager Box */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-cyan-300 uppercase tracking-wider">Engine Input</p>
              <h2 className="text-xl font-medium text-white mt-1 mb-4">Upload New Memory</h2>
              <label className="block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-6 text-center hover:bg-slate-950/60 transition duration-200">
                <p className="text-sm font-medium text-slate-200">Select image memory asset</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                <span className="mt-4 inline-flex rounded-full bg-cyan-300 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md">
                  Browse Device
                </span>
              </label>
            </div>
            <div className="mt-4 rounded-xl bg-slate-950/50 p-3 text-xs text-slate-300 font-mono border border-white/5">
              Status: {uploadStatus}
            </div>
          </article>

          {/* Natural Language Processing Search Box */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-cyan-300 uppercase tracking-wider">Natural Query</p>
              <h2 className="text-xl font-medium text-white mt-1 mb-4">Ask Your Life Anything</h2>
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 transition"
                  placeholder="Ask a question..."
                />
                <button 
                  onClick={handleSearch} 
                  className="rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200 transition active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-cyan-300/10 bg-cyan-300/5 p-4 text-sm leading-relaxed text-slate-200 min-h-[64px]">
              {searchAnswer}
            </div>
          </article>
        </div>

        {/* Live Aggregation Summary Stream Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* System Timeline Stream component */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">Today's Timeline Stream</h2>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Live Feed</span>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {timeline.length > 0 ? (
                timeline.map((entry, idx) => (
                  <div key={idx} className="flex gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-3.5 text-sm">
                    <span className="font-mono font-medium text-cyan-300 shrink-0 w-12">{entry.time}</span>
                    <div>
                      <p className="font-medium text-white">{entry.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{entry.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No records returned for the today cycle context.</p>
              )}
            </div>
          </article>

          {/* System AI Generated Journal Core Summary Box */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">Nightly Diary Synthesis</h2>
              {diary?.mood && (
                <span className="rounded-full bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-0.5 text-xs text-cyan-300 font-mono">
                  Mood: {diary.mood}
                </span>
              )}
            </div>
            <div className="h-full rounded-2xl bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-300 border border-white/5 min-h-[150px]">
              {diary?.diary ?? "Generating diary entry sequence data summary..."}
            </div>
          </article>
        </div>

        {/* Analytics Context Map Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Knowledge Graph Vector Association Strings Block */}
          <article className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-medium text-slate-400 mb-3">
              Knowledge Graph Connections {graph?.focus && `(Focus: ${graph.focus})`}
            </h2>
            <div className="flex flex-wrap gap-2">
              {graphHighlights.map((node, idx) => (
                <span
                  key={idx}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide ${
                    idx === 0 ? "bg-cyan-300 text-slate-950" : "bg-white/5 text-slate-200 border border-white/10"
                  }`}
                >
                  {node}
                </span>
              ))}
            </div>
          </article>

          {/* Numerical Analytics Trackers Box */}
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl flex flex-col justify-between text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                <p className="text-slate-400 scale-90">Study</p>
                <p className="text-base font-semibold text-white mt-1">{insights?.studied_days ?? 0}d</p>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                <p className="text-slate-400 scale-90">Football</p>
                <p className="text-base font-semibold text-white mt-1">{insights?.football_days ?? 0}d</p>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                <p className="text-slate-400 scale-90">Uni</p>
                <p className="text-base font-semibold text-white mt-1">{insights?.university_days ?? 0}d</p>
              </div>
            </div>
            <div className="text-slate-400 mt-3 space-y-1 leading-relaxed">
              <p><strong className="text-slate-200">Peers:</strong> {insights?.top_people?.join(", ") || "None listed"}</p>
              <p><strong className="text-slate-200">Hubs:</strong> {insights?.top_locations?.join(", ") || "None listed"}</p>
            </div>
          </article>
        </div>

        {/* Master Database Index List Section */}
        <section className="mt-4">
          <h2 className="text-xl font-medium text-white mb-4">Historical Archive</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memories.map((memory, index) => (
              <div key={index} className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-medium text-white text-sm">{memory.title}</h3>
                    <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400 shrink-0">
                      {memory.date}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{memory.description}</p>
                </div>
                {memory.tags && memory.tags.length > 0 && (
                  <p className="mt-3 text-[10px] font-mono tracking-wider text-cyan-300/70 uppercase">
                    {memory.tags.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </section>
    </main>
  );
}
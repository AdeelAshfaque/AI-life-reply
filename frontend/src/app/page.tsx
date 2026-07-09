"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMemories,
  getTimeline,
  getGraph,
  type MemoryItem,
  type TimelineItem,
  type GraphResponse,
} from "@/lib/api";

const journey = [
  {
    step: "Upload",
    detail: "Drop photos from your day and tag them with one click.",
  },
  {
    step: "AI summary",
    detail: "Each image becomes a memory with a caption, mood, and timeline slot.",
  },
  {
    step: "Search",
    detail: "Ask questions like 'When did I last play football?' and get a direct answer.",
  },
  {
    step: "Memory graph",
    detail: "Related people, places, and events connect into a discoverable network.",
  },
];

export default function Home() {
  // Backend states
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBackendData() {
      try {
        const [memoriesResponse, timelineResponse, graphResponse] = await Promise.all([
          getMemories(),
          getTimeline(),
          getGraph("Ali"), // Adjust default node query if needed
        ]);

        setMemories(memoriesResponse.items || []);
        setTimeline(timelineResponse.items || []);
        setGraph(graphResponse);
      } catch (error) {
        console.error("Backend offline or unreachable from landing page:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadBackendData();
  }, []);

  // Dynamically calculate stats based on backend responses
  const stats = [
    { label: "Memories indexed", value: isLoading ? "..." : String(memories.length) },
    { label: "Search time", value: "< 1 sec" },
    { label: "Daily diary", value: "Auto-generated" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,183,77,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_22%),linear-gradient(180deg,_#08111f_0%,_#0b1220_52%,_#111827_100%)] text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 lg:px-10">
        
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">AI Life Replay</p>
            <p className="text-sm text-slate-300">Your life automatically becomes a searchable memory.</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Open demo dashboard
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
              Built for a 24-48 hour hackathon
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Make photos behave like a memory engine, not just a gallery.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Upload a photo, let AI describe it, turn it into a timeline entry, generate a nightly diary, and let users ask natural-language questions over their life.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                View product flow
              </Link>
              <a
                href="#features"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See features
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-sm text-slate-300">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Dynamic Dashboard Preview Box */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-cyan-300/20 blur-3xl" />
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Today&apos;s replay</p>
                  <p className="text-lg font-semibold text-white">Timeline + AI summary</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Live preview
                </span>
              </div>

              {/* Live Timeline Display (Shows up to 3 live items) */}
              <div className="mt-4 space-y-4">
                {timeline.length > 0 ? (
                  timeline.slice(0, 3).map((entry, idx) => (
                    <article key={idx} className="rounded-3xl border border-white/8 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-base font-semibold text-white">{entry.title}</h2>
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                          {entry.time}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{entry.note}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 p-4 text-center">
                    {isLoading ? "Fetching live timeline..." : "No items recorded in today's timeline yet."}
                  </p>
                )}
              </div>

              {/* Dynamic Graph Chain Connection */}
              <div className="mt-4 rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-4">
                <p className="text-sm text-cyan-100">Memory Graph highlight</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {graph && graph.nodes && graph.nodes.length > 0 
                    ? graph.nodes.join(" → ") 
                    : "Connect to your backend to view mapped associations."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section id="features" className="grid gap-4 lg:grid-cols-4">
          {journey.map((item, index) => (
            <div key={item.step} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">0{index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.step}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
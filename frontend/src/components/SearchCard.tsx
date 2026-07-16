"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

// 1. Define what a real memory response looks like from your Python backend
interface MemoryResult {
  id: string;
  title: string;
  diary_entry: string; // The humanized diary text from your AI
  image_url: string;   // URL path to the image hosted on your backend/S3
  timestamp: string;   // e.g., "June 10, 2026 • 17:23"
  tags: string[];
}


export default function SearchCard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<MemoryResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Fetch data from your Uvicorn/FastAPI backend
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Adjust port 8000 to match your actual FastAPI/Uvicorn port configuration
      const response = await fetch(`http://localhost:8000/api/search?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error("Failed to pull search data from the memory engine");
      }

      const data = await response.json();
      setResults(data); // Expecting an array of MemoryResult objects
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      {/* Title & Input Bar Box */}
      <div className="shrink-0 space-y-2">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Ask Your Memories
        </h3>
        <p className="text-xs text-slate-500">
          Search naturally, like "when did I play football?"
        </p>
        
        {/* Form wrapper handles 'Enter' key submission automatically */}
        <form onSubmit={handleSearch} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask something..."
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-600/10 shrink-0 flex items-center gap-1.5"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      {/* Results Dynamic View Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading Skeleton Placeholder State */}
        {isLoading && (
          <div className="animate-pulse flex gap-5 p-4 bg-slate-900/20 rounded-2xl border border-slate-800/50">
            <div className="w-32 h-32 bg-slate-800 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-slate-800 rounded w-1/4" />
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-5/6" />
            </div>
          </div>
        )}

        {/* Empty State handling */}
        {!isLoading && results.length === 0 && searchQuery && (
          <p className="text-center text-xs text-slate-500 py-6">No matching memories found.</p>
        )}

        {/* Dynamic Mapping over real API Results */}
        {!isLoading && results.map((item) => (
          <div 
            key={item.id} 
            className="group relative flex flex-col md:flex-row gap-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition-all duration-300 hover:border-slate-700/50 hover:bg-slate-950/60"
          >
            {/* 1. Dynamic Image Preview Panel */}
            <div className="relative w-full md:w-32 h-32 md:h-auto aspect-video md:aspect-square rounded-xl overflow-hidden border border-slate-800 shrink-0 bg-slate-900 flex items-center justify-center">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-[10px] text-slate-600">No Image</div>
              )}
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition duration-300 pointer-events-none" />
            </div>

            {/* 2. Dynamic Content Panel */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs">✨</span>
                    <h4 className="text-sm font-semibold text-slate-200 tracking-tight truncate">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium tracking-wide whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>

                {/* AI Human Diary Entry Response string output */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal antialiased">
                  "{item.diary_entry}"
                </p>
              </div>

              {/* Dynamic Tag Loop Footer */}
              <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-900/40">
                <div className="flex gap-1.5 overflow-x-auto">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-[9px] font-medium text-indigo-400 border border-indigo-500/10">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] text-slate-500 italic shrink-0">
                  Reflected via Memory Engine
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
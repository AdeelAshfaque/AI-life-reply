"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getTimeline, type TimelineItem } from "@/lib/api";

export default function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimeline()
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-sm font-semibold text-slate-50 mb-1">Today&apos;s Timeline</h2>
      <p className="text-sm text-slate-400 mb-4">
        A chronological view of your day.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">Loading timeline...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">No timeline entries yet.</p>
      ) : (
        <ol className="relative border-l border-slate-800 pl-6 space-y-6">
          {items.map((item, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Clock size={12} />
                {item.time}
              </div>
              <p className="text-sm font-medium text-slate-50">{item.title}</p>
              <p className="text-sm text-slate-400 mt-0.5">{item.note}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { BookOpen, Smile } from "lucide-react";
import { getDiary, type DiaryEntry } from "@/lib/api";

export default function DiaryCard() {
  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiary()
      .then(setDiary)
      .catch(() => setDiary(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-slate-50">AI Diary</h2>
        <BookOpen size={16} className="text-blue-500" />
      </div>
      <p className="text-sm text-slate-400 mb-4">
        A reflection generated from your memories.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">Writing your diary...</p>
      ) : !diary ? (
        <p className="text-sm text-slate-500">No diary entry available yet.</p>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{diary.date}</span>
            <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-400">
              <Smile size={12} />
              {diary.mood}
            </span>
          </div>
          <p className="text-sm text-slate-50 leading-relaxed">{diary.diary}</p>
        </div>
      )}
    </div>
  );
}
"use client";

import { Bell } from "lucide-react"; // Or whatever icon library you are using

export default function Header() {
  return (
    <header className="flex items-center justify-between py-2 border-b border-slate-900/50">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="text-xs text-slate-400">Here's a look at your memories today.</p>
      </div>

      {/* Right Side Actions (No Search Bar) */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-900/50">
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white shadow-lg shadow-indigo-500/20">
          A
        </div>
      </div>
    </header>
  );
}
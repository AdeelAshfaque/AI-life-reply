"use client";

import { LayoutDashboard, Search, BookOpen, Share2, Images, Settings } from "lucide-react";

type Section = "dashboard" | "search" | "diary" | "graph" | "gallery" | "settings";

type SidebarProps = {
  activeSection: Section;
  onNavigate: (section: Section) => void;
};

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, target: "dashboard" },
    { label: "Search", icon: Search, target: "search" },
    { label: "Diary", icon: BookOpen, target: "diary" },
    { label: "Graph", icon: Share2, target: "graph" },
    { label: "Gallery", icon: Images, target: "gallery" },
    { label: "Settings", icon: Settings, target: "settings" },
  ] as const;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">AI</span>
        </div>
        <span className="text-slate-50 font-semibold text-lg">Life Replay</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.target}
            onClick={() => {
              console.log("Clicked:", item.target);
              onNavigate(item.target);
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
              activeSection === item.target 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/50 scale-[1.02]" 
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-50"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}


"use client";
import { useEffect, useState } from "react";
import {
  Brain,
  Images,
  Users,
  MapPin,
} from "lucide-react";
import { getWeeklyInsights } from "@/lib/api";
type Insights = {
  total_memories: number;
  total_tags: number;
  total_people: number;
  total_locations: number;
};
export default function StatsCards() {
  const [stats, setStats] = useState<Insights | null>(null);
  useEffect(() => {
    getWeeklyInsights().then(setStats);
  }, []);
  const cards = [
    {
      title: "Memories Saved",
      value: stats?.total_memories ?? 0,
      icon: Images,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "AI Tags",
      value: stats?.total_tags ?? 0,
      icon: Brain,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "People Detected",
      value: stats?.total_people ?? 0,
      icon: Users,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      title: "Places Detected",
      value: stats?.total_locations ?? 0,
      icon: MapPin,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ title, value, icon: Icon, color, bg }) => (
        <div
          key={title}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <div
            className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center mb-3`}
          >
            <Icon size={20} className={color} />
          </div>
          <p className="text-3xl font-bold text-white">
            {value}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {title}
          </p>
        </div>
      ))}
    </div>
  );
}
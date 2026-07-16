"use client";

import { useEffect, useState } from "react";
import { Images } from "lucide-react";
import { getMemories, type MemoryItem } from "@/lib/api";
import MemoryCard from "@/components/MemoryCard";

export default function MemoryGrid() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    try {
      const data = await getMemories();
      setMemories(data.items || []);
    } catch (err) {
      console.error(err);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">Loading memories...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Memory Gallery
        </h2>

        <Images className="text-indigo-400" size={20} />
      </div>

      {memories.length === 0 ? (
        <p className="text-slate-500">
          No memories found.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <MemoryCard
            key={memory.id}
            memory={memory}
            onDelete={(id) =>
            setMemories((prev) => prev.filter((m) => m.id !== id))
            }
        />
          ))}
        </div>
      )}
    </div>
  );
}
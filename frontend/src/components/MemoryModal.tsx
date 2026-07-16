"use client";

import { X, Trash2, Calendar, MapPin } from "lucide-react";
import type { MemoryItem } from "@/lib/api";

interface Props {
  memory: MemoryItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function MemoryModal({
  memory,
  onClose,
  onDelete,
}: Props) {
  if (!memory) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-5xl w-full overflow-hidden">

        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">
            {memory.title}
          </h2>

          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>

        <div className="grid md:grid-cols-2">

          <img
            src={memory.image_url}
            alt={memory.title}
            className="w-full h-full object-cover"
          />

          <div className="p-6 flex flex-col">

            <p className="text-slate-300 leading-7">
              {memory.description}
            </p>

            <div className="mt-6 space-y-2">

              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={16} />
                {memory.date} • {memory.time}
              </div>

              {memory.location && (
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={16} />
                  {memory.location}
                </div>
              )}

            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {memory.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onDelete(memory.id)}
              className="mt-auto bg-red-600 hover:bg-red-700 transition rounded-lg py-3 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete Memory
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
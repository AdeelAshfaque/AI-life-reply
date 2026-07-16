"use client";

import { useState } from "react";
import { MapPin, Users as UsersIcon, X, Trash2 } from "lucide-react";
import { deleteMemory, type MemoryItem } from "@/lib/api";

interface Props {
  memory: MemoryItem;
  onDelete: (id: string) => void;
}

export default function MemoryCard({
  memory,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);


  async function handleDelete() {
  const ok = window.confirm("Delete this memory?");

  if (!ok) return;

  try {
await deleteMemory(memory.id);

setOpen(false);

onDelete(memory.id);
  } catch (err) {
    console.error(err);
    alert("Failed to delete memory.");
  }
}

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-indigo-500 transition-all"
      >
        <div className="aspect-video bg-slate-950 overflow-hidden">
          <img
            src={memory.image_url}
            alt={memory.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between">
            <h3 className="font-semibold text-white">
              {memory.title}
            </h3>

            <span className="text-xs text-slate-500">
              {memory.time}
            </span>
          </div>

          <p className="text-sm text-slate-400 line-clamp-2">
            {memory.description}
          </p>

          <div className="flex gap-3 text-xs text-slate-500">
            {memory.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {memory.location}
              </span>
            )}

            {memory.people.length > 0 && (
              <span className="flex items-center gap-1">
                <UsersIcon size={12} />
                {memory.people.join(", ")}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl max-w-5xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {memory.title}
              </h2>

              <button onClick={() => setOpen(false)}>
                <X className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <img
              src={memory.image_url}
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                {memory.description}
              </p>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                <Trash2 size={18} />
                Delete Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
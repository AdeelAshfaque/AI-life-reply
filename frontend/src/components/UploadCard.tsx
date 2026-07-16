"use client";

import { useRef, useState } from "react";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import { uploadMemory } from "@/lib/api";

export default function UploadCard({ onUploaded }: { onUploaded?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    setStatus("uploading");
    try {
      await uploadMemory(file);
      setStatus("success");
      onUploaded?.();
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-sm font-semibold text-slate-50 mb-1">Add a Memory</h2>
      <p className="text-sm text-slate-400 mb-4">
        Upload a photo to capture a new moment.
      </p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950 py-10 cursor-pointer hover:border-blue-500 transition-colors"
      >
        {status === "uploading" ? (
          <Loader2 size={22} className="text-blue-500 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 size={22} className="text-blue-500" />
        ) : (
          <Upload size={22} className="text-slate-500" />
        )}

        <p className="text-sm text-slate-400">
          {status === "uploading"
            ? `Uploading ${fileName}...`
            : status === "success"
            ? "Uploaded successfully"
            : status === "error"
            ? "Upload failed, try again"
            : "Click or drag a file to upload"}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelect}
        />
      </div>
    </div>
  );
}
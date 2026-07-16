"use client";

import React, { useState, MouseEvent } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`group relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-md transition-all duration-300 hover:border-slate-700/80 shadow-xl ${className}`}
    >
      {/* Dynamic Ambient Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition duration-500 ease-out layout-glow"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.12), transparent 50%)`,
        }}
      />
      
      {/* Subtle border highlight that tracks the mouse */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(250px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.08), transparent 80%)`,
        }}
      />

      {/* Card Content Wrapper */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
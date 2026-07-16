"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { forceCollide } from "d3-force";
import { Share2 } from "lucide-react";
import { getGraph, type GraphResponse } from "@/lib/api";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
);

interface GraphCardProps {
  /** Person/theme the graph is centered on */
  focus?: string;
  /**
   * Bump this number (e.g. from a parent's upload success callback) to make
   * the graph refetch and grow with newly added memories.
   */
  refreshTrigger?: number;
}

export default function GraphCard({ focus = "Ali", refreshTrigger = 0 }: GraphCardProps) {
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });

  // Refetch whenever focus changes or refreshTrigger increments (new memory added)
  useEffect(() => {
    setLoading(true);
    getGraph(focus)
      .then(setGraph)
      .catch(() => setGraph(null))
      .finally(() => setLoading(false));
  }, [focus, refreshTrigger]);

  // Keep the canvas responsive to its container
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width, height: Math.max(500, width * 0.5) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tune forces so the graph stays readable as more nodes are added
  useEffect(() => {
    if (!graph || !fgRef.current) return;

    const nodeCount = graph.nodes.length;
    // More nodes -> more repulsion & longer links so it doesn't clump
    const chargeStrength = -220 - nodeCount * 6;
    const linkDistance = 90 + nodeCount * 2;

    fgRef.current.d3Force("charge").strength(chargeStrength);
    fgRef.current.d3Force("link").distance(linkDistance);
    // Collision force stops nodes/labels from overlapping as the graph grows
    fgRef.current.d3Force(
      "collide",
      forceCollide((node: any) => (node.size ?? 12) + 18)
    );

    fgRef.current.d3ReheatSimulation();

    const t = setTimeout(() => {
      fgRef.current?.zoomToFit(600, 80);
    }, 300);

    return () => clearTimeout(t);
  }, [graph]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        Building graph...
      </div>
    );
  }

  if (!graph) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        No graph available.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white">Memory Graph</h2>
        <Share2 className="text-blue-500" size={18} />
      </div>

      <p className="text-slate-400 mb-6">
        Connections around {graph.focus} · {graph.nodes.length} nodes
      </p>

      <div ref={containerRef} className="rounded-xl border border-slate-800 overflow-hidden">
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={{
            nodes: graph.nodes,
            links: graph.edges,
          }}
          backgroundColor="#111827"
          nodeRelSize={6}
          cooldownTicks={200}
          enableNodeDrag
          enableZoomInteraction
          enablePanInteraction
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          linkColor={() => "#334155"}
          linkWidth={2}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}
          onNodeHover={(node) => {
            document.body.style.cursor = node ? "pointer" : "default";
          }}
          onNodeClick={(node: any) => {
            setSelectedNode(node);
          }}
          nodeCanvasObject={(node: any, ctx) => {
            const radius = node.size ?? 12;

            let color = "#8B5CF6";
            switch (node.type) {
              case "focus":
                color = "#2563EB";
                break;
              case "memory":
                color = "#8B5CF6";
                break;
              case "tag":
                color = "#10B981";
                break;
              case "person":
                color = "#F59E0B";
                break;
              case "place":
                color = "#EC4899";
                break;
              case "mood":
                color = "#64748B";
                break;
              default:
                color = "#64748B";
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            if (selectedNode?.id === node.id) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
              ctx.strokeStyle = "#FFFFFF";
              ctx.lineWidth = 3;
              ctx.stroke();
            }

            ctx.fillStyle = "#F8FAFC";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(node.label, node.x, node.y + radius + 16);
          }}
        />
      </div>

      {selectedNode && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-800 p-5">
          <h3 className="text-lg font-semibold text-white">{selectedNode.label}</h3>
          <p className="mt-2 text-slate-400">Type: {selectedNode.type}</p>
          <p className="text-slate-400">Size: {selectedNode.size}</p>
        </div>
      )}
    </div>
  );
}
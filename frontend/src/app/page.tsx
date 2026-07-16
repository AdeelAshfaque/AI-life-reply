"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import UploadCard from "@/components/UploadCard";
import SearchCard from "@/components/SearchCard";
import Timeline from "@/components/Timeline";
import DiaryCard from "@/components/DiaryCard";
import GraphCard from "@/components/GraphCard";
import MemoryGrid from "@/components/MemoryGrid";
import SpotlightCard from "@/components/SpotlightCard";
type Section = "dashboard" | "search" | "diary" | "graph" | "gallery" | "settings";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 120, damping: 18 } },
};

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => setRefreshKey((prev) => prev + 1);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          /* Enforced strict structural flex container to prevent overflowing vertical height */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden"
          >
            {/* Highly Condensed Welcome Banner */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-slate-900 p-5 shadow-xl shrink-0"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-1">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20 mb-1">
                  <span className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" />
                  AI Life Replay Active
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Your life is a searchable memory engine.
                </h2>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  Upload a photo, let AI describe it, turn it into a timeline entry, and ask natural-language questions over your history instantly.
                </p>
              </div>
            </motion.div>

            {/* Stats Cards Row - Shrinkable frame */}
            <motion.div variants={itemVariants} className="shrink-0">
              <SpotlightCard className="p-4">
                <StatsCards key={`stats-${refreshKey}`} />
              </SpotlightCard>
            </motion.div>
            
            {/* Grid Row - Grows smoothly to fill remaining height perfectly */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0 pb-2">
              {/* Upload Card */}
              <motion.div variants={itemVariants} className="md:col-span-1 h-full min-h-0">
                <SpotlightCard className="p-5 h-full flex flex-col justify-center bg-gradient-to-br from-slate-900/30 to-indigo-950/10">
                  <UploadCard onUploaded={handleUploadSuccess} />
                </SpotlightCard>
              </motion.div>

              {/* Action/Search Panel */}
              <motion.div variants={itemVariants} className="md:col-span-2 h-full min-h-0">
                <SpotlightCard className="p-5 h-full overflow-y-auto custom-scrollbar">
                  <SearchCard />
                </SpotlightCard>
              </motion.div>
            </div>
          </motion.div>
        );
      case "search":
        return <div className="max-w-4xl mx-auto h-full"><SpotlightCard className="p-6 h-full"><SearchCard /></SpotlightCard></div>;
      case "diary":
        return (
          <div className="grid lg:grid-cols-2 gap-4 h-full min-h-0">
            <SpotlightCard className="p-5 overflow-y-auto"><Timeline key={`timeline-${refreshKey}`} /></SpotlightCard>
            <SpotlightCard className="p-5 overflow-y-auto"><DiaryCard key={`diary-${refreshKey}`} /></SpotlightCard>
          </div>
        );
      case "graph":
        return <SpotlightCard className="p-5 w-full h-full"><GraphCard key={`graph-${refreshKey}`} /></SpotlightCard>;
      case "gallery":
        return <SpotlightCard className="p-5 w-full h-full overflow-y-auto"><MemoryGrid key={`memory-${refreshKey}`} /></SpotlightCard>;
      case "settings":
        return (
          <div className="py-12 text-center">
            <SpotlightCard className="mx-auto max-w-md p-8 bg-slate-800/20">
              <h2 className="text-2xl font-semibold mb-2 text-white">Settings</h2>
              <p className="text-xs text-slate-400">Advanced customization coming soon.</p>
            </SpotlightCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex h-screen w-screen bg-slate-950 relative overflow-hidden text-slate-50 select-none">
      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[35vw] h-[35vw] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main Content Area: Enforced Full Height Box with Flex Layout */}
      <div className="flex-1 h-full p-6 flex flex-col min-h-0 overflow-hidden relative z-10">
        <Header />

        <div className="flex-1 flex flex-col min-h-0 mt-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              className="flex-1 flex flex-col min-h-0"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
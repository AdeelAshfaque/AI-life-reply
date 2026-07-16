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
import SpotlightCard from "@/components/SpotlightCard"; // Import your new card wrapper

type Section = "dashboard" | "search" | "diary" | "graph" | "gallery" | "settings";

// Framer Motion variants for cascading/staggering entrance effects
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 110, damping: 15 } 
  },
} as const;

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => setRefreshKey((prev) => prev + 1);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          /* Bento Grid Container */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto"
          >
            {/* Stats Card: Spans 2 columns wide on desktop */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <SpotlightCard className="p-6">
                <StatsCards key={`stats-${refreshKey}`} />
              </SpotlightCard>
            </motion.div>

            {/* Upload Card: Spans 1 column wide, but taller (rows-span-2) to handle file drops */}
            <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2">
              <SpotlightCard className="p-8 h-full flex flex-col justify-center bg-gradient-to-br from-slate-900/30 to-indigo-950/10">
                <UploadCard onUploaded={handleUploadSuccess} />
              </SpotlightCard>
            </motion.div>

            {/* Search Card: Fills the remaining 2 columns beneath the stats */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <SpotlightCard className="p-6">
                <SearchCard />
              </SpotlightCard>
            </motion.div>
          </motion.div>
        );
      case "search":
        return (
          <div className="max-w-4xl mx-auto">
            <SpotlightCard className="p-8">
              <SearchCard />
            </SpotlightCard>
          </div>
        );
      case "diary":
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <SpotlightCard className="p-6"><Timeline key={`timeline-${refreshKey}`} /></SpotlightCard>
            <SpotlightCard className="p-6"><DiaryCard key={`diary-${refreshKey}`} /></SpotlightCard>
          </div>
        );
      case "graph":
        return <SpotlightCard className="p-6 w-full"><GraphCard key={`graph-${refreshKey}`} /></SpotlightCard>;
      case "gallery":
        return <SpotlightCard className="p-6 w-full"><MemoryGrid key={`memory-${refreshKey}`} /></SpotlightCard>;
      case "settings":
        return (
          <div className="py-24 text-center">
            <SpotlightCard className="mx-auto max-w-md p-12 bg-slate-800/20">
              <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                Settings
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Advanced customization & preferences coming soon.
              </p>
            </SpotlightCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-950 relative overflow-hidden text-slate-50">
      {/* Decorative Ambient Background Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse" />
        <div className="absolute top-[50%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-purple-500/10 blur-[130px] animate-pulse delay-1000" />
      </div>

      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <div className="flex-1 p-8 lg:p-10 overflow-y-auto relative z-10">
        <Header />

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHiring, PipelineStage } from "@/context/hiring-context";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  Sparkles,
  Users,
  Clock,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  ArrowUpRight,
  ExternalLink,
  Search,
  UserCheck,
  Zap,
  Activity,
  Info,
  HelpCircle,
  Check,
  Play,
  RefreshCw,
  FileText,
  ArrowRight,
  BookOpen,
  X
} from "lucide-react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

export default function Dashboard() {
  const router = useRouter();
  const { candidates, jobs, interviews, logs, addJob, userRole } = useHiring();
  
  const [mounted, setMounted] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  
  // Job Form state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Engineering");
  const [jobLoc, setJobLoc] = useState("");
  const [jobType, setJobType] = useState<"Full-time" | "Contract" | "Remote" | "Hybrid">("Full-time");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Interactive 3-Step Guide States
  const [activeStep, setActiveStep] = useState(1);
  
  // Step 1: Demo Job Configuration
  const [demoJobTitle, setDemoJobTitle] = useState("Frontend Developer");
  const [demoJobLoc, setDemoJobLoc] = useState("San Francisco, CA");
  const [demoJobType, setDemoJobType] = useState<"Full-time" | "Remote" | "Hybrid">("Remote");
  const [demoJobDept, setDemoJobDept] = useState("Engineering");

  // Step 2: AI Scanner Demo State
  const [scanState, setScanState] = useState<"idle" | "scanning" | "scanned">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("");
  
  // Step 3: Kanban Pipeline Demo State
  const [pipelineStage, setPipelineStage] = useState<"Applied" | "Screening" | "Interview" | "Hired">("Applied");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobLoc) return;
    addJob({
      title: jobTitle,
      department: jobDept,
      location: jobLoc,
      type: jobType,
      status: "Open"
    });
    setJobTitle("");
    setJobLoc("");
    setShowAddJobModal(false);
    // Show success confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Demo scan function
  const handleStartDemoScan = () => {
    if (scanState !== "idle") return;
    setScanState("scanning");
    setScanProgress(0);
    setScanMessage("Uploading doc resume...");

    const steps = [
      { progress: 25, msg: "Running OCR parsing algorithms..." },
      { progress: 50, msg: "Aligning candidate experience against jobs..." },
      { progress: 75, msg: "Assessing culture and soft-skill keywords..." },
      { progress: 100, msg: "Complete! Generating matching breakdown..." }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setScanProgress(steps[stepIdx].progress);
        setScanMessage(steps[stepIdx].msg);
        stepIdx++;
      } else {
        clearInterval(interval);
        setScanState("scanned");
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    }, 500);
  };

  const handleResetDemoScan = () => {
    setScanState("idle");
    setScanProgress(0);
    setScanMessage("");
  };

  // Advance Kanban Stage demo
  const handleAdvancePipeline = () => {
    if (pipelineStage === "Applied") {
      setPipelineStage("Screening");
    } else if (pipelineStage === "Screening") {
      setPipelineStage("Interview");
    } else if (pipelineStage === "Interview") {
      setPipelineStage("Hired");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"]
      });
    } else {
      setPipelineStage("Applied");
    }
  };

  // Trigger full page tour reset
  const handleRestartTour = () => {
    localStorage.removeItem("recruitflow_has_visited");
    window.location.reload();
  };

  // Compute stats
  const activeJobsCount = jobs.filter((j) => j.status === "Open").length;
  const totalCandidatesCount = candidates.length;
  
  const stageStats = candidates.reduce((acc, cand) => {
    acc[cand.status] = (acc[cand.status] || 0) + 1;
    return acc;
  }, {} as Record<PipelineStage, number>);

  const avgAiScore = Math.round(
    candidates.reduce((sum, c) => sum + c.aiMatch, 0) / candidates.length
  ) || 0;

  // Funnel Data
  const funnelData = [
    { name: "Applied", count: candidates.length },
    { name: "Screening", count: (candidates.length - stageStats["Rejected"] - (stageStats["Applied"] || 0)) },
    { name: "Interview", count: (stageStats["Interview"] || 0) + (stageStats["Technical Round"] || 0) + (stageStats["HR Round"] || 0) + (stageStats["Offer"] || 0) + (stageStats["Hired"] || 0) },
    { name: "Technical", count: (stageStats["Technical Round"] || 0) + (stageStats["HR Round"] || 0) + (stageStats["Offer"] || 0) + (stageStats["Hired"] || 0) },
    { name: "Offer", count: (stageStats["Offer"] || 0) + (stageStats["Hired"] || 0) },
    { name: "Hired", count: stageStats["Hired"] || 0 }
  ];

  // Monthly trends data
  const trendsData = [
    { month: "Jan", hires: 2, applications: 15 },
    { month: "Feb", hires: 4, applications: 24 },
    { month: "Mar", hires: 3, applications: 22 },
    { month: "Apr", hires: 6, applications: 35 },
    { month: "May", hires: 8, applications: 40 },
    { month: "Jun", hires: 7, applications: 38 },
    { month: "Jul", hires: 12, applications: 48 }
  ];

  // Filter candidates for search autocomplete
  const filteredCandidates = searchQuery
    ? candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Welcome Section */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-xl overflow-hidden border border-slate-800">
        {/* Modern glowing accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-semibold text-indigo-300">
              <Sparkles size={13} className="animate-pulse" />
              Recruitment Simplified
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              Welcome to RecruitFlow AI
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              We translate complex candidate analysis and pipelines into plain, simple actions. Scan resumes, auto-score matching skills, and schedule interviews with ease.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={handleRestartTour}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700 hover:bg-slate-700/80 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen size={14} className="text-slate-400" />
              Launch Setup Tour
            </button>

            <button
              onClick={() => router.push("/resume-ai")}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-accent hover:to-indigo-500 text-white shadow-lg shadow-indigo-950/40 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles size={14} />
              AI Scan Resume
            </button>
            
            {userRole !== "Viewer" && (
              <button
                onClick={() => setShowAddJobModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={14} />
                Post New Job
              </button>
            )}
          </div>
        </div>

        {/* Global Quick Search Component */}
        <div className="relative mt-6 max-w-md z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search candidates, roles, skills (e.g. React)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/40 border border-slate-850 hover:border-slate-700 focus:border-brand-primary/80 focus:ring-1 focus:ring-brand-primary rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showSearchResults && searchQuery && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowSearchResults(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-2 z-40 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden p-2 text-xs divide-y divide-slate-800"
                >
                  <div className="p-2 text-[10px] text-slate-405 font-bold tracking-wider uppercase">
                    Matching Profiles ({filteredCandidates.length})
                  </div>
                  {filteredCandidates.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      No candidates match &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    filteredCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => {
                          router.push(`/candidates?id=${cand.id}`);
                          setShowSearchResults(false);
                        }}
                        className="p-2 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-white text-[11px]">{cand.name}</div>
                          <div className="text-[10px] text-slate-400">{cand.role}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-850 text-slate-300 font-semibold border border-slate-800">
                            {cand.status}
                          </span>
                          <span className="text-[10px] text-brand-primary font-bold">
                            AI Score: {cand.aiMatch}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Guide: RecruitFlow in 3 Steps */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-white/70 to-slate-50/70 dark:from-slate-900/60 dark:to-slate-950/60 border border-slate-200/50 dark:border-slate-850/50 shadow-sm backdrop-blur-xl relative rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-850 pb-4">
          <div className="space-y-0.5">
            <h2 className="text-md md:text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <Zap size={18} className="text-brand-accent animate-pulse" />
              RecruitFlow AI Interactive Guide
            </h2>
            <p className="text-xs text-muted">
              Learn how to hire a candidate in 3 simple steps. Interact with the sandbox below!
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-slate-850 rounded-lg">
              Interactive Sandbox
            </span>
          </div>
        </div>

        {/* Layout Grid: Left Steppers, Right Interactive Sandbox Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Stepper Buttons (Columns 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-3.5">
              {/* Step 1 Button */}
              <button
                onClick={() => setActiveStep(1)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer hover:scale-[1.01] ${
                  activeStep === 1
                    ? "border-brand-primary/40 bg-brand-primary/5 dark:bg-brand-primary/10 shadow-xs"
                    : "border-slate-200 dark:border-slate-850 bg-white/30 dark:bg-slate-900/20 hover:border-slate-350 dark:hover:border-slate-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  activeStep === 1
                    ? "bg-brand-primary text-white shadow-sm ring-4 ring-brand-primary/10"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}>
                  01
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100 block">
                    Post a Job Opening
                  </span>
                  <span className="text-[11px] text-muted block leading-normal">
                    Describe your opening (role, setting, location) to construct a matching funnel benchmark.
                  </span>
                </div>
              </button>

              {/* Step 2 Button */}
              <button
                onClick={() => setActiveStep(2)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer hover:scale-[1.01] ${
                  activeStep === 2
                    ? "border-brand-accent/40 bg-brand-accent/5 dark:bg-brand-accent/10 shadow-xs"
                    : "border-slate-200 dark:border-slate-850 bg-white/30 dark:bg-slate-900/20 hover:border-slate-350 dark:hover:border-slate-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  activeStep === 2
                    ? "bg-brand-accent text-white shadow-sm ring-4 ring-brand-accent/10"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}>
                  02
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100 block">
                    Upload & AI-Scan Resumes
                  </span>
                  <span className="text-[11px] text-muted block leading-normal">
                    Let AI extract core skills, score candidate match rate, and write expert panel questions.
                  </span>
                </div>
              </button>

              {/* Step 3 Button */}
              <button
                onClick={() => setActiveStep(3)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer hover:scale-[1.01] ${
                  activeStep === 3
                    ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-xs"
                    : "border-slate-200 dark:border-slate-850 bg-white/30 dark:bg-slate-900/20 hover:border-slate-350 dark:hover:border-slate-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  activeStep === 3
                    ? "bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-500/10"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}>
                  03
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100 block">
                    Manage Pipeline Stages
                  </span>
                  <span className="text-[11px] text-muted block leading-normal">
                    Drag and drop candidates across stages, evaluate interview notes, and make job offers.
                  </span>
                </div>
              </button>
            </div>
            
            <div className="text-[10px] text-slate-450 dark:text-slate-500 bg-slate-100/55 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-850/40 leading-normal flex items-start gap-2">
              <Info size={14} className="text-brand-primary shrink-0 mt-0.5" />
              <span>
                <strong>Quick Tip:</strong> Click any step above to explore how the tool runs. Real buttons in the simulator link to the actual live pages to help you work faster!
              </span>
            </div>
          </div>

          {/* Sandbox Interactive Area (Columns 6-12) */}
          <div className="lg:col-span-7 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl p-6 flex flex-col justify-between min-h-[320px]">
            <AnimatePresence mode="wait">
              {/* STEP 1 SANDBOX */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200">
                        Interactive Job Card Builder
                      </span>
                      <Badge variant="primary">Step 1 Live Preview</Badge>
                    </div>

                    {/* Interactive Controls */}
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-550 dark:text-slate-400">Position Name</label>
                        <select
                          value={demoJobTitle}
                          onChange={(e) => setDemoJobTitle(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="Frontend Developer">Frontend Developer</option>
                          <option value="AI Research Lead">AI Research Lead</option>
                          <option value="Backend Architect">Backend Architect</option>
                          <option value="Product Designer">Product Designer</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-550 dark:text-slate-400">Workplace Setting</label>
                        <div className="flex gap-1.5">
                          {["Remote", "Hybrid", "Full-time"].map((setting) => (
                            <button
                              key={setting}
                              onClick={() => setDemoJobType(setting as any)}
                              className={`flex-1 p-1.5 rounded-md border text-center font-semibold transition-colors cursor-pointer text-[9px] ${
                                demoJobType === setting
                                  ? "bg-brand-primary text-white border-brand-primary"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 hover:bg-slate-50"
                              }`}
                            >
                              {setting}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Preview Job Card Rendering */}
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-xs font-extrabold text-slate-850 dark:text-white">
                            {demoJobTitle}
                          </h4>
                          <p className="text-[10px] text-slate-450">{demoJobDept} Dept • {demoJobLoc}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 font-bold rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/15">
                          {demoJobType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-450 border-t border-slate-100 dark:border-slate-850 pt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Users size={11} className="text-slate-400" />
                          0 applicants screen ready
                        </span>
                        <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                          <Check size={11} /> Open
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-850/50">
                    <span className="text-[10px] text-muted">Ready to make it official?</span>
                    <Button
                      size="sm"
                      onClick={() => setShowAddJobModal(true)}
                      className="text-xs shadow-xs"
                    >
                      <Plus size={12} />
                      Create Live Job Position
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 SANDBOX */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-205">
                        AI Resume Processing Simulator
                      </span>
                      <Badge variant="accent">Step 2 Live Preview</Badge>
                    </div>

                    {scanState === "idle" && (
                      <div
                        onClick={handleStartDemoScan}
                        className="border-2 border-dashed border-slate-350 dark:border-slate-800 hover:border-brand-accent/50 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all space-y-2 group"
                      >
                        <FileText className="mx-auto text-slate-400 group-hover:text-brand-accent transition-colors" size={32} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Click to scan a sample resume doc
                        </span>
                        <span className="text-[10px] text-slate-450 block">
                          Runs a mock scanning process showing how candidates are auto-scored.
                        </span>
                      </div>
                    )}

                    {scanState === "scanning" && (
                      <div className="space-y-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-center">
                        <div className="w-8 h-8 rounded-full bg-brand-accent/15 border border-brand-accent/25 text-brand-accent flex items-center justify-center mx-auto animate-spin">
                          <RefreshCw size={14} />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-850 dark:text-slate-100 block">
                            {scanMessage}
                          </span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="bg-brand-accent h-full"
                              initial={{ width: "0%" }}
                              animate={{ width: `${scanProgress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {scanState === "scanned" && (
                      <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-105 dark:border-slate-850 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-[9px] flex items-center justify-center">
                              AS
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-850 dark:text-white leading-none">
                                Aravind Sharma
                              </h4>
                              <span className="text-[9px] text-slate-450">Backend Architect</span>
                            </div>
                          </div>
                          <span className="text-[11px] font-extrabold text-emerald-500 flex items-center gap-0.5">
                            <Sparkles size={11} /> 94% AI Match
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-650 dark:text-slate-350">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white block mb-0.5">Strengths:</span>
                            <ul className="list-disc list-inside space-y-0.5 pl-0.5 text-[9px]">
                              <li>PostgreSQL scaling</li>
                              <li>Kafka message streaming</li>
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white block mb-0.5">Core Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              <span className="px-1 py-0.2 bg-slate-105 dark:bg-slate-800 rounded-md border border-slate-200/50 dark:border-slate-800 text-[8px] font-semibold text-slate-600 dark:text-slate-400">Go</span>
                              <span className="px-1 py-0.2 bg-slate-105 dark:bg-slate-800 rounded-md border border-slate-200/50 dark:border-slate-800 text-[8px] font-semibold text-slate-600 dark:text-slate-400">Docker</span>
                              <span className="px-1 py-0.2 bg-slate-105 dark:bg-slate-800 rounded-md border border-slate-200/50 dark:border-slate-800 text-[8px] font-semibold text-slate-600 dark:text-slate-400">gRPC</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleResetDemoScan}
                            className="text-[9px] font-bold text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex items-center gap-0.5"
                          >
                            <RefreshCw size={10} /> Scan Another
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-850/50">
                    <span className="text-[10px] text-muted">Ready to test with your own PDF resumes?</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push("/resume-ai")}
                      className="text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-brand-accent font-bold"
                    >
                      Go to AI Resume Scan
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 SANDBOX */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-205">
                        Interactive Kanban Simulator
                      </span>
                      <Badge variant="success">Step 3 Live Preview</Badge>
                    </div>

                    {/* Miniature Kanban Columns */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      <div className={`p-1.5 rounded-lg border ${pipelineStage === "Applied" ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary" : "bg-white/20 dark:bg-slate-900/10 border-transparent"}`}>
                        Applied
                      </div>
                      <div className={`p-1.5 rounded-lg border ${pipelineStage === "Screening" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/20 dark:bg-slate-900/10 border-transparent"}`}>
                        Screening
                      </div>
                      <div className={`p-1.5 rounded-lg border ${pipelineStage === "Interview" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-500" : "bg-white/20 dark:bg-slate-900/10 border-transparent"}`}>
                        Interview
                      </div>
                      <div className={`p-1.5 rounded-lg border ${pipelineStage === "Hired" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 animate-pulse" : "bg-white/20 dark:bg-slate-900/10 border-transparent"}`}>
                        Hired 🎉
                      </div>
                    </div>

                    {/* Candidate drag simulation area */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center min-h-[100px] relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={pipelineStage}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shadow-2xs flex items-center gap-3 z-10"
                        >
                          <div className="w-7 h-7 rounded-full bg-brand-primary text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            JD
                          </div>
                          <div>
                            <h5 className="text-[11px] font-bold text-slate-850 dark:text-white">Jane Doe</h5>
                            <span className="text-[9px] text-slate-450 block">Senior React Engineer</span>
                          </div>
                          <Badge variant={pipelineStage === "Hired" ? "success" : "neutral"} className="text-[8px] py-0 px-1.5 font-bold uppercase shrink-0">
                            {pipelineStage}
                          </Badge>
                        </motion.div>
                      </AnimatePresence>
                      
                      {pipelineStage === "Hired" && (
                        <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl pointer-events-none flex items-center justify-center z-0">
                          <div className="text-[10px] font-bold text-emerald-500 dark:text-emerald-450">Candidate is Hired!</div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleAdvancePipeline}
                        className="px-3 py-1.5 rounded-lg bg-slate-250 dark:bg-slate-800 text-[10px] font-bold hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <Play size={10} />
                        {pipelineStage === "Hired" ? "Reset Candidate" : "Advance Candidate ➔"}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-850/50">
                    <span className="text-[10px] text-muted">Ready to manage real candidates?</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push("/pipeline")}
                      className="text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-brand-primary font-bold"
                    >
                      Go to Kanban Board
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Time to hire */}
        <Card hoverable className="group p-5 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs transition-all hover:scale-[1.01]">
          {/* Subtle colored glow background */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-all pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-450 dark:text-slate-400 flex items-center gap-1">
                Avg. Time to Hire
                <div className="group/tip relative cursor-help">
                  <HelpCircle size={11} className="text-slate-400" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tip:block bg-slate-950 text-white text-[9px] px-2 py-1 rounded-md w-32 leading-normal font-medium shadow-xl border border-slate-800 z-50">
                    Average number of days to complete a hire from job posting.
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-850 dark:text-white">
                  18.5d
                </span>
                <span className="text-[10px] text-brand-success font-semibold flex items-center bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.2 rounded-md">
                  <TrendingDown size={9} /> -4.2d
                </span>
              </div>
              <p className="text-[9px] text-slate-450 font-medium">vs 22.7d last quarter average</p>
            </div>
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-2xl group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
        </Card>

        {/* Metric 2: Offer acceptance */}
        <Card hoverable className="group p-5 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs transition-all hover:scale-[1.01]">
          {/* Subtle colored glow background */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-450 dark:text-slate-400 flex items-center gap-1">
                Offer Accept Rate
                <div className="group/tip relative cursor-help">
                  <HelpCircle size={11} className="text-slate-400" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tip:block bg-slate-950 text-white text-[9px] px-2 py-1 rounded-md w-32 leading-normal font-medium shadow-xl border border-slate-800 z-50">
                    Percent of candidates who accept their final job offers.
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-850 dark:text-white">
                  92.4%
                </span>
                <span className="text-[10px] text-brand-success font-semibold flex items-center bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.2 rounded-md">
                  <TrendingUp size={9} /> +1.8%
                </span>
              </div>
              <p className="text-[9px] text-slate-450 font-medium">Target threshold: 85.0% minimum</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 text-brand-success rounded-2xl group-hover:scale-105 transition-transform">
              <UserCheck size={18} />
            </div>
          </div>
        </Card>

        {/* Metric 3: AI Match Average */}
        <Card hoverable className="group p-5 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs transition-all hover:scale-[1.01]">
          {/* Subtle colored glow background */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-450 dark:text-slate-400 flex items-center gap-1">
                Avg. AI Match Score
                <div className="group/tip relative cursor-help">
                  <HelpCircle size={11} className="text-slate-400" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tip:block bg-slate-950 text-white text-[9px] px-2 py-1 rounded-md w-32 leading-normal font-medium shadow-xl border border-slate-800 z-50">
                    Average AI matching score calculated across all uploaded candidate resumes.
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-850 dark:text-white">
                  {avgAiScore}%
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 dark:bg-indigo-500/20 px-1.5 py-0.2 rounded-md">
                  Active Calibration
                </span>
              </div>
              <p className="text-[9px] text-slate-450 font-medium">Scanned profiles: {totalCandidatesCount}</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 text-brand-accent rounded-2xl group-hover:scale-105 transition-transform">
              <Sparkles size={18} />
            </div>
          </div>
        </Card>

        {/* Metric 4: Active jobs */}
        <Card hoverable className="group p-5 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs transition-all hover:scale-[1.01]">
          {/* Subtle colored glow background */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-450 dark:text-slate-400 flex items-center gap-1">
                Active Job Postings
                <div className="group/tip relative cursor-help">
                  <HelpCircle size={11} className="text-slate-400" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tip:block bg-slate-950 text-white text-[9px] px-2 py-1 rounded-md w-32 leading-normal font-medium shadow-xl border border-slate-800 z-50">
                    Open roles currently active and accepting applications.
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-850 dark:text-white">
                  {activeJobsCount}
                </span>
                <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/10 dark:bg-amber-500/20 px-1.5 py-0.2 rounded-md">
                  {jobs.filter((j) => j.status === "Draft").length} drafts
                </span>
              </div>
              <p className="text-[9px] text-slate-450 font-medium">Across 5 company departments</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-brand-warning rounded-2xl group-hover:scale-105 transition-transform">
              <Briefcase size={18} />
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Chart Card */}
        <Card className="lg:col-span-2 space-y-6 flex flex-col min-h-[380px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Recruitment Funnel Conversion Rates
              </h2>
              <p className="text-[10px] text-muted">
                Visualizing stages of candidates proceeding down the pipeline
              </p>
            </div>
            <Badge variant="primary">Real-Time Funnel</Badge>
          </div>

          <div className="flex-1 min-h-[220px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={funnelData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="funnelColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b6cff" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#5b6cff" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "var(--color-foreground)"
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#5b6cff" strokeWidth={2.5} fillOpacity={1} fill="url(#funnelColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg animate-pulse" />
            )}
          </div>
          
          {/* Explanation Banner */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-855/50 rounded-xl flex gap-2 text-[10px] text-slate-500 leading-relaxed font-medium">
            <span className="text-[12px] shrink-0 mt-0.5">💡</span>
            <span>
              <strong>What does this funnel show?</strong> Out of all candidates who <strong>Applied</strong>, this displays the counts transitioning to <strong>Screening</strong>, <strong>Interviews</strong>, and <strong>Hired</strong>. The slopes help you identify if screening criteria are too loose or if interview panels are rejecting too many candidates.
            </span>
          </div>
        </Card>

        {/* Monthly Hiring Trend Card */}
        <Card className="space-y-6 flex flex-col min-h-[380px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Monthly Sourcing Metrics
            </h2>
            <p className="text-[10px] text-muted">
              Sourced applications and successful hires per month
            </p>
          </div>

          <div className="flex-1 min-h-[220px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendsData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "var(--color-foreground)"
                    }}
                  />
                  <Bar dataKey="applications" fill="#CBD5E1" radius={[4, 4, 0, 0]} className="dark:fill-slate-850" name="Sourced" />
                  <Bar dataKey="hires" fill="#5b6cff" radius={[4, 4, 0, 0]} name="Hires" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg animate-pulse" />
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-855/50 rounded-xl flex gap-2 text-[10px] text-slate-500 leading-relaxed font-medium">
            <span className="text-[12px] shrink-0 mt-0.5">📈</span>
            <span>
              <strong>What does this bar chart show?</strong> This tracks your volume: comparing total candidates sourced (grey bars) against actual final hires (blue bars) month-over-month. Helps plan hiring capacity spikes.
            </span>
          </div>
        </Card>
      </div>

      {/* Activity Log, Upcoming Interviews & Quick Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Interviews Card */}
        <Card className="space-y-4 flex flex-col max-h-[360px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Today&apos;s Panel Interviews
              </h2>
              <p className="text-[10px] text-muted">Scheduled meetings synced with Google Calendar</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {interviews.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted">
                No interviews scheduled for today.
              </div>
            ) : (
              interviews.slice(0, 4).map((i) => (
                <div
                  key={i.id}
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-border rounded-xl flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {i.candidateName}
                      </h3>
                      <p className="text-[10px] text-muted">{i.role}</p>
                    </div>
                    <Badge variant="primary">{i.type}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">{i.time}</span>
                    <a
                      href={i.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-0.5 text-brand-primary font-semibold hover:underline"
                    >
                      Join Meeting
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Activity Feed Log */}
        <Card className="space-y-4 flex flex-col max-h-[360px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Activity size={15} className="text-brand-accent animate-pulse" />
                Live Activity Log
              </h2>
              <p className="text-[10px] text-muted">Real-time actions audit feed</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-card z-10 shrink-0" />
                  <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-850 absolute top-2 z-0" />
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{log.user}</span>{" "}
                    {log.action}{" "}
                    <span className="font-semibold text-brand-primary">{log.target}</span>
                  </p>
                  <span className="text-[9px] text-slate-455 block mt-0.5">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Action Tasks Board */}
        <Card className="space-y-4 flex flex-col max-h-[360px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Quick Action Panel
            </h2>
            <p className="text-[10px] text-muted">Rapid shortcuts to candidate management tasks</p>
          </div>

          <div className="flex-1 flex flex-col justify-around gap-2 pb-2">
            <button
              onClick={() => router.push("/candidates")}
              className="p-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-brand-primary/5 border border-border hover:border-brand-primary/30 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Review Candidates Table
                </span>
                <span className="text-[10px] text-muted">
                  Check scores, skills, and sort active roles.
                </span>
              </div>
              <ArrowUpRight size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => router.push("/pipeline")}
              className="p-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-brand-primary/5 border border-border hover:border-brand-primary/30 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Interactive Kanban Board
                </span>
                <span className="text-[10px] text-muted">
                  Drag and drop applicants to adjust statuses.
                </span>
              </div>
              <ArrowUpRight size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => router.push("/settings")}
              className="p-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-brand-primary/5 border border-border hover:border-brand-primary/30 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Calibrate Access Roles
                </span>
                <span className="text-[10px] text-muted">
                  Adjust custom interviewer evaluation templates.
                </span>
              </div>
              <ArrowUpRight size={14} className="text-slate-400" />
            </button>
          </div>
        </Card>
      </div>

      {/* Create Job Opening Modal Dialog */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Post New Job Position
              </h2>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
              >
                X
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-350">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-850 dark:text-slate-100 text-xs"
                  placeholder="e.g. Senior Frontend Architect"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Department
                  </label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-700 dark:text-slate-200 text-xs"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI & Research">AI & Research</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Job Location
                  </label>
                  <input
                    type="text"
                    required
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-855 dark:text-slate-100 text-xs"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-350">
                  Workplace Setting
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Full-time", "Contract", "Remote", "Hybrid"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setJobType(type as any)}
                      className={`py-2 text-[10px] font-semibold rounded-lg border text-center cursor-pointer transition-colors ${
                        jobType === type
                          ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                          : "border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="text-xs">
                  Create Position
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

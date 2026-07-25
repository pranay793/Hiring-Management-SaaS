"use client";

import React, { useState } from "react";
import { useHiring, Candidate, PipelineStage } from "@/context/hiring-context";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Zap,
  ThumbsUp,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building,
  X
} from "lucide-react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface ScannedProfile {
  name: string;
  role: string;
  experience: number;
  resumeScore: number;
  aiMatch: number;
  skills: string[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  cultureFit: string;
  risks: string[];
  recommendation: "Strong Hire" | "Hire" | "No Hire";
  interviewQuestions: string[];
  email: string;
}

const mockProfiles: ScannedProfile[] = [
  {
    name: "Aravind Sharma",
    role: "Backend Architect",
    experience: 7,
    resumeScore: 92,
    aiMatch: 94,
    email: "aravind.sharma@example.net",
    skills: ["Go", "Kubernetes", "PostgreSQL", "Kafka", "gRPC", "Docker", "Redis"],
    summary: "Senior backend developer with strong distributed systems focus. Handled data pipeline architecture processing 50k requests per minute. Excellent design pattern literacy.",
    strengths: [
      "Expert PostgreSQL concurrency tuning",
      "Hands-on message broker scaling experience (Kafka)",
      "Strong coding cleanliness"
    ],
    weaknesses: [
      "Limited direct frontend development experience",
      "Prefers CLI-centric task execution"
    ],
    cultureFit: "Autonomous, high performance expectation. Works best in highly technical pods.",
    risks: ["Has competing offers, requires rapid turnaround schedule."],
    recommendation: "Strong Hire",
    interviewQuestions: [
      "How do you design high-throughput consumers in Go to prevent message duplication in Kafka?",
      "Explain the indexing layout optimizations you use for high-write tables."
    ]
  },
  {
    name: "Claire Sinclair",
    role: "Lead Product Designer",
    experience: 6,
    resumeScore: 89,
    aiMatch: 92,
    email: "claire.design@example.org",
    skills: ["Figma", "Design Systems", "Framer", "Prototyping", "Tailwind CSS", "HTML/CSS"],
    summary: "UX designer who codes. Experienced in creating design system packages and responsive SaaS layout dashboards from scratch.",
    strengths: [
      "Flawless visual alignment and typography grids",
      "Figma token configuration expert",
      "High front-end styling language literacy"
    ],
    weaknesses: [
      "Limited experience conducting global translation user research",
      "Mainly worked on B2B setups rather than consumer mobile apps"
    ],
    cultureFit: "Collaborative, values critique sessions, passionate about visual design standards.",
    risks: ["None flagged"],
    recommendation: "Hire",
    interviewQuestions: [
      "How do you establish standard scaling rules for font hierarchies across break-points?",
      "Describe your handoff process when working with React engineering pods."
    ]
  },
  {
    name: "Devon Harris",
    role: "AI Research Scientist",
    experience: 4,
    resumeScore: 95,
    aiMatch: 96,
    email: "devon.harris@ai-labs.com",
    skills: ["Python", "PyTorch", "Transformers", "LLMs", "LangChain", "VectorDBs", "CUDA"],
    summary: "Research engineer focused on custom fine-tuning and retrieval-augmented generation architectures. Designed agent pipelines for financial documentation scanning.",
    strengths: [
      "Expert knowledge of attention layers and training pipelines",
      "Familiar with embedding vector cluster optimization",
      "Fast math researcher"
    ],
    weaknesses: [
      "Mainly research oriented, needs direction on enterprise production deployments",
      "Lacks TypeScript/React experience"
    ],
    cultureFit: "Highly curious, experimental developer, enjoys solving open-ended scaling tasks.",
    risks: ["Prefers working on bleeding-edge research, might find static maintenance sprints boring."],
    recommendation: "Strong Hire",
    interviewQuestions: [
      "How do you mitigate context bias when scaling vector databases for multi-tenant setups?",
      "Explain the tradeoffs between LoRA and full parameter training."
    ]
  }
];

export default function ResumeAi() {
  const { addCandidate, jobs, userRole } = useHiring();
  
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState("");
  
  const [scannedFile, setScannedFile] = useState<string | null>(null);
  const [profileResult, setProfileResult] = useState<ScannedProfile | null>(null);
  const [imported, setImported] = useState(false);

  const loaderSteps = [
    { progress: 15, msg: "Uploading resume document..." },
    { progress: 35, msg: "Running NLP text extraction..." },
    { progress: 55, msg: "Aligning skills with active positions..." },
    { progress: 75, msg: "Evaluating cultural and structural fit..." },
    { progress: 95, msg: "Compiling interview panel prompts..." }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateProcessing = () => {
    setUploading(true);
    setUploadProgress(0);
    setProfileResult(null);
    setImported(false);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loaderSteps.length) {
        setUploadProgress(loaderSteps[currentStep].progress);
        setLoaderMessage(loaderSteps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setUploadProgress(100);
        // Choose a random profile to mock parse
        const randomProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)];
        setProfileResult(randomProfile);
        setUploading(false);
      }
    }, 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setScannedFile(e.dataTransfer.files[0].name);
      simulateProcessing();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScannedFile(e.target.files[0].name);
      simulateProcessing();
    }
  };

  const handleImportProfile = () => {
    if (!profileResult || userRole === "Viewer") return;

    addCandidate({
      name: profileResult.name,
      avatar: profileResult.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      role: profileResult.role,
      experience: profileResult.experience,
      resumeScore: profileResult.resumeScore,
      aiMatch: profileResult.aiMatch,
      status: "Applied",
      recruiter: "Sarah Jenkins",
      interviewDate: null,
      email: profileResult.email,
      phone: "+1 (555) 018-8833",
      skills: profileResult.skills,
      summary: profileResult.summary,
      strengths: profileResult.strengths,
      weaknesses: profileResult.weaknesses,
      cultureFit: profileResult.cultureFit,
      risks: profileResult.risks,
      recommendation: profileResult.recommendation,
      interviewQuestions: profileResult.interviewQuestions
    });

    setImported(true);

    // Boom! Confetti
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#4251CC", "#5B6CFF", "#16A34A"]
    });
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          AI Resume Scanner
        </h1>
        <p className="text-xs text-muted">
          Upload resume documents to instantly extract core skills, assess cultural alignment, highlight risk elements, and compile candidate scorecard profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Upload Zone */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
              Resume Document Dropzone
            </h2>

            {/* Dropzone frame */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
                dragActive
                  ? "border-brand-primary bg-brand-primary/5 scale-98"
                  : "border-border hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                multiple={false}
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />

              <UploadCloud size={36} className="text-slate-400 mb-3 animate-pulse" />
              <p className="font-semibold text-slate-750 dark:text-slate-250 mb-1 text-xs">
                Drag and drop PDF, DOCX here
              </p>
              <p className="text-[10px] text-muted mb-4">or select a file manually</p>

              <label
                htmlFor="file-upload"
                className="px-3.5 py-1.5 bg-card border border-border text-slate-750 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer text-xs"
              >
                Browse Files
              </label>
            </div>
          </Card>

          {/* Loader bar state */}
          {uploading && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin text-brand-primary" />
                  {loaderMessage}
                </span>
                <span className="font-bold text-brand-primary tabular-nums">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </Card>
          )}

          {/* Selected File Card */}
          {scannedFile && !uploading && (
            <Card className="p-3.5 flex items-center justify-between gap-3 border-brand-primary/20 bg-brand-primary/2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg shrink-0">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-850 dark:text-slate-200 block truncate text-xs">
                    {scannedFile}
                  </span>
                  <span className="text-[9px] text-brand-success font-semibold">
                    Document parsed successfully
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setScannedFile(null);
                  setProfileResult(null);
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded cursor-pointer"
              >
                <X size={14} />
              </button>
            </Card>
          )}
        </div>

        {/* Right Side: Results Profile report */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!profileResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[300px]"
              >
                <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed border-2">
                  <Sparkles size={28} className="text-slate-400 mb-3 animate-pulse" />
                  <h3 className="font-bold text-slate-750 dark:text-slate-250 mb-1 text-xs">
                    Ready for AI Document Scan
                  </h3>
                  <p className="text-[10px] text-muted max-w-xs leading-relaxed">
                    Upload or drag a resume file in the left panel to trigger our matching parser model.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="space-y-4"
              >
                <Card className="p-6 space-y-5">
                  {/* Analysis Title row */}
                  <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-bold flex items-center justify-center text-sm">
                        {profileResult.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                          {profileResult.name}
                        </h2>
                        <span className="text-[10px] text-muted mt-0.5 block">{profileResult.role}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted block mb-0.5">Fit Score</span>
                      <Badge variant="success" className="tabular-nums font-bold">
                        {profileResult.aiMatch}% Match
                      </Badge>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                      <Sparkles size={14} className="text-brand-accent animate-pulse" />
                      Executive AI Summary
                    </h3>
                    <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10">
                      {profileResult.summary}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-850 dark:text-slate-200 block text-xs">
                      Extracted Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profileResult.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-650 dark:text-slate-350 border border-border rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs flex items-center gap-1 text-brand-success">
                        <ThumbsUp size={12} />
                        Key Strengths
                      </h4>
                      <ul className="space-y-1 text-[10px] text-slate-500">
                        {profileResult.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-brand-success">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs flex items-center gap-1 text-brand-danger">
                        <AlertTriangle size={12} />
                        Improvement Areas
                      </h4>
                      <ul className="space-y-1 text-[10px] text-slate-500">
                        {profileResult.weaknesses.map((weak, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-brand-danger">!</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Generated Panel Questions */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs flex items-center gap-1 text-brand-accent">
                      <Zap size={13} />
                      AI Suggested Interview Questions
                    </h4>
                    <div className="space-y-2">
                      {profileResult.interviewQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-[11px] leading-relaxed text-slate-750 dark:text-slate-400"
                        >
                          <span className="font-bold text-brand-accent mr-1">Q{idx + 1}:</span>
                          {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks Alert */}
                  {profileResult.risks.length > 0 && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
                      <AlertTriangle size={16} className="text-brand-warning shrink-0 mt-0.5" />
                      <div className="text-[10px] text-slate-750 dark:text-amber-400 leading-normal">
                        <span className="font-semibold block mb-0.5">AI Flagged Risk Factors:</span>
                        {profileResult.risks.join(", ")}
                      </div>
                    </div>
                  )}

                  {/* Submit import row */}
                  <div className="pt-4 border-t border-border flex justify-end items-center gap-3">
                    <span className="text-[10px] text-slate-400">
                      Importing places candidate card directly into the pipeline
                    </span>
                    
                    {imported ? (
                      <Badge variant="success" className="px-3 py-1.5 flex items-center gap-1 text-xs">
                        <CheckCircle size={12} />
                        Profile Imported
                      </Badge>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleImportProfile}
                        disabled={userRole === "Viewer"}
                        className="text-xs"
                      >
                        <Plus size={14} />
                        Import to Pipeline
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

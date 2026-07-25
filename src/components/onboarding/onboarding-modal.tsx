"use client";

import React, { useState } from "react";
import { useHiring } from "@/context/hiring-context";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Building,
  Users,
  ChevronRight,
  ChevronLeft,
  Sliders,
  CheckCircle,
  HelpCircle,
  X
} from "lucide-react";

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const { currentOrg, updateOrgName } = useHiring();
  
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState(currentOrg);
  const [orgSize, setOrgSize] = useState("10-50");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [invitedRole, setInvitedRole] = useState("Recruiter");
  const [aiStrictness, setAiStrictness] = useState("medium");
  const [enableScreening, setEnableScreening] = useState(true);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Completed Onboarding! Run Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4251CC", "#5B6CFF", "#16A34A", "#F59E0B"]
      });
      updateOrgName(orgName);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const stepsInfo = [
    { number: 1, title: "Company Profile", icon: Building },
    { number: 2, title: "Hiring Team", icon: Users },
    { number: 3, title: "AI Calibration", icon: Sliders },
    { number: 4, title: "Ready", icon: CheckCircle }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col min-h-[480px] max-h-[90vh]"
      >
        {/* Onboarding Header */}
        <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-primary">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase text-slate-800 dark:text-slate-200">
              Onboarding Setup
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Skip Onboarding"
          >
            <X size={16} />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        <div className="px-8 py-4 border-b border-border bg-slate-50/20 dark:bg-slate-950/20">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {stepsInfo.map((s) => {
              const StepIcon = s.icon;
              const isCompleted = step > s.number;
              const isActive = step === s.number;

              return (
                <div key={s.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted
                        ? "bg-brand-success text-white"
                        : isActive
                        ? "bg-brand-primary text-white scale-110 shadow-md ring-4 ring-brand-primary/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={14} /> : s.number}
                  </div>
                  <span className="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 hidden sm:block">
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Wizard Steps Contents */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* STEP 1: Company Profile */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Tell us about your organization
                    </h2>
                    <p className="text-xs text-muted">
                      We will customize your workspaces, roles, and candidate scoring thresholds.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-slate-800 dark:text-slate-100"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Company Size
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["1-10", "10-50", "50-250", "250+"].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setOrgSize(size)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                              orgSize === size
                                ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                : "border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Invite Team */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Invite your recruiting committee
                    </h2>
                    <p className="text-xs text-muted">
                      Collaborate and grade candidate cards by assigning precise roles.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={invitedEmail}
                        onChange={(e) => setInvitedEmail(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-slate-800 dark:text-slate-100"
                        placeholder="hiring.partner@company.com"
                      />
                      <select
                        value={invitedRole}
                        onChange={(e) => setInvitedRole(e.target.value)}
                        className="px-2 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-700 dark:text-slate-200"
                      >
                        <option value="Recruiter">Recruiter</option>
                        <option value="Hiring Manager">Hiring Manager</option>
                        <option value="Interviewer">Interviewer</option>
                      </select>
                    </div>

                    <div className="p-3 bg-slate-55 dark:bg-slate-900/50 border border-border rounded-xl space-y-2">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                        Default Committee Members:
                      </div>
                      <div className="flex justify-between text-[11px] text-muted">
                        <span>sarah.j@vercel.com (You)</span>
                        <span className="font-semibold text-brand-primary">Owner / Admin</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted">
                        <span>michael.v@vercel.com</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Recruiter</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: AI Calibrator */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Calibrate AI Agent Settings
                    </h2>
                    <p className="text-xs text-muted">
                      Tailor how strict the AI scoring model scans resume documents.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                          Enable Auto Resume Scoring
                        </span>
                        <span className="text-[10px] text-muted">
                          Automatically parse new applications within 15 seconds.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableScreening}
                        onChange={(e) => setEnableScreening(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        AI Scoring Match Strictness
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["lenient", "medium", "strict"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setAiStrictness(level)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center capitalize ${
                              aiStrictness === level
                                ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                : "border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Ready to Launch */}
              {step === 4 && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-brand-success flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={36} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Setup is Complete!
                    </h2>
                    <p className="text-xs text-muted max-w-sm mx-auto">
                      RecruitFlow AI is calibrated for **{orgName}** and ready to screen applications. We loaded sample profiles so you can explore immediately.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Onboarding Footer - Back / Next buttons */}
        <div className="px-6 py-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              step === 1 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <ChevronLeft size={14} />
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 text-xs font-semibold bg-brand-primary text-white hover:bg-brand-accent rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            {step === 4 ? "Launch RecruitFlow" : "Continue"}
            <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

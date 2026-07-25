"use client";

import React, { useState } from "react";
import { useHiring, Candidate, PipelineStage } from "@/context/hiring-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Calendar
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Drawer from "@/components/ui/drawer";
import Tabs from "@/components/ui/tabs";
import Button from "@/components/ui/button";

export default function Pipeline() {
  const { candidates, updateCandidateStatus, deleteCandidate, jobs, userRole } = useHiring();
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerTab, setDrawerTab] = useState("ai-analysis");
  const [activeDragStage, setActiveDragStage] = useState<PipelineStage | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const stages: PipelineStage[] = [
    "Applied",
    "Screening",
    "Interview",
    "Technical Round",
    "HR Round",
    "Offer",
    "Hired",
    "Rejected"
  ];

  // AI Pipeline Copilot recommendations
  const getAiRecommendations = () => {
    const list = [];
    // Rec 1: Jane Doe stalled in Technical
    const jane = candidates.find((c) => c.id === "cand-1");
    if (jane && jane.status === "Technical Round") {
      list.push({
        id: "rec-1",
        candId: jane.id,
        name: jane.name,
        actionText: "Advance to HR Round",
        targetStage: "HR Round" as PipelineStage,
        reason: `${jane.name} scored 96% match on Frontend and passed all technical validations. We recommend locking in an HR review.`
      });
    }

    // Rec 2: Alex Chen stalled in Screening
    const alex = candidates.find((c) => c.id === "cand-2");
    if (alex && alex.status === "Screening") {
      list.push({
        id: "rec-2",
        candId: alex.id,
        name: alex.name,
        actionText: "Move to Interview",
        targetStage: "Interview" as PipelineStage,
        reason: `${alex.name} has a 91% fit rating for AI Scientist. Move him to the schedule loop to prevent pipeline drop-off.`
      });
    }

    return list;
  };

  const recommendations = getAiRecommendations();

  // Drag and Drop core logic
  const handleDragStart = (e: any, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setActiveDragStage(stage);
  };

  const handleDragLeave = () => {
    setActiveDragStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    setActiveDragStage(null);
    if (userRole === "Viewer") return;

    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      updateCandidateStatus(id, targetStage);
    }
  };

  // Filter candidates list
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Recruitment Funnel Pipeline
          </h1>
          <p className="text-xs text-muted">
            Drag and drop candidate cards across columns or use AI recommendations to advance applicants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search filter */}
          <div className="relative w-48 sm:w-60">
            <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-card border border-border rounded-lg text-xs focus:outline-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Job Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All Positions</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.title}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Pipeline Assistant copilot widget */}
      {recommendations.length > 0 && (
        <div className="p-4 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 relative overflow-hidden space-y-3">
          <div className="flex items-center gap-2 text-brand-accent">
            <Sparkles size={16} className="animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider">
              AI Pipeline Assistant Recommendations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-3 bg-slate-850 border border-slate-850 hover:border-brand-primary/30 rounded-lg flex items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-350 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => updateCandidateStatus(rec.candId, rec.targetStage)}
                  className="text-[10px] py-1 px-2.5 h-7 shrink-0 cursor-pointer"
                  disabled={userRole === "Viewer"}
                >
                  {rec.actionText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Stages Grid Scroll Area */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4 min-w-[1440px] px-1 h-[600px]">
          {stages.map((stage) => {
            const stageCandidates = filteredCandidates.filter((c) => c.status === stage);
            const isDraggingOver = activeDragStage === stage;

            return (
              <div
                key={stage}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
                className={`flex-1 flex flex-col rounded-xl p-3 border transition-colors select-none ${
                  isDraggingOver
                    ? "bg-brand-primary/5 border-brand-primary/40 ring-2 ring-brand-primary/10"
                    : "bg-slate-50/50 dark:bg-slate-900/30 border-border"
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3.5 px-1 shrink-0">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {stage}
                  </span>
                  <Badge variant="neutral" className="tabular-nums font-semibold px-2 py-0.5">
                    {stageCandidates.length}
                  </Badge>
                </div>

                {/* Cards stack */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
                  {stageCandidates.map((cand) => (
                    <motion.div
                      key={cand.id}
                      layoutId={`kanban-card-${cand.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cand.id)}
                      onClick={() => setSelectedCandidate(cand)}
                      className="bg-card border border-border hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-xs p-3.5 rounded-xl space-y-3 cursor-grab active:cursor-grabbing transition-all relative group"
                    >
                      {/* Name / AI score badge */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-primary transition-colors leading-normal truncate">
                          {cand.name}
                        </span>
                        
                        <Badge
                          variant={
                            cand.aiMatch >= 90 ? "success" :
                            cand.aiMatch >= 80 ? "primary" : "warning"
                          }
                          className="tabular-nums scale-95 shrink-0"
                        >
                          {cand.aiMatch}% Fit
                        </Badge>
                      </div>

                      {/* Job Title */}
                      <div className="text-[10px] text-slate-500 font-medium">
                        {cand.role}
                      </div>

                      {/* Card footer details */}
                      <div className="pt-2 border-t border-border flex items-center justify-between text-[9px] text-slate-400">
                        <span className="font-semibold">{cand.experience} yrs exp</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-300 flex items-center justify-center font-bold text-[9px]">
                            {cand.avatar}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {stageCandidates.length === 0 && (
                    <div className="h-full border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center py-12 text-[10px] text-muted font-medium text-center">
                      Drag card here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-out Candidate Detail Drawer */}
      <Drawer
        isOpen={selectedCandidate !== null}
        onClose={() => setSelectedCandidate(null)}
        title={selectedCandidate ? `Profile: ${selectedCandidate.name}` : ""}
      >
        {selectedCandidate && (
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Header profile info */}
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                  {selectedCandidate.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-[10px] text-muted mt-0.5">{selectedCandidate.role}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-muted block mb-1">AI Match Fit</span>
                <Badge variant={selectedCandidate.aiMatch >= 90 ? "success" : "primary"}>
                  {selectedCandidate.aiMatch}% Fit
                </Badge>
              </div>
            </div>

            {/* Micro details contact */}
            <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Search size={12} className="text-slate-400" />
                {selectedCandidate.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-slate-400" />
                {selectedCandidate.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={12} className="text-slate-400" />
                {selectedCandidate.experience} Years Experience
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-slate-400" />
                Interview: {selectedCandidate.interviewDate ? new Date(selectedCandidate.interviewDate).toLocaleDateString() : "Not Scheduled"}
              </span>
            </div>

            {/* Profile Drawer Tabs */}
            <Tabs
              tabs={[
                { id: "ai-analysis", label: "AI Analysis" },
                { id: "resume-view", label: "Resume Summary" },
                { id: "actions", label: "Workflow States" }
              ]}
              activeTab={drawerTab}
              onChange={setDrawerTab}
            />

            {/* TAB CONTENTS */}
            <div className="space-y-4 pt-1">
              {/* TAB: AI Analysis */}
              {drawerTab === "ai-analysis" && (
                <div className="space-y-5">
                  {/* Summary */}
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                      <Sparkles size={14} className="text-brand-accent animate-pulse" />
                      Executive AI Summary
                    </h4>
                    <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed bg-brand-primary/5 dark:bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10">
                      {selectedCandidate.summary}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Identified Skills Match
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-350 border border-border rounded"
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
                        <TrendingUp size={12} />
                        Key Strengths
                      </h4>
                      <ul className="space-y-1 text-[10px] text-slate-500">
                        {selectedCandidate.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-brand-success">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs flex items-center gap-1 text-brand-danger">
                        <AlertCircle size={12} />
                        Improvement Areas
                      </h4>
                      <ul className="space-y-1 text-[10px] text-slate-500">
                        {selectedCandidate.weaknesses.map((weak, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-brand-danger">!</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Generated Interview Questions */}
                  {selectedCandidate.interviewQuestions.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs flex items-center gap-1 text-brand-accent">
                        <Sparkles size={13} className="text-brand-accent animate-pulse" />
                        Generated Panel Questions
                      </h4>
                      <div className="space-y-2">
                        {selectedCandidate.interviewQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-[11px] leading-relaxed text-slate-700 dark:text-slate-400"
                          >
                            <span className="font-bold text-brand-accent mr-1">Q{idx + 1}:</span>
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risks Alert */}
                  {selectedCandidate.risks.length > 0 && (
                    <div className="p-3 bg-amber-550/10 border border-amber-500/20 rounded-xl flex gap-2">
                      <AlertCircle size={16} className="text-brand-warning shrink-0 mt-0.5" />
                      <div className="text-[10px] text-slate-750 dark:text-amber-400 leading-normal">
                        <span className="font-semibold block mb-0.5">AI Flagged Risk Factors:</span>
                        {selectedCandidate.risks.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Resume Preview */}
              {drawerTab === "resume-view" && (
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 border border-border rounded-xl text-slate-500 font-mono text-[10px] leading-relaxed">
                  <div className="border-b border-border pb-2 mb-2 flex justify-between font-sans">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">
                      Mock PDF Content Parser Output
                    </span>
                    <span>1.2 MB file</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{selectedCandidate.name.toUpperCase()}</p>
                      <p>{selectedCandidate.email} | {selectedCandidate.phone}</p>
                    </div>

                    <div>
                      <p className="font-bold border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">SUMMARY</p>
                      <p className="mt-1">
                        Professional software veteran with {selectedCandidate.experience} years of hands-on expertise building and maintaining scalable systems. Dedicated collaborator seeking a challenging position at Vercel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Actions */}
              {drawerTab === "actions" && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-border rounded-xl space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Advance Candidate Stage
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {stages.map((stage) => (
                        <button
                          key={stage}
                          onClick={() => {
                            updateCandidateStatus(selectedCandidate.id, stage);
                            setSelectedCandidate({ ...selectedCandidate, status: stage });
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            selectedCandidate.status === stage
                              ? "border-brand-primary bg-brand-primary text-white"
                              : "border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-355"
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {userRole !== "Viewer" && (
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          deleteCandidate(selectedCandidate.id);
                          setSelectedCandidate(null);
                        }}
                        className="text-xs"
                      >
                        Delete Candidate profile
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

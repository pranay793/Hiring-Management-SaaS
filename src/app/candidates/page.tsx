"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useHiring, Candidate, PipelineStage, Job } from "@/context/hiring-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  AlertTriangle,
  FileText,
  ThumbsUp,
  X,
  FileSignature,
  DollarSign,
  MapPin,
  Building,
  UserCheck,
  Zap
} from "lucide-react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Drawer from "@/components/ui/drawer";
import Tabs from "@/components/ui/tabs";

function CandidatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    candidates,
    jobs,
    deleteCandidate,
    updateCandidateStatus,
    addCandidate,
    scheduleInterview,
    userRole
  } = useHiring();

  // Navigation tab based on query param
  const activeParamTab = searchParams.get("tab") || "candidates";
  const [activeSubTab, setActiveSubTab] = useState(activeParamTab);

  useEffect(() => {
    setActiveSubTab(activeParamTab);
  }, [activeParamTab]);

  // Drawer selected candidate
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerTab, setDrawerTab] = useState("ai-analysis");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [aiScoreThreshold, setAiScoreThreshold] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add Candidate Form Modal
  const [addCandOpen, setAddCandOpen] = useState(false);
  const [newCandName, setNewCandName] = useState("");
  const [newCandRole, setNewCandRole] = useState("Senior React Engineer");
  const [newCandExp, setNewCandExp] = useState(5);
  const [newCandEmail, setNewCandEmail] = useState("");
  const [newCandPhone, setNewCandPhone] = useState("");
  const [newCandSkills, setNewCandSkills] = useState("");

  // Check URL query parameter "?id=" to automatically open drawer on load
  useEffect(() => {
    const cid = searchParams.get("id");
    if (cid) {
      const match = candidates.find((c) => c.id === cid);
      if (match) {
        setSelectedCandidate(match);
      }
    }
  }, [searchParams, candidates]);

  // Handle URL updates when drawer closes
  const handleCloseDrawer = () => {
    setSelectedCandidate(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    router.replace(`/candidates?${params.toString()}`);
  };

  const handleOpenCandidate = (cand: Candidate) => {
    setSelectedCandidate(cand);
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", cand.id);
    router.replace(`/candidates?${params.toString()}`);
  };

  // Bulk actions triggers
  const handleBulkDelete = () => {
    if (userRole === "Viewer") return;
    selectedIds.forEach((id) => deleteCandidate(id));
    setSelectedIds([]);
  };

  const handleBulkAdvance = (stage: PipelineStage) => {
    if (userRole === "Viewer") return;
    selectedIds.forEach((id) => updateCandidateStatus(id, stage));
    setSelectedIds([]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const filtered = getFilteredCandidates();
      setSelectedIds(filtered.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add Candidate handler
  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName || !newCandEmail) return;

    addCandidate({
      name: newCandName,
      avatar: newCandName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      role: newCandRole,
      experience: Number(newCandExp),
      resumeScore: Math.floor(Math.random() * 20) + 76, // 76-96
      aiMatch: Math.floor(Math.random() * 25) + 72, // 72-97
      status: "Applied",
      recruiter: "Sarah Jenkins",
      interviewDate: null,
      email: newCandEmail,
      phone: newCandPhone || "+1 (555) 019-1234",
      skills: newCandSkills.split(",").map((s) => s.trim()).filter(Boolean),
      summary: "AI Synthesized: Candidate profile created manually. Strong basic metrics, awaiting parsing depth confirmation.",
      strengths: ["Clean resume formatting", "High match on core tech keywords"],
      weaknesses: ["Needs initial recruiter verification call"],
      cultureFit: "Pending live HR panel discussion.",
      risks: ["Not verified yet"],
      recommendation: "Hire",
      interviewQuestions: [
        "What motivated you to apply to our team, and what is your core architectural framework expertise?",
        "Describe your experience managing live microservices loads."
      ]
    });

    // Reset Form
    setNewCandName("");
    setNewCandEmail("");
    setNewCandPhone("");
    setNewCandSkills("");
    setAddCandOpen(false);
  };

  // Filter candidates list
  const getFilteredCandidates = () => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesScore = c.aiMatch >= aiScoreThreshold;
      return matchesSearch && matchesStatus && matchesScore;
    });
  };

  // Sorted candidates list
  const getSortedCandidates = () => {
    const list = getFilteredCandidates();
    return list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "experience") {
        comparison = a.experience - b.experience;
      } else if (sortBy === "resumeScore") {
        comparison = a.resumeScore - b.resumeScore;
      } else if (sortBy === "aiMatch") {
        comparison = a.aiMatch - b.aiMatch;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const sortedCandidates = getSortedCandidates();

  // Paged candidates list
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage) || 1;
  const pagedCandidates = sortedCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {activeSubTab === "candidates" ? "Candidate Directory" :
             activeSubTab === "jobs" ? "Active Job Vacancies" : "Pending Salary Offers"}
          </h1>
          <p className="text-xs text-muted">
            {activeSubTab === "candidates" ? "Browse, search, sort, and review AI scoring profiles of current applicants." :
             activeSubTab === "jobs" ? "Monitor active candidate funnels across departments." : "Approve and manage offer configurations."}
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex border border-border rounded-lg bg-card overflow-hidden">
          {[
            { id: "candidates", label: "Candidates" },
            { id: "jobs", label: "Positions" },
            { id: "offers", label: "Offers" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                router.push(`/candidates?tab=${tab.id}`);
              }}
              className={`px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors border-r border-border last:border-r-0 ${
                activeSubTab === tab.id
                  ? "bg-slate-100 dark:bg-slate-800 text-brand-primary"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ACTIVE TAB: CANDIDATES */}
      {activeSubTab === "candidates" && (
        <>
          {/* Table Filters Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-2xs">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
              {/* Search input */}
              <div className="relative w-full max-w-xs">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, roles, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Status stage filter */}
              <div className="flex items-center gap-1.5 border border-border rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-350 cursor-pointer">
                <SlidersHorizontal size={12} className="text-slate-400" />
                <span>Stage: </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 font-semibold cursor-pointer"
                >
                  <option value="All">All Stages</option>
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="HR Round">HR Round</option>
                  <option value="Offer">Offer</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* AI Score threshold filter */}
              <div className="flex items-center gap-2 border border-border rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-650 dark:text-slate-350">
                <span>Min Match:</span>
                <span className="font-semibold text-brand-primary">{aiScoreThreshold}%</span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="10"
                  value={aiScoreThreshold}
                  onChange={(e) => setAiScoreThreshold(Number(e.target.value))}
                  className="w-16 accent-brand-primary h-1 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {userRole !== "Viewer" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setAddCandOpen(true)}
                  className="text-xs"
                >
                  <UserPlus size={14} />
                  Add Candidate
                </Button>
              )}
            </div>
          </div>

          {/* Candidates Data Table */}
          <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-semibold text-muted tracking-wider uppercase border-b border-border">
                  <tr>
                    <th className="p-4 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          pagedCandidates.length > 0 &&
                          pagedCandidates.every((c) => selectedIds.includes(c.id))
                        }
                        className="w-3.5 h-3.5 rounded border-border focus:ring-brand-primary text-brand-primary cursor-pointer"
                      />
                    </th>
                    <th
                      onClick={() => toggleSort("name")}
                      className="p-4 font-semibold cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </div>
                    </th>
                    <th className="p-4 font-semibold">Position</th>
                    <th
                      onClick={() => toggleSort("experience")}
                      className="p-4 font-semibold cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Exp {sortBy === "experience" && (sortOrder === "asc" ? "↑" : "↓")}
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort("resumeScore")}
                      className="p-4 font-semibold cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        Resume {sortBy === "resumeScore" && (sortOrder === "asc" ? "↑" : "↓")}
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort("aiMatch")}
                      className="p-4 font-semibold cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        AI Fit % {sortBy === "aiMatch" && (sortOrder === "asc" ? "↑" : "↓")}
                      </div>
                    </th>
                    <th className="p-4 font-semibold">Recruiter</th>
                    <th className="p-4 font-semibold">Stage</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagedCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-12 text-center text-xs text-muted">
                        No candidates match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    pagedCandidates.map((cand) => {
                      const isRowSelected = selectedIds.includes(cand.id);
                      return (
                        <motion.tr
                          key={cand.id}
                          layoutId={`candidate-row-${cand.id}`}
                          className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${
                            isRowSelected ? "bg-brand-primary/5 dark:bg-brand-primary/5" : ""
                          }`}
                        >
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={isRowSelected}
                              onChange={() => handleRowSelect(cand.id)}
                              className="w-3.5 h-3.5 rounded border-border text-brand-primary cursor-pointer"
                            />
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleOpenCandidate(cand)}
                              className="flex items-center gap-3 text-left group cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs group-hover:ring-2 group-hover:ring-brand-primary transition-all">
                                {cand.avatar}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-primary transition-colors block">
                                  {cand.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block">{cand.email}</span>
                              </div>
                            </button>
                          </td>
                          <td className="p-4 font-medium text-slate-750 dark:text-slate-300">
                            {cand.role}
                          </td>
                          <td className="p-4 font-semibold text-slate-750 dark:text-slate-350 tabular-nums">
                            {cand.experience} yrs
                          </td>
                          <td className="p-4 text-center font-bold tabular-nums text-slate-800 dark:text-slate-200">
                            {cand.resumeScore}
                          </td>
                          <td className="p-4 text-center font-bold">
                            <Badge
                              variant={
                                cand.aiMatch >= 90 ? "success" :
                                cand.aiMatch >= 80 ? "primary" : "warning"
                              }
                              className="tabular-nums"
                            >
                              {cand.aiMatch}%
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-500 text-xs">
                            {cand.recruiter}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                cand.status === "Hired" ? "success" :
                                cand.status === "Rejected" ? "danger" :
                                cand.status === "Offer" ? "accent" : "warning"
                              }
                            >
                              {cand.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleOpenCandidate(cand)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 border border-border rounded-md transition-colors cursor-pointer"
                            >
                              View Profile
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-t border-border">
              <span className="text-[10px] text-muted font-medium">
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedCandidates.length)} of {sortedCandidates.length} applicants
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-2 tabular-nums">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Slide-Up Bulk Actions Toolbar */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3.5 bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-6 text-white"
              >
                <div className="text-xs font-semibold">
                  <span className="text-brand-accent tabular-nums mr-1">{selectedIds.length}</span>
                  candidates selected
                </div>

                <div className="h-4 w-px bg-slate-800" />

                <div className="flex gap-2">
                  <select
                    onChange={(e) => handleBulkAdvance(e.target.value as PipelineStage)}
                    className="px-2 py-1 bg-slate-850 text-xs font-semibold rounded-lg border border-slate-800 focus:outline-none cursor-pointer text-slate-200"
                    defaultValue=""
                  >
                    <option value="" disabled>Move to stage...</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Technical Round">Technical Round</option>
                    <option value="HR Round">HR Round</option>
                    <option value="Offer">Offer</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {userRole !== "Viewer" && (
                    <button
                      onClick={handleBulkDelete}
                      className="p-1.5 bg-red-950 text-red-400 hover:bg-red-900 border border-red-900 rounded-lg hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer text-xs"
                      title="Bulk Delete Profiles"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSelectedIds([])}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md cursor-pointer"
                  title="Clear Selection"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* RENDER ACTIVE TAB: JOBS */}
      {activeSubTab === "jobs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card hoverable key={job.id} className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {job.title}
                  </h3>
                  <div className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                    <Building size={10} />
                    <span>{job.department}</span>
                  </div>
                </div>
                <Badge variant={job.status === "Open" ? "success" : "neutral"}>
                  {job.status}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={10} />
                  {job.location}
                </span>
                <span>•</span>
                <span>{job.type}</span>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
                <div className="text-[10px]">
                  <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums mr-1">
                    {job.applicantsCount}
                  </span>
                  <span className="text-muted">applicants</span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("All");
                    setSearchQuery(job.title);
                    setActiveSubTab("candidates");
                    router.push("/candidates");
                  }}
                  className="text-[10px] py-1 px-2 h-7"
                >
                  View candidates
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* RENDER ACTIVE TAB: OFFERS */}
      {activeSubTab === "offers" && (
        <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
          <table className="w-full border-collapse text-left text-slate-600 dark:text-slate-350">
            <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-semibold text-muted tracking-wider uppercase border-b border-border">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Annual Base Salary</th>
                <th className="p-4">Sign-on Bonus</th>
                <th className="p-4">Equity Grant</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {candidates.filter((c) => c.status === "Offer" || c.status === "Hired").length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-muted">
                    No candidates are in the offer negotiation phase.
                  </td>
                </tr>
              ) : (
                candidates
                  .filter((c) => c.status === "Offer" || c.status === "Hired")
                  .map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                      <td className="p-4">
                        <span className="font-semibold text-slate-850 dark:text-slate-200 block">
                          {cand.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{cand.email}</span>
                      </td>
                      <td className="p-4">{cand.role}</td>
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        $145,000 /yr
                      </td>
                      <td className="p-4 font-semibold tabular-nums">$15,000</td>
                      <td className="p-4 font-semibold tabular-nums">0.05% stock</td>
                      <td className="p-4">
                        <Badge variant={cand.status === "Hired" ? "success" : "neutral"}>
                          {cand.status === "Hired" ? "Signed & Closed" : "Offer Pending"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        {cand.status === "Offer" && userRole !== "Viewer" ? (
                          <>
                            <button
                              onClick={() => updateCandidateStatus(cand.id, "Hired")}
                              className="px-2 py-1 text-[10px] font-semibold bg-brand-success text-white hover:bg-brand-success/90 rounded-md transition-colors cursor-pointer"
                            >
                              Sign Offer
                            </button>
                            <button
                              onClick={() => updateCandidateStatus(cand.id, "Rejected")}
                              className="px-2 py-1 text-[10px] font-semibold border border-brand-danger text-brand-danger hover:bg-brand-danger/5 rounded-md transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400">Negotiation concluded</span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-out Candidate Detail Drawer */}
      <Drawer
        isOpen={selectedCandidate !== null}
        onClose={handleCloseDrawer}
        title={selectedCandidate ? `Profile: ${selectedCandidate.name}` : ""}
      >
        {selectedCandidate && (
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Short header card info */}
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
                <Mail size={12} className="text-slate-400" />
                {selectedCandidate.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={12} className="text-slate-400" />
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
                        <ThumbsUp size={12} />
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
                        <AlertTriangle size={12} />
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
                        <Zap size={13} />
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
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
                      <AlertTriangle size={16} className="text-brand-warning shrink-0 mt-0.5" />
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
                        Professional software veteran with {selectedCandidate.experience} years of hands-on expertise building and maintaining scalable systems. Dedicated collaborator seeking a challenging position at Vercel where I can impact production speed and customer satisfaction directly.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">CORE COMPETENCIES</p>
                      <p className="mt-1">{selectedCandidate.skills.join(" • ")}</p>
                    </div>

                    <div>
                      <p className="font-bold border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">EXPERIENCE</p>
                      <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">Senior Lead Practitioner | Technical Growth Inc. (2022 - Present)</p>
                      <p className="mt-0.5">- Led migrations of frontend setups to Next.js layouts, reducing page shifts by 35%.</p>
                      <p className="-mt-1">- Oversaw transition of 10 microservices, reducing container memory loads.</p>
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
                      {[
                        "Applied",
                        "Screening",
                        "Interview",
                        "Technical Round",
                        "HR Round",
                        "Offer",
                        "Hired",
                        "Rejected"
                      ].map((stage) => (
                        <button
                          key={stage}
                          onClick={() => {
                            updateCandidateStatus(selectedCandidate.id, stage as PipelineStage);
                            setSelectedCandidate({ ...selectedCandidate, status: stage as PipelineStage });
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            selectedCandidate.status === stage
                              ? "border-brand-primary bg-brand-primary text-white"
                              : "border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350"
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
                          handleCloseDrawer();
                        }}
                        className="text-xs"
                      >
                        <Trash2 size={13} />
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

      {/* Add Candidate Form Modal Dialog */}
      {addCandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Register New Candidate Profile
              </h2>
              <button
                onClick={() => setAddCandOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
              >
                X
              </button>
            </div>

            <form onSubmit={handleAddCandidateSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-350">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newCandName}
                  onChange={(e) => setNewCandName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-800 dark:text-slate-100 text-xs"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Applying Position
                  </label>
                  <select
                    value={newCandRole}
                    onChange={(e) => setNewCandRole(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-700 dark:text-slate-250 text-xs"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.title}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={newCandExp}
                    onChange={(e) => setNewCandExp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-800 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newCandEmail}
                    onChange={(e) => setNewCandEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-800 dark:text-slate-100 text-xs"
                    placeholder="e.g. jane@company.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newCandPhone}
                    onChange={(e) => setNewCandPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-800 dark:text-slate-100 text-xs"
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-350">
                  Skills Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={newCandSkills}
                  onChange={(e) => setNewCandSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-800 dark:text-slate-100 text-xs"
                  placeholder="e.g. React, Next.js, Redux, Tailwind"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setAddCandOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="text-xs">
                  Register Candidate
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function Candidates() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted">Loading Candidates...</div>}>
      <CandidatesContent />
    </React.Suspense>
  );
}

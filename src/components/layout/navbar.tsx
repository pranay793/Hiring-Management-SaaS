"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHiring, Candidate, Job } from "@/context/hiring-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronRight,
  Menu,
  Sparkles,
  User,
  Briefcase,
  Calendar as CalendarIcon,
  X,
  CheckCircle,
  FileText
} from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { candidates, jobs, interviews } = useHiring();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Candidate Applied", body: "Emily Watson applied for Senior React Engineer", read: false, time: "5m ago", type: "apply" },
    { id: 2, title: "Offer Accepted", body: "Hiroshi Tanaka accepted the DevOps position!", read: false, time: "2h ago", type: "offer" },
    { id: 3, title: "Resume Scanned", body: "Sophia Martinez resume scored 97/100 by AI", read: true, time: "4h ago", type: "scan" },
    { id: 4, title: "Interview Scheduled", body: "Technical review set with Jane Doe for tomorrow", read: true, time: "1d ago", type: "interview" },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Keybindings for CMD+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Format active path into breadcrumb items
  const getBreadcrumbs = () => {
    const path = pathname === "/" ? "dashboard" : pathname.replace("/", "");
    const cleanPath = path.split("?")[0].replace("-", " ");
    return [
      { label: "RecruitFlow AI", href: "/" },
      { label: cleanPath, href: pathname, active: true },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  // Search Results filtering
  const filteredCandidates = searchQuery
    ? candidates.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredJobs = searchQuery
    ? jobs.filter((j) =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-background/80 backdrop-blur-md border-b border-border select-none">
      {/* Left section: Hamburger (Mobile) + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <ChevronRight size={14} className="text-slate-300 dark:text-slate-700" />}
              {crumb.active ? (
                <span className="text-slate-800 dark:text-slate-200 capitalize font-semibold">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => router.push(crumb.href)}
                  className="hover:text-slate-800 dark:hover:text-slate-200 capitalize cursor-pointer"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right section: Search Button + Notifications */}
      <div className="flex items-center gap-3">
        {/* Cmd+K trigger button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-between w-48 lg:w-64 px-3 py-1.5 text-xs text-muted bg-slate-100/80 dark:bg-slate-900 border border-border rounded-lg hover:border-slate-350 dark:hover:border-slate-700 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Search size={14} className="text-slate-400" />
            <span>Search candidates...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded shadow-2xs">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Notifications Icon Tray */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
            )}
          </button>

          {/* Notifications dropdown list */}
          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2.5 w-80 bg-card border border-border shadow-xl rounded-xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-50/50 dark:bg-slate-900/30">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Notifications ({unreadCount} unread)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-semibold text-brand-primary hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-border">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3 ${
                          n.read ? "opacity-75" : "bg-brand-primary/5 dark:bg-brand-primary/5"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          n.type === "offer" ? "bg-emerald-100 dark:bg-emerald-900/40 text-brand-success" :
                          n.type === "scan" ? "bg-violet-100 dark:bg-violet-900/40 text-brand-accent" :
                          n.type === "interview" ? "bg-amber-100 dark:bg-amber-900/40 text-brand-warning" :
                          "bg-blue-100 dark:bg-blue-900/40 text-brand-primary"
                        }`}>
                          {n.type === "offer" ? <CheckCircle size={14} /> :
                           n.type === "scan" ? <Sparkles size={14} /> :
                           n.type === "interview" ? <CalendarIcon size={14} /> :
                           <User size={14} />}
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted leading-relaxed">
                            {n.body}
                          </p>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Search Dialog Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden"
            >
              {/* Search input line */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search candidate profiles, positions, and platform commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200"
                  autoFocus
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search details results */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {searchQuery === "" ? (
                  <div className="text-center py-6 text-xs text-muted">
                    Type a candidate name (e.g. <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Jane</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Sophia</code>) or job position to filter records.
                  </div>
                ) : (
                  <>
                    {/* Candidate Results */}
                    {filteredCandidates.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-semibold text-muted tracking-wider uppercase px-2 mb-1">
                          Candidates
                        </div>
                        {filteredCandidates.map((cand) => (
                          <button
                            key={cand.id}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                              router.push(`/candidates?id=${cand.id}`);
                            }}
                            className="flex items-center justify-between w-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                                {cand.avatar}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                  {cand.name}
                                </div>
                                <div className="text-[10px] text-muted">{cand.role}</div>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold">
                              Score: {cand.aiMatch}%
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Job Results */}
                    {filteredJobs.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-semibold text-muted tracking-wider uppercase px-2 mb-1">
                          Jobs
                        </div>
                        {filteredJobs.map((job) => (
                          <button
                            key={job.id}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                              router.push(`/candidates?tab=jobs`);
                            }}
                            className="flex items-center justify-between w-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded bg-brand-primary/10 text-brand-primary">
                                <Briefcase size={14} />
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                  {job.title}
                                </div>
                                <div className="text-[10px] text-muted">{job.department}</div>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {job.applicantsCount} applicants
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {filteredCandidates.length === 0 && filteredJobs.length === 0 && (
                      <div className="text-center py-6 text-xs text-muted">
                        No candidates or job vacancies match &ldquo;{searchQuery}&rdquo;.
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

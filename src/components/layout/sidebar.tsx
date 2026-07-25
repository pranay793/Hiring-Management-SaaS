"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHiring, UserRole } from "@/context/hiring-context";
import { useTheme } from "@/context/theme-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Briefcase,
  Calendar,
  Sparkles,
  FileCheck,
  BarChart3,
  FileSpreadsheet,
  Mail,
  UserPlus,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  LogOut,
  Moon,
  Sun,
  ChevronDown
} from "lucide-react";

const USERS_BY_ROLE: Record<UserRole, { name: string; initials: string; email: string }> = {
  Admin: { name: "Sarah Jenkins", initials: "SJ", email: "sarah.j@recruitflow.ai" },
  Recruiter: { name: "Michael Vance", initials: "MV", email: "michael.v@recruitflow.ai" },
  "Hiring Manager": { name: "Alex Chen", initials: "AC", email: "alex.c@recruitflow.ai" },
  Interviewer: { name: "Sophia Martinez", initials: "SM", email: "sophia.m@recruitflow.ai" },
  Viewer: { name: "Guest User", initials: "GU", email: "guest@recruitflow.ai" }
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, updateUserRole, currentOrg, updateOrgName, logoutUser } = useHiring();
  const { theme, toggleTheme } = useTheme();
  
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Candidates", href: "/candidates", icon: Users },
    { label: "Recruitment Pipeline", href: "/pipeline", icon: GitBranch },
    { label: "Job Positions", href: "/candidates?tab=jobs", icon: Briefcase },
    { label: "Interview Calendar", href: "/calendar", icon: Calendar },
    { label: "AI Resume Analysis", href: "/resume-ai", icon: Sparkles },
    { label: "Offers", href: "/candidates?tab=offers", icon: FileCheck },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Reports", href: "/analytics?tab=reports", icon: FileSpreadsheet },
    { label: "Messages", href: "/settings?tab=messages", icon: Mail },
    { label: "Team", href: "/settings?tab=team", icon: UserPlus },
    { label: "Billing", href: "/pricing", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const workspaces = ["Vercel & Co.", "Stripe Talent", "Linear Labs", "Acme Inc."];
  const roles: UserRole[] = ["Admin", "Recruiter", "Hiring Manager", "Interviewer", "Viewer"];

  return (
    <motion.div
      animate={{ width: isOpen ? 260 : 72 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative z-30 flex flex-col h-screen bg-sidebar-bg border-r border-sidebar-border select-none flex-shrink-0"
    >
      {/* Sidebar Header - Workspace Switcher */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="relative flex-1">
          <button
            onClick={() => { setIsOpen(true); setShowWorkspaceMenu(!showWorkspaceMenu); }}
            className="flex items-center gap-2.5 w-full text-left p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-brand-primary text-white font-semibold shadow-sm">
              <Building size={16} />
            </div>
            {isOpen && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200">
                  {currentOrg}
                </span>
                <ChevronDown size={14} className="text-slate-400 ml-1" />
              </div>
            )}
          </button>

          {/* Workspace Dropdown */}
          <AnimatePresence>
            {showWorkspaceMenu && isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowWorkspaceMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-12 left-0 right-0 z-50 bg-card border border-border shadow-lg rounded-lg overflow-hidden py-1"
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted tracking-wider uppercase border-b border-border">
                    Workspaces
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws}
                      onClick={() => {
                        updateOrgName(ws);
                        setShowWorkspaceMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer ${
                        currentOrg === ws ? "text-brand-primary font-medium" : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {ws}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href.split("?")[0];
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group cursor-pointer relative ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-800/80 text-brand-primary font-medium"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-brand-primary" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}
              />
              {isOpen && (
                <span className="truncate">{item.label}</span>
              )}
              {isActive && isOpen && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer - Settings / Theme / Role switcher */}
      <div className="p-4 border-t border-sidebar-border space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
        {/* Toggle Theme / Logout / Toggle Collapse */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={logoutUser}
              className="p-1.5 text-rose-500 hover:bg-rose-100/50 dark:hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
              title="Log Out"
            >
              <LogOut size={15} />
              {isOpen && <span className="text-[10px] font-bold">Log Out</span>}
            </button>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer hidden md:block"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* User Card & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => { setIsOpen(true); setShowRoleMenu(!showRoleMenu); }}
            className="flex items-center gap-3 w-full text-left p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-205 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-border">
              {USERS_BY_ROLE[userRole]?.initials || "GU"}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                  {USERS_BY_ROLE[userRole]?.name || "Guest User"}
                </div>
                <div className="text-[10px] text-muted flex items-center gap-1 font-semibold">
                  <ShieldCheck size={10} className="text-brand-primary" />
                  <span className="capitalize">{userRole}</span>
                </div>
              </div>
            )}
          </button>

          {/* Role selection dropdown */}
          <AnimatePresence>
            {showRoleMenu && isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRoleMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-12 left-0 right-0 z-50 bg-card border border-border shadow-lg rounded-lg overflow-hidden py-1"
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted tracking-wider uppercase border-b border-border">
                    Impersonate Role
                  </div>
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        updateUserRole(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer ${
                        userRole === role ? "text-brand-primary font-medium" : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

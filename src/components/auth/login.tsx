"use client";

import React, { useState } from "react";
import { useHiring, UserRole } from "@/context/hiring-context";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Mail, Lock, User, RefreshCw, KeyRound } from "lucide-react";
import Button from "@/components/ui/button";

export default function Login() {
  const { loginUser } = useHiring();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const mockUsers = [
    { role: "Admin" as UserRole, name: "Sarah Jenkins", initials: "SJ", email: "sarah.j@recruitflow.ai", desc: "Full privileges & setup calibrations" },
    { role: "Recruiter" as UserRole, name: "Michael Vance", initials: "MV", email: "michael.v@recruitflow.ai", desc: "Manage candidates & parse resumes" },
    { role: "Hiring Manager" as UserRole, name: "Alex Chen", initials: "AC", email: "alex.c@recruitflow.ai", desc: "Approve offers & schedule interviews" },
    { role: "Interviewer" as UserRole, name: "Sophia Martinez", initials: "SM", email: "sophia.m@recruitflow.ai", desc: "Conduct evaluations & submit feedback" },
    { role: "Viewer" as UserRole, name: "Guest User", initials: "GU", email: "guest@recruitflow.ai", desc: "Read-only pipeline analytics dashboard" }
  ];

  const handleQuickLogin = (user: typeof mockUsers[0]) => {
    setSelectedRole(user.role);
    setEmail(user.email);
    setPassword("demo-pass-123");
    setLoading(true);

    // Simulate clean animation
    setTimeout(() => {
      loginUser(user.role);
    }, 800);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Find matching role from email, default to Admin
    const matched = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const role = matched ? matched.role : ("Admin" as UserRole);

    setTimeout(() => {
      loginUser(role);
    }, 800);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Geometric lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-stretch z-10"
      >
        {/* Left Side: Brand and Quick Profiles */}
        <div className="flex-1 flex flex-col justify-between space-y-6 lg:py-6">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-semibold text-brand-primary">
              <Sparkles size={13} className="animate-pulse" />
              RecruitFlow AI Gatekeeper
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Sign In to Your <br className="hidden lg:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-indigo-400 to-violet-400">
                Talent Pipeline
              </span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 max-w-sm leading-relaxed">
              Verify credentials or select an impersonation login card below to step into the workspaces.
            </p>
          </div>

          {/* Impersonation / Quick Login Profiles Grid */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center lg:text-left">
              Quick Profile Login Selector
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mockUsers.map((user) => (
                <button
                  key={user.role}
                  disabled={loading}
                  onClick={() => handleQuickLogin(user)}
                  className={`p-3 bg-white/5 hover:bg-white/10 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border border-white/5 dark:border-slate-850 hover:border-brand-primary/30 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 group/item disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.01] ${
                    selectedRole === user.role ? "border-brand-primary/80 bg-brand-primary/5" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-xs flex items-center justify-center shrink-0 group-hover/item:bg-brand-primary group-hover/item:text-white transition-colors">
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block group-hover/item:text-brand-primary transition-colors truncate">
                      {user.name}
                    </span>
                    <span className="text-[9px] text-slate-450 block truncate leading-normal">
                      {user.role} • {user.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Glassmorphic Form Container */}
        <div className="w-full lg:w-96 backdrop-blur-xl bg-white/5 dark:bg-slate-900/30 border border-white/10 dark:border-slate-800/40 shadow-2xl rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-brand-primary/15 border border-brand-primary/25 text-brand-primary flex items-center justify-center animate-spin">
                <RefreshCw size={20} />
              </div>
              <span className="text-xs font-bold text-slate-200 animate-pulse">
                Decrypting session token...
              </span>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1 text-center lg:text-left">
              <h2 className="text-lg font-bold text-white flex items-center gap-1.5 justify-center lg:justify-start">
                <ShieldCheck className="text-brand-primary" size={20} />
                Secure Portal
              </h2>
              <p className="text-[10px] text-slate-450">
                Authorized access logs are audited in real time
              </p>
            </div>

            <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedRole(null);
                    }}
                    placeholder="name@recruitflow.ai"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-850 hover:border-slate-700 focus:border-brand-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-300">Access Token / Password</label>
                  <a href="#" className="text-[10px] text-slate-450 hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/40 border border-slate-850 hover:border-slate-700 focus:border-brand-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-800 text-brand-primary focus:ring-brand-primary"
                  />
                  Remember active profile
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full text-xs font-semibold py-2.5 shadow-lg shadow-indigo-950/20">
                <KeyRound size={13} />
                Decrypt Secure Workspace
              </Button>
            </form>
          </div>

          <div className="text-[9px] text-slate-500 text-center pt-8 font-medium">
            Protected by RecruitFlow Guard AI. Unauthorized access attempts trigger strict IP calibration locks.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

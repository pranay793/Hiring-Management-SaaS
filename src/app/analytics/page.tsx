"use client";

import React, { useState, useEffect } from "react";
import { useHiring } from "@/context/hiring-context";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  UserCheck,
  Building,
  Target,
  Download,
  Calendar
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

export default function Analytics() {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("Q3 2026");

  useEffect(() => {
    setMounted(true);
  }, []);

  const departmentPerformance = [
    { name: "Engineering", timeToHire: 22, cost: 4800, target: 20 },
    { name: "AI & Research", timeToHire: 28, cost: 7200, target: 25 },
    { name: "Design", timeToHire: 14, cost: 3100, target: 15 },
    { name: "Product", timeToHire: 18, cost: 4200, target: 18 },
    { name: "Infrastructure", timeToHire: 12, cost: 2900, target: 15 }
  ];

  const recruiterWorkload = [
    { name: "Sarah Jenkins", activeCandidates: 28, interviews: 14, hires: 9 },
    { name: "Michael Vance", activeCandidates: 19, interviews: 8, hires: 5 },
    { name: "Emily Watson", activeCandidates: 12, interviews: 6, hires: 3 }
  ];

  const monthlyHiringCosts = [
    { month: "Jan", agency: 15000, referrals: 2000, linkedin: 3500 },
    { month: "Feb", agency: 12000, referrals: 4000, linkedin: 4500 },
    { month: "Mar", agency: 9000, referrals: 6000, linkedin: 4000 },
    { month: "Apr", agency: 8000, referrals: 9000, linkedin: 5500 },
    { month: "May", agency: 4000, referrals: 12000, linkedin: 5000 },
    { month: "Jun", agency: 2000, referrals: 15000, linkedin: 6500 },
    { month: "Jul", agency: 1500, referrals: 18000, linkedin: 7000 }
  ];

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Hiring Analytics & Reports
          </h1>
          <p className="text-xs text-muted">
            Monitor pipeline bottlenecks, recruitment budgets, and recruiter panel efficiency rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center gap-1.5 border border-border rounded-lg bg-card px-3 py-1.5 text-xs text-slate-600 dark:text-slate-350 cursor-pointer">
            <Calendar size={13} className="text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 font-semibold cursor-pointer"
            >
              <option value="July 2026">July 2026</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="H1 2026">H1 2026 (Last 6m)</option>
              <option value="Full Year 2026">Full Year 2026</option>
            </select>
          </div>

          <Button variant="secondary" size="sm" className="text-xs">
            <Download size={13} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted">Avg. Cost-per-Hire</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight tabular-nums">$4,120</span>
              <span className="text-[10px] text-brand-success font-semibold flex items-center gap-0.5">
                <TrendingUp size={10} /> -15.4%
              </span>
            </div>
            <p className="text-[10px] text-muted">AI referrals reduced agency spending</p>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 text-brand-success rounded-xl">
            <DollarSign size={20} />
          </div>
        </Card>

        <Card hoverable className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted">Time-to-Hire Avg.</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight tabular-nums">18.5 days</span>
              <span className="text-[10px] text-brand-success font-semibold flex items-center gap-0.5">
                <TrendingUp size={10} /> -4.2d
              </span>
            </div>
            <p className="text-[10px] text-muted">Industry standard: 26.5 days</p>
          </div>
          <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
            <Clock size={20} />
          </div>
        </Card>

        <Card hoverable className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted">Offer Acceptance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight tabular-nums">92.4%</span>
              <span className="text-[10px] text-brand-success font-semibold">Overperforming</span>
            </div>
            <p className="text-[10px] text-muted">Total hires this quarter: 17</p>
          </div>
          <div className="p-3 bg-violet-100 dark:bg-violet-900/20 text-brand-accent rounded-xl">
            <UserCheck size={20} />
          </div>
        </Card>

        <Card hoverable className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted">Target Pipeline Hit</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight tabular-nums">96.8%</span>
              <span className="text-[10px] text-brand-warning font-semibold">9.8/10 rating</span>
            </div>
            <p className="text-[10px] text-muted">Across all departments</p>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-brand-warning rounded-xl">
            <Target size={20} />
          </div>
        </Card>
      </div>

      {/* Main Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment cost by channel */}
        <Card className="lg:col-span-2 space-y-4 flex flex-col min-h-[350px]">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Sourcing Channel Cost Breakdown ($)
            </h2>
            <p className="text-[10px] text-muted">
              Visualizing reduction in agency dependency in favor of LinkedIn sourcing and AI referrals.
            </p>
          </div>

          <div className="flex-1 min-h-[220px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyHiringCosts} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="agency" stroke="#EF4444" strokeWidth={2.5} name="Agency Spend" />
                  <Line type="monotone" dataKey="referrals" stroke="#16A34A" strokeWidth={2.5} name="Internal Referrals" />
                  <Line type="monotone" dataKey="linkedin" stroke="#4251CC" strokeWidth={2.5} name="LinkedIn Campaigns" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-lg animate-pulse" />
            )}
          </div>
        </Card>

        {/* Recruiter efficiency comparison */}
        <Card className="space-y-4 flex flex-col min-h-[350px]">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Recruiter Performance Index
            </h2>
            <p className="text-[10px] text-muted">Sourced candidates and successful hires.</p>
          </div>

          <div className="flex-1 min-h-[220px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recruiterWorkload} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
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
                  <Bar dataKey="activeCandidates" fill="#CBD5E1" radius={[4, 4, 0, 0]} className="dark:fill-slate-800" name="Active" />
                  <Bar dataKey="hires" fill="#4251CC" radius={[4, 4, 0, 0]} name="Hires" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-lg animate-pulse" />
            )}
          </div>
        </Card>
      </div>

      {/* Department breakdown table */}
      <Card className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Department Performance Audit
          </h2>
          <p className="text-[10px] text-muted">
            Detailed breakdown of average Time-to-Hire and sourcing costs across business functions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-slate-600 dark:text-slate-350">
            <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-semibold text-muted tracking-wider uppercase border-b border-border">
              <tr>
                <th className="p-3">Department Name</th>
                <th className="p-3">Average Time-to-Hire</th>
                <th className="p-3">Target Time-to-Hire</th>
                <th className="p-3">Status vs. Target</th>
                <th className="p-3 text-right">Average Cost per Hire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-700 dark:text-slate-300">
              {departmentPerformance.map((dept) => {
                const diff = dept.timeToHire - dept.target;
                const onTrack = diff <= 0;
                return (
                  <tr key={dept.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-205">
                      {dept.name}
                    </td>
                    <td className="p-3 tabular-nums">{dept.timeToHire} days</td>
                    <td className="p-3 text-slate-400 tabular-nums">{dept.target} days</td>
                    <td className="p-3">
                      <Badge variant={onTrack ? "success" : "danger"}>
                        {onTrack ? "On Track" : `+${diff}d Delayed`}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-bold tabular-nums text-slate-805 dark:text-slate-200">
                      ${dept.cost.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

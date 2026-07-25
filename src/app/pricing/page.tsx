"use client";

import React, { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      description: "Ideal for early-stage startups setting up their first hiring processes.",
      price: { monthly: 49, annual: 39 },
      features: [
        "Up to 3 active job positions",
        "50 AI resume scans per month",
        "Standard Kanban pipeline board",
        "Google & Zoom meeting syncs",
        "Email support",
      ],
      cta: "Start Starter trial",
      popular: false,
    },
    {
      name: "Professional",
      description: "For scaling companies with dedicated recruitment pipelines.",
      price: { monthly: 119, annual: 95 },
      features: [
        "Unlimited active job positions",
        "500 AI resume scans per month",
        "AI custom interview question drafter",
        "Granular user permissions (5 roles)",
        "Slack & ATS webhooks integration",
        "Priority 24/7 support",
      ],
      cta: "Upgrade to Professional",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations demanding custom calibrations and analytics.",
      price: { monthly: 299, annual: 239 },
      features: [
        "Unlimited active job positions",
        "Unlimited AI resume scans",
        "Custom calibrated AI scoring models",
        "Full analytics auditor & CSV exporter",
        "Single Sign-On (SAML SSO)",
        "Dedicated Account Success Manager",
      ],
      cta: "Contact Enterprise Sales",
      popular: false,
    },
  ];

  const featureGroups = [
    {
      title: "Core ATS Features",
      items: [
        { name: "Active Positions", starter: "Up to 3", professional: "Unlimited", enterprise: "Unlimited" },
        { name: "Candidate Pipeline stages", starter: "Standard (8 stages)", professional: "Custom stages", enterprise: "Custom + automated events" },
        { name: "Schedules Syncs", starter: "Zoom & Google", professional: "Zoom, Google, MS Teams", enterprise: "Full panel APIs" },
      ],
    },
    {
      title: "AI Co-pilot Intelligence",
      items: [
        { name: "Monthly Resume Parsing", starter: "50 resumes", professional: "500 resumes", enterprise: "Unlimited" },
        { name: "Match Score Explanations", starter: "Basic", professional: "Detailed reports", enterprise: "Fully calibrated weights" },
        { name: "Interview Qs generator", starter: "No", professional: "Yes", enterprise: "Yes + feedback rating sheets" },
      ],
    },
    {
      title: "Security & Organization",
      items: [
        { name: "Granular Access Roles", starter: "Admin & Recruiter", professional: "5 default roles", enterprise: "Custom roles & permissions" },
        { name: "Workspace switcher", starter: "Single workspace", professional: "Multiple workspaces", enterprise: "Unlimited + cross-org auditing" },
        { name: "Single Sign-On (SSO)", starter: "No", professional: "No", enterprise: "SAML SSO" },
      ],
    },
  ];

  return (
    <div className="space-y-10 text-xs sm:text-sm">
      {/* Header section with monthly/yearly switcher */}
      <div className="text-center space-y-4 max-w-xl mx-auto py-4">
        <Badge variant="primary" className="px-3 py-1 font-semibold uppercase tracking-wider">
          Flexible Pricing Tiers
        </Badge>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Calibrated Plans for Teams of All Sizes
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          Scale your hiring pipelines with AI. Save 20% when choosing annual billing plans.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-slate-850 dark:text-slate-205" : "text-slate-400"}`}>
            Monthly
          </span>
          
          <button
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
            className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors relative cursor-pointer"
          >
            <motion.div
              layout
              className="w-4 h-4 bg-brand-primary rounded-full"
              animate={{ x: billingPeriod === "annual" ? 16 : 0 }}
            />
          </button>

          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-slate-850 dark:text-slate-205" : "text-slate-450"}`}>
            Yearly
            <span className="px-1.5 py-0.5 bg-brand-success/15 text-brand-success rounded text-[9px] font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const priceVal = billingPeriod === "annual" ? plan.price.annual : plan.price.monthly;

          return (
            <Card
              key={plan.name}
              className={`p-6 flex flex-col relative ${
                plan.popular ? "border-brand-primary shadow-md ring-2 ring-brand-primary/10" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-brand-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-1.5 mb-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">
                  {plan.name}
                </h3>
                <p className="text-[10px] text-muted leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>
              </div>

              {/* Price row */}
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
                  ${priceVal}
                </span>
                <span className="text-xs text-slate-400">
                  /user/month
                </span>
              </div>

              {/* Action Button */}
              <Button
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full text-xs py-2 mb-6"
              >
                {plan.cta}
              </Button>

              {/* Features list */}
              <div className="space-y-3.5 mt-auto">
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-350 uppercase tracking-wider block">
                  Features Included:
                </span>
                <ul className="space-y-2.5 text-[10px] text-slate-500">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check size={12} className="text-brand-success shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pricing Comparison Table Grid */}
      <div className="max-w-5xl mx-auto pt-6 border-t border-border">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
          Compare Features In Detail
        </h2>

        <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-slate-500 text-xs">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 font-bold text-slate-750 dark:text-slate-300 border-b border-border">
                  <th className="p-4 w-1/3">Core Features</th>
                  <th className="p-4 w-1/6 text-center">Starter</th>
                  <th className="p-4 w-1/6 text-center">Professional</th>
                  <th className="p-4 w-1/6 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {featureGroups.map((group) => (
                  <React.Fragment key={group.title}>
                    <tr className="bg-slate-50/20 dark:bg-slate-900/10 font-semibold text-slate-800 dark:text-slate-205 border-b border-border">
                      <td colSpan={4} className="p-3 text-[10px] uppercase tracking-wider">
                        {group.title}
                      </td>
                    </tr>
                    {group.items.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                          {item.name}
                        </td>
                        <td className="p-3.5 text-center font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {item.starter}
                        </td>
                        <td className="p-3.5 text-center font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {item.professional}
                        </td>
                        <td className="p-3.5 text-center font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {item.enterprise}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

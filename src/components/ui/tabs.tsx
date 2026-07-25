"use client";

import React from "react";
import { motion } from "framer-motion";

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex border-b border-border space-x-6 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative py-3 text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
              isActive
                ? "text-brand-primary"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="active-tab-line"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

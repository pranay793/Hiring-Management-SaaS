"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import OnboardingModal from "../onboarding/onboarding-modal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Trigger onboarding on first-ever load
  useEffect(() => {
    const hasVisited = localStorage.getItem("recruitflow_has_visited");
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem("recruitflow_has_visited", "true");
    }
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Collapsible Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Right Column Layout */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Persistent Top Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        
        {/* Dynamic Inner Main Content Body */}
        <main className="flex-1 overflow-y-auto bg-background/50 dark:bg-background/20 relative">
          <div className="px-4 py-6 md:px-8 max-w-7xl w-full mx-auto pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* Onboarding Welcome Setup Wizards */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

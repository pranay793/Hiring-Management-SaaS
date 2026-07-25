"use client";

import React, { useState } from "react";
import { useHiring, Interview, Candidate, UserRole } from "@/context/hiring-context";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Video,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Users,
  Trash2,
  X,
  MapPin,
  Laptop
} from "lucide-react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

export default function InterviewCalendar() {
  const {
    candidates,
    interviews,
    scheduleInterview,
    cancelInterview,
    userRole
  } = useHiring();

  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Form state
  const [candId, setCandId] = useState("");
  const [dateVal, setDateVal] = useState("2026-07-23");
  const [timeVal, setTimeVal] = useState("10:00 AM");
  const [meetingType, setMeetingType] = useState<"Zoom" | "Google Meet" | "MS Teams" | "In-Person">("Zoom");
  const [selectedPanel, setSelectedPanel] = useState<string[]>([]);

  const interviewers = [
    "Alex Chen (Tech Lead)",
    "Sarah Jenkins (Recruiter)",
    "Dr. Sarah Peterson (Director of AI)",
    "Michael Vance (Recruiter)",
    "Jane Doe (Staff Frontend)"
  ];

  // Grid dates July 2026 (Month starts on Wednesday)
  const daysInJuly = 31;
  const startDayOffset = 3; // Wednesday offset for grid empty boxes
  const calendarCells: (number | null)[] = [
    ...Array(startDayOffset).fill(null),
    ...Array.from({ length: daysInJuly }, (_, i) => i + 1)
  ];

  const handleSelectPanel = (name: string) => {
    setSelectedPanel((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candId) return;

    const candObj = candidates.find((c) => c.id === candId);
    if (!candObj) return;

    const mockLink =
      meetingType === "Zoom" ? "https://zoom.us/j/9876543210" :
      meetingType === "Google Meet" ? "https://meet.google.com/abc-defg-hij" :
      meetingType === "MS Teams" ? "https://teams.microsoft.com/l/meetup-join" : "Conference Room A";

    scheduleInterview({
      candidateId: candId,
      candidateName: candObj.name,
      role: candObj.role,
      panel: selectedPanel.length > 0 ? selectedPanel : ["Sarah Jenkins (Recruiter)"],
      date: dateVal,
      time: timeVal,
      type: meetingType,
      link: mockLink
    });

    // Reset Form
    setCandId("");
    setSelectedPanel([]);
    setShowScheduleModal(false);
  };

  const getInterviewsForDay = (dayNum: number) => {
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const searchDate = `2026-07-${formattedDay}`;
    return interviews.filter((i) => i.date === searchDate);
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Interview Scheduler
          </h1>
          <p className="text-xs text-muted">
            Coordinate interviewer panels, set video room integrations, and check availability profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Views Toggles */}
          <div className="flex border border-border bg-card rounded-lg overflow-hidden text-xs font-semibold">
            {(["month", "week", "day"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`px-3 py-1.5 capitalize cursor-pointer border-r border-border last:border-r-0 transition-colors ${
                  calendarView === view
                    ? "bg-slate-100 dark:bg-slate-800 text-brand-primary font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {userRole !== "Viewer" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowScheduleModal(true)}
              className="text-xs cursor-pointer"
            >
              <Plus size={14} />
              Schedule Interview
            </Button>
          )}
        </div>
      </div>

      {/* RENDER MONTH VIEW */}
      {calendarView === "month" && (
        <Card className="p-4 space-y-4">
          {/* Calendar visual controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              July 2026
            </span>
            <div className="flex gap-1.5">
              <button className="p-1 border border-border rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <button className="p-1 border border-border rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-semibold text-muted tracking-wider uppercase border-b border-border pb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid Blocks */}
          <div className="grid grid-cols-7 gap-2 h-[450px]">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="bg-slate-50/20 dark:bg-slate-900/10 border border-border/40 rounded-lg"
                  />
                );
              }

              const dayInterviews = getInterviewsForDay(day);
              const isToday = day === 22; // Let's set 22 as active day for demonstration

              return (
                <div
                  key={`day-${day}`}
                  className={`border rounded-lg p-2 flex flex-col gap-1 overflow-hidden transition-all bg-card ${
                    isToday
                      ? "border-brand-primary ring-2 ring-brand-primary/10 shadow-2xs"
                      : "border-border"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center tabular-nums ${
                      isToday
                        ? "bg-brand-primary text-white"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {day}
                  </span>

                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                    {dayInterviews.map((int) => (
                      <div
                        key={int.id}
                        className="p-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/15 rounded text-[9px] font-medium leading-tight truncate relative group"
                        title={`${int.candidateName} - ${int.time}`}
                      >
                        <span className="font-bold block truncate">{int.candidateName}</span>
                        <span className="text-slate-400 block truncate">{int.time}</span>
                        
                        {/* Instant delete tool */}
                        {userRole !== "Viewer" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelInterview(int.id);
                            }}
                            className="absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-100 p-0.5 bg-red-950 text-red-400 hover:text-red-300 rounded cursor-pointer transition-opacity"
                          >
                            <Trash2 size={8} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* RENDER WEEK VIEW */}
      {calendarView === "week" && (
        <Card className="p-4 space-y-4">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            July 20 - July 26, 2026
          </div>

          <div className="grid grid-cols-7 gap-3 min-h-[300px]">
            {[20, 21, 22, 23, 24, 25, 26].map((day) => {
              const dayInterviews = getInterviewsForDay(day);
              const isToday = day === 22;

              return (
                <div
                  key={day}
                  className={`border rounded-xl p-3 flex flex-col min-h-[250px] bg-card ${
                    isToday ? "border-brand-primary ring-2 ring-brand-primary/10" : "border-border"
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-border pb-1.5 mb-2.5">
                    <span className="text-[10px] font-semibold text-muted uppercase">
                      {day === 20 ? "Mon" : day === 21 ? "Tue" : day === 22 ? "Wed" : day === 23 ? "Thu" : day === 24 ? "Fri" : day === 25 ? "Sat" : "Sun"}
                    </span>
                    <span className={`text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center tabular-nums ${
                      isToday ? "bg-brand-primary text-white" : "text-slate-650 dark:text-slate-350"
                    }`}>
                      {day}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5">
                    {dayInterviews.map((int) => (
                      <div
                        key={int.id}
                        className="p-2.5 bg-brand-primary/5 dark:bg-brand-primary/5 border border-brand-primary/10 rounded-xl space-y-1.5 relative group text-[10px]"
                      >
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {int.candidateName}
                          </h3>
                          <span className="text-[9px] text-slate-400 block truncate">{int.role}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[9px] text-brand-primary font-bold">
                          <Clock size={10} />
                          <span className="tabular-nums">{int.time}</span>
                        </div>

                        {userRole !== "Viewer" && (
                          <button
                            onClick={() => cancelInterview(int.id)}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 bg-red-950 text-red-400 hover:text-red-300 rounded cursor-pointer transition-opacity"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}

                    {dayInterviews.length === 0 && (
                      <div className="text-center text-[10px] text-muted py-12">No events</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* RENDER DAY VIEW */}
      {calendarView === "day" && (
        <Card className="p-4 space-y-4">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Wednesday, July 22, 2026 (Today)
          </div>

          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card text-xs">
            {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((hour) => {
              // Find matching interview scheduled for today at this hour
              const matches = interviews.filter((i) => i.date === "2026-07-22" && i.time.startsWith(hour.slice(0, 5)));
              return (
                <div key={hour} className="flex min-h-[60px] items-stretch">
                  <div className="w-24 p-3 bg-slate-50/50 dark:bg-slate-900/10 text-slate-400 font-semibold tabular-nums border-r border-border flex items-center justify-center shrink-0">
                    {hour}
                  </div>
                  
                  <div className="flex-1 p-3 flex items-center gap-3">
                    {matches.map((int) => (
                      <div
                        key={int.id}
                        className="px-4 py-2.5 bg-brand-primary/5 dark:bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-center justify-between gap-6 flex-1 max-w-xl group relative"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                            {int.candidateName} &mdash; Technical Panel
                          </span>
                          <span className="text-[10px] text-slate-400 block">{int.role}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Users size={12} />
                            <span>{int.panel.length} panel members</span>
                          </div>
                          
                          <a
                            href={int.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-brand-primary text-white text-[10px] font-bold rounded hover:bg-brand-accent transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Video size={11} />
                            Join {int.type}
                          </a>
                        </div>

                        {userRole !== "Viewer" && (
                          <button
                            onClick={() => cancelInterview(int.id)}
                            className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-950 text-red-400 hover:text-red-300 border border-red-900 rounded-lg cursor-pointer transition-opacity z-10"
                            title="Cancel Interview Session"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}

                    {matches.length === 0 && (
                      <span className="text-slate-400 text-[10px]">No appointments slotted</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Scheduler Modal Popup Dialog */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-205">
                Schedule Candidate Interview Board
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                X
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs">
              {/* Select candidate */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-350">
                  Select Candidate
                </label>
                <select
                  required
                  value={candId}
                  onChange={(e) => setCandId(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-800 dark:text-slate-200 text-xs cursor-pointer"
                >
                  <option value="" disabled>-- Choose Candidate --</option>
                  {candidates
                    .filter((c) => c.status !== "Rejected" && c.status !== "Hired")
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dateVal}
                    onChange={(e) => setDateVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-850 dark:text-slate-100 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-350">
                    Start Time Slot
                  </label>
                  <select
                    value={timeVal}
                    onChange={(e) => setTimeVal(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-700 dark:text-slate-205 text-xs cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Platform */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-350">
                  Meeting Location / Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Zoom", "Google Meet", "MS Teams", "In-Person"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMeetingType(type as any)}
                      className={`py-2 text-[10px] font-semibold rounded-lg border text-center cursor-pointer transition-colors ${
                        meetingType === type
                          ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                          : "border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Panel members (checkbox tag list) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-350">
                  Select Interview Panel Board
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl space-y-1.5 max-h-36 overflow-y-auto">
                  {interviewers.map((name) => {
                    const isChecked = selectedPanel.includes(name);
                    return (
                      <label
                        key={name}
                        className="flex items-center gap-2 text-slate-650 dark:text-slate-350 cursor-pointer hover:text-slate-900 dark:hover:text-slate-205"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectPanel(name)}
                          className="w-3.5 h-3.5 rounded border-border text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        <span>{name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="text-xs">
                  Schedule Event
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

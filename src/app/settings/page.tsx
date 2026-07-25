"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useHiring, UserRole } from "@/context/hiring-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Building,
  Key,
  Copy,
  Plus,
  Trash2,
  Mail,
  UserPlus,
  Sliders,
  Send,
  MessageSquare,
  Users,
  CheckCircle,
  Eye
} from "lucide-react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Tabs from "@/components/ui/tabs";

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    currentOrg,
    updateOrgName,
    userRole,
    updateUserRole,
    logs
  } = useHiring();

  // Settings Sub-tab controller
  const activeParamTab = searchParams.get("tab") || "organization";
  const [activeSubTab, setActiveSubTab] = useState(activeParamTab);

  useEffect(() => {
    setActiveSubTab(activeParamTab);
  }, [activeParamTab]);

  const handleSubTabChange = (id: string) => {
    setActiveSubTab(id);
    router.push(`/settings?tab=${id}`);
  };

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: "key-1", name: "Production Webhook", key: "rf_live_7a3d90f23d8c11e6b", created: "2026-06-15" },
    { id: "key-2", name: "Greenhouse Sync Tool", key: "rf_live_19ba820fc338e910e", created: "2026-07-02" }
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Invite Members state
  const [invitedEmail, setInvitedEmail] = useState("");
  const [invitedRole, setInvitedRole] = useState("Recruiter");
  const [teamList, setTeamList] = useState([
    { id: "tm-1", email: "sarah.j@vercel.com", role: "Admin", name: "Sarah Jenkins", status: "Active" },
    { id: "tm-2", email: "michael.v@vercel.com", role: "Recruiter", name: "Michael Vance", status: "Active" },
    { id: "tm-3", email: "alex.chen@vercel.com", role: "Hiring Manager", name: "Alex Chen", status: "Active" }
  ]);

  // Messages Inbox State
  const [selectedMessageId, setSelectedMessageId] = useState<string>("msg-1");
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      candidate: "Jane Doe",
      subject: "Confirmation of Technical Panel interview details",
      preview: "Looking forward to speaking with the design team tomorrow.",
      date: "10 mins ago",
      read: false,
      chat: [
        { sender: "Jane Doe", text: "Hello Sarah, I received the Zoom link. Looking forward to speaking with the design team tomorrow at 10:00 AM.", time: "09:30 AM" },
        { sender: "RecruitFlow AI", text: "Auto-reply: Confirmation sent. If you have any problems launching the link, contact recruiter@company.com.", time: "09:31 AM" }
      ]
    },
    {
      id: "msg-2",
      candidate: "Alex Chen",
      subject: "Quantization models reference links",
      preview: "Here are the workshop papers I mentioned in my screening call.",
      date: "3 hours ago",
      read: true,
      chat: [
        { sender: "Alex Chen", text: "Here are the workshop papers I mentioned in my screening call. Specifically checkout page 4 on context length.", time: "11:15 AM" }
      ]
    },
    {
      id: "msg-3",
      candidate: "Sophia Martinez",
      subject: "Offer letter signed contract",
      preview: "Thrilled to accept the role! Sending over my details.",
      date: "Yesterday",
      read: true,
      chat: [
        { sender: "Sophia Martinez", text: "Thrilled to accept the role! Sending over my signed contract details. Looking forward to the onboarding steps.", time: "Yesterday, 3:15 PM" }
      ]
    }
  ]);
  const [replyText, setReplyText] = useState("");

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName || userRole === "Viewer") return;
    
    const randomHash = Math.random().toString(16).substring(2, 18);
    const newKeyObj = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `rf_live_${randomHash}`,
      created: new Date().toISOString().split("T")[0]
    };
    
    setApiKeys((prev) => [newKeyObj, ...prev]);
    setNewKeyName("");
  };

  const handleDeleteKey = (id: string) => {
    if (userRole === "Viewer") return;
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedEmail || userRole === "Viewer") return;
    
    const nameStr = invitedEmail.split("@")[0].replace(".", " ");
    const newMember = {
      id: `tm-${Date.now()}`,
      email: invitedEmail,
      role: invitedRole,
      name: nameStr.split(" ").map((w) => w[0].toUpperCase() + w.substring(1)).join(" "),
      status: "Invited"
    };

    setTeamList((prev) => [...prev, newMember]);
    setInvitedEmail("");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === selectedMessageId) {
          return {
            ...m,
            chat: [
              ...m.chat,
              { sender: "Sarah Jenkins (You)", text: replyText, time: "Just now" }
            ]
          };
        }
        return m;
      })
    );
    setReplyText("");
  };

  const activeChatInfo = messages.find((m) => m.id === selectedMessageId);

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <SettingsIcon size={20} />
          Settings Panel
        </h1>
        <p className="text-xs text-muted">
          Adjust pipeline automation variables, generate developer API tokens, impersonate permission roles, and manage team communication.
        </p>
      </div>

      {/* Main Settings Tabs */}
      <Tabs
        tabs={[
          { id: "organization", label: "Organization" },
          { id: "team", label: "Hiring Committee" },
          { id: "roles", label: "Roles & Access Matrix" },
          { id: "api", label: "Developer APIs" },
          { id: "messages", label: "Inbox Messages" }
        ]}
        activeTab={activeSubTab}
        onChange={handleSubTabChange}
      />

      {/* TABS CONTAINER CONTROLLER */}
      <div className="pt-2">
        
        {/* TAB 1: Organization settings */}
        {activeSubTab === "organization" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 space-y-4">
              <h2 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                Profile Configuration
              </h2>
              
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                    Active Company Workspace Name
                  </label>
                  <input
                    type="text"
                    value={currentOrg}
                    onChange={(e) => updateOrgName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-slate-805 dark:text-slate-100"
                    disabled={userRole === "Viewer"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                      Recruitment Contact Email
                    </label>
                    <input
                      type="text"
                      defaultValue="recruiter@vercel.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-805 dark:text-slate-100"
                      disabled={userRole === "Viewer" || userRole === "Interviewer"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                      Standard Career Portal URL
                    </label>
                    <input
                      type="text"
                      defaultValue="careers.recruitflow.ai/vercel"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-805 dark:text-slate-100"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="space-y-3">
              <h2 className="text-xs font-bold text-slate-850 dark:text-slate-202 uppercase tracking-wider">
                Impersonate Current Role
              </h2>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Change your active identity role block to inspect how granular access matrices hide fields and override delete capability.
              </p>
              
              <div className="space-y-1.5 pt-2">
                {["Admin", "Recruiter", "Hiring Manager", "Interviewer", "Viewer"].map((role) => (
                  <button
                    key={role}
                    onClick={() => updateUserRole(role as UserRole)}
                    className={`flex items-center justify-between w-full p-2.5 rounded-lg border text-left transition-colors cursor-pointer text-xs ${
                      userRole === role
                        ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-bold"
                        : "border-border hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span>{role}</span>
                    {userRole === role && <ShieldCheck size={14} />}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: Hiring Committee directory */}
        {activeSubTab === "team" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 space-y-4">
              <h2 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-2">
                Active Committee Members
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-semibold text-muted uppercase border-b border-border">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Assigned Role</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-slate-700 dark:text-slate-350">
                    {teamList.map((tm) => (
                      <tr key={tm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-205">
                          {tm.name}
                        </td>
                        <td className="p-3">{tm.email}</td>
                        <td className="p-3">
                          <Badge variant="primary">{tm.role}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={tm.status === "Active" ? "success" : "neutral"}>
                            {tm.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                Invite Recruiter Board Member
              </h2>
              
              <form onSubmit={handleInviteMember} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-350">
                    Invitation Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={invitedEmail}
                    onChange={(e) => setInvitedEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-slate-800 dark:text-slate-100"
                    placeholder="partner@vercel.com"
                    disabled={userRole === "Viewer" || userRole === "Interviewer"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-350">
                    Assigned access role
                  </label>
                  <select
                    value={invitedRole}
                    onChange={(e) => setInvitedRole(e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
                    disabled={userRole === "Viewer" || userRole === "Interviewer"}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="Interviewer">Interviewer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-xs"
                  disabled={userRole === "Viewer" || userRole === "Interviewer"}
                >
                  <UserPlus size={14} />
                  Send Invitation Code
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* TAB 3: Roles access permission grid */}
        {activeSubTab === "roles" && (
          <Card className="space-y-4">
            <h2 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
              Roles & Permissions Access Matrix
            </h2>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Standard policies indicating candidate edit caps, interview schedule deletes and billing configuration access.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-slate-500 text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 border-b border-border font-bold">
                    <th className="p-3 w-1/3">System Feature Capability</th>
                    <th className="p-3 text-center">Admin</th>
                    <th className="p-3 text-center">Recruiter</th>
                    <th className="p-3 text-center">Hiring Mgr</th>
                    <th className="p-3 text-center">Interviewer</th>
                    <th className="p-3 text-center">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-650 dark:text-slate-350">
                  {[
                    { cap: "Create Job Openings / Edit settings", adm: "Yes", rec: "Yes", hm: "Yes", int: "No", viw: "No" },
                    { cap: "Upload Resume & NLP scoring scans", adm: "Yes", rec: "Yes", hm: "Yes", int: "No", viw: "No" },
                    { cap: "Edit / Advance Candidate pipeline", adm: "Yes", rec: "Yes", hm: "Yes", int: "Yes (only scorecards)", viw: "No" },
                    { cap: "Delete Candidates profile database", adm: "Yes", rec: "Yes", hm: "No", int: "No", viw: "No" },
                    { cap: "Generate API Webhook developer keys", adm: "Yes", rec: "No", hm: "No", int: "No", viw: "No" },
                    { cap: "Audit system bills & pricing scales", adm: "Yes", rec: "No", hm: "No", int: "No", viw: "No" }
                  ].map((row) => (
                    <tr key={row.cap} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-300">
                        {row.cap}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-200">{row.adm}</td>
                      <td className="p-3 text-center text-slate-700 dark:text-slate-300">{row.rec}</td>
                      <td className="p-3 text-center text-slate-700 dark:text-slate-300">{row.hm}</td>
                      <td className="p-3 text-center text-slate-700 dark:text-slate-300">{row.int}</td>
                      <td className="p-3 text-center text-slate-700 dark:text-slate-300">{row.viw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 4: API integrations developer view */}
        {activeSubTab === "api" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 space-y-4">
              <h2 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-2">
                Active API Keys
              </h2>

              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="p-3 bg-slate-50/50 dark:bg-slate-900 border border-border rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
                        {key.name}
                      </span>
                      <code className="text-[10px] text-brand-primary block select-all font-mono truncate">
                        {key.key}
                      </code>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyKey(key.key, key.id)}
                        className="p-1.5 border border-border rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
                        title="Copy Key to Clipboard"
                      >
                        {copiedKeyId === key.id ? (
                          <span className="text-[9px] text-brand-success font-bold px-1">Copied</span>
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      
                      {userRole === "Admin" && (
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="p-1.5 border border-border rounded-md hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                          title="Revoke Token"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="text-xs font-bold text-slate-850 dark:text-slate-202 uppercase tracking-wider">
                Generate API Access Key
              </h2>
              
              <form onSubmit={handleGenerateKey} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-350">
                    Application / Integration Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-slate-800 dark:text-slate-100"
                    placeholder="e.g. Ashby Sync Agent"
                    disabled={userRole !== "Admin"}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-xs"
                  disabled={userRole !== "Admin"}
                >
                  <Key size={14} />
                  Generate Token Key
                </Button>
                
                {userRole !== "Admin" && (
                  <p className="text-[10px] text-brand-danger font-semibold">
                    * Generating API tokens is restricted to Admin role.
                  </p>
                )}
              </form>
            </Card>
          </div>
        )}

        {/* TAB 5: Messaging Inbox panel */}
        {activeSubTab === "messages" && (
          <Card className="p-0 overflow-hidden border border-border flex h-[480px]">
            {/* Sidebar list inbox */}
            <div className="w-1/3 border-r border-border flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/10">
              <div className="p-3 border-b border-border font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Mail size={14} className="text-brand-primary" />
                <span>Conversations</span>
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {messages.map((m) => {
                  const active = selectedMessageId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMessageId(m.id)}
                      className={`w-full text-left p-3.5 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex flex-col gap-1 cursor-pointer ${
                        active ? "bg-slate-100 dark:bg-slate-850" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {m.candidate}
                        </span>
                        <span className="text-[8px] text-slate-400">{m.date}</span>
                      </div>
                      
                      <span className="font-semibold text-slate-650 dark:text-slate-350 truncate w-full text-[10px]">
                        {m.subject}
                      </span>
                      
                      <span className="text-muted text-[10px] truncate w-full">
                        {m.preview}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation detail chat pane */}
            <div className="flex-1 flex flex-col h-full bg-card">
              {activeChatInfo ? (
                <>
                  {/* Chat Pane Header */}
                  <div className="p-3 border-b border-border flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/10">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {activeChatInfo.candidate}
                      </span>
                      <span className="text-[10px] text-muted">{activeChatInfo.subject}</span>
                    </div>
                  </div>

                  {/* Chat log messages list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col">
                    {activeChatInfo.chat.map((c, idx) => {
                      const isMe = c.sender.includes("You") || c.sender.includes("AI");
                      return (
                        <div
                          key={idx}
                          className={`max-w-[75%] p-3 rounded-2xl flex flex-col gap-1 text-[11px] leading-relaxed ${
                            isMe
                              ? "bg-brand-primary text-white self-end rounded-tr-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-750 dark:text-slate-300 self-start rounded-tl-xs"
                          }`}
                        >
                          <span className={`text-[8px] font-bold ${isMe ? "text-slate-200" : "text-brand-primary"}`}>
                            {c.sender}
                          </span>
                          <span>{c.text}</span>
                          <span className={`text-[7px] text-right mt-0.5 ${isMe ? "text-slate-300" : "text-slate-400"}`}>
                            {c.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chat reply composer footer */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 border-t border-border flex gap-2 items-center bg-slate-50/30 dark:bg-slate-900/10"
                  >
                    <input
                      type="text"
                      placeholder="Compose response and tap enter..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus:outline-none focus:border-brand-primary text-slate-800 dark:text-slate-100"
                    />
                    
                    <button
                      type="submit"
                      className="p-2 bg-brand-primary text-white hover:bg-brand-accent rounded-xl transition-colors cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center text-slate-400 p-8">
                  <MessageSquare size={24} className="mb-2" />
                  <span>Select a conversation thread to view replies</span>
                </div>
              )}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted">Loading Settings...</div>}>
      <SettingsContent />
    </React.Suspense>
  );
}

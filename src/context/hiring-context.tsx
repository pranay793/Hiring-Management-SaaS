"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type PipelineStage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Technical Round"
  | "HR Round"
  | "Offer"
  | "Hired"
  | "Rejected";

export type UserRole = "Admin" | "Recruiter" | "Hiring Manager" | "Interviewer" | "Viewer";

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  experience: number; // in years
  resumeScore: number; // 0-100
  aiMatch: number; // 0-100
  status: PipelineStage;
  recruiter: string;
  interviewDate: string | null;
  email: string;
  phone: string;
  skills: string[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  cultureFit: string;
  risks: string[];
  recommendation: "Strong Hire" | "Hire" | "No Hire" | "Strong No Hire";
  interviewQuestions: string[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Contract" | "Remote" | "Hybrid";
  status: "Open" | "Closed" | "Draft";
  applicantsCount: number;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  role: string;
  panel: string[];
  date: string;
  time: string;
  type: "Zoom" | "Google Meet" | "MS Teams" | "In-Person";
  link: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
}

interface HiringContextType {
  candidates: Candidate[];
  jobs: Job[];
  interviews: Interview[];
  logs: ActivityLog[];
  userRole: UserRole;
  currentOrg: string;
  updateCandidateStatus: (id: string, status: PipelineStage) => void;
  deleteCandidate: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, "id">) => void;
  scheduleInterview: (interview: Omit<Interview, "id">) => void;
  cancelInterview: (id: string) => void;
  addJob: (job: Omit<Job, "id" | "applicantsCount">) => void;
  updateUserRole: (role: UserRole) => void;
  updateOrgName: (name: string) => void;
  isAuthenticated: boolean;
  loginUser: (role: UserRole) => void;
  logoutUser: () => void;
}

const HiringContext = createContext<HiringContextType | undefined>(undefined);

const initialCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Jane Doe",
    avatar: "JD",
    role: "Senior React Engineer",
    experience: 8,
    resumeScore: 94,
    aiMatch: 96,
    status: "Technical Round",
    recruiter: "Sarah Jenkins",
    interviewDate: "2026-07-23T10:00:00",
    email: "jane.doe@example.com",
    phone: "+1 (555) 019-2834",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux Toolkit", "GraphQL"],
    summary: "Highly skilled React architect with a proven track record of optimizing page speeds and scaling large component systems at scale-up tech firms. Excellent communication skills and strong culture fit.",
    strengths: [
      "Advanced Next.js App Router performance tuning",
      "Excellent communication and mentorship track record",
      "Strict unit & integration test coverage (Jest, Cypress)"
    ],
    weaknesses: [
      "Limited direct experience with AWS deployments",
      "Mainly worked in startup environments rather than enterprise scale"
    ],
    cultureFit: "Collaborative, feedback-driven, value transparency and rapid iteration. Aligns perfectly with standard startup growth culture.",
    risks: ["Has competing offers from Stripe and Linear. Might require high compensation package."],
    recommendation: "Strong Hire",
    interviewQuestions: [
      "How do you approach layout optimization and state dehydration in Next.js Server Components?",
      "Describe a scenario where you had to refactor a complex context provider to prevent rendering bottlenecks.",
      "How do you manage complex CSS layout changes inside responsive containers without layout shifts?"
    ]
  },
  {
    id: "cand-2",
    name: "Alex Chen",
    avatar: "AC",
    role: "AI Research Scientist",
    experience: 5,
    resumeScore: 89,
    aiMatch: 91,
    status: "Screening",
    recruiter: "Sarah Jenkins",
    interviewDate: "2026-07-22T14:30:00",
    email: "alex.chen@example.ai",
    phone: "+1 (555) 014-9988",
    skills: ["Python", "PyTorch", "Transformers", "LLMs", "LangChain", "VectorDBs"],
    summary: "Machine learning research engineer focused on optimization of large language models and multi-agent systems. Published author in NeurIPS workshop.",
    strengths: [
      "Expert knowledge of attention mechanics and model quantization",
      "Familiar with embedding database scaling",
      "Strong background in mathematical theory"
    ],
    weaknesses: [
      "Less frontend framework exposure (basic HTML/JS)",
      "Prefers research over product engineering tasks"
    ],
    cultureFit: "Quiet, deep-focus style, highly analytical. Works well in collaborative research pods.",
    risks: ["Prefers working autonomously, might require active management alignment in cross-functional squads."],
    recommendation: "Hire",
    interviewQuestions: [
      "What is your strategy for optimizing context window lengths under resource constraints?",
      "Explain the performance tradeoffs between GPTQ and AWQ quantization formats."
    ]
  },
  {
    id: "cand-3",
    name: "Sophia Martinez",
    avatar: "SM",
    role: "Lead Product Designer",
    experience: 10,
    resumeScore: 97,
    aiMatch: 95,
    status: "Interview",
    recruiter: "Sarah Jenkins",
    interviewDate: "2026-07-24T11:00:00",
    email: "sophia.design@example.com",
    phone: "+1 (555) 012-4455",
    skills: ["Figma", "Design Systems", "Prototyping", "UI/UX Research", "Framer", "CSS"],
    summary: "Senior design practitioner specializing in developer tool dashboards and visual consistency. Ex-Stripe designer with experience establishing core design systems.",
    strengths: [
      "Flawless visual hierarchy and typographic control",
      "Strong coding literacy, knows HTML, CSS, and basic React",
      "Conducted extensive usability testing with enterprise customers"
    ],
    weaknesses: [
      "Extremely detailed planner, sometimes takes longer to ship first drafts",
      "Has not managed full design departments yet"
    ],
    cultureFit: "Design excellence champion, loves mentoring. High alignment with high-quality visual outputs.",
    risks: ["Demands high design agency, could clash with feature-factory mindset product teams."],
    recommendation: "Strong Hire",
    interviewQuestions: [
      "Show us how you design a modular navigation panel that remains accessible for keyboard navigators.",
      "How do you evaluate which micro-interactions add value versus which add bloat?"
    ]
  },
  {
    id: "cand-4",
    name: "Marcus Vance",
    avatar: "MV",
    role: "Backend Architect",
    experience: 12,
    resumeScore: 92,
    aiMatch: 88,
    status: "Applied",
    recruiter: "Michael Vance",
    interviewDate: null,
    email: "marcus.v@example.net",
    phone: "+1 (555) 017-7711",
    skills: ["Go", "Kubernetes", "PostgreSQL", "Kafka", "AWS", "gRPC"],
    summary: "Systems architect experienced in building microservices handling 100k+ req/sec. Deep expertise in distributed locks and read-heavy DB replication.",
    strengths: [
      "Deep understanding of distributed consensus protocols",
      "Led migration of monoliths into containerized microservices",
      "Database schema tuning expert"
    ],
    weaknesses: [
      "Can be direct or blunt during technical feedback",
      "Resistant to adopting client-side framework utilities"
    ],
    cultureFit: "Pragmatic, execution-focused. Enjoys debugging production incidents and scaling infrastructure.",
    risks: ["Risk of creating overly complex architectures for simple requirements."],
    recommendation: "Hire",
    interviewQuestions: [
      "Explain how you resolve split-brain scenarios in a distributed Redis replication configuration.",
      "What is your approach to handling database migrations under high traffic?"
    ]
  },
  {
    id: "cand-5",
    name: "Emily Watson",
    avatar: "EW",
    role: "Senior React Engineer",
    experience: 6,
    resumeScore: 82,
    aiMatch: 84,
    status: "Applied",
    recruiter: "Sarah Jenkins",
    interviewDate: null,
    email: "emily.watson@gmail.com",
    phone: "+1 (555) 013-1122",
    skills: ["React", "JavaScript", "HTML5", "Sass", "Webpack", "Tailwind CSS"],
    summary: "Frontend engineer with focus on standard user-facing features and marketing pages. Highly reliable and consistent coder.",
    strengths: [
      "Rapid UI prototyping speed",
      "Clean CSS animations",
      "Strong collaborator with marketing managers"
    ],
    weaknesses: [
      "Lacks TypeScript typing precision",
      "Limited React server side rendering knowledge"
    ],
    cultureFit: "Friendly, highly cooperative, active participant in social activities and cross-department alignments.",
    risks: ["Needs guidance on advanced software architecture patterns."],
    recommendation: "Hire",
    interviewQuestions: [
      "How do you manage cross-browser compatibility issues for CSS flexbox/grid containers?",
      "How would you improve React render cycles when sorting large items?"
    ]
  },
  {
    id: "cand-6",
    name: "Devon Reynolds",
    avatar: "DR",
    role: "AI Research Scientist",
    experience: 3,
    resumeScore: 78,
    aiMatch: 75,
    status: "Rejected",
    recruiter: "Michael Vance",
    interviewDate: null,
    email: "devon.reynolds@example.org",
    phone: "+1 (555) 016-5645",
    skills: ["Python", "TensorFlow", "Scikit-Learn", "SQL"],
    summary: "Junior data analyst looking to transition to machine learning research. Enthusiastic learner.",
    strengths: [
      "Eager to learn and accept mentorship",
      "Strong SQL database query drafting"
    ],
    weaknesses: [
      "Lacks advanced deep learning framework project exposure",
      "Theoretical knowledge in LLMs is high but hands-on training is low"
    ],
    cultureFit: "Enthusiastic and eager, but needs high oversight.",
    risks: ["Not self-sufficient yet; our open role requires a self-directed senior research lead."],
    recommendation: "No Hire",
    interviewQuestions: []
  },
  {
    id: "cand-7",
    name: "Carla Dupont",
    avatar: "CD",
    role: "Product Manager",
    experience: 7,
    resumeScore: 91,
    aiMatch: 89,
    status: "Offer",
    recruiter: "Sarah Jenkins",
    interviewDate: null,
    email: "carla.dupont@example.com",
    phone: "+1 (555) 011-3322",
    skills: ["Product Roadmap", "Jira", "Agile", "SQL", "A/B Testing", "Customer Research"],
    summary: "Data-driven Product Manager specializing in user acquisition funnels. Ex-Vercel PM with high empathy for developers.",
    strengths: [
      "Expert cohort analysis and user metrics modeling",
      "Excellent writer of clear, detailed product requirement documents",
      "Strong bridge between design, engineering, and sales"
    ],
    weaknesses: [
      "Can get bogged down in data, sometimes delaying launch decisions",
      "Limited technical depth in low-level systems"
    ],
    cultureFit: "High user focus, outcome-oriented, loves building in public and gathering early telemetry.",
    risks: ["Slight salary expectations variance, but highly qualified."],
    recommendation: "Strong Hire",
    interviewQuestions: [
      "How do you evaluate which metrics to monitor to detect if a new feature launch is causing pipeline friction?"
    ]
  },
  {
    id: "cand-8",
    name: "Hiroshi Tanaka",
    avatar: "HT",
    role: "DevOps Engineer",
    experience: 9,
    resumeScore: 95,
    aiMatch: 93,
    status: "Hired",
    recruiter: "Michael Vance",
    interviewDate: null,
    email: "tanaka.h@example.co.jp",
    phone: "+81 90-1234-5678",
    skills: ["AWS", "Terraform", "Docker", "CI/CD", "Prometheus", "Linux"],
    summary: "DevOps lead specializing in highly available multi-region cloud setups, container orchestration, and zero-downtime database failovers.",
    strengths: [
      "Expert level Terraform state modeling",
      "Deep understanding of Linux network stacks and latency profiling",
      "Impeccable incident commander skills"
    ],
    weaknesses: [
      "Minimal experience with frontend builds or client-side assets configuration"
    ],
    cultureFit: "Calm, precise, values uptime and documentation above all. Highly professional.",
    risks: ["Prefers quiet environment, might find highly vocal environments distracting."],
    recommendation: "Strong Hire",
    interviewQuestions: []
  }
];

const initialJobs: Job[] = [
  { id: "job-1", title: "Senior React Engineer", department: "Engineering", location: "San Francisco, CA", type: "Hybrid", status: "Open", applicantsCount: 28 },
  { id: "job-2", title: "AI Research Scientist", department: "AI & Research", location: "New York, NY", type: "Remote", status: "Open", applicantsCount: 14 },
  { id: "job-3", title: "Lead Product Designer", department: "Design", location: "San Francisco, CA", type: "Hybrid", status: "Open", applicantsCount: 9 },
  { id: "job-4", title: "Backend Architect", department: "Engineering", location: "Seattle, WA", type: "Full-time", status: "Open", applicantsCount: 17 },
  { id: "job-5", title: "DevOps Engineer", department: "Infrastructure", location: "Remote", type: "Remote", status: "Closed", applicantsCount: 42 },
  { id: "job-6", title: "Product Manager", department: "Product", location: "New York, NY", type: "Hybrid", status: "Open", applicantsCount: 11 }
];

const initialInterviews: Interview[] = [
  {
    id: "int-1",
    candidateId: "cand-1",
    candidateName: "Jane Doe",
    role: "Senior React Engineer",
    panel: ["Alex Chen (Tech Lead)", "Sarah Jenkins (Recruiter)"],
    date: "2026-07-23",
    time: "10:00 AM",
    type: "Zoom",
    link: "https://zoom.us/j/9876543210"
  },
  {
    id: "int-2",
    candidateId: "cand-2",
    candidateName: "Alex Chen",
    role: "AI Research Scientist",
    panel: ["Dr. Sarah Peterson (Director of AI)", "Michael Vance (Recruiter)"],
    date: "2026-07-22",
    time: "02:30 PM",
    type: "Google Meet",
    link: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "int-3",
    candidateId: "cand-3",
    candidateName: "Sophia Martinez",
    role: "Lead Product Designer",
    panel: ["Lisa Kudrow (Creative Director)", "Jane Doe (Staff Frontend)"],
    date: "2026-07-24",
    time: "11:00 AM",
    type: "Zoom",
    link: "https://zoom.us/j/1234567890"
  }
];

const initialLogs: ActivityLog[] = [
  { id: "log-1", timestamp: "10 mins ago", user: "Sarah Jenkins", action: "scheduled Technical Round for", target: "Jane Doe" },
  { id: "log-2", timestamp: "1 hour ago", user: "AI Parser", action: "computed fit matching score (96%) for", target: "Jane Doe" },
  { id: "log-3", timestamp: "3 hours ago", user: "Michael Vance", action: "moved status to Screened for", target: "Alex Chen" },
  { id: "log-4", timestamp: "Yesterday", user: "AI Recruiter", action: "extracted skills and drafted questions for", target: "Sophia Martinez" },
  { id: "log-5", timestamp: "2 days ago", user: "HR Portal", action: "marked hiring completed for", target: "Hiroshi Tanaka" }
];

export function HiringProvider({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [userRole, setUserRole] = useState<UserRole>("Admin"); // Default to Admin for full toggle capabilities
  const [currentOrg, setCurrentOrg] = useState("Vercel & Co.");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("recruitflow_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const loginUser = (role: UserRole) => {
    setIsAuthenticated(true);
    localStorage.setItem("recruitflow_auth", "true");
    updateUserRole(role);
    addLog("logged into the platform as role", role);
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.setItem("recruitflow_auth", "false");
    addLog("logged out of the platform", "");
  };

  const updateCandidateStatus = (id: string, status: PipelineStage) => {
    setCandidates((prev) =>
      prev.map((cand) => (cand.id === id ? { ...cand, status } : cand))
    );

    const candName = candidates.find((c) => c.id === id)?.name || "Candidate";
    addLog(`moved candidate to stage '${status}'`, candName);
  };

  const deleteCandidate = (id: string) => {
    const candName = candidates.find((c) => c.id === id)?.name || "Candidate";
    setCandidates((prev) => prev.filter((cand) => cand.id !== id));
    setInterviews((prev) => prev.filter((i) => i.candidateId !== id));
    addLog(`removed candidate profile for`, candName);
  };

  const addCandidate = (newCand: Omit<Candidate, "id">) => {
    const newId = `cand-${Date.now()}`;
    const cand: Candidate = {
      ...newCand,
      id: newId
    };
    setCandidates((prev) => [cand, ...prev]);

    // Automatically trigger app log
    addLog(`added profile and parsed resume for`, cand.name);

    // If job matches, update applicant count
    setJobs((prev) =>
      prev.map((job) =>
        job.title === newCand.role
          ? { ...job, applicantsCount: job.applicantsCount + 1 }
          : job
      )
    );
  };

  const scheduleInterview = (newInt: Omit<Interview, "id">) => {
    const newId = `int-${Date.now()}`;
    const interview: Interview = {
      ...newInt,
      id: newId
    };
    setInterviews((prev) => [...prev, interview]);

    // Update candidate's interview date in state
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === newInt.candidateId
          ? { ...c, interviewDate: `${newInt.date}T${newInt.time}` }
          : c
      )
    );

    addLog(`scheduled ${newInt.type} interview for`, newInt.candidateName);
  };

  const cancelInterview = (id: string) => {
    const interview = interviews.find((i) => i.id === id);
    if (interview) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === interview.candidateId ? { ...c, interviewDate: null } : c
        )
      );
      addLog(`cancelled interview session for`, interview.candidateName);
    }
    setInterviews((prev) => prev.filter((i) => i.id !== id));
  };

  const addJob = (newJob: Omit<Job, "id" | "applicantsCount">) => {
    const newId = `job-${Date.now()}`;
    const job: Job = {
      ...newJob,
      id: newId,
      applicantsCount: 0
    };
    setJobs((prev) => [job, ...prev]);
    addLog(`created new job opening for`, newJob.title);
  };

  const updateUserRole = (role: UserRole) => {
    setUserRole(role);
    addLog(`updated context privileges role to`, role);
  };

  const updateOrgName = (name: string) => {
    setCurrentOrg(name);
    addLog(`updated organization name to`, name);
  };

  const addLog = (action: string, target: string) => {
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: userRole === "Admin" ? "System Admin" : userRole,
      action,
      target
    };
    setLogs((prev) => [log, ...prev.slice(0, 15)]); // keep last 15
  };

  return (
    <HiringContext.Provider
      value={{
        candidates,
        jobs,
        interviews,
        logs,
        userRole,
        currentOrg,
        updateCandidateStatus,
        deleteCandidate,
        addCandidate,
        scheduleInterview,
        cancelInterview,
        addJob,
        updateUserRole,
        updateOrgName,
        isAuthenticated,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </HiringContext.Provider>
  );
}

export function useHiring() {
  const context = useContext(HiringContext);
  if (!context) {
    throw new Error("useHiring must be used within a HiringProvider");
  }
  return context;
}

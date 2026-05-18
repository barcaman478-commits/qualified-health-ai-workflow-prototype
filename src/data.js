export const stages = [
  { id: "discover", number: 1, label: "Discover", short: "Discover" },
  { id: "map", number: 2, label: "Map Workflow", short: "Map" },
  { id: "opportunities", number: 3, label: "Identify Opportunities", short: "Opportunities" },
  { id: "readiness", number: 4, label: "Assess Readiness", short: "Readiness" },
  { id: "plan", number: 5, label: "Plan Deployment", short: "Plan" }
];

export const initialLanes = ["Patient", "Front Desk", "Triage Nurse", "Physician", "Care Team", "Discharge"];

export const initialNotes = [];

export const demoNotes = [
  {
    id: "n1",
    department: "Emergency Department",
    role: "Physician",
    stakeholder: "Dr. Sarah Johnson",
    problem: "Clinicians spend too much time documenting instead of patient care.",
    affectedUsers: "ED physicians, nurses, residents",
    impact: "High",
    quote: "We spend too much time on documentation instead of patient care.",
    initials: "DR",
    color: "violet"
  },
  {
    id: "n2",
    department: "Nursing",
    role: "Nurse Manager",
    stakeholder: "Nurse Manager",
    problem: "Teams struggle to see inpatient beds and status changes in real time.",
    affectedUsers: "Charge nurses, front desk, discharge team",
    impact: "High",
    quote: "Delays in getting patient beds and updating status in the system.",
    initials: "NM",
    color: "green"
  },
  {
    id: "n3",
    department: "Operations",
    role: "Admin Director",
    stakeholder: "Admin Director",
    problem: "Leaders lack timely visibility into bottlenecks until it is too late.",
    affectedUsers: "Operations leaders, patient flow team",
    impact: "Medium",
    quote: "Lack of visibility into bottlenecks until it is too late.",
    initials: "AD",
    color: "orange"
  }
];

export const initialNodes = [];

export const initialEdges = [];

export const initialOpportunities = [];

export const readinessCategories = [
  { id: "data", label: "Data Readiness", score: 0, action: "", evidence: "", owner: "" },
  { id: "technical", label: "Technical Feasibility", score: 0, action: "", evidence: "", owner: "" },
  { id: "workflow", label: "Workflow Maturity", score: 0, action: "", evidence: "", owner: "" },
  { id: "stakeholder", label: "Stakeholder Alignment", score: 0, action: "", evidence: "", owner: "" },
  { id: "governance", label: "Governance & Risk", score: 0, action: "", evidence: "", owner: "" }
];

export const timelinePhases = [];

export const demoProblemFrame = {
  statement: "Discharge coordination is inconsistent across teams, delaying bed turnover and patient throughput.",
  objective: "Reduce avoidable discharge delays while improving visibility across care teams.",
  baseline: "Average discharge completion: 4.2 hours after order",
  target: "Reduce average discharge completion time by 20%",
  scope: "Adult inpatient discharge workflow",
  assumptions: "Core discharge data is available in existing systems",
  constraints: "Must preserve clinical review and governance controls"
};

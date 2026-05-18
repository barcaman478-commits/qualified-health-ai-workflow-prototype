import { stages, initialNotes, initialNodes, initialEdges, initialOpportunities, readinessCategories, timelinePhases, initialLanes, demoNotes, demoProblemFrame } from "./data.js";
import { Sidebar } from "./components/Sidebar.js";
import { StageProgress } from "./components/StageProgress.js";
import { DiscoverStage } from "./components/DiscoverStage.js";
import { MapWorkflowStage } from "./components/MapWorkflowStage.js";
import { OpportunitiesStage } from "./components/OpportunitiesStage.js";
import { ReadinessStage } from "./components/ReadinessStage.js";
import { PlanDeploymentStage } from "./components/PlanDeploymentStage.js";
import { TraceabilityBar } from "./components/TraceabilityBar.js";

const { createElement: h, useMemo, useState } = window.React;
const { createRoot } = window.ReactDOM;

function App() {
  const [activeStage, setActiveStage] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [problemFrame, setProblemFrame] = useState({
    statement: "",
    objective: "",
    baseline: "",
    target: "",
    scope: "",
    assumptions: "",
    constraints: ""
  });
  const [lanes, setLanes] = useState(initialLanes);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [readiness, setReadiness] = useState(readinessCategories);
  const [readinessTarget, setReadinessTarget] = useState("");
  const [phases, setPhases] = useState(timelinePhases);
  const [planDetails, setPlanDetails] = useState({
    scope: "",
    owner: "",
    metrics: "",
    nextSteps: ""
  });

  const completion = useMemo(() => [
    notes.length > 0 || Object.values(problemFrame).some((value) => value.trim()),
    nodes.length > 0,
    opportunities.length > 0,
    readiness.some((category) => category.score > 0 || category.action.trim()),
    phases.length > 0 || Object.values(planDetails).some((value) => value.trim())
  ], [notes.length, problemFrame, nodes.length, opportunities.length, readiness, phases.length, planDetails]);
  const unlockedThrough = stages.length - 1;

  function advanceTo(index) {
    setActiveStage(index);
  }

  function goToStage(index) {
    setActiveStage(index);
  }

  function loadDemoScenario() {
    setNotes(demoNotes);
    setProblemFrame(demoProblemFrame);
  }

  function clearDiscovery() {
    setNotes([]);
    setProblemFrame({
      statement: "",
      objective: "",
      baseline: "",
      target: "",
      scope: "",
      assumptions: "",
      constraints: ""
    });
  }

  const shared = { notes, problemFrame, lanes, nodes, edges, opportunities, readiness, readinessTarget, phases, planDetails };
  const stageViews = [
    h(DiscoverStage, { notes, setNotes, problemFrame, setProblemFrame, loadDemoScenario, clearDiscovery, onNext: () => advanceTo(1) }),
    h(MapWorkflowStage, { lanes, setLanes, nodes, setNodes, edges, setEdges, onNext: () => advanceTo(2) }),
    h(OpportunitiesStage, { opportunities, setOpportunities, nodes, edges, problemFrame, notes, onNext: () => advanceTo(3) }),
    h(ReadinessStage, { categories: readiness, setCategories: setReadiness, opportunities, readinessTarget, setReadinessTarget, shared, onNext: () => advanceTo(4) }),
    h(PlanDeploymentStage, { phases, setPhases, planDetails, setPlanDetails, problemFrame, opportunities, readiness, readinessTarget })
  ];

  return h(
    "div",
    { className: `app-shell ${sidebarCollapsed ? "is-collapsed" : ""}` },
    h(Sidebar, { collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed, activeStage, goToStage, unlockedThrough }),
    h(
      "main",
      { className: "main-panel" },
      h(
        "header",
        { className: "topbar" },
        h("div", { className: "brand-lockup", "aria-label": "Qualified Health" }, h("span", { className: "brand-mark" }, "Q"), h("span", null, "Qualified Health")),
        h(StageProgress, { stages, activeStage, completion, unlockedThrough, goToStage }),
        h("div", { className: "user-chip", "aria-label": "Signed in user" }, h("span", null, "MJ"))
      ),
      h(
        "section",
        { className: "portfolio-banner", "aria-label": "Prototype context" },
        h("div", null,
          h("strong", null, "Client AI Adoption Workspace"),
          h("p", null, "A business and product analysis prototype for guiding health-system teams from stakeholder discovery to workflow mapping, AI opportunity prioritization, readiness assessment, and deployment planning.")
        ),
        h("div", { className: "banner-proof" },
          h("span", null, "BA / Product Analyst"),
          h("span", null, "Healthcare AI"),
          h("span", null, "Governance + ROI")
        )
      ),
      h(TraceabilityBar, { problemFrame, nodes, opportunities, readinessTarget, phases }),
      h("section", { className: "stage-frame", "aria-live": "polite" }, stageViews[activeStage])
    )
  );
}

createRoot(document.getElementById("root")).render(h(App));

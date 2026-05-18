const { createElement: h } = window.React;

export function TraceabilityBar({ problemFrame, nodes, opportunities, readinessTarget, phases }) {
  const bottlenecks = nodes.filter((node) => node.friction).length;
  const linkedOpportunity = opportunities.find((item) => item.id === readinessTarget);

  const items = [
    {
      label: "Problem",
      value: problemFrame.statement || "Frame the business problem"
    },
    {
      label: "Workflow",
      value: nodes.length ? `${nodes.length} tasks, ${bottlenecks} bottlenecks` : "Map the current state"
    },
    {
      label: "Opportunity",
      value: opportunities[0]?.name || "Prioritize a solution"
    },
    {
      label: "Readiness",
      value: linkedOpportunity?.name || "Choose assessment target"
    },
    {
      label: "Deployment",
      value: phases.length ? `${phases.length} rollout phase${phases.length === 1 ? "" : "s"}` : "Plan the pilot"
    }
  ];

  return h(
    "section",
    { className: "traceability-bar", "aria-label": "Analysis traceability" },
    items.map((item) =>
      h(
        "article",
        { key: item.label },
        h("span", null, item.label),
        h("strong", null, item.value)
      )
    )
  );
}

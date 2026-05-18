import { Badge, Button, Field, Panel, StageHeader } from "./ui.js";
import { Icon } from "../icons.js";

const { createElement: h, useMemo, useState } = window.React;

const emptyOpportunity = {
  name: "",
  source: "",
  linkedNodeId: "",
  impact: "Medium",
  complexity: "Medium",
  readiness: 50,
  tag: "Needs Review",
  description: "",
  expectedValue: "",
  dependencies: "",
  risks: "",
  confidence: "Medium"
};

function impactTone(value) {
  return value === "High" ? "green" : value === "Medium" ? "yellow" : "gray";
}

function tagTone(value) {
  return value === "Quick Win" ? "blue" : value === "Pilot" ? "purple" : value === "Needs Review" ? "yellow" : "gray";
}

export function OpportunitiesStage({ opportunities, setOpportunities, nodes, edges, problemFrame, notes, onNext }) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("readiness");
  const [form, setForm] = useState(emptyOpportunity);
  const [editingId, setEditingId] = useState(null);

  const filtered = useMemo(() => {
    const rows = filter === "All" ? opportunities : opportunities.filter((item) => item.tag === filter || item.impact === filter);
    return [...rows].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "impact") return b.impact.localeCompare(a.impact);
      return Number(b.readiness) - Number(a.readiness);
    });
  }, [filter, opportunities, sort]);
  const linkedNode = nodes.find((node) => node.id === form.linkedNodeId);
  const topPainPoints = notes.map((note) => note.problem).filter(Boolean).slice(0, 3);
  const nodeById = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);
  const previewEdges = edges
    .map((edge) => {
      const source = nodeById[edge.source];
      const target = nodeById[edge.target];
      if (!source || !target) return null;
      return { ...edge, x1: source.x / 10, y1: source.y / 6.2, x2: target.x / 10, y2: target.y / 6.2 };
    })
    .filter(Boolean);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function linkWorkflowStep(nodeId) {
    const node = nodes.find((item) => item.id === nodeId);
    setForm((current) => ({ ...current, linkedNodeId: nodeId, source: node?.label || current.source }));
  }

  function useProblemStatement() {
    if (!problemFrame.statement) return;
    setForm((current) => ({ ...current, description: current.description || problemFrame.statement }));
  }

  function useWorkflowNotes() {
    if (!linkedNode?.notes) return;
    setForm((current) => ({ ...current, description: current.description || linkedNode.notes }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      setOpportunities(opportunities.map((item) => (item.id === editingId ? { ...item, ...form, readiness: Number(form.readiness) } : item)));
    } else {
      setOpportunities([...opportunities, { ...form, readiness: Number(form.readiness), id: `o${Date.now()}` }]);
    }
    setEditingId(null);
    setForm(emptyOpportunity);
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ ...item });
  }

  function addDraftFromBottleneck() {
    const friction = nodes.find((node) => node.friction) || nodes[0];
    if (!friction) return;
    setForm({
      name: `${friction.label} opportunity`,
      source: friction.label,
      linkedNodeId: friction.id,
      impact: "Medium",
      complexity: "Medium",
      readiness: 50,
      tag: "Needs Review",
      description: "Drafted from the workflow map. Edit the name, value case, and scores before using it with a client.",
      expectedValue: "",
      dependencies: "",
      risks: "",
      confidence: "Medium"
    });
  }

  return h(
    "div",
    { className: "stage opportunities-stage" },
    h(StageHeader, {
      title: "Identify Opportunities",
      subtitle: "Turn mapped friction points into analyst-defined AI opportunities. Nothing is scored until you enter it.",
      action: h("div", { className: "toolbar" },
        h("select", { value: filter, onChange: (e) => setFilter(e.target.value), "aria-label": "Filter opportunities" }, ["All", "High", "Medium", "Low", "Quick Win", "Pilot", "Needs Review"].map((value) => h("option", { key: value }, value))),
        h("select", { value: sort, onChange: (e) => setSort(e.target.value), "aria-label": "Sort opportunities" }, h("option", { value: "readiness" }, "Readiness"), h("option", { value: "impact" }, "Impact"), h("option", { value: "name" }, "Name")),
        h(Button, { onClick: addDraftFromBottleneck, icon: "spark", disabled: nodes.length === 0 }, "Draft from Map"),
        h(Button, { onClick: onNext, variant: "primary", icon: "chevron" }, "Next Step")
      )
    }),
    h(
      "div",
      { className: "opportunity-grid" },
      h(
        Panel,
        { className: "mini-map" },
        h("h2", null, "Workflow Reference"),
        h("div", { className: "muted-map" },
          nodes.length === 0 ? h("div", { className: "empty-canvas compact" }, h(Icon, { name: "map" }), h("strong", null, "No workflow mapped yet"), h("p", null, "Map a process first, or manually add opportunities on the right.")) : null,
          h("svg", { className: "mini-edge-layer", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
            previewEdges.map((edge) => h("path", { key: edge.id, d: `M ${edge.x1} ${edge.y1} C ${edge.x1 + 4} ${edge.y1}, ${edge.x2 - 4} ${edge.y2}, ${edge.x2} ${edge.y2}`, className: "mini-edge-line" }))
          ),
          nodes.slice(0, 30).map((node) => h("span", { key: node.id, className: `mini-node ${node.type} ${node.friction ? "has-pin" : ""} ${form.linkedNodeId === node.id ? "selected" : ""}`, style: { left: `${Math.max(7, Math.min(92, node.x / 10))}%`, top: `${Math.max(8, Math.min(88, node.y / 6.2))}%`, "--task-color": node.color } },
            h("b", null, node.label),
            node.friction ? h(Icon, { name: "spark", size: 12 }) : null
          ))
        ),
        h("div", { className: "carry-forward-grid" },
          h("article", null,
            h("span", null, "Problem"),
            h("strong", null, problemFrame.statement || "Add a problem statement in Discover")
          ),
          h("article", null,
            h("span", null, "Pain Points"),
            h("strong", null, topPainPoints.length ? topPainPoints.join(" | ") : "Add stakeholder notes in Discover")
          )
        )
      ),
      h(
        Panel,
        { className: "opportunity-list" },
        h("div", { className: "panel-title-row" }, h("h2", null, "Opportunity Entry"), h(Icon, { name: "edit" })),
        h("form", { className: "opportunity-form", onSubmit: submit },
          h(Field, { label: "Opportunity Name" }, h("input", { value: form.name, onChange: (event) => update("name", event.target.value), placeholder: "Example: reduce intake rework", required: true })),
          h(Field, { label: "Linked Workflow Step" }, h("select", { value: form.linkedNodeId, onChange: (event) => linkWorkflowStep(event.target.value) },
            h("option", { value: "" }, "Select a mapped step"),
            nodes.map((node) => h("option", { key: node.id, value: node.id }, `${node.label}${node.friction ? " - bottleneck" : ""}`))
          )),
          linkedNode ? h("div", { className: "linked-context" },
            h("div", { className: "linked-context-header" },
              h("strong", null, "Carried from workflow"),
              linkedNode.notes ? h("button", { type: "button", className: "link-button", onClick: useWorkflowNotes }, "Use task notes") : null
            ),
            h("dl", null,
              h("div", null, h("dt", null, "Lane"), h("dd", null, linkedNode.lane || "Not set")),
              h("div", null, h("dt", null, "System"), h("dd", null, linkedNode.system || "Not set")),
              h("div", null, h("dt", null, "Avg Time"), h("dd", null, linkedNode.duration || "Not set")),
              h("div", null, h("dt", null, "Pain Point"), h("dd", null, linkedNode.painType || "None")),
              h("div", null, h("dt", null, "Evidence"), h("dd", null, linkedNode.evidence || "Not set"))
            )
          ) : null,
          h(Field, { label: "Source in Workflow" }, h("input", { value: form.source, onChange: (event) => update("source", event.target.value), placeholder: "Task, handoff, or bottleneck" })),
          h(Field, { label: "Description / Value Case" }, h("textarea", { value: form.description, onChange: (event) => update("description", event.target.value), placeholder: "What problem would this solve and for whom?" })),
          problemFrame.statement ? h("div", { className: "inline-context-action" },
            h("span", null, "From Discover: ", problemFrame.statement),
            h("button", { type: "button", className: "link-button", onClick: useProblemStatement }, "Use problem statement")
          ) : null,
          h(Field, { label: "Expected Value" }, h("input", { value: form.expectedValue, onChange: (event) => update("expectedValue", event.target.value), placeholder: "Time saved, reduced delay, better quality, lower risk..." })),
          h("div", { className: "form-grid two" },
            h(Field, { label: "Impact" }, h("select", { value: form.impact, onChange: (event) => update("impact", event.target.value) }, ["High", "Medium", "Low"].map((value) => h("option", { key: value }, value)))),
            h(Field, { label: "Complexity" }, h("select", { value: form.complexity, onChange: (event) => update("complexity", event.target.value) }, ["High", "Medium", "Low"].map((value) => h("option", { key: value }, value))))
          ),
          h("div", { className: "form-grid two" },
            h(Field, { label: "Readiness Score" }, h("input", { type: "number", min: 0, max: 100, value: form.readiness, onChange: (event) => update("readiness", event.target.value) })),
            h(Field, { label: "Recommendation" }, h("select", { value: form.tag, onChange: (event) => update("tag", event.target.value) }, ["Quick Win", "Pilot", "Needs Review", "Defer"].map((value) => h("option", { key: value }, value))))
          ),
          h("div", { className: "form-grid three" },
            h(Field, { label: "Dependencies" }, h("input", { value: form.dependencies, onChange: (event) => update("dependencies", event.target.value), placeholder: "Data, integration, policy..." })),
            h(Field, { label: "Risks" }, h("input", { value: form.risks, onChange: (event) => update("risks", event.target.value), placeholder: "Adoption, safety, bias..." })),
            h(Field, { label: "Confidence" }, h("select", { value: form.confidence, onChange: (event) => update("confidence", event.target.value) }, ["High", "Medium", "Low"].map((value) => h("option", { key: value }, value))))
          ),
          h("div", { className: "form-actions" },
            h(Button, { type: "submit", variant: "primary", icon: editingId ? "check" : "plus" }, editingId ? "Save Opportunity" : "Add Opportunity"),
            editingId ? h(Button, { type: "button", onClick: () => { setEditingId(null); setForm(emptyOpportunity); } }, "Cancel") : null
          )
        )
      )
    ),
    h(Panel, { className: "opportunity-table-panel" },
      h("div", { className: "panel-title-row" }, h("h2", null, "Potential AI Opportunities"), h("span", { className: "count-pill" }, opportunities.length)),
      opportunities.length === 0 ? h("div", { className: "empty-state" }, h(Icon, { name: "spark" }), h("strong", null, "No opportunities entered yet"), h("p", null, "Add opportunities manually, or draft one from a workflow bottleneck and then edit the details.")) :
        h("table", { className: "opportunity-table" },
          h("thead", null, h("tr", null, ["Opportunity", "Source", "Impact", "Complexity", "Readiness", "Recommendation", "Confidence", ""].map((label) => h("th", { key: label }, label)))),
          h("tbody", null,
            filtered.map((item) => h("tr", { key: item.id },
              h("td", null, item.name),
              h("td", null, item.source || "Not set"),
              h("td", null, h(Badge, { tone: impactTone(item.impact) }, item.impact)),
              h("td", null, item.complexity),
              h("td", null, h("div", { className: "score-bar" }, h("span", { style: { width: `${item.readiness}%` } }), h("b", null, `${item.readiness}`))),
              h("td", null, h(Badge, { tone: tagTone(item.tag) }, item.tag)),
              h("td", null, item.confidence || "Not set"),
              h("td", null, h("button", { className: "link-button", onClick: () => edit(item) }, "Edit"))
            ))
          )
        )
    ),
    h(
      Panel,
      { className: "rubric-panel" },
      h("h2", null, "Opportunity Scoring Rubric"),
      h("div", { className: "rubric-grid" },
        [
          ["Impact", "High = measurable strategic or patient-flow value; Medium = local operational value; Low = marginal gain."],
          ["Complexity", "High = multiple dependencies or workflow redesign; Medium = moderate change; Low = light implementation lift."],
          ["Readiness", "Use 0-100 to reflect data, workflow, stakeholder, and governance preparedness."],
          ["Recommendation", "Quick Win = high value / low lift; Pilot = promising but needs validation; Defer = not ready or low value."]
        ].map(([title, copy]) => h("article", { key: title }, h("strong", null, title), h("p", null, copy)))
      )
    )
  );
}

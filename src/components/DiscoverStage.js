import { Button, Field, Panel, StageHeader } from "./ui.js";
import { Icon } from "../icons.js";

const { createElement: h, useState } = window.React;

const emptyForm = {
  stakeholder: "",
  department: "Emergency Department",
  role: "",
  problem: "",
  affectedUsers: "",
  impact: "High",
  quote: ""
};

export function DiscoverStage({ notes, setNotes, problemFrame, setProblemFrame, loadDemoScenario, clearDiscovery, onNext }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(notes[0]?.id || null);
  const selected = notes.find((note) => note.id === selectedId) || notes[0];
  const hasDiscoveryContent = notes.length > 0 || Object.values(problemFrame).some((value) => value.trim());

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function edit(note) {
    setEditingId(note.id);
    setForm({ ...note });
    setSelectedId(note.id);
  }

  function submit(event) {
    event.preventDefault();
    if (!form.stakeholder.trim() || !form.problem.trim()) return;
    const payload = {
      ...form,
      quote: form.quote || form.problem,
      initials: form.stakeholder.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      color: form.impact === "High" ? "violet" : form.impact === "Medium" ? "orange" : "green"
    };
    if (editingId) {
      setNotes(notes.map((note) => (note.id === editingId ? { ...note, ...payload } : note)));
    } else {
      const id = `n${Date.now()}`;
      setNotes([{ id, ...payload }, ...notes]);
      setSelectedId(id);
    }
    setEditingId(null);
    setForm(emptyForm);
  }

  const painPoints = notes.map((note) => note.problem).slice(0, 4);

  function updateFrame(field, value) {
    setProblemFrame({ ...problemFrame, [field]: value });
  }

  return h(
    "div",
    { className: "stage discover-stage" },
    h(StageHeader, {
      title: "Discovery: Understand the Problem",
      subtitle: "Capture stakeholder input and define the problem space.",
      eyebrow: "Project: ED Throughput Improvement",
      action: h("div", { className: "toolbar" },
        h(Button, { onClick: loadDemoScenario, icon: "spark" }, "Load Example"),
        h(Button, { onClick: clearDiscovery, icon: "trash", disabled: !hasDiscoveryContent }, "Clear"),
        h(Button, { variant: "secondary", icon: "edit", onClick: () => selected && edit(selected), disabled: !selected }, "Edit Context")
      )
    }),
    h(
      "div",
      { className: "discover-grid" },
      h(
        Panel,
        { className: "insights-panel" },
        h("div", { className: "panel-title-row" }, h("h2", null, "Stakeholder Insights"), h("span", { className: "count-pill" }, notes.length)),
        h(
          "div",
          { className: "note-list", role: "list" },
          notes.length === 0
            ? h("div", { className: "empty-state compact" }, h(Icon, { name: "edit" }), h("strong", null, "No stakeholder insights yet"), h("p", null, "Add interview notes or load the example scenario to get started."))
            : notes.map((note) =>
              h(
                "article",
                {
                  key: note.id,
                  className: `note-card ${selected?.id === note.id ? "selected" : ""}`,
                  onClick: () => setSelectedId(note.id),
                  tabIndex: 0,
                  onKeyDown: (event) => event.key === "Enter" && setSelectedId(note.id),
                  role: "listitem",
                  "aria-label": `${note.stakeholder} discovery note`
                },
                h("span", { className: `avatar ${note.color}` }, note.initials),
                h("div", null, h("strong", null, note.stakeholder), h("small", null, `${note.role} - ${note.department}`), h("p", null, `"${note.quote}"`)),
                h("button", { className: "icon-only", onClick: (event) => { event.stopPropagation(); edit(note); }, "aria-label": `Edit ${note.stakeholder}` }, h(Icon, { name: "edit", size: 15 }))
              )
            )
        ),
        h(
          "form",
          { className: "discovery-form", onSubmit: submit },
          h("h3", null, editingId ? "Edit Stakeholder" : "Add Stakeholder"),
          h("div", { className: "form-grid two" },
            h(Field, { label: "Stakeholder" }, h("input", { value: form.stakeholder, onChange: (e) => update("stakeholder", e.target.value), placeholder: "Name or group", required: true })),
            h(Field, { label: "Role" }, h("input", { value: form.role, onChange: (e) => update("role", e.target.value), placeholder: "Physician, nurse manager, ops lead, IT owner", required: true }))
          ),
          h("div", { className: "form-grid two" },
            h(Field, { label: "Department" }, h("select", { value: form.department, onChange: (e) => update("department", e.target.value) }, ["Emergency Department", "Nursing", "Operations", "IT / Digital", "Quality & Safety"].map((value) => h("option", { key: value }, value)))),
            h(Field, { label: "Perceived Impact" }, h("select", { value: form.impact, onChange: (e) => update("impact", e.target.value) }, ["High", "Medium", "Low"].map((value) => h("option", { key: value }, value))))
          ),
          h(Field, { label: "Problem Description", help: "Describe the workflow pain point in plain operational language." }, h("textarea", { value: form.problem, onChange: (e) => update("problem", e.target.value), placeholder: "Example: discharge planning varies by shift and causes avoidable bed delays.", required: true })),
          h(Field, { label: "Affected Users" }, h("input", { value: form.affectedUsers, onChange: (e) => update("affectedUsers", e.target.value), placeholder: "Patients, physicians, nurses, case managers, schedulers..." })),
          h(Field, { label: "Discovery Note" }, h("input", { value: form.quote, onChange: (e) => update("quote", e.target.value), placeholder: "Optional interview quote or observation" })),
          h("div", { className: "form-actions" }, h(Button, { type: "submit", variant: "primary", icon: "plus" }, editingId ? "Save Insight" : "Add Stakeholder"), h(Button, { type: "button", onClick: onNext, variant: "ghost", icon: "chevron" }, "Map Workflow"))
        )
      ),
      h(
        "div",
        { className: "summary-column" },
        h(Panel, null,
          h("h2", null, "Problem Summary"),
          h("p", null, problemFrame.statement || selected?.problem || "Capture stakeholder pain points to define the opportunity space."),
          h("hr", null),
          h("h3", null, "Top Pain Points"),
          painPoints.length
            ? h("ul", { className: "pain-list" }, painPoints.map((point) => h("li", { key: point }, h(Icon, { name: "alert", size: 15 }), h("span", null, point))))
            : h("p", null, "Add stakeholder notes to reveal recurring pain points.")
        ),
        h(Panel, null,
          h("h2", null, "Analyst Lens"),
          h("ul", { className: "goal-list" },
            [
              problemFrame.objective || "Define the business objective",
              problemFrame.target || "Set the target outcome",
              problemFrame.scope || "Clarify what is in scope",
              problemFrame.constraints || "Capture constraints early"
            ].map((goal) => h("li", { key: goal }, h(Icon, { name: "check", size: 15 }), goal))
          )
        )
      )
    ),
    h(
      Panel,
      { className: "problem-frame-panel" },
      h("div", { className: "panel-title-row" }, h("h2", null, "Problem Framing"), h("span", { className: "count-pill" }, "BA")),
      h("div", { className: "form-grid three" },
        h(Field, { label: "Problem Statement" }, h("input", { value: problemFrame.statement, onChange: (event) => updateFrame("statement", event.target.value), placeholder: "What problem are we solving?" })),
        h(Field, { label: "Business Objective" }, h("input", { value: problemFrame.objective, onChange: (event) => updateFrame("objective", event.target.value), placeholder: "What should improve?" })),
        h(Field, { label: "Current Baseline" }, h("input", { value: problemFrame.baseline, onChange: (event) => updateFrame("baseline", event.target.value), placeholder: "Current LOS, wait time, error rate..." }))
      ),
      h("div", { className: "form-grid three" },
        h(Field, { label: "Target Outcome" }, h("input", { value: problemFrame.target, onChange: (event) => updateFrame("target", event.target.value), placeholder: "Desired future state or KPI target" })),
        h(Field, { label: "In Scope" }, h("input", { value: problemFrame.scope, onChange: (event) => updateFrame("scope", event.target.value), placeholder: "Units, users, shifts, workflow boundary" })),
        h(Field, { label: "Assumptions" }, h("input", { value: problemFrame.assumptions, onChange: (event) => updateFrame("assumptions", event.target.value), placeholder: "What are we assuming is true?" }))
      ),
      h(Field, { label: "Constraints / Risks" }, h("textarea", { value: problemFrame.constraints, onChange: (event) => updateFrame("constraints", event.target.value), placeholder: "Regulatory, staffing, technical, budget, or operational constraints" }))
    )
  );
}

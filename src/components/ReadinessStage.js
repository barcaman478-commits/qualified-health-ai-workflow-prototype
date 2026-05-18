import { Badge, Button, Field, Panel, StageHeader } from "./ui.js";
import { Icon } from "../icons.js";

const { createElement: h, useMemo, useState } = window.React;

function statusFor(score) {
  if (score >= 75) return "Good";
  if (score >= 45) return "Moderate";
  if (score > 0) return "Needs Work";
  return "Not Scored";
}

function statusTone(status) {
  return status === "Good" ? "green" : status === "Moderate" ? "yellow" : status === "Needs Work" ? "red" : "gray";
}

export function ReadinessStage({ categories, setCategories, opportunities, readinessTarget, setReadinessTarget, onNext }) {
  const [showDetails, setShowDetails] = useState(true);
  const scored = categories.filter((item) => item.score > 0);
  const overall = useMemo(() => scored.length ? Math.round(scored.reduce((sum, item) => sum + Number(item.score), 0) / scored.length) : 0, [scored]);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (overall / 100) * circumference;
  const overallStatus = statusFor(overall);

  function updateCategory(id, patch) {
    setCategories(categories.map((category) => (category.id === id ? { ...category, ...patch } : category)));
  }

  return h(
    "div",
    { className: "stage readiness-stage" },
    h(StageHeader, {
      title: "Assess Readiness",
      subtitle: "Score the categories yourself and capture the work needed to improve readiness.",
      action: h("div", { className: "toolbar" },
        h("select", { value: readinessTarget, onChange: (event) => setReadinessTarget(event.target.value), "aria-label": "Assessment target opportunity" },
          h("option", { value: "" }, "Assessment for..."),
          opportunities.map((item) => h("option", { key: item.id, value: item.id }, item.name))
        ),
        h(Button, { onClick: () => setShowDetails(!showDetails), icon: "gauge" }, showDetails ? "Hide Inputs" : "Edit Scores"),
        h(Button, { onClick: onNext, variant: "primary", icon: "chevron" }, "Next Step")
      )
    }),
    h(
      "div",
      { className: "readiness-grid" },
      h(
        Panel,
        { className: "gauge-panel" },
        h("h2", null, "Overall Readiness Score"),
        h("div", { className: "gauge-wrap", role: "meter", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": overall },
          h("svg", { viewBox: "0 0 140 140" },
            h("circle", { cx: 70, cy: 70, r: 54, className: "gauge-track" }),
            h("circle", { cx: 70, cy: 70, r: 54, className: "gauge-fill", style: { strokeDasharray: circumference, strokeDashoffset: offset } })
          ),
          h("strong", null, overall),
          h("small", null, "/100")
        ),
        h(Badge, { tone: statusTone(overallStatus) }, overallStatus),
        h("p", null, readinessTarget ? `Assessment target: ${opportunities.find((item) => item.id === readinessTarget)?.name || "Selected opportunity"}.` : scored.length ? "Calculated from the categories you have scored." : "No readiness scores entered yet."),
        h("button", { className: "link-button", onClick: () => setShowDetails(!showDetails), "aria-expanded": showDetails }, showDetails ? "Hide Inputs" : "Edit Scores")
      ),
      categories.map((category) => {
        const status = statusFor(Number(category.score));
        return h(Panel, { key: category.id, className: "score-card" },
          h("h3", null, category.label),
          h("strong", null, category.score, h("small", null, "/100")),
          h(Badge, { tone: statusTone(status) }, status)
        );
      })
    ),
    showDetails ? h(
      Panel,
      { className: "details-panel readiness-input-panel" },
      h("h2", null, "Readiness Inputs"),
      h("div", { className: "readiness-input-grid" },
        categories.map((category) => h("article", { key: category.id, className: "readiness-input-card" },
          h("div", { className: "panel-title-row" }, h("strong", null, category.label), h("b", null, category.score)),
          h("input", { type: "range", min: 0, max: 100, value: category.score, onChange: (event) => updateCategory(category.id, { score: Number(event.target.value) }), "aria-label": `${category.label} score` }),
          h(Field, { label: "Evidence" }, h("textarea", { value: category.evidence || "", onChange: (event) => updateCategory(category.id, { evidence: event.target.value }), placeholder: "What evidence supports this score?" })),
          h(Field, { label: "Recommended Action" }, h("textarea", { value: category.action, onChange: (event) => updateCategory(category.id, { action: event.target.value }), placeholder: "What should the team do to improve this category?" })),
          h(Field, { label: "Action Owner" }, h("input", { value: category.owner || "", onChange: (event) => updateCategory(category.id, { owner: event.target.value }), placeholder: "Clinical lead, IT, governance..." }))
        ))
      )
    ) : null,
    h(
      "div",
      { className: "readiness-secondary" },
      h(Panel, null,
        h("h2", null, "Strengths to Capture"),
        h(Field, { label: "Notes" }, h("textarea", { placeholder: "Executive sponsorship, clinical champion, integration foundation..." }))
      ),
      h(Panel, null,
        h("h2", null, "Gaps / Risks"),
        h(Field, { label: "Notes" }, h("textarea", { placeholder: "Data quality, governance, workflow variation, adoption risk..." }))
      ),
      h(Panel, null,
        h("h2", null, "Readiness Breakdown"),
        categories.map((category) => h("div", { key: category.id, className: "breakdown-row" }, h("span", null, category.label), h("div", null, h("i", { style: { width: `${category.score}%` } })), h("b", null, category.score)))
      )
    ),
    h("div", { className: "recommendation-strip" }, h(Icon, { name: "info" }), h("p", null, "Use the scores and notes to decide whether this is ready for a pilot, needs discovery, or should be deferred."))
  );
}

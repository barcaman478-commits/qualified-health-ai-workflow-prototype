const { createElement: h } = window.React;

export function StageProgress({ stages, activeStage, completion, unlockedThrough, goToStage }) {
  return h(
    "ol",
    { className: "stage-progress", "aria-label": "Workflow stages" },
    stages.map((stage, index) =>
      h(
        "li",
        { key: stage.id, className: index === activeStage ? "current" : completion[index] ? "complete" : "" },
        h(
          "button",
          {
            onClick: () => goToStage(index),
            "aria-current": index === activeStage ? "step" : undefined
          },
          h("span", { className: "step-number" }, stage.number),
          h("span", { className: "step-label" }, stage.label)
        )
      )
    )
  );
}

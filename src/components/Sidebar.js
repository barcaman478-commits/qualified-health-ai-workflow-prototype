import { stages } from "../data.js";
import { Icon } from "../icons.js";

const { createElement: h } = window.React;

export function Sidebar({ collapsed, setCollapsed, activeStage, goToStage, unlockedThrough }) {
  const actions = [
    ["discover", "Discovery notes"],
    ["map", "Workflow canvas"],
    ["spark", "AI opportunities"],
    ["gauge", "Readiness score"],
    ["plan", "Deployment plan"]
  ];

  return h(
    "aside",
    { className: "sidebar", "aria-label": "Secondary navigation" },
    h("button", { className: "logo-button", "aria-label": "Qualified Health home" }, "Q"),
    h("button", { className: "collapse-button", onClick: () => setCollapsed(!collapsed), "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar" }, h(Icon, { name: "collapse" })),
    h(
      "nav",
      { className: "side-nav" },
      actions.map(([icon, label], index) =>
        h(
          "button",
          {
            key: label,
            className: `side-item ${activeStage === index ? "active" : ""}`,
            onClick: () => goToStage(index),
            title: label,
            "aria-label": label
          },
          h(Icon, { name: icon }),
          h("span", null, collapsed ? stages[index].number : label)
        )
      )
    ),
    h("div", { className: "sidebar-footer" }, h(Icon, { name: "info" }), h("span", null, "Safe AI"))
  );
}

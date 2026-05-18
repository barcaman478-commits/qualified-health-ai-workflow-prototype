import { Icon } from "../icons.js";

const { createElement: h } = window.React;

export function StageHeader({ title, subtitle, eyebrow, action }) {
  return h(
    "div",
    { className: "stage-header" },
    h("div", null, eyebrow ? h("p", { className: "eyebrow" }, eyebrow) : null, h("h1", null, title), h("p", null, subtitle)),
    action ? h("div", { className: "stage-actions" }, action) : null
  );
}

export function Button({ children, variant = "secondary", icon, ...props }) {
  return h(
    "button",
    { className: `button ${variant}`, ...props },
    icon ? h(Icon, { name: icon }) : null,
    h("span", null, children)
  );
}

export function Badge({ tone = "blue", children }) {
  return h("span", { className: `badge ${tone}` }, children);
}

export function Field({ label, help, children }) {
  return h("label", { className: "field" }, h("span", null, label, help ? h("small", { title: help }, " info") : null), children);
}

export function Panel({ children, className = "" }) {
  return h("section", { className: `panel ${className}` }, children);
}

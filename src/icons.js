const { createElement: h } = window.React;

function Svg({ children, size = 18, label, ...props }) {
  return h(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      role: label ? "img" : "presentation",
      "aria-label": label,
      ...props
    },
    children
  );
}

export function Icon({ name, size, label }) {
  const paths = {
    menu: [h("path", { key: "a", d: "M4 6h16M4 12h16M4 18h16" })],
    discover: [h("path", { key: "a", d: "M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" }), h("path", { key: "b", d: "m16 16 3 3" })],
    map: [h("path", { key: "a", d: "M4 7h6v6H4zM14 11h6v6h-6z" }), h("path", { key: "b", d: "M10 10h4" })],
    spark: [h("path", { key: "a", d: "m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" })],
    gauge: [h("path", { key: "a", d: "M4 14a8 8 0 0 1 16 0" }), h("path", { key: "b", d: "m12 14 4-5" }), h("path", { key: "c", d: "M6 18h12" })],
    plan: [h("path", { key: "a", d: "M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" })],
    plus: [h("path", { key: "a", d: "M12 5v14M5 12h14" })],
    trash: [h("path", { key: "a", d: "M4 7h16" }), h("path", { key: "b", d: "M10 11v6M14 11v6" }), h("path", { key: "c", d: "m9 7 1-2h4l1 2" }), h("path", { key: "d", d: "M7 7l1 13h8l1-13" })],
    edit: [h("path", { key: "a", d: "M12 20h9" }), h("path", { key: "b", d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" })],
    check: [h("path", { key: "a", d: "m5 12 4 4L19 6" })],
    alert: [h("circle", { key: "a", cx: 12, cy: 12, r: 9 }), h("path", { key: "b", d: "M12 7v6M12 17h.01" })],
    chevron: [h("path", { key: "a", d: "m9 18 6-6-6-6" })],
    filter: [h("path", { key: "a", d: "M4 5h16M7 12h10M10 19h4" })],
    share: [h("path", { key: "a", d: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" }), h("path", { key: "b", d: "M12 16V4" }), h("path", { key: "c", d: "m7 9 5-5 5 5" })],
    zoomIn: [h("circle", { key: "a", cx: 10, cy: 10, r: 6 }), h("path", { key: "b", d: "M21 21l-6-6M10 7v6M7 10h6" })],
    zoomOut: [h("circle", { key: "a", cx: 10, cy: 10, r: 6 }), h("path", { key: "b", d: "M21 21l-6-6M7 10h6" })],
    download: [h("path", { key: "a", d: "M12 3v12" }), h("path", { key: "b", d: "m7 10 5 5 5-5" }), h("path", { key: "c", d: "M5 21h14" })],
    info: [h("circle", { key: "a", cx: 12, cy: 12, r: 9 }), h("path", { key: "b", d: "M12 11v5M12 8h.01" })],
    collapse: [h("path", { key: "a", d: "m15 18-6-6 6-6" })]
  };
  return h(Svg, { size, label }, paths[name] || paths.info);
}

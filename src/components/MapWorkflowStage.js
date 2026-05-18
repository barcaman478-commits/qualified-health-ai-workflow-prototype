import { Button, Field, Panel, StageHeader } from "./ui.js";
import { Icon } from "../icons.js";

const { createElement: h, useMemo, useRef, useState } = window.React;

const baseNodeTypes = [
  { id: "patient", label: "Patient Action", color: "#2d945b" },
  { id: "system", label: "System / Admin", color: "#356fb9" },
  { id: "clinical", label: "Clinical Task", color: "#7447b3" },
  { id: "decision", label: "Decision", color: "#9b6b0e" },
  { id: "delay", label: "Delay", color: "#be3b4d" }
];

export function MapWorkflowStage({ lanes, setLanes, nodes, setNodes, edges, setEdges, onNext }) {
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(null);
  const [connectSource, setConnectSource] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [customTypes, setCustomTypes] = useState([]);
  const [newTask, setNewTask] = useState({ label: "", color: "#007ce6" });
  const canvasRef = useRef(null);

  const selected = nodes.find((node) => node.id === selectedId);
  const nodeById = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);
  const nodeTypes = useMemo(() => [...baseNodeTypes, ...customTypes], [customTypes]);

  function addNode(type, x = 120 + (nodes.length % 4) * 140, y = 80 + (nodes.length % 5) * 78) {
    const typeDef = nodeTypes.find((item) => item.id === type) || baseNodeTypes[0];
    const id = `${type}-${Date.now()}`;
    const laneIndex = Math.min(Math.floor(y / (620 / lanes.length)), lanes.length - 1);
    const node = { id, type, label: typeDef.label, color: typeDef.color, lane: lanes[laneIndex], x, y, system: "", duration: "", painType: "None", notes: "", evidence: "" };
    setNodes([...nodes, node]);
    setSelectedId(id);
  }

  function addCustomTask(event) {
    event.preventDefault();
    const label = newTask.label.trim();
    if (!label) return;
    const id = `custom-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || Date.now()}-${Date.now()}`;
    setCustomTypes([...customTypes, { id, label, color: newTask.color }]);
    setNewTask({ label: "", color: "#007ce6" });
  }

  function updateNode(id, patch) { setNodes(nodes.map((node) => (node.id === id ? { ...node, ...patch } : node))); }
  function removeNode(id) { setNodes(nodes.filter((node) => node.id !== id)); setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id)); setSelectedId(null); }
  function updateLane(index, value) { const previous = lanes[index]; const next = lanes.map((lane, laneIndex) => (laneIndex === index ? value : lane)); setLanes(next); setNodes(nodes.map((node) => (node.lane === previous ? { ...node, lane: value } : node))); }
  function startDrag(event, node) { if (event.button === 2) return; event.preventDefault(); setSelectedId(node.id); const rect = canvasRef.current.getBoundingClientRect(); setDragging({ id: node.id, offsetX: (event.clientX - rect.left) / zoom - node.x, offsetY: (event.clientY - rect.top) / zoom - node.y }); }
  function move(event) { if (!dragging || !canvasRef.current) return; const rect = canvasRef.current.getBoundingClientRect(); const x = (event.clientX - rect.left) / zoom - dragging.offsetX; const y = (event.clientY - rect.top) / zoom - dragging.offsetY; const laneIndex = Math.min(Math.max(0, Math.floor(y / (620 / lanes.length))), lanes.length - 1); updateNode(dragging.id, { x: Math.max(24, Math.min(820, x)), y: Math.max(20, Math.min(540, y)), lane: lanes[laneIndex] }); }
  function connectTo(nodeId) { if (!connectSource) { setConnectSource(nodeId); return; } if (connectSource !== nodeId && !edges.some((edge) => edge.source === connectSource && edge.target === nodeId)) { setEdges([...edges, { id: `e${Date.now()}`, source: connectSource, target: nodeId }]); } setConnectSource(null); }
  function toggleFriction(nodeId) { const node = nodeById[nodeId]; if (node) updateNode(nodeId, { friction: !node.friction }); }
  function dropOnCanvas(event) { event.preventDefault(); const type = event.dataTransfer.getData("application/qh-node-type"); if (!type || !canvasRef.current) return; const rect = canvasRef.current.getBoundingClientRect(); addNode(type, (event.clientX - rect.left) / zoom - 58, (event.clientY - rect.top) / zoom - 24); }

  const edgeLines = edges.map((edge) => { const source = nodeById[edge.source]; const target = nodeById[edge.target]; if (!source || !target) return null; return { ...edge, x1: source.x + 58, y1: source.y + 24, x2: target.x + 58, y2: target.y + 24 }; }).filter(Boolean);

  return h("div", { className: "stage map-stage" },
    h(StageHeader, { title: "Map Workflow: Current State", subtitle: "Build the process map from your discovery work. Drag tasks in, rename lanes, connect steps, and flag bottlenecks.", action: h("div", { className: "toolbar" }, h(Button, { onClick: () => setZoom(Math.max(.75, zoom - .1)), icon: "zoomOut", "aria-label": "Zoom out" }, `${Math.round(zoom * 100)}%`), h(Button, { onClick: () => setZoom(Math.min(1.4, zoom + .1)), icon: "zoomIn", "aria-label": "Zoom in" }, "Zoom"), h(Button, { onClick: onNext, variant: "primary", icon: "chevron" }, "Next Step")) }),
    h("div", { className: "map-layout" },
      h(Panel, { className: "node-palette" }, h("h2", null, "Add Tasks"), nodeTypes.map((taskType) => h("button", { key: taskType.id, className: `palette-node ${taskType.id}`, style: { "--task-color": taskType.color }, draggable: true, onDragStart: (event) => event.dataTransfer.setData("application/qh-node-type", taskType.id), onClick: () => addNode(taskType.id) }, h("span", { className: "node-swatch" }), taskType.label)), h("form", { className: "custom-task-form", onSubmit: addCustomTask }, h("h3", null, "Add Custom Task"), h(Field, { label: "Task Type" }, h("input", { value: newTask.label, onChange: (event) => setNewTask({ ...newTask, label: event.target.value }), placeholder: "Doctor, delivery specialist..." })), h("div", { className: "custom-color-row" }, h(Field, { label: "Color" }, h("input", { type: "color", value: newTask.color, onChange: (event) => setNewTask({ ...newTask, color: event.target.value }), "aria-label": "Custom task color" })), h(Button, { type: "submit", variant: "primary", icon: "plus" }, "Add"))), h("p", { className: "hint-text" }, "Drag a task onto the canvas or click once to add it. Select a task to edit it. Right-click a task to flag a bottleneck.")),
      h("div", { className: "workflow-shell" }, h("div", { className: "lane-labels editable" }, lanes.map((lane, index) => h("input", { key: index, value: lane, onChange: (event) => updateLane(index, event.target.value), "aria-label": `Lane ${index + 1}` }))), h("div", { className: "workflow-canvas", ref: canvasRef, onPointerMove: move, onPointerUp: () => setDragging(null), onPointerLeave: () => setDragging(null), onDrop: dropOnCanvas, onDragOver: (event) => event.preventDefault(), role: "application", "aria-label": "Workflow canvas" }, h("div", { className: "canvas-inner", style: { transform: `scale(${zoom})` } }, lanes.map((_, index) => h("div", { key: index, className: "lane-band", style: { top: `${(index * 620) / lanes.length}px`, height: `${620 / lanes.length}px` } })), h("svg", { className: "edge-layer", viewBox: "0 0 960 620", preserveAspectRatio: "none" }, edgeLines.map((edge) => h("path", { key: edge.id, d: `M ${edge.x1} ${edge.y1} C ${edge.x1 + 35} ${edge.y1}, ${edge.x2 - 35} ${edge.y2}, ${edge.x2} ${edge.y2}`, className: "edge-line" }))), nodes.map((node) => h("button", { key: node.id, className: `workflow-node ${node.type} ${selectedId === node.id ? "selected" : ""} ${connectSource === node.id ? "connecting" : ""}`, style: { left: `${node.x}px`, top: `${node.y}px`, "--task-color": node.color }, onPointerDown: (event) => startDrag(event, node), onClick: () => setSelectedId(node.id), onDoubleClick: () => connectTo(node.id), onContextMenu: (event) => { event.preventDefault(); toggleFriction(node.id); }, title: "Drag to move. Double-click to connect. Right-click to flag bottleneck." }, node.label, node.friction ? h("span", { className: "friction-dot", "aria-label": "Bottleneck" }, "!") : null))), nodes.length === 0 ? h("div", { className: "empty-canvas" }, h(Icon, { name: "map" }), h("strong", null, "Start with one workflow step"), h("p", null, "Add or drag tasks from the left. The canvas stays blank until you build the current state.")) : null), selected ? h(Panel, { className: "node-inspector floating-inspector" }, h("div", { className: "panel-title-row" }, h("h2", null, "Selected Task"), h("button", { className: "link-button", onClick: () => setSelectedId(null), "aria-label": "Close selected task editor" }, "Close")), h(Field, { key: "label", label: "Task Name" }, h("input", { value: selected.label, onChange: (event) => updateNode(selected.id, { label: event.target.value }) })), h(Field, { key: "type", label: "Task Type" }, h("select", { value: selected.type, onChange: (event) => { const nextType = nodeTypes.find((item) => item.id === event.target.value); updateNode(selected.id, { type: event.target.value, color: nextType?.color || selected.color }); } }, nodeTypes.map((taskType) => h("option", { key: taskType.id, value: taskType.id }, taskType.label)))), h(Field, { key: "lane", label: "Owner / Lane" }, h("select", { value: selected.lane, onChange: (event) => updateNode(selected.id, { lane: event.target.value }) }, lanes.map((lane) => h("option", { key: lane, value: lane }, lane)))), h("div", { className: "form-grid two compact-fields" }, h(Field, { key: "system", label: "System" }, h("input", { value: selected.system || "", onChange: (event) => updateNode(selected.id, { system: event.target.value }), placeholder: "EHR, inbox, phone..." })), h(Field, { key: "duration", label: "Avg Time" }, h("input", { value: selected.duration || "", onChange: (event) => updateNode(selected.id, { duration: event.target.value }), placeholder: "5 min, 2 hrs..." }))), h(Field, { key: "pain", label: "Pain-Point Type" }, h("select", { value: selected.painType || "None", onChange: (event) => updateNode(selected.id, { painType: event.target.value }) }, ["None", "Delay", "Rework", "Manual Entry", "Unclear Ownership", "Compliance Risk"].map((value) => h("option", { key: value, value }, value)))), h(Field, { key: "notes", label: "Task Notes" }, h("textarea", { value: selected.notes || "", onChange: (event) => updateNode(selected.id, { notes: event.target.value }), placeholder: "What happens here? What makes it difficult?" })), h(Field, { key: "evidence", label: "Evidence Source" }, h("input", { value: selected.evidence || "", onChange: (event) => updateNode(selected.id, { evidence: event.target.value }), placeholder: "Interview, shadowing, KPI, SOP..." })), h("div", { key: "actions", className: "inspector-actions" }, h(Button, { onClick: () => connectTo(selected.id), icon: "map" }, connectSource ? "Connect Here" : "Start Line"), h(Button, { onClick: () => toggleFriction(selected.id), icon: "alert" }, selected.friction ? "Clear Bottleneck" : "Flag Bottleneck"), h(Button, { onClick: () => removeNode(selected.id), icon: "alert" }, "Remove"))) : null, h("div", { className: "legend" }, nodeTypes.map((taskType) => h("span", { key: taskType.id }, h("i", { className: taskType.id, style: { "--task-color": taskType.color } }), taskType.label)), h("span", null, h("i", { className: "handoff" }), "Connection"), h("span", null, h("i", { className: "friction" }), "Bottleneck")))
    )
  );
}

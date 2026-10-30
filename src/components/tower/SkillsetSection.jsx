"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  Terminal,
  Grid,
  Activity,
  Check,
} from "lucide-react";

const NODES = [
  {
    id: "node-frontend",
    title: "Client & Web Surface",
    type: "INPUT_UI // Web Surface",
    category: "Client Tier",
    color: "#38bdf8",
    badgeColor: "text-sky-400 border-sky-400/30 bg-sky-950/40",
    headerBg: "bg-sky-500/15 border-b border-sky-500/30",
    dotColor: "bg-sky-400",
    inputs: [
      { id: "frontend-in-viewport", label: "viewport_stream", type: "STREAM", color: "#38bdf8" },
      { id: "frontend-in-tokens", label: "design_system", type: "TOKENS", color: "#a855f7" },
    ],
    outputs: [
      { id: "frontend-out-vdom", label: "virtual_dom", type: "DOM", color: "#38bdf8" },
      { id: "frontend-out-http", label: "http_client_req", type: "HTTP", color: "#34d399" },
    ],
    stacks: [
      "React 19 & Next.js 16",
      "TypeScript & Strict ESM",
      "Tailwind CSS & Micro-Materials",
      "GSAP & Web Motion",
      "WebGL & Three.js",
    ],
  },
  {
    id: "node-mobile",
    title: "Mobile App Runtime",
    type: "MOBILE_RUNTIME // Native App",
    category: "Client Tier",
    color: "#a855f7",
    badgeColor: "text-purple-400 border-purple-400/30 bg-purple-950/40",
    headerBg: "bg-purple-500/15 border-b border-purple-500/30",
    dotColor: "bg-purple-400",
    inputs: [
      { id: "mobile-in-touch", label: "touch_gestures", type: "TOUCH", color: "#a855f7" },
    ],
    outputs: [
      { id: "mobile-out-rpc", label: "mobile_rpc", type: "RPC", color: "#34d399" },
      { id: "mobile-out-bundle", label: "native_bundle", type: "BUNDLE", color: "#a855f7" },
    ],
    stacks: [
      "Flutter & Dart",
      "React Native & Expo",
      "Mobile State Architecture",
      "Touch Ergonomics & Native UI",
    ],
  },
  {
    id: "node-backend",
    title: "Backend & Gateway Services",
    type: "API_GATEWAY // Services",
    category: "Service Tier",
    color: "#34d399",
    badgeColor: "text-emerald-400 border-emerald-400/30 bg-emerald-950/40",
    headerBg: "bg-emerald-500/15 border-b border-emerald-500/30",
    dotColor: "bg-emerald-400",
    inputs: [
      { id: "backend-in-http", label: "http_client_req", type: "HTTP", color: "#34d399" },
      { id: "backend-in-rpc", label: "mobile_rpc", type: "RPC", color: "#34d399" },
    ],
    outputs: [
      { id: "backend-out-query", label: "query_bus", type: "QUERY", color: "#fbbf24" },
      { id: "backend-out-auth", label: "auth_context", type: "AUTH", color: "#38bdf8" },
    ],
    stacks: [
      "Node.js & Express / Nest",
      "Go (Golang)",
      "Python & FastAPI",
      "RESTful & GraphQL APIs",
      "Event Systems & Message Queues",
    ],
  },
  {
    id: "node-database",
    title: "Data & Persistence Engine",
    type: "DATA_ENGINE // Persistence",
    category: "Service Tier",
    color: "#fbbf24",
    badgeColor: "text-amber-400 border-amber-400/30 bg-amber-950/40",
    headerBg: "bg-amber-500/15 border-b border-amber-500/30",
    dotColor: "bg-amber-400",
    inputs: [
      { id: "database-in-query", label: "query_bus", type: "QUERY", color: "#fbbf24" },
    ],
    outputs: [
      { id: "database-out-state", label: "rehydrated_state", type: "DATA", color: "#fbbf24" },
    ],
    stacks: [
      "PostgreSQL & SQLite",
      "MySQL Enterprise",
      "Prisma ORM & Migrations",
      "Redis Caching Layer",
    ],
  },
  {
    id: "node-production",
    title: "Production System Delivery",
    type: "OUTPUT_SYSTEM // Live Delivery",
    category: "Output Tier",
    color: "#f43f5e",
    badgeColor: "text-rose-400 border-rose-400/30 bg-rose-950/40",
    headerBg: "bg-rose-500/15 border-b border-rose-500/30",
    dotColor: "bg-rose-400",
    inputs: [
      { id: "production-in-vdom", label: "virtual_dom", type: "DOM", color: "#38bdf8" },
      { id: "production-in-bundle", label: "native_bundle", type: "BUNDLE", color: "#a855f7" },
      { id: "production-in-auth", label: "auth_context", type: "AUTH", color: "#38bdf8" },
      { id: "production-in-state", label: "rehydrated_state", type: "DATA", color: "#fbbf24" },
    ],
    outputs: [
      { id: "production-out-health", label: "live_system_health", type: "STATUS", color: "#34d399" },
    ],
    stacks: [
      "Docker Containers & Virtualization",
      "Automated CI/CD Workflows",
      "Nginx & Linux Hardening",
      "Core Web Vitals Optimization",
      "TDD & High Availability",
    ],
  },
];

const CONNECTIONS = [
  { from: "frontend-out-vdom", to: "production-in-vdom", color: "#38bdf8", label: "VIRTUAL_DOM" },
  { from: "frontend-out-http", to: "backend-in-http", color: "#34d399", label: "HTTP_REQ" },
  { from: "mobile-out-rpc", to: "backend-in-rpc", color: "#34d399", label: "MOBILE_RPC" },
  { from: "mobile-out-bundle", to: "production-in-bundle", color: "#a855f7", label: "NATIVE_BUNDLE" },
  { from: "backend-out-query", to: "database-in-query", color: "#fbbf24", label: "QUERY_BUS" },
  { from: "backend-out-auth", to: "production-in-auth", color: "#38bdf8", label: "AUTH_CONTEXT" },
  { from: "database-out-state", to: "production-in-state", color: "#fbbf24", label: "REHYDRATED_DATA" },
];

function getBezierPath(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  if (x2 > x1 + 15) {
    const cx1 = x1 + Math.max(35, dx * 0.5);
    const cy1 = y1;
    const cx2 = x2 - Math.max(35, dx * 0.5);
    const cy2 = y2;
    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  } else {
    const offset = Math.max(40, dy * 0.4);
    const cx1 = x1 + 45;
    const cy1 = y1 + offset;
    const cx2 = x2 - 45;
    const cy2 = y2 - offset;
    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  }
}

export default function SkillsetSection() {
  const containerRef = useRef(null);
  const [wires, setWires] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredSocket, setHoveredSocket] = useState(null);
  const [isRunning, setIsRunning] = useState(true);
  const [executionState, setExecutionState] = useState("Idle");
  const [viewMode, setViewMode] = useState("graph"); // "graph" | "cards"

  const calculateWires = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const calculated = CONNECTIONS.map((conn) => {
      const fromEl = containerRef.current.querySelector(`[data-socket-id="${conn.from}"]`);
      const toEl = containerRef.current.querySelector(`[data-socket-id="${conn.to}"]`);

      if (!fromEl || !toEl) return null;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
      const x2 = toRect.left + toRect.width / 2 - containerRect.left;
      const y2 = toRect.top + toRect.height / 2 - containerRect.top;

      const path = getBezierPath(x1, y1, x2, y2);

      return {
        ...conn,
        x1,
        y1,
        x2,
        y2,
        path,
      };
    }).filter(Boolean);

    setWires(calculated);
  }, []);

  useEffect(() => {
    calculateWires();

    const resizeObserver = new ResizeObserver(() => {
      calculateWires();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const timer = setTimeout(calculateWires, 100);
    window.addEventListener("resize", calculateWires);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateWires);
    };
  }, [calculateWires, viewMode]);

  const handleRunPipeline = () => {
    setIsRunning(true);
    setExecutionState("Executing Nodes (1/5)...");
    setTimeout(() => setExecutionState("Processing Data Streams (3/5)..."), 400);
    setTimeout(() => setExecutionState("Assembling Production Graph (5/5)..."), 800);
    setTimeout(() => setExecutionState("Pipeline Active (100% OK)"), 1200);
  };

  const isWireHighlighted = (wire) => {
    if (!hoveredNode && !hoveredSocket) return true;
    if (hoveredSocket) {
      return wire.from === hoveredSocket || wire.to === hoveredSocket;
    }
    if (hoveredNode) {
      const node = NODES.find((n) => n.id === hoveredNode);
      if (!node) return false;
      const isFromNode = node.outputs.some((o) => o.id === wire.from);
      const isToNode = node.inputs.some((i) => i.id === wire.to);
      return isFromNode || isToNode;
    }
    return true;
  };

  return (
    <section id="capabilities" className="py-12 lg:py-16 scroll-mt-24">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
                Full-Stack Architecture & Pipeline
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
              Engineering Stack Workflow
            </h2>
            <p className="mt-2 text-sm md:text-base text-stone-600 dark:text-stone-300 max-w-xl">
              All tools interconnect as a unified node graph—from client interaction, backend routing, down to persistent storage and live production infrastructure.
            </p>
          </div>

          {/* ComfyUI Top Controls & View Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* <button
              onClick={() => setViewMode(viewMode === "graph" ? "cards" : "graph")}
              className="liquid-glass-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300"
            >
              <Grid className="h-3.5 w-3.5" />
              <span>{viewMode === "graph" ? "Cards View" : "Graph View"}</span>
            </button> */}

            <button
              onClick={handleRunPipeline}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.7),0_4px_12px_-2px_rgba(245,158,11,0.35)] transition-all active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Queue Prompt / Run</span>
            </button>
          </div>
        </div>

        {/* ComfyUI Canvas Container */}
        <div
          ref={containerRef}
          className="relative rounded-3xl border border-stone-300/80 dark:border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl bg-stone-100/90 dark:bg-[#0c101c]/95"
        >
          {/* Subtle ComfyUI Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* ComfyUI Workspace Chrome / Window Header */}
          <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-stone-200 dark:border-white/10 px-4 py-2.5 bg-white/70 dark:bg-black/40 text-xs backdrop-blur-md gap-2">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                Graph:
              </span>
              <span className="px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-white/10 text-stone-800 dark:text-stone-200">
                fullstack_production_pipeline.json
              </span>
              <span className="hidden sm:inline text-stone-400 dark:text-stone-500">
                / 5 Nodes · 7 Connections
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                <Activity className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span>{executionState === "Idle" ? "Status: Live Graph" : executionState}</span>
              </div>

              <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                <Check className="h-3 w-3" />
                <span>ALL_STACKS_ACTIVE</span>
              </div>
            </div>
          </div>

          {/* SVG Connection Layer */}
          {viewMode === "graph" && (
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full z-10"
              style={{ overflow: "hidden" }}
            >
              <defs>
                <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {wires.map((wire, idx) => {
                const highlighted = isWireHighlighted(wire);
                return (
                  <g key={`${wire.from}-${wire.to}-${idx}`}>
                    {/* Shadow / Glow line */}
                    <path
                      d={wire.path}
                      fill="none"
                      stroke={wire.color}
                      strokeWidth={highlighted ? "5" : "1.5"}
                      strokeOpacity={highlighted ? "0.25" : "0.05"}
                      filter="url(#wire-glow)"
                    />

                    {/* Main Bezier Cable */}
                    <path
                      d={wire.path}
                      fill="none"
                      stroke={wire.color}
                      strokeWidth={highlighted ? "2.5" : "1.5"}
                      strokeOpacity={highlighted ? "0.9" : "0.2"}
                      strokeDasharray={isRunning ? "6 5" : "none"}
                      className={isRunning ? "animate-flow-dash" : ""}
                    />

                    {/* Animated Light Packet traveling through wire */}
                    {isRunning && highlighted && (
                      <circle
                        r="3.5"
                        fill={wire.color}
                        className="drop-shadow-[0_0_6px_currentColor]"
                      >
                        <animateMotion
                          path={wire.path}
                          dur="1.8s"
                          repeatCount="indefinite"
                          begin={`${(idx * 0.2).toFixed(2)}s`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
          )}

          {/* Nodes Pipeline Canvas Content */}
          <div className="relative z-20 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* STAGE 1: Client Interfaces (Frontend & Mobile) */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>Stage 1 // Client Execution</span>
                </div>

                <ComfyNodeCard
                  node={NODES[0]} // Frontend
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                  hoveredSocket={hoveredSocket}
                  setHoveredSocket={setHoveredSocket}
                />

                <ComfyNodeCard
                  node={NODES[1]} // Mobile
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                  hoveredSocket={hoveredSocket}
                  setHoveredSocket={setHoveredSocket}
                />
              </div>

              {/* STAGE 2: Service Layer & Persistence (Backend & Database) */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Stage 2 // API & Data Engine</span>
                </div>

                <ComfyNodeCard
                  node={NODES[2]} // Backend
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                  hoveredSocket={hoveredSocket}
                  setHoveredSocket={setHoveredSocket}
                />

                <ComfyNodeCard
                  node={NODES[3]} // Database
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                  hoveredSocket={hoveredSocket}
                  setHoveredSocket={setHoveredSocket}
                />
              </div>

              {/* STAGE 3: Production Delivery & Operations */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  <span>Stage 3 // Production Delivery</span>
                </div>

                <ComfyNodeCard
                  node={NODES[4]} // Production
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                  hoveredSocket={hoveredSocket}
                  setHoveredSocket={setHoveredSocket}
                  isTerminal
                />

                {/* ComfyUI Mini-Map & System Stats Widget */}
                <div className="rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-black/40 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-600 dark:text-stone-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-amber-500" />
                      <span>Pipeline Summary</span>
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold">READY</span>
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    Every production deployment integrates client state, API contracts, persistent storage, and automated cloud CI/CD.
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono text-stone-500 dark:text-stone-400 border-t border-stone-200/60 dark:border-white/5 pt-2">
                    <div>NODES: 5 Active</div>
                    <div>LATENCY: &lt;15ms</div>
                    <div>PROTOCOL: HTTP/3 + RPC</div>
                    <div>COVERAGE: 100% Stack</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComfyNodeCard({
  node,
  hoveredNode,
  setHoveredNode,
  hoveredSocket,
  setHoveredSocket,
  isTerminal = false,
}) {
  const isSelected = hoveredNode === node.id;
  const isDimmed = hoveredNode && hoveredNode !== node.id;

  return (
    <div
      onMouseEnter={() => setHoveredNode(node.id)}
      onMouseLeave={() => setHoveredNode(null)}
      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${isSelected
          ? "border-amber-500/70 dark:border-amber-400/60 shadow-[0_12px_32px_-8px_rgba(245,158,11,0.25)] scale-[1.01]"
          : isDimmed
            ? "border-stone-200/60 dark:border-white/5 opacity-85"
            : "border-stone-300 dark:border-white/10 hover:border-stone-400 dark:hover:border-white/25 shadow-lg"
        } bg-white/85 dark:bg-[#121626]/90 backdrop-blur-xl`}
    >
      {/* Node Header Strip (ComfyUI Titlebar Style) */}
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 ${node.headerBg} select-none`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`h-2.5 w-2.5 rounded-full ${node.dotColor} shrink-0 shadow-sm`} />
          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
            {node.title}
          </span>
        </div>

        <span
          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${node.badgeColor}`}
        >
          {node.category}
        </span>
      </div>

      {/* Sockets & Body Area */}
      <div className="p-3.5 space-y-3">
        {/* Left Inputs & Right Outputs Sockets Bar */}
        <div className="flex items-start justify-between gap-2 text-[10px] font-mono">
          {/* Inputs */}
          <div className="flex flex-col gap-2">
            {node.inputs.map((input) => (
              <div
                key={input.id}
                onMouseEnter={() => setHoveredSocket(input.id)}
                onMouseLeave={() => setHoveredSocket(null)}
                className="flex items-center gap-1.5 cursor-pointer text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <div
                  data-socket-id={input.id}
                  className="h-3 w-3 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center transition-transform hover:scale-125"
                  style={{ backgroundColor: `${input.color}25` }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: input.color }}
                  />
                </div>
                <span className="truncate max-w-[100px]">{input.label}</span>
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div className="flex flex-col gap-2 items-end">
            {node.outputs.map((output) => (
              <div
                key={output.id}
                onMouseEnter={() => setHoveredSocket(output.id)}
                onMouseLeave={() => setHoveredSocket(null)}
                className="flex items-center gap-1.5 cursor-pointer text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <span className="truncate max-w-[100px] text-right">{output.label}</span>
                <div
                  data-socket-id={output.id}
                  className="h-3 w-3 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center transition-transform hover:scale-125"
                  style={{ backgroundColor: `${output.color}25` }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: output.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack Items (ComfyUI Internal Parameter Widgets) */}
        <div className="space-y-1.5 pt-1 border-t border-stone-200/60 dark:border-white/5">
          <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500 px-1 uppercase tracking-wider">
            Active Parameters:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {node.stacks.map((stack) => (
              <span
                key={stack}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-black/40 border border-stone-200 dark:border-white/5 text-stone-700 dark:text-stone-300"
              >
                <span className="h-1 w-1 rounded-full bg-amber-500/80" />
                <span>{stack}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

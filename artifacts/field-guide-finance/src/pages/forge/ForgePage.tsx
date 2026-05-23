import { useState, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { ELEMENTS, ELEMENT_MAP, FORGE_MODULES } from "@/data/forgeData";
import { runReckoning, getSuggestedLabels } from "@/lib/reckoning";
import type { ForgeNode, ForgeConnection, ReckoningResult } from "@/lib/reckoning";
import { saveToLibrary, markModuleComplete, incrementPatternsNamed } from "@/lib/forgeStorage";
import { ForgeNav } from "@/components/forge/ForgeNav";
import type { ElementId } from "@/data/forgeData";

let _nodeCounter = 0;
function newNodeId() { return `node-${++_nodeCounter}-${Date.now()}`; }
function newConnId() { return `conn-${++_nodeCounter}-${Date.now()}`; }

type Phase = "build" | "reckoning" | "codetry" | "faction-comment";

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
  moved: boolean;
  pointerId: number;
}

export function ForgePage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const moduleId = params.get("module");
  const mod = moduleId ? FORGE_MODULES.find((m) => m.id === moduleId) : null;

  const [nodes, setNodes] = useState<ForgeNode[]>(() =>
    mod ? mod.startingNodes.map((n) => ({ ...n })) : []
  );
  const [connections, setConnections] = useState<ForgeConnection[]>(() =>
    mod ? mod.startingConnections.map((c) => ({ id: newConnId(), fromId: c.fromId, toId: c.toId })) : []
  );

  const [phase, setPhase] = useState<Phase>("build");
  const [reckoningResult, setReckoningResult] = useState<ReckoningResult | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [pendingElement, setPendingElement] = useState<ElementId | null>(null);
  const [patternName, setPatternName] = useState("");
  const [suggestedLabels, setSuggestedLabels] = useState<string[]>([]);
  const [savedName, setSavedName] = useState<string | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<DragState | null>(null);

  function svgPoint(clientX: number, clientY: number) {
    const svg = canvasRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

  function handleSvgPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const target = e.target as Element;
    const nodeGroup = target.closest("[data-node-id]") as Element | null;

    if (nodeGroup) {
      const nodeId = nodeGroup.getAttribute("data-node-id")!;
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
      const { x, y } = svgPoint(e.clientX, e.clientY);
      dragging.current = {
        id: nodeId,
        offsetX: x - node.x,
        offsetY: y - node.y,
        moved: false,
        pointerId: e.pointerId,
      };
      canvasRef.current?.setPointerCapture(e.pointerId);
      e.stopPropagation();
      return;
    }

    const isBackground =
      target === canvasRef.current ||
      target.tagName === "rect" ||
      target.tagName === "text" ||
      target.tagName === "svg";

    if (isBackground && pendingElement) {
      const { x, y } = svgPoint(e.clientX, e.clientY);
      setNodes((prev) => [
        ...prev,
        { id: newNodeId(), elementId: pendingElement, x, y },
      ]);
      setPendingElement(null);
      e.stopPropagation();
    }
  }

  function handleSvgPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging.current || dragging.current.pointerId !== e.pointerId) return;
    const svg = canvasRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left - dragging.current.offsetX, 30, rect.width - 30);
    const y = clamp(e.clientY - rect.top - dragging.current.offsetY, 30, rect.height - 50);
    if (Math.abs(x - (nodes.find((n) => n.id === dragging.current!.id)?.x ?? x)) > 3 ||
        Math.abs(y - (nodes.find((n) => n.id === dragging.current!.id)?.y ?? y)) > 3) {
      dragging.current.moved = true;
    }
    setNodes((prev) =>
      prev.map((n) => (n.id === dragging.current!.id ? { ...n, x, y } : n))
    );
  }

  function handleSvgPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging.current || dragging.current.pointerId !== e.pointerId) {
      dragging.current = null;
      return;
    }
    const wasDrag = dragging.current.moved;
    const nodeId = dragging.current.id;
    dragging.current = null;

    if (!wasDrag) {
      handleNodeTap(nodeId);
    }
  }

  function handleNodeTap(nodeId: string) {
    if (connectingFrom) {
      if (connectingFrom === nodeId) {
        setConnectingFrom(null);
        return;
      }
      const exists = connections.some(
        (c) =>
          (c.fromId === connectingFrom && c.toId === nodeId) ||
          (c.fromId === nodeId && c.toId === connectingFrom)
      );
      if (!exists) {
        setConnections((prev) => [
          ...prev,
          { id: newConnId(), fromId: connectingFrom, toId: nodeId },
        ]);
      }
      setConnectingFrom(null);
    } else {
      setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
    }
  }

  function handleSvgClick(e: React.MouseEvent<SVGSVGElement>) {
    const target = e.target as Element;
    const isBackground =
      target === canvasRef.current ||
      target.tagName === "rect" ||
      target.tagName === "svg";
    if (!isBackground) return;
    if (dragging.current) return;
    setSelectedNodeId(null);
    if (connectingFrom) setConnectingFrom(null);
  }

  function handleDropOnCanvas(e: React.DragEvent<SVGSVGElement>) {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("elementId");
    if (!elementId) return;
    const { x, y } = svgPoint(e.clientX, e.clientY);
    setNodes((prev) => [...prev, { id: newNodeId(), elementId: elementId as ElementId, x, y }]);
  }

  function removeNode(nodeId: string) {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.fromId !== nodeId && c.toId !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }

  function removeConnection(connId: string) {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  }

  function submitReckoning() {
    const result = runReckoning(nodes, connections);
    setReckoningResult(result);
    setPhase("reckoning");
    if (result.stable) setSuggestedLabels(getSuggestedLabels(nodes, connections));
  }

  function commitToLibrary() {
    if (!patternName.trim()) return;
    const elementCounts: Record<string, number> = {};
    for (const n of nodes) {
      elementCounts[n.elementId] = (elementCounts[n.elementId] || 0) + 1;
    }
    saveToLibrary({
      name: patternName.trim(),
      elementCounts,
      connectionCount: connections.length,
      moduleId: moduleId ?? undefined,
    });
    incrementPatternsNamed();
    if (moduleId) markModuleComplete(moduleId);
    setSavedName(patternName.trim());
    setPhase("faction-comment");
  }

  function resetForge() {
    setNodes([]);
    setConnections([]);
    setPhase("build");
    setReckoningResult(null);
    setSelectedNodeId(null);
    setConnectingFrom(null);
    setPendingElement(null);
    setPatternName("");
    setSavedName(null);
  }

  return (
    <div
      className="forge-bg"
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
      }}
    >
      <ForgeNav active="forge" />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <Sidebar
          pendingElement={pendingElement}
          onSelectElement={(id) => {
            setPendingElement((prev) => (prev === id ? null : id));
            setSelectedNodeId(null);
            setConnectingFrom(null);
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {mod && (
            <div
              style={{
                padding: "6px 10px 6px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                backgroundColor: "rgba(255,107,43,0.07)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  color: "var(--forge-orange)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {mod.pillar}
              </span>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--forge-muted)",
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {mod.conceptName}
              </span>
              <button
                onClick={() => navigate(`/forge/module/${mod.id}`)}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "var(--forge-muted)",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  padding: "3px 8px",
                  flexShrink: 0,
                  minHeight: 28,
                  whiteSpace: "nowrap",
                }}
              >
                ← Lesson
              </button>
            </div>
          )}

          <svg
            ref={canvasRef}
            style={{
              flex: 1,
              cursor: pendingElement
                ? "crosshair"
                : connectingFrom
                ? "crosshair"
                : "default",
              touchAction: "none",
              display: "block",
            }}
            onPointerDown={handleSvgPointerDown}
            onPointerMove={handleSvgPointerMove}
            onPointerUp={handleSvgPointerUp}
            onPointerCancel={() => { dragging.current = null; }}
            onClick={handleSvgClick}
            onDrop={handleDropOnCanvas}
            onDragOver={(e) => e.preventDefault()}
          >
            <defs>
              {["fire", "water", "earth", "air", "aether"].map((id) => (
                <filter key={id} id={`glow-${id}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              ))}
            </defs>

            <rect width="100%" height="100%" fill="transparent" />

            {nodes.length === 0 && (
              <text
                x="50%" y="45%"
                dominantBaseline="middle"
                textAnchor="middle"
                style={{
                  fill: "rgba(255,255,255,0.12)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-sans)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {pendingElement
                  ? `Tap to place ${ELEMENT_MAP[pendingElement].name}`
                  : "Tap an element in the sidebar, then tap here to place it"}
              </text>
            )}

            {pendingElement && nodes.length > 0 && (
              <text
                x="50%" y="92%"
                dominantBaseline="middle"
                textAnchor="middle"
                style={{
                  fill: ELEMENT_MAP[pendingElement].color,
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-sans)",
                  pointerEvents: "none",
                  userSelect: "none",
                  fontWeight: 700,
                }}
              >
                Tap canvas to place {ELEMENT_MAP[pendingElement].emoji} {ELEMENT_MAP[pendingElement].name}
              </text>
            )}

            {connections.map((conn) => {
              const from = nodes.find((n) => n.id === conn.fromId);
              const to = nodes.find((n) => n.id === conn.toId);
              if (!from || !to) return null;
              const el1 = ELEMENT_MAP[from.elementId];
              const el2 = ELEMENT_MAP[to.elementId];
              const affectedConns = reckoningResult?.findings
                .filter((f) => f.severity === "critical")
                .flatMap((f) => f.affectedNodeIds) ?? [];
              const isWeak = affectedConns.includes(from.id) || affectedConns.includes(to.id);
              return (
                <g key={conn.id}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isWeak ? "#F59E0B" : el1.color}
                    strokeWidth={isWeak ? 3 : 1.5}
                    strokeDasharray={isWeak ? "6 4" : "none"}
                    opacity={0.6}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => { e.stopPropagation(); removeConnection(conn.id); }}
                  />
                  {[0.35, 0.65].map((t) => (
                    <circle
                      key={t}
                      cx={from.x + (to.x - from.x) * t}
                      cy={from.y + (to.y - from.y) * t}
                      r={2.5}
                      fill={el2.color}
                      opacity={0.5}
                      style={{ pointerEvents: "none" }}
                    />
                  ))}
                </g>
              );
            })}

            {nodes.map((node) => {
              const el = ELEMENT_MAP[node.elementId];
              const isSelected = selectedNodeId === node.id;
              const isConnecting = connectingFrom === node.id;
              const affectedIds = reckoningResult?.findings
                .filter((f) => f.severity === "critical")
                .flatMap((f) => f.affectedNodeIds) ?? [];
              const isAffected = affectedIds.includes(node.id);
              const r = 26;
              return (
                <g
                  key={node.id}
                  data-node-id={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "grab" }}
                >
                  {(isSelected || isConnecting) && (
                    <circle
                      r={r + 9}
                      fill="none"
                      stroke={el.color}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      opacity={0.6}
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                  {isAffected && (
                    <circle r={r + 6} fill="none" stroke="#F59E0B" strokeWidth={2} opacity={0.7}
                      style={{ pointerEvents: "none" }}>
                      <animate attributeName="r" values={`${r + 4};${r + 8};${r + 4}`} dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    r={r}
                    fill={`${el.color}22`}
                    stroke={el.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={`url(#glow-${node.elementId})`}
                    style={{ pointerEvents: "none" }}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: 17, pointerEvents: "none", userSelect: "none" }}
                  >
                    {el.emoji}
                  </text>
                  <text
                    y={r + 13}
                    textAnchor="middle"
                    style={{
                      fontSize: "0.62rem",
                      fill: el.color,
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {el.name}
                  </text>

                  {isSelected && (
                    <g style={{ pointerEvents: "all" }}>
                      <circle
                        cx={r + 4} cy={-(r + 4)} r={12}
                        fill="#1a1a2e"
                        stroke="rgba(255,100,100,0.5)"
                        strokeWidth={1}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                      />
                      <text
                        x={r + 4} y={-(r + 4)}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontSize: "0.7rem",
                          fill: "rgba(255,100,100,0.9)",
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        ✕
                      </text>
                      <circle
                        cx={-(r + 4)} cy={-(r + 4)} r={12}
                        fill="#1a1a2e"
                        stroke={connectingFrom === node.id ? el.color : "rgba(255,255,255,0.25)"}
                        strokeWidth={1}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setConnectingFrom((prev) => (prev === node.id ? null : node.id));
                          setSelectedNodeId(null);
                        }}
                      />
                      <text
                        x={-(r + 4)} y={-(r + 4)}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontSize: "0.75rem",
                          fill: el.color,
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        ⬡
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          <div
            style={{
              flexShrink: 0,
              padding: "8px 12px",
              paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
              paddingRight: "calc(12px + 88px)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(0,0,0,0.4)",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.7rem", color: "var(--forge-muted)", flexShrink: 0 }}>
              {nodes.length} node{nodes.length !== 1 ? "s" : ""} ·{" "}
              {connections.length} conn{connections.length !== 1 ? "s" : ""}
            </span>
            {connectingFrom && (
              <span style={{ fontSize: "0.7rem", color: "var(--forge-orange)", fontWeight: 600, flexShrink: 0 }}>
                Tap a node to connect →
              </span>
            )}
            {pendingElement && (
              <span style={{ fontSize: "0.7rem", color: ELEMENT_MAP[pendingElement].color, fontWeight: 600, flexShrink: 0 }}>
                {ELEMENT_MAP[pendingElement].emoji} Tap canvas to place
              </span>
            )}
            <div style={{ flex: 1, minWidth: 0 }} />
            <button
              onClick={resetForge}
              style={{
                padding: "6px 12px",
                borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "none",
                color: "var(--forge-muted)",
                fontSize: "0.76rem",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                minHeight: 36,
                flexShrink: 0,
              }}
            >
              Clear
            </button>
            <button
              onClick={submitReckoning}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "var(--forge-orange)",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                minHeight: 36,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Submit to Reckoning →
            </button>
          </div>
        </div>
      </div>

      {phase === "reckoning" && reckoningResult && (
        <ReckoningOverlay
          result={reckoningResult}
          onReturn={() => setPhase("build")}
          onCodetry={() => setPhase("codetry")}
        />
      )}

      {phase === "codetry" && (
        <CodetryModal
          suggestedLabels={suggestedLabels}
          patternName={patternName}
          onNameChange={setPatternName}
          onCommit={commitToLibrary}
          onBack={() => setPhase("reckoning")}
        />
      )}

      {phase === "faction-comment" && savedName && (
        <FactionCommentOverlay
          patternName={savedName}
          nodes={nodes}
          onDone={() => { resetForge(); navigate("/forge/library"); }}
          onBuildAgain={resetForge}
        />
      )}
    </div>
  );
}

function Sidebar({
  pendingElement,
  onSelectElement,
}: {
  pendingElement: ElementId | null;
  onSelectElement: (id: ElementId) => void;
}) {
  return (
    <div
      style={{
        width: 80,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: "10px 6px",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <p
        style={{
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--forge-muted)",
          textAlign: "center",
          marginBottom: 2,
          flexShrink: 0,
        }}
      >
        Primitives
      </p>
      {ELEMENTS.map((el) => {
        const isPending = pendingElement === el.id;
        return (
          <button
            key={el.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("elementId", el.id)}
            onClick={() => onSelectElement(el.id)}
            style={{
              borderRadius: 9,
              border: `1px solid ${isPending ? el.color : el.color + "50"}`,
              backgroundColor: isPending ? `${el.color}30` : `${el.color}10`,
              padding: "8px 4px",
              textAlign: "center",
              cursor: "pointer",
              userSelect: "none",
              transition: "transform 0.12s, box-shadow 0.12s, background-color 0.12s",
              boxShadow: isPending ? `0 0 14px ${el.glowColor}` : "none",
              transform: isPending ? "scale(1.06)" : "scale(1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              background: "none",
              fontFamily: "var(--font-sans)",
              minHeight: 44,
              width: "100%",
            }}
            title={`${el.name} — ${el.pillar}`}
          >
            <span style={{ fontSize: 20 }}>{el.emoji}</span>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: el.color, display: "block" }}>
              {el.name}
            </span>
          </button>
        );
      })}

      <div
        style={{
          marginTop: "auto",
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.54rem",
            color: "var(--forge-muted)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Tap to select, tap canvas to place
        </p>
      </div>
    </div>
  );
}

function ReckoningOverlay({
  result,
  onReturn,
  onCodetry,
}: {
  result: ReckoningResult;
  onReturn: () => void;
  onCodetry: () => void;
}) {
  const severityColor = { critical: "#F87171", warning: "#F59E0B", info: "#34D399" };
  const severityLabel = { critical: "CRITICAL", warning: "WARNING", info: "STABLE" };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: "100%",
          borderRadius: "16px 16px 0 0",
          border: "1px solid rgba(255,255,255,0.12)",
          borderBottom: "none",
          backgroundColor: "#0f0f1a",
          padding: "24px 20px",
          paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          maxHeight: "85dvh",
          overflowY: "auto",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: result.stable ? "#34D399" : "#F87171",
            marginBottom: 4,
          }}
        >
          The Reckoning
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#f0f0f0",
            marginBottom: 16,
          }}
        >
          {result.stable ? "Build is structurally stable." : "Structural issues detected."}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {result.findings.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                borderRadius: 9,
                border: `1px solid ${severityColor[f.severity]}35`,
                backgroundColor: `${severityColor[f.severity]}0c`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: severityColor[f.severity],
                    backgroundColor: `${severityColor[f.severity]}20`,
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {severityLabel[f.severity]}
                </span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                  {f.code}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#d0d0d0", lineHeight: 1.5, margin: 0 }}>
                {f.message}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onReturn}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "none",
              color: "#888",
              fontSize: "0.88rem",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              minHeight: 44,
            }}
          >
            Return to Forge
          </button>
          {result.stable && (
            <button
              onClick={onCodetry}
              style={{
                flex: 1,
                padding: "11px 16px",
                borderRadius: 9,
                border: "none",
                backgroundColor: "#C9A84C",
                color: "#0f0f1a",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                minHeight: 44,
              }}
            >
              Name this pattern →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CodetryModal({
  suggestedLabels,
  patternName,
  onNameChange,
  onCommit,
  onBack,
}: {
  suggestedLabels: string[];
  patternName: string;
  onNameChange: (v: string) => void;
  onCommit: () => void;
  onBack: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          borderRadius: "16px 16px 0 0",
          border: "1px solid rgba(201,168,76,0.35)",
          borderBottom: "none",
          backgroundColor: "#13100a",
          padding: "28px 20px",
          paddingBottom: "calc(28px + env(safe-area-inset-bottom, 0px))",
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: 6,
          }}
        >
          Codetry
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#f0e8d0",
            marginBottom: 6,
          }}
        >
          Name this pattern
        </h2>
        <p style={{ fontSize: "0.83rem", color: "rgba(240,232,208,0.5)", lineHeight: 1.6, marginBottom: 20 }}>
          Precision naming is the discipline. The name should be accurate, portable, and earnable.
        </p>

        {suggestedLabels.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 7 }}>
              Suggested labels
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestedLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => onNameChange(label)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${patternName === label ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.2)"}`,
                    backgroundColor: patternName === label ? "rgba(201,168,76,0.12)" : "rgba(201,168,76,0.05)",
                    color: "#f0e8d0",
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    minHeight: 44,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 7 }}>
            Or write your own
          </p>
          <input
            type="text"
            value={patternName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name this pattern precisely..."
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: 9,
              border: "1px solid rgba(201,168,76,0.3)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "#f0e8d0",
              fontSize: "0.95rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
              WebkitAppearance: "none",
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && patternName.trim()) onCommit(); }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              padding: "11px 14px",
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "none",
              color: "rgba(240,232,208,0.4)",
              fontSize: "0.88rem",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              minHeight: 44,
            }}
          >
            Back
          </button>
          <button
            onClick={onCommit}
            disabled={!patternName.trim()}
            style={{
              flex: 2,
              padding: "11px 14px",
              borderRadius: 9,
              border: "none",
              backgroundColor: patternName.trim() ? "#C9A84C" : "rgba(201,168,76,0.25)",
              color: patternName.trim() ? "#0f0f1a" : "rgba(255,255,255,0.25)",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: patternName.trim() ? "pointer" : "default",
              fontFamily: "var(--font-sans)",
              minHeight: 44,
            }}
          >
            Commit to Library →
          </button>
        </div>
      </div>
    </div>
  );
}

function FactionCommentOverlay({
  patternName,
  nodes,
  onDone,
  onBuildAgain,
}: {
  patternName: string;
  nodes: ForgeNode[];
  onDone: () => void;
  onBuildAgain: () => void;
}) {
  const elementCounts: Record<string, number> = {};
  for (const n of nodes) elementCounts[n.elementId] = (elementCounts[n.elementId] || 0) + 1;
  const dominant = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0];
  const dominantEl = dominant ? ELEMENT_MAP[dominant[0] as keyof typeof ELEMENT_MAP] : null;

  const comments: Record<string, string> = {
    fire: "The Igniters nod. Proof-of-work acknowledges your build. Energy spent; trust earned.",
    water: "The Tides say the pattern flows. Liquidity found its channel. Hold the path.",
    earth: "The Anchors approve. The root is set. Now see if the chain holds under load.",
    air: "The Relays are watching. The signal is clean. Keep the oracle honest.",
    aether: "The Weavers call it composable. Now see if it holds when a second pattern tries to connect.",
  };

  const comment = dominantEl ? comments[dominantEl.id] : "The pattern is named. The record is set.";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.88)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          borderRadius: "16px 16px 0 0",
          border: "1px solid rgba(201,168,76,0.3)",
          borderBottom: "none",
          backgroundColor: "#0f0f1a",
          padding: "28px 20px",
          paddingBottom: "calc(28px + env(safe-area-inset-bottom, 0px))",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 32, marginBottom: 10 }}>📜</p>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 6 }}>
          Pattern committed
        </p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 700, color: "#f0e8d0", marginBottom: 4 }}>
          "{patternName}"
        </h2>
        <p style={{ fontSize: "0.82rem", color: "rgba(240,232,208,0.5)", marginBottom: 18 }}>
          Saved to your Blueprint Library.
        </p>

        {dominantEl && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: `1px solid ${dominantEl.color}35`,
              backgroundColor: `${dominantEl.color}0c`,
              marginBottom: 20,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: dominantEl.color, display: "block", marginBottom: 5 }}>
              Faction Voice — {dominantEl.factionName}
            </span>
            <p style={{ fontSize: "0.85rem", color: "#c0c0c0", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
              {comment}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onBuildAgain}
            style={{
              flex: 1, padding: "11px 14px", borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "none", color: "#888",
              fontSize: "0.88rem", cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 44,
            }}
          >
            Build another
          </button>
          <button
            onClick={onDone}
            style={{
              flex: 1, padding: "11px 14px", borderRadius: 9,
              border: "none",
              backgroundColor: "#C9A84C",
              color: "#0f0f1a",
              fontSize: "0.88rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 44,
            }}
          >
            View Library →
          </button>
        </div>
      </div>
    </div>
  );
}

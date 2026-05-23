import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ELEMENTS, ELEMENT_MAP, FORGE_MODULES } from "@/data/forgeData";
import { runReckoning, getSuggestedLabels } from "@/lib/reckoning";
import type { ForgeNode, ForgeConnection, ReckoningResult } from "@/lib/reckoning";
import { saveToLibrary, markModuleComplete, incrementPatternsNamed } from "@/lib/forgeStorage";
import { ForgeNav } from "@/components/forge/ForgeNav";

let _nodeCounter = 0;
function newNodeId() { return `node-${++_nodeCounter}-${Date.now()}`; }
function newConnId() { return `conn-${++_nodeCounter}-${Date.now()}`; }

type Phase = "build" | "reckoning" | "codetry" | "faction-comment";

export function ForgePage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const moduleId = params.get("module");
  const mod = moduleId ? FORGE_MODULES.find((m) => m.id === moduleId) : null;

  const [nodes, setNodes] = useState<ForgeNode[]>(() => {
    if (mod) {
      return mod.startingNodes.map((n) => ({ ...n }));
    }
    return [];
  });
  const [connections, setConnections] = useState<ForgeConnection[]>(() => {
    if (mod) {
      return mod.startingConnections.map((c) => ({ id: newConnId(), fromId: c.fromId, toId: c.toId }));
    }
    return [];
  });

  const [phase, setPhase] = useState<Phase>("build");
  const [reckoningResult, setReckoningResult] = useState<ReckoningResult | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [patternName, setPatternName] = useState("");
  const [suggestedLabels, setSuggestedLabels] = useState<string[]>([]);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [showFactionComment, setShowFactionComment] = useState(false);

  const canvasRef = useRef<SVGSVGElement>(null);
  const draggingNode = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  function handleCanvasClick(e: React.MouseEvent<SVGSVGElement>) {
    if (draggingNode.current) return;
    if (e.target === canvasRef.current || (e.target as Element).tagName === "rect") {
      setSelectedNodeId(null);
      if (connectingFrom) setConnectingFrom(null);
    }
  }

  function handleDragStart(e: React.MouseEvent, nodeId: string) {
    e.stopPropagation();
    const svg = canvasRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    draggingNode.current = {
      id: nodeId,
      offsetX: e.clientX - rect.left - node.x,
      offsetY: e.clientY - rect.top - node.y,
    };
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!draggingNode.current) return;
    const svg = canvasRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left - draggingNode.current.offsetX));
    const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top - draggingNode.current.offsetY));
    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNode.current!.id ? { ...n, x, y } : n))
    );
  }

  function handleMouseUp() {
    draggingNode.current = null;
  }

  function handleNodeClick(e: React.MouseEvent, nodeId: string) {
    e.stopPropagation();
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
      setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
    }
  }

  function handleDropOnCanvas(e: React.DragEvent<SVGSVGElement>) {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("elementId");
    if (!elementId) return;
    const svg = canvasRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes((prev) => [
      ...prev,
      { id: newNodeId(), elementId: elementId as ForgeNode["elementId"], x, y },
    ]);
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
    if (result.stable) {
      setSuggestedLabels(getSuggestedLabels(nodes, connections));
    }
  }

  function proceedToCodetry() {
    setPhase("codetry");
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
    setPatternName("");
    setSavedName(null);
  }

  return (
    <div className="forge-bg" style={{ height: "100dvh", display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)", overflow: "hidden" }}>
      <ForgeNav active="forge" />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <Sidebar nodes={nodes} connectingFrom={connectingFrom} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          {mod && (
            <div
              style={{
                padding: "8px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                backgroundColor: "rgba(255,107,43,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--forge-orange)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {mod.pillar}
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--forge-muted)", marginLeft: 10 }}>
                  {mod.conceptName}
                </span>
              </div>
              <button
                onClick={() => navigate(`/forge/module/${mod.id}`)}
                style={{ background: "none", border: "none", color: "var(--forge-muted)", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 36, padding: "0 8px" }}
              >
                ← Lesson
              </button>
            </div>
          )}

          <svg
            ref={canvasRef}
            style={{ flex: 1, cursor: connectingFrom ? "crosshair" : "default" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            onDrop={handleDropOnCanvas}
            onDragOver={(e) => e.preventDefault()}
          >
            <defs>
              <filter id="glow-fire"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="glow-water"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="glow-aether"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            <rect width="100%" height="100%" fill="transparent" />

            {nodes.length === 0 && (
              <text
                x="50%" y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                style={{ fill: "rgba(255,255,255,0.12)", fontSize: "1rem", fontFamily: "var(--font-sans)", pointerEvents: "none", userSelect: "none" }}
              >
                Drag elements from the sidebar — or start a Module for a guided build
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
                    strokeWidth={isWeak ? 2.5 : 1.5}
                    strokeDasharray={isWeak ? "6 4" : "none"}
                    opacity={0.6}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => { e.stopPropagation(); removeConnection(conn.id); }}
                  />
                  {[0.3, 0.7].map((t) => (
                    <circle
                      key={t}
                      cx={from.x + (to.x - from.x) * t}
                      cy={from.y + (to.y - from.y) * t}
                      r={2}
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
              const r = 28;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "grab" }}
                  onMouseDown={(e) => handleDragStart(e, node.id)}
                  onClick={(e) => handleNodeClick(e, node.id)}
                >
                  {(isSelected || isConnecting) && (
                    <circle r={r + 8} fill="none" stroke={el.color} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.6} />
                  )}
                  {isAffected && (
                    <circle r={r + 6} fill="none" stroke="#F59E0B" strokeWidth={2} opacity={0.7}>
                      <animate attributeName="r" values={`${r + 4};${r + 8};${r + 4}`} dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    r={r}
                    fill={`${el.color}22`}
                    stroke={el.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={`url(#glow-${node.elementId})`}
                  >
                    <animate attributeName="r" values={`${r};${r + 2};${r}`} dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: 18, pointerEvents: "none", userSelect: "none" }}
                  >
                    {el.emoji}
                  </text>
                  <text
                    y={r + 14}
                    textAnchor="middle"
                    style={{ fontSize: "0.65rem", fill: el.color, fontFamily: "var(--font-sans)", fontWeight: 700, pointerEvents: "none", userSelect: "none" }}
                  >
                    {el.name}
                  </text>

                  {isSelected && (
                    <g>
                      <circle cx={r + 2} cy={-(r + 2)} r={10} fill="#1a1a2e" stroke="rgba(255,255,255,0.2)" strokeWidth={1}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} />
                      <text x={r + 2} y={-(r + 2)}
                        textAnchor="middle" dominantBaseline="central"
                        style={{ fontSize: "0.65rem", fill: "rgba(255,100,100,0.9)", pointerEvents: "none", userSelect: "none" }}>
                        ✕
                      </text>
                      <circle cx={-(r + 2)} cy={-(r + 2)} r={10} fill="#1a1a2e" stroke={connectingFrom === node.id ? el.color : "rgba(255,255,255,0.2)"} strokeWidth={1}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => { e.stopPropagation(); setConnectingFrom(connectingFrom === node.id ? null : node.id); setSelectedNodeId(null); }} />
                      <text x={-(r + 2)} y={-(r + 2)}
                        textAnchor="middle" dominantBaseline="central"
                        style={{ fontSize: "0.65rem", fill: el.color, pointerEvents: "none", userSelect: "none" }}>
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
              padding: "10px 16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "var(--forge-muted)" }}>
              {nodes.length} node{nodes.length !== 1 ? "s" : ""} · {connections.length} connection{connections.length !== 1 ? "s" : ""}
            </span>
            {connectingFrom && (
              <span style={{ fontSize: "0.72rem", color: "var(--forge-orange)", fontWeight: 600 }}>
                → Click another node to connect, or click same node to cancel
              </span>
            )}
            <div style={{ flex: 1 }} />
            <button
              onClick={resetForge}
              style={{
                padding: "6px 14px", borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "none", color: "var(--forge-muted)",
                fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 36,
              }}
            >
              Clear
            </button>
            <button
              onClick={submitReckoning}
              style={{
                padding: "8px 20px", borderRadius: 8,
                border: "none",
                backgroundColor: "var(--forge-orange)",
                color: "#fff",
                fontSize: "0.88rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 36,
              }}
            >
              Submit to The Reckoning →
            </button>
          </div>
        </div>
      </div>

      {phase === "reckoning" && reckoningResult && (
        <ReckoningOverlay
          result={reckoningResult}
          onReturn={() => setPhase("build")}
          onCodetry={proceedToCodetry}
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

function Sidebar({ nodes, connectingFrom }: { nodes: ForgeNode[]; connectingFrom: string | null }) {
  return (
    <div
      style={{
        width: 120,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(0,0,0,0.25)",
        padding: "16px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        overflowY: "auto",
      }}
    >
      <p
        style={{
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--forge-muted)",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Primitives
      </p>
      {ELEMENTS.map((el) => (
        <div
          key={el.id}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("elementId", el.id)}
          style={{
            borderRadius: 10,
            border: `1px solid ${el.color}60`,
            backgroundColor: `${el.color}14`,
            padding: "10px 6px",
            textAlign: "center",
            cursor: "grab",
            userSelect: "none",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 12px ${el.glowColor}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
          title={`Drag to add ${el.name} node — ${el.pillar}`}
        >
          <div style={{ fontSize: 22, marginBottom: 4 }}>{el.emoji}</div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: el.color }}>{el.name}</div>
          <div style={{ fontSize: "0.58rem", color: "var(--forge-muted)", marginTop: 2 }}>{el.pillar}</div>
        </div>
      ))}

      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: "0.6rem", color: "var(--forge-muted)", textAlign: "center", lineHeight: 1.5 }}>
          Drag to canvas.<br />Click node to select, then ⬡ to connect.
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
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: "100%",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          backgroundColor: "#0f0f1a",
          padding: "28px 28px 24px",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: result.stable ? "#34D399" : "#F87171",
            marginBottom: 6,
          }}
        >
          The Reckoning
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#f0f0f0",
            marginBottom: 20,
          }}
        >
          {result.stable ? "Build is structurally stable." : "Structural issues detected."}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {result.findings.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderRadius: 9,
                border: `1px solid ${severityColor[f.severity]}35`,
                backgroundColor: `${severityColor[f.severity]}0c`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: severityColor[f.severity],
                    backgroundColor: `${severityColor[f.severity]}20`,
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}
                >
                  {severityLabel[f.severity]}
                </span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
                  {f.code}
                </span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "#d0d0d0", lineHeight: 1.55, margin: 0 }}>
                {f.message}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onReturn}
            style={{
              padding: "9px 18px", borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "none", color: "#888",
              fontSize: "0.88rem", cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 44,
            }}
          >
            Return to Forge
          </button>
          {result.stable && (
            <button
              onClick={onCodetry}
              style={{
                padding: "9px 22px", borderRadius: 9,
                border: "none",
                backgroundColor: "#C9A84C",
                color: "#0f0f1a",
                fontSize: "0.88rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 44,
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
        backgroundColor: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 16,
          border: "1px solid rgba(201,168,76,0.35)",
          backgroundColor: "#13100a",
          padding: "32px 28px 28px",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: 8,
          }}
        >
          Codetry
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f0e8d0",
            marginBottom: 6,
          }}
        >
          Name this pattern
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(240,232,208,0.55)", lineHeight: 1.6, marginBottom: 24 }}>
          Precision naming is the discipline. The name should be accurate, portable, and earnable — someone else should be able to read it and know what the pattern does.
        </p>

        {suggestedLabels.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 8 }}>
              Suggested labels
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestedLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => onNameChange(label)}
                  style={{
                    textAlign: "left",
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: `1px solid ${patternName === label ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.2)"}`,
                    backgroundColor: patternName === label ? "rgba(201,168,76,0.12)" : "rgba(201,168,76,0.05)",
                    color: "#f0e8d0",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "border-color 0.15s",
                    minHeight: 44,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 8 }}>
            Or write your own
          </p>
          <input
            type="text"
            value={patternName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name this pattern precisely..."
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 9,
              border: "1px solid rgba(201,168,76,0.3)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "#f0e8d0",
              fontSize: "0.95rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && patternName.trim()) onCommit(); }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onBack}
            style={{
              padding: "9px 16px", borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "none", color: "rgba(240,232,208,0.4)",
              fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-sans)", minHeight: 44,
            }}
          >
            Back
          </button>
          <button
            onClick={onCommit}
            disabled={!patternName.trim()}
            style={{
              padding: "10px 24px", borderRadius: 9,
              border: "none",
              backgroundColor: patternName.trim() ? "#C9A84C" : "rgba(201,168,76,0.3)",
              color: patternName.trim() ? "#0f0f1a" : "rgba(255,255,255,0.3)",
              fontSize: "0.9rem", fontWeight: 700,
              cursor: patternName.trim() ? "pointer" : "default",
              fontFamily: "var(--font-sans)", minHeight: 44,
              transition: "background-color 0.15s",
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
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          borderRadius: 16,
          border: "1px solid rgba(201,168,76,0.3)",
          backgroundColor: "#0f0f1a",
          padding: "32px 28px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 36, marginBottom: 12 }}>📜</p>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 8 }}>
          Pattern committed
        </p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 700, color: "#f0e8d0", marginBottom: 6 }}>
          "{patternName}"
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(240,232,208,0.55)", marginBottom: 20, lineHeight: 1.6 }}>
          Saved to your Blueprint Library.
        </p>

        {dominantEl && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              border: `1px solid ${dominantEl.color}35`,
              backgroundColor: `${dominantEl.color}0c`,
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: dominantEl.color, display: "block", marginBottom: 6 }}>
              Faction Voice — {dominantEl.factionName}
            </span>
            <p style={{ fontSize: "0.88rem", color: "#c0c0c0", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
              {comment}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onBuildAgain}
            style={{
              padding: "10px 20px", borderRadius: 9,
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
              padding: "10px 22px", borderRadius: 9,
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

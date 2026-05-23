import type { ElementId } from "@/data/forgeData";

export interface ForgeNode {
  id: string;
  elementId: ElementId;
  x: number;
  y: number;
}

export interface ForgeConnection {
  id: string;
  fromId: string;
  toId: string;
}

export type ReckoningSeverity = "critical" | "warning" | "info";

export interface ReckoningFinding {
  severity: ReckoningSeverity;
  code: string;
  message: string;
  affectedNodeIds: string[];
}

export interface ReckoningResult {
  stable: boolean;
  findings: ReckoningFinding[];
}

export function runReckoning(
  nodes: ForgeNode[],
  connections: ForgeConnection[]
): ReckoningResult {
  const findings: ReckoningFinding[] = [];

  if (nodes.length === 0) {
    return {
      stable: false,
      findings: [
        {
          severity: "critical",
          code: "EMPTY_CANVAS",
          message: "No nodes placed. Build a pattern before submitting to The Reckoning.",
          affectedNodeIds: [],
        },
      ],
    };
  }

  const connectionsByNode: Record<string, string[]> = {};
  for (const n of nodes) connectionsByNode[n.id] = [];
  for (const c of connections) {
    connectionsByNode[c.fromId]?.push(c.toId);
    connectionsByNode[c.toId]?.push(c.fromId);
  }

  const elementCounts: Record<ElementId, number> = {
    fire: 0, water: 0, earth: 0, air: 0, aether: 0,
  };
  for (const n of nodes) elementCounts[n.elementId]++;

  const isolatedNodes = nodes.filter(
    (n) => (connectionsByNode[n.id]?.length ?? 0) === 0
  );
  if (isolatedNodes.length > 0) {
    findings.push({
      severity: "critical",
      code: "ISOLATED_NODE",
      message: `${isolatedNodes.length} node${isolatedNodes.length > 1 ? "s" : ""} with no connections detected. Isolated primitives cannot participate in consensus.`,
      affectedNodeIds: isolatedNodes.map((n) => n.id),
    });
  }

  const maxDegree = Math.max(
    ...nodes.map((n) => connectionsByNode[n.id]?.length ?? 0)
  );
  const hubNodes = nodes.filter(
    (n) => (connectionsByNode[n.id]?.length ?? 0) === maxDegree && maxDegree >= nodes.length - 1 && nodes.length > 2
  );
  if (hubNodes.length > 0 && nodes.length > 2) {
    findings.push({
      severity: "critical",
      code: "SINGLE_POINT_OF_FAILURE",
      message: `Single point of failure detected. ${hubNodes.length > 1 ? "Nodes" : "Node"} carrying all connections — removing it isolates the network.`,
      affectedNodeIds: hubNodes.map((n) => n.id),
    });
  }

  const fireNodes = nodes.filter((n) => n.elementId === "fire");
  const earthNodes = nodes.filter((n) => n.elementId === "earth");
  if (elementCounts.fire > 2 && elementCounts.earth === 0) {
    findings.push({
      severity: "critical",
      code: "ENERGY_CONCENTRATION_RISK",
      message: `Energy concentration risk: ${elementCounts.fire} Fire nodes with no Earth anchor. High validator density without persistence is unstable.`,
      affectedNodeIds: fireNodes.map((n) => n.id),
    });
  }

  const waterNodes = nodes.filter((n) => n.elementId === "water");
  const unconnectedWater = waterNodes.filter(
    (n) => (connectionsByNode[n.id]?.length ?? 0) === 0
  );
  const singlePathWater = waterNodes.filter(
    (n) => (connectionsByNode[n.id]?.length ?? 0) === 1
  );
  if (unconnectedWater.length > 0 || (singlePathWater.length > 0 && waterNodes.length === 1)) {
    findings.push({
      severity: "critical",
      code: "LIQUIDITY_GAP",
      message: `Liquidity gap: Water node${unconnectedWater.length > 1 ? "s" : ""} with no redundant path. Single-path liquidity is a bottleneck.`,
      affectedNodeIds: [...unconnectedWater, ...singlePathWater].map((n) => n.id),
    });
  }

  const earthUnwitnessed = earthNodes.filter((n) => {
    const neighbors = connectionsByNode[n.id] ?? [];
    const connectedNodes = nodes.filter((nn) => neighbors.includes(nn.id));
    return !connectedNodes.some((nn) => nn.elementId === "fire" || nn.elementId === "air");
  });
  if (earthUnwitnessed.length > 0) {
    findings.push({
      severity: "warning",
      code: "UNWITNESSED_PERSISTENCE",
      message: `${earthUnwitnessed.length} Earth node${earthUnwitnessed.length > 1 ? "s" : ""} without a validator or oracle witness. Persistence without verification has no integrity guarantee.`,
      affectedNodeIds: earthUnwitnessed.map((n) => n.id),
    });
  }

  if (elementCounts.aether > 0 && elementCounts.fire === 0) {
    findings.push({
      severity: "warning",
      code: "GOVERNANCE_WITHOUT_CONSENSUS",
      message: `Governance layer (Aether) present without a consensus layer (Fire). DAO coordination without validator infrastructure is unenforceable.`,
      affectedNodeIds: nodes.filter((n) => n.elementId === "aether").map((n) => n.id),
    });
  }

  if (nodes.length >= 3 && connections.length < nodes.length - 1) {
    findings.push({
      severity: "warning",
      code: "SPARSE_CONNECTIVITY",
      message: `Network is sparsely connected. ${nodes.length} nodes, ${connections.length} connections — some sub-systems may be partitioned.`,
      affectedNodeIds: [],
    });
  }

  if (findings.length === 0) {
    findings.push({
      severity: "info",
      code: "BUILD_STABLE",
      message: `Build is structurally stable. No critical failure patterns detected. Ready for Codetry naming.`,
      affectedNodeIds: [],
    });
  }

  const stable = !findings.some((f) => f.severity === "critical");
  return { stable, findings };
}

export function getSuggestedLabels(
  nodes: ForgeNode[],
  connections: ForgeConnection[]
): string[] {
  const elementCounts: Record<string, number> = {};
  for (const n of nodes) {
    elementCounts[n.elementId] = (elementCounts[n.elementId] || 0) + 1;
  }
  const dominant = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);
  const labels: string[] = [];

  const names: Record<string, string> = {
    fire: "Fire",
    water: "Water",
    earth: "Earth",
    air: "Air",
    aether: "Aether",
  };

  if (dominant[0]) {
    const [el] = dominant[0];
    const count = dominant[0][1];
    if (el === "fire" && count >= 3) labels.push("Distributed Validator Ring");
    else if (el === "fire") labels.push("Consensus Node Pair");
    else if (el === "water" && connections.length >= 3) labels.push("Redundant Liquidity Channel");
    else if (el === "water") labels.push("Single Liquidity Bridge");
    else if (el === "earth") labels.push("Persistence Anchor");
    else if (el === "air") labels.push("Oracle Relay Network");
    else if (el === "aether") labels.push("Governance Composability Layer");
  }

  if (dominant.length >= 2 && dominant[0] && dominant[1]) {
    const [e1] = dominant[0];
    const [e2] = dominant[1];
    labels.push(`${names[e1] ?? e1}–${names[e2] ?? e2} Hybrid Architecture`);
  }

  if (nodes.length >= 4 && connections.length >= nodes.length) {
    labels.push("Resilient Multi-Element Pattern");
  } else if (nodes.length <= 2) {
    labels.push("Primitive Pair");
  }

  return labels.slice(0, 3);
}

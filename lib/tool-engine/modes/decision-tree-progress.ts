import type { DecisionTreeFlow } from "../schema/tool-config";

export interface DecisionTreeProgress {
  current: number;
  total: number;
  percent: number;
}

/** Shortest number of question nodes from `startNodeId` to any result node. */
export function minQuestionsToResult(
  flow: DecisionTreeFlow,
  startNodeId: string,
): number {
  let min = Number.POSITIVE_INFINITY;
  const queue: { nodeId: string; questionCount: number }[] = [
    { nodeId: startNodeId, questionCount: 0 },
  ];

  while (queue.length > 0) {
    const { nodeId, questionCount } = queue.shift()!;
    const node = flow.nodes[nodeId];
    if (!node) continue;

    if (node.type === "result") {
      min = Math.min(min, questionCount);
      continue;
    }

    if (node.type === "question") {
      const afterQuestion = questionCount + 1;
      for (const option of node.options) {
        const nextId = option.next ?? node.next;
        if (nextId) {
          queue.push({ nodeId: nextId, questionCount: afterQuestion });
        }
      }
      continue;
    }

    if (node.type === "branch") {
      const nextIds = new Set<string>(
        node.conditions.map((condition) => condition.next),
      );
      nextIds.add(node.default);
      for (const nextId of nextIds) {
        queue.push({ nodeId: nextId, questionCount });
      }
      continue;
    }

    if (node.type === "calculate") {
      queue.push({ nodeId: node.next, questionCount });
    }
  }

  return Number.isFinite(min) ? min : 1;
}

export function getDecisionTreeProgress(
  flow: DecisionTreeFlow,
  state: {
    complete: boolean;
    history: string[];
    currentNodeId: string;
  },
): DecisionTreeProgress {
  if (state.complete) {
    const total = state.history.length;
    return { current: total, total, percent: 100 };
  }

  const remaining = minQuestionsToResult(flow, state.currentNodeId);
  const total = state.history.length + remaining;
  const current = state.history.length + 1;
  const percent =
    total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return { current, total, percent };
}

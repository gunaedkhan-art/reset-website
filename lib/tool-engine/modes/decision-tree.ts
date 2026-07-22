import type {
  DecisionTreeFlow,
  FlowNode,
  ResultTemplate,
} from "../schema/tool-config";
import type { EvalContext } from "../expression/evaluate";
import { evaluateCondition, runExpressions } from "../expression/evaluate";

export interface DecisionTreeState {
  currentNodeId: string;
  answers: Record<string, string>;
  scores: Record<string, number>;
  calcs: Record<string, number>;
  history: string[];
  complete: boolean;
  resultTemplateId?: string;
}

export function createDecisionTreeState(flow: DecisionTreeFlow): DecisionTreeState {
  return {
    currentNodeId: flow.entry,
    answers: {},
    scores: {},
    calcs: {},
    history: [],
    complete: false,
  };
}

export function getCurrentQuestion(
  flow: DecisionTreeFlow,
  state: DecisionTreeState,
): Extract<FlowNode, { type: "question" }> | null {
  if (state.complete) return null;
  const node = flow.nodes[state.currentNodeId];
  if (!node || node.type !== "question") return null;
  return node;
}

function buildContext(
  state: DecisionTreeState,
  constants: Record<string, number> = {},
): EvalContext {
  const inputs: Record<string, number | string | boolean> = {};
  for (const [key, value] of Object.entries(state.answers)) {
    inputs[key] = value;
  }

  return {
    inputs,
    scores: state.scores,
    calcs: state.calcs,
    constants,
  };
}

export function answerQuestion(
  flow: DecisionTreeFlow,
  state: DecisionTreeState,
  optionId: string,
): DecisionTreeState {
  const node = getCurrentQuestion(flow, state);
  if (!node) return state;

  const option = node.options.find((o) => o.id === optionId);
  if (!option) throw new Error(`Invalid option: ${optionId}`);

  const nextState: DecisionTreeState = {
    ...state,
    answers: { ...state.answers, [node.id]: optionId },
    history: [...state.history, node.id],
  };

  if (option.score) {
    for (const [key, weight] of Object.entries(option.score)) {
      nextState.scores[key] = (nextState.scores[key] ?? 0) + weight;
    }
  }

  const nextNodeId = option.next ?? node.next;
  if (!nextNodeId) {
    throw new Error(`No next node defined after question ${node.id}`);
  }

  return advanceToNode(flow, nextState, nextNodeId);
}

function advanceToNode(
  flow: DecisionTreeFlow,
  state: DecisionTreeState,
  nodeId: string,
): DecisionTreeState {
  let currentState = { ...state, currentNodeId: nodeId };

  while (!currentState.complete) {
    const node = flow.nodes[currentState.currentNodeId];
    if (!node) {
      throw new Error(`Unknown node: ${currentState.currentNodeId}`);
    }

    switch (node.type) {
      case "question":
        return currentState;

      case "branch": {
        const ctx = buildContext(currentState);
        let matched = node.default;
        for (const condition of node.conditions) {
          if (evaluateCondition(condition.when, ctx)) {
            matched = condition.next;
            break;
          }
        }
        currentState = { ...currentState, currentNodeId: matched };
        break;
      }

      case "calculate": {
        const ctx = buildContext(currentState);
        const calcs = runExpressions(node.expressions, ctx);
        currentState = {
          ...currentState,
          calcs: { ...currentState.calcs, ...calcs },
          currentNodeId: node.next,
        };
        break;
      }

      case "result":
        return {
          ...currentState,
          complete: true,
          resultTemplateId: node.resultTemplateId,
        };

      default:
        throw new Error(`Unsupported node type`);
    }
  }

  return currentState;
}

export function resolveResultTemplate(
  templates: ResultTemplate[],
  templateId: string,
): ResultTemplate {
  const template = templates.find((t) => t.id === templateId);
  if (!template) throw new Error(`Result template not found: ${templateId}`);
  return template;
}

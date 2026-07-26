import type { ProjectionResult } from "@/lib/investment/types";

export type EvalValue = number | string | boolean;

export interface EvalContext {
  inputs: Record<string, EvalValue>;
  scores: Record<string, number>;
  calcs: Record<string, number>;
  constants: Record<string, number>;
}

type ExpressionContext = EvalContext & {
  projection?: ProjectionResult | Record<string, unknown>;
};

export class ExpressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpressionError";
  }
}

type Token =
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "ident"; value: string }
  | { type: "func"; value: "floor" | "min" | "max" }
  | { type: "op"; value: string }
  | { type: "paren"; value: "(" | ")" };

const IDENT_PATTERN =
  /^(inputs|scores|calcs|constants|projection)\.[a-zA-Z_][a-zA-Z0-9_]*/;
const FUNC_PATTERN = /^(floor|min|max)(?=\s*\()/;

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const src = expression.trim();

  while (i < src.length) {
    if (src[i] === " ") {
      i++;
      continue;
    }

    if (src[i] === "(" || src[i] === ")") {
      tokens.push({ type: "paren", value: src[i] as "(" | ")" });
      i++;
      continue;
    }

    if ("+-*/".includes(src[i]!)) {
      tokens.push({ type: "op", value: src[i]! });
      i++;
      continue;
    }

    if (src[i] === ",") {
      tokens.push({ type: "op", value: "," });
      i++;
      continue;
    }

    if (">=<".includes(src[i]!)) {
      if (src.slice(i, i + 2) === ">=" || src.slice(i, i + 2) === "<=") {
        tokens.push({ type: "op", value: src.slice(i, i + 2) });
        i += 2;
        continue;
      }
      if (src[i] === ">" || src[i] === "<") {
        tokens.push({ type: "op", value: src[i]! });
        i++;
        continue;
      }
    }

    if (src.slice(i, i + 2) === "&&") {
      tokens.push({ type: "op", value: "&&" });
      i += 2;
      continue;
    }

    if (src.slice(i, i + 2) === "||") {
      tokens.push({ type: "op", value: "||" });
      i += 2;
      continue;
    }

    if (src[i] === "=" && src[i + 1] === "=") {
      tokens.push({ type: "op", value: "==" });
      i += 2;
      continue;
    }

    const funcMatch = src.slice(i).match(FUNC_PATTERN);
    if (funcMatch) {
      tokens.push({
        type: "func",
        value: funcMatch[1] as "floor" | "min" | "max",
      });
      i += funcMatch[1]!.length;
      continue;
    }

    const identMatch = src.slice(i).match(IDENT_PATTERN);
    if (identMatch) {
      tokens.push({ type: "ident", value: identMatch[0] });
      i += identMatch[0].length;
      continue;
    }

    const numMatch = src.slice(i).match(/^\d+(?:\.\d+)?/);
    if (numMatch) {
      tokens.push({ type: "number", value: Number.parseFloat(numMatch[0]) });
      i += numMatch[0].length;
      continue;
    }

    const stringMatch = src.slice(i).match(/^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/);
    if (stringMatch) {
      const quoted = stringMatch[0];
      tokens.push({
        type: "string",
        value: quoted.slice(1, -1),
      });
      i += quoted.length;
      continue;
    }

    throw new ExpressionError(`Unexpected token at position ${i}: "${src.slice(i, i + 10)}"`);
  }

  return tokens;
}

function resolveIdent(path: string, ctx: ExpressionContext): EvalValue {
  const [scope, key] = path.split(".");
  if (!key) throw new ExpressionError(`Invalid identifier: ${path}`);

  switch (scope) {
    case "inputs":
      if (!(key in ctx.inputs)) throw new ExpressionError(`Unknown input: ${key}`);
      return ctx.inputs[key]!;
    case "scores":
      if (!(key in ctx.scores)) return 0;
      return ctx.scores[key]!;
    case "calcs":
      if (!(key in ctx.calcs)) return 0;
      return ctx.calcs[key]!;
    case "constants":
      if (!(key in ctx.constants)) throw new ExpressionError(`Unknown constant: ${key}`);
      return ctx.constants[key]!;
    case "projection": {
      const value = (ctx.projection as Record<string, unknown> | undefined)?.[key];
      if (typeof value === "number") return value;
      return 0;
    }
    default:
      throw new ExpressionError(`Unknown scope: ${scope}`);
  }
}

function toNumber(value: EvalValue): number {
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) throw new ExpressionError(`Cannot convert to number: ${value}`);
  return parsed;
}

export function evaluateExpression(
  expression: string,
  ctx: ExpressionContext,
): EvalValue {
  const tokens = tokenize(expression);
  let pos = 0;

  function parseExpression(): EvalValue {
    return parseLogicalOr();
  }

  function parseLogicalOr(): EvalValue {
    let left = parseLogicalAnd();
    while (pos < tokens.length) {
      const token = tokens[pos];
      if (token?.type === "op" && token.value === "||") {
        pos++;
        const right = parseLogicalAnd();
        left = Boolean(left) || Boolean(right);
      } else {
        break;
      }
    }
    return left;
  }

  function parseLogicalAnd(): EvalValue {
    let left = parseComparison();
    while (pos < tokens.length) {
      const token = tokens[pos];
      if (token?.type === "op" && token.value === "&&") {
        pos++;
        const right = parseComparison();
        left = Boolean(left) && Boolean(right);
      } else {
        break;
      }
    }
    return left;
  }

  function parseComparison(): EvalValue {
    let left = parseAddSub();
    while (pos < tokens.length) {
      const token = tokens[pos];
      if (token?.type === "op" && [">=", "<=", ">", "<", "=="].includes(token.value)) {
        pos++;
        const right = parseAddSub();
        if (token.value === "==") {
          if (typeof left === "string" || typeof right === "string") {
            left = String(left) === String(right);
          } else if (typeof left === "boolean" || typeof right === "boolean") {
            left = Boolean(left) === Boolean(right);
          } else {
            left = Number(left) === Number(right);
          }
        } else {
          const l = typeof left === "boolean" ? left : toNumber(left);
          const r = typeof right === "boolean" ? right : toNumber(right);
          if (token.value === ">=") left = Number(l) >= Number(r);
          else if (token.value === "<=") left = Number(l) <= Number(r);
          else if (token.value === ">") left = Number(l) > Number(r);
          else left = Number(l) < Number(r);
        }
      } else {
        break;
      }
    }
    return left;
  }

  function parseAddSub(): EvalValue {
    let left = parseMulDiv();
    while (pos < tokens.length) {
      const token = tokens[pos];
      if (token?.type === "op" && (token.value === "+" || token.value === "-")) {
        pos++;
        const right = parseMulDiv();
        left =
          token.value === "+"
            ? toNumber(left) + toNumber(right)
            : toNumber(left) - toNumber(right);
      } else {
        break;
      }
    }
    return left;
  }

  function parseMulDiv(): EvalValue {
    let left = parseUnary();
    while (pos < tokens.length) {
      const token = tokens[pos];
      if (token?.type === "op" && (token.value === "*" || token.value === "/")) {
        pos++;
        const right = parseUnary();
        left =
          token.value === "*"
            ? toNumber(left) * toNumber(right)
            : toNumber(left) / toNumber(right);
      } else {
        break;
      }
    }
    return left;
  }

  function parseUnary(): EvalValue {
    const token = tokens[pos];
    if (token?.type === "op" && token.value === "-") {
      pos++;
      return -toNumber(parsePrimary());
    }
    return parsePrimary();
  }

  function parsePrimary(): EvalValue {
    const token = tokens[pos];
    if (!token) throw new ExpressionError("Unexpected end of expression");

    if (token.type === "number") {
      pos++;
      return token.value;
    }

    if (token.type === "string") {
      pos++;
      return token.value;
    }

    if (token.type === "ident") {
      pos++;
      return resolveIdent(token.value, ctx);
    }

    if (token.type === "func") {
      pos++;
      const open = tokens[pos];
      if (open?.type !== "paren" || open.value !== "(") {
        throw new ExpressionError(`Expected "(" after ${token.value}`);
      }
      pos++;

      const firstArg = toNumber(parseExpression());

      if (token.value === "floor") {
        const closing = tokens[pos];
        if (closing?.type !== "paren" || closing.value !== ")") {
          throw new ExpressionError("Expected closing parenthesis");
        }
        pos++;
        return Math.floor(firstArg);
      }

      const comma = tokens[pos];
      if (comma?.type !== "op" || comma.value !== ",") {
        throw new ExpressionError(`Expected "," after first argument to ${token.value}`);
      }
      pos++;

      const secondArg = toNumber(parseExpression());
      const closing = tokens[pos];
      if (closing?.type !== "paren" || closing.value !== ")") {
        throw new ExpressionError("Expected closing parenthesis");
      }
      pos++;

      return token.value === "min"
        ? Math.min(firstArg, secondArg)
        : Math.max(firstArg, secondArg);
    }

    if (token.type === "paren" && token.value === "(") {
      pos++;
      const value = parseExpression();
      const closing = tokens[pos];
      if (closing?.type !== "paren" || closing.value !== ")") {
        throw new ExpressionError("Expected closing parenthesis");
      }
      pos++;
      return value;
    }

    throw new ExpressionError(`Unexpected token: ${JSON.stringify(token)}`);
  }

  const result = parseExpression();
  if (pos < tokens.length) {
    throw new ExpressionError(`Unexpected trailing tokens at position ${pos}`);
  }
  return result;
}

export function evaluateCondition(
  expression: string,
  ctx: ExpressionContext,
): boolean {
  const result = evaluateExpression(expression, ctx);
  if (typeof result === "boolean") return result;
  return Boolean(result);
}

export function runExpressions(
  expressions: Record<string, string>,
  ctx: EvalContext,
): Record<string, number> {
  const calcs: Record<string, number> = { ...ctx.calcs };
  const evalCtx: EvalContext = { ...ctx, calcs };

  for (const [key, expr] of Object.entries(expressions)) {
    const value = evaluateExpression(expr, evalCtx);
    calcs[key] = toNumber(value);
    evalCtx.calcs[key] = calcs[key]!;
  }

  return calcs;
}

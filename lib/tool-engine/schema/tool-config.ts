import { z } from "zod";

export const searchIntentSchema = z.enum([
  "how-to",
  "why",
  "should-i",
  "am-i",
  "how-long",
  "how-much",
  "best-way",
  "checklist",
  "calculator",
  "compare",
  "diagnostic",
]);

export const toolModeSchema = z.enum([
  "calculator",
  "decision-tree",
  "questionnaire",
  "assessment",
  "scorecard",
  "checklist",
]);

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const guidanceBlockSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  list: z.array(z.string()).optional(),
});

export const contentSectionSchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
  list: z.array(z.string()).optional(),
  framework: z
    .enum(["pas", "aida", "concept", "how-to", "outcome"])
    .optional(),
});

export const calculatorProfileSchema = z.enum([
  "future-value",
  "compound-growth",
  "savings-goal",
  "time-to-goal",
  "required-return",
  "initial-investment",
  "doubling-time",
  "withdrawal-duration",
]);

export const selectOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const inputFieldSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9_]*$/),
    type: z.enum(["number", "text", "integer", "select"]),
    label: z.string().min(1),
    placeholder: z.string().optional(),
    hint: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    required: z.boolean().default(true),
    integer: z.boolean().optional(),
    defaultValue: z.string().optional(),
    options: z.array(selectOptionSchema).optional(),
  })
  .superRefine((field, ctx) => {
    if (field.type === "select" && (!field.options || field.options.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: `Select field "${field.id}" must include options`,
      });
    }
  });

export const resultCardSchema = z.object({
  title: z.string().min(1),
  valueTemplate: z.string().min(1),
  descriptionTemplate: z.string().optional(),
});

export const comparisonRuleSchema = z.object({
  when: z.string().min(1),
  textTemplate: z.string().min(1),
});

export const resultTemplateSchema = z.object({
  id: z.string().min(1),
  cards: z.array(resultCardSchema).optional(),
  cardColumns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  summaryTemplates: z.array(z.string()).optional(),
  comparisonTitle: z.string().optional(),
  comparisonRules: z.array(comparisonRuleSchema).optional(),
  fallbackComparison: z.string().optional(),
  showChart: z.boolean().optional(),
  showTable: z.boolean().optional(),
  tableVariant: z.enum(["growth", "withdrawal"]).optional(),
});

export const calculatorFlowSchema = z
  .object({
    type: z.literal("calculator"),
    engine: z.enum(["expression", "projection", "savings-path", "one-thing-weekly", "rule-of-100"]).default("expression"),
    calculatorProfile: calculatorProfileSchema.optional(),
    inputs: z.array(inputFieldSchema),
    constants: z.record(z.string(), z.number()).optional(),
    expressions: z.record(z.string(), z.string()).optional(),
    resultTemplateId: z.string().default("default"),
  })
  .superRefine((flow, ctx) => {
    if (flow.engine === "expression") {
      if (!flow.expressions || Object.keys(flow.expressions).length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Expression calculators require at least one expression",
          path: ["expressions"],
        });
      }
    }
    if (flow.engine === "projection" && !flow.calculatorProfile) {
      ctx.addIssue({
        code: "custom",
        message: "Projection calculators require calculatorProfile",
        path: ["calculatorProfile"],
      });
    }
    if (flow.engine === "savings-path") {
      if (flow.expressions && Object.keys(flow.expressions).length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Savings path tools do not use expressions",
          path: ["expressions"],
        });
      }
    }
    if (flow.engine === "one-thing-weekly") {
      if (flow.expressions && Object.keys(flow.expressions).length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "ONE Thing weekly tools do not use expressions",
          path: ["expressions"],
        });
      }
    }
    if (flow.engine === "rule-of-100") {
      if (flow.expressions && Object.keys(flow.expressions).length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Rule of 100 tools do not use expressions",
          path: ["expressions"],
        });
      }
    }
    if (
      (flow.engine === "expression" || flow.engine === "projection") &&
      flow.inputs.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Calculator requires at least one input field",
        path: ["inputs"],
      });
    }
  });

export const questionOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  next: z.string().optional(),
  score: z.record(z.string(), z.number()).optional(),
});

export const questionNodeSchema = z.object({
  type: z.literal("question"),
  id: z.string().min(1),
  prompt: z.string().min(1),
  input: z.enum(["single-choice", "multi-choice"]).default("single-choice"),
  options: z.array(questionOptionSchema).min(1),
  next: z.string().optional(),
});

export const branchConditionSchema = z.object({
  when: z.string().min(1),
  next: z.string().min(1),
});

export const branchNodeSchema = z.object({
  type: z.literal("branch"),
  id: z.string().min(1),
  conditions: z.array(branchConditionSchema).min(1),
  default: z.string().min(1),
});

export const calculateNodeSchema = z.object({
  type: z.literal("calculate"),
  id: z.string().min(1),
  expressions: z
    .record(z.string(), z.string())
    .refine((obj) => Object.keys(obj).length > 0, "At least one expression required"),
  next: z.string().min(1),
});

export const resultNodeSchema = z.object({
  type: z.literal("result"),
  id: z.string().min(1),
  resultTemplateId: z.string().min(1),
});

export const flowNodeSchema = z.discriminatedUnion("type", [
  questionNodeSchema,
  branchNodeSchema,
  calculateNodeSchema,
  resultNodeSchema,
]);

export const decisionTreeFlowSchema = z.object({
  type: z.literal("decision-tree"),
  entry: z.string().min(1),
  nodes: z.record(z.string(), flowNodeSchema).refine(
    (nodes) => Object.keys(nodes).length > 0,
    "Decision tree must have at least one node",
  ),
});

export const flowSchema = z.discriminatedUnion("type", [
  calculatorFlowSchema,
  decisionTreeFlowSchema,
]);

export const recommendationRuleSchema = z.object({
  id: z.string().min(1),
  when: z.string().min(1),
  steps: z.array(z.string()).optional(),
  title: z.string().optional(),
});

export const toolConfigSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["draft", "published", "archived"]).default("published"),

  seo: z.object({
    title: z.string().min(1),
    metaDescription: z.string().min(50).max(320),
    primaryKeyword: z.string().min(1),
    secondaryKeywords: z.array(z.string()).default([]),
    searchIntent: searchIntentSchema,
    canonicalPath: z.string().regex(/^\//),
  }),

  taxonomy: z.object({
    category: z.enum(["focus", "productivity", "planning", "calculators"]),
    tags: z.array(z.string()).default([]),
    cluster: z.string().min(1),
    clusterRole: z.enum(["pillar", "supporting"]).default("supporting"),
  }),

  content: z.object({
    h1: z.string().min(1),
    intro: z.string().min(1),
    explainer: z.string().optional(),
    eyebrow: z.string().optional(),
    icon: z.string().optional(),
    proseTitle: z.string().optional(),
    proseCollapsedDefault: z.boolean().default(true),
    sections: z.array(contentSectionSchema).optional(),
  }),

  mode: toolModeSchema,
  flow: flowSchema,

  results: z.object({
    templates: z.array(resultTemplateSchema).min(1),
    emptyMessage: z.string().optional(),
  }),

  recommendations: z.array(recommendationRuleSchema).default([]),

  guidance: z.array(guidanceBlockSchema).default([]),

  ctas: z.object({
    app: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
    newsletter: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
  }),

  faq: z.array(faqItemSchema).default([]),

  legalDisclaimer: z.string().optional(),

  theme: z
    .object({
      accentColor: z.string().optional(),
    })
    .optional(),
});

export type ToolConfig = z.infer<typeof toolConfigSchema>;
export type CalculatorFlow = z.infer<typeof calculatorFlowSchema>;
export type DecisionTreeFlow = z.infer<typeof decisionTreeFlowSchema>;
export type FlowNode = z.infer<typeof flowNodeSchema>;
export type ResultTemplate = z.infer<typeof resultTemplateSchema>;
export type InputField = z.infer<typeof inputFieldSchema>;

export function parseToolConfig(input: unknown): ToolConfig {
  return toolConfigSchema.parse(input);
}

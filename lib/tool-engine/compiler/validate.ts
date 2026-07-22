import { parseToolConfig } from "../schema/tool-config";

export function validateToolConfig(input: unknown): void {
  parseToolConfig(input);
}

export function validateAllConfigs(configs: unknown[]): {
  valid: number;
  errors: { index: number; message: string }[];
} {
  const errors: { index: number; message: string }[] = [];

  configs.forEach((config, index) => {
    try {
      parseToolConfig(config);
    } catch (error) {
      errors.push({
        index,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return { valid: configs.length - errors.length, errors };
}

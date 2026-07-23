/** Default thematic accent for tool page CTAs (app download, etc.) */
export const toolTheme = {
  primary: "#00C3FF",
  primaryDark: "#00A3D9",
  primaryMuted: "#E5F9FF",
  onPrimary: "#023047",
  downloadButton: "#023047",
} as const;

export type ToolThemeColor = typeof toolTheme.primary | (string & {});

/** Default thematic accent for tool page CTAs (app download, etc.) */
export const toolTheme = {
  primary: "#209EBB",
  primaryDark: "#1A8099",
  primaryMuted: "#E8F6FA",
  onPrimary: "#FFFFFF",
  downloadButton: "#023047",
} as const;

export type ToolThemeColor = typeof toolTheme.primary | (string & {});

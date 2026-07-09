/**
 * The Material Symbols icon set used by the Developer "Toolkit" section. Kept as
 * a shared list so the admin icon picker and the public page agree on valid keys.
 * These mirror (and extend) the icons in design/code.html.
 */
export const TOOLKIT_ICON_KEYS = [
  "code_blocks",
  "api",
  "data_object",
  "terminal",
  "database",
  "dns",
  "code",
  "memory",
  "cloud",
  "settings",
  "bolt",
  "hub",
  "layers",
  "grid_view",
  "webhook",
  "lan",
  "storage",
  "deployed_code",
  "function",
  "schema",
] as const;

export type ToolkitIconKey = (typeof TOOLKIT_ICON_KEYS)[number];

/** Fallback icon when a stored key is unknown. */
export const DEFAULT_TOOLKIT_ICON = "code";

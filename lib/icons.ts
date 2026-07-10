import { BRAND_KEYS, BRAND_LABELS, type BrandKey } from "./BrandIcon";

/**
 * The Toolkit icon picker now offers real brand logos (see lib/BrandIcon.tsx)
 * instead of Material Symbols glyphs. icon_key stores one of these brand keys.
 */
export const TOOLKIT_ICON_KEYS = BRAND_KEYS;
export type ToolkitIconKey = BrandKey;
export const TOOLKIT_ICON_LABELS = BRAND_LABELS;

/** Fallback key when a stored value is unknown. */
export const DEFAULT_TOOLKIT_ICON: BrandKey = "rust";

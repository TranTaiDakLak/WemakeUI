/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — Design Tokens Public API
 *  Single entry point for all design tokens.
 *
 *  Usage:
 *    import { colors, semanticColors, radius, density } from '@/ui-system/tokens'
 * ═══════════════════════════════════════════════════════════════
 */

// ── Layer 1: Raw Tokens ────────────────────────────────
export { colors } from './colors'
export type { ColorToken } from './colors'

export { gradients } from './gradients'
export type { GradientToken } from './gradients'

export {
  radius,
  elevation,
  typography,
  spacing,
  motion,
  glass,
  zIndex,
  density,
} from './scales'
export type {
  RadiusToken,
  ElevationToken,
  TypographyToken,
  SpacingToken,
  MotionToken,
  GlassToken,
  ZIndexToken,
  DensityToken,
  DensityMode,
} from './scales'

// ── Layer 2: Semantic Tokens ───────────────────────────
export { semanticColors, semanticGradients } from './semantic'
export type { SemanticColorToken, SemanticGradientToken } from './semantic'

// ── Layer 3: Theme Tokens ──────────────────────────────
export { lightTheme, getDensityVars } from './theme'
export type { ThemeConfig } from './theme'

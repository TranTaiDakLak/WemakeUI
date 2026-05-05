/**
 * ═══════════════════════════════════════════════════════════════
 *  WemakeUI — Cross-platform Vue 3 UI Kit
 *  Library entry point: components, composables, tokens, styles.
 *
 *  Targets: Web · Mobile (Capacitor / Ionic) · Desktop (Wails / Tauri / Electron)
 *
 *  Usage:
 *    import { BaseButton, useToast } from '@wemake/ui'
 *    import '@wemake/ui/style.css'
 * ═══════════════════════════════════════════════════════════════
 */

// ── Foundation styles (tokens, dark mode, layout, surfaces…) ────
import './ui-system/foundations'
import './style.css'

// ── Common Components ──────────────────────────────────────────
export * from './components/common'

// ── Composables ────────────────────────────────────────────────
export * from './composables'

// ── Design Tokens ──────────────────────────────────────────────
export * from './ui-system/tokens'

// ── Utilities ──────────────────────────────────────────────────
export { cn } from './ui-system/utils'

// ── Types ──────────────────────────────────────────────────────
export * from './types'

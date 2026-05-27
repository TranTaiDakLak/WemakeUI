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
import './ui-system/foundations/index.css'
import './style.css'

// ── Common Components ──────────────────────────────────────────
export * from './components/common'

// ── Layout Components ──────────────────────────────────────────
export * from './components/layout'

// ── Platform Components ────────────────────────────────────────
export * from './components/platform'

// ── Data Components (phase 4) ──────────────────────────────────
export * from './components/data'

// ── Chart Components ───────────────────────────────────────────
export * from './components/charts'

// ── Phase 5 — Feedback / Async / Permission ────────────────────
export * from './components/feedback'
export * from './components/async'
export * from './components/permission'

// ── Composables ────────────────────────────────────────────────
export * from './composables'

// ── Directives ─────────────────────────────────────────────────
export { vCan, vFlag, registerDirectives } from './directives'

// ── Design Tokens ──────────────────────────────────────────────
export * from './ui-system/tokens'

// ── Theme Composable ───────────────────────────────────────────
export { useTheme } from './ui-system/composables/useTheme'
export type { Theme, ColorScheme, Variant } from './ui-system/composables/useTheme'

// ── Utilities ──────────────────────────────────────────────────
export { cn, generateScale, applyScale } from './ui-system/utils'
export type { ColorScale } from './ui-system/utils'
export { ACTION_ICONS } from './utils/actionIcons'
export type { ActionIconName } from './utils/actionIcons'

// ── Types ──────────────────────────────────────────────────────
export * from './types'

// ── Archetypes ─────────────────────────────────────────────────
export { default as CrudPage } from './archetypes/crud/CrudPage.vue'
export type { CrudPageConfig, CrudColumnDef, FormFieldConfig, FilterConfig, DetailSectionConfig, BulkActionConfig, RowId } from './schemas/crud.schema'

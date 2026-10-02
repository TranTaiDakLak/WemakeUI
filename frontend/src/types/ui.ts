/**
 * Generic UI types shared across the MindUI library.
 */

/** Context menu item definition */
export interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
  children?: ContextMenuItem[]
  action?: () => void
}

/** Generic DataGrid column configuration */
export interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  group: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  class?: string
}

/** Cell reference for selection */
export interface CellRef {
  row: number
  col: string
}

/** Modal size presets */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/** Generic stats shape (used by StatusBar) */
export interface GridStats {
  total: number
  live: number
  highlighted: number
  selected: number
}

/* ── Primitives theo ngôn ngữ thiết kế MindAds (icon-tile, segmented, banner, status dot…) ── */

/** Tông màu của BaseIconTile / BaseOptionCard (gradient lấy từ --wx-gradient-tile-*). */
export type IconTileTone = 'brand' | 'blue' | 'success' | 'warning' | 'danger' | 'neutral'

/** Một lựa chọn của BaseSegmented. `icon` là chuỗi SVG/HTML (cùng quy ước với BaseButton). */
export interface SegmentedOption<T extends string | number = string | number> {
  value: T
  label?: string
  icon?: string
  /** tooltip native (title) và aria-label khi chỉ có icon */
  title?: string
  disabled?: boolean
}

/** Tông của BaseUpdateBanner. */
export type BannerTone = 'info' | 'warning' | 'success' | 'danger'

/** Tông của BaseStatusDot. */
export type StatusDotTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

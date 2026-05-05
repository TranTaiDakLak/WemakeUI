/**
 * Generic UI types shared across the WemakeUI library.
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

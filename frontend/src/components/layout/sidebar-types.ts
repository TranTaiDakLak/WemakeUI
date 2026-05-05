/**
 * Types cho AppSidebar — tách ra để có thể re-export qua layout/index.ts
 * (vue-tsc 1.8 + TS 4.9 không nhả type từ <script setup>).
 */

export interface SidebarItem {
  /** id unique (cho key + active state) */
  id: string
  /** label sentence case */
  label: string
  /** SVG icon string (HTML) hoặc icon component name */
  icon?: string
  /** badge count (số lượng noti / pending) */
  badge?: number | string
  /** sub-items (1 level nested) */
  children?: SidebarItem[]
  /** shortcut hint hiển thị bên phải (cmd+k style) */
  shortcut?: string
  /** disabled */
  disabled?: boolean
  /** href — ưu tiên hơn click handler */
  href?: string
  /** dữ liệu tùy ý gắn kèm */
  meta?: Record<string, unknown>
}

export interface SidebarSection {
  /** label group (sentence case, hide khi collapsed) */
  label?: string
  /** items thuộc group */
  items: SidebarItem[]
}

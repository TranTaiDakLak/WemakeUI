/**
 * Types dùng chung cho bộ component "workspace" của MindUI
 * (MindToolbar · MindFilterStrip · MindStatBar · MindProgressBar · MindPanel).
 */

export interface MindToolbarTab {
  value: string
  label: string
  /** số đếm nhỏ cạnh nhãn */
  count?: number
}

export interface MindStatItem {
  label: string
  value: number | string
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'violet'
  /** ngăn cách mảnh phía sau chip */
  divider?: boolean
}

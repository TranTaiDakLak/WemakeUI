/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — Theme Tokens (Layer 3)
 *  Composed themes that combine raw + semantic values.
 *  Each theme is a complete set of CSS variable overrides.
 *
 *  Usage:
 *    import { lightTheme, compactTheme } from '@/ui-system/tokens/theme'
 * ═══════════════════════════════════════════════════════════════
 */

import { density } from './scales'
import type { DensityMode } from './scales'

/**
 * Light theme — the default WeExtension visual identity.
 * All CSS custom properties default to these values.
 */
export const lightTheme = {
  name: 'light' as const,

  brand: {
    primary:  '#2563eb',
    accent:   '#06b6d4',
    focus:    '#007bff',
  },

  text: {
    primary:   '#0f172a',
    secondary: '#475569',
    muted:     '#64748b',
    disabled:  '#cbd5e1',
    light:     '#94a3b8',
    inverse:   '#ffffff',
    link:      '#2563eb',
  },

  surface: {
    base:     '#ffffff',
    elevated: '#ffffff',
    sunken:   '#f8fafc',
    overlay:  'rgba(0,0,0,0.2)',
  },

  border: {
    default:    '#e2e8f0',
    subtle:     '#f1f5f9',
    focus:      '#007bff',
    control:    '#cbd5e1',
    controlHover: '#94a3b8',
    glass:      'rgba(255,255,255,0.5)',
    glassLight: 'rgba(255,255,255,0.3)',
  },

  scrollbar: {
    track:      'transparent',
    thumb:      '#cbd5e1',
    thumbHover: '#94a3b8',
  },
} as const

/**
 * Returns density-specific overrides as CSS variable values.
 */
export function getDensityVars(mode: DensityMode) {
  const d = density[mode]
  // Lưu ý: `--wx-density-icon-size` và `--wx-density-avatar-size` chưa có consumer nội bộ
  // (repo này chưa có BaseIcon dùng chung — icon là inline SVG/emoji per-component).
  // Đây là 2 token nằm trong bộ 10 density token public (xem DESIGN.md §1.7), dành cho
  // consumer bên ngoài dùng trong CSS của họ — KHÔNG phải dead code, không xoá/đổi tên.
  return {
    '--wx-density-header-height':  d.headerHeight,
    '--wx-density-row-height':     d.rowHeight,
    '--wx-density-input-height':   d.inputHeight,
    '--wx-density-cell-px':        d.cellPaddingX,
    '--wx-density-cell-py':        d.cellPaddingY,
    '--wx-density-font-size':      d.fontSize,
    '--wx-density-icon-size':      d.iconSize,
    '--wx-density-avatar-size':    d.avatarSize,
    '--wx-density-gap':            d.gap,
    '--wx-density-container-pad':  d.containerPad,
  } as Record<string, string>
}

export type ThemeConfig = typeof lightTheme

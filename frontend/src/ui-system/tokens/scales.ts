/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — Scale Tokens (Layer 1 continued)
 *  Non-color design values: spacing, radius, elevation,
 *  typography, motion, glass, z-index.
 * ═══════════════════════════════════════════════════════════════
 */

// ── Border Radius ──────────────────────────────────────
export const radius = {
  none: '0',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '32px',
  full: '9999px',
  /** Control geometry (nguồn MindAds): nút/input 9px, option 10px, tile 11px, menu 14px, panel 16px */
  'ctrl-sm': '8px',
  ctrl:  '9px',
  item:  '10px',
  tile:  '11px',
  menu:  '14px',
  panel: '16px',
} as const

// ── Elevation (Shadows) ────────────────────────────────
export const elevation = {
  none:        'none',
  sm:          '0 1px 2px rgba(15,23,42,0.05)',
  md:          '0 4px 6px -1px rgba(15,23,42,0.06), 0 2px 4px -2px rgba(15,23,42,0.04)',
  lg:          '0 8px 30px rgba(15,23,42,0.06)',
  xl:          '0 20px 40px -5px rgba(59,130,246,0.15)',
  '2xl':       '0 24px 56px -12px rgba(15,23,42,0.22), 0 4px 12px rgba(15,23,42,0.06)',
  '3xl':       '0 30px 60px -12px rgba(0,0,0,0.1)',
  brandGlow:   '0 10px 20px -5px rgba(58,123,213,0.4)',
  buttonGlow:  '0 4px 15px rgba(59,130,246,0.4)',
  blueCard:    '0 8px 20px rgba(58,123,213,0.3)',
  successGlow: '0 4px 6px rgba(16,185,129,0.1)',
  dangerGlow:  '0 4px 6px rgba(239,68,68,0.1)',
  clay:        '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
  inner:       'inset 0 1px 2px rgba(255,255,255,0.2), 0 4px 6px -1px rgba(0,0,0,0.05)',
  /** Focus ring shadow (brand blue) */
  focusRing:   '0 0 0 3px rgba(59,130,246,0.18)',
  /** Nút solid: bóng xanh mềm + hover đậm hơn */
  btn:         '0 2px 6px rgba(37,99,235,0.32)',
  btnHover:    '0 4px 10px rgba(37,99,235,0.4)',
  /** Nổi: popover form / menu dropdown / toast / thẻ mềm / rãnh lõm / icon-tile / tooltip */
  popover:     '0 16px 40px rgba(15,23,42,0.16), 0 2px 6px rgba(15,23,42,0.06)',
  menu:        '0 16px 36px -6px rgba(15,23,42,0.14), 0 4px 12px -2px rgba(15,23,42,0.06)',
  toast:       '0 10px 25px -5px rgba(15,23,42,0.12), 0 8px 10px -6px rgba(15,23,42,0.08)',
  cardSoft:    '0 1px 2px rgba(15,23,42,0.04), 0 10px 26px -18px rgba(15,23,42,0.18)',
  insetField:  'inset 0 1px 2px rgba(15,23,42,0.08)',
  tile:        '0 4px 12px rgba(99,102,241,0.28), inset 0 1px 1px rgba(255,255,255,0.4)',
  tooltip:     '0 10px 24px -8px rgba(15,23,42,0.45)',
} as const

// ── Typography ─────────────────────────────────────────
export const typography = {
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    display: '"Nunito", "Inter", sans-serif',
    /** Chakra Petch — font "kỹ thuật" của nguồn; fallback Inter */
    tech:    '"Chakra Petch", "Inter", sans-serif',
    mono:    'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  fontSize: {
    '2xs':  '9px',
    xs:     '10px',
    sm:     '11px',
    base:   '12px',
    md:     '13px',
    lg:     '14px',
    xl:     '15px',
    '2xl':  '18px',
    '3xl':  '20px',
    '4xl':  '24px',
  },
  fontWeight: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
    extrabold: 800,
    black:    900,
  },
  tracking: {
    tight:   '-0.025em',
    normal:  '0',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
  lineHeight: {
    none:    '1',
    tight:   '1.2',
    snug:    '1.4',
    normal:  '1.6',
    relaxed: '1.625',
    loose:   '2',
  },
} as const

// ── Spacing ────────────────────────────────────────────
export const spacing = {
  px:     '1px',
  '0.5':  '2px',
  '1':    '4px',
  '1.5':  '6px',
  '2':    '8px',
  '2.5':  '10px',
  '3':    '12px',
  '3.5':  '14px',
  '4':    '16px',
  '5':    '20px',
  '6':    '24px',
  '7':    '28px',
  '8':    '32px',
  '10':   '40px',
  '12':   '48px',
  '16':   '64px',
  '20':   '80px',
} as const

// ── Motion ─────────────────────────────────────────────
export const motion = {
  duration: {
    instant:    '0ms',
    fast:       '150ms',
    normal:     '300ms',
    slow:       '500ms',
    decorative: '700ms',
    scenic:     '1000ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in:      'cubic-bezier(0.4, 0, 1, 1)',
    out:     'ease-out',
    inOut:   'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    bounce:  'cubic-bezier(0.16, 1, 0.3, 1)',
    spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

// ── Glass (Glassmorphism) ──────────────────────────────
export const glass = {
  heavy: {
    bg:     'rgba(255,255,255,0.6)',
    blur:   '25px',
    border: 'rgba(255,255,255,0.5)',
  },
  medium: {
    bg:     'rgba(255,255,255,0.4)',
    blur:   '12px',
    border: 'rgba(255,255,255,0.6)',
  },
  light: {
    bg:     'rgba(255,255,255,0.2)',
    blur:   '12px',
    border: 'rgba(255,255,255,0.3)',
  },
  subtle: {
    bg:     'rgba(255,255,255,0.1)',
    blur:   '8px',
    border: 'rgba(255,255,255,0.2)',
  },
} as const

// ── Z-Index ────────────────────────────────────────────
export const zIndex = {
  behind:   -1,
  base:     0,
  raised:   10,
  dropdown: 50,
  sticky:   100,
  header:   200,
  overlay:  500,
  modal:    1000,
  popover:  1100,
  toast:    1200,
  tooltip:  1300,
  topmost:  9999,
} as const

// ── Density ────────────────────────────────────────────
export const density = {
  compact: {
    headerHeight:  '48px',
    rowHeight:     '32px',
    inputHeight:   '28px',
    cellPaddingX:  '8px',
    cellPaddingY:  '4px',
    fontSize:      '11px',
    iconSize:      '14px',
    avatarSize:    '24px',
    gap:           '4px',
    containerPad:  '12px',
  },
  default: {
    headerHeight:  '56px',
    rowHeight:     '40px',
    inputHeight:   '34px',
    cellPaddingX:  '12px',
    cellPaddingY:  '8px',
    fontSize:      '14px',
    iconSize:      '16px',
    avatarSize:    '32px',
    gap:           '8px',
    containerPad:  '16px',
  },
  comfortable: {
    headerHeight:  '64px',
    rowHeight:     '48px',
    inputHeight:   '44px',
    cellPaddingX:  '16px',
    cellPaddingY:  '12px',
    fontSize:      '15px',
    iconSize:      '20px',
    avatarSize:    '40px',
    gap:           '12px',
    containerPad:  '24px',
  },
} as const

// ── Control geometry (compact density) ─────────────────
/** Chiều cao control theo size. Thiết bị cảm ứng tự nâng lên (44px md) bằng @media (pointer: coarse) trong tokens.css. */
export const control = {
  height: { sm: '28px', md: '34px', lg: '40px', xl: '48px' },
  /** padding ngang + cỡ chữ mặc định trong control */
  paddingX: '12px',
  fontSize: '13px',
} as const

// ── Overlay (backdrop / tooltip / motion) ───────────────
export const overlay = {
  backdropBg:   'rgba(15,23,42,0.5)',
  backdropBlur: '2px',
  tooltipBg:    '#26304c',
  tooltipText:  '#eef1fb',
  durationIn:   '180ms',
  durationOut:  '140ms',
} as const

// ── Scrollbar ("Slim Pro") ──────────────────────────────
export const scrollbar = {
  width:      '8px',
  widthThin:  '5px',
  thumb:      '#cbd5e1',
  thumbHover: '#94a3b8',
} as const

export type RadiusToken     = typeof radius
export type ElevationToken  = typeof elevation
export type TypographyToken = typeof typography
export type SpacingToken    = typeof spacing
export type MotionToken     = typeof motion
export type GlassToken      = typeof glass
export type ZIndexToken     = typeof zIndex
export type DensityToken    = typeof density
export type DensityMode     = keyof typeof density
export type ControlToken    = typeof control
export type OverlayToken    = typeof overlay
export type ScrollbarToken  = typeof scrollbar

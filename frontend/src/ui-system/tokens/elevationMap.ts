/**
 * ═══════════════════════════════════════════════════════════════
 *  MindUI — Elevation (shadow) → use case mapping
 *
 *  CSS vars: --wx-shadow-sm | md | lg | xl | 2xl | brand | focus
 * ═══════════════════════════════════════════════════════════════
 */

export type ShadowKey =
  | 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'brand' | 'focus' | 'lift'
  | 'btn' | 'btn-hover' | 'popover' | 'menu' | 'toast' | 'card-soft' | 'inset' | 'tile' | 'tooltip'

/** Use-case → shadow mapping. Always reference via this map. */
export const componentShadow = {
  buttonSolid:       'btn',
  buttonSolidHover:  'btn-hover',
  formPanel:         'popover',
  selectMenu:        'menu',
  toastCard:         'toast',
  cardSoft:          'card-soft',
  insetField:        'inset',
  iconTile:          'tile',
  tooltipPanel:      'tooltip',
  inputFocused:    'sm',
  divider:         'sm',
  cardDefault:     'md',
  listRowRaised:   'md',
  dropdown:        'lg',
  popover:         'lg',
  hoverCard:       'lg',
  modal:           'xl',
  drawer:          'xl',
  tooltipElevated: '2xl',
  commandPalette:  '2xl',
  ctaHover:        'brand',
  focusRing:       'focus',
} as const satisfies Record<string, ShadowKey>

export type ComponentShadowKey = keyof typeof componentShadow

export const shadowVar = (k: ShadowKey): string =>
  k === 'none' ? 'none' : `var(--wx-shadow-${k})`

export function shadowOf(component: ComponentShadowKey): string {
  return shadowVar(componentShadow[component])
}

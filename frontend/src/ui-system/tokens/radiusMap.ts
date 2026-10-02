/**
 * ═══════════════════════════════════════════════════════════════
 *  MindUI — Radius mapping per component (anatomy)
 *
 *  Hard rule: every component HAS a default radius.
 *  Never `border-radius: 0` for card / button / input / modal / dropdown.
 *
 *  Map: component → radius token (from --wx-radius-*).
 * ═══════════════════════════════════════════════════════════════
 */

import { radius } from './scales'

export type RadiusKey = keyof typeof radius

/** Default radius for every component in the system. */
export const componentRadius = {
  /* atom */
  button:        'ctrl', /* 9px — nguồn MindAds */
  input:         'ctrl',
  textarea:      'ctrl',
  select:        'ctrl',
  option:        'item', /* 10px — option trong menu/select */
  iconTile:      'tile', /* 11px */
  checkbox:      'sm',
  radio:         'full',
  toggle:        'full',
  badge:         'full',
  avatar:        'full',
  chip:          'full',
  tag:           'sm',
  pill:          'full',
  spinner:       'full',
  progress:      'full',

  /* container */
  card:          'lg',  /* 12px */
  groupBox:      'lg',
  panel:         'lg',
  listItem:      'lg',
  segmented:     'lg',

  /* overlay */
  modal:         'xl',  /* 16px */
  drawer:        'xl',
  bottomSheet:   'xl',
  dropdown:      'menu',  /* 14px */
  selectMenu:    'menu',
  popover:       'lg',
  formPanel:     'panel', /* 16px — popover form (head/body/foot) */
  tooltip:       'md',
  toast:         'md',
  contextMenu:   'md',

  /* feature */
  featureCard:   '2xl', /* 24px */
  pricingCard:   '2xl',
  hero:          '3xl', /* 30px */
  onboarding:    '4xl', /* 32px */

  /* skeleton variants */
  skeletonText:   'md',
  skeletonCard:   'lg',
  skeletonAvatar: 'full',
} as const satisfies Record<string, RadiusKey>

export type ComponentRadiusKey = keyof typeof componentRadius

/** Look up the radius token for a component. */
export function radiusOf(component: ComponentRadiusKey): string {
  return radius[componentRadius[component]]
}

/** CSS var form of a radius token. */
export const radiusVar = (k: RadiusKey): string => `var(--wx-radius-${k})`

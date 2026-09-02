<script setup lang="ts">
defineProps<{
  text?: string | number
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulsing?: boolean
  /** Solid fill (notification count style) — bg đậm + text trắng + viền trắng */
  solid?: boolean
}>()
</script>

<template>
  <span
    class="base-badge"
    :class="[
      `base-badge--${variant ?? 'primary'}`,
      `base-badge--${size ?? 'md'}`,
      {
        'base-badge--dot-only': dot && !text && !$slots.default,
        'base-badge--with-dot': dot && (text || $slots.default),
        'base-badge--pulsing': pulsing,
        'base-badge--solid': solid,
      }
    ]"
  >
    <span v-if="dot && (text || $slots.default)" class="base-badge__dot" />
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px var(--wx-space-2);
  border-radius: var(--wx-radius-full);
  font-size: 11px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  font-family: var(--wx-font-primary);
}

.base-badge--primary { background: var(--wx-neutral-bg); color: var(--wx-text-primary); border: 1px solid var(--wx-border-default); }
.base-badge--success { background: color-mix(in srgb, var(--wx-success-solid) 12%, transparent); color: var(--wx-success-text); }
.base-badge--warning { background: color-mix(in srgb, var(--wx-warning-solid) 12%, transparent); color: var(--wx-warning-text); }
.base-badge--danger  { background: color-mix(in srgb, var(--wx-danger-solid) 12%, transparent);  color: var(--wx-danger-text); }
.base-badge--info    { background: color-mix(in srgb, var(--wx-brand-primary) 12%, transparent); color: var(--wx-brand-primary); }
.base-badge--ghost   { background: transparent; color: var(--wx-text-secondary); border: 1px solid var(--wx-border-default); }
.base-badge--neutral { background: var(--wx-neutral-bg); color: var(--wx-neutral-text); border: 1px solid var(--wx-neutral-border); }

.base-badge--sm { font-size: 10px; padding: 1px 6px; }
.base-badge--md { font-size: 11px; padding: 2px var(--wx-space-2); }
.base-badge--lg { font-size: 12px; padding: 3px 10px; }

/* Dot indicator inline (dot=true + has text) */
.base-badge--with-dot { gap: 5px; }
.base-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.base-badge--success .base-badge__dot { background: var(--wx-success-text); }
.base-badge--warning .base-badge__dot { background: var(--wx-warning-text); }
.base-badge--danger  .base-badge__dot { background: var(--wx-danger-text); }
.base-badge--info    .base-badge__dot { background: var(--wx-brand-primary); }
.base-badge--primary .base-badge__dot { background: var(--wx-brand-primary); }
.base-badge--neutral .base-badge__dot { background: var(--wx-neutral-text); }

/* Dot-only circle (dot=true, no text) */
.base-badge--dot-only {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
}
.base-badge--dot-only.base-badge--primary { background: var(--wx-brand-primary); border: none; }
.base-badge--dot-only.base-badge--success { background: var(--wx-success-text); }
.base-badge--dot-only.base-badge--warning { background: var(--wx-warning-text); }
.base-badge--dot-only.base-badge--danger  { background: var(--wx-danger-text); }
.base-badge--dot-only.base-badge--info    { background: var(--wx-brand-primary); }

/* Solid (notification count style) — luôn bg đậm + chữ trắng + viền trắng */
.base-badge--solid {
  color: #fff;
  border: 2px solid #fff;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.base-badge--solid.base-badge--danger  { background: var(--wx-danger-solid); box-shadow: 0 2px 6px rgba(239, 68, 68, 0.45); }
.base-badge--solid.base-badge--success { background: var(--wx-success-solid); box-shadow: 0 2px 6px rgba(34, 197, 94, 0.45); }
.base-badge--solid.base-badge--warning { background: var(--wx-warning-solid); box-shadow: 0 2px 6px rgba(245, 158, 11, 0.45); }
.base-badge--solid.base-badge--info    { background: var(--wx-brand-primary); box-shadow: 0 2px 6px rgba(59, 130, 246, 0.45); }
.base-badge--solid.base-badge--primary { background: var(--wx-brand-primary); }
.base-badge--solid.base-badge--neutral { background: var(--wx-text-secondary); }
.wx-dark .base-badge--solid { border-color: var(--wx-surface-base); }

/* Dark mode — brighten feedback hues one step to keep WCAG AA contrast on dark surfaces */
.wx-dark .base-badge--success { background: var(--wx-success-bg); color: var(--wx-success-text); }
.wx-dark .base-badge--warning { background: var(--wx-warning-bg); color: var(--wx-warning-text); }
.wx-dark .base-badge--danger  { background: var(--wx-danger-bg);  color: var(--wx-danger-text); }
/* Dot overrides removed (round 21): light-mode dot rules above now use var(--wx-success-text)/
   var(--wx-warning-text)/var(--wx-danger-text) directly, which already cascade to the dark-mode
   token values via .wx-dark on an ancestor — the old duplicate rules here were pixel-identical. */

/* Pulsing (for dot-only indicators) */
.base-badge--pulsing { animation: badge-pulse 2s infinite; }
@keyframes badge-pulse {
  0%   { box-shadow: 0 0 0 0 currentColor; }
  70%  { box-shadow: 0 0 0 4px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
</style>

<script setup lang="ts">
defineProps<{
  text?: string | number
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
  pulsing?: boolean
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
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  font-size: 11px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  font-family: var(--wx-font-primary);
}

.base-badge--primary { background: var(--wx-surface-hover); color: var(--wx-text-primary); border: 1px solid var(--wx-border-default); }
.base-badge--success { background: rgba(16, 185, 129, 0.12); color: #059669; }
.base-badge--warning { background: rgba(245, 158, 11, 0.12); color: #d97706; }
.base-badge--danger  { background: rgba(239, 68, 68, 0.12);  color: #dc2626; }
.base-badge--info    { background: rgba(59, 130, 246, 0.12); color: var(--wx-brand-primary); }
.base-badge--ghost   { background: transparent; color: var(--wx-text-secondary); border: 1px solid var(--wx-border-default); }
.base-badge--neutral { background: var(--wx-neutral-bg); color: var(--wx-neutral-text); border: 1px solid var(--wx-neutral-border); }

.base-badge--sm { font-size: 10px; padding: 1px 6px; }
.base-badge--md { font-size: 11px; padding: 2px 8px; }

/* Dot indicator inline (dot=true + has text) */
.base-badge--with-dot { gap: 5px; }
.base-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.base-badge--success .base-badge__dot { background: #059669; }
.base-badge--warning .base-badge__dot { background: #d97706; }
.base-badge--danger  .base-badge__dot { background: #dc2626; }
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
.base-badge--dot-only.base-badge--success { background: #059669; }
.base-badge--dot-only.base-badge--warning { background: #d97706; }
.base-badge--dot-only.base-badge--danger  { background: #dc2626; }
.base-badge--dot-only.base-badge--info    { background: var(--wx-brand-primary); }

/* Pulsing (for dot-only indicators) */
.base-badge--pulsing { animation: badge-pulse 2s infinite; }
@keyframes badge-pulse {
  0%   { box-shadow: 0 0 0 0 currentColor; }
  70%  { box-shadow: 0 0 0 4px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
</style>

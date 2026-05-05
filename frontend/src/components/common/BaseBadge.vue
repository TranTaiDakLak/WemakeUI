<script setup lang="ts">
defineProps<{
  text?: string | number
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost'
  dot?: boolean
  pulsing?: boolean
}>()
</script>

<template>
  <span
    class="base-badge"
    :class="[
      `base-badge--${variant ?? 'primary'}`,
      { 'base-badge--dot': dot, 'base-badge--pulsing': pulsing }
    ]"
  >
    <slot>{{ dot ? '' : text }}</slot>
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
  font-weight: 700;
  line-height: normal;
  white-space: nowrap;
  font-family: var(--wx-font-primary);
}

.base-badge--primary { background: var(--wx-surface-hover); color: var(--wx-text-primary); border: 1px solid var(--wx-border-default); }
.base-badge--success { background: rgba(16, 185, 129, 0.15); color: var(--wx-success-solid); }
.base-badge--warning { background: rgba(245, 158, 11, 0.15); color: var(--wx-warning-solid); }
.base-badge--danger { background: rgba(239, 68, 68, 0.15); color: var(--wx-danger-solid); }
.base-badge--info { background: rgba(59, 130, 246, 0.15); color: var(--wx-brand-primary); }
.base-badge--ghost { background: transparent; color: var(--wx-text-secondary); border: 1px solid var(--wx-border-default); }

/* Dot Variant */
.base-badge--dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
}
.base-badge--dot.base-badge--primary { background: var(--wx-brand-primary); border: none; }
.base-badge--dot.base-badge--success { background: var(--wx-success-solid); }
.base-badge--dot.base-badge--warning { background: var(--wx-warning-solid); }
.base-badge--dot.base-badge--danger { background: var(--wx-danger-solid); }

/* Pulsing */
.base-badge--pulsing {
  animation: badge-pulse 2s infinite;
}
@keyframes badge-pulse {
  0% { box-shadow: 0 0 0 0 currentColor; }
  70% { box-shadow: 0 0 0 4px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
</style>

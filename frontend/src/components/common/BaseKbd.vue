<script setup lang="ts">
/**
 * BaseKbd — phím tắt dạng "keycap" (Esc, Ctrl, K…). Port từ `wm-kbd` của MindAds.
 * Dùng trong đầu form panel, command palette, tooltip hướng dẫn.
 */
withDefaults(defineProps<{
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})
</script>

<template>
  <kbd class="wx-kbd" :data-size="size"><slot /></kbd>
</template>

<style scoped>
.wx-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  border: 1px solid var(--wx-border-default);
  border-bottom-width: 2px;
  border-radius: 5px;
  background: var(--wx-surface-elevated);
  color: var(--wx-text-muted);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-10);
  font-weight: var(--wx-fw-bold);
  line-height: 1;
  white-space: nowrap;
}

.wx-kbd[data-size="sm"] {
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--wx-radius-sm);
  font-size: 9px;
}
</style>

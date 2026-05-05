<script setup lang="ts">
defineProps<{
  count: number
  show?: boolean
}>()

defineEmits<{
  clear: []
}>()
</script>

<template>
  <transition name="bulk-bar">
    <div v-if="show && count > 0" class="bulk-bar">
      <span class="bulk-bar__count">
        Đã chọn <b>{{ count }}</b> mục
      </span>
      <span class="bulk-bar__sep" />
      <div class="bulk-bar__actions">
        <slot />
      </div>
      <span class="bulk-bar__sep" />
      <button class="bulk-bar__clear" @click="$emit('clear')" aria-label="Bỏ chọn tất cả">
        Bỏ chọn
      </button>
    </div>
  </transition>
</template>

<style scoped>
.bulk-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  box-shadow: var(--wx-shadow-xl);
  z-index: 800;
  backdrop-filter: blur(12px);
  font-family: var(--wx-font-primary);
}

.bulk-bar__count {
  font-size: 13px;
  color: var(--wx-text-primary);
}

.bulk-bar__count b {
  color: var(--wx-brand-primary);
  font-weight: 700;
}

.bulk-bar__sep {
  width: 1px;
  height: 20px;
  background: var(--wx-border-subtle);
}

.bulk-bar__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bulk-bar__clear {
  background: none;
  border: none;
  color: var(--wx-text-muted);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--wx-radius-sm);
  font-family: var(--wx-font-primary);
  transition: all var(--wx-duration-fast);
}

.bulk-bar__clear:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.bulk-bar-enter-active,
.bulk-bar-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.bulk-bar-enter-from,
.bulk-bar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>

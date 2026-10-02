<script setup lang="ts">
/**
 * TopbarButton — nút icon dạng kính (glass) đặt trên nền gradient của AppTopbar.
 *
 *   <TopbarButton label="Thông báo" :badge="3"><span v-html="icon" /></TopbarButton>
 *   <TopbarButton label="Tìm kiếm" shortcut="Ctrl K" @click="openPalette" />
 *
 * props:
 *   label    — aria-label + tooltip (bắt buộc: nút chỉ có icon)
 *   badge    — số/chuỗi hiện chấm đỏ góc trên
 *   active   — trạng thái đang mở (menu/panel)
 *   dot      — chỉ hiện chấm tròn (không số)
 * slots: default (icon)
 */
withDefaults(defineProps<{
  label: string
  badge?: number | string
  active?: boolean
  dot?: boolean
  type?: 'button' | 'submit'
}>(), {
  active: false,
  dot: false,
  type: 'button',
})

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    class="wx-topbar-btn"
    :class="{ 'wx-topbar-btn--active': active }"
    :type="type"
    :aria-label="label"
    :title="label"
    :aria-pressed="active || undefined"
    @click="$emit('click', $event)"
  >
    <span class="wx-topbar-btn__icon" aria-hidden="true"><slot /></span>
    <span
      v-if="badge !== undefined && badge !== '' && badge !== 0"
      class="wx-topbar-btn__badge"
    >{{ badge }}</span>
    <span v-else-if="dot" class="wx-topbar-btn__dot" />
  </button>
</template>

<style scoped>
.wx-topbar-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: var(--wx-shell-on-brand);
  cursor: pointer;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-topbar-btn:hover {
  background: var(--wx-shell-glass-bg-hover);
  border-color: var(--wx-shell-glass-border);
}
.wx-topbar-btn:active { transform: scale(0.94); }
.wx-topbar-btn:focus-visible {
  outline: 2px solid var(--wx-shell-on-brand);
  outline-offset: 2px;
}
.wx-topbar-btn--active {
  background: var(--wx-shell-glass-bg-hover);
  border-color: var(--wx-shell-glass-border);
}
.wx-topbar-btn__icon { display: inline-flex; }
.wx-topbar-btn__icon :deep(svg) { width: 17px; height: 17px; }

.wx-topbar-btn__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-full);
  background: var(--wx-shell-solid-danger);
  color: var(--wx-text-on-brand);
  font-size: 10px;
  font-weight: var(--wx-fw-bold);
  line-height: 1;
  box-shadow: 0 0 0 2px var(--wx-brand-600);
  pointer-events: none;
}
.wx-topbar-btn__dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-danger-solid);
  box-shadow: 0 0 0 2px var(--wx-brand-600);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .wx-topbar-btn { transition: none; }
}
</style>

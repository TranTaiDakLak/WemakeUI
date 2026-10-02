<script setup lang="ts">
/**
 * BaseOptionCard — thẻ chọn hành động: icon-tile bên trái + 2 dòng chữ (tiêu đề / mô tả).
 * Port từ `wm-export-card` của MindAds (chọn định dạng xuất, chọn nguồn dữ liệu…).
 *
 * Là <button> thật: hover xanh nhạt, focus ring, trạng thái disabled/selected rõ ràng.
 * Slots: `icon` (thay nội dung tile), mặc định (tiêu đề), `description`, `trailing`.
 */
import type { IconTileTone } from '../../types'
import BaseIconTile from './BaseIconTile.vue'

withDefaults(defineProps<{
  title?: string
  description?: string
  /** chuỗi SVG/HTML cho tile; hoặc dùng slot `icon` */
  icon?: string
  tone?: IconTileTone
  disabled?: boolean
  /** thẻ đang được chọn (giữ nền xanh như hover) */
  selected?: boolean
}>(), {
  tone: 'blue',
  disabled: false,
  selected: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    type="button"
    class="wx-option-card"
    :class="{ 'wx-option-card--selected': selected }"
    :disabled="disabled"
    :aria-pressed="selected || undefined"
    @click="$emit('click', $event)"
  >
    <BaseIconTile v-if="icon || $slots.icon" :tone="tone" size="md" :icon="icon">
      <slot name="icon" />
    </BaseIconTile>
    <span class="wx-option-card__text">
      <span class="wx-option-card__title"><slot>{{ title }}</slot></span>
      <span v-if="description || $slots.description" class="wx-option-card__desc">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-if="$slots.trailing" class="wx-option-card__trailing"><slot name="trailing" /></span>
  </button>
</template>

<style scoped>
.wx-option-card {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: 11px;
  cursor: pointer;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-option-card:hover:not(:disabled),
.wx-option-card--selected {
  background: var(--wx-selected-bg);
  border-color: var(--wx-selected-border);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--wx-brand-600) 10%, transparent);
}
.wx-option-card:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: 1px; }
.wx-option-card:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

.wx-option-card__text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.wx-option-card__title {
  font-size: 12.5px;
  font-weight: var(--wx-fw-bold);
  line-height: 1.3;
  color: var(--wx-text-primary);
}
.wx-option-card__desc {
  margin-top: 1px;
  font-size: var(--wx-fs-11);
  line-height: 1.3;
  color: var(--wx-text-light);
}
.wx-option-card__trailing { flex-shrink: 0; display: inline-flex; align-items: center; color: var(--wx-text-light); }

@media (prefers-reduced-motion: reduce) {
  .wx-option-card { transition: none; }
}
</style>

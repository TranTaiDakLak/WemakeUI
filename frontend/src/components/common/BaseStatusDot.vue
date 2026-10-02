<script setup lang="ts">
/**
 * BaseStatusDot — chấm trạng thái nhỏ, có thể "nhấp nháy" (pulse). Port từ `status-dot-live/die` của MindAds.
 *
 * Khác BaseBadge `dot`: đây là chấm tối giản dùng trong hàng bảng / danh sách tài khoản.
 * Khác LiveBadge (async): LiveBadge gắn với vòng đời realtime; StatusDot chỉ là tín hiệu thị giác.
 *
 * Không có `label` thì chấm là phần tử trang trí (aria-hidden) — hãy kèm text bên cạnh,
 * hoặc truyền `label` để có role="img" + aria-label.
 */
import type { StatusDotTone } from '../../types'

withDefaults(defineProps<{
  tone?: StatusDotTone
  size?: 'sm' | 'md' | 'lg'
  /** nhịp tỏa sáng; tự tắt khi prefers-reduced-motion */
  pulse?: boolean
  /** nhãn đọc cho screen reader, đồng thời hiển thị cạnh chấm nếu `showLabel` */
  label?: string
  showLabel?: boolean
}>(), {
  tone: 'success',
  size: 'md',
  pulse: false,
  showLabel: false,
})
</script>

<template>
  <span class="wx-status-dot" :data-tone="tone" :data-size="size">
    <span
      class="wx-status-dot__dot"
      :class="{ 'wx-status-dot__dot--pulse': pulse }"
      :role="label && !showLabel ? 'img' : undefined"
      :aria-label="label && !showLabel ? label : undefined"
      :aria-hidden="label && !showLabel ? undefined : 'true'"
    />
    <span v-if="label && showLabel" class="wx-status-dot__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.wx-status-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
}

.wx-status-dot__dot {
  display: inline-block;
  flex-shrink: 0;
  border-radius: 50%;
  background: currentColor;
}
.wx-status-dot[data-size="sm"] .wx-status-dot__dot { width: 6px;  height: 6px; }
.wx-status-dot[data-size="md"] .wx-status-dot__dot { width: 8px;  height: 8px; }
.wx-status-dot[data-size="lg"] .wx-status-dot__dot { width: 10px; height: 10px; }

/* màu chấm = màu "solid" của tông (không đổi theo dark mode — chấm luôn rực) */
.wx-status-dot[data-tone="success"] .wx-status-dot__dot { color: var(--wx-success-solid); }
.wx-status-dot[data-tone="danger"]  .wx-status-dot__dot { color: var(--wx-danger-solid); }
.wx-status-dot[data-tone="warning"] .wx-status-dot__dot { color: var(--wx-warning-solid); }
.wx-status-dot[data-tone="info"]    .wx-status-dot__dot { color: var(--wx-info-solid); }
.wx-status-dot[data-tone="neutral"] .wx-status-dot__dot { color: var(--wx-neutral-solid); }

.wx-status-dot__dot--pulse { animation: wx-status-dot-pulse 2s infinite; }

@keyframes wx-status-dot-pulse {
  0%   { transform: scale(0.95); box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 70%, transparent); }
  70%  { transform: scale(1.1);  box-shadow: 0 0 0 4px transparent; }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .wx-status-dot__dot--pulse { animation: none; }
}
</style>

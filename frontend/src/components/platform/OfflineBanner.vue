<script setup lang="ts">
/**
 * OfflineBanner — banner sticky top khi mất kết nối.
 * Tự subscribe useOnline; hiển thị queue length nếu có.
 *
 * Diện mạo dùng lại <AppBanner variant="strip"> của shell (icon + tiêu đề + mô tả + cụm hành động):
 *   - offline        → tông cảnh báo (hổ phách)
 *   - online + queue → tông thông tin, icon đồng bộ quay
 *
 *   <OfflineBanner />                                  → auto track
 *   <OfflineBanner :online="false" :queued="3" />      → controlled
 *
 * slots: `actions` (nút phụ bên phải, vd "Thử lại")
 */
import { computed, useSlots, type Slots } from 'vue'
import { useOnline } from '../../composables/useOnline'
import AppBanner from '../layout/AppBanner.vue'
import { SHELL_ICONS } from '../layout/shell-icons'

interface Props {
  /** override controlled — nếu undefined, dùng useOnline() */
  online?: boolean
  /** override queue length */
  queued?: number
  /** ẩn khi offline & queue rỗng */
  hideWhenIdle?: boolean
}

const props = defineProps<Props>()
// Khai báo kiểu tường minh: template dùng `hasActions` (phụ thuộc `slots`) nên nếu để suy luận thì
// TS (bước sinh .d.ts) báo vòng phụ thuộc TS7022.
const slots: Slots = useSlots()

const { online: liveOnline, queue } = useOnline()

const isOnline = computed(() => (props.online === undefined ? liveOnline.value : props.online))
const queuedCount = computed(() => (props.queued === undefined ? queue.value.length : props.queued))

const visible = computed(() => {
  if (!isOnline.value) return true
  if (queuedCount.value > 0) return true
  return false
})

/** wifi gạch chéo (shell-icons chưa có) */
const OFFLINE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>'

const tone = computed(() => (isOnline.value ? 'info' : 'warning'))
const icon = computed(() => (isOnline.value ? SHELL_ICONS.sync : OFFLINE_ICON))
const title = computed(() => (isOnline.value ? 'Đã trực tuyến trở lại' : 'Không có kết nối mạng'))
const description = computed(() =>
  isOnline.value
    ? `Đang đồng bộ ${queuedCount.value} thay đổi…`
    : 'Đang dùng dữ liệu cache — thay đổi sẽ được đồng bộ khi có mạng.',
)
const hasActions = computed<boolean>(() => Boolean(slots.actions) || (queuedCount.value > 0 && !isOnline.value))
</script>

<template>
  <Transition name="wx-offline-slide">
    <div
      v-if="visible"
      class="wx-offline"
      :data-online="isOnline ? 'true' : 'false'"
      role="status"
      aria-live="polite"
    >
      <AppBanner
        variant="strip"
        :tone="tone"
        :icon="icon"
        :title="title"
        :description="description"
        :dismissible="false"
      >
        <template v-if="hasActions" #actions>
          <span v-if="queuedCount > 0 && !isOnline" class="wx-offline__queue">
            {{ queuedCount }} thay đổi chờ
          </span>
          <slot name="actions" />
        </template>
      </AppBanner>
    </div>
  </Transition>
</template>

<style scoped>
.wx-offline {
  position: sticky;
  top: 0;
  z-index: var(--wx-z-sticky);
  box-shadow: var(--wx-shadow-sm);
}
/* bỏ khoảng đệm phải dành cho nút đóng — banner này không đóng được */
.wx-offline :deep(.wx-banner--strip) { padding-right: var(--wx-space-4); }

/* màn hẹp: cụm hành động xuống dòng riêng, không bóp nghẹt tiêu đề */
@media (max-width: 479px) {
  .wx-offline :deep(.wx-banner--strip) { flex-wrap: wrap; row-gap: var(--wx-space-1); }
  .wx-offline :deep(.wx-banner__text) { flex-basis: calc(100% - 40px); }
  .wx-offline :deep(.wx-banner__actions) { width: 100%; justify-content: flex-end; }
}

.wx-offline__queue {
  padding: 2px 10px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: var(--wx-radius-full);
  background: rgba(255, 255, 255, 0.18);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  letter-spacing: var(--wx-tracking-wide);
  white-space: nowrap;
}

/* đang đồng bộ: icon quay */
.wx-offline[data-online='true'] :deep(.wx-banner__icon svg) {
  animation: wx-offline-spin 1.2s linear infinite;
}
@keyframes wx-offline-spin {
  to { transform: rotate(360deg); }
}

.wx-offline-slide-enter-active,
.wx-offline-slide-leave-active {
  transition: transform var(--wx-d-fast) var(--wx-ease-standard),
              opacity var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-offline-slide-enter-from,
.wx-offline-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .wx-offline[data-online='true'] :deep(.wx-banner__icon svg) { animation-duration: 2.4s; }
}
</style>

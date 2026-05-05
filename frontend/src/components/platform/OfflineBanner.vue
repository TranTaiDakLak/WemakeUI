<script setup lang="ts">
/**
 * OfflineBanner — banner sticky top khi mất kết nối.
 * Tự subscribe useOnline; hiển thị queue length nếu có.
 *
 *   <OfflineBanner />                                  → auto track
 *   <OfflineBanner :online="false" :queued="3" />      → controlled
 */
import { computed } from 'vue'
import { useOnline } from '../../composables/useOnline'

interface Props {
  /** override controlled — nếu undefined, dùng useOnline() */
  online?: boolean
  /** override queue length */
  queued?: number
  /** ẩn khi offline & queue rỗng */
  hideWhenIdle?: boolean
}

const props = defineProps<Props>()

const { online: liveOnline, queue } = useOnline()

const isOnline = computed(() => (props.online === undefined ? liveOnline.value : props.online))
const queuedCount = computed(() => (props.queued === undefined ? queue.value.length : props.queued))

const visible = computed(() => {
  if (!isOnline.value) return true
  if (queuedCount.value > 0) return true
  return false
})
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
      <span class="wx-offline__icon" aria-hidden="true">
        {{ isOnline ? '↻' : '⚠' }}
      </span>
      <span class="wx-offline__text">
        <template v-if="!isOnline">
          không có kết nối — đang dùng dữ liệu cache
        </template>
        <template v-else>
          đã online — đang đồng bộ {{ queuedCount }} thay đổi…
        </template>
      </span>
      <span v-if="queuedCount > 0 && !isOnline" class="wx-offline__queue">
        {{ queuedCount }} thay đổi chờ
      </span>
      <slot name="actions" />
    </div>
  </Transition>
</template>

<style scoped>
.wx-offline {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2) var(--wx-space-4);
  background: var(--wx-warning-solid);
  color: var(--wx-text-inverse);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  position: sticky;
  top: 0;
  z-index: var(--wx-z-sticky);
}
.wx-offline[data-online='true'] {
  background: var(--wx-info-solid);
}

.wx-offline__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--wx-radius-full);
  background: rgba(255, 255, 255, 0.2);
  font-weight: var(--wx-fw-bold);
}
.wx-offline[data-online='true'] .wx-offline__icon {
  animation: wx-offline-spin 1.2s linear infinite;
}

.wx-offline__text { flex: 1; }
.wx-offline__queue {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  letter-spacing: var(--wx-tracking-wide);
  background: rgba(255, 255, 255, 0.18);
  padding: 2px 10px;
  border-radius: var(--wx-radius-full);
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
  .wx-offline[data-online='true'] .wx-offline__icon { animation-duration: 2.4s; }
}
</style>

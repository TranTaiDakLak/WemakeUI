<script setup lang="ts">
/**
 * LiveBadge — chấm xanh "đang theo dõi" + last-update timestamp.
 * theo §5.4 realtime & async.
 *
 *   <LiveBadge :status="status" :last-update="ts" channel="jobs.live" />
 *
 *  status = 'live'    → chấm xanh pulse, "đang theo dõi"
 *  status = 'polling' → chấm vàng, "đang dò 5s/lần"
 *  status = 'idle'    → chấm xám, "đã dừng"
 *  status = 'error'   → chấm đỏ, "mất kết nối"
 */
import { computed, onBeforeUnmount, ref } from 'vue'

interface Props {
  status?: 'live' | 'polling' | 'connecting' | 'idle' | 'error'
  /** ms epoch của lần update gần nhất */
  lastUpdate?: number | null
  /** label channel */
  channel?: string
  /** ẩn label, chỉ hiện chấm */
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  status: 'idle',
  lastUpdate: null,
})

const labelMap: Record<NonNullable<Props['status']>, string> = {
  live: 'đang theo dõi',
  polling: 'đang dò',
  connecting: 'đang kết nối',
  idle: 'đã dừng',
  error: 'mất kết nối',
}

/* tick reactive 1s/lần để hiển thị "x giây trước" cập nhật mượt */
const now = ref(Date.now())
const timer = setInterval(() => (now.value = Date.now()), 1000)
onBeforeUnmount(() => clearInterval(timer))

const relative = computed(() => {
  if (!props.lastUpdate) return ''
  const diff = Math.max(0, now.value - props.lastUpdate)
  const sec = Math.floor(diff / 1000)
  if (sec < 5) return 'vừa xong'
  if (sec < 60) return `${sec}s trước`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} phút trước`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} giờ trước`
  return `${Math.floor(hr / 24)} ngày trước`
})
</script>

<template>
  <span
    class="wx-live"
    :data-status="status"
    role="status"
    aria-live="polite"
  >
    <span class="wx-live__dot" aria-hidden="true" />
    <template v-if="!iconOnly">
      <span class="wx-live__label">{{ labelMap[status] }}</span>
      <span v-if="channel" class="wx-live__channel">· {{ channel }}</span>
      <span v-if="relative" class="wx-live__time">· {{ relative }}</span>
    </template>
  </span>
</template>

<style scoped>
.wx-live {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-1);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  padding: 2px var(--wx-space-2);
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  white-space: nowrap;
}

.wx-live__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-neutral-solid);
  flex-shrink: 0;
  position: relative;
}

/* live: pulse xanh */
.wx-live[data-status='live'] .wx-live__dot {
  background: var(--wx-success-solid);
}
.wx-live[data-status='live'] .wx-live__dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--wx-success-solid);
  animation: wx-live-pulse 1.6s var(--wx-ease-standard) infinite;
}
.wx-live[data-status='polling'] .wx-live__dot { background: var(--wx-warning-solid); }
.wx-live[data-status='polling'] .wx-live__dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--wx-warning-solid);
  animation: wx-live-pulse 2.4s var(--wx-ease-standard) infinite;
}
.wx-live[data-status='connecting'] .wx-live__dot {
  background: var(--wx-info-solid);
  animation: wx-live-blink 1s linear infinite;
}
.wx-live[data-status='error'] .wx-live__dot { background: var(--wx-danger-solid); }
.wx-live[data-status='idle'] .wx-live__dot { background: var(--wx-neutral-solid); }

.wx-live__label { font-weight: var(--wx-fw-medium); }
.wx-live__channel,
.wx-live__time {
  color: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
  letter-spacing: var(--wx-tracking-wide);
}

@keyframes wx-live-pulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  70%  { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}

@keyframes wx-live-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}

@media (prefers-reduced-motion: reduce) {
  .wx-live__dot::after,
  .wx-live[data-status='connecting'] .wx-live__dot { animation: none; }
}

</style>

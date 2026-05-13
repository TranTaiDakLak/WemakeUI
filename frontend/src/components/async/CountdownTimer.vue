<script setup lang="ts">
/**
 * CountdownTimer — đồng hồ đếm ngược dạng vòng tròn SVG.
 * Dùng cho: OTP expiry, session timeout, cooldown, job scheduled next-run.
 *
 *   <CountdownTimer :seconds="120" label="mã hết hạn sau" @expire="onExpire" />
 *
 * Expose: start() / stop() / reset(newSeconds?)
 */
import { computed, onBeforeUnmount, ref } from 'vue'

interface Props {
  seconds: number
  label?: string
  autoStart?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** % còn lại chuyển sang màu warning */
  warnAt?: number
  /** % còn lại chuyển sang màu danger */
  dangerAt?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoStart: true,
  size: 'md',
  warnAt: 30,
  dangerAt: 10,
})

const emit = defineEmits<{ expire: [] }>()

const remaining = ref(props.seconds)
let timer: ReturnType<typeof setInterval> | null = null

function start() {
  if (timer || remaining.value <= 0) return
  timer = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) {
      remaining.value = 0
      stop()
      emit('expire')
    }
  }, 1000)
}

function stop() {
  if (timer) { clearInterval(timer); timer = null }
}

function reset(newSeconds?: number) {
  stop()
  remaining.value = newSeconds ?? props.seconds
  start()
}

if (props.autoStart) start()
onBeforeUnmount(stop)
defineExpose({ start, stop, reset })

/* ── computed ── */
const percent = computed(() => (remaining.value / props.seconds) * 100)

const state = computed<'normal' | 'warn' | 'danger' | 'expired'>(() => {
  if (remaining.value === 0) return 'expired'
  if (percent.value <= props.dangerAt!) return 'danger'
  if (percent.value <= props.warnAt!) return 'warn'
  return 'normal'
})

const DIAMETER = { sm: 36, md: 52, lg: 72 } as const
const FONT_SIZE = { sm: 10, md: 13, lg: 18 } as const
const STROKE   = { sm: 3,  md: 3.5, lg: 4  } as const

const d    = computed(() => DIAMETER[props.size])
const r    = computed(() => (d.value - STROKE[props.size] * 2) / 2)
const circ = computed(() => 2 * Math.PI * r.value)
const dash = computed(() => circ.value * (1 - percent.value / 100))

const displayTime = computed(() => {
  const s = remaining.value
  if (s >= 3600) {
    return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}`
  }
  if (s >= 60) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }
  return String(s)
})
</script>

<template>
  <span class="wx-countdown" :data-state="state" :data-size="size" role="timer" :aria-label="`${label ? label + ' ' : ''}${displayTime}`">
    <svg
      class="wx-countdown__ring"
      :width="d"
      :height="d"
      :viewBox="`0 0 ${d} ${d}`"
      aria-hidden="true"
    >
      <!-- track -->
      <circle
        class="wx-countdown__track"
        :cx="d / 2"
        :cy="d / 2"
        :r="r"
        fill="none"
        :stroke-width="STROKE[size]"
      />
      <!-- arc -->
      <circle
        class="wx-countdown__arc"
        :cx="d / 2"
        :cy="d / 2"
        :r="r"
        fill="none"
        :stroke-width="STROKE[size]"
        stroke-linecap="round"
        :stroke-dasharray="circ"
        :stroke-dashoffset="dash"
        transform-origin="center"
        transform="rotate(-90)"
      />
      <!-- time text -->
      <text
        class="wx-countdown__text"
        :x="d / 2"
        :y="d / 2"
        text-anchor="middle"
        dominant-baseline="central"
        :font-size="FONT_SIZE[size]"
      >{{ displayTime }}</text>
    </svg>
    <span v-if="label" class="wx-countdown__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.wx-countdown {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-2);
  font-family: var(--wx-font-primary);
}

/* ── ring colors ── */
.wx-countdown__track {
  stroke: var(--wx-border-subtle);
}
.wx-countdown__arc {
  stroke: var(--wx-brand-primary);
  transition: stroke-dashoffset 0.9s var(--wx-ease-standard), stroke 0.3s;
}
.wx-countdown__text {
  fill: var(--wx-text-primary);
  font-family: var(--wx-font-mono);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}

/* warn */
.wx-countdown[data-state='warn'] .wx-countdown__arc  { stroke: var(--wx-warning-solid); }
.wx-countdown[data-state='warn'] .wx-countdown__text { fill: var(--wx-warning-solid); }

/* danger */
.wx-countdown[data-state='danger'] .wx-countdown__arc  { stroke: var(--wx-danger-solid); }
.wx-countdown[data-state='danger'] .wx-countdown__text { fill: var(--wx-danger-solid); }
.wx-countdown[data-state='danger'] .wx-countdown__ring { animation: wx-cd-shake 0.4s ease 0s 1; }
/* expired */
.wx-countdown[data-state='expired'] .wx-countdown__arc  { stroke: var(--wx-border-subtle); }
.wx-countdown[data-state='expired'] .wx-countdown__text { fill: var(--wx-text-muted); }
.wx-countdown[data-state='expired'] .wx-countdown__label { color: var(--wx-text-muted); }

.wx-countdown__label {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  white-space: nowrap;
}

@keyframes wx-cd-shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-3px); }
  75%      { transform: translateX(3px); }
}

@media (prefers-reduced-motion: reduce) {
  .wx-countdown__arc { transition: stroke-dashoffset 0s, stroke 0s; }
  .wx-countdown[data-state='danger'] .wx-countdown__ring { animation: none; }
}
</style>

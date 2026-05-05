<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  min?: number
  max?: number
  size?: number
  thickness?: number
  color?: string
  trackColor?: string
  label?: string
  unit?: string
  thresholds?: Array<{ at: number; color: string }>
}>(), {
  min: 0,
  max: 100,
  size: 160,
  thickness: 14,
})

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const r = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * r.value)

const percent = computed(() => {
  const range = props.max - props.min
  if (range === 0) return 0
  return Math.max(0, Math.min(1, (props.value - props.min) / range))
})

const dashArray = computed(() => circumference.value * 0.75) // 270deg arc
const dashOffset = computed(() => dashArray.value * (1 - percent.value))

const activeColor = computed(() => {
  if (props.color) return props.color
  if (props.thresholds?.length) {
    const sorted = [...props.thresholds].sort((a, b) => a.at - b.at)
    let c = sorted[0].color
    for (const t of sorted) {
      if (props.value >= t.at) c = t.color
    }
    return c
  }
  // Default: green → amber → red based on percent
  if (percent.value >= 0.85) return '#ef4444'
  if (percent.value >= 0.6) return '#f59e0b'
  return '#10b981'
})
</script>

<template>
  <div class="gauge" :style="{ width: size + 'px' }">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
      class="gauge-svg"
    >
      <!-- Track (bottom 270° arc, missing 90° at bottom) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="r"
        fill="none"
        :stroke="trackColor ?? 'var(--wx-border-default)'"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke-dasharray="`${dashArray} ${circumference}`"
        :transform="`rotate(135 ${cx} ${cy})`"
      />
      <!-- Active arc -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="r"
        fill="none"
        :stroke="activeColor"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke-dasharray="`${dashArray} ${circumference}`"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(135 ${cx} ${cy})`"
        class="gauge-active"
      />

      <!-- Center value text -->
      <text
        :x="cx"
        :y="cy - 2"
        text-anchor="middle"
        dominant-baseline="middle"
        class="gauge-value"
        :style="{ fill: activeColor }"
      >{{ value }}<tspan v-if="unit" class="gauge-unit">{{ unit }}</tspan></text>
      <text
        v-if="label"
        :x="cx"
        :y="cy + 22"
        text-anchor="middle"
        dominant-baseline="middle"
        class="gauge-label"
      >{{ label }}</text>
    </svg>
  </div>
</template>

<style scoped>
.gauge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--wx-font-primary);
}

.gauge-svg {
  display: block;
}

.gauge-active {
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s;
}

.gauge-value {
  font-size: 28px;
  font-weight: 800;
  font-family: var(--wx-font-primary);
}

.gauge-unit {
  font-size: 14px;
  font-weight: 600;
  fill: var(--wx-text-muted);
}

.gauge-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--wx-text-muted);
  text-transform: lowercase;
  letter-spacing: 0.4px;
}
</style>

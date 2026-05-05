<script setup lang="ts">
import { computed } from 'vue'
import { scale, linePath, smoothPath, areaPath } from './chart-utils'

const props = withDefaults(defineProps<{
  values: number[]
  width?: number
  height?: number
  color?: string
  fill?: boolean
  fillOpacity?: number
  smooth?: boolean
  showDots?: boolean
  showLast?: boolean
  strokeWidth?: number
}>(), {
  width: 120,
  height: 40,
  color: '#2563eb',
  fill: false,
  fillOpacity: 0.2,
  smooth: true,
  showDots: false,
  showLast: false,
  strokeWidth: 2,
})

const padding = 2

const points = computed(() => {
  const n = props.values.length
  if (!n) return []
  const min = Math.min(...props.values)
  const max = Math.max(...props.values)
  const innerW = props.width - padding * 2
  const innerH = props.height - padding * 2
  return props.values.map((v, i) => ({
    x: padding + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    y: padding + scale(v, max, min, 0, innerH),
  }))
})

const path = computed(() =>
  props.smooth ? smoothPath(points.value) : linePath(points.value),
)

const area = computed(() =>
  props.fill ? areaPath(points.value, props.height - padding) : '',
)

const lastPoint = computed(() => points.value[points.value.length - 1])
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    class="sparkline"
    preserveAspectRatio="none"
  >
    <path v-if="fill" :d="area" :fill="color" :fill-opacity="fillOpacity" />
    <path :d="path" :stroke="color" :stroke-width="strokeWidth" fill="none" stroke-linejoin="round" stroke-linecap="round" />
    <g v-if="showDots">
      <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="1.5" :fill="color" />
    </g>
    <circle
      v-if="showLast && lastPoint"
      :cx="lastPoint.x"
      :cy="lastPoint.y"
      r="3"
      :fill="color"
      stroke="var(--wx-surface-base)"
      stroke-width="1.5"
    />
  </svg>
</template>

<style scoped>
.sparkline {
  display: block;
  overflow: visible;
}
</style>

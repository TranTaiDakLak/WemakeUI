<script setup lang="ts">
import { ref, computed } from 'vue'
import { colorAt, scale, linePath, smoothPath, areaPath, niceTicks, formatCompact } from './chart-utils'
import type { LineSeries } from './LineChart.vue'

const props = withDefaults(defineProps<{
  series: LineSeries[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  smooth?: boolean
  fillOpacity?: number
  stacked?: boolean
}>(), {
  height: 280,
  showGrid: true,
  showLegend: true,
  smooth: true,
  fillOpacity: 0.2,
  stacked: false,
})

const padding = { top: 16, right: 16, bottom: 32, left: 48 }
const width = 720
const innerW = computed(() => width - padding.left - padding.right)
const innerH = computed(() => props.height - padding.top - padding.bottom)

const yDomain = computed(() => {
  if (props.stacked) {
    const n = props.series[0]?.data.length ?? 0
    let max = 0
    for (let i = 0; i < n; i++) {
      const sum = props.series.reduce((acc, s) => acc + (s.data[i]?.y ?? 0), 0)
      if (sum > max) max = sum
    }
    return [0, max] as const
  }
  const all = props.series.flatMap((s) => s.data.map((d) => d.y))
  if (!all.length) return [0, 1] as const
  return [Math.min(0, ...all), Math.max(...all)] as const
})

const xLabels = computed(() => props.series[0]?.data.map((d) => d.x) ?? [])
const yTicks = computed(() => niceTicks(yDomain.value[0], yDomain.value[1], 5))
const yMaxNice = computed(() => yTicks.value[yTicks.value.length - 1])
const yMinNice = computed(() => yTicks.value[0])

function pointsFor(data: LineSeries['data'], baseValues: number[] = []) {
  const n = data.length
  return data.map((d, i) => {
    const stackedY = (baseValues[i] ?? 0) + d.y
    return {
      x: padding.left + (n === 1 ? innerW.value / 2 : (i / (n - 1)) * innerW.value),
      y: padding.top + scale(stackedY, yMaxNice.value, yMinNice.value, 0, innerH.value),
      yBase: padding.top + scale(baseValues[i] ?? 0, yMaxNice.value, yMinNice.value, 0, innerH.value),
    }
  })
}

const seriesShapes = computed(() => {
  let baseValues = new Array(props.series[0]?.data.length ?? 0).fill(0)
  return props.series.map((s, i) => {
    const points = pointsFor(s.data, props.stacked ? baseValues : [])
    const baseY = props.stacked
      ? (i === 0 ? padding.top + scale(0, yMaxNice.value, yMinNice.value, 0, innerH.value) : (() => {
          const prev = pointsFor(props.series[i - 1].data, baseValues.slice())
          return prev
        })())
      : padding.top + scale(0, yMaxNice.value, yMinNice.value, 0, innerH.value)

    const linePoints = points.map((p) => ({ x: p.x, y: p.y }))
    const path = props.smooth ? smoothPath(linePoints) : linePath(linePoints)

    let area: string
    if (props.stacked) {
      const top = props.smooth ? smoothPath(linePoints) : linePath(linePoints)
      const bottomReversed = points
        .map((p) => ({ x: p.x, y: p.yBase }))
        .reverse()
      const bottom = props.smooth ? smoothPath(bottomReversed) : linePath(bottomReversed)
      const bottomReplaced = bottom.replace(/^M/, 'L')
      area = `${top} ${bottomReplaced} Z`
    } else {
      area = areaPath(linePoints, padding.top + scale(0, yMaxNice.value, yMinNice.value, 0, innerH.value))
    }

    if (props.stacked) {
      baseValues = baseValues.map((bv, idx) => bv + (s.data[idx]?.y ?? 0))
    }

    return {
      ...s,
      color: s.color ?? colorAt(i),
      path,
      area,
      points: linePoints,
    }
  })
})

const hoverIdx = ref(-1)
const svgRef = ref<SVGSVGElement>()

function onMove(e: MouseEvent) {
  const svg = svgRef.value
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * width
  const inner = x - padding.left
  const n = xLabels.value.length
  if (n < 1 || inner < 0 || inner > innerW.value) {
    hoverIdx.value = -1
    return
  }
  hoverIdx.value = Math.max(0, Math.min(n - 1, Math.round((inner / innerW.value) * (n - 1))))
}

function onLeave() { hoverIdx.value = -1 }

const hoverX = computed(() => {
  if (hoverIdx.value < 0) return 0
  const n = xLabels.value.length
  return padding.left + (n === 1 ? innerW.value / 2 : (hoverIdx.value / (n - 1)) * innerW.value)
})
</script>

<template>
  <div class="area-chart">
    <div v-if="showLegend && series.length > 1" class="ac-legend">
      <span v-for="(s, i) in series" :key="s.name" class="ac-legend-item">
        <span class="ac-legend-dot" :style="{ background: s.color ?? colorAt(i) }" />
        {{ s.name }}
      </span>
    </div>

    <div class="ac-svg-wrapper">
      <svg
        ref="svgRef"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
        class="ac-svg"
        @mousemove="onMove"
        @mouseleave="onLeave"
      >
        <g v-if="showGrid">
          <line
            v-for="t in yTicks"
            :key="t"
            :x1="padding.left"
            :x2="width - padding.right"
            :y1="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH)"
            :y2="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH)"
            class="ac-grid"
          />
        </g>
        <g class="ac-axis">
          <text
            v-for="t in yTicks"
            :key="t"
            :x="padding.left - 8"
            :y="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH) + 4"
            text-anchor="end"
            class="ac-axis-label"
          >{{ formatCompact(t) }}</text>
          <text
            v-for="(label, i) in xLabels"
            :key="i"
            :x="padding.left + (xLabels.length === 1 ? innerW / 2 : (i / (xLabels.length - 1)) * innerW)"
            :y="height - padding.bottom + 18"
            text-anchor="middle"
            class="ac-axis-label"
          >{{ label }}</text>
        </g>

        <!-- Areas (drawn first, behind lines) -->
        <g v-for="s in seriesShapes" :key="`area-${s.name}`">
          <path :d="s.area" :fill="s.color" :fill-opacity="fillOpacity" />
          <path :d="s.path" :stroke="s.color" stroke-width="2" fill="none" />
        </g>

        <!-- Hover crosshair -->
        <g v-if="hoverIdx >= 0">
          <line
            :x1="hoverX"
            :x2="hoverX"
            :y1="padding.top"
            :y2="height - padding.bottom"
            class="ac-crosshair"
          />
          <circle
            v-for="s in seriesShapes"
            :key="s.name"
            :cx="s.points[hoverIdx]?.x ?? 0"
            :cy="s.points[hoverIdx]?.y ?? 0"
            r="4"
            :fill="s.color"
            stroke="#fff"
            stroke-width="2"
          />
        </g>
      </svg>

      <div
        v-if="hoverIdx >= 0"
        class="ac-tooltip"
        :style="{ left: `${(hoverX / width) * 100}%` }"
      >
        <div class="ac-tooltip-title">{{ xLabels[hoverIdx] }}</div>
        <div v-for="s in seriesShapes" :key="s.name" class="ac-tooltip-row">
          <span class="ac-tooltip-dot" :style="{ background: s.color }" />
          <span class="ac-tooltip-name">{{ s.name }}</span>
          <span class="ac-tooltip-value">{{ formatCompact(s.data[hoverIdx]?.y ?? 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.area-chart { font-family: var(--wx-font-primary); width: 100%; }
.ac-legend { display: flex; flex-wrap: wrap; gap: 16px; padding: 0 8px 8px; font-size: 12px; color: var(--wx-text-secondary); }
.ac-legend-item { display: inline-flex; align-items: center; gap: 6px; }
.ac-legend-dot { width: 10px; height: 10px; border-radius: var(--wx-radius-full); }
.ac-svg-wrapper { position: relative; width: 100%; }
.ac-svg { display: block; width: 100%; height: auto; overflow: visible; }
.ac-grid { stroke: var(--wx-border-subtle); stroke-dasharray: 2 4; stroke-width: 1; }
.ac-axis-label { font-size: 11px; fill: var(--wx-text-muted); font-family: var(--wx-font-mono); }
.ac-crosshair { stroke: var(--wx-text-muted); stroke-dasharray: 3 3; stroke-width: 1; pointer-events: none; }
.ac-tooltip {
  position: absolute; top: 0; transform: translateX(-50%);
  background: var(--wx-surface-base); border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md); box-shadow: var(--wx-shadow-lg);
  padding: 8px 10px; pointer-events: none; font-size: 12px; min-width: 120px; z-index: 5;
}
.ac-tooltip-title { font-weight: 700; color: var(--wx-text-primary); margin-bottom: 4px; font-size: 11px; }
.ac-tooltip-row { display: grid; grid-template-columns: 10px 1fr auto; align-items: center; gap: 6px; padding: 2px 0; }
.ac-tooltip-dot { width: 8px; height: 8px; border-radius: var(--wx-radius-full); }
.ac-tooltip-name { color: var(--wx-text-secondary); font-size: 11px; }
.ac-tooltip-value { font-family: var(--wx-font-mono); font-weight: 700; color: var(--wx-text-primary); font-size: 12px; }
</style>

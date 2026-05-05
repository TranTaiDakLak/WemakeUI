<script setup lang="ts">
import { ref, computed } from 'vue'
import { CHART_PALETTE, colorAt, scale, linePath, smoothPath, niceTicks, formatCompact } from './chart-utils'

export interface LineSeries {
  name: string
  data: Array<{ x: number | string; y: number }>
  color?: string
}

const props = withDefaults(defineProps<{
  series: LineSeries[]
  height?: number
  showGrid?: boolean
  showDots?: boolean
  showLegend?: boolean
  smooth?: boolean
  yLabel?: string
}>(), {
  height: 280,
  showGrid: true,
  showDots: false,
  showLegend: true,
  smooth: false,
})

/* ── Layout ──────────────────────────────────────── */
const padding = { top: 16, right: 16, bottom: 32, left: 48 }
const width = 720

const innerW = computed(() => width - padding.left - padding.right)
const innerH = computed(() => props.height - padding.top - padding.bottom)

/* ── Domain ──────────────────────────────────────── */
const yDomain = computed(() => {
  const all = props.series.flatMap((s) => s.data.map((d) => d.y))
  if (!all.length) return [0, 1] as const
  const min = Math.min(0, ...all)
  const max = Math.max(...all)
  return [min, max] as const
})

const xLabels = computed(() => {
  const first = props.series[0]
  if (!first) return []
  return first.data.map((d) => d.x)
})

const yTicks = computed(() => niceTicks(yDomain.value[0], yDomain.value[1], 5))
const yMaxNice = computed(() => yTicks.value[yTicks.value.length - 1])
const yMinNice = computed(() => yTicks.value[0])

/* ── Map data to SVG coords ──────────────────────── */
function mapPoints(data: LineSeries['data']) {
  const n = data.length
  if (!n) return []
  return data.map((d, i) => ({
    x: padding.left + (n === 1 ? innerW.value / 2 : (i / (n - 1)) * innerW.value),
    y: padding.top + scale(d.y, yMaxNice.value, yMinNice.value, 0, innerH.value),
  }))
}

const seriesPaths = computed(() =>
  props.series.map((s, i) => {
    const points = mapPoints(s.data)
    const path = props.smooth ? smoothPath(points) : linePath(points)
    return {
      ...s,
      color: s.color ?? colorAt(i),
      points,
      path,
    }
  }),
)

/* ── Tooltip ─────────────────────────────────────── */
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
  const idx = Math.round((inner / innerW.value) * (n - 1))
  hoverIdx.value = Math.max(0, Math.min(n - 1, idx))
}

function onLeave() {
  hoverIdx.value = -1
}

const hoverX = computed(() => {
  if (hoverIdx.value < 0) return 0
  const n = xLabels.value.length
  return padding.left + (n === 1 ? innerW.value / 2 : (hoverIdx.value / (n - 1)) * innerW.value)
})
</script>

<template>
  <div class="line-chart">
    <!-- Legend -->
    <div v-if="showLegend && series.length > 1" class="lc-legend">
      <span v-for="(s, i) in series" :key="s.name" class="lc-legend-item">
        <span class="lc-legend-dot" :style="{ background: s.color ?? colorAt(i) }" />
        {{ s.name }}
      </span>
    </div>

    <div class="lc-svg-wrapper">
      <svg
        ref="svgRef"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
        class="lc-svg"
        @mousemove="onMove"
        @mouseleave="onLeave"
      >
        <!-- Gridlines + Y axis ticks -->
        <g v-if="showGrid">
          <line
            v-for="t in yTicks"
            :key="t"
            :x1="padding.left"
            :x2="width - padding.right"
            :y1="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH)"
            :y2="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH)"
            class="lc-grid"
          />
        </g>
        <g class="lc-axis">
          <text
            v-for="t in yTicks"
            :key="t"
            :x="padding.left - 8"
            :y="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH) + 4"
            text-anchor="end"
            class="lc-axis-label"
          >{{ formatCompact(t) }}</text>
          <text
            v-for="(label, i) in xLabels"
            :key="i"
            :x="padding.left + (xLabels.length === 1 ? innerW / 2 : (i / (xLabels.length - 1)) * innerW)"
            :y="height - padding.bottom + 18"
            text-anchor="middle"
            class="lc-axis-label"
          >{{ label }}</text>
        </g>

        <!-- Series paths -->
        <g v-for="s in seriesPaths" :key="s.name">
          <path :d="s.path" :stroke="s.color" stroke-width="2" fill="none" class="lc-line" />
          <g v-if="showDots">
            <circle
              v-for="(p, i) in s.points"
              :key="i"
              :cx="p.x"
              :cy="p.y"
              r="3"
              :fill="s.color"
              class="lc-dot"
            />
          </g>
        </g>

        <!-- Hover crosshair -->
        <g v-if="hoverIdx >= 0">
          <line
            :x1="hoverX"
            :x2="hoverX"
            :y1="padding.top"
            :y2="height - padding.bottom"
            class="lc-crosshair"
          />
          <circle
            v-for="s in seriesPaths"
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

      <!-- Tooltip -->
      <div
        v-if="hoverIdx >= 0"
        class="lc-tooltip"
        :style="{ left: `${(hoverX / width) * 100}%` }"
      >
        <div class="lc-tooltip-title">{{ xLabels[hoverIdx] }}</div>
        <div v-for="(s, i) in seriesPaths" :key="s.name" class="lc-tooltip-row">
          <span class="lc-tooltip-dot" :style="{ background: s.color }" />
          <span class="lc-tooltip-name">{{ s.name }}</span>
          <span class="lc-tooltip-value">{{ formatCompact(s.data[hoverIdx]?.y ?? 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-chart {
  font-family: var(--wx-font-primary);
  width: 100%;
}

.lc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 8px 8px;
  font-size: 12px;
  color: var(--wx-text-secondary);
}

.lc-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.lc-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--wx-radius-full);
  flex-shrink: 0;
}

.lc-svg-wrapper {
  position: relative;
  width: 100%;
}

.lc-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.lc-grid {
  stroke: var(--wx-border-subtle);
  stroke-dasharray: 2 4;
  stroke-width: 1;
}

.lc-axis-label {
  font-size: 11px;
  fill: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
}

.lc-line {
  transition: opacity 0.2s;
}

.lc-dot {
  stroke: var(--wx-surface-base);
  stroke-width: 1.5;
}

.lc-crosshair {
  stroke: var(--wx-text-muted);
  stroke-dasharray: 3 3;
  stroke-width: 1;
  pointer-events: none;
}

.lc-tooltip {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  box-shadow: var(--wx-shadow-lg);
  padding: 8px 10px;
  pointer-events: none;
  font-size: 12px;
  min-width: 120px;
  z-index: 5;
}

.lc-tooltip-title {
  font-weight: 700;
  color: var(--wx-text-primary);
  margin-bottom: 4px;
  font-size: 11px;
}

.lc-tooltip-row {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
}

.lc-tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--wx-radius-full);
}

.lc-tooltip-name {
  color: var(--wx-text-secondary);
  font-size: 11px;
}

.lc-tooltip-value {
  font-family: var(--wx-font-mono);
  font-weight: 700;
  color: var(--wx-text-primary);
  font-size: 12px;
}
</style>

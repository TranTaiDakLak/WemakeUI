<script setup lang="ts">
import { ref, computed } from 'vue'
import { colorAt, scale, niceTicks, formatCompact } from './chart-utils'

export interface BarItem {
  label: string
  value: number
  color?: string
}

export interface BarSeries {
  name: string
  data: BarItem[]
  color?: string
}

const props = withDefaults(defineProps<{
  data?: BarItem[]
  series?: BarSeries[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  horizontal?: boolean
}>(), {
  height: 280,
  showGrid: true,
  showLegend: true,
  horizontal: false,
})

const padding = { top: 16, right: 16, bottom: 40, left: 48 }
const width = 720
const innerW = computed(() => width - padding.left - padding.right)
const innerH = computed(() => props.height - padding.top - padding.bottom)

/* Normalize: single data → 1 series */
const normSeries = computed<BarSeries[]>(() => {
  if (props.series?.length) return props.series
  if (props.data?.length) return [{ name: '', data: props.data }]
  return []
})

const labels = computed(() => normSeries.value[0]?.data.map((d) => d.label) ?? [])

const yDomain = computed(() => {
  const all = normSeries.value.flatMap((s) => s.data.map((d) => d.value))
  if (!all.length) return [0, 1] as const
  return [Math.min(0, ...all), Math.max(...all)] as const
})

const yTicks = computed(() => niceTicks(yDomain.value[0], yDomain.value[1], 5))
const yMaxNice = computed(() => yTicks.value[yTicks.value.length - 1])
const yMinNice = computed(() => yTicks.value[0])

const groupCount = computed(() => labels.value.length)
const seriesCount = computed(() => normSeries.value.length)
const groupWidth = computed(() => groupCount.value > 0 ? innerW.value / groupCount.value : 0)
const barGap = 6
const barWidth = computed(() => Math.max(2, (groupWidth.value - barGap * 2) / Math.max(1, seriesCount.value)))

const zeroY = computed(() => padding.top + scale(0, yMaxNice.value, yMinNice.value, 0, innerH.value))

const bars = computed(() => {
  const out: Array<{
    x: number; y: number; w: number; h: number;
    color: string; label: string; value: number; seriesName: string
  }> = []
  normSeries.value.forEach((s, sIdx) => {
    s.data.forEach((d, gIdx) => {
      const groupX = padding.left + gIdx * groupWidth.value + barGap
      const x = groupX + sIdx * barWidth.value
      const yVal = padding.top + scale(d.value, yMaxNice.value, yMinNice.value, 0, innerH.value)
      const y = Math.min(yVal, zeroY.value)
      const h = Math.abs(yVal - zeroY.value)
      out.push({
        x,
        y,
        w: Math.max(0, barWidth.value - 2),
        h,
        color: d.color ?? s.color ?? colorAt(sIdx),
        label: d.label,
        value: d.value,
        seriesName: s.name,
      })
    })
  })
  return out
})

const hover = ref<{ idx: number } | null>(null)
</script>

<template>
  <div class="bar-chart">
    <div v-if="showLegend && normSeries.length > 1" class="bc-legend">
      <span v-for="(s, i) in normSeries" :key="s.name" class="bc-legend-item">
        <span class="bc-legend-dot" :style="{ background: s.color ?? colorAt(i) }" />
        {{ s.name }}
      </span>
    </div>

    <div class="bc-svg-wrapper">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
        class="bc-svg"
      >
        <g v-if="showGrid">
          <line
            v-for="t in yTicks"
            :key="t"
            :x1="padding.left"
            :x2="width - padding.right"
            :y1="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH)"
            :y2="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH)"
            class="bc-grid"
          />
        </g>

        <g class="bc-axis">
          <text
            v-for="t in yTicks"
            :key="t"
            :x="padding.left - 8"
            :y="padding.top + scale(t, yMaxNice, yMinNice, 0, innerH) + 4"
            text-anchor="end"
            class="bc-axis-label"
          >{{ formatCompact(t) }}</text>
          <text
            v-for="(label, i) in labels"
            :key="i"
            :x="padding.left + i * groupWidth + groupWidth / 2"
            :y="height - padding.bottom + 20"
            text-anchor="middle"
            class="bc-axis-label"
          >{{ label }}</text>
        </g>

        <g>
          <rect
            v-for="(b, i) in bars"
            :key="i"
            :x="b.x"
            :y="b.y"
            :width="b.w"
            :height="b.h"
            :fill="b.color"
            :fill-opacity="hover?.idx === i ? 1 : 0.85"
            class="bc-bar"
            rx="3"
            @mouseenter="hover = { idx: i }"
            @mouseleave="hover = null"
          />
        </g>
      </svg>

      <div
        v-if="hover"
        class="bc-tooltip"
        :style="{ left: `${((bars[hover.idx].x + bars[hover.idx].w / 2) / width) * 100}%`, top: `${((bars[hover.idx].y) / height) * 100}%` }"
      >
        <div class="bc-tooltip-title">{{ bars[hover.idx].label }}</div>
        <div class="bc-tooltip-row">
          <span class="bc-tooltip-dot" :style="{ background: bars[hover.idx].color }" />
          <span v-if="bars[hover.idx].seriesName" class="bc-tooltip-name">{{ bars[hover.idx].seriesName }}</span>
          <span class="bc-tooltip-value">{{ formatCompact(bars[hover.idx].value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar-chart { font-family: var(--wx-font-primary); width: 100%; }
.bc-legend { display: flex; flex-wrap: wrap; gap: 16px; padding: 0 8px 8px; font-size: 12px; color: var(--wx-text-secondary); }
.bc-legend-item { display: inline-flex; align-items: center; gap: 6px; }
.bc-legend-dot { width: 10px; height: 10px; border-radius: var(--wx-radius-full); }
.bc-svg-wrapper { position: relative; width: 100%; }
.bc-svg { display: block; width: 100%; height: auto; overflow: visible; }
.bc-grid { stroke: var(--wx-border-subtle); stroke-dasharray: 2 4; stroke-width: 1; }
.bc-axis-label { font-size: 11px; fill: var(--wx-text-muted); font-family: var(--wx-font-mono); }
.bc-bar { transition: fill-opacity 0.15s; cursor: pointer; }
.bc-tooltip {
  position: absolute; transform: translate(-50%, -110%);
  background: var(--wx-surface-base); border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md); box-shadow: var(--wx-shadow-lg);
  padding: 6px 10px; pointer-events: none; font-size: 12px; white-space: nowrap; z-index: 5;
}
.bc-tooltip-title { font-weight: 700; color: var(--wx-text-primary); margin-bottom: 2px; font-size: 11px; }
.bc-tooltip-row { display: flex; align-items: center; gap: 6px; }
.bc-tooltip-dot { width: 8px; height: 8px; border-radius: var(--wx-radius-full); }
.bc-tooltip-name { color: var(--wx-text-secondary); font-size: 11px; }
.bc-tooltip-value { font-family: var(--wx-font-mono); font-weight: 700; color: var(--wx-text-primary); font-size: 12px; margin-left: auto; }
</style>

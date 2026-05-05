<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatCompact } from './chart-utils'

export interface HeatmapCell {
  date: string  // YYYY-MM-DD
  value: number
}

const props = withDefaults(defineProps<{
  data: HeatmapCell[]
  baseColor?: string
  cellSize?: number
  cellGap?: number
  weeks?: number
}>(), {
  baseColor: '#2563eb',
  cellSize: 12,
  cellGap: 3,
  weeks: 26,
})

const totalCells = computed(() => props.weeks * 7)

/* Build grid: latest day at bottom-right; columns = weeks, rows = days of week */
const cells = computed(() => {
  const map = new Map(props.data.map((d) => [d.date, d.value]))
  const today = new Date()
  // Align to Sunday at end (last column)
  const result: Array<{ date: string; value: number; col: number; row: number }> = []
  for (let i = 0; i < totalCells.value; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - (totalCells.value - 1 - i))
    const iso = d.toISOString().slice(0, 10)
    const dayOfWeek = d.getDay() // 0=Sun..6=Sat
    const col = Math.floor(i / 7)
    const row = dayOfWeek
    result.push({ date: iso, value: map.get(iso) ?? 0, col, row })
  }
  return result
})

const maxVal = computed(() => Math.max(1, ...cells.value.map((c) => c.value)))

function colorFor(value: number): string {
  if (value === 0) return 'var(--wx-border-subtle)'
  const t = Math.max(0.15, Math.min(1, value / maxVal.value))
  return mixColor(props.baseColor, 'var(--wx-surface-base)', 1 - t)
}

function mixColor(c1: string, c2: string, t: number): string {
  // Use CSS color-mix when supported; fallback opacity
  return `color-mix(in srgb, ${c1} ${(1 - t) * 100}%, transparent ${t * 100}%)`
}

const hover = ref<{ idx: number } | null>(null)

const widthPx = computed(() => props.weeks * (props.cellSize + props.cellGap))
const heightPx = computed(() => 7 * (props.cellSize + props.cellGap))
</script>

<template>
  <div class="heatmap">
    <svg
      :width="widthPx"
      :height="heightPx"
      :viewBox="`0 0 ${widthPx} ${heightPx}`"
      class="hm-svg"
    >
      <g>
        <rect
          v-for="(c, i) in cells"
          :key="c.date"
          :x="c.col * (cellSize + cellGap)"
          :y="c.row * (cellSize + cellGap)"
          :width="cellSize"
          :height="cellSize"
          :rx="2"
          :fill="colorFor(c.value)"
          :stroke="hover?.idx === i ? '#000' : 'transparent'"
          stroke-width="1"
          class="hm-cell"
          @mouseenter="hover = { idx: i }"
          @mouseleave="hover = null"
        />
      </g>
    </svg>

    <div class="hm-legend">
      <span>ít</span>
      <span class="hm-legend-cell" :style="{ background: 'var(--wx-border-subtle)' }" />
      <span class="hm-legend-cell" :style="{ background: colorFor(maxVal * 0.25) }" />
      <span class="hm-legend-cell" :style="{ background: colorFor(maxVal * 0.5) }" />
      <span class="hm-legend-cell" :style="{ background: colorFor(maxVal * 0.75) }" />
      <span class="hm-legend-cell" :style="{ background: colorFor(maxVal) }" />
      <span>nhiều</span>
    </div>

    <div v-if="hover" class="hm-tooltip">
      <b>{{ formatCompact(cells[hover.idx].value) }}</b> trên {{ cells[hover.idx].date }}
    </div>
  </div>
</template>

<style scoped>
.heatmap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: var(--wx-font-primary);
}

.hm-svg {
  display: block;
  overflow: visible;
}

.hm-cell {
  cursor: pointer;
  transition: stroke 0.15s;
}

.hm-legend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--wx-text-muted);
}

.hm-legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.hm-tooltip {
  font-size: 12px;
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
  padding: 4px 10px;
  border-radius: var(--wx-radius-md);
  align-self: flex-start;
}

.hm-tooltip b {
  color: var(--wx-text-primary);
  font-family: var(--wx-font-mono);
}
</style>

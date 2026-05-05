<script setup lang="ts">
import { ref, computed } from 'vue'
import { colorAt, arcPath, formatCompact } from './chart-utils'

export interface PieSlice {
  label: string
  value: number
  color?: string
}

const props = withDefaults(defineProps<{
  data: PieSlice[]
  size?: number
  donut?: boolean
  donutWidth?: number
  showLegend?: boolean
  showLabels?: boolean
  centerLabel?: string
  centerValue?: string | number
}>(), {
  size: 280,
  donut: false,
  donutWidth: 36,
  showLegend: true,
  showLabels: false,
})

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const rOuter = computed(() => props.size / 2 - 4)
const rInner = computed(() => props.donut ? rOuter.value - props.donutWidth : 0)

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const slices = computed(() => {
  if (total.value === 0) return []
  let cursor = 0
  return props.data.map((d, i) => {
    const start = (cursor / total.value) * Math.PI * 2
    cursor += d.value
    const end = (cursor / total.value) * Math.PI * 2
    const path = arcPath(cx.value, cy.value, rOuter.value, rInner.value, start, end)
    const midAngle = (start + end) / 2
    const labelR = (rOuter.value + rInner.value) / 2
    const labelX = cx.value + labelR * Math.cos(midAngle - Math.PI / 2)
    const labelY = cy.value + labelR * Math.sin(midAngle - Math.PI / 2)
    return {
      ...d,
      color: d.color ?? colorAt(i),
      path,
      percent: (d.value / total.value) * 100,
      labelX,
      labelY,
    }
  })
})

const hoverIdx = ref(-1)
</script>

<template>
  <div class="pie-chart">
    <div class="pc-svg-wrapper">
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        :width="size"
        :height="size"
        class="pc-svg"
      >
        <g>
          <path
            v-for="(s, i) in slices"
            :key="i"
            :d="s.path"
            :fill="s.color"
            :fill-opacity="hoverIdx < 0 || hoverIdx === i ? 1 : 0.4"
            class="pc-slice"
            stroke="var(--wx-surface-base)"
            stroke-width="2"
            @mouseenter="hoverIdx = i"
            @mouseleave="hoverIdx = -1"
          />
        </g>

        <!-- Inline % labels for big slices -->
        <g v-if="showLabels">
          <text
            v-for="(s, i) in slices"
            :key="`label-${i}`"
            :x="s.labelX"
            :y="s.labelY"
            text-anchor="middle"
            dominant-baseline="middle"
            class="pc-label"
            v-show="s.percent >= 5"
          >{{ Math.round(s.percent) }}%</text>
        </g>

        <!-- Donut center text -->
        <g v-if="donut && (centerLabel || centerValue !== undefined)">
          <text
            :x="cx"
            :y="cy - 4"
            text-anchor="middle"
            dominant-baseline="middle"
            class="pc-center-value"
          >{{ centerValue !== undefined ? centerValue : formatCompact(total) }}</text>
          <text
            v-if="centerLabel"
            :x="cx"
            :y="cy + 18"
            text-anchor="middle"
            dominant-baseline="middle"
            class="pc-center-label"
          >{{ centerLabel }}</text>
        </g>
      </svg>
    </div>

    <ul v-if="showLegend" class="pc-legend">
      <li
        v-for="(s, i) in slices"
        :key="i"
        class="pc-legend-item"
        :class="{ 'pc-legend-item--dim': hoverIdx >= 0 && hoverIdx !== i }"
        @mouseenter="hoverIdx = i"
        @mouseleave="hoverIdx = -1"
      >
        <span class="pc-legend-dot" :style="{ background: s.color }" />
        <span class="pc-legend-label">{{ s.label }}</span>
        <span class="pc-legend-value">{{ formatCompact(s.value) }}</span>
        <span class="pc-legend-pct">{{ s.percent.toFixed(1) }}%</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pie-chart {
  display: flex;
  align-items: center;
  gap: 24px;
  font-family: var(--wx-font-primary);
}

.pc-svg-wrapper {
  flex-shrink: 0;
}

.pc-svg {
  display: block;
}

.pc-slice {
  cursor: pointer;
  transition: fill-opacity 0.2s;
}

.pc-label {
  font-size: 11px;
  font-weight: 700;
  fill: #fff;
  pointer-events: none;
}

.pc-center-value {
  font-size: 22px;
  font-weight: 800;
  fill: var(--wx-text-primary);
}

.pc-center-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--wx-text-muted);
  text-transform: lowercase;
  letter-spacing: 0.4px;
}

.pc-legend {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.pc-legend-item {
  display: grid;
  grid-template-columns: 12px 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.pc-legend-item:hover,
.pc-legend-item:not(.pc-legend-item--dim):has(.pc-legend-dot) {
  background: var(--wx-hover-bg);
}

.pc-legend-item--dim {
  opacity: 0.4;
}

.pc-legend-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--wx-radius-sm);
}

.pc-legend-label {
  font-weight: 600;
  color: var(--wx-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pc-legend-value {
  font-family: var(--wx-font-mono);
  font-weight: 700;
  color: var(--wx-text-primary);
}

.pc-legend-pct {
  font-family: var(--wx-font-mono);
  color: var(--wx-text-muted);
  font-size: 11px;
}

@media (max-width: 600px) {
  .pie-chart { flex-direction: column; }
}
</style>

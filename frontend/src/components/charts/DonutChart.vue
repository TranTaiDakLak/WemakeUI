<script setup lang="ts">
import { ref, computed } from 'vue'
import { colorAt } from './chart-utils'

function donutArcPath(
  cx: number, cy: number,
  rOuter: number, rInner: number,
  startAngle: number, endAngle: number,
): string {
  const f = (n: number) => n.toFixed(3)
  function pt(r: number, a: number) {
    return {
      x: cx + r * Math.cos(a - Math.PI / 2),
      y: cy + r * Math.sin(a - Math.PI / 2),
    }
  }
  const s1 = pt(rOuter, startAngle)
  const e1 = pt(rOuter, endAngle)
  const s2 = pt(rInner, startAngle)
  const e2 = pt(rInner, endAngle)
  const large = endAngle - startAngle > Math.PI ? 1 : 0
  // Outer arc CW (sweep=1), inner arc CCW (sweep=0) — standard SVG donut
  return [
    `M ${f(s1.x)},${f(s1.y)}`,
    `A ${rOuter},${rOuter} 0 ${large},1 ${f(e1.x)},${f(e1.y)}`,
    `L ${f(e2.x)},${f(e2.y)}`,
    `A ${rInner},${rInner} 0 ${large},0 ${f(s2.x)},${f(s2.y)}`,
    'Z',
  ].join(' ')
}

export interface DonutSlice {
  label: string
  value: number
  color?: string
}

const props = withDefaults(defineProps<{
  data: DonutSlice[]
  size?: number
  /** 0–1: fraction of radius used as ring width. 0.45 = thick ring. */
  thickness?: number
  showLegend?: boolean
  centerLabel?: string
  centerValue?: string | number
}>(), {
  size: 260,
  thickness: 0.45,
  showLegend: true,
})

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const rOuter = computed(() => props.size / 2 - 4)
const rInner = computed(() => rOuter.value * (1 - props.thickness))

/* ── Hidden toggle ── */
const hiddenLabels = ref(new Set<string>())
function toggleHide(label: string) {
  const next = new Set(hiddenLabels.value)
  if (next.has(label)) next.delete(label)
  else next.add(label)
  hiddenLabels.value = next
}

/* ── All items with stable color ── */
const allItems = computed(() =>
  props.data.map((d, i) => ({
    ...d,
    color: d.color ?? colorAt(i),
    hidden: hiddenLabels.value.has(d.label),
  }))
)

/* ── Visible slices (redistribute angles among non-hidden) ── */
const visibleSlices = computed(() => {
  const visible = allItems.value.filter(d => !d.hidden)
  const total = visible.reduce((s, d) => s + d.value, 0)
  if (total === 0) return []
  let cursor = 0
  return visible.map(d => {
    const start = (cursor / total) * Math.PI * 2
    cursor += d.value
    const end = (cursor / total) * Math.PI * 2
    return {
      ...d,
      path: donutArcPath(cx.value, cy.value, rOuter.value, rInner.value, start, end),
      percent: (d.value / total) * 100,
    }
  })
})

const hoverLabel = ref<string | null>(null)

const emit = defineEmits<{
  'click-slice': [slice: DonutSlice]
}>()
</script>

<template>
  <div class="donut-chart">
    <div class="dc-svg-wrapper">
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        :width="size"
        :height="size"
        class="dc-svg"
      >
        <path
          v-for="s in visibleSlices"
          :key="s.label"
          :d="s.path"
          :fill="s.color"
          :fill-opacity="hoverLabel === null || hoverLabel === s.label ? 1 : 0.3"
          class="dc-slice"
          stroke="var(--wx-surface-base, #fff)"
          stroke-width="2"
          @mouseenter="hoverLabel = s.label"
          @mouseleave="hoverLabel = null"
          @click="emit('click-slice', s)"
        />

        <!-- Static center text -->
        <g v-if="centerLabel || centerValue !== undefined">
          <text v-if="centerValue !== undefined" :x="cx" :y="cy - 6"
            text-anchor="middle" dominant-baseline="middle" class="dc-center-value">
            {{ centerValue }}
          </text>
          <text v-if="centerLabel" :x="cx" :y="centerValue !== undefined ? cy + 16 : cy"
            text-anchor="middle" dominant-baseline="middle" class="dc-center-label">
            {{ centerLabel }}
          </text>
        </g>

        <!-- Hover: show % + label in center -->
        <g v-else-if="hoverLabel !== null">
          <text :x="cx" :y="cy - 6" text-anchor="middle" dominant-baseline="middle" class="dc-center-value">
            {{ visibleSlices.find(s => s.label === hoverLabel)?.percent.toFixed(1) }}%
          </text>
          <text :x="cx" :y="cy + 16" text-anchor="middle" dominant-baseline="middle" class="dc-center-label">
            {{ hoverLabel }}
          </text>
        </g>
      </svg>
    </div>

    <ul v-if="showLegend" class="dc-legend">
      <li
        v-for="item in allItems"
        :key="item.label"
        class="dc-legend-item"
        :class="{
          'dc-legend-item--hidden': item.hidden,
          'dc-legend-item--dim': hoverLabel !== null && hoverLabel !== item.label && !item.hidden,
        }"
        @mouseenter="!item.hidden && (hoverLabel = item.label)"
        @mouseleave="hoverLabel = null"
        @click="toggleHide(item.label)"
      >
        <span class="dc-legend-dot" :style="{ background: item.color, opacity: item.hidden ? 0.3 : 1 }" />
        <span class="dc-legend-label" :class="{ 'dc-legend-label--strike': item.hidden }">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-family: var(--wx-font-primary);
}

.dc-svg-wrapper {
  flex-shrink: 0;
}

.dc-svg {
  display: block;
  overflow: visible;
}

.dc-slice {
  cursor: pointer;
  transition: fill-opacity 0.18s;
}

.dc-center-value {
  font-size: 22px;
  font-weight: 800;
  fill: var(--wx-text-primary);
}

.dc-center-label {
  font-size: 11px;
  font-weight: 500;
  fill: var(--wx-text-muted);
}

.dc-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
}

.dc-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.15s;
  padding: 2px 4px;
  border-radius: var(--wx-radius-sm);
}

.dc-legend-item:hover {
  background: var(--wx-surface-hover);
}

.dc-legend-item--dim {
  opacity: 0.35;
}

.dc-legend-item--hidden {
  opacity: 0.5;
}

.dc-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dc-legend-label {
  font-weight: 500;
  color: var(--wx-text-secondary);
  white-space: nowrap;
  transition: text-decoration 0.15s;
}

.dc-legend-label--strike {
  text-decoration: line-through;
  color: var(--wx-text-muted);
}
</style>

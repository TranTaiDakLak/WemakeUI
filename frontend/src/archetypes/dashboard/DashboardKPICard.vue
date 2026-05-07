<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Sparkline } from '@/components/charts'
import { BaseCard } from '@/components/common'

const attrs = useAttrs()

const props = withDefaults(defineProps<{
  label: string
  metric?: string | number
  metricSuffix?: string
  /** Positive = up, negative = down, 0 = flat */
  delta?: number
  deltaLabel?: string
  sparkline?: number[]
  sparklineColor?: string
  iconEmoji?: string
  iconBg?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'cyan' | 'slate'
  /** Secondary info line */
  detail?: string
  /** Alert chip below detail */
  alert?: string
  alertLevel?: 'warning' | 'danger'
  loading?: boolean
}>(), {
  deltaLabel: 'vs hôm qua',
  iconBg: 'blue',
  alertLevel: 'warning',
  loading: false,
  sparklineColor: '#2563eb',
})

const emit = defineEmits<{ click: [] }>()

const displayMetric = computed(() => {
  const v = props.metric
  if (v === undefined || v === null) return '—'
  if (typeof v === 'number') {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M'
    if (v >= 10_000)    return (v / 1_000).toFixed(0) + 'K'
    return v.toLocaleString('vi-VN')
  }
  return String(v)
})

const deltaSign = computed(() => {
  if (props.delta === undefined) return ''
  return props.delta > 0 ? '↑' : props.delta < 0 ? '↓' : '→'
})

const deltaText = computed(() => {
  if (props.delta === undefined) return ''
  const abs = Math.abs(props.delta)
  return `${deltaSign.value}${abs % 1 === 0 ? abs : abs.toFixed(1)}%`
})

const deltaClass = computed(() => {
  if (props.delta === undefined) return 'delta--neutral'
  return props.delta > 0 ? 'delta--pos' : props.delta < 0 ? 'delta--neg' : 'delta--neutral'
})

const iconBgStyle = computed(() => {
  const map: Record<string, string> = {
    blue:   'rgba(37,99,235,0.12)',
    green:  'rgba(34,197,94,0.12)',
    red:    'rgba(239,68,68,0.12)',
    amber:  'rgba(245,158,11,0.12)',
    purple: 'rgba(139,92,246,0.12)',
    cyan:   'rgba(6,182,212,0.12)',
    slate:  'rgba(100,116,139,0.12)',
  }
  return { background: map[props.iconBg ?? 'blue'] ?? map.blue }
})

const isClickable = computed(() => 'onClick' in attrs)
</script>

<template>
  <BaseCard
    :padded="false"
    shadow="sm"
    :hoverable="isClickable"
    :clickable="isClickable"
    :loading="loading"
    @click="isClickable && emit('click')"
  >
    <div class="kpi-inner">
      <!-- Row 1: icon + label + delta -->
      <div class="kpi-top">
        <div class="kpi-label-wrap">
          <span v-if="iconEmoji" class="kpi-icon" :style="iconBgStyle">{{ iconEmoji }}</span>
          <span class="kpi-label">{{ label }}</span>
        </div>
        <span v-if="delta !== undefined" class="kpi-delta" :class="deltaClass">
          {{ deltaText }}
        </span>
      </div>

      <!-- Row 2: main metric -->
      <div class="kpi-metric-row">
        <span class="kpi-metric">{{ displayMetric }}</span>
        <span v-if="metricSuffix" class="kpi-suffix">{{ metricSuffix }}</span>
      </div>

      <!-- Row 3: context + sparkline -->
      <div class="kpi-bottom">
        <div class="kpi-context">
          <span v-if="detail" class="kpi-detail">{{ detail }}</span>
          <span v-if="alert" class="kpi-alert" :class="`kpi-alert--${alertLevel}`">⚠ {{ alert }}</span>
          <span v-if="!detail && !alert && deltaLabel && delta !== undefined" class="kpi-delta-lbl">
            {{ deltaLabel }}
          </span>
        </div>
        <Sparkline
          v-if="sparkline && sparkline.length"
          :values="sparkline"
          :width="72"
          :height="26"
          :color="sparklineColor"
          :fill="true"
          :fill-opacity="0.15"
          :smooth="true"
          :stroke-width="1.5"
        />
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.kpi-inner {
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 108px;
}

/* Top row */
.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.kpi-label-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.kpi-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.kpi-label {
  font-size: 11px;
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Delta badge */
.kpi-delta {
  font-size: 11px;
  font-weight: var(--wx-fw-semibold);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.delta--pos     { color: var(--wx-success-text); background: var(--wx-success-bg); }
.delta--neg     { color: var(--wx-danger-text);  background: var(--wx-danger-bg); }
.delta--neutral { color: var(--wx-text-muted);   background: var(--wx-surface-sunken); }

/* Metric */
.kpi-metric-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  line-height: 1;
}

.kpi-metric {
  font-size: 26px;
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.kpi-suffix {
  font-size: 14px;
  color: var(--wx-text-muted);
  font-weight: var(--wx-fw-medium);
}

/* Bottom row */
.kpi-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}

.kpi-context {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.kpi-detail {
  font-size: 12px;
  color: var(--wx-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-alert {
  font-size: 11px;
  font-weight: var(--wx-fw-semibold);
}
.kpi-alert--warning { color: var(--wx-warning-text); }
.kpi-alert--danger  { color: var(--wx-danger-text); }

.kpi-delta-lbl {
  font-size: 11px;
  color: var(--wx-text-muted);
}
</style>

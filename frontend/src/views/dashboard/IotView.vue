<script setup lang="ts">
/** dashboard/iot — metrics realtime, sparkline, alert feed */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseTag, BaseButton } from '../../components/common'
import { sparkPath, sparkArea } from '../_layouts/dashboard-widgets'

interface Sensor {
  id: string
  name: string
  unit: string
  current: number
  min: number
  max: number
  series: number[]
  status: 'normal' | 'warning' | 'critical'
}

const sensors = ref<Sensor[]>([
  { id: 's1', name: 'Nhiệt độ phòng server',  unit: '°C',   current: 22.4, min: 18, max: 28, series: gen(20, 22, 4), status: 'normal' },
  { id: 's2', name: 'Độ ẩm',                  unit: '%',    current: 64,   min: 40, max: 70, series: gen(20, 60, 8), status: 'normal' },
  { id: 's3', name: 'Áp suất',                unit: 'hPa',  current: 1013, min: 1000, max: 1025, series: gen(20, 1012, 4), status: 'normal' },
  { id: 's4', name: 'CO₂',                    unit: 'ppm',  current: 920,  min: 400, max: 1000, series: gen(20, 800, 60), status: 'warning' },
  { id: 's5', name: 'Bụi mịn PM2.5',          unit: 'μg/m³',current: 28,   min: 0, max: 35, series: gen(20, 22, 6), status: 'normal' },
  { id: 's6', name: 'Tiếng ồn',               unit: 'dB',   current: 68,   min: 35, max: 70, series: gen(20, 55, 12), status: 'critical' },
])

function gen(n: number, base: number, range: number) {
  return Array.from({ length: n }, (_, i) =>
    base + Math.sin(i * 0.6) * range * 0.5 + (Math.random() - 0.5) * range * 0.4
  )
}

const alerts = ref([
  { time: '12:34', sensor: 'Tiếng ồn',   msg: 'Vượt ngưỡng 70dB',     severity: 'critical' },
  { time: '12:08', sensor: 'CO₂',        msg: 'Cảnh báo ngưỡng cao',  severity: 'warning' },
  { time: '11:42', sensor: 'Nhiệt độ',   msg: 'Quay về bình thường',  severity: 'info' },
  { time: '10:30', sensor: 'Độ ẩm',      msg: 'Hệ thống tự cân bằng', severity: 'info' },
])

let timer: number | null = null
onMounted(() => {
  timer = window.setInterval(() => {
    sensors.value = sensors.value.map((s) => ({
      ...s,
      current: +(s.current + (Math.random() - 0.5) * 2).toFixed(1),
      series: [...s.series.slice(1), s.current + (Math.random() - 0.5) * 2],
    }))
  }, 2500) as unknown as number
})
onBeforeUnmount(() => { if (timer) window.clearInterval(timer) })

const sVariant = (s: string) => ({ critical: 'danger', warning: 'warning', normal: 'success' }[s as 'critical'] ?? 'neutral') as 'danger' | 'warning' | 'success' | 'neutral'
const aVariant = (s: string) => ({ critical: 'danger', warning: 'warning', info: 'primary' }[s as 'critical'] ?? 'neutral') as 'danger' | 'warning' | 'primary' | 'neutral'
</script>

<template>
  <AppPageLayout section="dashboards"
    current="IoT"
    page-title="IoT realtime"
    page-description="Giám sát cảm biến phòng server — cập nhật mỗi 2.5 giây."
  >
    <template #actions>
      <BaseTag size="md" variant="success" label="● đang theo dõi" />
      <BaseButton variant="ghost" size="sm">Lịch sử</BaseButton>
    </template>

    <div class="sensor-grid" v-reveal>
      <BaseCard
        v-for="(s, i) in sensors"
        :key="s.id"
        v-reveal="i * 60"
        padded
        shadow="sm"
        hover-effect="glow"
        :selected="s.status === 'critical'"
      >
        <div class="s-head">
          <span class="s-name">{{ s.name }}</span>
          <BaseTag :variant="sVariant(s.status)" :label="s.status" size="sm" />
        </div>
        <div class="s-value">
          {{ s.current.toFixed(1) }}<span class="s-unit">{{ s.unit }}</span>
        </div>
        <svg class="s-spark" viewBox="0 0 120 40" preserveAspectRatio="none">
          <path :d="sparkArea([...s.series], 120, 40, 2)" fill="rgba(37,99,235,0.12)" />
          <path :d="sparkPath([...s.series], 120, 40, 2)" stroke="#2563eb" stroke-width="1.5" fill="none" />
        </svg>
        <div class="s-range">
          <span class="muted small">{{ s.min }} – {{ s.max }} {{ s.unit }}</span>
        </div>
      </BaseCard>
    </div>

    <BasePanel v-reveal title="Cảnh báo realtime" description="20 cảnh báo cuối · live feed">
      <ul class="alerts">
        <li v-for="(a, i) in alerts" :key="i" class="alert-row">
          <span class="alert-time muted small">{{ a.time }}</span>
          <BaseTag :variant="aVariant(a.severity)" :label="a.severity" size="sm" />
          <strong>{{ a.sensor }}:</strong>
          <span>{{ a.msg }}</span>
        </li>
      </ul>
    </BasePanel>
  </AppPageLayout>
</template>

<style scoped>
.sensor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--wx-space-3);
}
.s-head { display: flex; justify-content: space-between; align-items: center; }
.s-name { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.s-value {
  font-size: var(--wx-fs-32);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
  font-variant-numeric: tabular-nums;
  margin: var(--wx-space-1) 0;
}
.s-unit { font-size: var(--wx-fs-14); color: var(--wx-content-muted); margin-left: 4px; }
.s-spark { width: 100%; height: 40px; }
.s-range { margin-top: 4px; }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }

.alerts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.alert-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2) 0;
  font-size: var(--wx-fs-13);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.alert-time { font-family: var(--wx-font-mono); flex-shrink: 0; }
</style>

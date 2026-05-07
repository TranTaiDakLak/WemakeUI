<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { GroupBox, BaseButton } from '../../../components/common'
import {
  LineChart, AreaChart, BarChart, PieChart, DonutChart,
  Sparkline, Gauge, Heatmap,
} from '../../../components/charts'
import type { LineSeries, BarItem, BarSeries, PieSlice, DonutSlice, HeatmapCell } from '../../../components/charts'

/* ── Line / Area data ────────────────────────────── */
const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']

const lineSeriesSingle: LineSeries[] = [
  {
    name: 'Doanh thu',
    data: months.map((m, i) => ({ x: m, y: 1200 + Math.sin(i / 2) * 400 + i * 80 + Math.random() * 100 })),
  },
]

const lineSeriesMulti: LineSeries[] = [
  {
    name: 'Truy cập',
    data: months.map((m, i) => ({ x: m, y: 8000 + i * 600 + Math.sin(i) * 800 })),
  },
  {
    name: 'Đơn hàng',
    data: months.map((m, i) => ({ x: m, y: 1200 + i * 120 + Math.cos(i) * 200 })),
  },
  {
    name: 'Khách mới',
    data: months.map((m, i) => ({ x: m, y: 600 + i * 50 + Math.sin(i * 1.5) * 150 })),
  },
]

const areaStackedSeries: LineSeries[] = [
  {
    name: 'Web',
    data: months.map((m, i) => ({ x: m, y: 400 + i * 30 + Math.sin(i) * 50 })),
  },
  {
    name: 'Mobile',
    data: months.map((m, i) => ({ x: m, y: 300 + i * 40 + Math.cos(i) * 60 })),
  },
  {
    name: 'Desktop',
    data: months.map((m, i) => ({ x: m, y: 200 + i * 20 + Math.sin(i * 0.7) * 40 })),
  },
]

/* ── Bar data ────────────────────────────────────── */
const barSingle: BarItem[] = [
  { label: 'T2', value: 145 },
  { label: 'T3', value: 230 },
  { label: 'T4', value: 178 },
  { label: 'T5', value: 312 },
  { label: 'T6', value: 405 },
  { label: 'T7', value: 290 },
  { label: 'CN', value: 156 },
]

const barGrouped: BarSeries[] = [
  {
    name: 'Q1',
    data: ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D', 'Sản phẩm E'].map((label, i) => ({
      label,
      value: 100 + i * 50 + Math.random() * 80,
    })),
  },
  {
    name: 'Q2',
    data: ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D', 'Sản phẩm E'].map((label, i) => ({
      label,
      value: 150 + i * 60 + Math.random() * 80,
    })),
  },
]

/* ── Pie / Donut ─────────────────────────────────── */
const pieData: PieSlice[] = [
  { label: 'Chrome', value: 64.2 },
  { label: 'Safari', value: 18.7 },
  { label: 'Firefox', value: 8.4 },
  { label: 'Edge', value: 5.1 },
  { label: 'Khác', value: 3.6 },
]

const trafficData: PieSlice[] = [
  { label: 'Organic', value: 4520 },
  { label: 'Direct', value: 3210 },
  { label: 'Referral', value: 1890 },
  { label: 'Social', value: 1240 },
  { label: 'Email', value: 680 },
]

const donutData: DonutSlice[] = [
  { label: 'Chức năng A', value: 42, color: '#2563eb' },
  { label: 'Chức năng B', value: 28, color: '#10b981' },
  { label: 'Chức năng C', value: 18, color: '#f59e0b' },
  { label: 'Chức năng D', value: 12, color: '#ef4444' },
]

/* ── Sparkline data ──────────────────────────────── */
function genSpark(n = 24, seed = 1): number[] {
  return Array.from({ length: n }, (_, i) => 50 + Math.sin(i / 3 + seed) * 20 + Math.random() * 15)
}

const kpis = ref([
  { name: 'Doanh thu', value: '128.4M', delta: '+12.4%', trend: genSpark(24, 1), color: '#10b981', up: true },
  { name: 'Đơn hàng', value: '1,284', delta: '+8.1%', trend: genSpark(24, 2), color: '#2563eb', up: true },
  { name: 'Khách mới', value: '312', delta: '-3.2%', trend: genSpark(24, 3), color: '#f59e0b', up: false },
  { name: 'Tỷ lệ huỷ', value: '2.4%', delta: '+0.3%', trend: genSpark(24, 4), color: '#ef4444', up: false },
])

/* ── Gauge ───────────────────────────────────────── */
const cpuValue = ref(68)
const memValue = ref(42)
const diskValue = ref(91)

function randomize() {
  cpuValue.value = Math.round(Math.random() * 100)
  memValue.value = Math.round(Math.random() * 100)
  diskValue.value = Math.round(Math.random() * 100)
}

/* ── Heatmap data ────────────────────────────────── */
const heatmapData = computed<HeatmapCell[]>(() => {
  const today = new Date()
  const out: HeatmapCell[] = []
  for (let i = 0; i < 26 * 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    out.push({
      date: d.toISOString().slice(0, 10),
      value: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 30),
    })
  }
  return out
})

/* ── Smooth toggle ──────────────────────────────── */
const smooth = ref(true)
const stacked = ref(false)
</script>

<template>
  <div class="page">
    <main class="main">
      <PageHeader
        title="Chart system"
        description="7 component biểu đồ thuần SVG, không deps. Theme-aware qua CSS variables, hover tooltip, responsive."
      />

      <GroupBox title="KPI cards với Sparkline">
        <div class="kpi-grid">
          <div v-for="k in kpis" :key="k.name" class="kpi-card">
            <div class="kpi-head">
              <span class="kpi-name">{{ k.name }}</span>
              <span class="kpi-delta" :data-up="k.up">
                {{ k.delta }}
              </span>
            </div>
            <div class="kpi-value">{{ k.value }}</div>
            <Sparkline :values="k.trend" :width="200" :height="40" :color="k.color" fill show-last />
          </div>
        </div>
      </GroupBox>

      <GroupBox title="LineChart — single series">
        <LineChart :series="lineSeriesSingle" :height="240" show-dots />
      </GroupBox>

      <GroupBox title="LineChart — multi series">
        <div class="chart-controls">
          <BaseButton size="sm" :variant="smooth ? 'primary' : 'ghost'" @click="smooth = !smooth">
            {{ smooth ? 'Smooth ON' : 'Smooth OFF' }}
          </BaseButton>
          <span class="muted">Hover để xem tooltip với crosshair</span>
        </div>
        <LineChart :series="lineSeriesMulti" :height="280" :smooth="smooth" />
      </GroupBox>

      <GroupBox title="AreaChart — stacked">
        <div class="chart-controls">
          <BaseButton size="sm" :variant="stacked ? 'primary' : 'ghost'" @click="stacked = !stacked">
            {{ stacked ? 'Stacked ON' : 'Stacked OFF (overlay)' }}
          </BaseButton>
        </div>
        <AreaChart :series="areaStackedSeries" :height="280" :stacked="stacked" />
      </GroupBox>

      <GroupBox title="BarChart — single series (lượt truy cập theo ngày)">
        <BarChart :data="barSingle" :height="240" />
      </GroupBox>

      <GroupBox title="BarChart — grouped series (so sánh quý)">
        <BarChart :series="barGrouped" :height="280" />
      </GroupBox>

      <div class="grid-2">
        <GroupBox title="PieChart">
          <PieChart :data="pieData" :size="220" show-labels />
        </GroupBox>

        <GroupBox title="PieChart — donut mode">
          <PieChart
            :data="trafficData"
            :size="220"
            donut
            center-label="lượt truy cập"
            :center-value="trafficData.reduce((s, d) => s + d.value, 0).toLocaleString('vi-VN')"
          />
        </GroupBox>
      </div>

      <GroupBox title="DonutChart — ring chart (vòng dày, legend dưới)">
        <div class="donut-demo-row">
          <div class="donut-demo-item">
            <p class="demo-label">Mặc định (thickness 0.45)</p>
            <DonutChart :data="donutData" :size="240" />
          </div>
          <div class="donut-demo-item">
            <p class="demo-label">Vòng mỏng hơn (thickness 0.3)</p>
            <DonutChart :data="donutData" :size="240" :thickness="0.3" />
          </div>
          <div class="donut-demo-item">
            <p class="demo-label">Có nhãn trung tâm</p>
            <DonutChart :data="donutData" :size="240" center-label="Tổng" :center-value="100" />
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Gauge — system metrics">
        <div class="gauge-row">
          <Gauge :value="cpuValue" label="CPU" unit="%" />
          <Gauge :value="memValue" label="Memory" unit="%" />
          <Gauge :value="diskValue" label="Disk" unit="%" :thresholds="[
            { at: 0, color: '#10b981' },
            { at: 70, color: '#f59e0b' },
            { at: 90, color: '#ef4444' },
          ]" />
        </div>
        <div class="chart-controls">
          <BaseButton size="sm" variant="primary" @click="randomize">Randomize</BaseButton>
          <span class="muted">Màu auto đổi theo ngưỡng (xanh → vàng → đỏ)</span>
        </div>
      </GroupBox>

      <GroupBox title="Sparkline variants">
        <div class="spark-grid">
          <div class="spark-card">
            <span class="spark-label">Default</span>
            <Sparkline :values="genSpark(40, 1)" :width="240" :height="50" />
          </div>
          <div class="spark-card">
            <span class="spark-label">With fill</span>
            <Sparkline :values="genSpark(40, 2)" :width="240" :height="50" fill color="#10b981" />
          </div>
          <div class="spark-card">
            <span class="spark-label">With dots + last marker</span>
            <Sparkline :values="genSpark(40, 3)" :width="240" :height="50" color="#f59e0b" show-dots show-last />
          </div>
          <div class="spark-card">
            <span class="spark-label">No smooth, fill</span>
            <Sparkline :values="genSpark(40, 4)" :width="240" :height="50" :smooth="false" fill color="#ef4444" />
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Heatmap — activity calendar (26 tuần qua)">
        <Heatmap :data="heatmapData" />
      </GroupBox>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  font-family: var(--wx-font-primary);
}

.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-lg, 24px) var(--space-md, 16px) 64px;
  display: flex;
  flex-direction: column;
  gap: var(--space-md, 16px);
}

.muted {
  color: var(--wx-text-muted);
  font-size: 12px;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md, 16px);
}

@media (max-width: 800px) {
  .grid-2 { grid-template-columns: 1fr; }
}

/* KPI cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.kpi-card {
  padding: 14px 16px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-name {
  font-size: 12px;
  color: var(--wx-text-muted);
  font-weight: 600;
}

.kpi-delta {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-success-bg);
  color: var(--wx-success-text);
}

.kpi-delta[data-up="false"] {
  background: var(--wx-danger-bg);
  color: var(--wx-danger-text);
}

.kpi-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--wx-text-primary);
  letter-spacing: -0.01em;
  margin: 4px 0;
}

/* Gauge row */
.gauge-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 16px;
  padding: 8px 0;
}

/* Sparkline grid */
.spark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.spark-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
}

.spark-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--wx-text-muted);
}

.donut-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: space-around;
  padding: 8px 0;
}

.donut-demo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.demo-label {
  margin: 0;
  font-size: 12px;
  color: var(--wx-text-muted);
  font-weight: 600;
}
</style>

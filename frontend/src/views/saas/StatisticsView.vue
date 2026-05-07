<script setup lang="ts">
import { ref, computed } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import { LineChart, DonutChart, BarChart } from '@/components/charts'
import type { LineSeries } from '@/components/charts/LineChart.vue'
import type { DonutSlice } from '@/components/charts/DonutChart.vue'
import type { BarSeries } from '@/components/charts/BarChart.vue'
import DashboardKPICard from '@/archetypes/dashboard/DashboardKPICard.vue'
import { BaseButton, BaseSelectMenu } from '@/components/common'

/* ── Filters ── */
const period  = ref('month')
const product = ref('all')
const status  = ref('all')

const periodOptions  = [
  { value: 'week',    label: '7 ngày qua' },
  { value: 'month',   label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'year',    label: 'Năm nay' },
]
const productOptions = [
  { value: 'all',          label: 'Tất cả sản phẩm' },
  { value: 'pro',          label: 'WeConnect Pro' },
  { value: 'basic',        label: 'WeConnect Basic' },
  { value: 'addon',        label: 'Add-on' },
]
const statusOptions  = [
  { value: 'all',       label: 'Tất cả trạng thái' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'failed',    label: 'Thất bại' },
]

/* ── KPI summary (reactive on period) ── */
const kpis = computed(() => {
  const multi = period.value === 'year' ? 12 : period.value === 'quarter' ? 3 : period.value === 'week' ? 0.25 : 1
  return [
    { label: 'Tổng doanh thu',    metric: Math.round(184_500_000 * multi), metricSuffix: 'đ', delta: 12.4, iconEmoji: '💰', iconBg: 'blue'   as const },
    { label: 'Giao dịch thành công', metric: Math.round(1245 * multi),     delta: 8.1,  iconEmoji: '✅', iconBg: 'green'  as const },
    { label: 'Thành viên mới',    metric: Math.round(348 * multi),         delta: 5.3,  iconEmoji: '👥', iconBg: 'purple' as const },
    { label: 'Tỷ lệ chuyển đổi', metric: '23.4', metricSuffix: '%',       delta: 2.1,  iconEmoji: '🎯', iconBg: 'cyan'   as const },
  ]
})

/* ── Revenue line chart ── */
const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']
const WEEKS  = ['T2','T3','T4','T5','T6','T7','CN']
const QUARTERS = ['Q1','Q2','Q3','Q4']

const revenueLabels = computed(() => {
  if (period.value === 'week')    return WEEKS
  if (period.value === 'quarter') return QUARTERS
  if (period.value === 'year')    return MONTHS
  return MONTHS.slice(0, 6)
})

const revenueSeries = computed<LineSeries[]>(() => [
  {
    name: 'Doanh thu',
    data: revenueLabels.value.map((x, i) => ({
      x,
      y: Math.round([120,145,132,168,155,184,210,198,220,245,232,268][i % 12] * (period.value === 'week' ? 0.25 : 1)),
    })),
  },
])

/* ── Product distribution donut ── */
const productPie = computed<DonutSlice[]>(() => [
  { label: 'WeConnect Pro',   value: 58, color: '#2563eb' },
  { label: 'WeConnect Basic', value: 24, color: '#10b981' },
  { label: 'Add-on API',      value: 12, color: '#f59e0b' },
  { label: 'Trial',           value: 6,  color: '#8b5cf6' },
])

/* ── Top products bar chart ── */
const topProductsSeries = computed<BarSeries[]>(() => [{
  name: 'Doanh thu (triệu đồng)',
  data: [
    { label: 'WC Pro',    value: 107 },
    { label: 'WC Basic',  value: 44 },
    { label: 'Add-on',    value: 22 },
    { label: 'Trial',     value: 11 },
  ],
  color: '#2563eb',
}])

/* ── Top members ── */
interface TopMember { rank: number; name: string; email: string; spend: string; txCount: number }
const topMembers: TopMember[] = [
  { rank: 1, name: 'Công ty ABC',     email: 'abc@corp.vn',   spend: '18.500.000đ', txCount: 12 },
  { rank: 2, name: 'Cửa hàng XYZ',   email: 'xyz@shop.vn',   spend: '12.200.000đ', txCount: 8  },
  { rank: 3, name: 'Nguyễn Văn A',   email: 'a@gmail.com',   spend: '9.800.000đ',  txCount: 6  },
  { rank: 4, name: 'Trần Thị B',     email: 'b@gmail.com',   spend: '7.500.000đ',  txCount: 5  },
  { rank: 5, name: 'Lê Văn C',       email: 'c@gmail.com',   spend: '5.200.000đ',  txCount: 4  },
]

/* ── Transaction summary ── */
interface TxSummaryRow { type: string; count: number; total: string; pct: number }
const txSummary: TxSummaryRow[] = [
  { type: 'Đăng ký mới',      count: 523,  total: '78.450.000đ',  pct: 42 },
  { type: 'Gia hạn',          count: 412,  total: '61.800.000đ',  pct: 33 },
  { type: 'Nâng cấp gói',     count: 185,  total: '27.750.000đ',  pct: 15 },
  { type: 'Mua add-on',       count: 125,  total: '16.500.000đ',  pct: 10 },
]
</script>

<template>
  <SaasLayout
    current="statistics"
    page-title="Thống kê"
    page-description="Phân tích doanh thu, thành viên và hiệu suất kinh doanh"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Xuất báo cáo</BaseButton>
    </template>

    <!-- Filters -->
    <div class="stat-filters">
      <BaseSelectMenu v-model="period"  :options="periodOptions"  placeholder="Kỳ thống kê" />
      <BaseSelectMenu v-model="product" :options="productOptions" placeholder="Sản phẩm" />
      <BaseSelectMenu v-model="status"  :options="statusOptions"  placeholder="Trạng thái" />
    </div>

    <!-- KPI cards -->
    <div class="kpi-grid">
      <DashboardKPICard
        v-for="kpi in kpis"
        :key="kpi.label"
        v-bind="kpi"
      />
    </div>

    <!-- Revenue chart + Pie -->
    <div class="charts-row">
      <div class="chart-card chart-card--main">
        <div class="chart-card__header">
          <h3 class="chart-card__title">Xu hướng doanh thu</h3>
          <span class="chart-card__sub">Đơn vị: triệu đồng</span>
        </div>
        <LineChart :series="revenueSeries" :height="200" :smooth="true" />
      </div>

      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">Phân bổ sản phẩm</h3>
          <span class="chart-card__sub">Theo doanh thu</span>
        </div>
        <div class="donut-wrap">
          <DonutChart :data="productPie" :size="220" :thickness="0.45" :show-legend="true" />
        </div>
      </div>
    </div>

    <!-- Top products bar + Top members -->
    <div class="bottom-row">
      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">Doanh thu theo sản phẩm</h3>
        </div>
        <BarChart :series="topProductsSeries" :height="220" />
      </div>

      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">Top thành viên chi tiêu</h3>
        </div>
        <div class="top-members">
          <div v-for="m in topMembers" :key="m.rank" class="top-member">
            <span class="top-member__rank">#{{ m.rank }}</span>
            <div class="top-member__info">
              <span class="top-member__name">{{ m.name }}</span>
              <span class="top-member__email">{{ m.email }}</span>
            </div>
            <div class="top-member__stats">
              <span class="top-member__spend">{{ m.spend }}</span>
              <span class="top-member__txcount">{{ m.txCount }} GD</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction summary table -->
    <div class="chart-card">
      <div class="chart-card__header">
        <h3 class="chart-card__title">Phân tích theo loại giao dịch</h3>
      </div>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Loại giao dịch</th>
            <th class="ta-right">Số lượng</th>
            <th class="ta-right">Tổng giá trị</th>
            <th class="ta-right">Tỷ trọng</th>
            <th>Thanh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in txSummary" :key="row.type">
            <td>{{ row.type }}</td>
            <td class="ta-right mono">{{ row.count }}</td>
            <td class="ta-right mono fw-semi">{{ row.total }}</td>
            <td class="ta-right mono">{{ row.pct }}%</td>
            <td>
              <div class="pct-bar">
                <div class="pct-bar__fill" :style="{ width: row.pct + '%' }" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </SaasLayout>
</template>

<style scoped>
.stat-filters {
  display: flex;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--wx-space-4);
}

.charts-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--wx-space-4);
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-4);
}

.chart-card {
  background: var(--wx-surface-default);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-4);
}

.chart-card--main { overflow: hidden; }

.chart-card__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--wx-space-4);
}

.chart-card__title {
  margin: 0;
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}

.chart-card__sub {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
}

.pie-center  { display: flex; justify-content: center; }
.donut-wrap  { display: flex; justify-content: center; padding: var(--wx-space-2) 0; }

/* ── Top members ── */
.top-members {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

.top-member {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  transition: background 0.12s;
}

.top-member:hover { background: var(--wx-surface-hover); }

.top-member__rank {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-muted);
  min-width: 28px;
}

.top-member__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.top-member__name  { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-member__email { font-size: var(--wx-fs-11); color: var(--wx-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.top-member__stats { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.top-member__spend   { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); white-space: nowrap; }
.top-member__txcount { font-size: var(--wx-fs-11); color: var(--wx-text-muted); }

/* ── Summary table ── */
.summary-table {
  width: 100%;
  border-collapse: collapse;
}

.summary-table th {
  padding: var(--wx-space-2) var(--wx-space-3);
  text-align: left;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.summary-table td {
  padding: var(--wx-space-3) var(--wx-space-3);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.summary-table tr:last-child td { border-bottom: none; }
.summary-table tr:hover td { background: var(--wx-surface-hover); }

.ta-right { text-align: right; }
.mono     { font-variant-numeric: tabular-nums; }
.fw-semi  { font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }

.pct-bar {
  height: 6px;
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-full);
  overflow: hidden;
  min-width: 80px;
}

.pct-bar__fill {
  height: 100%;
  background: var(--wx-brand-primary);
  border-radius: var(--wx-radius-full);
  transition: width 0.4s ease;
}
</style>

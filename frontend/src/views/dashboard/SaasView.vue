<script setup lang="ts">
/** dashboard/saas — MRR, ARR, churn, plan distribution */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseTag, BaseButton, BaseProgress } from '../../components/common'
import { sparkPath, sparkArea, seriesUp, seriesDown, seriesFlat } from '../_layouts/dashboard-widgets'

const cohorts = [
  { month: '01/2026', new: 124, retain: 100, churn: 0  },
  { month: '02/2026', new: 158, retain: 92,  churn: 8  },
  { month: '03/2026', new: 184, retain: 88,  churn: 12 },
  { month: '04/2026', new: 220, retain: 85,  churn: 15 },
  { month: '05/2026', new: 268, retain: 82,  churn: 18 },
]

const plans = [
  { name: 'Free',     count: 1842, mrr: '0₫',         color: '#94a3b8' },
  { name: 'Starter',  count: 624,  mrr: '124tr',      color: '#60a5fa' },
  { name: 'Pro',      count: 248,  mrr: '298tr',      color: '#2563eb' },
  { name: 'Business', count: 84,   mrr: '420tr',      color: '#7c3aed' },
  { name: 'Enterprise', count: 18, mrr: '720tr',      color: '#0f172a' },
]
const totalMrr = '1.562 triệu'
</script>

<template>
  <AppPageLayout section="dashboards"
    current="SaaS / billing"
    page-title="SaaS metrics"
    page-description="MRR, ARR, churn, retention — sức khoẻ business."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">30 ngày</BaseButton>
      <BaseButton size="sm">Xuất báo cáo</BaseButton>
    </template>

    <div class="kpi-grid">
      <BaseCard padded shadow="sm">
        <div class="m-label">MRR</div>
        <div class="m-value">{{ totalMrr }}</div>
        <BaseTag size="sm" variant="success" text="+12.4% m-m" />
        <svg class="spark" viewBox="0 0 120 32"><path :d="sparkArea([...seriesUp], 120, 32, 2)" fill="rgba(37,99,235,0.18)" /><path :d="sparkPath([...seriesUp], 120, 32, 2)" stroke="#2563eb" stroke-width="1.5" fill="none" /></svg>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">ARR</div>
        <div class="m-value">18,7 tỷ</div>
        <BaseTag size="sm" variant="success" text="+28% y-y" />
        <svg class="spark" viewBox="0 0 120 32"><path :d="sparkPath([...seriesUp], 120, 32, 2)" stroke="#10b981" stroke-width="1.5" fill="none" /></svg>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">Churn rate</div>
        <div class="m-value">3.2%</div>
        <BaseTag size="sm" variant="warning" text="+0.4%" />
        <svg class="spark" viewBox="0 0 120 32"><path :d="sparkPath([...seriesDown], 120, 32, 2)" stroke="#ef4444" stroke-width="1.5" fill="none" /></svg>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">NPS</div>
        <div class="m-value">62</div>
        <BaseTag size="sm" variant="success" text="+4 điểm" />
        <svg class="spark" viewBox="0 0 120 32"><path :d="sparkPath([...seriesFlat], 120, 32, 2)" stroke="#94a3b8" stroke-width="1.5" fill="none" /></svg>
      </BaseCard>
    </div>

    <div class="cols">
      <BaseCard title="MRR theo tháng" subtitle="So với mục tiêu" padded shadow="sm">
        <svg class="big-chart" viewBox="0 0 600 220" preserveAspectRatio="none">
          <path :d="sparkArea([...seriesUp, ...seriesUp], 600, 220, 12)" fill="rgba(37,99,235,0.15)" />
          <path :d="sparkPath([...seriesUp, ...seriesUp], 600, 220, 12)" stroke="#2563eb" stroke-width="2" fill="none" />
          <path :d="sparkPath([...seriesFlat, ...seriesFlat], 600, 220, 12)" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.5" fill="none" />
        </svg>
        <div class="legend"><span class="d" style="background:#2563eb" /> Thực tế <span class="d" style="background:#94a3b8" /> Mục tiêu</div>
      </BaseCard>

      <BasePanel title="Phân bổ gói" tone="default">
        <ul class="plans">
          <li v-for="p in plans" :key="p.name" class="plan-row">
            <div class="plan-info">
              <span class="dot" :style="{ background: p.color }" />
              <strong>{{ p.name }}</strong>
              <span class="muted">{{ p.count.toLocaleString('vi-VN') }} KH</span>
            </div>
            <span class="plan-mrr">{{ p.mrr }}</span>
          </li>
        </ul>
      </BasePanel>
    </div>

    <BasePanel title="Retention cohort">
      <table class="cohort">
        <thead><tr>
          <th>Tháng</th><th>KH mới</th>
          <th>M+1</th><th>M+2</th><th>M+3</th><th>Churn %</th>
        </tr></thead>
        <tbody>
          <tr v-for="c in cohorts" :key="c.month">
            <td>{{ c.month }}</td>
            <td><strong>{{ c.new }}</strong></td>
            <td><div class="cell" :style="{ background: `rgba(37,99,235,${c.retain / 100})` }">{{ c.retain }}%</div></td>
            <td><div class="cell" :style="{ background: `rgba(37,99,235,${(c.retain - 5) / 100})` }">{{ Math.max(0, c.retain - 5) }}%</div></td>
            <td><div class="cell" :style="{ background: `rgba(37,99,235,${(c.retain - 12) / 100})` }">{{ Math.max(0, c.retain - 12) }}%</div></td>
            <td><BaseTag :variant="c.churn > 12 ? 'warning' : 'success'" :text="`${c.churn}%`" size="sm" /></td>
          </tr>
        </tbody>
      </table>
    </BasePanel>
  </AppPageLayout>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--wx-space-3);
}
.m-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.m-value { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); margin: 4px 0 4px; letter-spacing: var(--wx-tracking-tight); }
.spark { width: 100%; height: 32px; margin-top: var(--wx-space-2); }

.cols { display: grid; grid-template-columns: 2fr 1fr; gap: var(--wx-space-4); }
@media (max-width: 960px) { .cols { grid-template-columns: 1fr; } }
.big-chart { width: 100%; height: 220px; }
.legend { display: flex; gap: var(--wx-space-3); font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-top: var(--wx-space-2); }
.d { display: inline-block; width: 8px; height: 8px; border-radius: 9999px; margin-right: 4px; }

.plans { list-style: none; margin: 0; padding: 0; }
.plan-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-2) 0;
  border-bottom: 1px solid var(--wx-border-subtle);
  font-size: var(--wx-fs-13);
}
.plan-info { display: flex; align-items: center; gap: var(--wx-space-2); }
.dot { width: 10px; height: 10px; border-radius: 9999px; flex-shrink: 0; }
.muted { color: var(--wx-content-muted); }
.plan-mrr { font-weight: var(--wx-fw-semibold); }

.cohort { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.cohort th, .cohort td {
  text-align: left;
  padding: var(--wx-space-2) var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.cohort th { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); }
.cell {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--wx-radius-sm);
  color: white;
  font-weight: var(--wx-fw-semibold);
  min-width: 40px;
  text-align: center;
}
</style>

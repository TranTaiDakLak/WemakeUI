<script setup lang="ts">
/** dashboard/overview — 4 KPI gradient + chart đường + donut + recent activity */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseButton, BaseTag, BaseAvatar, BaseAvatarGroup } from '../../components/common'
import { sparkPath, sparkArea, seriesUp, seriesDown, seriesFlat, seriesVolatile } from '../_layouts/dashboard-widgets'

const kpi = [
  { label: 'Doanh thu', value: '128 tr', delta: '+12%', tone: 'success', series: seriesUp },
  { label: 'Đơn hàng', value: '1,284', delta: '+5%', tone: 'success', series: seriesUp },
  { label: 'Khách mới', value: '342', delta: '-2%', tone: 'danger', series: seriesDown },
  { label: 'CSAT', value: '4.6/5', delta: '+0.2', tone: 'success', series: seriesFlat },
] as const

const donut = [
  { label: 'Pro',  value: 62, color: '#2563eb' },
  { label: 'Free', value: 24, color: '#94a3b8' },
  { label: 'Team', value: 14, color: '#10b981' },
]
const total = donut.reduce((a, b) => a + b.value, 0)

const activity = [
  { who: 'Nguyễn Văn A', what: 'tạo đơn hàng #1284',  when: '2 phút trước', icon: '🛒' },
  { who: 'Trần Thị B',   what: 'cập nhật hồ sơ',       when: '15 phút trước', icon: '👤' },
  { who: 'Lê Văn C',     what: 'thanh toán hoá đơn',   when: '1 giờ trước',  icon: '💳' },
  { who: 'Phạm Thị D',   what: 'gửi yêu cầu hỗ trợ',   when: '3 giờ trước',  icon: '🎫' },
  { who: 'Hoàng Văn E',  what: 'nâng cấp gói pro',     when: 'hôm qua',      icon: '⭐' },
]
</script>

<template>
  <AppPageLayout section="dashboards"
    current="Tổng quan"
    page-title="Tổng quan"
    page-description="Bức tranh nhanh về doanh nghiệp của bạn — 7 ngày qua."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">7 ngày</BaseButton>
      <BaseButton variant="ghost" size="sm">30 ngày</BaseButton>
      <BaseButton size="sm">Xuất CSV</BaseButton>
    </template>

    <div class="kpi-grid" v-reveal>
      <BaseCard v-for="(k, i) in kpi" :key="k.label" v-reveal="i * 60" padded shadow="sm" radius="lg" hover-effect="lift">
        <div class="kpi">
          <div class="kpi-head">
            <span class="kpi-label">{{ k.label }}</span>
            <BaseTag size="sm" :variant="k.tone" :label="k.delta" />
          </div>
          <div class="kpi-value">{{ k.value }}</div>
          <svg class="kpi-spark" viewBox="0 0 120 32" preserveAspectRatio="none">
            <path :d="sparkArea([...k.series])" fill="rgba(37,99,235,0.12)" />
            <path :d="sparkPath([...k.series])" fill="none" stroke="#2563eb" stroke-width="1.5" />
          </svg>
        </div>
      </BaseCard>
    </div>

    <div class="cols" v-reveal>
      <BaseCard title="Doanh thu theo ngày" subtitle="So sánh 14 ngày gần nhất" padded shadow="sm" hover-effect="glow">
        <template #actions>
          <BaseTag label="primary" size="sm" variant="primary" />
          <BaseTag label="last week" size="sm" />
        </template>
        <svg class="chart" viewBox="0 0 600 200" preserveAspectRatio="none">
          <path :d="sparkArea([...seriesVolatile, ...seriesUp], 600, 200, 8)" fill="rgba(37,99,235,0.15)" />
          <path :d="sparkPath([...seriesVolatile, ...seriesUp], 600, 200, 8)" fill="none" stroke="#2563eb" stroke-width="2" />
          <path :d="sparkPath([...seriesUp, ...seriesFlat], 600, 200, 8)" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4" />
        </svg>
        <div class="chart-legend">
          <span class="dot" style="background:#2563eb" /> Tuần này
          <span class="dot" style="background:#94a3b8" /> Tuần trước
        </div>
      </BaseCard>

      <BaseCard title="Phân bổ gói" padded shadow="sm" hover-effect="glow">
        <div class="donut">
          <svg viewBox="0 0 42 42" class="donut-svg" aria-hidden="true">
            <circle cx="21" cy="21" r="15.91" fill="white" stroke="#f1f5f9" stroke-width="3" />
            <circle
              v-for="(d, i) in donut"
              :key="i"
              cx="21" cy="21" r="15.91"
              fill="transparent"
              :stroke="d.color"
              stroke-width="3"
              :stroke-dasharray="`${(d.value / total) * 100} ${100 - (d.value / total) * 100}`"
              :stroke-dashoffset="25 - donut.slice(0, i).reduce((a, b) => a + (b.value / total) * 100, 0)"
            />
          </svg>
          <div class="donut-center">
            <div class="donut-num">{{ total }}</div>
            <div class="donut-cap">tổng KH</div>
          </div>
        </div>
        <ul class="legend">
          <li v-for="d in donut" :key="d.label">
            <span class="dot" :style="{ background: d.color }" />
            <span>{{ d.label }}</span>
            <strong>{{ Math.round((d.value / total) * 100) }}%</strong>
          </li>
        </ul>
      </BaseCard>
    </div>

    <BasePanel v-reveal title="Hoạt động gần đây" description="20 sự kiện cuối · realtime">
      <template #actions>
        <BaseAvatarGroup :max="3" size="xs">
          <BaseAvatar name="A" size="xs" status="online" />
          <BaseAvatar name="B" size="xs" status="online" />
          <BaseAvatar name="C" size="xs" status="busy" />
        </BaseAvatarGroup>
      </template>
      <ul class="activity">
        <li v-for="(a, i) in activity" :key="i" class="activity__item">
          <span class="activity__icon">{{ a.icon }}</span>
          <div class="activity__text">
            <div><strong>{{ a.who }}</strong> {{ a.what }}</div>
            <div class="muted small">{{ a.when }}</div>
          </div>
        </li>
      </ul>
    </BasePanel>
  </AppPageLayout>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--wx-space-3);
}
.kpi { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.kpi-head { display: flex; align-items: center; justify-content: space-between; }
.kpi-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.kpi-value {
  font-size: var(--wx-fs-28);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
  line-height: var(--wx-lh-tight);
}
.kpi-spark { width: 100%; height: 32px; }

.cols {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--wx-space-4);
}
@media (max-width: 880px) { .cols { grid-template-columns: 1fr; } }

.chart { width: 100%; height: 200px; }
.chart-legend {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  margin-top: var(--wx-space-2);
}
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 9999px; margin-right: 4px; }

.donut {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.donut-svg { width: 160px; height: 160px; transform: rotate(-90deg); }
.donut-center {
  position: absolute;
  text-align: center;
}
.donut-num { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); }
.donut-cap { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }

.legend {
  list-style: none;
  margin: var(--wx-space-3) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  font-size: var(--wx-fs-13);
}
.legend li { display: flex; align-items: center; gap: var(--wx-space-2); }
.legend strong { margin-left: auto; }

.activity {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.activity__item { display: flex; gap: var(--wx-space-2); align-items: flex-start; font-size: var(--wx-fs-13); }
.activity__icon {
  width: 28px; height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-sunken);
  flex-shrink: 0;
}
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }
</style>

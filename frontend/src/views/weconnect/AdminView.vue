<script setup lang="ts">
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseCard, BaseBadge } from '../../components/common'
import { Sparkline } from '../../components/charts'

function gen(n: number, seed = 1) {
  return Array.from({ length: n }, (_, i) => 50 + Math.sin(i / 3 + seed) * 20 + Math.random() * 15)
}

const KPIS = [
  { label: 'Tài khoản hoạt động', value: '1,284', delta: '+12%', color: '#2563eb', trend: gen(24, 1) },
  { label: 'Phiên kết nối hôm nay', value: '4,821', delta: '+8%', color: '#10b981', trend: gen(24, 2) },
  { label: 'Chiến dịch đang chạy', value: '24', delta: '+2', color: '#f59e0b', trend: gen(24, 3) },
  { label: 'Tỷ lệ giao thành công', value: '98.4%', delta: '-0.2%', color: '#ef4444', trend: gen(24, 4) },
]

const RECENT = [
  { time: '10:42', event: 'Chiến dịch "Khuyến mãi 5/5" bắt đầu', type: 'campaign' },
  { time: '10:15', event: 'Tài khoản @batcong.vn kết nối QR mới', type: 'account' },
  { time: '09:58', event: 'Plugin ChatGPT v2.1 cập nhật thành công', type: 'plugin' },
  { time: '09:30', event: 'Lỗi kết nối tới server backup — đã recover', type: 'error' },
  { time: '08:45', event: '3 session mới từ Hà Nội (Viettel)', type: 'session' },
]

const TYPE_COLORS: Record<string, string> = {
  campaign: '#2563eb', account: '#10b981', plugin: '#f59e0b', error: '#ef4444', session: '#8b5cf6',
}
</script>

<template>
  <WeConnectLayout current="admin" page-title="Tổng quan hệ thống" page-description="Giám sát trạng thái và hoạt động của WeConnect">
    <div class="kpi-grid">
      <BaseCard v-for="k in KPIS" :key="k.label" class="kpi-card">
        <template #body>
          <div class="kpi-head">
            <span class="kpi-label">{{ k.label }}</span>
            <span class="kpi-delta">{{ k.delta }}</span>
          </div>
          <span class="kpi-val">{{ k.value }}</span>
          <Sparkline :values="k.trend" :width="160" :height="36" :color="k.color" fill />
        </template>
      </BaseCard>
    </div>

    <BaseCard>
      <template #header><span class="card-label">Hoạt động gần đây</span></template>
      <template #body>
        <div class="event-list">
          <div v-for="ev in RECENT" :key="ev.time" class="event-row">
            <span class="event-dot" :style="`background:${TYPE_COLORS[ev.type]}`" />
            <span class="event-time">{{ ev.time }}</span>
            <span class="event-text">{{ ev.event }}</span>
          </div>
        </div>
      </template>
    </BaseCard>
  </WeConnectLayout>
</template>

<style scoped>
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--wx-space-4); }
@media (max-width: 900px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
.kpi-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--wx-space-1); }
.kpi-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-semibold); }
.kpi-delta { font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); background: var(--wx-success-bg); color: var(--wx-success-text); padding: 1px 6px; border-radius: var(--wx-radius-full); }
.kpi-val { display: block; font-size: var(--wx-fs-28); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin: var(--wx-space-2) 0; }
.card-label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }
.event-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.event-row { display: flex; align-items: center; gap: var(--wx-space-3); }
.event-dot { width: 8px; height: 8px; border-radius: var(--wx-radius-full); flex-shrink: 0; }
.event-time { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-muted); min-width: 40px; }
.event-text { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
</style>

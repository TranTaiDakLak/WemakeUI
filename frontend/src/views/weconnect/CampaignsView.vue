<script setup lang="ts">
import { ref } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseButton, BaseBadge, BaseProgress, BaseCard } from '../../components/common'

const CAMPAIGNS = [
  { id: 1, name: 'Khuyến mãi 5/5', status: 'running', sent: 1284, total: 2000, success: 1198, failed: 86, startTime: '08:00', eta: '12:30' },
  { id: 2, name: 'Thông báo cập nhật v2.1', status: 'completed', sent: 850, total: 850, success: 832, failed: 18, startTime: 'Hôm qua 14:00', eta: 'Đã xong' },
  { id: 3, name: 'Nhắc lịch hẹn tháng 5', status: 'scheduled', sent: 0, total: 500, success: 0, failed: 0, startTime: '06/05 08:00', eta: '06/05 10:00' },
  { id: 4, name: 'Khảo sát NPS Q2', status: 'draft', sent: 0, total: 300, success: 0, failed: 0, startTime: '—', eta: '—' },
]

const STATUS_MAP: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'neutral' }> = {
  running: { label: 'Đang chạy', variant: 'info' },
  completed: { label: 'Hoàn thành', variant: 'success' },
  scheduled: { label: 'Đã lên lịch', variant: 'warning' },
  draft: { label: 'Nháp', variant: 'neutral' },
}
</script>

<template>
  <WeConnectLayout current="campaigns" page-title="Chiến dịch tin nhắn" page-description="Tạo và theo dõi chiến dịch gửi tin hàng loạt">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Tạo chiến dịch</BaseButton>
    </template>

    <div class="campaign-list">
      <BaseCard v-for="c in CAMPAIGNS" :key="c.id" class="campaign-card">
        <template #header>
          <div class="campaign-head">
            <div>
              <h3 class="campaign-name">{{ c.name }}</h3>
              <div class="campaign-meta">
                <BaseBadge :text="STATUS_MAP[c.status].label" :variant="STATUS_MAP[c.status].variant" dot />
                <span class="campaign-time">{{ c.startTime }}</span>
                <span v-if="c.eta !== '—'" class="campaign-eta">ETA: {{ c.eta }}</span>
              </div>
            </div>
            <div class="campaign-actions">
              <BaseButton v-if="c.status === 'running'" size="sm" variant="ghost">Tạm dừng</BaseButton>
              <BaseButton v-if="c.status === 'draft'" size="sm" variant="primary">Chỉnh sửa</BaseButton>
              <BaseButton v-if="c.status === 'scheduled'" size="sm" variant="ghost">Huỷ lịch</BaseButton>
              <BaseButton size="sm" variant="ghost">Chi tiết</BaseButton>
            </div>
          </div>
        </template>
        <template #body>
          <div class="campaign-stats">
            <div class="stat"><span class="st-val">{{ c.total.toLocaleString() }}</span><span class="st-key">Tổng</span></div>
            <div class="stat"><span class="st-val">{{ c.sent.toLocaleString() }}</span><span class="st-key">Đã gửi</span></div>
            <div class="stat success"><span class="st-val">{{ c.success.toLocaleString() }}</span><span class="st-key">Thành công</span></div>
            <div class="stat danger"><span class="st-val">{{ c.failed }}</span><span class="st-key">Thất bại</span></div>
            <div class="stat rate"><span class="st-val">{{ c.total > 0 && c.sent > 0 ? ((c.success / c.sent) * 100).toFixed(1) + '%' : '—' }}</span><span class="st-key">Tỷ lệ</span></div>
          </div>
          <div v-if="c.status === 'running' || c.status === 'completed'" class="prog-row">
            <BaseProgress :value="(c.sent / c.total) * 100" :variant="c.status === 'completed' ? 'success' : 'primary'" />
            <span class="prog-pct">{{ Math.round((c.sent / c.total) * 100) }}%</span>
          </div>
        </template>
      </BaseCard>
    </div>
  </WeConnectLayout>
</template>

<style scoped>
.campaign-list { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.campaign-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--wx-space-4); }
.campaign-name { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-1); }
.campaign-meta { display: flex; align-items: center; gap: var(--wx-space-3); }
.campaign-time { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.campaign-eta { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.campaign-actions { display: flex; gap: var(--wx-space-2); flex-shrink: 0; }
.campaign-stats { display: flex; gap: var(--wx-space-6); margin-bottom: var(--wx-space-3); flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; gap: 2px; }
.st-val { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); }
.st-key { font-size: var(--wx-fs-11); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); }
.stat.success .st-val { color: var(--wx-status-success-text); }
.stat.danger .st-val { color: var(--wx-status-danger-text); }
.stat.rate .st-val { color: var(--wx-brand-600); }
.prog-row { display: flex; align-items: center; gap: var(--wx-space-3); }
.prog-row :deep(.wx-progress) { flex: 1; }
.prog-pct { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); min-width: 36px; text-align: right; }
</style>

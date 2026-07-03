<script setup lang="ts">
/** dashboard/helpdesk — ticket, SLA, agent performance */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseTag, BaseButton, BaseAvatar, BaseProgress } from '../../components/common'

const tickets = [
  { id: 'T-1284', subj: 'Không đăng nhập được sau update', priority: 'high', status: 'open',     agent: 'A', age: '12 phút' },
  { id: 'T-1283', subj: 'Yêu cầu hoàn tiền đơn #1280',     priority: 'medium', status: 'pending', agent: 'B', age: '2 giờ' },
  { id: 'T-1282', subj: 'Tích hợp API webhook',            priority: 'low', status: 'progress', agent: 'C', age: '4 giờ' },
  { id: 'T-1281', subj: 'Ứng dụng crash khi mở settings',  priority: 'high', status: 'progress', agent: 'A', age: '6 giờ' },
  { id: 'T-1280', subj: 'Hướng dẫn xuất CSV',              priority: 'low', status: 'resolved', agent: 'D', age: '1 ngày' },
] as const

const sLabel = (s: string) => ({
  open: 'mở mới', pending: 'chờ KH', progress: 'đang xử lý', resolved: 'đã xử lý',
}[s as 'open'] ?? s)
const sVariant = (s: string) => ({
  open: 'warning', pending: 'neutral', progress: 'primary', resolved: 'success',
}[s as 'open'] ?? 'neutral') as 'warning' | 'neutral' | 'primary' | 'success'
const pVariant = (p: string) =>
  p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'neutral'

const agents = [
  { who: 'Trần Quốc Anh', open: 8,  closed: 42, avg: '12m', sla: 96 },
  { who: 'Phạm Mai Linh', open: 6,  closed: 38, avg: '14m', sla: 94 },
  { who: 'Vũ Hoàng',      open: 12, closed: 28, avg: '22m', sla: 82 },
  { who: 'Lê Đức Hà',     open: 4,  closed: 24, avg: '18m', sla: 88 },
]
</script>

<template>
  <AppPageLayout section="dashboards"
    current="Helpdesk"
    page-title="Helpdesk"
    page-description="Theo dõi ticket, SLA và hiệu suất agent."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">Trợ giúp</BaseButton>
      <BaseButton size="sm">+ Ticket</BaseButton>
    </template>

    <div class="kpi-grid" v-reveal>
      <BaseCard padded shadow="sm">
        <div class="m-label">Ticket đang mở</div>
        <div class="m-value">38</div>
        <BaseTag size="sm" variant="warning" label="5 critical" />
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">SLA tuân thủ</div>
        <div class="m-value">94.2%</div>
        <BaseTag size="sm" variant="success" label="đạt mục tiêu 90%" />
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">First response TB</div>
        <div class="m-value">14 phút</div>
        <BaseTag size="sm" variant="primary" label="-2 phút" />
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">CSAT</div>
        <div class="m-value">4.7 / 5</div>
        <BaseTag size="sm" variant="success" label="218 đánh giá" />
      </BaseCard>
    </div>

    <div class="cols" v-reveal>
      <BasePanel title="Ticket mới nhất">
        <table class="tickets">
          <thead><tr>
            <th>ID</th><th>Tiêu đề</th><th>Ưu tiên</th>
            <th>Trạng thái</th><th>Agent</th><th>Thời gian</th>
          </tr></thead>
          <tbody>
            <tr v-for="t in tickets" :key="t.id">
              <td><code class="mono">{{ t.id }}</code></td>
              <td class="subj">{{ t.subj }}</td>
              <td><BaseTag :variant="pVariant(t.priority)" :label="t.priority" size="sm" /></td>
              <td><BaseTag :variant="sVariant(t.status)" :label="sLabel(t.status)" size="sm" /></td>
              <td><BaseAvatar :name="t.agent" size="xs" /></td>
              <td class="muted small">{{ t.age }}</td>
            </tr>
          </tbody>
        </table>
      </BasePanel>

      <BasePanel title="Hiệu suất agent">
        <ul class="agents">
          <li v-for="a in agents" :key="a.who" class="agent-row">
            <BaseAvatar :name="a.who" size="sm" />
            <div class="agent-info">
              <strong>{{ a.who }}</strong>
              <div class="muted small">{{ a.open }} mở · {{ a.closed }} đã xử lý · {{ a.avg }}</div>
              <BaseProgress :value="a.sla" size="sm" :variant="a.sla >= 90 ? 'success' : 'warning'" :label="`SLA ${a.sla}%`" />
            </div>
          </li>
        </ul>
      </BasePanel>
    </div>

    <BaseCard v-reveal title="Phân loại ticket" padded shadow="sm">
      <div class="topics">
        <div v-for="(c, i) in [
          { label: 'Đăng nhập', count: 28 },
          { label: 'Thanh toán', count: 18 },
          { label: 'Tích hợp API', count: 12 },
          { label: 'Lỗi UI', count: 24 },
          { label: 'Hoàn tiền', count: 8 },
          { label: 'Hướng dẫn', count: 32 },
          { label: 'Bảo mật', count: 4 },
          { label: 'Khác', count: 14 },
        ]" :key="i" class="topic">
          <span class="t-name">{{ c.label }}</span>
          <span class="t-count">{{ c.count }}</span>
        </div>
      </div>
    </BaseCard>
  </AppPageLayout>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--wx-space-3);
}
.m-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.m-value { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); margin: 4px 0; letter-spacing: var(--wx-tracking-tight); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }

.cols { display: grid; grid-template-columns: 2fr 1fr; gap: var(--wx-space-4); }
@media (max-width: 960px) { .cols { grid-template-columns: 1fr; } }

.tickets { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.tickets th, .tickets td {
  text-align: left;
  padding: var(--wx-space-2) var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.tickets th { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); }
.subj { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mono { font-family: var(--wx-font-mono); color: var(--wx-content-link); }

.agents { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-3); }
.agent-row { display: flex; gap: var(--wx-space-2); align-items: flex-start; }
.agent-info { flex: 1; display: flex; flex-direction: column; gap: 4px; font-size: var(--wx-fs-13); }

.topics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--wx-space-2);
}
.topic {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-fs-13);
}
.t-count { font-weight: var(--wx-fw-bold); color: var(--wx-brand-primary); }
</style>

<script setup lang="ts">
/** dashboard/crm — pipeline kanban + leads table */
import DashboardLayout from '../_layouts/DashboardLayout.vue'
import { BaseCard, BaseTag, BaseButton, BaseAvatar, BaseAvatarGroup } from '../../components/common'

const stages = [
  { id: 'lead',     label: 'Tiềm năng',     color: '#94a3b8', deals: 18, value: '320 tr' },
  { id: 'qualify',  label: 'Đã sàng lọc',   color: '#60a5fa', deals: 12, value: '480 tr' },
  { id: 'proposal', label: 'Đã báo giá',    color: '#fbbf24', deals: 7,  value: '620 tr' },
  { id: 'negotiate',label: 'Đang đàm phán', color: '#a78bfa', deals: 4,  value: '480 tr' },
  { id: 'won',      label: 'Đã chốt',       color: '#10b981', deals: 9,  value: '780 tr' },
] as const

const cards: Record<string, Array<{ company: string; deal: string; amount: string; owner: string }>> = {
  lead: [
    { company: 'TechCorp', deal: 'Triển khai design system', amount: '120tr', owner: 'A' },
    { company: 'StartUp X', deal: 'Migration UI kit',         amount: '80tr',  owner: 'B' },
  ],
  qualify: [
    { company: 'GlobalCo', deal: 'POC Vue 3',                 amount: '180tr', owner: 'C' },
    { company: 'FinFlow',  deal: 'Token semantic',            amount: '90tr',  owner: 'A' },
  ],
  proposal: [
    { company: 'MegaBank', deal: 'White-label kit',           amount: '240tr', owner: 'D' },
  ],
  negotiate: [
    { company: 'EduTech',  deal: 'Bộ icon riêng',             amount: '160tr', owner: 'B' },
  ],
  won: [
    { company: 'Health+',  deal: 'Triển khai 6 tháng',        amount: '320tr', owner: 'C' },
    { company: 'Logix',    deal: 'Component data grid',       amount: '180tr', owner: 'A' },
  ],
}
</script>

<template>
  <DashboardLayout
    current="CRM"
    page-title="Pipeline bán hàng"
    page-description="Theo dõi deals theo stage — kéo thả để cập nhật."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">Lọc</BaseButton>
      <BaseButton size="sm">+ Deal mới</BaseButton>
    </template>

    <div class="summary">
      <BaseCard padded shadow="sm">
        <div class="metric"><span>Pipeline value</span><strong>2.680 triệu</strong></div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric"><span>Deals đang mở</span><strong>50</strong></div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric"><span>Tỷ lệ win</span><strong>32%</strong></div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric"><span>Vòng đời TB</span><strong>21 ngày</strong></div>
      </BaseCard>
    </div>

    <div class="board">
      <div v-for="s in stages" :key="s.id" class="col">
        <header class="col-head">
          <div class="col-title">
            <span class="dot" :style="{ background: s.color }" />
            {{ s.label }}
            <span class="muted">· {{ s.deals }}</span>
          </div>
          <span class="col-value">{{ s.value }}</span>
        </header>

        <div class="col-body">
          <article v-for="c in cards[s.id]" :key="c.company" class="card">
            <strong>{{ c.company }}</strong>
            <p>{{ c.deal }}</p>
            <footer class="card-foot">
              <BaseTag size="sm" variant="primary" :text="c.amount" />
              <BaseAvatar :name="c.owner" size="xs" />
            </footer>
          </article>
          <button v-if="!cards[s.id]?.length" class="empty" type="button">+ thêm deal</button>
        </div>
      </div>
    </div>

    <BaseCard title="Top sales — 30 ngày" padded shadow="sm">
      <ul class="leaderboard">
        <li v-for="(p, i) in [
          { who: 'Trần Quốc Anh', deals: 12, value: '480tr', win: 38 },
          { who: 'Phạm Mai Linh', deals: 9, value: '420tr', win: 35 },
          { who: 'Vũ Hoàng',      deals: 7, value: '280tr', win: 28 },
          { who: 'Lê Đức Hà',     deals: 5, value: '180tr', win: 22 },
        ]" :key="i" class="lead-row">
          <span class="lead-rank">{{ i + 1 }}</span>
          <BaseAvatar :name="p.who" size="sm" />
          <strong>{{ p.who }}</strong>
          <span>{{ p.deals }} deals</span>
          <span>{{ p.value }}</span>
          <BaseTag :text="`${p.win}%`" size="sm" variant="success" />
        </li>
      </ul>
    </BaseCard>
  </DashboardLayout>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--wx-space-3);
}
.metric { display: flex; flex-direction: column; gap: 4px; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.metric strong { font-size: var(--wx-fs-20); color: var(--wx-content-primary); font-weight: var(--wx-fw-bold); }

.board {
  display: grid;
  grid-template-columns: repeat(5, minmax(220px, 1fr));
  gap: var(--wx-space-3);
  overflow-x: auto;
  padding-bottom: var(--wx-space-2);
}
@media (max-width: 1100px) {
  .board { grid-template-columns: repeat(5, 240px); }
}

.col {
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  min-width: 220px;
}
.col-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--wx-space-2);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.col-title { display: flex; align-items: center; gap: var(--wx-space-1); font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); }
.dot { width: 8px; height: 8px; border-radius: 9999px; }
.muted { color: var(--wx-content-muted); font-weight: var(--wx-fw-regular); }
.col-value { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); }

.col-body { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.card {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  padding: var(--wx-space-3);
  cursor: grab;
  transition: box-shadow var(--wx-d-fast) var(--wx-ease-standard);
}
.card:hover { box-shadow: var(--wx-shadow-md); }
.card strong { font-size: var(--wx-fs-13); }
.card p { margin: 4px 0 var(--wx-space-2); font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.card-foot { display: flex; align-items: center; justify-content: space-between; }

.empty {
  background: transparent;
  border: 1px dashed var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  padding: var(--wx-space-3);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  cursor: pointer;
  font-family: inherit;
}
.empty:hover { background: var(--wx-surface-base); }

.leaderboard {
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
}
.lead-row {
  display: grid;
  grid-template-columns: 24px 32px 1fr auto auto auto;
  gap: var(--wx-space-3);
  align-items: center;
  padding: var(--wx-space-2);
  font-size: var(--wx-fs-13);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.lead-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; height: 24px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-sunken);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
}
</style>

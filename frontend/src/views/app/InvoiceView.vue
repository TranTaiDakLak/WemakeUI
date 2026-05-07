<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseCard } from '../../components/common'

const INVOICES = [
  { id: 'INV-2026-042', client: 'Công ty TNHH ABC', amount: 15000000, status: 'paid', date: '2026-04-30', due: '2026-05-15' },
  { id: 'INV-2026-041', client: 'Startup XYZ', amount: 8500000, status: 'pending', date: '2026-04-25', due: '2026-05-10' },
  { id: 'INV-2026-040', client: 'Cty CP DEF', amount: 22000000, status: 'overdue', date: '2026-04-10', due: '2026-04-25' },
  { id: 'INV-2026-039', client: 'Tập đoàn GHI', amount: 35000000, status: 'paid', date: '2026-03-31', due: '2026-04-15' },
  { id: 'INV-2026-038', client: 'Cá nhân JKL', amount: 3200000, status: 'draft', date: '2026-03-20', due: '2026-04-05' },
]

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  paid:    { label: 'Đã thanh toán', variant: 'success' },
  pending: { label: 'Chờ thanh toán', variant: 'warning' },
  overdue: { label: 'Quá hạn', variant: 'danger' },
  draft:   { label: 'Nháp', variant: 'neutral' },
}

const total = INVOICES.reduce((s, i) => i.status !== 'draft' ? s + i.amount : s, 0)
const paid = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
const pending = INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)
const overdue = INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

function fmt(n: number) { return n.toLocaleString('vi-VN') + ' ₫' }
</script>

<template>
  <AppPageLayout section="app" current="hoá đơn" page-title="Quản lý hoá đơn" page-description="Tạo và theo dõi trạng thái thanh toán">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Tạo hoá đơn</BaseButton>
    </template>

    <div class="kpi-row">
      <BaseCard v-for="[label, val, variant] in [['Tổng doanh thu', fmt(total), ''], ['Đã nhận', fmt(paid), 'success'], ['Chờ thu', fmt(pending), 'warning'], ['Quá hạn', fmt(overdue), 'danger']]" :key="label" class="kpi-card">
        <template #body>
          <span class="kpi-label">{{ label }}</span>
          <span class="kpi-val" :data-variant="variant">{{ val }}</span>
        </template>
      </BaseCard>
    </div>

    <div class="invoice-table-wrap">
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Mã hoá đơn</th><th>Khách hàng</th><th>Ngày tạo</th><th>Hạn thanh toán</th><th>Số tiền</th><th>Trạng thái</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in INVOICES" :key="inv.id">
            <td class="inv-id">{{ inv.id }}</td>
            <td>{{ inv.client }}</td>
            <td>{{ inv.date }}</td>
            <td :class="{ overdue: inv.status === 'overdue' }">{{ inv.due }}</td>
            <td class="amount">{{ fmt(inv.amount) }}</td>
            <td><BaseBadge :text="STATUS_MAP[inv.status].label" :variant="STATUS_MAP[inv.status].variant" /></td>
            <td>
              <div class="row-actions">
                <BaseButton size="sm" variant="ghost">Xem</BaseButton>
                <BaseButton v-if="inv.status === 'pending'" size="sm" variant="primary">Nhắc nhở</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--wx-space-4); }
@media (max-width: 768px) { .kpi-row { grid-template-columns: repeat(2, 1fr); } }
.kpi-card :deep(.wx-card__body) { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.kpi-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-semibold); }
.kpi-val { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); }
.kpi-val[data-variant="success"] { color: var(--wx-status-success-text); }
.kpi-val[data-variant="warning"] { color: var(--wx-status-warning-text); }
.kpi-val[data-variant="danger"] { color: var(--wx-status-danger-text); }

.invoice-table-wrap { overflow-x: auto; background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); }
.invoice-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-14); }
.invoice-table th { padding: var(--wx-space-3) var(--wx-space-4); text-align: left; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-default); }
.invoice-table td { padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.invoice-table tbody tr:last-child td { border-bottom: none; }
.invoice-table tbody tr:hover td { background: var(--wx-hover-bg); }
.inv-id { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); color: var(--wx-content-link); }
.amount { font-weight: var(--wx-fw-semibold); }
.overdue { color: var(--wx-status-danger-text); }
.row-actions { display: flex; gap: var(--wx-space-2); }
</style>

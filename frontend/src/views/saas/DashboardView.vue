<script setup lang="ts">
import { computed } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import DashboardKPICard from '@/archetypes/dashboard/DashboardKPICard.vue'
import { AreaChart, DonutChart } from '@/components/charts'
import type { LineSeries } from '@/components/charts/LineChart.vue'
import type { DonutSlice } from '@/components/charts/DonutChart.vue'
import { BaseButton, BaseBadge, BaseSkeleton } from '@/components/common'
import StatusChip from '@/components/common/StatusChip.vue'
import { useToast } from '@/composables/useToast'
import { useSaasStore } from '@/stores/saas'
import { useNotificationsStore } from '@/stores/notifications'

const { showToast } = useToast()
const store = useSaasStore()
const notifStore = useNotificationsStore()

/* ── Revenue line chart ── */
const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
const revenueSeries = computed<LineSeries[]>(() => [
  {
    name: 'Doanh thu 2025',
    data: [120, 145, 132, 168, 155, 184, 210, 198, 220, 245, 232, 268].map((y, i) => ({ x: MONTHS[i], y })),
  },
  {
    name: 'Doanh thu 2024',
    data: [85, 92, 88, 105, 98, 115, 128, 120, 135, 148, 140, 162].map((y, i) => ({ x: MONTHS[i], y })),
    color: '#94a3b8',
  },
])

/* ── Product distribution donut ── */
const productPie = computed<DonutSlice[]>(() => [
  { label: 'Subscription', value: 58, color: '#2563eb' },
  { label: 'One-time',     value: 28, color: '#10b981' },
  { label: 'Trial → Paid', value: 14, color: '#f59e0b' },
])

/* ── Status map for pending tx table ── */
const TX_STATUS_MAP = {
  processing: { variant: 'warning' as const, label: 'Đang xử lý', dot: true },
  completed:  { variant: 'success' as const, label: 'Hoàn thành',  dot: true },
  failed:     { variant: 'danger'  as const, label: 'Thất bại',    dot: true },
}

/* ── Actions ── */
async function confirmTx(id: number, code: string) {
  await store.confirmTransaction(id)
  showToast('success', `Đã xác nhận giao dịch ${code}`)
  notifStore.push({
    title: 'Giao dịch đã xác nhận',
    body: `Giao dịch ${code} đã được xác nhận thành công.`,
    severity: 'success',
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    action: { label: 'Xem giao dịch', to: '/saas/transactions' },
  })
}

async function quickAction(label: string) {
  await new Promise(r => setTimeout(r, 600))
  showToast('success', `Đã thực hiện: ${label}`)
}
</script>

<template>
  <SaasLayout
    current="dashboard"
    page-title="Dashboard"
    page-description="Tổng quan hoạt động kinh doanh"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost" @click="quickAction('Xuất báo cáo tháng')">Xuất báo cáo</BaseButton>
      <BaseButton size="sm" @click="quickAction('Làm mới dữ liệu')">Làm mới</BaseButton>
    </template>

    <!-- Alert banner (from store, dismissible) -->
    <div v-if="store.showAlert" class="alert-banner">
      <span class="alert-banner__icon">⚠️</span>
      <span class="alert-banner__text">
        <strong>{{ store.pendingTxCount }} giao dịch</strong> đang chờ xử lý. Vui lòng kiểm tra ngay.
      </span>
      <BaseButton size="sm" variant="warning" @click="$router.push('/saas/transactions')">Xem giao dịch</BaseButton>
      <BaseButton variant="ghost" size="icon" @click="store.dismissAlert()">✕</BaseButton>
    </div>

    <!-- Quick action buttons -->
    <div class="quick-actions">
      <BaseButton variant="secondary" class="qa-btn" @click="$router.push('/saas/members')">
        <span class="qa-btn__icon">👥</span>
        <span class="qa-btn__label">Thành viên</span>
        <span class="qa-btn__count">{{ store.memberCount }}</span>
      </BaseButton>
      <BaseButton variant="secondary" class="qa-btn" @click="$router.push('/saas/products')">
        <span class="qa-btn__icon">📦</span>
        <span class="qa-btn__label">Sản phẩm</span>
        <span class="qa-btn__count">{{ store.productCount }}</span>
      </BaseButton>
      <BaseButton variant="secondary" class="qa-btn" @click="$router.push('/saas/transactions')">
        <span class="qa-btn__icon">⏳</span>
        <span class="qa-btn__label">Chờ xử lý</span>
        <span class="qa-btn__count qa-btn__count--warn">{{ store.pendingTxCount }}</span>
      </BaseButton>
      <BaseButton variant="secondary" class="qa-btn" @click="$router.push('/saas/statistics')">
        <span class="qa-btn__icon">📈</span>
        <span class="qa-btn__label">Xem thống kê</span>
      </BaseButton>
    </div>

    <!-- KPI cards from store -->
    <div v-if="store.loading" class="kpi-grid">
      <BaseSkeleton v-for="i in 4" :key="i" height="130px" />
    </div>
    <div v-else class="kpi-grid">
      <DashboardKPICard
        v-for="kpi in store.kpis"
        :key="kpi.label"
        v-bind="kpi"
        @click="showToast('info', kpi.label)"
      />
    </div>

    <!-- Charts row -->
    <div class="charts-row">
      <div class="chart-card chart-card--main">
        <div class="chart-card__header">
          <h3 class="chart-card__title">Doanh thu theo tháng</h3>
          <span class="chart-card__sub">So sánh 2024 vs 2025 (triệu đồng)</span>
        </div>
        <AreaChart :series="revenueSeries" :height="220" :smooth="true" />
      </div>

      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">Phân bổ doanh thu</h3>
          <span class="chart-card__sub">Theo loại sản phẩm</span>
        </div>
        <div class="donut-center">
          <DonutChart :data="productPie" :size="220" :thickness="0.42" :show-legend="true" />
        </div>
      </div>
    </div>

    <!-- Pending transactions from store -->
    <div class="pending-section">
      <div class="pending-section__header">
        <h3 class="pending-section__title">Giao dịch chờ xử lý</h3>
        <BaseBadge :text="String(store.pendingTxCount)" variant="warning" />
        <BaseButton size="sm" variant="ghost" class="ml-auto" @click="$router.push('/saas/transactions')">Xem tất cả</BaseButton>
      </div>
      <div class="pending-table">
        <table class="ptable">
          <thead>
            <tr>
              <th class="th-stt">STT</th>
              <th>Mã GD</th>
              <th>Thành viên</th>
              <th>Sản phẩm</th>
              <th>Giá trị</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tx, idx) in store.dashboardPendingTxs" :key="tx['id'] as number">
              <td class="tx-stt">{{ idx + 1 }}</td>
              <td><code class="tx-code">{{ tx['txCode'] }}</code></td>
              <td class="tx-member">{{ tx['memberName'] }}</td>
              <td class="tx-product">{{ tx['productName'] }}</td>
              <td class="tx-amount">{{ (tx['amount'] as number).toLocaleString('vi-VN') }}đ</td>
              <td><StatusChip :status="tx['txStatus'] as string" :map="TX_STATUS_MAP" /></td>
              <td>
                <BaseButton
                  size="sm"
                  variant="primary"
                  @click="confirmTx(tx['id'] as number, tx['txCode'] as string)"
                >Xác nhận</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SaasLayout>
</template>

<style scoped>
/* ── Alert banner ── */
.alert-banner {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: color-mix(in srgb, var(--wx-warning-solid) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--wx-warning-solid) 30%, transparent);
  border-radius: var(--wx-radius-md);
}

.alert-banner__icon { font-size: 16px; flex-shrink: 0; }
.alert-banner__text { flex: 1; font-size: var(--wx-fs-13); color: var(--wx-text-primary); }

/* ── Quick actions ── */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--wx-space-3);
}
@media (min-width: 640px) {
  .quick-actions { grid-template-columns: repeat(4, 1fr); }
}

/* qa-btn overrides BaseButton secondary for column card layout */
.qa-btn.wx-btn {
  flex-direction: column;
  align-items: center;
  height: auto;
  padding: var(--wx-space-4);
  width: 100%;
}

.qa-btn__icon { font-size: 24px; }
.qa-btn__label {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
}
.qa-btn__count {
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  font-variant-numeric: tabular-nums;
}
.qa-btn__count--warn { color: var(--wx-warning-solid); }

/* ── KPI grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--wx-space-3);
}
@media (min-width: 768px) {
  .kpi-grid { grid-template-columns: repeat(4, 1fr); gap: var(--wx-space-4); }
}

/* ── Charts row ── */
.charts-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--wx-space-4);
}
@media (min-width: 900px) {
  .charts-row { grid-template-columns: 1fr 1fr; }
}

.chart-card {
  background: var(--wx-surface-default);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-4);
}

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

.donut-center {
  display: flex;
  justify-content: center;
  padding: var(--wx-space-2) 0;
}

/* ── Pending table ── */
.pending-section {
  background: var(--wx-surface-default);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
}

.pending-section__header {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.pending-section__title {
  margin: 0;
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}

.ml-auto { margin-left: auto; }

.pending-table { overflow-x: auto; }

.ptable {
  width: 100%;
  border-collapse: collapse;
}

.ptable th {
  padding: var(--wx-space-2) var(--wx-space-4);
  text-align: left;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
  border-bottom: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
  white-space: nowrap;
}

.ptable td {
  padding: var(--wx-space-3) var(--wx-space-4);
  font-size: var(--wx-fs-13);
  border-bottom: 1px solid var(--wx-border-subtle);
  vertical-align: middle;
}

.ptable tr:last-child td { border-bottom: none; }
.ptable tr:hover td { background: var(--wx-surface-hover); }

.tx-code {
  font-family: var(--wx-font-mono, monospace);
  font-size: var(--wx-fs-11);
  color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
}

.th-stt { width: 48px; text-align: center; }
.tx-stt { text-align: center; font-size: var(--wx-fs-12); color: var(--wx-text-muted); font-variant-numeric: tabular-nums; }
.tx-member  { font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); white-space: nowrap; }
.tx-product { color: var(--wx-text-secondary); white-space: nowrap; }
.tx-amount  { font-weight: var(--wx-fw-semibold); white-space: nowrap; font-variant-numeric: tabular-nums; }

/* ── Mobile responsive ── */
@media (max-width: 480px) {
  /* KPI: 1 cột trên điện thoại nhỏ */
  .kpi-grid { grid-template-columns: 1fr; gap: var(--wx-space-3); }

  /* Quick actions: 2x2 */
  .quick-actions { grid-template-columns: repeat(2, 1fr); gap: var(--wx-space-2); }
  .qa-btn { padding: var(--wx-space-3); }
  .qa-btn__icon { font-size: 20px; }

  /* Alert banner: wrap */
  .alert-banner { flex-wrap: wrap; gap: var(--wx-space-2); }

  /* Chart cards: giảm padding */
  .chart-card { padding: var(--wx-space-3); }
  .chart-card__header { margin-bottom: var(--wx-space-3); }

  /* Pending table header: ẩn bớt cột */
  .ptable th, .ptable td { padding: var(--wx-space-2) var(--wx-space-3); font-size: var(--wx-fs-12); }
}
</style>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Member } from '@/configs/saas/members.config'
import type { Transaction } from '@/configs/saas/transactions.config'
import { membersConfig } from '@/configs/saas/members.config'
import { transactionsConfig } from '@/configs/saas/transactions.config'
import { productsConfig } from '@/configs/saas/products.config'

/* ── Dashboard KPI types ── */
export interface SaasKpi {
  label: string
  metric: number | string
  metricSuffix?: string
  delta: number
  deltaLabel?: string
  sparkline: number[]
  sparklineColor: string
  iconEmoji: string
  iconBg: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'cyan' | 'slate'
  detail?: string
  alert?: string
  alertLevel?: 'warning' | 'danger'
}

function gen(n: number, seed = 1, base = 50, amp = 20): number[] {
  return Array.from({ length: n }, (_, i) =>
    base + Math.sin(i / 3 + seed) * amp + Math.sin(i * seed * 1.7) * amp * 0.4,
  )
}

export const useSaasStore = defineStore('saas', () => {
  /* ── Loading ── */
  const loading = ref(true)
  setTimeout(() => { loading.value = false }, 700)

  /* ── Raw data (source of truth) ── */
  const allMembers     = ref<Member[]>(membersConfig.initialData() as Member[])
  const allTransactions = ref<Transaction[]>(transactionsConfig.initialData() as Transaction[])

  /* ── Derived counts ── */
  const memberCount       = computed(() => allMembers.value.length)
  const activeMembers     = computed(() => allMembers.value.filter(m => m['status'] === 'active').length)
  const pendingTxs        = computed(() => allTransactions.value.filter(t => t['txStatus'] === 'processing'))
  const pendingTxCount    = computed(() => pendingTxs.value.length)
  const productCount      = computed(() => productsConfig.initialData().length)

  /* ── Revenue simulation (not from real data) ── */
  const totalRevenue = ref(184_500_000)
  const revenueSparkline = ref(gen(8, 1, 120, 60).map(v => Math.round(v)))

  /* ── Alert: pending > threshold ── */
  const pendingAlert = computed(() =>
    pendingTxCount.value > 10
      ? `${pendingTxCount.value} giao dịch chờ xử lý`
      : undefined,
  )

  /* ── KPIs ── */
  const kpis = computed<SaasKpi[]>(() => [
    {
      label: 'Doanh thu tháng này',
      metric: totalRevenue.value,
      metricSuffix: 'đ',
      delta: 12.4,
      deltaLabel: 'vs tháng trước',
      sparkline: revenueSparkline.value,
      sparklineColor: '#2563eb',
      iconEmoji: '💰',
      iconBg: 'blue',
      detail: `${allTransactions.value.filter(t => t['txStatus'] === 'completed').length} giao dịch thành công`,
    },
    {
      label: 'Thành viên mới',
      metric: 348,
      delta: 8.2,
      deltaLabel: 'vs tháng trước',
      sparkline: gen(8, 2, 200, 80).map(v => Math.round(v)),
      sparklineColor: '#10b981',
      iconEmoji: '👥',
      iconBg: 'green',
      detail: `${memberCount.value} tổng thành viên`,
    },
    {
      label: 'Giao dịch chờ xử lý',
      metric: pendingTxCount.value,
      delta: -5.1,
      deltaLabel: 'vs hôm qua',
      sparkline: gen(8, 3, 35, 15).map(v => Math.round(v)),
      sparklineColor: '#f59e0b',
      iconEmoji: '⏳',
      iconBg: 'amber',
      detail: `${Math.ceil(pendingTxCount.value * 0.35)} giao dịch ưu tiên cao`,
      alert: pendingAlert.value,
      alertLevel: 'warning',
    },
    {
      label: 'Tăng trưởng ARR',
      metric: '42.8',
      metricSuffix: '%',
      delta: 3.6,
      deltaLabel: 'vs quý trước',
      sparkline: gen(8, 4, 35, 8).map(v => Math.round(v)),
      sparklineColor: '#8b5cf6',
      iconEmoji: '📈',
      iconBg: 'purple',
      detail: 'ARR: 2.21 tỷ đồng',
    },
  ])

  /* ── Pending transactions for dashboard table ── */
  const dashboardPendingTxs = computed(() => pendingTxs.value.slice(0, 8))

  /* ── Alert banner (dismissible) ── */
  const alertDismissed = ref(false)
  const showAlert = computed(() => !alertDismissed.value && pendingTxCount.value > 0)
  function dismissAlert() { alertDismissed.value = true }

  /* ── Confirm a transaction ── */
  async function confirmTransaction(id: number) {
    const tx = allTransactions.value.find(t => t['id'] === id)
    if (!tx) return
    ;(tx as Record<string, unknown>)['txStatus'] = 'completed'
  }

  return {
    loading,
    allMembers,
    allTransactions,
    memberCount,
    activeMembers,
    pendingTxs,
    pendingTxCount,
    productCount,
    totalRevenue,
    kpis,
    dashboardPendingTxs,
    showAlert,
    alertDismissed,
    dismissAlert,
    confirmTransaction,
  }
})

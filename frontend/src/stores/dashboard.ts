import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ToastType } from '@/composables/useToast'

/* ── Types ─────────────────────────────────────────────────── */
export type EnvStatus = 'ok' | 'degraded' | 'down'
export type AlertLevel = 'info' | 'warning' | 'danger'

export interface EnvService {
  label: string
  status: EnvStatus
}

export interface DashboardAlert {
  id: number
  text: string
  level: AlertLevel
}

export interface KpiData {
  label: string
  metric: string | number
  metricSuffix?: string
  delta?: number
  deltaLabel?: string
  sparkline?: number[]
  sparklineColor?: string
  iconEmoji?: string
  iconBg?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'cyan' | 'slate'
  detail?: string
  alert?: string
  alertLevel?: 'warning' | 'danger'
  routeTo?: string | Record<string, unknown>
  onAction?: () => void
}

export interface SysError {
  id: number
  msg: string
  time: string
  level: 'critical' | 'warning'
  resolving: boolean
}

export interface FailedJob {
  id: number
  name: string
  error: string
  retries: number
  time: string
  retrying: boolean
}

export interface ExpiringAccount {
  id: number
  name: string
  phone: string
  platform: string
  expiresIn: string
  status: string
  actioning: boolean
}

export interface PendingTicket {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  created: string
  assigning: boolean
}

/* ── Helpers ────────────────────────────────────────────────── */
function gen(n: number, seed = 1, base = 50, amp = 20) {
  return Array.from({ length: n }, (_, i) =>
    base + Math.sin(i / 3 + seed) * amp + Math.sin(i * seed * 1.7) * amp * 0.4,
  )
}

/* ── Store ──────────────────────────────────────────────────── */
export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(true)
  setTimeout(() => { loading.value = false }, 900)

  /* env */
  const envServices = ref<EnvService[]>([
    { label: 'API',   status: 'ok' },
    { label: 'DB',    status: 'ok' },
    { label: 'Queue', status: 'degraded' },
    { label: 'CDN',   status: 'ok' },
  ])

  /* alerts */
  const alerts = ref<DashboardAlert[]>([
    { id: 1, text: '2 tài khoản checkpoint cần xác minh ngay', level: 'danger' },
    { id: 2, text: '8 lỗi hệ thống trong 24h qua — xem chi tiết', level: 'warning' },
  ])
  const dismissedAlerts = ref<Set<number>>(new Set())
  const activeAlerts = computed(() => alerts.value.filter(a => !dismissedAlerts.value.has(a.id)))
  function dismissAlert(id: number) { dismissedAlerts.value.add(id) }

  /* kpis */
  const kpis = ref<KpiData[]>([
    {
      label: 'Tài khoản Live', metric: 1284, delta: 12,
      iconEmoji: '📱', iconBg: 'green',
      sparkline: gen(20, 1, 60, 25), sparklineColor: '#22c55e',
      detail: '47 đang checkpoint',
      routeTo: '/wemakeui/accounts',
    },
    {
      label: 'Phiên hôm nay', metric: 4821, delta: 8,
      iconEmoji: '🔗', iconBg: 'blue',
      sparkline: gen(20, 2, 55, 20), sparklineColor: '#2563eb',
      alert: '3 lỗi kết nối', alertLevel: 'warning',
      routeTo: '/wemakeui/sessions',
    },
    {
      label: 'Chiến dịch', metric: 24, delta: 2,
      iconEmoji: '📣', iconBg: 'purple',
      sparkline: gen(20, 3, 45, 15), sparklineColor: '#8b5cf6',
      detail: '5 sắp hoàn thành',
      routeTo: '/wemakeui/campaigns',
    },
    {
      label: 'Tỷ lệ giao thành công', metric: '98.4', metricSuffix: '%', delta: -0.2,
      iconEmoji: '✅', iconBg: 'amber',
      sparkline: gen(20, 4, 90, 8), sparklineColor: '#f59e0b',
      alert: 'Kiểm tra ngay', alertLevel: 'danger',
      routeTo: '/wemakeui/sessions',
    },
    {
      label: 'Tin nhắn hôm nay', metric: 142390, delta: 18,
      iconEmoji: '💬', iconBg: 'cyan',
      sparkline: gen(20, 5, 70, 30), sparklineColor: '#06b6d4',
      routeTo: '/wemakeui/campaigns',
    },
    {
      label: 'Lỗi hệ thống', metric: 8, delta: 3,
      iconEmoji: '🚨', iconBg: 'red',
      sparkline: gen(20, 6, 30, 25), sparklineColor: '#ef4444',
      alert: '2 cần xử lý gấp', alertLevel: 'danger',
    },
    {
      label: 'Task hàng đợi', metric: 12, delta: -4,
      iconEmoji: '⏳', iconBg: 'amber',
      sparkline: gen(20, 7, 40, 18), sparklineColor: '#f59e0b',
      detail: '3 đang chạy',
      routeTo: '/wemakeui/scheduler',
    },
    {
      label: 'Uptime tháng này', metric: '99.8', metricSuffix: '%', delta: 0,
      iconEmoji: '🟢', iconBg: 'slate',
      sparkline: gen(20, 8, 92, 5), sparklineColor: '#64748b',
      detail: 'SLA đạt yêu cầu',
    },
  ])

  /* system errors */
  const sysErrors = ref<SysError[]>([
    { id: 1, msg: 'Kết nối server backup mất — failover đang chạy', time: '09:30', level: 'critical', resolving: false },
    { id: 2, msg: 'Session pool đạt 95% capacity',                  time: '10:05', level: 'warning',  resolving: false },
    { id: 3, msg: 'Plugin AutoReply timeout 3 lần liên tiếp',       time: '10:18', level: 'warning',  resolving: false },
    { id: 4, msg: 'CDN endpoint /media/upload trả về 503',          time: '10:41', level: 'critical', resolving: false },
    { id: 5, msg: 'Zalo webhook delivery lag > 5s',                 time: '10:55', level: 'warning',  resolving: false },
    { id: 6, msg: 'Scheduler task #44 failed sau 3 retry',          time: '11:02', level: 'warning',  resolving: false },
    { id: 7, msg: 'Auth token expired cho 4 tài khoản Telegram',    time: '11:10', level: 'warning',  resolving: false },
    { id: 8, msg: 'Database connection pool chạm limit 100/100',    time: '11:15', level: 'critical', resolving: false },
  ])

  async function resolveError(id: number, showToast: (type: ToastType, msg: string) => void) {
    const err = sysErrors.value.find(e => e.id === id)
    if (!err) return
    err.resolving = true
    await new Promise(r => setTimeout(r, 1200))
    const msg = err.msg
    sysErrors.value = sysErrors.value.filter(e => e.id !== id)
    showToast('success', `Đã xử lý: ${msg.slice(0, 50)}…`)
  }

  /* failed jobs */
  const failedJobs = ref<FailedJob[]>([
    { id: 1, name: 'send_bulk_whatsapp',   error: 'Connection timeout',        time: '11:15', retries: 3, retrying: false },
    { id: 2, name: 'sync_contacts_vnpt',   error: 'API rate limit exceeded',   time: '10:58', retries: 2, retrying: false },
    { id: 3, name: 'export_report_weekly', error: 'Out of memory',             time: '10:30', retries: 1, retrying: false },
    { id: 4, name: 'webhook_zalo_deliver', error: 'Invalid signature',         time: '10:05', retries: 3, retrying: false },
    { id: 5, name: 'auto_checkpoint_verify', error: 'Session expired during run', time: '09:42', retries: 2, retrying: false },
  ])

  async function retryJob(id: number, showToast: (type: ToastType, msg: string) => void) {
    const job = failedJobs.value.find(j => j.id === id)
    if (!job) return
    job.retrying = true
    await new Promise(r => setTimeout(r, 1400))
    job.retrying = false
    const ok = Math.random() > 0.3
    if (ok) {
      failedJobs.value = failedJobs.value.filter(j => j.id !== id)
      showToast('success', `Job "${job.name}" đã khởi động lại thành công`)
    } else {
      showToast('error', `Job "${job.name}" vẫn thất bại — kiểm tra logs`)
    }
  }

  /* expiring accounts */
  const expiringAccounts = ref<ExpiringAccount[]>([
    { id: 1, name: '@banh.mi.vn',       phone: '+84912345678', platform: 'WhatsApp', expiresIn: '2 giờ',   status: 'checkpoint', actioning: false },
    { id: 2, name: '@vinshop_hcm',      phone: '+84987654321', platform: 'WhatsApp', expiresIn: '4 giờ',   status: 'checkpoint', actioning: false },
    { id: 3, name: '@tiki_support',     phone: '+84901234567', platform: 'Zalo',     expiresIn: '6 giờ',   status: 'expiring',   actioning: false },
    { id: 4, name: '@lazada_vn_bot',    phone: '+84956789012', platform: 'WhatsApp', expiresIn: '1 ngày',  status: 'expiring',   actioning: false },
    { id: 5, name: '@shopee_chat_auto', phone: '+84923456789', platform: 'WhatsApp', expiresIn: '1 ngày',  status: 'checkpoint', actioning: false },
    { id: 6, name: '@vnpt_cs_zalo',     phone: '+84934567890', platform: 'Zalo',     expiresIn: '2 ngày',  status: 'expiring',   actioning: false },
  ])

  async function renewAccount(id: number, showToast: (type: ToastType, msg: string) => void) {
    const acc = expiringAccounts.value.find(a => a.id === id)
    if (!acc) return
    acc.actioning = true
    await new Promise(r => setTimeout(r, 1200))
    acc.actioning = false
    showToast('success', `Đã gia hạn tài khoản ${acc.name}`)
    expiringAccounts.value = expiringAccounts.value.filter(a => a.id !== id)
  }

  /* pending tickets */
  const pendingTickets = ref<PendingTicket[]>([
    { id: 101, title: 'Checkpoint tài khoản @viettel_care không giải quyết được',  priority: 'high',   created: '30 phút trước', assigning: false },
    { id: 102, title: 'Zalo OA bị khoá không gửi được ZNS',                        priority: 'high',   created: '1 giờ trước',   assigning: false },
    { id: 103, title: 'Chiến dịch SMS bị nhà mạng chặn từ khoá',                   priority: 'medium', created: '2 giờ trước',   assigning: false },
    { id: 104, title: 'API Telegram bot trả về 429 liên tục',                       priority: 'medium', created: '3 giờ trước',   assigning: false },
    { id: 105, title: 'Báo cáo tuần xuất thiếu dữ liệu tài khoản die',             priority: 'low',    created: '5 giờ trước',   assigning: false },
  ])

  async function assignTicket(id: number, showToast: (type: ToastType, msg: string) => void) {
    const ticket = pendingTickets.value.find(t => t.id === id)
    if (!ticket) return
    ticket.assigning = true
    await new Promise(r => setTimeout(r, 800))
    ticket.assigning = false
    showToast('info', `Ticket #${ticket.id} đã được gán cho bạn`)
    pendingTickets.value = pendingTickets.value.filter(t => t.id !== id)
  }

  return {
    loading,
    envServices,
    alerts,
    activeAlerts,
    dismissAlert,
    kpis,
    sysErrors,
    resolveError,
    failedJobs,
    retryJob,
    expiringAccounts,
    renewAccount,
    pendingTickets,
    assignTicket,
  }
})

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import DashboardKPICard from '@/archetypes/dashboard/DashboardKPICard.vue'
import { LineChart, BarChart, PieChart } from '@/components/charts'
import type { LineSeries } from '@/components/charts/LineChart.vue'
import type { PieSlice } from '@/components/charts/PieChart.vue'
import { Timeline } from '@/components/data'
import type { TimelineItem } from '@/components/data/Timeline.vue'
import { BaseButton, BaseBadge, BaseCard, BaseDrawer, BaseInput, BaseSelectMenu, BaseTextarea, BaseTabs, FormModal, BaseToast } from '@/components/common'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

/* ── Widget loading simulation ─────────────────────────── */
const widgetReady = ref(false)
onMounted(() => { setTimeout(() => { widgetReady.value = true }, 900) })

/* ── Seeded sparklines ────────────────────────────────────── */
function gen(n: number, seed = 1, base = 50, amp = 20) {
  return Array.from({ length: n }, (_, i) =>
    base + Math.sin(i / 3 + seed) * amp + (Math.sin(i * seed * 1.7) * amp * 0.4)
  )
}

/* ── Alert banner ─────────────────────────────────────────── */
const alertDismissed = ref(false)
const ALERTS = [
  { id: 1, text: '2 tài khoản checkpoint cần xác minh ngay', level: 'danger' as const },
  { id: 2, text: '8 lỗi hệ thống trong 24h qua — xem chi tiết', level: 'warning' as const },
]
const activeAlerts = computed(() => alertDismissed.value ? [] : ALERTS)

/* ── KPI data ─────────────────────────────────────────────── */
const KPIS = [
  {
    label: 'Tài khoản Live', metric: 1284, delta: 12,
    iconEmoji: '📱', iconBg: 'green' as const,
    sparkline: gen(20, 1, 60, 25), sparklineColor: '#22c55e',
    detail: '47 đang checkpoint',
    action: () => router.push('/wemakeui/accounts'),
  },
  {
    label: 'Phiên hôm nay', metric: 4821, delta: 8,
    iconEmoji: '🔗', iconBg: 'blue' as const,
    sparkline: gen(20, 2, 55, 20), sparklineColor: '#2563eb',
    alert: '3 lỗi kết nối', alertLevel: 'warning' as const,
    action: () => router.push({ path: '/wemakeui/sessions', query: { status: 'online' } }),
  },
  {
    label: 'Chiến dịch', metric: 24, delta: 2,
    iconEmoji: '📣', iconBg: 'purple' as const,
    sparkline: gen(20, 3, 45, 15), sparklineColor: '#8b5cf6',
    detail: '5 sắp hoàn thành',
    action: () => router.push({ path: '/wemakeui/campaigns', query: { status: 'running' } }),
  },
  {
    label: 'Tỷ lệ giao thành công', metric: '98.4', metricSuffix: '%', delta: -0.2,
    iconEmoji: '✅', iconBg: 'amber' as const,
    sparkline: gen(20, 4, 90, 8), sparklineColor: '#f59e0b',
    alert: 'Kiểm tra ngay', alertLevel: 'danger' as const,
    action: () => router.push('/wemakeui/sessions'),
  },
  {
    label: 'Tin nhắn hôm nay', metric: 142390, delta: 18,
    iconEmoji: '💬', iconBg: 'cyan' as const,
    sparkline: gen(20, 5, 70, 30), sparklineColor: '#06b6d4',
    action: () => router.push('/wemakeui/campaigns'),
  },
  {
    label: 'Lỗi hệ thống', metric: 8, delta: 3,
    iconEmoji: '🚨', iconBg: 'red' as const,
    sparkline: gen(20, 6, 30, 25), sparklineColor: '#ef4444',
    alert: '2 cần xử lý gấp', alertLevel: 'danger' as const,
    action: () => { errorsDrawer.value = true },
  },
  {
    label: 'Task hàng đợi', metric: 12, delta: -4,
    iconEmoji: '⏳', iconBg: 'amber' as const,
    sparkline: gen(20, 7, 40, 18), sparklineColor: '#f59e0b',
    detail: '3 đang chạy',
    action: () => router.push('/wemakeui/scheduler'),
  },
  {
    label: 'Uptime tháng này', metric: '99.8', metricSuffix: '%', delta: 0,
    iconEmoji: '🟢', iconBg: 'slate' as const,
    sparkline: gen(20, 8, 92, 5), sparklineColor: '#64748b',
    detail: 'SLA đạt yêu cầu',
    action: undefined,
  },
]

/* ── Errors drawer ────────────────────────────────────────── */
const errorsDrawer = ref(false)
interface SysError { id: number; msg: string; time: string; level: 'critical' | 'warning'; resolving: boolean }
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

async function resolveError(err: SysError) {
  err.resolving = true
  await new Promise(r => setTimeout(r, 1200))
  sysErrors.value = sysErrors.value.filter(e => e.id !== err.id)
  showToast('success', `Đã xử lý: ${err.msg.slice(0, 50)}…`)
}

/* ── Chart: Line ──────────────────────────────────────────── */
const LINE_SERIES: LineSeries[] = [
  {
    name: 'Phiên kết nối',
    color: '#2563eb',
    data: [
      { x: 'T2', y: 3800 }, { x: 'T3', y: 4200 }, { x: 'T4', y: 3950 },
      { x: 'T5', y: 4650 }, { x: 'T6', y: 4100 }, { x: 'T7', y: 3300 },
      { x: 'CN', y: 4821 },
    ],
  },
  {
    name: 'Tin nhắn (÷100)',
    color: '#06b6d4',
    data: [
      { x: 'T2', y: 1180 }, { x: 'T3', y: 1340 }, { x: 'T4', y: 1210 },
      { x: 'T5', y: 1560 }, { x: 'T6', y: 1420 }, { x: 'T7', y: 980 },
      { x: 'CN', y: 1424 },
    ],
  },
]

/* ── Chart: Donut + drill-down ────────────────────────────── */
const PIE_DATA: PieSlice[] = [
  { label: 'Live',       value: 1284, color: '#22c55e' },
  { label: 'Die',        value: 891,  color: '#ef4444' },
  { label: 'Checkpoint', value: 226,  color: '#f59e0b' },
]
const activeAccountFilter = ref<string | null>(null)

function onDonutClick(slice: PieSlice) {
  const key = slice.label.toLowerCase()
  activeAccountFilter.value = activeAccountFilter.value === key ? null : key
  activeTab.value = 'expiring'
}

/* ── Chart: Bar + drill-down ──────────────────────────────── */
const BAR_DATA = [
  { label: 'WhatsApp', value: 14, color: '#25d366' },
  { label: 'Zalo',     value: 6,  color: '#0068ff' },
  { label: 'Telegram', value: 3,  color: '#229ed9' },
  { label: 'SMS',      value: 1,  color: '#8b5cf6' },
]

const platformDrawer = ref(false)
const selectedPlatform = ref<string | null>(null)

function onBarClick(item: { label: string; value: number }) {
  selectedPlatform.value = item.label
  platformDrawer.value = true
}

interface PlatformCampaign { id: number; name: string; status: string; sent: number; delivered: number }
const PLATFORM_CAMPAIGNS: Record<string, PlatformCampaign[]> = {
  WhatsApp: [
    { id: 1, name: 'Khuyến mãi 5/5',         status: 'running',   sent: 4200,  delivered: 4100 },
    { id: 2, name: 'Chào hàng mới',           status: 'running',   sent: 1800,  delivered: 1740 },
    { id: 3, name: 'Flash sale cuối tuần',    status: 'scheduled', sent: 0,     delivered: 0 },
    { id: 4, name: 'Re-engagement 30 ngày',   status: 'running',   sent: 890,   delivered: 867 },
    { id: 5, name: 'Reminder đơn hàng',       status: 'paused',    sent: 2100,  delivered: 2050 },
  ],
  Zalo: [
    { id: 6, name: 'ZNS Xác nhận đơn',       status: 'running',   sent: 3400,  delivered: 3380 },
    { id: 7, name: 'ZNS Giao hàng',           status: 'running',   sent: 1200,  delivered: 1195 },
    { id: 8, name: 'Promo tháng 5',           status: 'scheduled', sent: 0,     delivered: 0 },
  ],
  Telegram: [
    { id: 9, name: 'Bot thông báo nội bộ',   status: 'running',   sent: 560,   delivered: 558 },
    { id: 10, name: 'Alert hệ thống',         status: 'running',   sent: 210,   delivered: 210 },
    { id: 11, name: 'Newsletter tuần',        status: 'paused',    sent: 340,   delivered: 330 },
  ],
  SMS: [
    { id: 12, name: 'OTP Backup',             status: 'running',   sent: 4800,  delivered: 4795 },
  ],
}

const platformCampaigns = computed(() =>
  selectedPlatform.value ? (PLATFORM_CAMPAIGNS[selectedPlatform.value] ?? []) : []
)

function navigateToPlatformCampaigns() {
  router.push({ path: '/wemakeui/campaigns', query: { platform: selectedPlatform.value ?? '' } })
  platformDrawer.value = false
}

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'neutral'> = {
  running: 'success', scheduled: 'warning', paused: 'neutral',
}
const STATUS_LABEL: Record<string, string> = {
  running: 'Đang chạy', scheduled: 'Lên lịch', paused: 'Tạm dừng',
}

/* ── Actionable tables ────────────────────────────────────── */
const activeTab = ref<'jobs' | 'expiring' | 'pending'>('jobs')

interface FailedJob { id: number; name: string; error: string; time: string; retries: number; retrying: boolean }
const failedJobs = ref<FailedJob[]>([
  { id: 1, name: 'send_bulk_whatsapp',     error: 'Connection timeout',          time: '11:15', retries: 3, retrying: false },
  { id: 2, name: 'sync_contacts_vnpt',     error: 'API rate limit exceeded',     time: '10:58', retries: 2, retrying: false },
  { id: 3, name: 'export_report_weekly',   error: 'Out of memory',               time: '10:30', retries: 1, retrying: false },
  { id: 4, name: 'webhook_zalo_deliver',   error: 'Invalid signature',           time: '10:05', retries: 3, retrying: false },
  { id: 5, name: 'auto_checkpoint_verify', error: 'Session expired during run',  time: '09:42', retries: 2, retrying: false },
])

async function retryJob(job: FailedJob) {
  job.retrying = true
  await new Promise(r => setTimeout(r, 1400))
  job.retrying = false
  const ok = Math.random() > 0.3
  if (ok) {
    failedJobs.value = failedJobs.value.filter(j => j.id !== job.id)
    showToast('success', `Job "${job.name}" đã khởi động lại thành công`)
  } else {
    showToast('error', `Job "${job.name}" vẫn thất bại — kiểm tra logs`)
  }
}

interface ExpiringAccount { id: number; name: string; phone: string; platform: string; expiresIn: string; status: string; actioning: boolean }
const expiringAccounts = ref<ExpiringAccount[]>([
  { id: 1, name: '@banh.mi.vn',       phone: '+84912345678', platform: 'WhatsApp', expiresIn: '2 giờ',   status: 'checkpoint', actioning: false },
  { id: 2, name: '@vinshop_hcm',      phone: '+84987654321', platform: 'WhatsApp', expiresIn: '4 giờ',   status: 'checkpoint', actioning: false },
  { id: 3, name: '@tiki_support',     phone: '+84901234567', platform: 'Zalo',     expiresIn: '6 giờ',   status: 'expiring',   actioning: false },
  { id: 4, name: '@lazada_vn_bot',    phone: '+84956789012', platform: 'WhatsApp', expiresIn: '1 ngày',  status: 'expiring',   actioning: false },
  { id: 5, name: '@shopee_chat_auto', phone: '+84923456789', platform: 'WhatsApp', expiresIn: '1 ngày',  status: 'checkpoint', actioning: false },
  { id: 6, name: '@vnpt_cs_zalo',     phone: '+84934567890', platform: 'Zalo',     expiresIn: '2 ngày',  status: 'expiring',   actioning: false },
])

const filteredAccounts = computed(() => {
  if (!activeAccountFilter.value) return expiringAccounts.value
  return expiringAccounts.value.filter(a => a.status === activeAccountFilter.value)
})

async function renewAccount(acc: ExpiringAccount) {
  acc.actioning = true
  await new Promise(r => setTimeout(r, 1200))
  acc.actioning = false
  showToast('success', `Đã gia hạn tài khoản ${acc.name}`)
  expiringAccounts.value = expiringAccounts.value.filter(a => a.id !== acc.id)
}

interface PendingTicket { id: number; title: string; priority: 'high' | 'medium' | 'low'; created: string; assigning: boolean }
const pendingTickets = ref<PendingTicket[]>([
  { id: 101, title: 'Checkpoint tài khoản @viettel_care không giải quyết được',  priority: 'high',   created: '30 phút trước', assigning: false },
  { id: 102, title: 'Zalo OA bị khoá không gửi được ZNS',                        priority: 'high',   created: '1 giờ trước',   assigning: false },
  { id: 103, title: 'Chiến dịch SMS bị nhà mạng chặn từ khoá',                  priority: 'medium', created: '2 giờ trước',   assigning: false },
  { id: 104, title: 'API Telegram bot trả về 429 liên tục',                      priority: 'medium', created: '3 giờ trước',   assigning: false },
  { id: 105, title: 'Báo cáo tuần xuất thiếu dữ liệu tài khoản die',            priority: 'low',    created: '5 giờ trước',   assigning: false },
])

async function assignTicket(ticket: PendingTicket) {
  ticket.assigning = true
  await new Promise(r => setTimeout(r, 1000))
  ticket.assigning = false
  showToast('info', `Ticket #${ticket.id} đã được gán cho bạn`)
  pendingTickets.value = pendingTickets.value.filter(t => t.id !== ticket.id)
}

const PRIORITY_BADGE: Record<string, 'danger' | 'warning' | 'neutral'> = {
  high: 'danger', medium: 'warning', low: 'neutral',
}
const PRIORITY_LABEL: Record<string, string> = {
  high: 'Cao', medium: 'Trung bình', low: 'Thấp',
}

/* ── Action tab items ─────────────────────────────────────── */
const actionTabItems = computed(() => [
  { key: 'jobs',     label: `Failed Jobs (${failedJobs.value.length})` },
  { key: 'expiring', label: `Tài khoản hết hạn (${filteredAccounts.value.length})` },
  { key: 'pending',  label: `Tickets chờ (${pendingTickets.value.length})` },
])

/* ── Select options ───────────────────────────────────────── */
const PLATFORM_OPTS = [
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Zalo',     label: 'Zalo' },
  { value: 'Telegram', label: 'Telegram' },
  { value: 'SMS',      label: 'SMS' },
]
const CAMPAIGN_TYPE_OPTS = [
  { value: 'broadcast',     label: 'Broadcast' },
  { value: 'autoresponder', label: 'Autoresponder' },
  { value: 'sequence',      label: 'Sequence' },
]
const PLATFORM_OPTS_NO_SMS = PLATFORM_OPTS.filter(o => o.value !== 'SMS')

/* ── Quick action modals ──────────────────────────────────── */
const campaignModal = ref(false)
const campaignLoading = ref(false)
const campaignForm = ref({ name: '', platform: 'WhatsApp', type: 'broadcast', message: '' })

async function submitCampaign() {
  if (!campaignForm.value.name.trim()) {
    showToast('error', 'Vui lòng nhập tên chiến dịch')
    return
  }
  campaignLoading.value = true
  await new Promise(r => setTimeout(r, 1400))
  campaignLoading.value = false
  campaignModal.value = false
  showToast('success', `Chiến dịch "${campaignForm.value.name}" đã được tạo`)
  campaignForm.value = { name: '', platform: 'WhatsApp', type: 'broadcast', message: '' }
}

const accountModal = ref(false)
const accountLoading = ref(false)
const accountForm = ref({ phone: '', name: '', platform: 'WhatsApp', group: '', note: '' })

async function submitAccount() {
  if (!accountForm.value.phone.trim()) {
    showToast('error', 'Vui lòng nhập số điện thoại')
    return
  }
  accountLoading.value = true
  await new Promise(r => setTimeout(r, 1200))
  accountLoading.value = false
  accountModal.value = false
  showToast('success', `Tài khoản ${accountForm.value.phone} đã được thêm`)
  accountForm.value = { phone: '', name: '', platform: 'WhatsApp', group: '', note: '' }
}

/* ── Activity timeline ────────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10)
const TIMELINE: TimelineItem[] = [
  { id: 1, ts: `${today}T10:42:00`, title: 'Chiến dịch "Khuyến mãi 5/5" bắt đầu',        icon: '📣', variant: 'info' },
  { id: 2, ts: `${today}T10:15:00`, title: 'Tài khoản @batcong.vn kết nối QR mới',        icon: '📱', variant: 'success' },
  { id: 3, ts: `${today}T09:58:00`, title: 'Plugin ChatGPT v2.1 cập nhật thành công',     icon: '🔌', variant: 'success' },
  { id: 4, ts: `${today}T09:30:00`, title: 'Lỗi kết nối server backup — đã recover',      icon: '🚨', variant: 'danger' },
  { id: 5, ts: `${today}T09:10:00`, title: '47 tài khoản vào trạng thái checkpoint',      icon: '⚠️', variant: 'warning' },
  { id: 6, ts: `${today}T08:45:00`, title: '3 phiên mới từ Hà Nội (Viettel)',              icon: '🔗', variant: 'default' },
  { id: 7, ts: `${today}T08:20:00`, title: 'Báo cáo tuần tự động xuất thành công',        icon: '📊', variant: 'info' },
  { id: 8, ts: `${today}T07:55:00`, title: 'Scheduler chạy task queue 12 jobs',           icon: '⏳', variant: 'default' },
]

/* ── Realtime indicators ──────────────────────────────────── */
const ENV_STATUS = [
  { label: 'API', ok: true },
  { label: 'DB',  ok: true },
  { label: 'Queue', ok: true },
  { label: 'CDN', ok: false },
]
</script>

<template>
  <AppPageLayout section="dashboards"
    current="wedashboard-v1"
    page-title="WemakeUI Dashboard"
    page-description="Tổng quan trạng thái và hoạt động hệ thống WhatsApp automation"
  >
    <!-- ── Toast ─────────────────────────────────────────────── -->
    <BaseToast />

    <!-- ── Top area ─────────────────────────────────────────── -->
    <div class="dash-top">
      <div class="dash-greeting">
        <div class="greeting-text">
          <h2 class="greeting-title">Chào buổi sáng 👋</h2>
          <p class="greeting-sub">{{ new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
        </div>
        <div class="env-status">
          <span
            v-for="s in ENV_STATUS" :key="s.label"
            class="env-dot"
            :class="s.ok ? 'env-dot--ok' : 'env-dot--err'"
            :title="s.label + ': ' + (s.ok ? 'OK' : 'DOWN')"
          >
            <span class="env-dot__pulse" />
            {{ s.label }}
          </span>
        </div>
      </div>

      <div class="dash-actions">
        <BaseButton size="sm" variant="ghost" @click="router.push('/wemakeui/scheduler')">
          ⏳ Scheduler
        </BaseButton>
        <BaseButton size="sm" variant="ghost" @click="router.push('/wemakeui/console')">
          🖥 Console
        </BaseButton>
        <BaseButton size="sm" variant="ghost" @click="campaignModal = true">
          📣 Tạo chiến dịch
        </BaseButton>
        <BaseButton size="sm" variant="primary" @click="accountModal = true">
          + Thêm tài khoản
        </BaseButton>
      </div>
    </div>

    <!-- ── Alert banner ──────────────────────────────────────── -->
    <Transition name="alert-slide">
      <div v-if="activeAlerts.length" class="alert-banner">
        <div class="alert-items">
          <div
            v-for="a in activeAlerts" :key="a.id"
            class="alert-item" :class="`alert-item--${a.level}`"
          >
            <span class="alert-icon">{{ a.level === 'danger' ? '🔴' : '⚠️' }}</span>
            {{ a.text }}
            <BaseButton v-if="a.level === 'danger'" variant="ghost" size="sm" style="color: inherit; padding: 0 4px" @click="errorsDrawer = true">
              Xem ngay →
            </BaseButton>
          </div>
        </div>
        <BaseButton variant="ghost" size="sm" @click="alertDismissed = true" aria-label="Đóng">✕</BaseButton>
      </div>
    </Transition>

    <!-- ── KPI Grid ───────────────────────────────────────────── -->
    <div class="kpi-grid" v-reveal>
      <template v-if="!widgetReady">
        <DashboardKPICard
          v-for="i in 8" :key="i"
          label="Loading" :loading="true"
        />
      </template>
      <template v-else>
        <DashboardKPICard
          v-for="(kpi, i) in KPIS" :key="kpi.label"
          v-bind="kpi"
          :style="{ '--stagger': i }"
          class="kpi-enter"
          @click="kpi.action?.()"
        />
      </template>
    </div>

    <!-- ── Analytics section ─────────────────────────────────── -->
    <div class="analytics-grid" v-reveal>
      <BaseCard shadow="sm" hover-effect="glow">
        <div class="section-header">
          <h3 class="section-title">Xu hướng 7 ngày</h3>
          <BaseBadge text="Live" variant="success" dot />
        </div>
        <LineChart :series="LINE_SERIES" :height="220" :show-grid="true" :show-legend="true" :smooth="true" />
      </BaseCard>

      <BaseCard shadow="sm" hover-effect="glow">
        <div class="section-header">
          <h3 class="section-title">Trạng thái tài khoản</h3>
          <BaseButton v-if="activeAccountFilter" variant="ghost" size="sm" @click="activeAccountFilter = null">
            ✕ Bỏ lọc
          </BaseButton>
        </div>
        <p class="chart-hint">Click vào segment để lọc bảng bên dưới</p>
        <div class="donut-wrap">
          <PieChart
            :data="PIE_DATA" :size="200"
            :donut="true" :donut-width="38"
            :show-legend="true"
            center-label="Tổng"
            :center-value="(1284 + 891 + 226).toLocaleString('vi-VN')"
            @click-slice="onDonutClick"
          />
        </div>
        <div v-if="activeAccountFilter" class="filter-tag">
          Đang lọc: <strong>{{ activeAccountFilter }}</strong>
        </div>
      </BaseCard>
    </div>

    <!-- ── Bottom: Bar chart + Timeline ──────────────────────── -->
    <div class="bottom-grid" v-reveal>
      <BaseCard shadow="sm" hover-effect="glow">
        <div class="section-header">
          <h3 class="section-title">Chiến dịch theo nền tảng</h3>
          <span class="section-badge">24 đang chạy</span>
        </div>
        <p class="chart-hint">Click vào cột để xem chiến dịch theo nền tảng</p>
        <BarChart
          :data="BAR_DATA" :height="200"
          :show-grid="true" :show-legend="false"
          @click-bar="onBarClick"
        />
      </BaseCard>

      <BaseCard shadow="sm" hover-effect="glow">
        <div class="section-header">
          <h3 class="section-title">Hoạt động hệ thống</h3>
          <BaseButton size="sm" variant="ghost" @click="router.push('/wemakeui/console')">
            Xem tất cả
          </BaseButton>
        </div>
        <div class="timeline-wrap">
          <Timeline :items="TIMELINE" :group-by-day="false" />
        </div>
      </BaseCard>
    </div>

    <!-- ── Actionable tables ──────────────────────────────────── -->
    <BaseCard shadow="sm" style="margin-bottom: var(--wx-space-6)">
      <div class="section-header">
        <h3 class="section-title">Cần xử lý ngay</h3>
        <BaseTabs v-model="activeTab" :tabs="actionTabItems" />
      </div>

      <!-- Failed jobs -->
      <div v-if="activeTab === 'jobs'" class="act-table-wrap">
        <div v-if="!failedJobs.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Không có job thất bại — hệ thống ổn định</span>
        </div>
        <table v-else class="act-table">
          <thead>
            <tr>
              <th>Job</th><th>Lỗi</th><th>Thời gian</th><th>Retry</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in failedJobs" :key="job.id">
              <td><code class="job-name">{{ job.name }}</code></td>
              <td class="err-msg">{{ job.error }}</td>
              <td class="cell-muted">{{ job.time }}</td>
              <td><span class="retry-badge">{{ job.retries }}×</span></td>
              <td class="cell-action">
                <BaseButton
                  size="sm" variant="ghost"
                  :loading="job.retrying"
                  :disabled="job.retrying"
                  @click="retryJob(job)"
                >↻ Retry</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Expiring accounts -->
      <div v-else-if="activeTab === 'expiring'" class="act-table-wrap">
        <div v-if="activeAccountFilter" class="filter-notice">
          <span>Đang lọc theo: <strong>{{ activeAccountFilter }}</strong></span>
          <BaseButton variant="ghost" size="sm" @click="activeAccountFilter = null">✕ Bỏ lọc</BaseButton>
        </div>
        <div v-if="!filteredAccounts.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Không có tài khoản cần gia hạn trong filter này</span>
        </div>
        <table v-else class="act-table">
          <thead>
            <tr>
              <th>Tài khoản</th><th>Nền tảng</th><th>Hết hạn trong</th><th>Trạng thái</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acc in filteredAccounts" :key="acc.id">
              <td>
                <div class="acc-cell">
                  <span class="acc-name">{{ acc.name }}</span>
                  <span class="acc-phone">{{ acc.phone }}</span>
                </div>
              </td>
              <td class="cell-muted">{{ acc.platform }}</td>
              <td class="cell-warn">{{ acc.expiresIn }}</td>
              <td>
                <BaseBadge
                  :text="acc.status === 'checkpoint' ? 'Checkpoint' : 'Sắp hết hạn'"
                  :variant="acc.status === 'checkpoint' ? 'warning' : 'neutral'"
                  dot
                />
              </td>
              <td class="cell-action">
                <BaseButton
                  size="sm" variant="ghost"
                  :loading="acc.actioning"
                  :disabled="acc.actioning"
                  @click="renewAccount(acc)"
                >Gia hạn</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pending tickets -->
      <div v-else class="act-table-wrap">
        <div v-if="!pendingTickets.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Không có ticket nào đang chờ xử lý</span>
        </div>
        <table v-else class="act-table">
          <thead>
            <tr>
              <th>ID</th><th>Vấn đề</th><th>Độ ưu tiên</th><th>Thời gian</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in pendingTickets" :key="ticket.id">
              <td class="cell-muted">#{{ ticket.id }}</td>
              <td class="ticket-title">{{ ticket.title }}</td>
              <td>
                <BaseBadge
                  :text="PRIORITY_LABEL[ticket.priority]"
                  :variant="PRIORITY_BADGE[ticket.priority]"
                />
              </td>
              <td class="cell-muted">{{ ticket.created }}</td>
              <td class="cell-action">
                <BaseButton
                  size="sm" variant="ghost"
                  :loading="ticket.assigning"
                  :disabled="ticket.assigning"
                  @click="assignTicket(ticket)"
                >Nhận xử lý</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- ══════════════════════════════════════════════════════
         DRAWERS
    ══════════════════════════════════════════════════════════ -->

    <!-- Errors drawer -->
    <BaseDrawer :show="errorsDrawer" title="Lỗi hệ thống" size="md" @update:show="v => errorsDrawer = v">
      <div class="drawer-content">
        <p class="drawer-desc">{{ sysErrors.length }} lỗi đang hoạt động. Click "Xử lý" để resolve.</p>
        <div v-if="!sysErrors.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Tất cả lỗi đã được xử lý</span>
        </div>
        <div v-else class="err-list">
          <div
            v-for="err in sysErrors" :key="err.id"
            class="err-row" :class="`err-row--${err.level}`"
          >
            <div class="err-row__info">
              <span class="err-level-icon">{{ err.level === 'critical' ? '🔴' : '⚠️' }}</span>
              <div>
                <p class="err-msg-text">{{ err.msg }}</p>
                <span class="err-time">{{ err.time }} hôm nay</span>
              </div>
            </div>
            <BaseButton
              size="sm" variant="ghost"
              :loading="err.resolving"
              :disabled="err.resolving"
              @click="resolveError(err)"
            >Xử lý</BaseButton>
          </div>
        </div>
      </div>
    </BaseDrawer>

    <!-- Platform campaigns drawer -->
    <BaseDrawer
      :show="platformDrawer"
      :title="`Chiến dịch ${selectedPlatform ?? ''}`"
      size="md"
      @update:show="v => platformDrawer = v"
    >
      <div class="drawer-content">
        <p class="drawer-desc">{{ platformCampaigns.length }} chiến dịch đang dùng {{ selectedPlatform }}</p>
        <table class="act-table act-table--full">
          <thead><tr><th>Tên</th><th>Trạng thái</th><th>Đã gửi</th><th>Giao thành công</th></tr></thead>
          <tbody>
            <tr v-for="c in platformCampaigns" :key="c.id">
              <td class="camp-name">{{ c.name }}</td>
              <td>
                <BaseBadge
                  :text="STATUS_LABEL[c.status]"
                  :variant="STATUS_BADGE[c.status]"
                  dot
                />
              </td>
              <td class="cell-muted">{{ c.sent.toLocaleString('vi-VN') }}</td>
              <td class="cell-muted">{{ c.delivered.toLocaleString('vi-VN') }}</td>
            </tr>
          </tbody>
        </table>
        <div class="drawer-footer">
          <BaseButton variant="primary" @click="navigateToPlatformCampaigns">
            Xem tất cả chiến dịch {{ selectedPlatform }} →
          </BaseButton>
        </div>
      </div>
    </BaseDrawer>

    <!-- ══════════════════════════════════════════════════════
         FORM MODALS
    ══════════════════════════════════════════════════════════ -->

    <!-- Create campaign modal -->
    <FormModal
      v-model="campaignModal"
      title="Tạo chiến dịch mới"
      :loading="campaignLoading"
      submit-label="Tạo chiến dịch"
      @submit="submitCampaign"
    >
      <div class="form-grid">
        <div class="form-field">
          <label class="form-label">Tên chiến dịch <span class="req">*</span></label>
          <BaseInput
            v-model="campaignForm.name"
            placeholder="VD: Khuyến mãi tháng 6..."
            :disabled="campaignLoading"
          />
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label class="form-label">Nền tảng</label>
            <BaseSelectMenu v-model="campaignForm.platform" :options="PLATFORM_OPTS" :disabled="campaignLoading" />
          </div>
          <div class="form-field">
            <label class="form-label">Loại</label>
            <BaseSelectMenu v-model="campaignForm.type" :options="CAMPAIGN_TYPE_OPTS" :disabled="campaignLoading" />
          </div>
        </div>
        <div class="form-field">
          <label class="form-label">Nội dung tin nhắn</label>
          <BaseTextarea
            v-model="campaignForm.message"
            placeholder="Nhập nội dung tin nhắn mẫu..."
            :rows="4"
            :disabled="campaignLoading"
          />
        </div>
      </div>
    </FormModal>

    <!-- Add account modal -->
    <FormModal
      v-model="accountModal"
      title="Thêm tài khoản"
      :loading="accountLoading"
      submit-label="Thêm tài khoản"
      @submit="submitAccount"
    >
      <div class="form-grid">
        <div class="form-row-2">
          <div class="form-field">
            <label class="form-label">Số điện thoại <span class="req">*</span></label>
            <BaseInput v-model="accountForm.phone" placeholder="+84912345678" :disabled="accountLoading" />
          </div>
          <div class="form-field">
            <label class="form-label">Tên hiển thị</label>
            <BaseInput v-model="accountForm.name" placeholder="Tên tài khoản..." :disabled="accountLoading" />
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label class="form-label">Nền tảng</label>
            <BaseSelectMenu v-model="accountForm.platform" :options="PLATFORM_OPTS_NO_SMS" :disabled="accountLoading" />
          </div>
          <div class="form-field">
            <label class="form-label">Nhóm</label>
            <BaseInput v-model="accountForm.group" placeholder="VD: Sales, Support..." :disabled="accountLoading" />
          </div>
        </div>
        <div class="form-field">
          <label class="form-label">Ghi chú</label>
          <BaseTextarea v-model="accountForm.note" placeholder="Ghi chú về tài khoản này..." :rows="3" :disabled="accountLoading" />
        </div>
      </div>
    </FormModal>
  </AppPageLayout>
</template>

<style scoped>
/* ── Top area ──────────────────────────────────────────── */
.dash-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-4);
  flex-wrap: wrap;
  margin-bottom: var(--wx-space-5);
}

.dash-greeting { display: flex; align-items: center; gap: var(--wx-space-6); flex-wrap: wrap; }
.greeting-title { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.greeting-sub { margin: 2px 0 0; font-size: var(--wx-fs-13); color: var(--wx-text-muted); }

.env-status { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.env-dot {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: var(--wx-fw-semibold);
  padding: 3px 8px; border-radius: 20px; position: relative;
}
.env-dot--ok  { color: #16a34a; background: rgba(34,197,94,0.1); }
.env-dot--err { color: #dc2626; background: rgba(239,68,68,0.1); }
.env-dot__pulse { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.env-dot--ok .env-dot__pulse { animation: pulse-ok 2s ease infinite; }
@keyframes pulse-ok { 0%,100%{opacity:1} 50%{opacity:0.4} }

.dash-actions { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; }

/* ── Alert banner ──────────────────────────────────────── */
.alert-banner {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--wx-space-4);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: 10px 14px;
  margin-bottom: var(--wx-space-5);
  overflow: hidden;
}
.alert-items { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.alert-item { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: var(--wx-fw-medium); }
.alert-item--danger  { color: var(--wx-danger-text); }
.alert-item--warning { color: var(--wx-warning-text); }
.alert-action {
  border: none; background: none; cursor: pointer;
  font-size: 12px; font-weight: var(--wx-fw-semibold); color: inherit;
  text-decoration: underline; padding: 0;
}
.alert-slide-enter-active { transition: all 0.25s var(--wx-ease-standard); }
.alert-slide-leave-active { transition: all 0.2s var(--wx-ease-standard); }
.alert-slide-enter-from,.alert-slide-leave-to { opacity:0; max-height:0; margin-bottom:0; padding-top:0; padding-bottom:0; }
.alert-slide-enter-to,.alert-slide-leave-from { opacity:1; max-height:200px; }

/* ── KPI Grid ──────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--wx-space-4);
  margin-bottom: var(--wx-space-6);
}
@media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .kpi-grid { grid-template-columns: 1fr; } }

@keyframes kpi-enter { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.kpi-enter {
  animation: kpi-enter 0.35s var(--wx-ease-standard) both;
  animation-delay: calc(var(--stagger, 0) * 55ms);
}
@media (prefers-reduced-motion: reduce) { .kpi-enter { animation: none; } }

/* ── Analytics / charts ────────────────────────────────── */
.analytics-grid,
.bottom-grid {
  display: grid;
  gap: var(--wx-space-5);
  margin-bottom: var(--wx-space-6);
}
.analytics-grid { grid-template-columns: 1fr 340px; }
.bottom-grid    { grid-template-columns: 1fr 1fr; }

@media (max-width: 900px) {
  .analytics-grid, .bottom-grid { grid-template-columns: 1fr; }
}

.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--wx-space-4); }
.section-title  { margin: 0; font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.section-badge  {
  font-size: 11px; font-weight: var(--wx-fw-semibold); color: var(--wx-text-muted);
  background: var(--wx-surface-sunken); padding: 2px 8px; border-radius: 20px;
}

.chart-hint { margin: -8px 0 8px; font-size: 11px; color: var(--wx-text-muted); font-style: italic; }

.donut-wrap { display: flex; justify-content: center; align-items: center; margin-top: var(--wx-space-2); }

.filter-tag {
  margin-top: var(--wx-space-3);
  text-align: center;
  font-size: 12px;
  color: var(--wx-text-muted);
}
.filter-tag strong { color: var(--wx-brand-primary); }

.timeline-wrap { max-height: 280px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--wx-border-subtle) transparent; }

/* ── Actionable tables ─────────────────────────────────── */
.act-table-wrap { margin-top: var(--wx-space-4); }

.filter-notice {
  display: flex; align-items: center; gap: var(--wx-space-3);
  font-size: 12px; color: var(--wx-text-muted);
  margin-bottom: var(--wx-space-3);
}

.act-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: var(--wx-space-3); padding: var(--wx-space-8) var(--wx-space-4);
  color: var(--wx-text-muted); font-size: 13px;
}
.act-empty__icon { font-size: 28px; }

.act-table {
  width: 100%; border-collapse: collapse;
  font-size: var(--wx-fs-13);
}
.act-table--full { width: 100%; }

.act-table th {
  text-align: left;
  padding: 6px 10px;
  font-size: 11px; font-weight: var(--wx-fw-semibold); text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--wx-text-muted); border-bottom: 1px solid var(--wx-border-subtle);
}
.act-table td {
  padding: 9px 10px;
  border-bottom: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-primary);
  vertical-align: middle;
}
.act-table tr:last-child td { border-bottom: none; }
.act-table tr:hover td { background: var(--wx-surface-sunken); }

.job-name { font-family: var(--wx-font-mono); font-size: 12px; color: var(--wx-text-secondary); }
.err-msg  { color: var(--wx-danger-text); font-size: 12px; max-width: 280px; }
.cell-muted { color: var(--wx-text-muted); }
.cell-warn  { color: var(--wx-warning-text); font-weight: var(--wx-fw-semibold); }
.cell-action { text-align: right; white-space: nowrap; }

.retry-badge {
  display: inline-block; padding: 1px 6px; border-radius: 4px;
  font-size: 11px; font-weight: var(--wx-fw-bold);
  background: rgba(239,68,68,0.1); color: #dc2626;
}

.acc-cell { display: flex; flex-direction: column; gap: 2px; }
.acc-name { font-weight: var(--wx-fw-medium); }
.acc-phone { font-size: 11px; color: var(--wx-text-muted); font-family: var(--wx-font-mono); }

.ticket-title { max-width: 380px; line-height: 1.4; }
.camp-name { font-weight: var(--wx-fw-medium); }

/* ── Drawers ───────────────────────────────────────────── */
.drawer-content { padding: var(--wx-space-4); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.drawer-desc { margin: 0; font-size: 13px; color: var(--wx-text-muted); }

.err-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.err-row {
  display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-3);
  padding: 10px 12px; border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}
.err-row--critical { border-left: 3px solid var(--wx-danger-text); }
.err-row--warning  { border-left: 3px solid var(--wx-warning-text); }
.err-row__info { display: flex; align-items: flex-start; gap: var(--wx-space-3); flex: 1; min-width: 0; }
.err-msg-text { margin: 0; font-size: 13px; color: var(--wx-text-primary); line-height: 1.4; }
.err-time { font-size: 11px; color: var(--wx-text-muted); }

.drawer-footer { padding-top: var(--wx-space-4); border-top: 1px solid var(--wx-border-subtle); }

/* ── Form modals ───────────────────────────────────────── */
.form-grid { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-4); }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 12px; font-weight: var(--wx-fw-semibold); color: var(--wx-text-secondary); }
.req { color: var(--wx-danger-text); }

</style>

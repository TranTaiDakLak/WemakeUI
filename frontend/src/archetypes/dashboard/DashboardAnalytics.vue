<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LineChart, BarChart, PieChart } from '@/components/charts'
import type { LineSeries } from '@/components/charts/LineChart.vue'
import type { PieSlice } from '@/components/charts/PieChart.vue'
import { BaseBadge, BaseButton, BaseCard, BaseDrawer } from '@/components/common'
import { Timeline } from '@/components/data'
import type { TimelineItem } from '@/components/data/Timeline.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useStagger } from '@/composables/useStagger'

const router = useRouter()
const stagger = useStagger(80)

/* ── Line chart ─────────────────────────────────────────── */
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

/* ── Donut chart ─────────────────────────────────────────── */
const PIE_DATA: PieSlice[] = [
  { label: 'Live',       value: 1284, color: '#22c55e' },
  { label: 'Die',        value: 891,  color: '#ef4444' },
  { label: 'Checkpoint', value: 226,  color: '#f59e0b' },
]

const activeFilter = ref<string | null>(null)
const emit = defineEmits<{ filterAccounts: [filter: string | null] }>()

function onDonutClick(slice: PieSlice) {
  const key = slice.label.toLowerCase()
  activeFilter.value = activeFilter.value === key ? null : key
  emit('filterAccounts', activeFilter.value)
}

/* ── Bar chart ───────────────────────────────────────────── */
const BAR_DATA = [
  { label: 'WhatsApp', value: 14, color: '#25d366' },
  { label: 'Zalo',     value: 6,  color: '#0068ff' },
  { label: 'Telegram', value: 3,  color: '#229ed9' },
  { label: 'SMS',      value: 1,  color: '#8b5cf6' },
]

const platformDrawer = ref(false)
const selectedPlatform = ref<string | null>(null)

const PLATFORM_CAMPAIGNS: Record<string, { id: number; name: string; status: string; sent: number; delivered: number }[]> = {
  WhatsApp: [
    { id: 1, name: 'Khuyến mãi 5/5',       status: 'running',   sent: 4200, delivered: 4100 },
    { id: 2, name: 'Chào hàng mới',         status: 'running',   sent: 1800, delivered: 1740 },
    { id: 3, name: 'Flash sale cuối tuần',  status: 'scheduled', sent: 0,    delivered: 0 },
    { id: 4, name: 'Re-engagement 30 ngày', status: 'running',   sent: 890,  delivered: 867 },
  ],
  Zalo: [
    { id: 5, name: 'ZNS Xác nhận đơn', status: 'running',   sent: 3400, delivered: 3380 },
    { id: 6, name: 'ZNS Giao hàng',    status: 'running',   sent: 1200, delivered: 1195 },
    { id: 7, name: 'Promo tháng 5',    status: 'scheduled', sent: 0,    delivered: 0 },
  ],
  Telegram: [
    { id: 8, name: 'Bot thông báo nội bộ', status: 'running', sent: 560, delivered: 558 },
    { id: 9, name: 'Alert hệ thống',       status: 'running', sent: 210, delivered: 210 },
  ],
  SMS: [{ id: 10, name: 'OTP Backup', status: 'running', sent: 4800, delivered: 4795 }],
}

const platformCampaigns = computed(() =>
  selectedPlatform.value ? (PLATFORM_CAMPAIGNS[selectedPlatform.value] ?? []) : [],
)

function onBarClick(item: { label: string; value: number }) {
  selectedPlatform.value = item.label
  platformDrawer.value = true
}

function navToPlatform() {
  router.push({ path: '/wemakeui/campaigns', query: { platform: selectedPlatform.value ?? '' } })
  platformDrawer.value = false
}

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'neutral'> = {
  running: 'success', scheduled: 'warning', paused: 'neutral',
}
const STATUS_LABEL: Record<string, string> = {
  running: 'Đang chạy', scheduled: 'Lên lịch', paused: 'Tạm dừng',
}

/* ── Activity timeline ───────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10)
const TIMELINE: TimelineItem[] = [
  { id: 1, ts: `${today}T10:42:00`, title: 'Chiến dịch "Khuyến mãi 5/5" bắt đầu',   icon: '📣', variant: 'info' },
  { id: 2, ts: `${today}T10:15:00`, title: 'Tài khoản @batcong.vn kết nối QR mới',   icon: '📱', variant: 'success' },
  { id: 3, ts: `${today}T09:58:00`, title: 'Plugin ChatGPT v2.1 cập nhật thành công', icon: '🔌', variant: 'success' },
  { id: 4, ts: `${today}T09:30:00`, title: 'Lỗi kết nối server backup — đã recover',  icon: '🚨', variant: 'danger' },
  { id: 5, ts: `${today}T09:10:00`, title: '47 tài khoản vào trạng thái checkpoint',  icon: '⚠️', variant: 'warning' },
  { id: 6, ts: `${today}T08:45:00`, title: '3 phiên mới từ Hà Nội (Viettel)',          icon: '🔗', variant: 'default' },
  { id: 7, ts: `${today}T08:20:00`, title: 'Báo cáo tuần tự động xuất thành công',   icon: '📊', variant: 'info' },
  { id: 8, ts: `${today}T07:55:00`, title: 'Scheduler chạy task queue 12 jobs',        icon: '⏳', variant: 'default' },
]

/* ── Scroll reveal ───────────────────────────────────────── */
const sectionRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (sectionRef.value) observe(sectionRef.value) })
</script>

<template>
  <div ref="sectionRef" class="analytics-wrap">
    <!-- row 1: line + donut -->
    <div class="analytics-row">
      <BaseCard
        shadow="sm"
        class="wx-reveal"
        :class="{ 'is-revealed': revealed }"
        :style="stagger(0)"
      >
        <div class="a-card__head">
          <h3 class="a-card__title">Xu hướng 7 ngày</h3>
          <BaseBadge text="Live" variant="success" dot />
        </div>
        <LineChart :series="LINE_SERIES" :height="220" :show-grid="true" :show-legend="true" :smooth="true" />
      </BaseCard>

      <BaseCard
        shadow="sm"
        class="wx-reveal"
        :class="{ 'is-revealed': revealed }"
        :style="stagger(1)"
      >
        <div class="a-card__head">
          <h3 class="a-card__title">Trạng thái tài khoản</h3>
          <BaseButton v-if="activeFilter" variant="ghost" size="sm" @click="activeFilter = null; emit('filterAccounts', null)">
            ✕ Bỏ lọc
          </BaseButton>
        </div>
        <p class="a-hint">Click vào segment để lọc bảng bên dưới</p>
        <PieChart
          :data="PIE_DATA" :size="190"
          :donut="true" :donut-width="36"
          :show-legend="true"
          center-label="Tổng"
          :center-value="(1284 + 891 + 226).toLocaleString('vi-VN')"
          @click-slice="onDonutClick"
        />
        <p v-if="activeFilter" class="a-filter-tag">
          Đang lọc: <strong>{{ activeFilter }}</strong>
        </p>
      </BaseCard>
    </div>

    <!-- row 2: bar + timeline -->
    <div class="analytics-row">
      <BaseCard
        shadow="sm"
        class="wx-reveal"
        :class="{ 'is-revealed': revealed }"
        :style="stagger(2)"
      >
        <div class="a-card__head">
          <h3 class="a-card__title">Chiến dịch theo nền tảng</h3>
          <span class="a-badge">24 đang chạy</span>
        </div>
        <p class="a-hint">Click cột để xem chi tiết</p>
        <BarChart :data="BAR_DATA" :height="200" :show-grid="true" :show-legend="false" @click-bar="onBarClick" />
      </BaseCard>

      <BaseCard
        shadow="sm"
        class="wx-reveal"
        :class="{ 'is-revealed': revealed }"
        :style="stagger(3)"
      >
        <div class="a-card__head">
          <h3 class="a-card__title">Hoạt động hệ thống</h3>
          <BaseButton size="sm" variant="ghost" @click="router.push('/wemakeui/console')">Xem tất cả</BaseButton>
        </div>
        <div class="timeline-wrap">
          <Timeline :items="TIMELINE" :group-by-day="false" />
        </div>
      </BaseCard>
    </div>
  </div>

  <!-- Platform drill-down drawer -->
  <BaseDrawer
    :show="platformDrawer"
    :title="`Chiến dịch ${selectedPlatform ?? ''}`"
    size="md"
    @update:show="v => { platformDrawer = v }"
  >
    <p class="pf-desc">{{ platformCampaigns.length }} chiến dịch đang dùng {{ selectedPlatform }}</p>
    <table class="pf-table">
      <thead>
        <tr><th>Tên</th><th>Trạng thái</th><th>Đã gửi</th><th>Giao thành công</th></tr>
      </thead>
      <tbody>
        <tr v-for="c in platformCampaigns" :key="c.id">
          <td>{{ c.name }}</td>
          <td><BaseBadge :text="STATUS_LABEL[c.status]" :variant="STATUS_BADGE[c.status]" dot /></td>
          <td>{{ c.sent.toLocaleString('vi-VN') }}</td>
          <td>{{ c.delivered.toLocaleString('vi-VN') }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pf-foot">
      <BaseButton variant="primary" @click="navToPlatform">
        Xem tất cả chiến dịch {{ selectedPlatform }} →
      </BaseButton>
    </div>
  </BaseDrawer>
</template>

<style scoped>
.analytics-wrap { display: flex; flex-direction: column; gap: var(--wx-space-4); margin-bottom: var(--wx-space-5); }

.analytics-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--wx-space-4);
}
@media (min-width: 768px) { .analytics-row { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1200px) { .analytics-row:first-child { grid-template-columns: 2fr 1fr; } }

.a-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--wx-space-3);
  gap: var(--wx-space-2);
}
.a-card__title {
  font-size: var(--wx-text-base);
  font-weight: 600;
  color: var(--wx-text-primary);
  margin: 0;
}
.a-hint {
  font-size: var(--wx-text-xs);
  color: var(--wx-text-tertiary);
  margin: 0 0 var(--wx-space-3);
}
.a-badge {
  font-size: var(--wx-text-xs);
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-elevated);
  color: var(--wx-text-secondary);
  border: 1px solid var(--wx-border-subtle);
}
.a-filter-tag {
  font-size: var(--wx-text-xs);
  color: var(--wx-text-tertiary);
  margin: var(--wx-space-2) 0 0;
}
.timeline-wrap { max-height: 260px; overflow-y: auto; }

.pf-desc { font-size: var(--wx-text-sm); color: var(--wx-text-secondary); margin: 0 0 var(--wx-space-4); }
.pf-foot { padding-top: var(--wx-space-4); border-top: 1px solid var(--wx-border-subtle); margin-top: var(--wx-space-4); }

.pf-table { width: 100%; border-collapse: collapse; font-size: var(--wx-text-sm); }
.pf-table th, .pf-table td {
  text-align: left;
  padding: var(--wx-space-2) var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.pf-table th { font-weight: 500; color: var(--wx-text-secondary); font-size: var(--wx-text-xs); }
</style>

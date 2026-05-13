<script setup lang="ts">
/**
 * Phase 5 — async / feedback showcase.
 *
 * Hiển thị: EmptyState, ErrorState, JobCard 5 trạng thái, JobTimeline,
 * LiveBadge, ConflictBanner, RetryButton, StepProgress.
 */
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import { EmptyState, ErrorState } from '../../components/feedback'
import { AnchorBar } from '../../components/common'
import {
  JobCard,
  JobTimeline,
  LiveBadge,
  ConflictBanner,
  RetryButton,
  StepProgress,
  CountdownTimer,
  type Job,
  type JobStatus,
} from '../../components/async'

/* ─── EmptyState demo state ─────────────────────────────── */
const searchQ = ref('hoá đơn quá hạn')

/* ─── job lifecycle simulation ──────────────────────────── */
const jobs = ref<Job[]>([
  {
    id: '4f-21-7a',
    name: 'gửi 1.240 email chiến dịch tháng 5',
    status: 'running',
    progress: 32,
    eta: 18_000,
    elapsed: 12_500,
    message: 'đang gửi đến nhóm "khách VIP" (412/1240)…',
    createdAt: Date.now(),
  },
  {
    id: '4f-21-7b',
    name: 'đồng bộ danh bạ với Google Workspace',
    status: 'queued',
    progress: null,
    eta: null,
    elapsed: 0,
    message: 'đang chờ slot worker (#2 trong hàng đợi)',
    createdAt: Date.now(),
  },
  {
    id: '4f-20-aa',
    name: 'kết xuất báo cáo doanh thu Q1',
    status: 'success',
    progress: 100,
    elapsed: 6_400,
    message: 'tải về tệp report-q1.xlsx (1.2 MB)',
    createdAt: Date.now() - 36e5, /* 1h trước */
  },
  {
    id: '4f-20-ab',
    name: 'cập nhật giá theo tỷ giá hôm nay',
    status: 'failed',
    progress: 64,
    elapsed: 4_900,
    message: 'lỗi: API tỷ giá trả 503 sau 3 lần thử lại',
    createdAt: Date.now() - 36e5,
  },
  {
    id: '4e-91-ff',
    name: 'dọn dẹp file tạm > 30 ngày',
    status: 'canceled',
    elapsed: 1_200,
    message: 'người dùng huỷ thủ công',
    createdAt: Date.now() - 24 * 36e5, /* hôm qua */
  },
])

/* tự update progress của running job mỗi 600ms để thấy đường progress nhúc nhích */
let progressTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  progressTimer = setInterval(() => {
    for (const j of jobs.value) {
      if (j.status === 'running' && j.progress != null) {
        j.progress = Math.min(99, j.progress + Math.random() * 3)
        j.elapsed = (j.elapsed ?? 0) + 600
        j.eta = Math.max(0, (j.eta ?? 0) - 600)
      }
    }
  }, 600)
})
onBeforeUnmount(() => {
  if (progressTimer) clearInterval(progressTimer)
})

function onRetry(job: Job) {
  const j = jobs.value.find((x) => x.id === job.id)
  if (!j) return
  j.status = 'running'
  j.progress = 0
  j.elapsed = 0
  j.eta = 8_000
  j.message = 'đang chạy lại từ đầu…'
}
function onCancel(job: Job) {
  const j = jobs.value.find((x) => x.id === job.id)
  if (!j) return
  j.status = 'canceled'
  j.message = 'đã huỷ thủ công'
}
function onLogs(job: Job) {
  alert(`mở log cho job ${job.id} (demo)`) // showcase only
}

/* ─── live badge demo ───────────────────────────────────── */
const liveStatus = ref<'live' | 'polling' | 'connecting' | 'idle' | 'error'>('live')
const lastUpdate = ref<number>(Date.now())
let liveTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  liveTimer = setInterval(() => {
    if (liveStatus.value === 'live') lastUpdate.value = Date.now()
  }, 4000)
})
onBeforeUnmount(() => { if (liveTimer) clearInterval(liveTimer) })

const liveStatuses: Array<typeof liveStatus.value> = ['live', 'polling', 'connecting', 'idle', 'error']

/* ─── conflict banner demo ──────────────────────────────── */
const conflictUser = ref('Lan')
const conflictAt = ref<number | null>(Date.now() - 35_000)
const conflictDismissed = ref(false)
function resetConflict() {
  conflictDismissed.value = false
  conflictAt.value = Date.now()
}

/* ─── retry button demo ─────────────────────────────────── */
const retryBusy = ref(false)
const retryOptions = [
  { value: 'last', label: 'thử lại từ bước cuối thất bại', description: 'tiếp tục từ checkpoint lần chạy trước' },
  { value: 'all',  label: 'chạy lại từ đầu',                description: 'reset toàn bộ tiến độ' },
]
async function fakeRetry() {
  retryBusy.value = true
  await new Promise((r) => setTimeout(r, 1400))
  retryBusy.value = false
}

/* ─── step progress demo ────────────────────────────────── */
const wizardSteps = [
  { label: 'tài khoản', description: 'email + mật khẩu' },
  { label: 'hồ sơ', description: 'tên + ảnh đại diện' },
  { label: 'thanh toán', description: 'thẻ + địa chỉ' },
  { label: 'hoàn tất' },
]
const wizardCurrent = ref(2)

const verticalSteps = [
  { label: 'queued', description: 'chờ worker', status: 'done' as const },
  { label: 'running', description: 'đang xử lý 412/1240', status: 'active' as const },
  { label: 'success', description: 'hoàn tất', status: 'pending' as const },
]

/* ─── anchor nav ────────────────────────────────────────── */
const sections = [
  { id: 'empty',     label: 'EmptyState' },
  { id: 'error',     label: 'ErrorState' },
  { id: 'jobcard',   label: 'JobCard' },
  { id: 'timeline',  label: 'JobTimeline' },
  { id: 'live',      label: 'LiveBadge' },
  { id: 'conflict',  label: 'ConflictBanner' },
  { id: 'retry',     label: 'RetryButton' },
  { id: 'step',      label: 'StepProgress' },
  { id: 'countdown', label: 'CountdownTimer' },
]
const activeId = ref('empty')

const totalJobs = computed(() => jobs.value.length)

/* ─── CountdownTimer demo ───────────────────────────────── */
const cdKey = ref(0)
function resetAllTimers() { cdKey.value++ }
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 5 · async + feedback" />
    <main class="main">
      <PageHeader
        title="async / feedback / job lifecycle"
        description="EmptyState (3 biến thể), ErrorState (4 surface), JobCard 5 trạng thái, LiveBadge, ConflictBanner, RetryButton dropdown, StepProgress (horizontal + vertical)."
      />

      <!-- anchor nav -->
      <AnchorBar v-model="activeId" :sections="sections" />

      <!-- EmptyState -->
      <section id="empty" class="section">
        <h3 class="section__title">EmptyState — zero / filtered / search</h3>
        <div class="grid grid-3">
          <div class="card">
            <EmptyState
              variant="zero"
              cta-label="tạo hoá đơn đầu tiên"
            />
          </div>
          <div class="card">
            <EmptyState
              variant="filtered"
              cta-label="xoá bộ lọc"
              secondary-label="lưu bộ lọc"
            />
          </div>
          <div class="card">
            <EmptyState
              variant="search"
              :query="searchQ"
              cta-label="xoá tìm kiếm"
            />
          </div>
        </div>
      </section>

      <!-- ErrorState -->
      <section id="error" class="section">
        <h3 class="section__title">ErrorState — inline / banner / fullpage</h3>
        <div class="stack">
          <ErrorState
            surface="inline"
            title="email không hợp lệ"
            description="nhập đúng định dạng name@domain.com"
          />
          <ErrorState
            surface="banner"
            intent="warning"
            title="kết nối chậm"
            description="máy chủ đang phản hồi >2s. dữ liệu hiển thị có thể chưa mới nhất."
            retry-label="thử lại"
            secondary-label="bỏ qua"
          />
          <ErrorState
            surface="banner"
            title="không thể tải danh sách đơn hàng"
            description="máy chủ trả 500 sau 3 lần thử lại. hãy thử lại sau ít phút."
            :code="500"
            retry-label="thử lại"
          />
        </div>
        <div class="card card--fullpage">
          <ErrorState
            surface="fullpage"
            title="bạn không có quyền truy cập trang này"
            description="liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn."
            :code="403"
            retry-label="quay về trang chủ"
            secondary-label="yêu cầu cấp quyền"
          />
        </div>
      </section>

      <!-- JobCard -->
      <section id="jobcard" class="section">
        <h3 class="section__title">JobCard — 5 lifecycle ({{ totalJobs }} job đang theo dõi)</h3>
        <div class="stack">
          <JobCard
            v-for="j in jobs"
            :key="j.id"
            :job="j"
            @retry="onRetry"
            @cancel="onCancel"
            @logs="onLogs"
          />
        </div>
      </section>

      <!-- JobTimeline -->
      <section id="timeline" class="section">
        <h3 class="section__title">JobTimeline — group theo ngày</h3>
        <div class="card card--narrow">
          <JobTimeline
            :jobs="jobs"
            @retry="onRetry"
            @cancel="onCancel"
            @logs="onLogs"
          />
        </div>
      </section>

      <!-- LiveBadge -->
      <section id="live" class="section">
        <h3 class="section__title">LiveBadge — kết nối realtime</h3>
        <div class="row">
          <LiveBadge
            v-for="s in liveStatuses"
            :key="s"
            :status="s"
            channel="jobs.live"
            :last-update="s === 'live' ? lastUpdate : null"
          />
        </div>
        <p class="hint">↑ chấm pulse khi `live`, blink khi `connecting`, đỏ khi `error`. Reset theo prefers-reduced-motion.</p>
      </section>

      <!-- ConflictBanner -->
      <section id="conflict" class="section">
        <h3 class="section__title">ConflictBanner — không auto-overwrite input</h3>
        <ConflictBanner
          v-if="!conflictDismissed"
          :user="conflictUser"
          :at="conflictAt"
          description="họ đã đổi giá sản phẩm và đơn vị tiền. xem & merge trước khi tiếp tục lưu."
          @merge="conflictDismissed = true"
          @ignore="conflictDismissed = true"
        />
        <button v-else class="reset-btn" @click="resetConflict">
          ↻ làm mới conflict (giả lập)
        </button>
      </section>

      <!-- RetryButton -->
      <section id="retry" class="section">
        <h3 class="section__title">RetryButton — primary + dropdown</h3>
        <div class="row">
          <RetryButton :loading="retryBusy" @retry="fakeRetry" />
          <RetryButton :loading="retryBusy" :options="retryOptions" @retry="fakeRetry" @retry-with="fakeRetry" />
          <RetryButton size="sm" label="thử lại nhanh" @retry="fakeRetry" />
          <RetryButton disabled label="không thể thử lại" />
        </div>
      </section>

      <!-- StepProgress -->
      <section id="step" class="section">
        <h3 class="section__title">StepProgress — horizontal + vertical</h3>
        <div class="card">
          <StepProgress :steps="wizardSteps" :current="wizardCurrent" />
          <div class="row" style="margin-top: 16px;">
            <button class="reset-btn" @click="wizardCurrent = Math.max(0, wizardCurrent - 1)">← bước trước</button>
            <button class="reset-btn" @click="wizardCurrent = Math.min(wizardSteps.length - 1, wizardCurrent + 1)">bước sau →</button>
          </div>
        </div>
        <div class="card">
          <StepProgress :steps="verticalSteps" orientation="vertical" :current="1" />
        </div>
      </section>
      <!-- CountdownTimer -->
      <section id="countdown" class="section">
        <h3 class="section__title">CountdownTimer — OTP / session / cooldown</h3>
        <div class="card">
          <div class="row" style="flex-wrap:wrap; gap: 24px; align-items:center;">
            <CountdownTimer :key="`otp-${cdKey}`" :seconds="30"  label="mã OTP hết hạn sau"   size="md" />
            <CountdownTimer :key="`ses-${cdKey}`" :seconds="120" label="phiên đăng nhập"       size="md" :warn-at="40" :danger-at="15" />
            <CountdownTimer :key="`cd-${cdKey}`"  :seconds="10"  label="gửi lại sau"           size="sm" />
            <CountdownTimer :key="`lg-${cdKey}`"  :seconds="300" label="job chạy lại lúc"      size="lg" :warn-at="20" />
            <CountdownTimer :key="`exp-${cdKey}`" :seconds="5"   label="đã hết hạn"            size="md" :auto-start="false" @expire="() => {}" />
          </div>
          <p class="hint" style="margin-top:12px;">
            Vòng tròn chuyển vàng khi gần hết, đỏ + rung khi sắp hết. Expose: <code>start / stop / reset(n)</code>.
          </p>
          <button class="reset-btn" style="margin-top:8px" @click="resetAllTimers">↻ đặt lại tất cả</button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
}
.main {
  max-width: 1080px;
  margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-6);
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  scroll-margin-top: 100px;
}
.section__title {
  margin: 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}

.grid {
  display: grid;
  gap: var(--wx-space-3);
}
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 900px) {
  .grid-3 { grid-template-columns: 1fr; }
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}

.row {
  display: flex;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
  align-items: center;
}

.card {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-4);
  box-shadow: var(--wx-shadow-sm);
}
.card--fullpage { padding: 0; }
.card--narrow { max-width: 720px; }

.hint {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  margin: 0;
}

.reset-btn {
  font-family: inherit;
  font-size: var(--wx-fs-13);
  padding: 4px 12px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  border: 1px solid var(--wx-border-default);
  cursor: pointer;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.reset-btn:hover { background: var(--wx-hover-bg); }
.reset-btn:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
</style>

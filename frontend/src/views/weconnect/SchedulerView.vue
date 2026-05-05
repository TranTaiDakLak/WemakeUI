<script setup lang="ts">
import { ref } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseButton, BaseBadge, BaseCard, BaseToggle } from '../../components/common'

interface CronJob {
  id: number
  name: string
  cron: string
  desc: string
  enabled: boolean
  lastRun: string
  nextRun: string
  status: 'ok' | 'failed' | 'running' | 'pending'
  runs: number
}

const JOBS = ref<CronJob[]>([
  { id: 1, name: 'Sync contacts', cron: '0 */6 * * *', desc: 'Đồng bộ danh bạ từ CRM mỗi 6 giờ', enabled: true, lastRun: '10:00', nextRun: '16:00', status: 'ok', runs: 148 },
  { id: 2, name: 'Campaign dispatcher', cron: '*/5 * * * *', desc: 'Gửi tin nhắn chiến dịch theo batch 50', enabled: true, lastRun: '10:55', nextRun: '11:00', status: 'running', runs: 2304 },
  { id: 3, name: 'Session health check', cron: '*/1 * * * *', desc: 'Kiểm tra ping tất cả session, kết nối lại nếu mất', enabled: true, lastRun: '10:59', nextRun: '11:00', status: 'ok', runs: 8712 },
  { id: 4, name: 'Auto-reply cleanup', cron: '0 2 * * *', desc: 'Xóa log auto-reply quá 30 ngày', enabled: false, lastRun: 'Hôm qua 02:00', nextRun: 'Ngày mai 02:00', status: 'pending', runs: 31 },
  { id: 5, name: 'Report export', cron: '0 8 * * 1', desc: 'Xuất báo cáo tuần gửi qua email mỗi thứ 2', enabled: true, lastRun: 'Thứ 2 tuần trước', nextRun: 'Thứ 2 tuần tới', status: 'failed', runs: 12 },
])

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'info' | 'danger' | 'neutral' | 'warning' }> = {
  ok: { label: 'OK', variant: 'success' },
  running: { label: 'Đang chạy', variant: 'info' },
  failed: { label: 'Thất bại', variant: 'danger' },
  pending: { label: 'Chờ', variant: 'neutral' },
}

const showCreate = ref(false)
const newName = ref('')
const newCron = ref('0 * * * *')
const newDesc = ref('')

function createJob() {
  if (!newName.value.trim()) return
  JOBS.value.push({
    id: Date.now(), name: newName.value, cron: newCron.value, desc: newDesc.value,
    enabled: true, lastRun: '—', nextRun: '—', status: 'pending', runs: 0,
  })
  newName.value = ''; newCron.value = '0 * * * *'; newDesc.value = ''; showCreate.value = false
}

function runNow(job: CronJob) { job.status = 'running'; setTimeout(() => { job.status = 'ok'; job.lastRun = 'Vừa xong'; job.runs++ }, 1500) }
function removeJob(id: number) { const i = JOBS.value.findIndex(j => j.id === id); if (i >= 0) JOBS.value.splice(i, 1) }
</script>

<template>
  <WeConnectLayout current="scheduler" page-title="Bộ lập lịch" page-description="Quản lý tác vụ định kỳ và cron jobs">
    <template #actions>
      <BaseButton size="sm" variant="primary" @click="showCreate = !showCreate">+ Tạo job mới</BaseButton>
    </template>

    <Transition name="slide-down">
      <BaseCard v-if="showCreate" class="create-form">
        <template #header><span class="form-title">Tạo Cron Job</span></template>
        <template #body>
          <div class="create-grid">
            <div class="form-field">
              <label>Tên job</label>
              <input v-model="newName" class="wx-input" placeholder="vd: Sync users" />
            </div>
            <div class="form-field">
              <label>Cron expression</label>
              <input v-model="newCron" class="wx-input mono" placeholder="0 * * * *" />
            </div>
            <div class="form-field full">
              <label>Mô tả</label>
              <input v-model="newDesc" class="wx-input" placeholder="Mô tả ngắn..." />
            </div>
          </div>
        </template>
        <template #footer>
          <div class="form-actions">
            <BaseButton size="sm" variant="ghost" @click="showCreate = false">Huỷ</BaseButton>
            <BaseButton size="sm" variant="primary" @click="createJob">Tạo</BaseButton>
          </div>
        </template>
      </BaseCard>
    </Transition>

    <div class="jobs-list">
      <div v-for="job in JOBS" :key="job.id" class="job-row" :class="{ disabled: !job.enabled }">
        <div class="job-toggle"><BaseToggle v-model="job.enabled" /></div>
        <div class="job-main">
          <div class="job-header">
            <span class="job-name">{{ job.name }}</span>
            <code class="job-cron">{{ job.cron }}</code>
            <BaseBadge :text="STATUS_MAP[job.status].label" :variant="STATUS_MAP[job.status].variant" dot size="sm" />
          </div>
          <p class="job-desc">{{ job.desc }}</p>
          <div class="job-meta">
            <span>Lần cuối: <b>{{ job.lastRun }}</b></span>
            <span>Tiếp theo: <b>{{ job.enabled ? job.nextRun : '—' }}</b></span>
            <span>Đã chạy: <b>{{ job.runs.toLocaleString() }} lần</b></span>
          </div>
        </div>
        <div class="job-actions">
          <BaseButton size="sm" variant="ghost" @click="runNow(job)">Chạy ngay</BaseButton>
          <BaseButton size="sm" variant="ghost">Log</BaseButton>
          <BaseButton size="sm" variant="danger" @click="removeJob(job.id)">Xoá</BaseButton>
        </div>
      </div>
    </div>
  </WeConnectLayout>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all var(--wx-d-base); }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
.create-form { margin-bottom: var(--wx-space-2); }
.form-title { font-weight: var(--wx-fw-semibold); }
.create-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
.form-field { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.form-field.full { grid-column: 1 / -1; }
.form-field label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-medium); color: var(--wx-content-muted); }
.wx-input { padding: 6px 10px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-bg-base); color: var(--wx-content-primary); font-size: var(--wx-fs-14); width: 100%; }
.mono { font-family: var(--wx-font-mono); }
.form-actions { display: flex; gap: var(--wx-space-2); justify-content: flex-end; }
.jobs-list { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.job-row { display: flex; align-items: flex-start; gap: var(--wx-space-4); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); padding: var(--wx-space-4); transition: opacity var(--wx-d-micro); }
.job-row.disabled { opacity: 0.55; }
.job-toggle { padding-top: 2px; flex-shrink: 0; }
.job-main { flex: 1; min-width: 0; }
.job-header { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; margin-bottom: var(--wx-space-1); }
.job-name { font-weight: var(--wx-fw-semibold); font-size: var(--wx-fs-15); }
.job-cron { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); background: var(--wx-bg-sunken); padding: 2px 8px; border-radius: var(--wx-radius-sm); }
.job-desc { font-size: var(--wx-fs-13); color: var(--wx-content-secondary); margin: 0 0 var(--wx-space-2); }
.job-meta { display: flex; gap: var(--wx-space-4); font-size: var(--wx-fs-12); color: var(--wx-content-muted); flex-wrap: wrap; }
.job-meta b { color: var(--wx-content-primary); }
.job-actions { display: flex; gap: var(--wx-space-2); flex-shrink: 0; }
</style>

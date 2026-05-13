<script setup lang="ts">
/**
 * JobCard — hiển thị 1 job với 5 lifecycle state (§5.4):
 *   queued → running → success / failed / canceled
 *
 *   <JobCard
 *     :job="{ id, name, status: 'running', progress: 42, eta: 18000, message: '...' }"
 *     @retry="..." @cancel="..." @logs="..."
 *   />
 */
import { computed } from 'vue'

export type JobStatus = 'queued' | 'running' | 'success' | 'failed' | 'canceled'

export interface Job {
  id: string
  name: string
  status: JobStatus
  /** % 0..100. nếu null → indeterminate */
  progress?: number | null
  /** ms còn lại ước lượng */
  eta?: number | null
  /** ms đã trôi */
  elapsed?: number | null
  /** message cuối cùng (log line, error message…) */
  message?: string
  /** ms epoch khi tạo */
  createdAt?: number
}

interface Props {
  job: Job
  /** ẩn các action mặc định (caller render slot riêng) */
  hideActions?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  retry: [job: Job]
  cancel: [job: Job]
  logs: [job: Job]
}>()

const STATUS_META: Record<JobStatus, { label: string; icon: string; intent: string }> = {
  queued:   { label: 'đang chờ',   icon: '⏱',  intent: 'neutral' },
  running:  { label: 'đang chạy',  icon: '↻',  intent: 'info' },
  success:  { label: 'hoàn tất',   icon: '✓',  intent: 'success' },
  failed:   { label: 'lỗi',         icon: '✕',  intent: 'danger' },
  canceled: { label: 'đã huỷ',     icon: '–',  intent: 'muted' },
}

const meta = computed(() => STATUS_META[props.job.status])

function formatDuration(ms?: number | null): string {
  if (ms == null) return '—'
  const sec = Math.max(0, Math.floor(ms / 1000))
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  const remSec = sec % 60
  if (min < 60) return `${min}m ${remSec}s`
  const hr = Math.floor(min / 60)
  const remMin = min % 60
  return `${hr}h ${remMin}m`
}

const progressPct = computed(() => {
  if (props.job.progress == null) return null
  return Math.max(0, Math.min(100, props.job.progress))
})
</script>

<template>
  <article
    class="wx-job"
    :data-status="job.status"
    :data-intent="meta.intent"
    role="article"
    :aria-label="`job ${job.name}, ${meta.label}`"
  >
    <header class="wx-job__head">
      <span class="wx-job__icon" :data-intent="meta.intent" aria-hidden="true">
        <span :class="['wx-job__icon-glyph', job.status === 'running' ? 'wx-job__icon-glyph--spin' : '']">
          {{ meta.icon }}
        </span>
      </span>
      <div class="wx-job__title-wrap">
        <h4 class="wx-job__title">{{ job.name }}</h4>
        <div class="wx-job__meta">
          <span class="wx-job__status">{{ meta.label }}</span>
          <span class="wx-job__id">#{{ job.id }}</span>
        </div>
      </div>
      <div v-if="!hideActions" class="wx-job__actions">
        <slot name="actions" :job="job">
          <button
            v-if="job.status === 'failed'"
            type="button"
            class="wx-job__btn wx-job__btn--primary"
            @click="$emit('retry', job)"
          >
            thử lại
          </button>
          <button
            v-if="job.status === 'queued' || job.status === 'running'"
            type="button"
            class="wx-job__btn"
            @click="$emit('cancel', job)"
          >
            huỷ
          </button>
          <button
            type="button"
            class="wx-job__btn wx-job__btn--ghost"
            @click="$emit('logs', job)"
          >
            xem log
          </button>
        </slot>
      </div>
    </header>

    <div v-if="job.status === 'running' || job.status === 'queued'" class="wx-job__progress-wrap">
      <div
        class="wx-job__progress"
        :data-indeterminate="progressPct == null ? 'true' : 'false'"
        role="progressbar"
        :aria-valuenow="progressPct ?? undefined"
        :aria-valuemin="0"
        :aria-valuemax="100"
      >
        <div
          class="wx-job__progress-bar"
          :style="progressPct != null ? { width: progressPct + '%' } : undefined"
        />
      </div>
      <div class="wx-job__progress-meta">
        <span v-if="progressPct != null" class="wx-job__pct">{{ progressPct.toFixed(0) }}%</span>
        <span v-if="job.elapsed != null" class="wx-job__time">đã chạy {{ formatDuration(job.elapsed) }}</span>
        <span v-if="job.eta != null" class="wx-job__time">· còn ~{{ formatDuration(job.eta) }}</span>
      </div>
    </div>

    <p v-if="job.message" class="wx-job__message">{{ job.message }}</p>
  </article>
</template>

<style scoped>
.wx-job {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-4);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  box-shadow: var(--wx-shadow-md);
  font-family: var(--wx-font-primary);
}
.wx-job[data-status='running'] {
  border-color: var(--wx-info-border);
  background: linear-gradient(180deg, var(--wx-info-bg) 0%, var(--wx-surface-base) 60%);
}
.wx-job[data-status='failed']   { border-color: var(--wx-danger-border); }
.wx-job[data-status='success']  { border-color: var(--wx-success-border); }

.wx-job__head {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
}

.wx-job__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-neutral-bg);
  color: var(--wx-neutral-text);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-bold);
  flex-shrink: 0;
}
.wx-job__icon[data-intent='info']    { background: var(--wx-info-bg);    color: var(--wx-info-text); }
.wx-job__icon[data-intent='success'] { background: var(--wx-success-bg); color: var(--wx-success-text); }
.wx-job__icon[data-intent='danger']  { background: var(--wx-danger-bg);  color: var(--wx-danger-text); }
.wx-job__icon[data-intent='muted']   { background: var(--wx-disabled-bg); color: var(--wx-disabled-text); }

.wx-job__icon-glyph { display: inline-block; }
.wx-job__icon-glyph--spin {
  display: inline-block;
  animation: wx-job-spin 1s linear infinite;
}

.wx-job__title-wrap { flex: 1; min-width: 0; }
.wx-job__title {
  margin: 0;
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  letter-spacing: var(--wx-tracking-tight);
}
.wx-job__meta {
  display: flex;
  gap: var(--wx-space-2);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  margin-top: 2px;
}
.wx-job__id {
  font-family: var(--wx-font-mono);
  color: var(--wx-text-muted);
}

.wx-job__actions {
  display: flex;
  gap: var(--wx-space-1);
  flex-shrink: 0;
}
.wx-job__btn {
  font-family: inherit;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  padding: 4px 10px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  border: 1px solid var(--wx-border-default);
  cursor: pointer;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-job__btn:hover { background: var(--wx-hover-bg); }
.wx-job__btn--primary {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border-color: var(--wx-brand-primary);
}
.wx-job__btn--primary:hover { filter: brightness(0.95); background: var(--wx-brand-primary); }
.wx-job__btn--ghost { background: transparent; border-color: transparent; color: var(--wx-text-secondary); }
.wx-job__btn--ghost:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
.wx-job__btn:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

/* progress */
.wx-job__progress-wrap { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.wx-job__progress {
  height: 6px;
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-full);
  overflow: hidden;
}
.wx-job__progress-bar {
  height: 100%;
  background: var(--wx-gradient-button);
  border-radius: inherit;
  transition: width var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-job__progress[data-indeterminate='true'] .wx-job__progress-bar {
  width: 40% !important;
  background: var(--wx-gradient-button);
  animation: wx-job-indet 1.4s var(--wx-ease-standard) infinite;
}

.wx-job__progress-meta {
  display: flex;
  gap: var(--wx-space-1);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  letter-spacing: var(--wx-tracking-wide);
}
.wx-job__pct { color: var(--wx-text-secondary); font-weight: var(--wx-fw-medium); }

.wx-job__message {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  padding: var(--wx-space-2) var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
  font-family: var(--wx-font-mono);
  letter-spacing: var(--wx-tracking-wide);
}
.wx-job[data-status='failed'] .wx-job__message {
  background: var(--wx-danger-bg);
  border-color: var(--wx-danger-border);
  color: var(--wx-danger-text);
}

@keyframes wx-job-spin {
  to { transform: rotate(360deg); }
}

@keyframes wx-job-indet {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}

@media (prefers-reduced-motion: reduce) {
  .wx-job__icon-glyph--spin,
  .wx-job__progress[data-indeterminate='true'] .wx-job__progress-bar { animation-duration: 2.4s; }
}
</style>

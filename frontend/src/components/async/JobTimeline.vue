<script setup lang="ts">
/**
 * JobTimeline — list nhiều job theo thứ tự thời gian, dạng vertical timeline.
 *
 *   <JobTimeline :jobs="jobs" @retry="..." @cancel="..." @logs="..." />
 *
 *  Hiển thị nhóm theo ngày (hôm nay / hôm qua / xx/xx). Có chấm marker theo intent.
 */
import { computed } from 'vue'
import JobCard, { type Job, type JobStatus } from './JobCard.vue'

interface Props {
  jobs: Job[]
  /** ẩn nhóm theo ngày — render thẳng 1 list */
  flat?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  retry: [job: Job]
  cancel: [job: Job]
  logs: [job: Job]
}>()

const STATUS_INTENT: Record<JobStatus, string> = {
  queued: 'neutral',
  running: 'info',
  success: 'success',
  failed: 'danger',
  canceled: 'muted',
}

function dayKey(ts?: number): string {
  if (!ts) return '—'
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const same = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  if (same(d, today)) return 'hôm nay'
  if (same(d, yesterday)) return 'hôm qua'
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const grouped = computed(() => {
  if (props.flat) return [{ key: 'all', label: '', jobs: props.jobs }]
  const map = new Map<string, Job[]>()
  for (const j of props.jobs) {
    const k = dayKey(j.createdAt)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(j)
  }
  return Array.from(map.entries()).map(([label, jobs]) => ({ key: label, label, jobs }))
})
</script>

<template>
  <div class="wx-timeline" role="list">
    <section
      v-for="g in grouped"
      :key="g.key"
      class="wx-timeline__group"
    >
      <h4 v-if="g.label" class="wx-timeline__day">{{ g.label }}</h4>
      <ol class="wx-timeline__list">
        <li
          v-for="job in g.jobs"
          :key="job.id"
          class="wx-timeline__item"
          :data-intent="STATUS_INTENT[job.status]"
          role="listitem"
        >
          <span class="wx-timeline__marker" aria-hidden="true" />
          <JobCard
            :job="job"
            @retry="(j) => $emit('retry', j)"
            @cancel="(j) => $emit('cancel', j)"
            @logs="(j) => $emit('logs', j)"
          />
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.wx-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
  font-family: var(--wx-font-primary);
}
.wx-timeline__day {
  margin: 0 0 var(--wx-space-2);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-muted);
  text-transform: none;
  letter-spacing: var(--wx-tracking-wide);
}
.wx-timeline__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  position: relative;
}
.wx-timeline__list::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--wx-border-subtle);
  border-radius: 1px;
}

.wx-timeline__item {
  position: relative;
  display: flex;
  gap: var(--wx-space-3);
  padding-left: var(--wx-space-5);
}
.wx-timeline__marker {
  position: absolute;
  left: 0;
  top: var(--wx-space-4);
  width: 14px;
  height: 14px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-base);
  border: 2px solid var(--wx-neutral-solid);
  z-index: 1;
}
.wx-timeline__item[data-intent='info']    .wx-timeline__marker { border-color: var(--wx-info-solid); background: var(--wx-info-solid); }
.wx-timeline__item[data-intent='success'] .wx-timeline__marker { border-color: var(--wx-success-solid); background: var(--wx-success-solid); }
.wx-timeline__item[data-intent='danger']  .wx-timeline__marker { border-color: var(--wx-danger-solid); background: var(--wx-danger-solid); }
.wx-timeline__item[data-intent='muted']   .wx-timeline__marker { border-color: var(--wx-neutral-solid); background: var(--wx-disabled-bg); }
.wx-timeline__item[data-intent='neutral'] .wx-timeline__marker { border-color: var(--wx-neutral-border); background: var(--wx-neutral-bg); }

.wx-timeline__item :deep(.wx-job) {
  flex: 1;
}
</style>

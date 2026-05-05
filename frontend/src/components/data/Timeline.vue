<script setup lang="ts">
import { computed } from 'vue'

export interface TimelineItem {
  id: string | number
  ts: string
  title: string
  body?: string
  actor?: string
  icon?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<{
  items: TimelineItem[]
  groupByDay?: boolean
}>(), {
  groupByDay: true,
})

const grouped = computed(() => {
  if (!props.groupByDay) return [{ day: '', items: props.items }]
  const map = new Map<string, TimelineItem[]>()
  props.items.forEach((it) => {
    const day = it.ts.slice(0, 10)
    if (!map.has(day)) map.set(day, [])
    map.get(day)!.push(it)
  })
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([day, items]) => ({ day, items }))
})

function formatDay(day: string): string {
  if (!day) return ''
  const d = new Date(day)
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const ystr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10)
  if (day === todayStr) return 'Hôm nay'
  if (day === ystr) return 'Hôm qua'
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function timeOnly(ts: string): string {
  return ts.slice(11, 16)
}
</script>

<template>
  <div class="timeline">
    <div v-for="g in grouped" :key="g.day" class="timeline-group">
      <h4 v-if="groupByDay && g.day" class="timeline-day">{{ formatDay(g.day) }}</h4>
      <div class="timeline-list">
        <div
          v-for="item in g.items"
          :key="item.id"
          class="timeline-item"
          :class="`timeline-item--${item.variant ?? 'default'}`"
        >
          <div class="timeline-dot">
            <span v-if="item.icon" v-html="item.icon" />
          </div>
          <div class="timeline-content">
            <div class="timeline-meta">
              <time class="timeline-time">{{ timeOnly(item.ts) }}</time>
              <span v-if="item.actor" class="timeline-actor">{{ item.actor }}</span>
            </div>
            <div class="timeline-title">{{ item.title }}</div>
            <p v-if="item.body" class="timeline-body">{{ item.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-day {
  font-size: 12px;
  font-weight: 700;
  color: var(--wx-text-muted);
  margin: 0 0 12px;
  letter-spacing: 0.3px;
}

.timeline-list {
  position: relative;
  padding-left: 24px;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--wx-border-default);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: var(--wx-surface-base);
  border: 2px solid var(--wx-text-muted);
  border-radius: var(--wx-radius-full);
  color: var(--wx-text-muted);
  font-size: 10px;
  z-index: 1;
}

.timeline-item--success .timeline-dot { border-color: var(--wx-success-solid); color: var(--wx-success-solid); }
.timeline-item--warning .timeline-dot { border-color: var(--wx-warning-solid); color: var(--wx-warning-solid); }
.timeline-item--danger  .timeline-dot { border-color: var(--wx-danger-solid); color: var(--wx-danger-solid); }
.timeline-item--info    .timeline-dot { border-color: var(--wx-brand-primary); color: var(--wx-brand-primary); }

.timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--wx-text-muted);
}

.timeline-time {
  font-family: var(--wx-font-mono);
  color: var(--wx-text-muted);
}

.timeline-actor {
  font-weight: 600;
  color: var(--wx-text-secondary);
}

.timeline-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--wx-text-primary);
  line-height: 1.4;
}

.timeline-body {
  font-size: 12px;
  color: var(--wx-text-secondary);
  margin: 2px 0 0;
  line-height: 1.5;
}
</style>

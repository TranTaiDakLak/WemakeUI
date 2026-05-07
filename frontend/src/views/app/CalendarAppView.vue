<script setup lang="ts">
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge } from '../../components/common'
import { BaseCalendar } from '../../components/data'
import type { CalendarEvent } from '../../components/data'

const today = new Date()
function isoDay(offset: number) {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset).toISOString().slice(0, 10)
}

const EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Họp sprint planning', start: isoDay(1), variant: 'info' },
  { id: '2', title: 'Review code PR #301', start: isoDay(2), variant: 'success' },
  { id: '3', title: 'Demo phase 7 với stakeholders', start: isoDay(5), variant: 'warning' },
  { id: '4', title: 'Ngày nghỉ lễ', start: isoDay(7), variant: 'danger' },
  { id: '5', title: 'Training Vue 3', start: isoDay(0), variant: 'default' },
  { id: '6', title: 'Release v0.8.0', start: isoDay(10), variant: 'info' },
]
</script>

<template>
  <AppPageLayout section="app" current="lịch" page-title="Lịch công việc" page-description="Quản lý sự kiện và cuộc họp">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Sự kiện mới</BaseButton>
    </template>

    <div class="legend-row">
      <div v-for="[color, label] in [['blue', 'Cuộc họp'], ['green', 'Code review'], ['orange', 'Demo'], ['red', 'Nghỉ lễ'], ['purple', 'Học tập']]" :key="color" class="legend-item">
        <span class="legend-dot" :style="`background:${color === 'orange' ? '#f59e0b' : color};`" />
        <span>{{ label }}</span>
      </div>
    </div>

    <BaseCalendar :events="EVENTS" />
  </AppPageLayout>
</template>

<style scoped>
.legend-row { display: flex; gap: var(--wx-space-4); flex-wrap: wrap; align-items: center; }
.legend-item { display: flex; align-items: center; gap: var(--wx-space-2); font-size: var(--wx-fs-13); color: var(--wx-content-secondary); }
.legend-dot { width: 8px; height: 8px; border-radius: var(--wx-radius-full); }
</style>

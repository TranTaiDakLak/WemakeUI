<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { GroupBox } from '../../../components/common'
import { BaseCalendar } from '../../../components/data'
import type { CalendarEvent, CalendarView } from '../../../components/data'
import { useToast } from '../../../composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const today = new Date()
const todayStr = today.toISOString().slice(0, 10)
const tomorrow = new Date(today.getTime() + 86400000).toISOString().slice(0, 10)
const dayAfter = new Date(today.getTime() + 2 * 86400000).toISOString().slice(0, 10)
const yesterday = new Date(today.getTime() - 86400000).toISOString().slice(0, 10)

const view = ref<CalendarView>('month')
const selected = ref(todayStr)

const events = ref<CalendarEvent[]>([
  { id: 1, title: 'Họp standup', start: `${todayStr}T09:00:00`, variant: 'info' },
  { id: 2, title: 'Demo phase 4', start: `${todayStr}T14:30:00`, variant: 'success' },
  { id: 3, title: 'Kiểm tra deadline', start: `${todayStr}T16:00:00`, variant: 'warning' },
  { id: 4, title: 'Họp khách hàng', start: `${tomorrow}T10:00:00`, variant: 'info' },
  { id: 5, title: 'Code review', start: `${tomorrow}T15:00:00` },
  { id: 6, title: 'Triển khai release', start: `${dayAfter}T09:00:00`, variant: 'success' },
  { id: 7, title: 'Sự kiện đã qua', start: `${yesterday}T11:00:00`, variant: 'danger' },
])

function onEventClick(e: CalendarEvent) {
  showToast('info', `Sự kiện: ${e.title}`)
}

function onDateClick(d: string) {
  showToast('info', `Đã chọn ngày: ${d}`)
}
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · Calendar" subtitle="Phase 4 — data display" />
    <main class="main">
      <PageHeader title="BaseCalendar" description="Calendar component với 2 view: month grid + agenda. Hỗ trợ events nhiều màu.">
      </PageHeader>

      <GroupBox title="Calendar">
        <BaseCalendar v-model="selected" :events="events" :view="view" @update:view="(v) => view = v" @event-click="onEventClick" @date-click="onDateClick" />
      </GroupBox>

      <GroupBox title="Trạng thái hiện tại">
        <p>View đang dùng: <b>{{ view }}</b></p>
        <p>Ngày được chọn: <b>{{ selected }}</b></p>
        <p>Tổng số sự kiện: <b>{{ events.length }}</b></p>
      </GroupBox>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
p { font-size: 13px; margin: 4px 0; color: var(--wx-text-secondary); }
p b { color: var(--wx-brand-primary); }
</style>

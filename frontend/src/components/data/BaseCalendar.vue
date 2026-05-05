<script setup lang="ts">
import { ref, computed } from 'vue'

export type CalendarView = 'month' | 'agenda'

export interface CalendarEvent {
  id: string | number
  title: string
  start: string  // ISO date or datetime
  end?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  allDay?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: string  // YYYY-MM-DD currently selected
  events?: CalendarEvent[]
  view?: CalendarView
}>(), {
  events: () => [],
  view: 'month',
})

const emit = defineEmits<{
  'update:modelValue': [date: string]
  'update:view': [view: CalendarView]
  'event-click': [event: CalendarEvent]
  'date-click': [date: string]
}>()

/* ── Cursor (hiển thị tháng nào) ──────────────────── */
const today = new Date()
const cursor = ref(new Date(props.modelValue ?? today.toISOString().slice(0, 10)))

const monthLabel = computed(() => {
  return cursor.value.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
})

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

interface DayCell {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

const monthGrid = computed<DayCell[]>(() => {
  const first = new Date(cursor.value.getFullYear(), cursor.value.getMonth(), 1)
  // Map Sunday=0 → 6, Monday=1 → 0
  const startWeekday = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - startWeekday)

  const cells: DayCell[] = []
  const todayStr = today.toISOString().slice(0, 10)
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    cells.push({
      date: iso,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === cursor.value.getMonth(),
      isToday: iso === todayStr,
      events: props.events.filter((e) => e.start.slice(0, 10) === iso),
    })
  }
  return cells
})

/* ── Agenda view ──────────────────────────────────── */
const agendaItems = computed(() => {
  const sorted = [...props.events].sort((a, b) => a.start.localeCompare(b.start))
  const groups = new Map<string, CalendarEvent[]>()
  sorted.forEach((e) => {
    const day = e.start.slice(0, 10)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(e)
  })
  return Array.from(groups.entries()).map(([day, items]) => ({ day, items }))
})

/* ── Navigation ───────────────────────────────────── */
function prevMonth() {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() - 1, 1)
}
function nextMonth() {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1, 1)
}
function goToday() {
  cursor.value = new Date()
}

function selectDate(iso: string) {
  emit('update:modelValue', iso)
  emit('date-click', iso)
}

function setView(v: CalendarView) {
  emit('update:view', v)
}

function formatDay(day: string): string {
  const d = new Date(day)
  const todayStr = today.toISOString().slice(0, 10)
  const ystr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10)
  const tomorrow = new Date(today.getTime() + 86400000).toISOString().slice(0, 10)
  if (day === todayStr) return 'Hôm nay'
  if (day === ystr) return 'Hôm qua'
  if (day === tomorrow) return 'Ngày mai'
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })
}

function timeOnly(ts: string): string {
  if (ts.length <= 10) return 'cả ngày'
  return ts.slice(11, 16)
}
</script>

<template>
  <div class="calendar">
    <!-- Toolbar -->
    <div class="calendar-toolbar">
      <div class="calendar-nav">
        <button type="button" class="cal-btn" @click="prevMonth" aria-label="Tháng trước">‹</button>
        <button type="button" class="cal-btn cal-btn--today" @click="goToday">Hôm nay</button>
        <button type="button" class="cal-btn" @click="nextMonth" aria-label="Tháng sau">›</button>
      </div>
      <h3 class="calendar-title">{{ monthLabel }}</h3>
      <div class="calendar-view">
        <button
          type="button"
          class="cal-btn"
          :class="{ 'cal-btn--active': view === 'month' }"
          @click="setView('month')"
        >Tháng</button>
        <button
          type="button"
          class="cal-btn"
          :class="{ 'cal-btn--active': view === 'agenda' }"
          @click="setView('agenda')"
        >Agenda</button>
      </div>
    </div>

    <!-- Month view -->
    <div v-if="view === 'month'" class="calendar-month">
      <div class="calendar-week-header">
        <div v-for="d in weekDays" :key="d" class="calendar-week-day">{{ d }}</div>
      </div>
      <div class="calendar-grid">
        <button
          v-for="cell in monthGrid"
          :key="cell.date"
          type="button"
          class="calendar-cell"
          :class="{
            'calendar-cell--out': !cell.isCurrentMonth,
            'calendar-cell--today': cell.isToday,
            'calendar-cell--selected': cell.date === modelValue,
          }"
          @click="selectDate(cell.date)"
        >
          <span class="calendar-cell__day">{{ cell.day }}</span>
          <div class="calendar-cell__events">
            <span
              v-for="e in cell.events.slice(0, 3)"
              :key="e.id"
              class="calendar-event"
              :class="`calendar-event--${e.variant ?? 'default'}`"
              :title="e.title"
              @click.stop="$emit('event-click', e)"
            >
              {{ e.title }}
            </span>
            <span v-if="cell.events.length > 3" class="calendar-event-more">
              +{{ cell.events.length - 3 }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Agenda view -->
    <div v-else class="calendar-agenda">
      <div v-if="!agendaItems.length" class="agenda-empty">Không có sự kiện</div>
      <div v-for="g in agendaItems" :key="g.day" class="agenda-group">
        <h4 class="agenda-day">{{ formatDay(g.day) }}</h4>
        <div class="agenda-list">
          <button
            v-for="e in g.items"
            :key="e.id"
            type="button"
            class="agenda-item"
            :class="`agenda-item--${e.variant ?? 'default'}`"
            @click="$emit('event-click', e)"
          >
            <span class="agenda-time">{{ timeOnly(e.start) }}</span>
            <span class="agenda-title">{{ e.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
  font-family: var(--wx-font-primary);
}

.calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.calendar-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--wx-text-primary);
  margin: 0;
  text-transform: capitalize;
}

.calendar-view {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  padding: 2px;
}

.cal-btn {
  padding: 5px 12px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  cursor: pointer;
  color: var(--wx-text-secondary);
  font-family: var(--wx-font-primary);
  transition: all var(--wx-duration-fast);
}

.cal-btn:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.cal-btn--today {
  font-weight: 600;
}

.cal-btn--active {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border-color: var(--wx-brand-primary);
}

.calendar-view .cal-btn {
  border: none;
  background: transparent;
}

.calendar-view .cal-btn--active {
  background: var(--wx-brand-primary);
}

.calendar-week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
}

.calendar-week-day {
  padding: 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--wx-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, 1fr);
}

.calendar-cell {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  padding: 4px;
  background: var(--wx-surface-base);
  border-right: 1px solid var(--wx-border-subtle);
  border-bottom: 1px solid var(--wx-border-subtle);
  cursor: pointer;
  transition: background var(--wx-duration-fast);
  font-family: var(--wx-font-primary);
}

.calendar-cell:hover {
  background: var(--wx-hover-bg);
}

.calendar-cell--out {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
}

.calendar-cell__day {
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-text-primary);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-full);
}

.calendar-cell--out .calendar-cell__day {
  color: var(--wx-text-muted);
}

.calendar-cell--today .calendar-cell__day {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
}

.calendar-cell--selected {
  background: var(--wx-info-bg);
}

.calendar-cell__events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.calendar-event {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  background: var(--wx-info-bg);
  color: var(--wx-info-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}

.calendar-event--success { background: var(--wx-success-bg); color: var(--wx-success-text); }
.calendar-event--warning { background: var(--wx-warning-bg); color: var(--wx-warning-text); }
.calendar-event--danger { background: var(--wx-danger-bg); color: var(--wx-danger-text); }

.calendar-event-more {
  font-size: 10px;
  color: var(--wx-text-muted);
  padding: 1px 6px;
  font-weight: 600;
}

/* Agenda */
.calendar-agenda {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agenda-empty {
  text-align: center;
  padding: 32px;
  color: var(--wx-text-muted);
  font-size: 13px;
}

.agenda-day {
  font-size: 12px;
  font-weight: 700;
  color: var(--wx-text-muted);
  margin: 0 0 8px;
  letter-spacing: 0.3px;
  text-transform: capitalize;
}

.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agenda-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  text-align: left;
  cursor: pointer;
  font-family: var(--wx-font-primary);
  transition: all var(--wx-duration-fast);
}

.agenda-item:hover {
  border-color: var(--wx-brand-primary);
  background: var(--wx-hover-bg);
  transform: translateX(2px);
}

.agenda-time {
  font-family: var(--wx-font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--wx-brand-primary);
  min-width: 60px;
}

.agenda-item--success .agenda-time { color: var(--wx-success-solid); }
.agenda-item--warning .agenda-time { color: var(--wx-warning-solid); }
.agenda-item--danger  .agenda-time { color: var(--wx-danger-solid); }

.agenda-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--wx-text-primary);
}
</style>

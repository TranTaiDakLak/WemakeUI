<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge } from '../../components/common'

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success'

interface LogEntry {
  id: number
  ts: string
  level: LogLevel
  session: string
  msg: string
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  info: 'var(--wx-status-info-text)',
  warn: 'var(--wx-status-warning-text)',
  error: 'var(--wx-status-danger-text)',
  debug: 'var(--wx-content-muted)',
  success: 'var(--wx-status-success-text)',
}

const SAMPLE_MSGS: { level: LogLevel; session: string; msg: string }[] = [
  { level: 'info', session: 'WA-001', msg: 'Message received from +84912345678' },
  { level: 'success', session: 'WA-001', msg: 'Auto-reply sent successfully' },
  { level: 'info', session: 'WA-002', msg: 'New connection established' },
  { level: 'warn', session: 'WA-003', msg: 'Rate limit approaching (85/100)' },
  { level: 'error', session: 'WA-005', msg: 'Connection lost — retry in 30s' },
  { level: 'debug', session: 'WA-002', msg: 'Webhook payload dispatched to http://localhost:3000/wh' },
  { level: 'info', session: 'WA-004', msg: 'Campaign batch 3/5 queued (200 messages)' },
  { level: 'success', session: 'WA-004', msg: 'Plugin ChatGPT: response generated in 1.2s' },
]

let idSeq = 1
function makeLog(): LogEntry {
  const sample = SAMPLE_MSGS[Math.floor(Math.random() * SAMPLE_MSGS.length)]
  const now = new Date()
  const ts = now.toTimeString().slice(0, 8) + '.' + String(now.getMilliseconds()).padStart(3, '0')
  return { id: idSeq++, ts, ...sample }
}

const logs = ref<LogEntry[]>([])
const filterLevel = ref<LogLevel | 'all'>('all')
const filterSession = ref('all')
const paused = ref(false)
const logEl = ref<HTMLElement | null>(null)

const SESSIONS = ['all', 'WA-001', 'WA-002', 'WA-003', 'WA-004', 'WA-005']
const LEVELS: (LogLevel | 'all')[] = ['all', 'info', 'success', 'warn', 'error', 'debug']

const filtered = () => logs.value.filter(l =>
  (filterLevel.value === 'all' || l.level === filterLevel.value) &&
  (filterSession.value === 'all' || l.session === filterSession.value)
)

async function appendLog() {
  if (paused.value) return
  logs.value.push(makeLog())
  if (logs.value.length > 500) logs.value.splice(0, logs.value.length - 500)
  await nextTick()
  if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight
}

function clearLogs() { logs.value = [] }

let interval: ReturnType<typeof setInterval>
onMounted(() => {
  for (let i = 0; i < 30; i++) logs.value.push(makeLog())
  interval = setInterval(appendLog, 1200)
})
onUnmounted(() => clearInterval(interval))
</script>

<template>
  <AppPageLayout section="wemakeui" current="console" page-title="Console" page-description="Xem log thời gian thực từ tất cả session">
    <template #actions>
      <BaseButton size="sm" :variant="paused ? 'primary' : 'ghost'" @click="paused = !paused">
        {{ paused ? '▶ Tiếp tục' : '⏸ Tạm dừng' }}
      </BaseButton>
      <BaseButton size="sm" variant="ghost" @click="clearLogs">Xóa log</BaseButton>
    </template>

    <div class="console-wrap">
      <div class="console-toolbar">
        <div class="filter-group">
          <span class="filter-label">Session:</span>
          <button v-for="s in SESSIONS" :key="s" class="filter-btn" :class="{ active: filterSession === s }" @click="filterSession = s">{{ s }}</button>
        </div>
        <div class="filter-group">
          <span class="filter-label">Level:</span>
          <button v-for="lv in LEVELS" :key="lv" class="filter-btn" :class="['lvl-' + lv, { active: filterLevel === lv }]" @click="filterLevel = lv as LogLevel | 'all'">{{ lv }}</button>
        </div>
        <BaseBadge :text="`${filtered().length} entries`" variant="neutral" size="sm" />
      </div>

      <div ref="logEl" class="console-body">
        <div v-for="log in filtered()" :key="log.id" class="log-line">
          <span class="log-ts">{{ log.ts }}</span>
          <span class="log-session">{{ log.session }}</span>
          <span class="log-level" :style="{ color: LEVEL_COLORS[log.level] }">{{ log.level.toUpperCase().padEnd(7) }}</span>
          <span class="log-msg">{{ log.msg }}</span>
        </div>
        <div v-if="filtered().length === 0" class="empty-log">Không có log nào phù hợp</div>
      </div>

      <div class="console-statusbar">
        <span>{{ paused ? '⏸ Đã tạm dừng' : '● Live' }}</span>
        <span>{{ logs.length }} / 500 entries</span>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.console-wrap { display: flex; flex-direction: column; gap: 0; background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.console-toolbar { display: flex; align-items: center; gap: var(--wx-space-4); flex-wrap: wrap; padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-default); background: var(--wx-bg-sunken); }
.filter-group { display: flex; align-items: center; gap: var(--wx-space-1); }
.filter-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-right: var(--wx-space-1); }
.filter-btn { font-family: var(--wx-font-mono); font-size: var(--wx-fs-11); padding: 2px 8px; border-radius: var(--wx-radius-sm); border: 1px solid var(--wx-border-default); background: transparent; color: var(--wx-content-secondary); cursor: pointer; }
.filter-btn.active { background: var(--wx-brand-600); color: #fff; border-color: var(--wx-brand-600); }
.filter-btn.lvl-warn { color: var(--wx-status-warning-text); }
.filter-btn.lvl-error { color: var(--wx-status-danger-text); }
.filter-btn.lvl-success { color: var(--wx-status-success-text); }
.filter-btn.lvl-info { color: var(--wx-status-info-text); }
.console-body { height: 480px; overflow-y: auto; font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); background: #0d1117; color: #c9d1d9; padding: var(--wx-space-2) 0; }
.log-line { display: flex; gap: var(--wx-space-3); padding: 2px var(--wx-space-4); line-height: 1.5; }
.log-line:hover { background: rgba(255,255,255,0.04); }
.log-ts { color: #6e7681; flex-shrink: 0; }
.log-session { color: #58a6ff; flex-shrink: 0; width: 60px; }
.log-level { flex-shrink: 0; width: 56px; }
.log-msg { color: #c9d1d9; }
.empty-log { padding: var(--wx-space-6); text-align: center; color: #6e7681; }
.console-statusbar { display: flex; justify-content: space-between; padding: var(--wx-space-2) var(--wx-space-4); border-top: 1px solid var(--wx-border-default); background: var(--wx-bg-sunken); font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-family: var(--wx-font-mono); }
</style>

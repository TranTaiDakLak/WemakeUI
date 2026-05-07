<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { BaseButton, GroupBox } from '../../../components/common'
import { LogViewer } from '../../../components/data'
import type { LogEntry, LogLevel } from '../../../components/data'

const router = useRouter()

const logs = ref<LogEntry[]>([])
let nextId = 1
let streamTimer: ReturnType<typeof setInterval> | null = null

const sampleMessages: Array<{ level: LogLevel; msg: string; details?: string }> = [
  { level: 'info', msg: 'server started on :3000' },
  { level: 'info', msg: 'database connection pool initialized (10 connections)' },
  { level: 'debug', msg: 'middleware: request.id=req_abc123', details: 'request_id: req_abc123\nuser_agent: Mozilla/5.0\nip: 192.168.1.1' },
  { level: 'warn', msg: 'slow query detected (1.2s)', details: 'SELECT * FROM users WHERE email LIKE %x%\ntime: 1234ms\nrows: 50000' },
  { level: 'info', msg: 'GET /api/users 200 (45ms)' },
  { level: 'info', msg: 'POST /api/login 200 (120ms)' },
  { level: 'error', msg: 'connection refused to redis', details: 'Error: connect ECONNREFUSED 127.0.0.1:6379\n  at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)' },
  { level: 'warn', msg: 'rate limit hit for /api/search' },
  { level: 'info', msg: 'cache miss for key: user_profile_123' },
  { level: 'debug', msg: 'gc: heap_used=120MB heap_total=256MB' },
  { level: 'error', msg: 'unhandled promise rejection', details: 'TypeError: Cannot read property "name" of undefined\n  at processData (server.js:45:12)\n  at async run (server.js:78:5)' },
  { level: 'info', msg: 'job completed: email_batch_send (1240 emails sent)' },
  { level: 'warn', msg: 'memory usage > 80%' },
  { level: 'info', msg: 'scheduled task started: cleanup_expired_tokens' },
  { level: 'debug', msg: 'cron tick at 12:34:56' },
]

function generateInitial() {
  logs.value = []
  nextId = 1
  for (let i = 0; i < 30; i++) {
    const sample = sampleMessages[i % sampleMessages.length]
    logs.value.push({
      id: nextId++,
      ts: new Date(Date.now() - (30 - i) * 1000).toISOString().replace('T', ' ').slice(0, 19),
      level: sample.level,
      message: sample.msg,
      details: sample.details,
    })
  }
}

function appendOne() {
  const sample = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
  logs.value.push({
    id: nextId++,
    ts: new Date().toISOString().replace('T', ' ').slice(0, 19),
    level: sample.level,
    message: sample.msg,
    details: sample.details,
  })
  // Keep within max 5000 to demo rolling buffer
  if (logs.value.length > 5000) logs.value.shift()
}

function startStream() {
  if (streamTimer) return
  streamTimer = setInterval(appendOne, 600)
}

function stopStream() {
  if (streamTimer) {
    clearInterval(streamTimer)
    streamTimer = null
  }
}

function burst() {
  for (let i = 0; i < 200; i++) appendOne()
}

generateInitial()
startStream()

onBeforeUnmount(stopStream)
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · LogViewer" subtitle="Phase 4 — data display" />
    <main class="main">
      <PageHeader title="LogViewer" description="Streaming log viewer với virtual scroll, level filter, search highlight, follow toggle, download .log.">
      </PageHeader>

      <GroupBox title="Stream control">
        <div class="row">
          <BaseButton v-if="!streamTimer" size="sm" variant="primary" @click="startStream">▶ Bắt đầu stream</BaseButton>
          <BaseButton v-else size="sm" variant="danger" @click="stopStream">⏸ Dừng stream</BaseButton>
          <BaseButton size="sm" variant="ghost" @click="burst">+200 dòng burst</BaseButton>
          <BaseButton size="sm" variant="ghost" @click="generateInitial">Reset</BaseButton>
          <span class="muted">Đang có {{ logs.length }} log · {{ streamTimer ? 'streaming...' : 'paused' }}</span>
        </div>
      </GroupBox>

      <GroupBox title="LogViewer (virtual scroll)">
        <div class="muted" style="margin-bottom: 8px;">
          <b>Hướng dẫn:</b> bấm vào dòng có <code>▸</code> để mở chi tiết · search highlight với <mark>mark</mark> · scroll lên sẽ hiện badge "+N log mới ↓" · cuộn xuống đáy auto bật follow lại
        </div>
        <div style="height: 540px;">
          <LogViewer :logs="logs" />
        </div>
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
.row { display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center; }
.muted { color: var(--wx-text-muted); font-size: 12px; }
.muted code { font-family: var(--wx-font-mono); background: var(--wx-surface-sunken); padding: 1px 4px; border-radius: 3px; }
.muted mark { background: var(--wx-warning-bg); color: var(--wx-warning-text); padding: 0 4px; border-radius: 3px; }
</style>

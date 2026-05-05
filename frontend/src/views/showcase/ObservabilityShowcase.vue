<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BaseBadge } from '../../components/common'

/* ── Simulated metrics ──────────────────────────────────────── */
interface MetricPoint { t: number; v: number }

const errorRates = ref<MetricPoint[]>([])
const responseMs = ref<MetricPoint[]>([])
const throughput = ref<MetricPoint[]>([])

const NOW = () => Date.now()

function addPoint(arr: typeof errorRates.value, v: number) {
  arr.push({ t: NOW(), v })
  if (arr.length > 60) arr.splice(0, arr.length - 60)
}

let ticker: ReturnType<typeof setInterval>

function tick() {
  addPoint(errorRates.value, Math.random() * 3)
  addPoint(responseMs.value, 80 + Math.random() * 120 + (Math.random() > 0.9 ? 400 : 0))
  addPoint(throughput.value, 200 + Math.random() * 80)
}

onMounted(() => {
  for (let i = 0; i < 40; i++) tick()
  ticker = setInterval(tick, 2000)
})
onUnmounted(() => clearInterval(ticker))

function sparkPath(pts: MetricPoint[], w: number, h: number) {
  if (pts.length < 2) return ''
  const vals = pts.map(p => p.v)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  return pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w
    const y = h - ((p.v - min) / range) * (h - 4) - 2
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

/* ── Error log simulation ────────────────────────────────────── */
interface ErrorEntry {
  id: number
  ts: string
  level: 'error' | 'warn' | 'critical'
  msg: string
  count: number
  resolved: boolean
}

const ERRORS = ref<ErrorEntry[]>([
  { id: 1, ts: '10:31:02', level: 'critical', msg: 'Unhandled promise rejection: Network timeout', count: 3, resolved: false },
  { id: 2, ts: '10:28:47', level: 'error', msg: 'TypeError: Cannot read properties of undefined (reading "id")', count: 1, resolved: false },
  { id: 3, ts: '10:22:15', level: 'warn', msg: 'Deprecated API used: BaseToast.show() — use useToast() instead', count: 12, resolved: true },
  { id: 4, ts: '10:18:33', level: 'error', msg: 'Chunk load failed: /assets/DataGrid.abc123.js', count: 2, resolved: true },
  { id: 5, ts: '09:55:01', level: 'warn', msg: 'Long task detected: 180ms blocking main thread', count: 7, resolved: false },
])

function resolve(id: number) {
  const e = ERRORS.value.find(e => e.id === id)
  if (e) e.resolved = true
}

/* ── Service health ──────────────────────────────────────────── */
interface ServiceStatus {
  name: string
  status: 'up' | 'degraded' | 'down'
  latency: number
  uptime: number
}

const SERVICES = ref<ServiceStatus[]>([
  { name: 'API Gateway', status: 'up', latency: 12, uptime: 99.97 },
  { name: 'Auth Service', status: 'up', latency: 8, uptime: 99.99 },
  { name: 'Database (Primary)', status: 'up', latency: 3, uptime: 100 },
  { name: 'Database (Replica)', status: 'degraded', latency: 145, uptime: 98.2 },
  { name: 'File Storage', status: 'up', latency: 34, uptime: 99.95 },
  { name: 'Email Service', status: 'down', latency: 0, uptime: 91.4 },
  { name: 'Push Notifications', status: 'up', latency: 22, uptime: 99.8 },
])

const statusVariant = (s: string) =>
  s === 'up' ? 'success' : s === 'degraded' ? 'warning' : 'danger'
</script>

<template>
  <div class="obs-page">
    <div class="page-header">
      <h1 class="page-title">Observability Dashboard</h1>
      <p class="page-desc">Metrics, error tracking, và service health realtime. Mô phỏng hệ thống giám sát production.</p>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">Error Rate</div>
        <div class="kpi-value err">{{ (errorRates[errorRates.length - 1]?.v ?? 0).toFixed(2) }}%</div>
        <svg class="spark" viewBox="0 0 120 32" preserveAspectRatio="none">
          <path :d="sparkPath(errorRates, 120, 32)" fill="none" stroke="var(--wx-status-danger-text)" stroke-width="1.5" />
        </svg>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Avg Response</div>
        <div class="kpi-value" :class="{ warn: (responseMs[responseMs.length - 1]?.v ?? 0) > 200 }">
          {{ Math.round(responseMs[responseMs.length - 1]?.v ?? 0) }}ms
        </div>
        <svg class="spark" viewBox="0 0 120 32" preserveAspectRatio="none">
          <path :d="sparkPath(responseMs, 120, 32)" fill="none" stroke="var(--wx-status-info-text)" stroke-width="1.5" />
        </svg>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Throughput</div>
        <div class="kpi-value ok">{{ Math.round(throughput[throughput.length - 1]?.v ?? 0) }}<span class="kpi-unit">req/min</span></div>
        <svg class="spark" viewBox="0 0 120 32" preserveAspectRatio="none">
          <path :d="sparkPath(throughput, 120, 32)" fill="none" stroke="var(--wx-status-success-text)" stroke-width="1.5" />
        </svg>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Active Errors</div>
        <div class="kpi-value err">{{ ERRORS.filter(e => !e.resolved).length }}</div>
        <div class="kpi-sub">{{ ERRORS.filter(e => e.resolved).length }} resolved</div>
      </div>
    </div>

    <!-- Service health -->
    <div class="section">
      <div class="section-title">Service Health</div>
      <div class="services-grid">
        <div v-for="svc in SERVICES" :key="svc.name" class="svc-card" :class="svc.status">
          <div class="svc-dot" :class="svc.status"></div>
          <div class="svc-info">
            <div class="svc-name">{{ svc.name }}</div>
            <div class="svc-meta">
              <BaseBadge :text="svc.status" :variant="statusVariant(svc.status)" dot size="sm" />
              <span class="svc-latency">{{ svc.status === 'down' ? '—' : `${svc.latency}ms` }}</span>
              <span class="svc-uptime">{{ svc.uptime }}% uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error tracking -->
    <div class="section">
      <div class="section-title">Error Tracking</div>
      <div class="error-list">
        <div v-for="err in ERRORS" :key="err.id" class="error-row" :class="{ resolved: err.resolved }">
          <div class="err-left">
            <BaseBadge
              :text="err.level"
              :variant="err.level === 'critical' ? 'danger' : err.level === 'error' ? 'danger' : 'warning'"
              size="sm"
            />
            <div class="err-body">
              <code class="err-msg">{{ err.msg }}</code>
              <div class="err-meta">
                <span class="err-ts">{{ err.ts }}</span>
                <span class="err-count">{{ err.count }}× occurrences</span>
              </div>
            </div>
          </div>
          <div class="err-right">
            <span v-if="err.resolved" class="resolved-label">✓ Resolved</span>
            <button v-else class="resolve-btn" @click="resolve(err.id)">Resolve</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Response time histogram -->
    <div class="section">
      <div class="section-title">Response Time Distribution</div>
      <div class="histogram">
        <div v-for="(bar, i) in [8, 24, 45, 62, 51, 38, 22, 14, 9, 5, 3, 2]" :key="i" class="hist-col">
          <div class="hist-bar" :style="{ height: bar + '%' }" :class="{ slow: i > 8 }"></div>
          <div class="hist-label">{{ (i + 1) * 50 }}ms</div>
        </div>
      </div>
      <div class="hist-legend">
        <span class="legend-item normal">Normal (&lt;400ms)</span>
        <span class="legend-item slow">Slow (≥400ms)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.obs-page { display: flex; flex-direction: column; gap: var(--wx-space-6); }
.page-header { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.page-title { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); margin: 0; }
.page-desc { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: 0; }

.kpi-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--wx-space-4); }
.kpi-card { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); padding: var(--wx-space-4); display: flex; flex-direction: column; gap: var(--wx-space-2); }
.kpi-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); text-transform: uppercase; letter-spacing: 0.5px; }
.kpi-value { font-size: var(--wx-fs-28); font-weight: var(--wx-fw-bold); font-variant-numeric: tabular-nums; line-height: 1; }
.kpi-value.ok { color: var(--wx-status-success-text); }
.kpi-value.err { color: var(--wx-status-danger-text); }
.kpi-value.warn { color: var(--wx-status-warning-text); }
.kpi-unit { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-normal); color: var(--wx-content-muted); margin-left: 4px; }
.kpi-sub { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.spark { width: 100%; height: 32px; }

.section { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.section-title { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); }

.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--wx-space-3); }
.svc-card { display: flex; align-items: center; gap: var(--wx-space-3); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); padding: var(--wx-space-3) var(--wx-space-4); }
.svc-card.down { border-color: color-mix(in srgb, var(--wx-status-danger-text) 30%, transparent); background: color-mix(in srgb, var(--wx-status-danger-text) 4%, var(--wx-bg-base)); }
.svc-card.degraded { border-color: color-mix(in srgb, var(--wx-status-warning-text) 30%, transparent); }
.svc-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.svc-dot.up { background: var(--wx-status-success-text); box-shadow: 0 0 6px var(--wx-status-success-text); }
.svc-dot.degraded { background: var(--wx-status-warning-text); }
.svc-dot.down { background: var(--wx-status-danger-text); }
.svc-info { flex: 1; min-width: 0; }
.svc-name { font-weight: var(--wx-fw-medium); font-size: var(--wx-fs-14); margin-bottom: 4px; }
.svc-meta { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.svc-latency, .svc-uptime { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-family: var(--wx-font-mono); }

.error-list { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.error-row { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--wx-space-4); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); padding: var(--wx-space-3) var(--wx-space-4); transition: opacity 0.2s; }
.error-row.resolved { opacity: 0.5; }
.err-left { display: flex; align-items: flex-start; gap: var(--wx-space-3); flex: 1; min-width: 0; }
.err-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.err-msg { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-primary); word-break: break-word; }
.err-meta { display: flex; gap: var(--wx-space-3); font-size: var(--wx-fs-11); color: var(--wx-content-muted); font-family: var(--wx-font-mono); }
.err-right { flex-shrink: 0; }
.resolve-btn { font-size: var(--wx-fs-12); padding: 3px 10px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-sm); background: transparent; color: var(--wx-content-secondary); cursor: pointer; }
.resolve-btn:hover { background: var(--wx-bg-sunken); }
.resolved-label { font-size: var(--wx-fs-12); color: var(--wx-status-success-text); font-family: var(--wx-font-mono); }

.histogram { display: flex; align-items: flex-end; gap: 6px; height: 100px; padding: var(--wx-space-3); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); }
.hist-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; height: 100%; justify-content: flex-end; }
.hist-bar { width: 100%; background: var(--wx-brand-600); border-radius: 3px 3px 0 0; min-height: 4px; transition: height 0.5s ease; }
.hist-bar.slow { background: var(--wx-status-warning-text); }
.hist-label { font-size: 9px; color: var(--wx-content-muted); font-family: var(--wx-font-mono); white-space: nowrap; }
.hist-legend { display: flex; gap: var(--wx-space-4); font-size: var(--wx-fs-12); }
.legend-item { display: flex; align-items: center; gap: 6px; color: var(--wx-content-secondary); }
.legend-item::before { content: ''; display: inline-block; width: 12px; height: 3px; border-radius: 2px; }
.legend-item.normal::before { background: var(--wx-brand-600); }
.legend-item.slow::before { background: var(--wx-status-warning-text); }
</style>

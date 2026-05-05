<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  id: number
  ts: string
  level: LogLevel
  message: string
  details?: string
}

const props = withDefaults(defineProps<{
  logs: LogEntry[]
  rowHeight?: number
  maxRows?: number
}>(), {
  rowHeight: 24,
  maxRows: 10000,
})

const emit = defineEmits<{
  download: [filtered: LogEntry[]]
}>()

const allLevels: LogLevel[] = ['debug', 'info', 'warn', 'error']
const enabled = ref<Set<LogLevel>>(new Set(allLevels))
const search = ref('')
const follow = ref(true)
const expanded = ref<Set<number>>(new Set())
const newCount = ref(0)

/* ── Filter ──────────────────────────── */
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return props.logs.filter((l) => {
    if (!enabled.value.has(l.level)) return false
    if (!q) return true
    return l.message.toLowerCase().includes(q) || (l.details?.toLowerCase().includes(q) ?? false)
  })
})

/* ── Virtual scroll ──────────────────── */
const scrollEl = ref<HTMLElement>()
const scrollTop = ref(0)
const containerHeight = ref(360)

const totalHeight = computed(() => filtered.value.length * props.rowHeight)
const startIdx = computed(() => Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - 5))
const endIdx = computed(() =>
  Math.min(filtered.value.length, Math.ceil((scrollTop.value + containerHeight.value) / props.rowHeight) + 5),
)
const visible = computed(() => filtered.value.slice(startIdx.value, endIdx.value))
const offsetY = computed(() => startIdx.value * props.rowHeight)

function onScroll() {
  if (!scrollEl.value) return
  scrollTop.value = scrollEl.value.scrollTop
  // If user scrolls up, auto-disable follow
  const atBottom = scrollEl.value.scrollHeight - scrollEl.value.scrollTop - scrollEl.value.clientHeight < 8
  if (!atBottom && follow.value) follow.value = false
  if (atBottom) newCount.value = 0
}

function updateContainerHeight() {
  if (scrollEl.value) containerHeight.value = scrollEl.value.clientHeight
}

function scrollToBottom() {
  if (!scrollEl.value) return
  scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  newCount.value = 0
}

watch(() => props.logs.length, async () => {
  await nextTick()
  if (follow.value) {
    scrollToBottom()
  } else {
    newCount.value++
  }
})

onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
  if (follow.value) scrollToBottom()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerHeight)
})

/* ── Helpers ─────────────────────────── */
function toggleLevel(lvl: LogLevel) {
  const next = new Set(enabled.value)
  if (next.has(lvl)) next.delete(lvl)
  else next.add(lvl)
  enabled.value = next
}

function toggleExpand(id: number) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function highlight(text: string): string {
  const q = search.value.trim()
  if (!q) return escapeHtml(text)
  const escaped = escapeHtml(text)
  const re = new RegExp(escapeReg(q), 'gi')
  return escaped.replace(re, (m) => `<mark>${m}</mark>`)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function downloadLog() {
  emit('download', filtered.value)
  const text = filtered.value.map((l) => `${l.ts} ${l.level.toUpperCase().padEnd(5)} ${l.message}${l.details ? '\n' + l.details : ''}`).join('\n')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `logs-${Date.now()}.log`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="log-viewer">
    <!-- Toolbar -->
    <div class="log-toolbar">
      <input
        v-model="search"
        type="search"
        placeholder="Tìm trong log..."
        class="log-search"
      />
      <div class="log-levels">
        <button
          v-for="lvl in allLevels"
          :key="lvl"
          type="button"
          class="log-level-btn"
          :class="[`log-level-btn--${lvl}`, { 'log-level-btn--active': enabled.has(lvl) }]"
          @click="toggleLevel(lvl)"
        >{{ lvl }}</button>
      </div>
      <button
        type="button"
        class="log-tool-btn"
        :class="{ 'log-tool-btn--active': follow }"
        @click="follow = !follow; if (follow) scrollToBottom()"
      >
        {{ follow ? '▶ Đang theo dõi' : '⏸ Đã dừng' }}
      </button>
      <button type="button" class="log-tool-btn" @click="downloadLog">⬇ Tải</button>
      <span class="log-count">{{ filtered.length }} dòng</span>
    </div>

    <!-- Body -->
    <div ref="scrollEl" class="log-scroll" @scroll="onScroll">
      <div v-if="filtered.length === 0" class="log-empty">Không có log nào khớp</div>
      <div v-else class="log-list" :style="{ height: totalHeight + 'px' }">
        <div :style="{ transform: `translateY(${offsetY}px)` }">
          <div
            v-for="entry in visible"
            :key="entry.id"
            class="log-row"
            :class="`log-row--${entry.level}`"
            :style="{ height: rowHeight + 'px' }"
            @click="entry.details && toggleExpand(entry.id)"
          >
            <span class="log-ts">{{ entry.ts }}</span>
            <span class="log-level" :class="`log-level--${entry.level}`">{{ entry.level.toUpperCase() }}</span>
            <span class="log-msg" v-html="highlight(entry.message)" />
            <span v-if="entry.details" class="log-expand">{{ expanded.has(entry.id) ? '▾' : '▸' }}</span>
          </div>
          <template v-for="entry in visible" :key="`d-${entry.id}`">
            <div v-if="expanded.has(entry.id) && entry.details" class="log-details">
              <pre v-html="highlight(entry.details)"></pre>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Jump to bottom badge -->
    <transition name="log-jump">
      <button v-if="!follow && newCount > 0" type="button" class="log-jump" @click="follow = true; scrollToBottom()">
        Có {{ newCount }} log mới ↓
      </button>
    </transition>
  </div>
</template>

<style scoped>
.log-viewer {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
  background: var(--wx-surface-base);
  height: 100%;
}

.log-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  flex-shrink: 0;
}

.log-search {
  flex: 1;
  min-width: 120px;
  padding: 5px 10px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  font-size: 12px;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
}

.log-search:focus {
  outline: none;
  border-color: var(--wx-brand-focus);
}

.log-levels {
  display: flex;
  gap: 2px;
}

.log-level-btn {
  padding: 4px 8px;
  border: 1px solid var(--wx-border-default);
  background: transparent;
  border-radius: var(--wx-radius-sm);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--wx-font-primary);
  text-transform: lowercase;
  color: var(--wx-text-muted);
  transition: all var(--wx-duration-fast);
}

.log-level-btn--active.log-level-btn--debug { background: var(--wx-neutral-bg); color: var(--wx-neutral-text); border-color: var(--wx-neutral-border); }
.log-level-btn--active.log-level-btn--info  { background: var(--wx-info-bg); color: var(--wx-info-text); border-color: var(--wx-info-border); }
.log-level-btn--active.log-level-btn--warn  { background: var(--wx-warning-bg); color: var(--wx-warning-text); border-color: var(--wx-warning-border); }
.log-level-btn--active.log-level-btn--error { background: var(--wx-danger-bg); color: var(--wx-danger-text); border-color: var(--wx-danger-border); }

.log-tool-btn {
  padding: 4px 10px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-secondary);
  cursor: pointer;
  white-space: nowrap;
}

.log-tool-btn--active {
  background: var(--wx-success-bg);
  color: var(--wx-success-text);
  border-color: var(--wx-success-border);
}

.log-count {
  font-size: 11px;
  color: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
  margin-left: auto;
}

.log-scroll {
  flex: 1;
  overflow-y: auto;
  background: var(--wx-surface-base);
  font-family: var(--wx-font-mono);
}

.log-empty {
  padding: 24px;
  text-align: center;
  color: var(--wx-text-muted);
  font-size: 13px;
}

.log-list {
  position: relative;
}

.log-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  cursor: default;
  border-bottom: 1px solid var(--wx-border-subtle);
}

.log-row:hover {
  background: var(--wx-hover-bg);
}

.log-ts {
  color: var(--wx-text-muted);
  flex-shrink: 0;
  font-size: 11px;
}

.log-level {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 11px;
  width: 50px;
}
.log-level--debug { color: var(--wx-text-muted); }
.log-level--info  { color: var(--wx-info-text); }
.log-level--warn  { color: var(--wx-warning-text); }
.log-level--error { color: var(--wx-danger-text); }

.log-msg {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--wx-text-primary);
}

.log-msg :deep(mark) {
  background: var(--wx-warning-bg);
  color: var(--wx-warning-text);
  padding: 0 2px;
  border-radius: 2px;
}

.log-row--error { background: rgba(239, 68, 68, 0.04); }
.log-row--warn  { background: rgba(245, 158, 11, 0.04); }

.log-expand {
  color: var(--wx-text-muted);
  font-size: 10px;
  flex-shrink: 0;
  cursor: pointer;
}

.log-details {
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-subtle);
  padding: 8px 60px;
}

.log-details pre {
  margin: 0;
  font-size: 11px;
  color: var(--wx-text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
}

.log-jump {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border: none;
  border-radius: var(--wx-radius-full);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--wx-shadow-md);
  font-family: var(--wx-font-primary);
}

.log-jump-enter-active,
.log-jump-leave-active {
  transition: all 0.2s ease;
}
.log-jump-enter-from,
.log-jump-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}
</style>

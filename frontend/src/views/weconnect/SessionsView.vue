<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseButton, BaseBadge } from '../../components/common'

const SESSIONS = ref([
  { id: 'WA-001', account: '@batcong.vn', status: 'active', messages: 124, uptime: '4h 23m', lastMsg: '2 phút trước', device: 'iPhone 14' },
  { id: 'WA-002', account: '@startup.xyz', status: 'active', messages: 58, uptime: '2h 01m', lastMsg: '8 phút trước', device: 'Samsung S24' },
  { id: 'WA-003', account: '@boutique.vn', status: 'idle', messages: 12, uptime: '1h 45m', lastMsg: '45 phút trước', device: 'Chrome Web' },
  { id: 'WA-004', account: '@batcong.vn', status: 'active', messages: 89, uptime: '3h 12m', lastMsg: '1 phút trước', device: 'Firefox Web' },
  { id: 'WA-005', account: '@corp.abc', status: 'error', messages: 0, uptime: '0m', lastMsg: '—', device: 'WhatsApp Web' },
])

const STATUS_MAP: Record<string, 'success' | 'neutral' | 'danger'> = {
  active: 'success', idle: 'neutral', error: 'danger',
}
const STATUS_LABELS: Record<string, string> = { active: 'Đang hoạt động', idle: 'Không tải', error: 'Lỗi kết nối' }

let interval: ReturnType<typeof setInterval>
onMounted(() => {
  interval = setInterval(() => {
    SESSIONS.value.forEach(s => {
      if (s.status === 'active') s.messages += Math.floor(Math.random() * 3)
    })
  }, 3000)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <WeConnectLayout current="sessions" page-title="Phiên kết nối" page-description="Giám sát các session WhatsApp đang hoạt động">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Tạo phiên mới</BaseButton>
    </template>
    <div class="sessions-grid">
      <div v-for="s in SESSIONS" :key="s.id" class="session-card" :class="s.status">
        <div class="session-head">
          <code class="session-id">{{ s.id }}</code>
          <BaseBadge :text="STATUS_LABELS[s.status]" :variant="STATUS_MAP[s.status]" dot />
        </div>
        <div class="session-body">
          <div class="sess-row"><span class="sess-key">Tài khoản</span><span>{{ s.account }}</span></div>
          <div class="sess-row"><span class="sess-key">Thiết bị</span><span>{{ s.device }}</span></div>
          <div class="sess-row"><span class="sess-key">Uptime</span><span class="mono">{{ s.uptime }}</span></div>
          <div class="sess-row"><span class="sess-key">Tin nhắn</span><span class="bold">{{ s.messages.toLocaleString() }}</span></div>
          <div class="sess-row"><span class="sess-key">Tin cuối</span><span>{{ s.lastMsg }}</span></div>
        </div>
        <div class="session-footer">
          <BaseButton size="sm" variant="ghost">Logs</BaseButton>
          <BaseButton v-if="s.status === 'active' || s.status === 'idle'" size="sm" variant="danger">Ngắt kết nối</BaseButton>
          <BaseButton v-else size="sm" variant="primary">Kết nối lại</BaseButton>
        </div>
      </div>
    </div>
  </WeConnectLayout>
</template>
<style scoped>
.sessions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--wx-space-4); }
.session-card { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); padding: var(--wx-space-4); display: flex; flex-direction: column; gap: var(--wx-space-3); transition: border-color var(--wx-d-micro); }
.session-card.active { border-color: var(--wx-status-success-border); }
.session-card.error { border-color: var(--wx-status-danger-border); }
.session-head { display: flex; align-items: center; justify-content: space-between; }
.session-id { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); font-weight: var(--wx-fw-bold); color: var(--wx-content-link); }
.session-body { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.sess-row { display: flex; justify-content: space-between; font-size: var(--wx-fs-13); }
.sess-key { color: var(--wx-content-muted); }
.mono { font-family: var(--wx-font-mono); }
.bold { font-weight: var(--wx-fw-semibold); }
.session-footer { display: flex; gap: var(--wx-space-2); }
</style>

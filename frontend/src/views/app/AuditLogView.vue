<script setup lang="ts">
import { ref, computed } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseInput, BaseTag } from '../../components/common'

const search = ref('')
const actionFilter = ref('tất cả')
const expanded = ref<number | null>(null)

const ACTIONS = ['tất cả', 'create', 'update', 'delete', 'login', 'export']

const LOGS = [
  { id: 1, actor: 'nguyenvana@example.com', action: 'create', resource: 'Invoice #INV-2026-042', ip: '1.2.3.4', ua: 'Chrome 124', time: '2026-05-05 10:42:33', before: null, after: { client: 'Công ty TNHH ABC', amount: 15000000 } },
  { id: 2, actor: 'lethib@example.com', action: 'update', resource: 'User #usr_291 settings', ip: '2.3.4.5', ua: 'Firefox 125', time: '2026-05-05 09:15:02', before: { notif_email: false }, after: { notif_email: true } },
  { id: 3, actor: 'admin@example.com', action: 'delete', resource: 'API key wm_live_z1y8w', ip: '1.2.3.4', ua: 'Chrome 124', time: '2026-05-04 18:30:11', before: { name: 'Old key', active: true }, after: null },
  { id: 4, actor: 'tranvanc@example.com', action: 'login', resource: 'Auth session', ip: '5.6.7.8', ua: 'Safari 17', time: '2026-05-04 08:01:55', before: null, after: { method: '2FA' } },
  { id: 5, actor: 'admin@example.com', action: 'export', resource: 'Users CSV (284 records)', ip: '1.2.3.4', ua: 'Chrome 124', time: '2026-05-03 16:44:22', before: null, after: null },
]

const ACTION_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  create: 'success', update: 'warning', delete: 'danger', login: 'info', export: 'neutral',
}

const filtered = computed(() => LOGS.filter(l => {
  const matchAction = actionFilter.value === 'tất cả' || l.action === actionFilter.value
  const matchSearch = !search.value || l.actor.includes(search.value) || l.resource.toLowerCase().includes(search.value.toLowerCase())
  return matchAction && matchSearch
}))
</script>

<template>
  <AppPageLayout section="app" current="audit log" page-title="Audit log" page-description="Theo dõi mọi hành động trong hệ thống">
    <template #actions>
      <BaseButton size="sm" variant="ghost">Xuất CSV</BaseButton>
    </template>

    <div class="filters-row">
      <BaseInput v-model="search" placeholder="Tìm theo actor hoặc resource..." size="sm" clearable style="max-width: 320px;" />
      <div class="action-filters">
        <BaseTag
          v-for="a in ACTIONS" :key="a"
          :text="a" size="sm"
          :variant="actionFilter === a ? 'primary' : 'neutral'"
          style="cursor: pointer"
          @click="actionFilter = a"
        />
      </div>
    </div>

    <div class="log-table-wrap">
      <table class="log-table">
        <thead>
          <tr><th>Thời gian</th><th>Actor</th><th>Hành động</th><th>Đối tượng</th><th>IP</th><th>Chi tiết</th></tr>
        </thead>
        <tbody>
          <template v-for="log in filtered" :key="log.id">
            <tr class="log-row" @click="expanded = expanded === log.id ? null : log.id">
              <td><code class="ts">{{ log.time }}</code></td>
              <td class="actor">{{ log.actor }}</td>
              <td><BaseBadge :text="log.action" :variant="ACTION_VARIANTS[log.action] || 'neutral'" /></td>
              <td class="resource">{{ log.resource }}</td>
              <td><code class="ip">{{ log.ip }}</code></td>
              <td><BaseButton size="sm" variant="ghost">{{ expanded === log.id ? '▲' : '▼' }}</BaseButton></td>
            </tr>
            <tr v-if="expanded === log.id" class="diff-row">
              <td colspan="6">
                <div class="diff-wrap">
                  <div v-if="log.before" class="diff-col before">
                    <span class="diff-label">Before</span>
                    <pre class="diff-code">{{ JSON.stringify(log.before, null, 2) }}</pre>
                  </div>
                  <div v-if="log.after" class="diff-col after">
                    <span class="diff-label">After</span>
                    <pre class="diff-code">{{ JSON.stringify(log.after, null, 2) }}</pre>
                  </div>
                  <div v-if="!log.before && !log.after" class="diff-empty">Không có dữ liệu thay đổi</div>
                  <div class="diff-meta">
                    <span>User-Agent: {{ log.ua }}</span>
                    <span>IP: {{ log.ip }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.filters-row { display: flex; align-items: center; gap: var(--wx-space-4); flex-wrap: wrap; }
.action-filters { display: flex; flex-wrap: wrap; gap: var(--wx-space-2); }

.log-table-wrap { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.log-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.log-table th { padding: var(--wx-space-3) var(--wx-space-4); text-align: left; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-default); }
.log-row td { padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); cursor: pointer; }
.log-row:hover td { background: var(--wx-hover-bg); }
.diff-row td { padding: 0; border-bottom: 1px solid var(--wx-border-default); }
.ts { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.actor { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-link); }
.resource { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); }
.ip { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-muted); }

.diff-wrap { display: flex; gap: var(--wx-space-4); padding: var(--wx-space-4); background: var(--wx-bg-sunken); flex-wrap: wrap; }
.diff-col { flex: 1; min-width: 200px; }
.diff-label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); display: block; margin-bottom: var(--wx-space-1); }
.diff-col.before .diff-label { color: var(--wx-status-danger-text); }
.diff-col.after .diff-label { color: var(--wx-status-success-text); }
.diff-code { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); background: var(--wx-bg-base); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); padding: var(--wx-space-3); margin: 0; overflow-x: auto; white-space: pre-wrap; }
.diff-empty { color: var(--wx-content-muted); font-size: var(--wx-fs-13); }
.diff-meta { display: flex; gap: var(--wx-space-4); font-size: var(--wx-fs-12); color: var(--wx-content-muted); width: 100%; }
</style>

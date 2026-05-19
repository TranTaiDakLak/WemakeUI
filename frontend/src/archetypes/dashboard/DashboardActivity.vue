<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BaseBadge, BaseButton, BaseCard, BaseDrawer, BaseTabs } from '@/components/common'
import { useDashboardStore } from '@/stores/dashboard'
import { useToast } from '@/composables/useToast'
import { useScrollReveal } from '@/composables/useScrollReveal'

const dashboard = useDashboardStore()
const { showToast } = useToast()

const activeTab = ref<'jobs' | 'expiring' | 'pending'>('jobs')
const activeAccountFilter = ref<string | null>(null)

const filteredAccounts = computed(() =>
  activeAccountFilter.value
    ? dashboard.expiringAccounts.filter(a => a.status === activeAccountFilter.value)
    : dashboard.expiringAccounts,
)

const PRIORITY_BADGE: Record<string, 'danger' | 'warning' | 'neutral'> = {
  high: 'danger', medium: 'warning', low: 'neutral',
}
const PRIORITY_LABEL: Record<string, string> = {
  high: 'Cao', medium: 'Trung bình', low: 'Thấp',
}

/* errors drawer (linked from hero alert) */
const errorsDrawer = ref(false)

/* expose methods for parent cross-communication */
defineExpose({
  setAccountFilter: (f: string | null) => { activeAccountFilter.value = f; activeTab.value = 'expiring' },
  openErrorsDrawer: () => { errorsDrawer.value = true },
})

/* scroll reveal */
const sectionRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (sectionRef.value) observe(sectionRef.value) })

const tabItems = computed(() => [
  { key: 'jobs',     label: `Failed Jobs (${dashboard.failedJobs.length})` },
  { key: 'expiring', label: `Tài khoản hết hạn (${filteredAccounts.value.length})` },
  { key: 'pending',  label: `Tickets chờ (${dashboard.pendingTickets.length})` },
])
</script>

<template>
  <div style="display: contents">
    <BaseCard
      ref="sectionRef"
      shadow="sm"
      class="act-card wx-reveal"
      :class="{ 'is-revealed': revealed }"
      style="margin-bottom: var(--wx-space-6)"
    >
      <!-- section header + tabs -->
      <div class="act-head">
        <h3 class="act-title">Cần xử lý ngay</h3>
        <div class="act-tab-area">
          <BaseTabs v-model="activeTab" :tabs="tabItems" />
          <BaseButton variant="ghost" size="sm" @click="errorsDrawer = true">
            🚨 {{ dashboard.sysErrors.length }} lỗi hệ thống
          </BaseButton>
        </div>
      </div>

      <!-- ── Tab: Failed jobs ────────────────────────────────── -->
      <div v-if="activeTab === 'jobs'" class="act-table-wrap">
        <div v-if="!dashboard.failedJobs.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Không có job thất bại — hệ thống ổn định</span>
        </div>
        <table v-else class="act-table">
          <thead>
            <tr><th>Job</th><th>Lỗi</th><th>Thời gian</th><th>Retry</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="job in dashboard.failedJobs" :key="job.id">
              <td><code class="job-name">{{ job.name }}</code></td>
              <td class="err-msg">{{ job.error }}</td>
              <td class="cell-muted">{{ job.time }}</td>
              <td><span class="retry-badge">{{ job.retries }}×</span></td>
              <td class="cell-action">
                <BaseButton
                  size="sm" variant="ghost"
                  :loading="job.retrying"
                  :disabled="job.retrying"
                  @click="dashboard.retryJob(job.id, showToast)"
                >↻ Retry</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Tab: Expiring accounts ──────────────────────────── -->
      <div v-else-if="activeTab === 'expiring'" class="act-table-wrap">
        <div v-if="activeAccountFilter" class="filter-notice">
          <span>Đang lọc theo: <strong>{{ activeAccountFilter }}</strong></span>
          <BaseButton variant="ghost" size="sm" @click="activeAccountFilter = null">✕ Bỏ lọc</BaseButton>
        </div>
        <div v-if="!filteredAccounts.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Không có tài khoản cần gia hạn</span>
        </div>
        <table v-else class="act-table">
          <thead>
            <tr><th>Tài khoản</th><th>Nền tảng</th><th>Hết hạn trong</th><th>Trạng thái</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="acc in filteredAccounts" :key="acc.id">
              <td>
                <div class="acc-cell">
                  <span class="acc-name">{{ acc.name }}</span>
                  <span class="acc-phone">{{ acc.phone }}</span>
                </div>
              </td>
              <td class="cell-muted">{{ acc.platform }}</td>
              <td class="cell-warn">{{ acc.expiresIn }}</td>
              <td>
                <BaseBadge
                  :text="acc.status === 'checkpoint' ? 'Checkpoint' : 'Sắp hết hạn'"
                  :variant="acc.status === 'checkpoint' ? 'warning' : 'neutral'"
                  dot
                />
              </td>
              <td class="cell-action">
                <BaseButton
                  size="sm" variant="ghost"
                  :loading="acc.actioning"
                  :disabled="acc.actioning"
                  @click="dashboard.renewAccount(acc.id, showToast)"
                >Gia hạn</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Tab: Pending tickets ────────────────────────────── -->
      <div v-else class="act-table-wrap">
        <div v-if="!dashboard.pendingTickets.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Không có ticket nào đang chờ xử lý</span>
        </div>
        <table v-else class="act-table">
          <thead>
            <tr><th>ID</th><th>Vấn đề</th><th>Độ ưu tiên</th><th>Thời gian</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="ticket in dashboard.pendingTickets" :key="ticket.id">
              <td class="cell-muted">#{{ ticket.id }}</td>
              <td class="ticket-title">{{ ticket.title }}</td>
              <td>
                <BaseBadge :text="PRIORITY_LABEL[ticket.priority]" :variant="PRIORITY_BADGE[ticket.priority]" />
              </td>
              <td class="cell-muted">{{ ticket.created }}</td>
              <td class="cell-action">
                <BaseButton
                  size="sm" variant="ghost"
                  :loading="ticket.assigning"
                  :disabled="ticket.assigning"
                  @click="dashboard.assignTicket(ticket.id, showToast)"
                >Nhận xử lý</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- System errors drawer -->
    <BaseDrawer :show="errorsDrawer" title="Lỗi hệ thống" size="md" @update:show="v => { errorsDrawer = v }">
      <div class="drawer-pad">
        <p class="drawer-desc">{{ dashboard.sysErrors.length }} lỗi đang hoạt động. Click "Xử lý" để resolve.</p>
        <div v-if="!dashboard.sysErrors.length" class="act-empty">
          <span class="act-empty__icon">✅</span>
          <span>Tất cả lỗi đã được xử lý</span>
        </div>
        <div v-else class="err-list">
          <div
            v-for="err in dashboard.sysErrors"
            :key="err.id"
            class="err-row"
            :class="`err-row--${err.level}`"
          >
            <div class="err-row__info">
              <span class="err-icon">{{ err.level === 'critical' ? '🔴' : '⚠️' }}</span>
              <div>
                <p class="err-msg-text">{{ err.msg }}</p>
                <span class="err-time">{{ err.time }} hôm nay</span>
              </div>
            </div>
            <BaseButton
              size="sm" variant="ghost"
              :loading="err.resolving"
              :disabled="err.resolving"
              @click="dashboard.resolveError(err.id, showToast)"
            >Xử lý</BaseButton>
          </div>
        </div>
      </div>
    </BaseDrawer>

  </div>
</template>

<style scoped>
.act-card { overflow: visible; }
.act-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-4);
  flex-wrap: wrap;
}
.act-title { font-size: var(--wx-text-base); font-weight: 600; margin: 0; color: var(--wx-text-primary); }
.act-tab-area { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; }

.act-table-wrap { overflow-x: auto; }
.act-empty {
  display: flex; align-items: center; justify-content: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-8) var(--wx-space-4);
  font-size: var(--wx-text-sm);
  color: var(--wx-text-secondary);
}
.act-empty__icon { font-size: 24px; }

.act-table { width: 100%; border-collapse: collapse; font-size: var(--wx-text-sm); }
.act-table th, .act-table td {
  text-align: left;
  padding: var(--wx-space-2-5) var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.act-table th { font-weight: 500; color: var(--wx-text-secondary); font-size: var(--wx-text-xs); white-space: nowrap; }
.act-table tr:last-child td { border-bottom: none; }
.act-table tr:hover td { background: var(--wx-surface-elevated); }

.job-name { font-family: monospace; font-size: 12px; color: var(--wx-text-primary); }
.err-msg { color: var(--wx-danger); font-size: var(--wx-text-xs); max-width: 240px; }
.cell-muted { color: var(--wx-text-tertiary); white-space: nowrap; }
.cell-warn { color: var(--wx-warning); font-weight: 500; white-space: nowrap; }
.cell-action { white-space: nowrap; text-align: right; }
.retry-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  background: var(--wx-surface-sunken);
  font-size: 11px; font-weight: 600;
  color: var(--wx-text-secondary);
}
.acc-cell { display: flex; flex-direction: column; }
.acc-name { font-weight: 500; }
.acc-phone { font-size: var(--wx-text-xs); color: var(--wx-text-tertiary); }
.ticket-title { max-width: 320px; }

.filter-notice {
  display: flex; align-items: center; gap: var(--wx-space-2);
  padding: var(--wx-space-2) var(--wx-space-3);
  margin-bottom: var(--wx-space-2);
  background: color-mix(in srgb, var(--wx-primary) 8%, transparent);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-text-sm);
}

/* errors drawer */
.drawer-pad { padding: var(--wx-space-4); }
.drawer-desc { font-size: var(--wx-text-sm); color: var(--wx-text-secondary); margin: 0 0 var(--wx-space-4); }
.err-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.err-row {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-elevated);
  border-left: 3px solid transparent;
}
.err-row--critical { border-left-color: var(--wx-danger); }
.err-row--warning  { border-left-color: var(--wx-warning); }
.err-row__info { display: flex; align-items: flex-start; gap: var(--wx-space-2); flex: 1; }
.err-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.err-msg-text { font-size: var(--wx-text-sm); color: var(--wx-text-primary); margin: 0 0 2px; }
.err-time { font-size: var(--wx-text-xs); color: var(--wx-text-tertiary); }
</style>

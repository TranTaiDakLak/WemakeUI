<script setup lang="ts">
import { ref, reactive, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import {
  BaseButton, BaseInput, BaseSelectMenu, BaseTextarea,
  BaseBadge,
  FormField, FormModal, FormDrawer, ConfirmDialog,
} from '../../components/common'
import { BulkActionBar } from '../../components/data'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── Types ── */
type SessionStatus = 'active' | 'idle' | 'error' | 'connecting'

interface Session {
  id: string
  account: string
  device: string
  status: SessionStatus
  messages: number
  uptime: string
  lastMsg: string
  note: string
  createdAt: string
  uptimeSecs: number
}

/* ── Mock data ── */
const INIT_SESSIONS: Session[] = [
  { id: 'WA-001', account: '@batcong.vn', device: 'iPhone 14', status: 'active', messages: 124, uptime: '4h 23m', lastMsg: '2 phút trước', note: 'Tài khoản chính cho CSKH nhà hàng', createdAt: '01/05/2024', uptimeSecs: 15780 },
  { id: 'WA-002', account: '@startup.xyz', device: 'Samsung S24', status: 'active', messages: 58, uptime: '2h 01m', lastMsg: '8 phút trước', note: '', createdAt: '02/05/2024', uptimeSecs: 7260 },
  { id: 'WA-003', account: '@boutique.vn', device: 'Chrome Web', status: 'idle', messages: 12, uptime: '1h 45m', lastMsg: '45 phút trước', note: 'Phiên dự phòng, ít sử dụng', createdAt: '03/05/2024', uptimeSecs: 6300 },
  { id: 'WA-004', account: '@batcong.vn', device: 'Firefox Web', status: 'active', messages: 89, uptime: '3h 12m', lastMsg: '1 phút trước', note: '', createdAt: '01/05/2024', uptimeSecs: 11520 },
  { id: 'WA-005', account: '@corp.abc', device: 'WhatsApp Web', status: 'error', messages: 0, uptime: '—', lastMsg: '—', note: 'Mất kết nối do IP thay đổi', createdAt: '04/05/2024', uptimeSecs: 0 },
  { id: 'WA-006', account: '@tech.def', device: 'iPhone 13', status: 'connecting', messages: 0, uptime: '—', lastMsg: '—', note: 'Đang xác thực QR code', createdAt: '05/05/2024', uptimeSecs: 0 },
]

const sessions = ref<Session[]>([...INIT_SESSIONS])

/* ── Status maps ── */
const STATUS_BADGE: Record<SessionStatus, 'success' | 'neutral' | 'danger' | 'warning'> = {
  active: 'success', idle: 'neutral', error: 'danger', connecting: 'warning',
}
const STATUS_LABEL: Record<SessionStatus, string> = {
  active: 'Đang hoạt động', idle: 'Không tải', error: 'Lỗi kết nối', connecting: 'Đang kết nối',
}

/* ── Filters ── */
const search = ref('')
const statusFilter = ref('all')

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'idle', label: 'Không tải' },
  { value: 'error', label: 'Lỗi kết nối' },
  { value: 'connecting', label: 'Đang kết nối' },
]

const filtered = computed(() => {
  let list = sessions.value
  if (statusFilter.value !== 'all') list = list.filter(s => s.status === statusFilter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(s =>
    s.id.toLowerCase().includes(q) ||
    s.account.toLowerCase().includes(q) ||
    s.device.toLowerCase().includes(q)
  )
  return list
})

/* ── Multi-select ── */
const selected = ref<string[]>([])
const headerCheckRef = ref<HTMLInputElement | null>(null)

const isAllSelected = computed(() =>
  filtered.value.length > 0 && filtered.value.every(s => selected.value.includes(s.id))
)
const isIndeterminate = computed(() =>
  filtered.value.some(s => selected.value.includes(s.id)) && !isAllSelected.value
)

watchEffect(() => {
  if (headerCheckRef.value) headerCheckRef.value.indeterminate = isIndeterminate.value
})

function toggleOne(id: string) {
  const idx = selected.value.indexOf(id)
  if (idx !== -1) selected.value.splice(idx, 1)
  else selected.value.push(id)
}

function toggleAll() {
  if (isAllSelected.value) selected.value = []
  else selected.value = filtered.value.map(s => s.id)
}

function clearSelection() { selected.value = [] }

/* ── Overlay state ── */
const addOpen           = ref(false)
const detailOpen        = ref(false)
const disconnectOpen    = ref(false)
const bulkDisconnOpen   = ref(false)
const bulkDeleteOpen    = ref(false)

const addLoading         = ref(false)
const disconnectLoading  = ref(false)
const bulkLoading        = ref(false)

const detailTarget     = ref<Session | null>(null)
const disconnectTarget = ref<Session | null>(null)

/* ── Form ── */
const DEVICE_OPTIONS = [
  { value: 'Chrome Web',    label: 'Chrome Web' },
  { value: 'Firefox Web',   label: 'Firefox Web' },
  { value: 'WhatsApp Web',  label: 'WhatsApp Web' },
  { value: 'iPhone 14',     label: 'iPhone 14' },
  { value: 'Samsung S24',   label: 'Samsung S24' },
]

const form = reactive({ account: '', device: 'Chrome Web', note: '' })
function resetForm() { form.account = ''; form.device = 'Chrome Web'; form.note = '' }

/* ── Actions ── */
function openAdd() { resetForm(); addOpen.value = true }

function openDetail(s: Session) { detailTarget.value = s; detailOpen.value = true }

function openDisconnect(s: Session, e: Event) {
  e.stopPropagation()
  disconnectTarget.value = s
  disconnectOpen.value = true
}

async function handleAdd() {
  if (!form.account.trim()) {
    showToast('error', 'Vui lòng nhập tên tài khoản')
    return
  }
  addLoading.value = true
  await new Promise(r => setTimeout(r, 1200))
  const newId = `WA-${String(sessions.value.length + 1).padStart(3, '0')}`
  sessions.value.push({
    id: newId,
    account: form.account,
    device: form.device,
    status: 'connecting',
    messages: 0, uptime: '—', lastMsg: '—',
    note: form.note,
    createdAt: new Date().toLocaleDateString('vi-VN'),
    uptimeSecs: 0,
  })
  addLoading.value = false
  addOpen.value = false
  showToast('success', `Đang kết nối phiên ${newId}`)
  setTimeout(() => {
    const idx = sessions.value.findIndex(s => s.id === newId)
    if (idx !== -1) { sessions.value[idx].status = 'active'; sessions.value[idx].uptime = '0m' }
  }, 2500)
}

async function handleDisconnect() {
  disconnectLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const id = disconnectTarget.value?.id ?? ''
  const idx = sessions.value.findIndex(s => s.id === id)
  if (idx !== -1) {
    sessions.value[idx] = { ...sessions.value[idx], status: 'error', uptime: '—', uptimeSecs: 0 }
  }
  disconnectLoading.value = false
  disconnectOpen.value = false
  showToast('success', `Đã ngắt kết nối phiên ${id}`)
}

async function handleBulkDisconnect() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  const ids = [...selected.value]
  sessions.value = sessions.value.map(s =>
    ids.includes(s.id) && (s.status === 'active' || s.status === 'idle')
      ? { ...s, status: 'error' as SessionStatus, uptime: '—', uptimeSecs: 0 }
      : s
  )
  selected.value = []
  bulkLoading.value = false
  bulkDisconnOpen.value = false
  showToast('success', `Đã ngắt kết nối ${ids.length} phiên`)
}

async function handleBulkDelete() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const ids = [...selected.value]
  sessions.value = sessions.value.filter(s => !ids.includes(s.id))
  selected.value = []
  bulkLoading.value = false
  bulkDeleteOpen.value = false
  showToast('success', `Đã xoá ${ids.length} phiên`)
}

function reconnect(s: Session, e?: Event) {
  e?.stopPropagation()
  const idx = sessions.value.findIndex(x => x.id === s.id)
  if (idx !== -1) sessions.value[idx].status = 'connecting'
  showToast('info', `Đang kết nối lại ${s.id}...`)
  setTimeout(() => {
    if (idx !== -1) {
      sessions.value[idx].status = 'active'
      sessions.value[idx].uptime = '0m'
      sessions.value[idx].uptimeSecs = 0
    }
  }, 2000)
}

/* ── Live uptime/message counter ── */
let liveInterval: ReturnType<typeof setInterval>
onMounted(() => {
  liveInterval = setInterval(() => {
    sessions.value.forEach(s => {
      if (s.status === 'active') {
        s.messages += Math.floor(Math.random() * 3)
        s.uptimeSecs += 3
        const h = Math.floor(s.uptimeSecs / 3600)
        const m = Math.floor((s.uptimeSecs % 3600) / 60)
        s.uptime = h > 0 ? `${h}h ${m}m` : `${m}m`
        s.lastMsg = 'Vừa xong'
      }
    })
  }, 3000)
})
onUnmounted(() => clearInterval(liveInterval))

/* ── Stats ── */
const stats = computed(() => ({
  active:   sessions.value.filter(s => s.status === 'active').length,
  idle:     sessions.value.filter(s => s.status === 'idle').length,
  error:    sessions.value.filter(s => s.status === 'error').length,
  totalMsg: sessions.value.reduce((acc, s) => acc + s.messages, 0),
}))
</script>

<template>
  <AppPageLayout section="wemakeui"
    current="sessions"
    page-title="Phiên kết nối"
    page-description="Giám sát và quản lý session WhatsApp đang hoạt động"
  >
    <template #actions>
      <BaseButton size="sm" @click="openAdd">+ Tạo phiên mới</BaseButton>
    </template>

    <!-- ── Stats bar ── -->
    <div class="stats-row">
      <div class="stat-chip stat-chip--success">
        <span class="stat-val">{{ stats.active }}</span>
        <span class="stat-key">Đang hoạt động</span>
      </div>
      <div class="stat-chip stat-chip--neutral">
        <span class="stat-val">{{ stats.idle }}</span>
        <span class="stat-key">Không tải</span>
      </div>
      <div class="stat-chip stat-chip--danger">
        <span class="stat-val">{{ stats.error }}</span>
        <span class="stat-key">Lỗi kết nối</span>
      </div>
      <div class="stat-chip">
        <span class="stat-val">{{ stats.totalMsg.toLocaleString('vi-VN') }}</span>
        <span class="stat-key">Tổng tin nhắn</span>
      </div>
    </div>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <BaseInput
        v-model="search"
        placeholder="Tìm ID, tài khoản, thiết bị..."
        size="sm"
        clearable
        style="max-width: 280px;"
      />
      <BaseSelectMenu
        v-model="statusFilter"
        :options="STATUS_FILTER_OPTIONS"
        size="sm"
        style="width: 190px;"
      />
      <BaseBadge :text="`${filtered.length} phiên`" variant="neutral" />
    </div>

    <!-- ── Table ── -->
    <div class="table-wrap">
      <div class="table-scroll">
        <table class="ct-table">
          <thead>
            <tr>
              <th class="col-check">
                <input
                  ref="headerCheckRef"
                  type="checkbox"
                  class="cb"
                  :checked="isAllSelected"
                  @change="toggleAll"
                />
              </th>
              <th>Session ID</th>
              <th>Tài khoản</th>
              <th>Thiết bị</th>
              <th>Trạng thái</th>
              <th class="col-num">Tin nhắn</th>
              <th>Uptime</th>
              <th>Tin cuối</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in filtered"
              :key="s.id"
              class="ct-row"
              :class="{ 'ct-row--selected': selected.includes(s.id) }"
              @click="openDetail(s)"
            >
              <td class="col-check" @click.stop>
                <input
                  type="checkbox"
                  class="cb"
                  :checked="selected.includes(s.id)"
                  @change="toggleOne(s.id)"
                />
              </td>
              <td><code class="session-id">{{ s.id }}</code></td>
              <td class="col-account">{{ s.account }}</td>
              <td class="col-device">{{ s.device }}</td>
              <td>
                <BaseBadge :text="STATUS_LABEL[s.status]" :variant="STATUS_BADGE[s.status]" dot />
              </td>
              <td class="col-num">
                <span :class="s.messages > 0 ? 'msg-count' : 'col-muted'">
                  {{ s.messages.toLocaleString('vi-VN') }}
                </span>
              </td>
              <td>
                <span :class="s.uptimeSecs > 0 ? 'mono' : 'col-muted'">{{ s.uptime }}</span>
              </td>
              <td class="col-lastmsg">{{ s.lastMsg }}</td>
              <td class="col-actions" @click.stop>
                <div class="row-actions">
                  <template v-if="s.status === 'active' || s.status === 'idle'">
                    <BaseButton size="sm" variant="ghost" @click="openDisconnect(s, $event)">Ngắt</BaseButton>
                  </template>
                  <template v-else-if="s.status === 'error'">
                    <BaseButton size="sm" variant="primary" @click="reconnect(s, $event)">Kết nối lại</BaseButton>
                  </template>
                  <template v-else>
                    <span class="connecting-label">Đang kết nối...</span>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filtered.length === 0" class="empty-state">
        <div class="empty-icon">📡</div>
        <p class="empty-text">Không tìm thấy phiên nào</p>
        <BaseButton variant="ghost" size="sm" @click="search = ''; statusFilter = 'all'">
          Xoá bộ lọc
        </BaseButton>
      </div>
    </div>
  </AppPageLayout>

  <!-- ── Bulk Action Bar ── -->
  <BulkActionBar :count="selected.length" :show="selected.length > 0" @clear="clearSelection">
    <BaseButton size="sm" variant="warning" @click="bulkDisconnOpen = true">
      Ngắt kết nối {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="danger" @click="bulkDeleteOpen = true">
      Xoá {{ selected.length }}
    </BaseButton>
  </BulkActionBar>

  <!-- ════ Add Modal ════ -->
  <FormModal
    v-model="addOpen"
    title="Tạo phiên kết nối mới"
    size="sm"
    submit-label="Bắt đầu kết nối"
    :loading="addLoading"
    @submit="handleAdd"
  >
    <div class="form-body">
      <FormField label="Tên tài khoản" required hint="Tên hiển thị hoặc số điện thoại WhatsApp">
        <BaseInput v-model="form.account" placeholder="@batcong.vn hoặc +84912345678" />
      </FormField>
      <FormField label="Thiết bị kết nối">
        <BaseSelectMenu v-model="form.device" :options="DEVICE_OPTIONS" />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" placeholder="Ghi chú tuỳ chọn..." :rows="2" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Detail Drawer ════ -->
  <FormDrawer
    v-model="detailOpen"
    :title="detailTarget ? `Phiên ${detailTarget.id}` : 'Chi tiết phiên'"
    size="md"
    submit-label="Kết nối lại"
    cancel-label="Đóng"
    @submit="detailTarget && reconnect(detailTarget); detailOpen = false"
  >
    <template v-if="detailTarget">
      <div class="detail-header">
        <BaseBadge
          :text="STATUS_LABEL[detailTarget.status]"
          :variant="STATUS_BADGE[detailTarget.status]"
          dot
        />
      </div>

      <div class="detail-section">
        <p class="detail-section__label">Thông tin phiên</p>
        <div class="detail-row">
          <span class="detail-key">Session ID</span>
          <code class="session-id">{{ detailTarget.id }}</code>
        </div>
        <div class="detail-row">
          <span class="detail-key">Tài khoản</span>
          <span class="detail-val">{{ detailTarget.account }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Thiết bị</span>
          <span class="detail-val">{{ detailTarget.device }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Ngày tạo</span>
          <span class="detail-val">{{ detailTarget.createdAt }}</span>
        </div>
      </div>

      <div class="detail-section">
        <p class="detail-section__label">Hiệu suất phiên</p>
        <div class="detail-row">
          <span class="detail-key">Tin nhắn đã xử lý</span>
          <span class="detail-val msg-count">{{ detailTarget.messages.toLocaleString('vi-VN') }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Uptime</span>
          <span class="detail-val mono">{{ detailTarget.uptime }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Tin nhắn cuối</span>
          <span class="detail-val">{{ detailTarget.lastMsg }}</span>
        </div>
      </div>

      <div v-if="detailTarget.note" class="detail-section">
        <p class="detail-section__label">Ghi chú</p>
        <p class="detail-note">{{ detailTarget.note }}</p>
      </div>

      <div class="detail-danger">
        <BaseButton
          v-if="detailTarget.status === 'active' || detailTarget.status === 'idle'"
          variant="danger"
          size="sm"
          @click="openDisconnect(detailTarget, $event); detailOpen = false"
        >
          Ngắt kết nối phiên này
        </BaseButton>
      </div>
    </template>
  </FormDrawer>

  <!-- ════ Confirm: Disconnect single ════ -->
  <ConfirmDialog
    v-model="disconnectOpen"
    title="Ngắt kết nối phiên?"
    :description="`Phiên ${disconnectTarget?.id} (${disconnectTarget?.account}) sẽ bị ngắt kết nối. Tin nhắn đang gửi có thể bị gián đoạn.`"
    intent="warning"
    confirm-label="Ngắt kết nối"
    :loading="disconnectLoading"
    @confirm="handleDisconnect"
  />

  <!-- ════ Confirm: Bulk disconnect ════ -->
  <ConfirmDialog
    v-model="bulkDisconnOpen"
    title="Ngắt kết nối nhiều phiên?"
    :description="`${selected.length} phiên đã chọn sẽ bị ngắt kết nối ngay lập tức.`"
    intent="warning"
    confirm-label="Ngắt tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDisconnect"
  />

  <!-- ════ Confirm: Bulk delete ════ -->
  <ConfirmDialog
    v-model="bulkDeleteOpen"
    title="Xoá nhiều phiên?"
    :description="`${selected.length} phiên đã chọn sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDelete"
  />
</template>

<style scoped>
/* ── Stats row ── */
.stats-row {
  display: flex;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  min-width: 110px;
}
.stat-chip--success { border-color: var(--wx-success-border); background: var(--wx-success-bg); }
.stat-chip--neutral { border-color: var(--wx-neutral-border); background: var(--wx-neutral-bg); }
.stat-chip--danger  { border-color: var(--wx-danger-border);  background: var(--wx-danger-bg); }

.stat-val {
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  line-height: 1.2;
}
.stat-chip--success .stat-val { color: var(--wx-success-text); }
.stat-chip--neutral .stat-val { color: var(--wx-neutral-text); }
.stat-chip--danger  .stat-val { color: var(--wx-danger-text);  }
.stat-key { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
}

/* ── Table shell ── */
.table-wrap {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
}
.table-scroll { overflow-x: auto; }

.ct-table {
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  font-size: var(--wx-fs-14);
}
.ct-table th {
  padding: var(--wx-space-3) var(--wx-space-4);
  text-align: left;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  white-space: nowrap;
  user-select: none;
}
.ct-table td {
  padding: var(--wx-space-3) var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
  vertical-align: middle;
}

/* Row states */
.ct-row { cursor: pointer; transition: background var(--wx-d-micro) var(--wx-ease-standard); }
.ct-row:last-child td { border-bottom: none; }
.ct-row:hover td { background: var(--wx-hover-bg); }
.ct-row--selected td { background: var(--wx-selected-bg); }

/* Row actions — hidden until hover */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  opacity: 0;
  transition: opacity var(--wx-d-micro);
}
.ct-row:hover .row-actions { opacity: 1; }

/* Column widths */
.col-check   { width: 44px; }
.col-num     { width: 90px; text-align: right; }
.col-actions { width: 140px; }
.col-account { font-weight: var(--wx-fw-medium); }
.col-device  { color: var(--wx-text-secondary); font-size: var(--wx-fs-13); }
.col-lastmsg { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; }
.col-muted   { color: var(--wx-text-muted); }

/* Checkbox */
.cb { width: 16px; height: 16px; accent-color: var(--wx-brand-primary); cursor: pointer; }

/* Cells */
.session-id  { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); font-weight: var(--wx-fw-bold); color: var(--wx-text-link); }
.msg-count   { font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.mono        { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); }
.connecting-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

/* ── Empty state ── */
.empty-state {
  padding: var(--wx-space-10) var(--wx-space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-3);
  text-align: center;
}
.empty-icon { font-size: 40px; opacity: 0.35; line-height: 1; }
.empty-text { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }

/* ── Form body ── */
.form-body { display: flex; flex-direction: column; gap: var(--wx-space-4); }

/* ── Detail Drawer ── */
.detail-header {
  padding-bottom: var(--wx-space-4);
  margin-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-5);
}

.detail-section__label {
  margin: 0;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-4);
  font-size: var(--wx-fs-14);
}
.detail-key { color: var(--wx-text-secondary); flex-shrink: 0; }
.detail-val { color: var(--wx-text-primary); text-align: right; }

.detail-note {
  margin: 0;
  font-size: var(--wx-fs-14);
  color: var(--wx-text-secondary);
  line-height: var(--wx-lh-normal);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}

.detail-danger {
  padding-top: var(--wx-space-5);
  border-top: 1px solid var(--wx-border-subtle);
  margin-top: auto;
}
</style>

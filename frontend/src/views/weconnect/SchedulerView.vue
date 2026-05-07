<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import {
  BaseButton, BaseInput, BaseSelectMenu, BaseTextarea,
  BaseBadge, BaseToggle,
  FormField, FormModal, FormDrawer, ConfirmDialog,
} from '../../components/common'
import { BulkActionBar } from '../../components/data'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── Types ── */
type JobStatus = 'ok' | 'failed' | 'running' | 'pending'

interface CronJob {
  id: number
  name: string
  cron: string
  desc: string
  enabled: boolean
  lastRun: string
  nextRun: string
  status: JobStatus
  runs: number
  note: string
  createdAt: string
}

/* ── Mock data ── */
const INIT_JOBS: CronJob[] = [
  { id: 1, name: 'Sync contacts', cron: '0 */6 * * *', desc: 'Đồng bộ danh bạ từ CRM mỗi 6 giờ', enabled: true, lastRun: '10:00 hôm nay', nextRun: '16:00 hôm nay', status: 'ok', runs: 148, note: 'Kết nối với HubSpot và Salesforce', createdAt: '01/04/2024' },
  { id: 2, name: 'Campaign dispatcher', cron: '*/5 * * * *', desc: 'Gửi tin nhắn chiến dịch theo batch 50 mỗi 5 phút', enabled: true, lastRun: '10:55 hôm nay', nextRun: '11:00 hôm nay', status: 'running', runs: 2304, note: '', createdAt: '15/03/2024' },
  { id: 3, name: 'Session health check', cron: '*/1 * * * *', desc: 'Kiểm tra ping tất cả session, kết nối lại nếu mất', enabled: true, lastRun: '10:59 hôm nay', nextRun: '11:00 hôm nay', status: 'ok', runs: 8712, note: 'Tự động retry tối đa 3 lần', createdAt: '01/03/2024' },
  { id: 4, name: 'Auto-reply cleanup', cron: '0 2 * * *', desc: 'Xóa log auto-reply quá 30 ngày', enabled: false, lastRun: 'Hôm qua 02:00', nextRun: 'Ngày mai 02:00', status: 'pending', runs: 31, note: '', createdAt: '10/04/2024' },
  { id: 5, name: 'Weekly report export', cron: '0 8 * * 1', desc: 'Xuất báo cáo tuần gửi qua email mỗi thứ 2', enabled: true, lastRun: 'Thứ 2 tuần trước', nextRun: 'Thứ 2 tuần tới', status: 'failed', runs: 12, note: 'Gửi tới: admin@company.vn', createdAt: '01/02/2024' },
  { id: 6, name: 'Contact import', cron: '0 0 * * *', desc: 'Nhập danh sách liên hệ mới từ Google Sheets mỗi đêm', enabled: true, lastRun: '00:00 hôm nay', nextRun: '00:00 ngày mai', status: 'ok', runs: 65, note: '', createdAt: '20/04/2024' },
]

const jobs = ref<CronJob[]>([...INIT_JOBS])

/* ── Status maps ── */
const STATUS_BADGE: Record<JobStatus, 'success' | 'info' | 'danger' | 'neutral'> = {
  ok: 'success', running: 'info', failed: 'danger', pending: 'neutral',
}
const STATUS_LABEL: Record<JobStatus, string> = {
  ok: 'OK', running: 'Đang chạy', failed: 'Thất bại', pending: 'Chờ',
}

/* ── Filter options ── */
const search = ref('')
const statusFilter = ref('all')

const STATUS_FILTER_OPTIONS = [
  { value: 'all',     label: 'Tất cả trạng thái' },
  { value: 'ok',      label: 'OK' },
  { value: 'running', label: 'Đang chạy' },
  { value: 'failed',  label: 'Thất bại' },
  { value: 'pending', label: 'Chờ' },
]

const filtered = computed(() => {
  let list = jobs.value
  if (statusFilter.value !== 'all') list = list.filter(j => j.status === statusFilter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(j => j.name.toLowerCase().includes(q) || j.desc.toLowerCase().includes(q))
  return list
})

/* ── Multi-select ── */
const selected = ref<number[]>([])
const headerCheckRef = ref<HTMLInputElement | null>(null)

const isAllSelected = computed(() =>
  filtered.value.length > 0 && filtered.value.every(j => selected.value.includes(j.id))
)
const isIndeterminate = computed(() =>
  filtered.value.some(j => selected.value.includes(j.id)) && !isAllSelected.value
)

watchEffect(() => {
  if (headerCheckRef.value) headerCheckRef.value.indeterminate = isIndeterminate.value
})

function toggleOne(id: number) {
  const idx = selected.value.indexOf(id)
  if (idx !== -1) selected.value.splice(idx, 1)
  else selected.value.push(id)
}
function toggleAll() {
  if (isAllSelected.value) selected.value = []
  else selected.value = filtered.value.map(j => j.id)
}
function clearSelection() { selected.value = [] }

/* ── Overlay state ── */
const addOpen       = ref(false)
const editOpen      = ref(false)
const detailOpen    = ref(false)
const deleteOpen    = ref(false)
const runNowOpen    = ref(false)
const bulkDelOpen   = ref(false)
const bulkEnOpen    = ref(false)
const bulkDisOpen   = ref(false)

const addLoading    = ref(false)
const editLoading   = ref(false)
const deleteLoading = ref(false)
const runLoading    = ref(false)
const bulkLoading   = ref(false)

const editTarget   = ref<CronJob | null>(null)
const detailTarget = ref<CronJob | null>(null)
const deleteTarget = ref<CronJob | null>(null)
const runTarget    = ref<CronJob | null>(null)

/* ── Form ── */
const form = reactive({
  name:    '',
  cron:    '0 * * * *',
  desc:    '',
  note:    '',
  enabled: true,
})

function resetForm() {
  form.name = ''; form.cron = '0 * * * *'; form.desc = ''; form.note = ''; form.enabled = true
}

function fillForm(j: CronJob) {
  form.name = j.name; form.cron = j.cron; form.desc = j.desc; form.note = j.note; form.enabled = j.enabled
}

/* ── CRUD Actions ── */
function openAdd() { resetForm(); addOpen.value = true }

function openEdit(j: CronJob) { fillForm(j); editTarget.value = j; editOpen.value = true }

function openEditFromDetail() {
  if (!detailTarget.value) return
  const j = detailTarget.value
  detailOpen.value = false
  openEdit(j)
}

function openDetail(j: CronJob) { detailTarget.value = j; detailOpen.value = true }

function openDelete(j: CronJob, e: Event) {
  e.stopPropagation()
  deleteTarget.value = j; deleteOpen.value = true
}

function openRunNow(j: CronJob, e: Event) {
  e.stopPropagation()
  runTarget.value = j; runNowOpen.value = true
}

async function handleAdd() {
  if (!form.name.trim()) {
    showToast('error', 'Vui lòng nhập tên job')
    return
  }
  addLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  jobs.value.push({
    id: Date.now(),
    name: form.name,
    cron: form.cron,
    desc: form.desc,
    note: form.note,
    enabled: form.enabled,
    lastRun: '—', nextRun: '—',
    status: 'pending',
    runs: 0,
    createdAt: new Date().toLocaleDateString('vi-VN'),
  })
  addLoading.value = false
  addOpen.value = false
  showToast('success', `Đã tạo job "${form.name}"`)
}

async function handleEdit() {
  if (!form.name.trim()) {
    showToast('error', 'Vui lòng nhập tên job')
    return
  }
  editLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const idx = jobs.value.findIndex(j => j.id === editTarget.value?.id)
  if (idx !== -1) {
    jobs.value[idx] = {
      ...jobs.value[idx],
      name: form.name, cron: form.cron, desc: form.desc,
      note: form.note, enabled: form.enabled,
    }
    if (detailTarget.value?.id === editTarget.value?.id) {
      detailTarget.value = jobs.value[idx]
    }
  }
  editLoading.value = false
  editOpen.value = false
  showToast('success', 'Đã cập nhật job')
}

async function handleDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 700))
  const name = deleteTarget.value?.name ?? ''
  jobs.value = jobs.value.filter(j => j.id !== deleteTarget.value?.id)
  const si = selected.value.indexOf(deleteTarget.value?.id ?? -1)
  if (si !== -1) selected.value.splice(si, 1)
  deleteLoading.value = false
  deleteOpen.value = false
  showToast('success', `Đã xoá job "${name}"`)
}

async function handleRunNow() {
  runLoading.value = true
  await new Promise(r => setTimeout(r, 500))
  const id = runTarget.value?.id
  const idx = jobs.value.findIndex(j => j.id === id)
  if (idx !== -1) {
    jobs.value[idx].status = 'running'
    setTimeout(() => {
      jobs.value[idx].status = 'ok'
      jobs.value[idx].lastRun = 'Vừa xong'
      jobs.value[idx].runs++
    }, 2000)
  }
  runLoading.value = false
  runNowOpen.value = false
  showToast('info', `Đã kích hoạt job "${runTarget.value?.name}"`)
}

async function handleBulkDelete() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  const count = selected.value.length
  jobs.value = jobs.value.filter(j => !selected.value.includes(j.id))
  selected.value = []
  bulkLoading.value = false
  bulkDelOpen.value = false
  showToast('success', `Đã xoá ${count} job`)
}

async function handleBulkEnable() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  jobs.value = jobs.value.map(j => selected.value.includes(j.id) ? { ...j, enabled: true } : j)
  const count = selected.value.length
  selected.value = []
  bulkLoading.value = false
  bulkEnOpen.value = false
  showToast('success', `Đã bật ${count} job`)
}

async function handleBulkDisable() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  jobs.value = jobs.value.map(j => selected.value.includes(j.id) ? { ...j, enabled: false } : j)
  const count = selected.value.length
  selected.value = []
  bulkLoading.value = false
  bulkDisOpen.value = false
  showToast('success', `Đã tắt ${count} job`)
}

function toggleEnabled(j: CronJob) {
  const idx = jobs.value.findIndex(x => x.id === j.id)
  if (idx !== -1) jobs.value[idx].enabled = !jobs.value[idx].enabled
  showToast('success', `${jobs.value[idx]?.enabled ? 'Đã bật' : 'Đã tắt'} job "${j.name}"`)
}
</script>

<template>
  <AppPageLayout section="weconnect"
    current="scheduler"
    page-title="Bộ lập lịch"
    page-description="Quản lý tác vụ định kỳ và cron jobs"
  >
    <template #actions>
      <BaseButton size="sm" @click="openAdd">+ Tạo job mới</BaseButton>
    </template>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <BaseInput
        v-model="search"
        placeholder="Tìm tên job, mô tả..."
        size="sm"
        clearable
        style="max-width: 260px;"
      />
      <BaseSelectMenu
        v-model="statusFilter"
        :options="STATUS_FILTER_OPTIONS"
        size="sm"
        style="width: 175px;"
      />
      <BaseBadge :text="`${filtered.length} jobs`" variant="neutral" />
    </div>

    <!-- ── Table ── -->
    <div class="table-wrap">
      <div class="table-scroll">
        <table class="ct-table">
          <thead>
            <tr>
              <th class="col-check">
                <input ref="headerCheckRef" type="checkbox" class="cb" :checked="isAllSelected" @change="toggleAll" />
              </th>
              <th class="col-on">Bật</th>
              <th class="col-name">Tên job</th>
              <th>Cron</th>
              <th>Trạng thái</th>
              <th>Lần cuối</th>
              <th>Lần tới</th>
              <th class="col-runs">Đã chạy</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="j in filtered"
              :key="j.id"
              class="ct-row"
              :class="{ 'ct-row--selected': selected.includes(j.id), 'ct-row--disabled': !j.enabled }"
              @click="openDetail(j)"
            >
              <td class="col-check" @click.stop>
                <input type="checkbox" class="cb" :checked="selected.includes(j.id)" @change="toggleOne(j.id)" />
              </td>
              <td class="col-on" @click.stop>
                <BaseToggle :model-value="j.enabled" @update:model-value="toggleEnabled(j)" />
              </td>
              <td class="col-name">
                <div class="job-name-cell">
                  <span class="job-name">{{ j.name }}</span>
                  <span class="job-desc">{{ j.desc }}</span>
                </div>
              </td>
              <td><code class="cron-code">{{ j.cron }}</code></td>
              <td>
                <BaseBadge :text="STATUS_LABEL[j.status]" :variant="STATUS_BADGE[j.status]" dot />
              </td>
              <td class="col-time">{{ j.lastRun }}</td>
              <td class="col-time">{{ j.enabled ? j.nextRun : '—' }}</td>
              <td class="col-runs">{{ j.runs.toLocaleString('vi-VN') }}</td>
              <td class="col-actions" @click.stop>
                <div class="row-actions">
                  <BaseButton size="sm" variant="ghost" @click="openRunNow(j, $event)">Chạy ngay</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="openEdit(j)">Sửa</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="openDelete(j, $event)">Xoá</BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filtered.length === 0" class="empty-state">
        <div class="empty-icon">⏰</div>
        <p class="empty-text">Không tìm thấy job nào</p>
        <BaseButton variant="ghost" size="sm" @click="search = ''; statusFilter = 'all'">Xoá bộ lọc</BaseButton>
      </div>
    </div>
  </AppPageLayout>

  <!-- ── Bulk Action Bar ── -->
  <BulkActionBar :count="selected.length" :show="selected.length > 0" @clear="clearSelection">
    <BaseButton size="sm" variant="primary" @click="bulkEnOpen = true">
      Bật {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="warning" @click="bulkDisOpen = true">
      Tắt {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="danger" @click="bulkDelOpen = true">
      Xoá {{ selected.length }}
    </BaseButton>
  </BulkActionBar>

  <!-- ════ Add Modal ════ -->
  <FormModal
    v-model="addOpen"
    title="Tạo Cron Job mới"
    size="md"
    submit-label="Tạo job"
    :loading="addLoading"
    @submit="handleAdd"
  >
    <div class="form-body">
      <FormField label="Tên job" required>
        <BaseInput v-model="form.name" placeholder="vd: Sync users" />
      </FormField>
      <FormField label="Cron expression" hint="Ví dụ: 0 * * * * (mỗi giờ), */5 * * * * (mỗi 5 phút)">
        <BaseInput v-model="form.cron" placeholder="0 * * * *" style="font-family: var(--wx-font-mono);" />
      </FormField>
      <FormField label="Mô tả">
        <BaseInput v-model="form.desc" placeholder="Mô tả ngắn về tác vụ này..." />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" placeholder="Thông tin bổ sung..." :rows="2" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Edit Modal ════ -->
  <FormModal
    v-model="editOpen"
    title="Chỉnh sửa Cron Job"
    size="md"
    submit-label="Lưu thay đổi"
    :loading="editLoading"
    @submit="handleEdit"
  >
    <div class="form-body">
      <FormField label="Tên job" required>
        <BaseInput v-model="form.name" />
      </FormField>
      <FormField label="Cron expression" hint="Ví dụ: 0 */6 * * * (mỗi 6 giờ)">
        <BaseInput v-model="form.cron" style="font-family: var(--wx-font-mono);" />
      </FormField>
      <FormField label="Mô tả">
        <BaseInput v-model="form.desc" />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" :rows="2" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Detail Drawer ════ -->
  <FormDrawer
    v-model="detailOpen"
    :title="detailTarget?.name ?? 'Chi tiết job'"
    size="md"
    submit-label="Chỉnh sửa"
    cancel-label="Đóng"
    @submit="openEditFromDetail"
  >
    <template v-if="detailTarget">
      <div class="detail-header">
        <code class="cron-code cron-lg">{{ detailTarget.cron }}</code>
        <BaseBadge
          :text="STATUS_LABEL[detailTarget.status]"
          :variant="STATUS_BADGE[detailTarget.status]"
          dot
        />
        <BaseBadge
          :text="detailTarget.enabled ? 'Đang bật' : 'Đang tắt'"
          :variant="detailTarget.enabled ? 'success' : 'neutral'"
        />
      </div>

      <div class="detail-section">
        <p class="detail-section__label">Thông tin job</p>
        <div class="detail-row">
          <span class="detail-key">Mô tả</span>
          <span class="detail-val" style="text-align: right; max-width: 220px;">{{ detailTarget.desc || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Ngày tạo</span>
          <span class="detail-val">{{ detailTarget.createdAt }}</span>
        </div>
      </div>

      <div class="detail-section">
        <p class="detail-section__label">Lịch chạy</p>
        <div class="detail-row">
          <span class="detail-key">Lần chạy cuối</span>
          <span class="detail-val">{{ detailTarget.lastRun }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Lần chạy tiếp</span>
          <span class="detail-val">{{ detailTarget.enabled ? detailTarget.nextRun : '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Tổng số lần chạy</span>
          <span class="detail-val runs-val">{{ detailTarget.runs.toLocaleString('vi-VN') }} lần</span>
        </div>
      </div>

      <div v-if="detailTarget.note" class="detail-section">
        <p class="detail-section__label">Ghi chú</p>
        <p class="detail-note">{{ detailTarget.note }}</p>
      </div>

      <div class="detail-danger">
        <BaseButton variant="danger" size="sm" @click="openDelete(detailTarget, $event); detailOpen = false">
          Xoá job này
        </BaseButton>
      </div>
    </template>
  </FormDrawer>

  <!-- ════ Confirm: Delete ════ -->
  <ConfirmDialog
    v-model="deleteOpen"
    title="Xoá Cron Job?"
    :description="`Job '${deleteTarget?.name}' sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.`"
    intent="danger"
    confirm-label="Xoá ngay"
    :loading="deleteLoading"
    @confirm="handleDelete"
  />

  <!-- ════ Confirm: Run now ════ -->
  <ConfirmDialog
    v-model="runNowOpen"
    title="Chạy ngay?"
    :description="`Job '${runTarget?.name}' sẽ được kích hoạt ngay lập tức, không chờ lịch cron.`"
    intent="warning"
    confirm-label="Chạy ngay"
    :loading="runLoading"
    @confirm="handleRunNow"
  />

  <!-- ════ Confirm: Bulk delete ════ -->
  <ConfirmDialog
    v-model="bulkDelOpen"
    title="Xoá nhiều job?"
    :description="`${selected.length} job đã chọn sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDelete"
  />

  <!-- ════ Confirm: Bulk enable ════ -->
  <ConfirmDialog
    v-model="bulkEnOpen"
    title="Bật nhiều job?"
    :description="`${selected.length} job đã chọn sẽ được kích hoạt.`"
    intent="warning"
    confirm-label="Bật tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkEnable"
  />

  <!-- ════ Confirm: Bulk disable ════ -->
  <ConfirmDialog
    v-model="bulkDisOpen"
    title="Tắt nhiều job?"
    :description="`${selected.length} job đã chọn sẽ bị tạm dừng.`"
    intent="warning"
    confirm-label="Tắt tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDisable"
  />
</template>

<style scoped>
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
  min-width: 860px;
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
.ct-row--disabled { opacity: 0.55; }

/* Row actions */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  opacity: 0;
  transition: opacity var(--wx-d-micro);
}
.ct-row:hover .row-actions { opacity: 1; }

/* Columns */
.col-check { width: 44px; }
.col-on    { width: 56px; }
.col-name  { min-width: 220px; }
.col-runs  { width: 90px; text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--wx-fw-semibold); }
.col-time  { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; }
.col-actions { width: 180px; }

/* Checkbox */
.cb { width: 16px; height: 16px; accent-color: var(--wx-brand-primary); cursor: pointer; }

/* Job name cell */
.job-name-cell { display: flex; flex-direction: column; gap: 2px; }
.job-name { font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); line-height: 1.3; }
.job-desc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); line-height: 1.3; }

/* Cron code */
.cron-code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  padding: 2px 8px;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-sm);
  color: var(--wx-text-secondary);
}
.cron-lg { font-size: var(--wx-fs-14); padding: 4px 10px; }

/* ── Empty state ── */
.empty-state {
  padding: var(--wx-space-10) var(--wx-space-6);
  display: flex; flex-direction: column; align-items: center;
  gap: var(--wx-space-3); text-align: center;
}
.empty-icon { font-size: 40px; opacity: 0.35; line-height: 1; }
.empty-text { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }

/* ── Form body ── */
.form-body { display: flex; flex-direction: column; gap: var(--wx-space-4); }

/* ── Detail Drawer ── */
.detail-header {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
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
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--wx-space-4);
  font-size: var(--wx-fs-14);
}
.detail-key { color: var(--wx-text-secondary); flex-shrink: 0; }
.detail-val { color: var(--wx-text-primary); }

.runs-val { font-weight: var(--wx-fw-semibold); color: var(--wx-brand-600); }

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

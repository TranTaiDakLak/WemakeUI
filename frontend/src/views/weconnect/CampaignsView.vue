<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import {
  BaseButton, BaseInput, BaseSelect, BaseTextarea,
  BaseBadge, BaseTag, BaseProgress,
  FormField, FormModal, FormDrawer, ConfirmDialog,
} from '../../components/common'
import { BulkActionBar } from '../../components/data'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── Types ── */
type CampaignStatus   = 'running' | 'completed' | 'scheduled' | 'draft' | 'paused'
type CampaignPlatform = 'zalo' | 'facebook' | 'sms' | 'email'

interface Campaign {
  id: number
  name: string
  platform: CampaignPlatform
  status: CampaignStatus
  sent: number
  total: number
  success: number
  failed: number
  scheduledAt: string
  note: string
  tags: string[]
  createdAt: string
}

/* ── Mock data ── */
const INIT_CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'Khuyến mãi 5/5', platform: 'zalo', status: 'running', sent: 1284, total: 2000, success: 1198, failed: 86, scheduledAt: '05/05/2024 08:00', note: 'Chiến dịch khuyến mãi nhân dịp 5/5. Gửi đến tất cả khách hàng VIP.', tags: ['VIP', 'sale'], createdAt: '01/05/2024' },
  { id: 2, name: 'Thông báo cập nhật v2.1', platform: 'zalo', status: 'completed', sent: 850, total: 850, success: 832, failed: 18, scheduledAt: '03/05/2024 14:00', note: '', tags: ['update'], createdAt: '02/05/2024' },
  { id: 3, name: 'Nhắc lịch hẹn tháng 5', platform: 'sms', status: 'scheduled', sent: 0, total: 500, success: 0, failed: 0, scheduledAt: '06/05/2024 08:00', note: 'Nhắc nhở khách hàng có lịch hẹn trong tháng 5.', tags: ['reminder'], createdAt: '28/04/2024' },
  { id: 4, name: 'Khảo sát NPS Q2', platform: 'email', status: 'draft', sent: 0, total: 300, success: 0, failed: 0, scheduledAt: '—', note: 'Khảo sát mức độ hài lòng khách hàng Q2/2024.', tags: ['survey', 'NPS'], createdAt: '01/05/2024' },
  { id: 5, name: 'Flash sale 24h', platform: 'facebook', status: 'paused', sent: 320, total: 1000, success: 298, failed: 22, scheduledAt: '04/05/2024 12:00', note: 'Tạm dừng do hết ngân sách ngày. Cần phê duyệt để tiếp tục.', tags: ['flash-sale'], createdAt: '03/05/2024' },
  { id: 6, name: 'Cập nhật bảo mật tài khoản', platform: 'sms', status: 'completed', sent: 1500, total: 1500, success: 1489, failed: 11, scheduledAt: '01/05/2024 09:00', note: '', tags: ['security'], createdAt: '30/04/2024' },
  { id: 7, name: 'Chương trình sinh nhật tháng 5', platform: 'email', status: 'scheduled', sent: 0, total: 240, success: 0, failed: 0, scheduledAt: '07/05/2024 07:00', note: 'Gửi voucher sinh nhật đến khách hàng sinh tháng 5.', tags: ['birthday', 'voucher'], createdAt: '01/05/2024' },
  { id: 8, name: 'Thông báo bảo trì hệ thống', platform: 'zalo', status: 'draft', sent: 0, total: 5000, success: 0, failed: 0, scheduledAt: '—', note: '', tags: ['maintenance'], createdAt: '05/05/2024' },
]

const campaigns = ref<Campaign[]>([...INIT_CAMPAIGNS])

/* ── Filter options & lookup maps ── */
const STATUS_FILTER_OPTIONS = [
  { value: 'all',       label: 'Tất cả trạng thái' },
  { value: 'running',   label: 'Đang chạy' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'draft',     label: 'Nháp' },
  { value: 'paused',    label: 'Tạm dừng' },
]

const PLATFORM_FILTER_OPTIONS = [
  { value: 'all',      label: 'Tất cả nền tảng' },
  { value: 'zalo',     label: 'Zalo' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'sms',      label: 'SMS' },
  { value: 'email',    label: 'Email' },
]

const STATUS_BADGE: Record<CampaignStatus, 'info' | 'success' | 'warning' | 'neutral'> = {
  running:   'info',
  completed: 'success',
  scheduled: 'warning',
  draft:     'neutral',
  paused:    'neutral',
}

const STATUS_LABEL: Record<CampaignStatus, string> = {
  running:   'Đang chạy',
  completed: 'Hoàn thành',
  scheduled: 'Đã lên lịch',
  draft:     'Nháp',
  paused:    'Tạm dừng',
}

const PLATFORM_LABEL: Record<CampaignPlatform, string> = {
  zalo:     'Zalo',
  facebook: 'Facebook',
  sms:      'SMS',
  email:    'Email',
}

/* ── Filters ── */
const search         = ref('')
const statusFilter   = ref('all')
const platformFilter = ref('all')

const filtered = computed(() => {
  let list = campaigns.value
  if (statusFilter.value !== 'all')   list = list.filter(c => c.status   === statusFilter.value)
  if (platformFilter.value !== 'all') list = list.filter(c => c.platform === platformFilter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.tags.some(t => t.toLowerCase().includes(q))
  )
  return list
})

/* ── Computed helpers ── */
function progressValue(c: Campaign): number {
  return c.total > 0 ? Math.round((c.sent / c.total) * 100) : 0
}

function successRate(c: Campaign): string {
  if (c.sent === 0) return '—'
  return ((c.success / c.sent) * 100).toFixed(1) + '%'
}

function progressVariant(c: Campaign): 'primary' | 'success' | 'warning' {
  if (c.status === 'completed') return 'success'
  if (c.status === 'paused')    return 'warning'
  return 'primary'
}

/* ── Multi-select ── */
const selected      = ref<number[]>([])
const headerCheckRef = ref<HTMLInputElement | null>(null)

const isAllSelected = computed(() =>
  filtered.value.length > 0 && filtered.value.every(c => selected.value.includes(c.id))
)
const isIndeterminate = computed(() =>
  filtered.value.some(c => selected.value.includes(c.id)) && !isAllSelected.value
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
  else selected.value = filtered.value.map(c => c.id)
}

function clearSelection() { selected.value = [] }

/* ── Overlay open/close state ── */
const addOpen      = ref(false)
const editOpen     = ref(false)
const detailOpen   = ref(false)
const deleteOpen   = ref(false)
const bulkDelOpen  = ref(false)
const bulkPauseOpen = ref(false)

const addLoading    = ref(false)
const editLoading   = ref(false)
const deleteLoading = ref(false)
const bulkLoading   = ref(false)

const editTarget   = ref<Campaign | null>(null)
const detailTarget = ref<Campaign | null>(null)
const deleteTarget = ref<Campaign | null>(null)

/* ── Form ── */
const FORM_STATUS_OPTIONS = [
  { value: 'draft',     label: 'Nháp' },
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'paused',    label: 'Tạm dừng' },
]

const FORM_PLATFORM_OPTIONS = [
  { value: 'zalo',     label: 'Zalo' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'sms',      label: 'SMS' },
  { value: 'email',    label: 'Email' },
]

const form = reactive({
  name:        '',
  platform:    'zalo' as CampaignPlatform,
  status:      'draft' as CampaignStatus,
  totalTarget: '',
  scheduledAt: '',
  tags:        '',
  note:        '',
})

function resetForm() {
  form.name = ''; form.platform = 'zalo'; form.status = 'draft'
  form.totalTarget = ''; form.scheduledAt = ''; form.tags = ''; form.note = ''
}

function fillForm(c: Campaign) {
  form.name = c.name
  form.platform = c.platform
  form.status = (['running', 'completed'] as CampaignStatus[]).includes(c.status)
    ? 'scheduled'
    : c.status
  form.totalTarget = String(c.total)
  form.scheduledAt = c.scheduledAt === '—' ? '' : c.scheduledAt
  form.tags = c.tags.join(', ')
  form.note = c.note
}

function parseTags(str: string): string[] {
  return str.split(',').map(t => t.trim()).filter(Boolean)
}

/* ── CRUD handlers ── */
function openAdd() { resetForm(); addOpen.value = true }

function openEdit(c: Campaign) { fillForm(c); editTarget.value = c; editOpen.value = true }

function openDetail(c: Campaign) { detailTarget.value = c; detailOpen.value = true }

function openEditFromDetail() {
  if (!detailTarget.value) return
  const c = detailTarget.value
  detailOpen.value = false
  openEdit(c)
}

function openDelete(c: Campaign, e: MouseEvent) {
  e.stopPropagation()
  deleteTarget.value = c
  deleteOpen.value = true
}

async function handleAdd() {
  if (!form.name.trim()) {
    showToast('error', 'Vui lòng điền tên chiến dịch')
    return
  }
  addLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  campaigns.value.unshift({
    id: Date.now(),
    name: form.name,
    platform: form.platform,
    status: 'draft',
    sent: 0, success: 0, failed: 0,
    total: parseInt(form.totalTarget, 10) || 0,
    scheduledAt: form.scheduledAt.trim() || '—',
    note: form.note,
    tags: parseTags(form.tags),
    createdAt: new Date().toLocaleDateString('vi-VN'),
  })
  addLoading.value = false
  addOpen.value = false
  showToast('success', `Đã tạo chiến dịch "${form.name}"`)
}

async function handleEdit() {
  if (!form.name.trim()) {
    showToast('error', 'Vui lòng điền tên chiến dịch')
    return
  }
  editLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  const idx = campaigns.value.findIndex(c => c.id === editTarget.value?.id)
  if (idx !== -1) {
    campaigns.value[idx] = {
      ...campaigns.value[idx],
      name: form.name,
      platform: form.platform,
      status: form.status,
      total: parseInt(form.totalTarget, 10) || campaigns.value[idx].total,
      scheduledAt: form.scheduledAt.trim() || '—',
      note: form.note,
      tags: parseTags(form.tags),
    }
    if (detailTarget.value?.id === editTarget.value?.id) {
      detailTarget.value = campaigns.value[idx]
    }
  }
  editLoading.value = false
  editOpen.value = false
  showToast('success', 'Đã cập nhật chiến dịch')
}

async function handleDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const name = deleteTarget.value?.name ?? ''
  const id   = deleteTarget.value?.id ?? -1
  campaigns.value = campaigns.value.filter(c => c.id !== id)
  const si = selected.value.indexOf(id)
  if (si !== -1) selected.value.splice(si, 1)
  deleteLoading.value = false
  deleteOpen.value = false
  showToast('success', `Đã xoá "${name}"`)
}

async function handleBulkDelete() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  const count = selected.value.length
  campaigns.value = campaigns.value.filter(c => !selected.value.includes(c.id))
  selected.value = []
  bulkLoading.value = false
  bulkDelOpen.value = false
  showToast('success', `Đã xoá ${count} chiến dịch`)
}

async function handleBulkPause() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 700))
  campaigns.value = campaigns.value.map(c =>
    selected.value.includes(c.id) && c.status === 'running'
      ? { ...c, status: 'paused' as CampaignStatus }
      : c
  )
  bulkLoading.value = false
  bulkPauseOpen.value = false
  showToast('success', 'Đã tạm dừng các chiến dịch đang chạy')
}

function handleBulkActivate() {
  const count = selected.value.length
  campaigns.value = campaigns.value.map(c =>
    selected.value.includes(c.id) && (['paused', 'draft'] as CampaignStatus[]).includes(c.status)
      ? { ...c, status: 'scheduled' as CampaignStatus }
      : c
  )
  selected.value = []
  showToast('success', `Đã kích hoạt ${count} chiến dịch`)
}
</script>

<template>
  <WeConnectLayout
    current="campaigns"
    page-title="Chiến dịch tin nhắn"
    page-description="Tạo và theo dõi chiến dịch gửi tin hàng loạt"
  >
    <template #actions>
      <BaseButton size="sm" @click="openAdd">+ Tạo chiến dịch</BaseButton>
    </template>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <BaseInput
        v-model="search"
        placeholder="Tìm tên chiến dịch, nhãn..."
        size="sm"
        clearable
        style="max-width: 260px;"
      />
      <BaseSelect
        v-model="statusFilter"
        :options="STATUS_FILTER_OPTIONS"
        size="sm"
        style="width: 180px;"
      />
      <BaseSelect
        v-model="platformFilter"
        :options="PLATFORM_FILTER_OPTIONS"
        size="sm"
        style="width: 170px;"
      />
      <BaseBadge :text="`${filtered.length} chiến dịch`" variant="neutral" />
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
              <th class="col-name">Chiến dịch</th>
              <th>Nền tảng</th>
              <th>Trạng thái</th>
              <th class="col-progress">Tiến độ</th>
              <th class="col-rate">Tỷ lệ</th>
              <th class="col-time">Lên lịch</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in filtered"
              :key="c.id"
              class="ct-row"
              :class="{ 'ct-row--selected': selected.includes(c.id) }"
              @click="openDetail(c)"
            >
              <!-- Checkbox -->
              <td class="col-check" @click.stop>
                <input
                  type="checkbox"
                  class="cb"
                  :checked="selected.includes(c.id)"
                  @change="toggleOne(c.id)"
                />
              </td>

              <!-- Name + tags -->
              <td class="col-name">
                <div class="campaign-cell">
                  <span class="campaign-name">{{ c.name }}</span>
                  <div v-if="c.tags.length" class="tags-cell">
                    <BaseTag
                      v-for="t in c.tags.slice(0, 2)"
                      :key="t"
                      :text="t"
                      size="sm"
                      variant="neutral"
                    />
                    <span v-if="c.tags.length > 2" class="tag-more">+{{ c.tags.length - 2 }}</span>
                  </div>
                </div>
              </td>

              <!-- Platform -->
              <td>
                <span class="platform-tag">{{ PLATFORM_LABEL[c.platform] }}</span>
              </td>

              <!-- Status -->
              <td>
                <BaseBadge :text="STATUS_LABEL[c.status]" :variant="STATUS_BADGE[c.status]" dot />
              </td>

              <!-- Progress bar -->
              <td class="col-progress">
                <template v-if="['running', 'completed', 'paused'].includes(c.status) && c.total > 0">
                  <div class="prog-cell">
                    <div class="prog-bar-wrap">
                      <BaseProgress :value="progressValue(c)" :variant="progressVariant(c)" />
                    </div>
                    <span class="prog-text">
                      {{ c.sent.toLocaleString('vi-VN') }}/{{ c.total.toLocaleString('vi-VN') }}
                    </span>
                  </div>
                </template>
                <span v-else class="col-muted">—</span>
              </td>

              <!-- Success rate -->
              <td class="col-rate">
                <span :class="c.sent > 0 ? 'rate-good' : 'col-muted'">{{ successRate(c) }}</span>
              </td>

              <!-- Scheduled time -->
              <td class="col-time">{{ c.scheduledAt }}</td>

              <!-- Row actions (hover-only) -->
              <td class="col-actions" @click.stop>
                <div class="row-actions">
                  <BaseButton size="sm" variant="ghost" @click="openEdit(c)">Sửa</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="openDelete(c, $event)">Xoá</BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filtered.length === 0" class="empty-state">
        <div class="empty-state__icon">📣</div>
        <p class="empty-state__text">Không tìm thấy chiến dịch nào</p>
        <BaseButton
          variant="ghost"
          size="sm"
          @click="search = ''; statusFilter = 'all'; platformFilter = 'all'"
        >
          Xoá bộ lọc
        </BaseButton>
      </div>
    </div>
  </WeConnectLayout>

  <!-- ── Bulk Action Bar ── -->
  <BulkActionBar :count="selected.length" :show="selected.length > 0" @clear="clearSelection">
    <BaseButton size="sm" variant="warning" @click="bulkPauseOpen = true">
      Tạm dừng {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="primary" @click="handleBulkActivate">
      Kích hoạt {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="danger" @click="bulkDelOpen = true">
      Xoá {{ selected.length }}
    </BaseButton>
  </BulkActionBar>

  <!-- ════ Add Modal ════ -->
  <FormModal
    v-model="addOpen"
    title="Tạo chiến dịch mới"
    size="md"
    submit-label="Tạo chiến dịch"
    :loading="addLoading"
    @submit="handleAdd"
  >
    <div class="form-body">
      <FormField label="Tên chiến dịch" required>
        <BaseInput v-model="form.name" placeholder="Khuyến mãi tháng 5..." />
      </FormField>
      <div class="form-row-2">
        <FormField label="Nền tảng">
          <BaseSelect v-model="form.platform" :options="FORM_PLATFORM_OPTIONS" />
        </FormField>
        <FormField label="Tổng tin nhắn" hint="Số lượng người nhận">
          <BaseInput v-model="form.totalTarget" type="number" placeholder="0" />
        </FormField>
      </div>
      <FormField label="Lên lịch gửi" hint="Định dạng: DD/MM/YYYY HH:mm">
        <BaseInput v-model="form.scheduledAt" placeholder="06/05/2024 08:00" />
      </FormField>
      <FormField label="Nhãn" hint="Cách nhau bởi dấu phẩy">
        <BaseInput v-model="form.tags" placeholder="VIP, sale, Q2..." />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" placeholder="Mô tả mục tiêu chiến dịch..." :rows="3" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Edit Modal ════ -->
  <FormModal
    v-model="editOpen"
    title="Chỉnh sửa chiến dịch"
    size="md"
    submit-label="Lưu thay đổi"
    :loading="editLoading"
    @submit="handleEdit"
  >
    <div class="form-body">
      <FormField label="Tên chiến dịch" required>
        <BaseInput v-model="form.name" />
      </FormField>
      <div class="form-row-2">
        <FormField label="Nền tảng">
          <BaseSelect v-model="form.platform" :options="FORM_PLATFORM_OPTIONS" />
        </FormField>
        <FormField label="Trạng thái">
          <BaseSelect v-model="form.status" :options="FORM_STATUS_OPTIONS" />
        </FormField>
      </div>
      <div class="form-row-2">
        <FormField label="Tổng tin nhắn">
          <BaseInput v-model="form.totalTarget" type="number" />
        </FormField>
        <FormField label="Lên lịch gửi" hint="DD/MM/YYYY HH:mm">
          <BaseInput v-model="form.scheduledAt" placeholder="—" />
        </FormField>
      </div>
      <FormField label="Nhãn" hint="Cách nhau bởi dấu phẩy">
        <BaseInput v-model="form.tags" />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" :rows="3" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Detail Drawer ════ -->
  <FormDrawer
    v-model="detailOpen"
    :title="detailTarget?.name ?? 'Chi tiết chiến dịch'"
    size="md"
    submit-label="Chỉnh sửa"
    cancel-label="Đóng"
    @submit="openEditFromDetail"
  >
    <template v-if="detailTarget">
      <!-- Header: platform + status -->
      <div class="detail-header">
        <span class="detail-platform">{{ PLATFORM_LABEL[detailTarget.platform] }}</span>
        <BaseBadge
          :text="STATUS_LABEL[detailTarget.status]"
          :variant="STATUS_BADGE[detailTarget.status]"
          dot
        />
      </div>

      <!-- Progress & stats — chỉ hiện khi có gửi -->
      <div
        v-if="['running', 'completed', 'paused'].includes(detailTarget.status) && detailTarget.total > 0"
        class="detail-section"
      >
        <p class="detail-section__label">Tiến độ gửi</p>
        <div class="detail-progress-row">
          <div class="detail-progress-bar">
            <BaseProgress :value="progressValue(detailTarget)" :variant="progressVariant(detailTarget)" />
          </div>
          <span class="detail-prog-pct">{{ progressValue(detailTarget) }}%</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-val">{{ detailTarget.total.toLocaleString('vi-VN') }}</span>
            <span class="stat-key">Tổng</span>
          </div>
          <div class="stat-item">
            <span class="stat-val">{{ detailTarget.sent.toLocaleString('vi-VN') }}</span>
            <span class="stat-key">Đã gửi</span>
          </div>
          <div class="stat-item stat-item--success">
            <span class="stat-val">{{ detailTarget.success.toLocaleString('vi-VN') }}</span>
            <span class="stat-key">Thành công</span>
          </div>
          <div class="stat-item stat-item--danger">
            <span class="stat-val">{{ detailTarget.failed }}</span>
            <span class="stat-key">Thất bại</span>
          </div>
          <div class="stat-item stat-item--info">
            <span class="stat-val">{{ successRate(detailTarget) }}</span>
            <span class="stat-key">Tỷ lệ</span>
          </div>
        </div>
      </div>

      <!-- Info section -->
      <div class="detail-section">
        <p class="detail-section__label">Thông tin</p>
        <div class="detail-row">
          <span class="detail-key">Nền tảng</span>
          <span class="detail-val">{{ PLATFORM_LABEL[detailTarget.platform] }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Mục tiêu</span>
          <span class="detail-val">{{ detailTarget.total.toLocaleString('vi-VN') }} tin</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Lên lịch</span>
          <span class="detail-val">{{ detailTarget.scheduledAt }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Ngày tạo</span>
          <span class="detail-val">{{ detailTarget.createdAt }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="detail-section">
        <p class="detail-section__label">Nhãn</p>
        <div class="tags-cell">
          <BaseTag
            v-for="t in detailTarget.tags"
            :key="t"
            :text="t"
            size="sm"
            variant="neutral"
          />
          <span v-if="!detailTarget.tags.length" class="detail-empty">Chưa gán nhãn</span>
        </div>
      </div>

      <!-- Note -->
      <div v-if="detailTarget.note" class="detail-section">
        <p class="detail-section__label">Ghi chú</p>
        <p class="detail-note">{{ detailTarget.note }}</p>
      </div>

      <!-- Danger zone -->
      <div class="detail-danger">
        <BaseButton
          variant="danger"
          size="sm"
          @click="openDelete(detailTarget, $event); detailOpen = false"
        >
          Xoá chiến dịch
        </BaseButton>
      </div>
    </template>
  </FormDrawer>

  <!-- ════ Confirm: Delete single ════ -->
  <ConfirmDialog
    v-model="deleteOpen"
    title="Xoá chiến dịch?"
    :description="`'${deleteTarget?.name}' sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.`"
    intent="danger"
    confirm-label="Xoá ngay"
    :loading="deleteLoading"
    @confirm="handleDelete"
  />

  <!-- ════ Confirm: Bulk delete ════ -->
  <ConfirmDialog
    v-model="bulkDelOpen"
    title="Xoá nhiều chiến dịch?"
    :description="`${selected.length} chiến dịch đã chọn sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDelete"
  />

  <!-- ════ Confirm: Bulk pause ════ -->
  <ConfirmDialog
    v-model="bulkPauseOpen"
    title="Tạm dừng chiến dịch?"
    :description="`Các chiến dịch đang chạy trong số ${selected.length} mục đã chọn sẽ bị tạm dừng.`"
    intent="warning"
    confirm-label="Tạm dừng"
    :loading="bulkLoading"
    @confirm="handleBulkPause"
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
  min-width: 900px;
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
.ct-row {
  cursor: pointer;
  transition: background var(--wx-duration-micro) var(--wx-easing-default);
}
.ct-row:last-child td { border-bottom: none; }
.ct-row:hover td { background: var(--wx-hover-bg); }
.ct-row--selected td { background: var(--wx-selected-bg); }

/* Row actions — hidden until hover */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  opacity: 0;
  transition: opacity var(--wx-duration-micro);
}
.ct-row:hover .row-actions { opacity: 1; }

/* Column widths */
.col-check    { width: 44px; }
.col-name     { min-width: 220px; }
.col-progress { min-width: 190px; }
.col-rate     { width: 80px; text-align: right; }
.col-time     { min-width: 150px; white-space: nowrap; }
.col-actions  { width: 130px; }

/* Checkbox */
.cb {
  width: 16px;
  height: 16px;
  accent-color: var(--wx-brand-primary);
  cursor: pointer;
}

/* Campaign name + tags cell */
.campaign-cell {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}

.campaign-name {
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-primary);
  line-height: 1.3;
}

.tags-cell {
  display: flex;
  gap: var(--wx-space-1);
  flex-wrap: wrap;
}

.tag-more {
  font-size: var(--wx-fs-11);
  color: var(--wx-text-muted);
  padding: 1px 5px;
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-full);
  border: 1px solid var(--wx-border-subtle);
}

/* Platform tag */
.platform-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-full);
}

/* Progress in table */
.prog-cell {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
}

.prog-bar-wrap {
  flex: 1;
  min-width: 80px;
}

.prog-bar-wrap :deep(.wx-progress) {
  height: 6px;
  border-radius: var(--wx-radius-full);
}

.prog-text {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Success rate */
.col-muted { color: var(--wx-text-muted); font-size: var(--wx-fs-13); }
.rate-good {
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-success-text);
}

/* Column time */
.col-time {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
}

/* ── Empty state ── */
.empty-state {
  padding: var(--wx-space-10) var(--wx-space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-3);
  text-align: center;
}
.empty-state__icon { font-size: 40px; opacity: 0.35; line-height: 1; }
.empty-state__text { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }

/* ── Form layout ── */
.form-body {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}
.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-4);
}

/* ── Detail Drawer ── */
.detail-header {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding-bottom: var(--wx-space-4);
  margin-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.detail-platform {
  display: inline-block;
  padding: 4px 12px;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-full);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-5);
}

.detail-section__label {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
}

/* Progress in drawer */
.detail-progress-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
}

.detail-progress-bar {
  flex: 1;
}

.detail-progress-bar :deep(.wx-progress) {
  height: 8px;
  border-radius: var(--wx-radius-full);
}

.detail-prog-pct {
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  min-width: 36px;
  text-align: right;
  flex-shrink: 0;
}

/* Stats grid */
.stats-grid {
  display: flex;
  gap: var(--wx-space-5);
  flex-wrap: wrap;
  padding-top: var(--wx-space-2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-val {
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  line-height: 1.2;
}

.stat-key {
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stat-item--success .stat-val { color: var(--wx-success-text); }
.stat-item--danger  .stat-val { color: var(--wx-danger-text);  }
.stat-item--info    .stat-val { color: var(--wx-brand-600);    }

/* Detail rows */
.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-4);
  font-size: var(--wx-fs-14);
}

.detail-key {
  color: var(--wx-text-secondary);
  flex-shrink: 0;
}

.detail-val {
  color: var(--wx-text-primary);
  text-align: right;
}

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

.detail-empty {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-muted);
  font-style: italic;
}

.detail-danger {
  padding-top: var(--wx-space-5);
  border-top: 1px solid var(--wx-border-subtle);
  margin-top: auto;
}
</style>

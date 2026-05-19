<script setup lang="ts">
import { ref, reactive, computed, watchEffect, onMounted } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import {
  BaseButton, BaseInput, BaseSelectMenu, BaseTextarea,
  BaseBadge, BaseAvatar, BaseTag,
  FormField, FormModal, FormDrawer, ConfirmDialog,
} from '../../components/common'
import { BulkActionBar } from '../../components/data'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── Types ── */
type AccountStatus = 'connected' | 'disconnected' | 'qr_pending' | 'error'
type AccountType   = 'WhatsApp' | 'WhatsApp Business' | 'Telegram' | 'Zalo'

interface Account {
  id: number
  displayName: string
  handle: string
  type: AccountType
  status: AccountStatus
  phone: string
  sessions: number
  proxy: string
  note: string
  connectedAt: string
  tags: string[]
}

/* ── Mock data ── */
const INIT_ACCOUNTS: Account[] = [
  { id: 1, displayName: 'Bất Cống - Nhà hàng', handle: '@batcong.vn', type: 'WhatsApp Business', status: 'connected', phone: '+84912345678', sessions: 18, proxy: '45.32.120.11:3128', note: 'Tài khoản chính, ưu tiên uptime 24/7.', connectedAt: '10/03/2026', tags: ['production', 'VIP'] },
  { id: 2, displayName: 'Startup XYZ Support', handle: '@startup.xyz', type: 'WhatsApp', status: 'connected', phone: '+84987654321', sessions: 45, proxy: '', note: 'CSKH chính cho kênh B2B.', connectedAt: '15/03/2026', tags: ['support'] },
  { id: 3, displayName: 'ABC Corp CSKH', handle: '@corp.abc', type: 'WhatsApp Business', status: 'disconnected', phone: '+84901234567', sessions: 0, proxy: '103.72.55.22:8080', note: 'Mất kết nối sau bản cập nhật. Cần QR mới.', connectedAt: '05/01/2026', tags: ['enterprise'] },
  { id: 4, displayName: 'Boutique Hà Nội', handle: '@boutique.vn', type: 'WhatsApp', status: 'connected', phone: '+84956789012', sessions: 7, proxy: '', note: '', connectedAt: '20/02/2026', tags: ['retail'] },
  { id: 5, displayName: 'DEF Technology', handle: '@tech.def', type: 'WhatsApp Business', status: 'qr_pending', phone: '+84923456789', sessions: 0, proxy: '103.21.148.90:3128', note: 'Tài khoản mới, chờ quét QR để kích hoạt.', connectedAt: '—', tags: ['new'] },
  { id: 6, displayName: 'Shopee VN Flash Sale', handle: '@shopee.flash', type: 'Telegram', status: 'connected', phone: '+84934567890', sessions: 132, proxy: '', note: 'Bot Telegram cho kênh flash sale.', connectedAt: '01/04/2026', tags: ['bot', 'ecom'] },
  { id: 7, displayName: 'Viettel Enterprise', handle: '@viettel.ent', type: 'Zalo', status: 'error', phone: '+84967890123', sessions: 0, proxy: '14.225.255.100:80', note: 'Lỗi xác thực OTP. Kiểm tra số điện thoại.', connectedAt: '08/04/2026', tags: ['telco'] },
  { id: 8, displayName: 'MoMo Notifications', handle: '@momo.notify', type: 'Zalo', status: 'connected', phone: '+84978901234', sessions: 88, proxy: '', note: 'Gửi thông báo giao dịch tự động.', connectedAt: '12/03/2026', tags: ['fintech', 'bot'] },
]

const accounts     = ref<Account[]>([...INIT_ACCOUNTS])
const tableLoading = ref(true)
onMounted(() => { setTimeout(() => { tableLoading.value = false }, 650) })

/* ── Filters ── */
const search       = ref('')
const statusFilter = ref('all')
const typeFilter   = ref('all')

const STATUS_FILTER = [
  { value: 'all',          label: 'Tất cả trạng thái' },
  { value: 'connected',    label: 'Đã kết nối' },
  { value: 'disconnected', label: 'Mất kết nối' },
  { value: 'qr_pending',   label: 'Chờ QR' },
  { value: 'error',        label: 'Lỗi' },
]

const TYPE_FILTER = [
  { value: 'all',                label: 'Tất cả loại' },
  { value: 'WhatsApp',           label: 'WhatsApp' },
  { value: 'WhatsApp Business',  label: 'WhatsApp Business' },
  { value: 'Telegram',           label: 'Telegram' },
  { value: 'Zalo',               label: 'Zalo' },
]

const STATUS_BADGE: Record<AccountStatus, 'success' | 'neutral' | 'warning' | 'danger'> = {
  connected:    'success',
  disconnected: 'neutral',
  qr_pending:   'warning',
  error:        'danger',
}

const STATUS_LABEL: Record<AccountStatus, string> = {
  connected:    'Đã kết nối',
  disconnected: 'Mất kết nối',
  qr_pending:   'Chờ QR',
  error:        'Lỗi',
}

const filtered = computed(() => {
  let list = accounts.value
  if (statusFilter.value !== 'all') list = list.filter(a => a.status === statusFilter.value)
  if (typeFilter.value   !== 'all') list = list.filter(a => a.type   === typeFilter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(a =>
    a.displayName.toLowerCase().includes(q) ||
    a.handle.toLowerCase().includes(q)       ||
    a.phone.includes(q)
  )
  return list
})

const connectedCount = computed(() => accounts.value.filter(a => a.status === 'connected').length)

/* ── Multi-select ── */
const selected       = ref<number[]>([])
const headerCheckRef = ref<HTMLInputElement | null>(null)

const isAllSelected   = computed(() =>
  filtered.value.length > 0 && filtered.value.every(a => selected.value.includes(a.id))
)
const isIndeterminate = computed(() =>
  filtered.value.some(a => selected.value.includes(a.id)) && !isAllSelected.value
)

watchEffect(() => {
  if (headerCheckRef.value) headerCheckRef.value.indeterminate = isIndeterminate.value
})

function toggleOne(id: number) {
  const i = selected.value.indexOf(id)
  if (i !== -1) selected.value.splice(i, 1)
  else selected.value.push(id)
}
function toggleAll()      { selected.value = isAllSelected.value ? [] : filtered.value.map(a => a.id) }
function clearSelection() { selected.value = [] }

/* ── Overlay state ── */
const addOpen        = ref(false)
const editOpen       = ref(false)
const detailOpen     = ref(false)
const deleteOpen     = ref(false)
const bulkDelOpen    = ref(false)
const bulkDisconOpen = ref(false)

const addLoading    = ref(false)
const editLoading   = ref(false)
const deleteLoading = ref(false)
const bulkLoading   = ref(false)

const editTarget   = ref<Account | null>(null)
const detailTarget = ref<Account | null>(null)
const deleteTarget = ref<Account | null>(null)
const highlightId  = ref<number | null>(null)

/* ── Form ── */
const FORM_TYPE_OPTIONS = [
  { value: 'WhatsApp',          label: 'WhatsApp' },
  { value: 'WhatsApp Business', label: 'WhatsApp Business' },
  { value: 'Telegram',          label: 'Telegram' },
  { value: 'Zalo',              label: 'Zalo' },
]

const form = reactive({
  displayName: '',
  handle:      '',
  type:        'WhatsApp' as AccountType,
  phone:       '',
  proxy:       '',
  tags:        '',
  note:        '',
})

function resetForm() {
  Object.assign(form, { displayName: '', handle: '', type: 'WhatsApp' as AccountType, phone: '', proxy: '', tags: '', note: '' })
}

function fillForm(a: Account) {
  Object.assign(form, {
    displayName: a.displayName, handle: a.handle,
    type: a.type, phone: a.phone, proxy: a.proxy,
    tags: a.tags.join(', '), note: a.note,
  })
}

function parseTags(s: string) { return s.split(',').map(t => t.trim()).filter(Boolean) }

/* ── CRUD ── */
function openAdd()    { resetForm(); addOpen.value = true }
function openEdit(a: Account) { fillForm(a); editTarget.value = a; editOpen.value = true }
function openDetail(a: Account) {
  highlightId.value = a.id
  detailTarget.value = a
  detailOpen.value = true
  setTimeout(() => { highlightId.value = null }, 600)
}

function openEditFromDetail() {
  if (!detailTarget.value) return
  const a = detailTarget.value
  detailOpen.value = false
  openEdit(a)
}

function openDelete(a: Account, e: MouseEvent) {
  e.stopPropagation()
  deleteTarget.value = a
  deleteOpen.value = true
}

async function handleAdd() {
  if (!form.displayName.trim() || !form.phone.trim()) {
    showToast('error', 'Vui lòng điền Tên hiển thị và Số điện thoại')
    return
  }
  addLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  accounts.value.unshift({
    id: Date.now(),
    displayName: form.displayName,
    handle: form.handle || `@${form.phone.replace('+84', '').replace(/\s/g, '')}`,
    type: form.type, phone: form.phone, proxy: form.proxy,
    status: 'qr_pending', sessions: 0,
    tags: parseTags(form.tags), note: form.note,
    connectedAt: '—',
  })
  addLoading.value = false
  addOpen.value = false
  showToast('success', `Tài khoản "${form.displayName}" đã thêm. Vui lòng quét QR để kết nối.`)
}

async function handleEdit() {
  if (!form.displayName.trim()) {
    showToast('error', 'Vui lòng điền tên hiển thị')
    return
  }
  editLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  const idx = accounts.value.findIndex(a => a.id === editTarget.value?.id)
  if (idx !== -1) {
    accounts.value[idx] = {
      ...accounts.value[idx],
      displayName: form.displayName, handle: form.handle,
      type: form.type, phone: form.phone, proxy: form.proxy,
      tags: parseTags(form.tags), note: form.note,
    }
    if (detailTarget.value?.id === editTarget.value?.id) detailTarget.value = accounts.value[idx]
  }
  editLoading.value = false
  editOpen.value = false
  showToast('success', 'Đã cập nhật tài khoản')
}

async function handleDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const name = deleteTarget.value?.displayName ?? ''
  accounts.value = accounts.value.filter(a => a.id !== deleteTarget.value?.id)
  selected.value  = selected.value.filter(id => id !== deleteTarget.value?.id)
  deleteLoading.value = false
  deleteOpen.value = false
  showToast('success', `Đã xoá tài khoản "${name}"`)
}

async function handleBulkDelete() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  const count = selected.value.length
  accounts.value = accounts.value.filter(a => !selected.value.includes(a.id))
  selected.value = []
  bulkLoading.value = false
  bulkDelOpen.value = false
  showToast('success', `Đã xoá ${count} tài khoản`)
}

async function handleBulkDisconnect() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 700))
  accounts.value = accounts.value.map(a =>
    selected.value.includes(a.id) && a.status === 'connected'
      ? { ...a, status: 'disconnected' as AccountStatus, sessions: 0 }
      : a
  )
  const count = selected.value.length
  selected.value = []
  bulkLoading.value = false
  bulkDisconOpen.value = false
  showToast('success', `Đã ngắt kết nối ${count} tài khoản`)
}

function quickConnect(a: Account, e: MouseEvent) {
  e.stopPropagation()
  accounts.value = accounts.value.map(acc =>
    acc.id === a.id ? { ...acc, status: 'qr_pending' as AccountStatus } : acc
  )
  showToast('info', `Đang tạo mã QR cho "${a.displayName}"...`)
}
</script>

<template>
  <AppPageLayout section="wemakeui"
    current="accounts"
    page-title="Tài khoản kết nối"
    page-description="Quản lý các tài khoản WhatsApp, Telegram và Zalo đang kết nối"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Xuất danh sách</BaseButton>
      <BaseButton size="sm" @click="openAdd">+ Kết nối tài khoản</BaseButton>
    </template>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <BaseInput
        v-model="search"
        placeholder="Tìm tên, handle, số điện thoại..."
        size="sm"
        clearable
        style="max-width: 280px;"
      />
      <BaseSelectMenu v-model="statusFilter" :options="STATUS_FILTER" size="sm" style="width: 180px;" />
      <BaseSelectMenu v-model="typeFilter"   :options="TYPE_FILTER"   size="sm" style="width: 185px;" />
      <BaseBadge :text="`${connectedCount} đang kết nối`" variant="success" />
      <BaseBadge :text="`${filtered.length} tài khoản`"  variant="neutral" />
    </div>

    <!-- ── Table ── -->
    <div class="table-wrap">
      <!-- Loading skeleton -->
      <Transition name="skel-fade">
        <div v-if="tableLoading" class="table-skel">
          <div v-for="n in 6" :key="n" class="skel-row">
            <div class="skel-cell skel-chk" />
            <div class="skel-cell skel-wide" />
            <div class="skel-cell skel-md" />
            <div class="skel-cell skel-sm" />
            <div class="skel-cell skel-xs" />
            <div class="skel-cell skel-sm" />
            <div class="skel-cell skel-md" />
          </div>
        </div>
      </Transition>

      <Transition name="tbl-fade">
        <div v-if="!tableLoading" class="table-scroll">
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
              <th>Tài khoản</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th class="col-center">Phiên</th>
              <th>Proxy</th>
              <th>Kết nối</th>
              <th class="col-actions"></th>
            </tr>
          </thead>

          <TransitionGroup tag="tbody" name="row-fade" appear>
            <tr
              v-for="(a, idx) in filtered"
              :key="a.id"
              :style="{ '--i': idx }"
              class="ct-row"
              :class="{ 'ct-row--selected': selected.includes(a.id), 'row--hl': highlightId === a.id }"
              @click="openDetail(a)"
            >
              <!-- Checkbox -->
              <td class="col-check" @click.stop>
                <input
                  type="checkbox"
                  class="cb"
                  :checked="selected.includes(a.id)"
                  @change="toggleOne(a.id)"
                />
              </td>

              <!-- Account cell -->
              <td>
                <div class="acc-cell">
                  <BaseAvatar :name="a.displayName" size="sm" />
                  <div class="acc-info">
                    <span class="acc-name">{{ a.displayName }}</span>
                    <span class="acc-handle">{{ a.handle }}</span>
                  </div>
                </div>
              </td>

              <!-- Type -->
              <td>
                <span class="type-tag">{{ a.type }}</span>
              </td>

              <!-- Status -->
              <td>
                <BaseBadge :text="STATUS_LABEL[a.status]" :variant="STATUS_BADGE[a.status]" dot />
              </td>

              <!-- Sessions -->
              <td class="col-center">
                <span :class="a.sessions > 0 ? 'sessions-active' : 'col-muted'">
                  {{ a.sessions > 0 ? a.sessions : '—' }}
                </span>
              </td>

              <!-- Proxy -->
              <td>
                <code v-if="a.proxy" class="proxy-code">{{ a.proxy }}</code>
                <span v-else class="col-muted">Direct</span>
              </td>

              <!-- Connected At -->
              <td class="col-date">{{ a.connectedAt }}</td>

              <!-- Row actions -->
              <td class="col-actions" @click.stop>
                <div class="row-actions">
                  <BaseButton size="sm" variant="ghost" @click="openEdit(a)">Sửa</BaseButton>
                  <BaseButton
                    v-if="a.status === 'connected'"
                    size="sm" variant="ghost"
                    @click="quickConnect(a, $event)"
                  >
                    Ngắt
                  </BaseButton>
                  <BaseButton
                    v-else
                    size="sm" variant="primary"
                    @click="quickConnect(a, $event)"
                  >
                    Kết nối
                  </BaseButton>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>

        <!-- Empty state -->
        <div v-if="filtered.length === 0" class="empty-state">
          <div class="empty-icon">📱</div>
          <p class="empty-text">Không tìm thấy tài khoản nào</p>
          <BaseButton variant="ghost" size="sm" @click="search = ''; statusFilter = 'all'; typeFilter = 'all'">
            Xoá bộ lọc
          </BaseButton>
        </div>
      </div>
      </Transition>
    </div>
  
  <!-- ── Bulk Action Bar ── -->
  <BulkActionBar :count="selected.length" :show="selected.length > 0" @clear="clearSelection">
    <BaseButton size="sm" variant="warning" @click="bulkDisconOpen = true">
      Ngắt kết nối {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="danger" @click="bulkDelOpen = true">
      Xoá {{ selected.length }}
    </BaseButton>
  </BulkActionBar>

  <!-- ════ Add Modal ════ -->
  <FormModal
    v-model="addOpen"
    title="Kết nối tài khoản mới"
    size="md"
    submit-label="Thêm & tạo QR"
    :loading="addLoading"
    @submit="handleAdd"
  >
    <div class="form-body">
      <FormField label="Tên hiển thị" required>
        <BaseInput v-model="form.displayName" placeholder="Tên cửa hàng, thương hiệu..." />
      </FormField>
      <div class="form-row-2">
        <FormField label="Loại tài khoản">
          <BaseSelectMenu v-model="form.type" :options="FORM_TYPE_OPTIONS" />
        </FormField>
        <FormField label="Số điện thoại" required hint="Số đã đăng ký tài khoản">
          <BaseInput v-model="form.phone" placeholder="+84912345678" />
        </FormField>
      </div>
      <FormField label="Handle / Username">
        <BaseInput v-model="form.handle" placeholder="@username" />
      </FormField>
      <FormField label="Proxy" hint="Tuỳ chọn — để trống nếu kết nối trực tiếp">
        <BaseInput v-model="form.proxy" placeholder="IP:port hoặc user:pass@IP:port" />
      </FormField>
      <FormField label="Nhãn" hint="Cách nhau bởi dấu phẩy">
        <BaseInput v-model="form.tags" placeholder="production, VIP, bot..." />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" placeholder="Thông tin về tài khoản này..." :rows="3" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Edit Modal ════ -->
  <FormModal
    v-model="editOpen"
    title="Chỉnh sửa tài khoản"
    size="md"
    submit-label="Lưu thay đổi"
    :loading="editLoading"
    @submit="handleEdit"
  >
    <div class="form-body">
      <FormField label="Tên hiển thị" required>
        <BaseInput v-model="form.displayName" />
      </FormField>
      <div class="form-row-2">
        <FormField label="Loại tài khoản">
          <BaseSelectMenu v-model="form.type" :options="FORM_TYPE_OPTIONS" />
        </FormField>
        <FormField label="Số điện thoại" required>
          <BaseInput v-model="form.phone" />
        </FormField>
      </div>
      <FormField label="Handle / Username">
        <BaseInput v-model="form.handle" />
      </FormField>
      <FormField label="Proxy" hint="Để trống = kết nối trực tiếp">
        <BaseInput v-model="form.proxy" />
      </FormField>
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
    :title="detailTarget?.displayName ?? 'Chi tiết tài khoản'"
    size="md"
    submit-label="Chỉnh sửa"
    cancel-label="Đóng"
    @submit="openEditFromDetail"
  >
    <template v-if="detailTarget">
      <!-- Header -->
      <div class="detail-header">
        <BaseAvatar :name="detailTarget.displayName" size="lg" />
        <div class="detail-header__info">
          <h3 class="detail-name">{{ detailTarget.displayName }}</h3>
          <code class="detail-handle">{{ detailTarget.handle }}</code>
          <BaseBadge
            :text="STATUS_LABEL[detailTarget.status]"
            :variant="STATUS_BADGE[detailTarget.status]"
            dot
          />
        </div>
      </div>

      <!-- Sessions highlight -->
      <div v-if="detailTarget.sessions > 0" class="sessions-highlight">
        <span class="sessions-highlight__label">Phiên hoạt động</span>
        <span class="sessions-highlight__val">{{ detailTarget.sessions }}</span>
      </div>

      <!-- Connection info -->
      <div class="detail-section">
        <p class="detail-section__label">Thông tin kết nối</p>
        <div class="detail-row">
          <span class="detail-key">Loại</span>
          <span class="detail-val">{{ detailTarget.type }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Số điện thoại</span>
          <code class="detail-phone">{{ detailTarget.phone }}</code>
        </div>
        <div class="detail-row">
          <span class="detail-key">Proxy</span>
          <span class="detail-val">{{ detailTarget.proxy || 'Direct' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Kết nối từ</span>
          <span class="detail-val">{{ detailTarget.connectedAt }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="detail-section">
        <p class="detail-section__label">Nhãn</p>
        <div class="tags-cell">
          <BaseTag v-for="t in detailTarget.tags" :key="t" :text="t" size="sm" variant="neutral" />
          <span v-if="!detailTarget.tags.length" class="detail-empty">Chưa gán nhãn</span>
        </div>
      </div>

      <!-- Note -->
      <div v-if="detailTarget.note" class="detail-section">
        <p class="detail-section__label">Ghi chú</p>
        <p class="detail-note">{{ detailTarget.note }}</p>
      </div>

      <!-- Quick actions -->
      <div class="detail-quick-actions">
        <BaseButton
          v-if="detailTarget.status !== 'connected'"
          variant="primary"
          size="sm"
          @click="quickConnect(detailTarget, $event)"
        >
          Kết nối lại / Quét QR
        </BaseButton>
        <BaseButton
          v-else
          variant="warning"
          size="sm"
          @click="quickConnect(detailTarget, $event)"
        >
          Ngắt kết nối
        </BaseButton>
      </div>

      <!-- Danger zone -->
      <div class="detail-danger">
        <BaseButton
          variant="danger"
          size="sm"
          @click="openDelete(detailTarget, $event); detailOpen = false"
        >
          Xoá tài khoản này
        </BaseButton>
      </div>
    </template>
  </FormDrawer>

  <!-- ════ Delete single ════ -->
  <ConfirmDialog
    v-model="deleteOpen"
    title="Xoá tài khoản?"
    :description="`'${deleteTarget?.displayName}' và tất cả phiên liên quan sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá ngay"
    :loading="deleteLoading"
    @confirm="handleDelete"
  />

  <!-- ════ Bulk delete ════ -->
  <ConfirmDialog
    v-model="bulkDelOpen"
    title="Xoá nhiều tài khoản?"
    :description="`${selected.length} tài khoản đã chọn sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDelete"
  />

  <!-- ════ Bulk disconnect ════ -->
  <ConfirmDialog
    v-model="bulkDisconOpen"
    title="Ngắt kết nối?"
    :description="`${selected.length} tài khoản đang kết nối sẽ bị ngắt.`"
    intent="warning"
    confirm-label="Ngắt kết nối"
    :loading="bulkLoading"
    @confirm="handleBulkDisconnect"
  />
</AppPageLayout>
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

/* ── Skeleton ── */
.table-skel { padding: var(--wx-space-1) 0; }
.skel-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-4);
  padding: 14px var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
  background: linear-gradient(
    90deg,
    var(--wx-surface-sunken) 25%,
    var(--wx-surface-elevated) 50%,
    var(--wx-surface-sunken) 75%
  );
  background-size: 400% 100%;
  animation: skelShimmer 1.4s ease-in-out infinite;
}
.skel-row:last-child { border-bottom: none; }
@keyframes skelShimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
.skel-cell { height: 12px; border-radius: var(--wx-radius-sm); background: var(--wx-border-default); opacity: 0.55; flex-shrink: 0; }
.skel-chk  { width: 16px; }
.skel-wide { flex: 1; min-width: 160px; }
.skel-md   { width: 100px; }
.skel-sm   { width: 72px; }
.skel-xs   { width: 52px; }

/* ── Table ── */
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

/* ── Row states ── */
.ct-row {
  cursor: pointer;
  transition: background var(--wx-d-micro, 100ms) var(--wx-ease-standard);
}
.ct-row:last-child td { border-bottom: none; }
.ct-row:hover td      { background: var(--wx-hover-bg); }
.ct-row--selected td  { background: var(--wx-selected-bg); }

/* ── Row-fade TransitionGroup ── */
.row-fade-enter-active {
  animation: rowFadeIn var(--wx-d-normal, 250ms) var(--wx-ease-decelerate) both;
  animation-delay: calc(var(--i, 0) * var(--wx-stagger-xs, 30ms));
}
.row-fade-leave-active { transition: opacity var(--wx-d-fast, 150ms) var(--wx-ease-accelerate); }
.row-fade-leave-to     { opacity: 0; }
.row-fade-move         { transition: transform var(--wx-d-normal, 250ms) var(--wx-ease-standard); }

@keyframes rowFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
}

/* ── Skeleton / table crossfade ── */
.skel-fade-leave-active { transition: opacity var(--wx-d-micro, 100ms) var(--wx-ease-accelerate); }
.skel-fade-leave-to     { opacity: 0; }
.tbl-fade-enter-active  { transition: opacity var(--wx-d-fast, 150ms) var(--wx-ease-decelerate); }
.tbl-fade-enter-from    { opacity: 0; }

/* ── Row click highlight ── */
@keyframes row-hl {
  0%, 40% { background-color: var(--wx-brand-50, #eff6ff); }
  100%    { background-color: transparent; }
}
.row--hl td { animation: row-hl 600ms var(--wx-ease-standard) both; }

@media (prefers-reduced-motion: reduce) {
  .row-fade-enter-active { animation: none; }
  .row-fade-leave-active, .row-fade-move { transition: none; }
  .skel-fade-leave-active, .tbl-fade-enter-active { transition: none; }
  .row--hl td { animation: none; }
}

/* ── Row actions ── */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  opacity: 0;
  transition: opacity var(--wx-d-micro, 100ms);
}
.ct-row:hover .row-actions { opacity: 1; }

/* ── Columns ── */
.col-check   { width: 44px; }
.col-center  { text-align: center; }
.col-actions { width: 145px; }

/* ── Account cell ── */
.acc-cell { display: flex; align-items: center; gap: var(--wx-space-3); min-width: 180px; }
.acc-info { display: flex; flex-direction: column; gap: 2px; }
.acc-name   { font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); }
.acc-handle { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

/* ── Type tag ── */
.type-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-full);
  white-space: nowrap;
}

/* ── Sessions ── */
.sessions-active { font-weight: var(--wx-fw-semibold); color: var(--wx-success-text); }

/* ── Proxy ── */
.proxy-code { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); }

/* ── Misc ── */
.col-date  { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; }
.col-muted { color: var(--wx-text-muted); font-size: var(--wx-fs-13); }

/* ── Checkbox ── */
.cb {
  width: 16px; height: 16px;
  accent-color: var(--wx-brand-primary);
  cursor: pointer;
}

/* ── Empty state ── */
.empty-state {
  padding: var(--wx-space-10) var(--wx-space-6);
  display: flex; flex-direction: column;
  align-items: center; gap: var(--wx-space-3); text-align: center;
}
.empty-icon { font-size: 40px; opacity: 0.35; line-height: 1; }
.empty-text { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }

/* ── Tags ── */
.tags-cell { display: flex; gap: var(--wx-space-1); flex-wrap: wrap; }

/* ── Form ── */
.form-body  { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-4); }

/* ── Detail Drawer ── */
.detail-header {
  display: flex; align-items: flex-start;
  gap: var(--wx-space-4);
  padding-bottom: var(--wx-space-5); margin-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.detail-header__info { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.detail-name   { margin: 0; font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.detail-handle { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

.sessions-highlight {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--wx-space-3) var(--wx-space-4);
  background: color-mix(in srgb, var(--wx-success-solid) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--wx-success-solid) 20%, transparent);
  border-radius: var(--wx-radius-md);
  margin-bottom: var(--wx-space-5);
}
.sessions-highlight__label { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.sessions-highlight__val   { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); color: var(--wx-success-text); }

.detail-section {
  display: flex; flex-direction: column; gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-5);
}
.detail-section__label {
  margin: 0;
  font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold);
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--wx-text-muted);
}
.detail-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--wx-space-4); font-size: var(--wx-fs-14);
}
.detail-key   { color: var(--wx-text-secondary); flex-shrink: 0; }
.detail-val   { color: var(--wx-text-primary); text-align: right; }
.detail-phone { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); color: var(--wx-text-primary); }

.detail-note {
  margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary);
  line-height: var(--wx-lh-normal);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}
.detail-empty { font-size: var(--wx-fs-13); color: var(--wx-text-muted); font-style: italic; }

.detail-quick-actions {
  margin-bottom: var(--wx-space-4);
  padding-bottom: var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.detail-danger { padding-top: var(--wx-space-4); margin-top: auto; }
</style>

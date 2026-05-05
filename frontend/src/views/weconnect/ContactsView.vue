<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import {
  BaseButton, BaseInput, BaseSelect, BaseTextarea,
  BaseBadge, BaseAvatar, BaseTag,
  FormField, FormModal, FormDrawer, ConfirmDialog,
} from '../../components/common'
import { BulkActionBar } from '../../components/data'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── Types ── */
interface Contact {
  id: number
  name: string
  phone: string
  email: string
  company: string
  tags: string[]
  status: 'active' | 'blocked' | 'pending'
  lastMsg: string
  note: string
  createdAt: string
}

/* ── Mock data ── */
const INIT_CONTACTS: Contact[] = [
  { id: 1, name: 'Nguyễn Văn Minh', phone: '+84912345678', email: 'minh.nv@company.vn', company: 'FPT Software', tags: ['VIP', 'Hà Nội'], status: 'active', lastMsg: '10 phút trước', note: 'Khách hàng lâu năm, ưu tiên phản hồi trong 2 giờ.', createdAt: '12/03/2024' },
  { id: 2, name: 'Lê Thị Lan', phone: '+84987654321', email: 'lan.lt@gmail.com', company: 'Vingroup', tags: ['new'], status: 'active', lastMsg: '1 giờ trước', note: '', createdAt: '20/04/2024' },
  { id: 3, name: 'Trần Đức Anh', phone: '+84901234567', email: 'anh.td@viettel.vn', company: 'Viettel', tags: ['blocked'], status: 'blocked', lastMsg: '3 ngày trước', note: 'Tài khoản bị khoá do vi phạm điều khoản sử dụng.', createdAt: '05/01/2024' },
  { id: 4, name: 'Phạm Thị Hoa', phone: '+84956789012', email: 'hoa.pt@vnpt.vn', company: 'VNPT', tags: ['VIP', 'TP.HCM'], status: 'active', lastMsg: '30 phút trước', note: 'Liên hệ ưu tiên cao, đối tác chiến lược.', createdAt: '14/02/2024' },
  { id: 5, name: 'Hoàng Văn Nam', phone: '+84923456789', email: 'nam.hv@startup.io', company: 'Startup XYZ', tags: ['pending'], status: 'pending', lastMsg: '2 giờ trước', note: 'Đang chờ xác minh tài khoản.', createdAt: '01/05/2024' },
  { id: 6, name: 'Vũ Thị Mai', phone: '+84934567890', email: 'mai.vt@shopee.vn', company: 'Shopee Vietnam', tags: ['VIP'], status: 'active', lastMsg: '5 phút trước', note: '', createdAt: '17/03/2024' },
  { id: 7, name: 'Đặng Quốc Hùng', phone: '+84945678901', email: 'hung.dq@tiki.vn', company: 'Tiki', tags: ['Hà Nội'], status: 'active', lastMsg: '45 phút trước', note: 'Cần hỗ trợ tích hợp API Zalo.', createdAt: '22/04/2024' },
  { id: 8, name: 'Bùi Thị Ngọc', phone: '+84967890123', email: 'ngoc.bt@lazada.vn', company: 'Lazada', tags: ['TP.HCM', 'new'], status: 'active', lastMsg: '3 giờ trước', note: '', createdAt: '28/04/2024' },
]

const contacts = ref<Contact[]>([...INIT_CONTACTS])

/* ── Filter & search ── */
const search = ref('')
const statusFilter = ref('all')

const STATUS_FILTER_OPTIONS = [
  { value: 'all',     label: 'Tất cả trạng thái' },
  { value: 'active',  label: 'Đang hoạt động' },
  { value: 'blocked', label: 'Đã khoá' },
  { value: 'pending', label: 'Chờ xác minh' },
]

const STATUS_MAP: Record<string, 'success' | 'danger' | 'warning'> = {
  active:  'success',
  blocked: 'danger',
  pending: 'warning',
}

const STATUS_LABEL: Record<string, string> = {
  active:  'Hoạt động',
  blocked: 'Đã khoá',
  pending: 'Chờ duyệt',
}

const filtered = computed(() => {
  let list = contacts.value
  if (statusFilter.value !== 'all') list = list.filter(c => c.status === statusFilter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.phone.includes(q) ||
    c.email.toLowerCase().includes(q) ||
    c.company.toLowerCase().includes(q)
  )
  return list
})

/* ── Multi-select ── */
const selected = ref<number[]>([])
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

/* ── Modal / Drawer / Dialog state ── */
const addOpen     = ref(false)
const editOpen    = ref(false)
const detailOpen  = ref(false)
const deleteOpen  = ref(false)
const bulkDelOpen = ref(false)

const addLoading    = ref(false)
const editLoading   = ref(false)
const deleteLoading = ref(false)

const editTarget   = ref<Contact | null>(null)
const detailTarget = ref<Contact | null>(null)
const deleteTarget = ref<Contact | null>(null)

/* ── Form state ── */
const FORM_STATUS_OPTIONS = [
  { value: 'active',  label: 'Đang hoạt động' },
  { value: 'blocked', label: 'Đã khoá' },
  { value: 'pending', label: 'Chờ xác minh' },
]

const form = reactive({
  name:    '',
  phone:   '',
  email:   '',
  company: '',
  tags:    '',
  status:  'active' as 'active' | 'blocked' | 'pending',
  note:    '',
})

function resetForm() {
  form.name = ''; form.phone = ''; form.email = ''
  form.company = ''; form.tags = ''; form.status = 'active'; form.note = ''
}

function fillForm(c: Contact) {
  form.name = c.name; form.phone = c.phone; form.email = c.email
  form.company = c.company; form.tags = c.tags.join(', ')
  form.status = c.status; form.note = c.note
}

function parseTags(str: string): string[] {
  return str.split(',').map(t => t.trim()).filter(Boolean)
}

/* ── Actions ── */
function openAdd() { resetForm(); addOpen.value = true }

function openEdit(c: Contact) { fillForm(c); editTarget.value = c; editOpen.value = true }

function openDetail(c: Contact) { detailTarget.value = c; detailOpen.value = true }

function openEditFromDetail() {
  if (!detailTarget.value) return
  const c = detailTarget.value
  detailOpen.value = false
  openEdit(c)
}

function openDelete(c: Contact, e: MouseEvent) {
  e.stopPropagation()
  deleteTarget.value = c
  deleteOpen.value = true
}

async function handleAdd() {
  if (!form.name.trim() || !form.phone.trim()) {
    showToast('error', 'Vui lòng điền Tên và Số điện thoại')
    return
  }
  addLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  contacts.value.unshift({
    id: Date.now(),
    name: form.name, phone: form.phone, email: form.email,
    company: form.company, tags: parseTags(form.tags),
    status: form.status, note: form.note,
    lastMsg: 'Vừa thêm',
    createdAt: new Date().toLocaleDateString('vi-VN'),
  })
  addLoading.value = false
  addOpen.value = false
  showToast('success', `Đã thêm liên hệ ${form.name}`)
}

async function handleEdit() {
  if (!form.name.trim()) {
    showToast('error', 'Vui lòng điền tên liên hệ')
    return
  }
  editLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  const idx = contacts.value.findIndex(c => c.id === editTarget.value?.id)
  if (idx !== -1) {
    contacts.value[idx] = {
      ...contacts.value[idx],
      name: form.name, phone: form.phone, email: form.email,
      company: form.company, tags: parseTags(form.tags),
      status: form.status, note: form.note,
    }
    if (detailTarget.value?.id === editTarget.value?.id) {
      detailTarget.value = contacts.value[idx]
    }
  }
  editLoading.value = false
  editOpen.value = false
  showToast('success', 'Đã cập nhật liên hệ')
}

async function handleDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const name = deleteTarget.value?.name ?? ''
  const id = deleteTarget.value?.id ?? -1
  contacts.value = contacts.value.filter(c => c.id !== id)
  const si = selected.value.indexOf(id)
  if (si !== -1) selected.value.splice(si, 1)
  deleteLoading.value = false
  deleteOpen.value = false
  showToast('success', `Đã xoá ${name}`)
}

async function handleBulkDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  const count = selected.value.length
  contacts.value = contacts.value.filter(c => !selected.value.includes(c.id))
  selected.value = []
  deleteLoading.value = false
  bulkDelOpen.value = false
  showToast('success', `Đã xoá ${count} liên hệ`)
}
</script>

<template>
  <WeConnectLayout
    current="contacts"
    page-title="Danh bạ liên hệ"
    page-description="Quản lý danh bạ và phân nhóm khách hàng"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Nhập CSV</BaseButton>
      <BaseButton size="sm" @click="openAdd">+ Thêm liên hệ</BaseButton>
    </template>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <BaseInput
        v-model="search"
        placeholder="Tìm tên, SĐT, email, công ty..."
        size="sm"
        clearable
        style="max-width: 300px;"
      />
      <BaseSelect
        v-model="statusFilter"
        :options="STATUS_FILTER_OPTIONS"
        size="sm"
        style="width: 190px;"
      />
      <BaseBadge :text="`${filtered.length} liên hệ`" variant="neutral" />
    </div>

    <!-- ── Table ── -->
    <div class="table-wrap">
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
            <th>Liên hệ</th>
            <th>Số điện thoại</th>
            <th>Công ty</th>
            <th>Nhãn</th>
            <th>Trạng thái</th>
            <th>Tin cuối</th>
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
            <td class="col-check" @click.stop>
              <input
                type="checkbox"
                class="cb"
                :checked="selected.includes(c.id)"
                @change="toggleOne(c.id)"
              />
            </td>
            <td>
              <div class="contact-cell">
                <BaseAvatar :name="c.name" size="sm" />
                <div class="contact-info">
                  <span class="contact-name">{{ c.name }}</span>
                  <span class="contact-email">{{ c.email || '—' }}</span>
                </div>
              </div>
            </td>
            <td><code class="phone">{{ c.phone }}</code></td>
            <td class="col-company">{{ c.company || '—' }}</td>
            <td>
              <div class="tags-cell">
                <BaseTag v-for="t in c.tags" :key="t" :text="t" size="sm" variant="neutral" />
                <span v-if="!c.tags.length" class="no-tag">—</span>
              </div>
            </td>
            <td>
              <BaseBadge
                :text="STATUS_LABEL[c.status]"
                :variant="STATUS_MAP[c.status]"
                dot
              />
            </td>
            <td class="col-lastmsg">{{ c.lastMsg }}</td>
            <td class="col-actions" @click.stop>
              <div class="row-actions">
                <BaseButton size="sm" variant="ghost" @click="openEdit(c)">Sửa</BaseButton>
                <BaseButton size="sm" variant="ghost" @click="openDelete(c, $event)">Xoá</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="filtered.length === 0" class="empty-state">
        <div class="empty-state__icon">👤</div>
        <p class="empty-state__text">Không tìm thấy liên hệ nào</p>
        <BaseButton variant="ghost" size="sm" @click="search = ''; statusFilter = 'all'">
          Xoá bộ lọc
        </BaseButton>
      </div>
    </div>
  </WeConnectLayout>

  <!-- ── Bulk Action Bar ── -->
  <BulkActionBar
    :count="selected.length"
    :show="selected.length > 0"
    @clear="clearSelection"
  >
    <BaseButton size="sm" variant="danger" @click="bulkDelOpen = true">
      Xoá {{ selected.length }} liên hệ
    </BaseButton>
  </BulkActionBar>

  <!-- ════ Add Modal ════ -->
  <FormModal
    v-model="addOpen"
    title="Thêm liên hệ mới"
    size="md"
    submit-label="Tạo liên hệ"
    :loading="addLoading"
    @submit="handleAdd"
  >
    <div class="form-body">
      <div class="form-row-2">
        <FormField label="Họ và tên" required>
          <BaseInput v-model="form.name" placeholder="Nguyễn Văn A" />
        </FormField>
        <FormField label="Số điện thoại" required>
          <BaseInput v-model="form.phone" placeholder="+84912345678" />
        </FormField>
      </div>
      <FormField label="Email">
        <BaseInput v-model="form.email" type="email" placeholder="email@company.vn" />
      </FormField>
      <FormField label="Công ty">
        <BaseInput v-model="form.company" placeholder="Tên công ty..." />
      </FormField>
      <FormField label="Nhãn" hint="Cách nhau bởi dấu phẩy, ví dụ: VIP, Hà Nội">
        <BaseInput v-model="form.tags" placeholder="VIP, Hà Nội, new..." />
      </FormField>
      <FormField label="Trạng thái">
        <BaseSelect v-model="form.status" :options="FORM_STATUS_OPTIONS" />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" placeholder="Ghi chú về liên hệ này..." :rows="3" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Edit Modal ════ -->
  <FormModal
    v-model="editOpen"
    title="Chỉnh sửa liên hệ"
    size="md"
    submit-label="Lưu thay đổi"
    :loading="editLoading"
    @submit="handleEdit"
  >
    <div class="form-body">
      <div class="form-row-2">
        <FormField label="Họ và tên" required>
          <BaseInput v-model="form.name" />
        </FormField>
        <FormField label="Số điện thoại" required>
          <BaseInput v-model="form.phone" />
        </FormField>
      </div>
      <FormField label="Email">
        <BaseInput v-model="form.email" type="email" />
      </FormField>
      <FormField label="Công ty">
        <BaseInput v-model="form.company" />
      </FormField>
      <FormField label="Nhãn" hint="Cách nhau bởi dấu phẩy">
        <BaseInput v-model="form.tags" />
      </FormField>
      <FormField label="Trạng thái">
        <BaseSelect v-model="form.status" :options="FORM_STATUS_OPTIONS" />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" :rows="3" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Detail Drawer ════ -->
  <FormDrawer
    v-model="detailOpen"
    :title="detailTarget?.name ?? 'Chi tiết liên hệ'"
    size="md"
    submit-label="Chỉnh sửa"
    cancel-label="Đóng"
    @submit="openEditFromDetail"
  >
    <template v-if="detailTarget">
      <!-- Header -->
      <div class="detail-header">
        <BaseAvatar :name="detailTarget.name" size="lg" />
        <div class="detail-header__info">
          <h3 class="detail-name">{{ detailTarget.name }}</h3>
          <BaseBadge
            :text="STATUS_LABEL[detailTarget.status]"
            :variant="STATUS_MAP[detailTarget.status]"
            dot
          />
        </div>
      </div>

      <!-- Section: Liên hệ -->
      <div class="detail-section">
        <p class="detail-section__label">Thông tin liên hệ</p>
        <div class="detail-row">
          <span class="detail-key">Điện thoại</span>
          <code class="phone">{{ detailTarget.phone }}</code>
        </div>
        <div class="detail-row">
          <span class="detail-key">Email</span>
          <span class="detail-val">{{ detailTarget.email || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Công ty</span>
          <span class="detail-val">{{ detailTarget.company || '—' }}</span>
        </div>
      </div>

      <!-- Section: Nhãn -->
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

      <!-- Section: Ghi chú -->
      <div v-if="detailTarget.note" class="detail-section">
        <p class="detail-section__label">Ghi chú</p>
        <p class="detail-note">{{ detailTarget.note }}</p>
      </div>

      <!-- Section: Hoạt động -->
      <div class="detail-section">
        <p class="detail-section__label">Hoạt động</p>
        <div class="detail-row">
          <span class="detail-key">Tin nhắn cuối</span>
          <span class="detail-val">{{ detailTarget.lastMsg }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Ngày thêm</span>
          <span class="detail-val">{{ detailTarget.createdAt }}</span>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="detail-danger">
        <BaseButton
          variant="danger"
          size="sm"
          @click="openDelete(detailTarget, $event); detailOpen = false"
        >
          Xoá liên hệ này
        </BaseButton>
      </div>
    </template>
  </FormDrawer>

  <!-- ════ Delete Confirm ════ -->
  <ConfirmDialog
    v-model="deleteOpen"
    title="Xoá liên hệ?"
    :description="`'${deleteTarget?.name}' sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.`"
    intent="danger"
    confirm-label="Xoá ngay"
    :loading="deleteLoading"
    @confirm="handleDelete"
  />

  <!-- ════ Bulk Delete Confirm ════ -->
  <ConfirmDialog
    v-model="bulkDelOpen"
    title="Xoá nhiều liên hệ?"
    :description="`${selected.length} liên hệ đã chọn sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá tất cả"
    :loading="deleteLoading"
    @confirm="handleBulkDelete"
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

.ct-table {
  width: 100%;
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

/* Row actions: visible only on hover */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  opacity: 0;
  transition: opacity var(--wx-duration-micro);
}
.ct-row:hover .row-actions { opacity: 1; }

/* Columns */
.col-check  { width: 44px; }
.col-actions { width: 130px; }

/* Checkbox */
.cb {
  width: 16px;
  height: 16px;
  accent-color: var(--wx-brand-primary);
  cursor: pointer;
  border-radius: var(--wx-radius-sm);
}

/* Contact cell */
.contact-cell {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  min-width: 180px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-name {
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-primary);
  line-height: 1.3;
}

.contact-email {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
}

.phone {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
}

.col-company {
  color: var(--wx-text-secondary);
  font-size: var(--wx-fs-13);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-lastmsg {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  white-space: nowrap;
}

.tags-cell {
  display: flex;
  gap: var(--wx-space-1);
  flex-wrap: wrap;
}

.no-tag {
  color: var(--wx-text-muted);
  font-size: var(--wx-fs-13);
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

.empty-state__icon {
  font-size: 40px;
  opacity: 0.35;
  line-height: 1;
}

.empty-state__text {
  margin: 0;
  font-size: var(--wx-fs-14);
  color: var(--wx-text-secondary);
}

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
  gap: var(--wx-space-4);
  padding-bottom: var(--wx-space-5);
  margin-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.detail-header__info {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

.detail-name {
  margin: 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  line-height: 1.2;
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

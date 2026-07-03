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
type ContactStage  = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
type ContactSource = 'website' | 'referral' | 'linkedin' | 'cold' | 'event' | 'other'

interface CRMContact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  position: string
  stage: ContactStage
  source: ContactSource
  dealValue: number
  lastContact: string
  tags: string[]
  note: string
  createdAt: string
}

/* ── Mock data ── */
const INIT: CRMContact[] = [
  { id: 1, name: 'Nguyễn Văn Minh', email: 'minh.nv@fpt.vn', phone: '+84912345678', company: 'FPT Software', position: 'CTO', stage: 'proposal', source: 'linkedin', dealValue: 120000000, lastContact: '02/05/2026', tags: ['enterprise', 'VIP'], note: 'Đang đàm phán gói enterprise 12 tháng. Cần demo lần 2.', createdAt: '10/03/2026' },
  { id: 2, name: 'Lê Thị Lan', email: 'lan@vingroup.vn', phone: '+84987654321', company: 'Vingroup', position: 'IT Director', stage: 'negotiation', source: 'referral', dealValue: 350000000, lastContact: '04/05/2026', tags: ['enterprise', 'hot'], note: 'Deal lớn nhất tháng, yêu cầu SLA 99.9%.', createdAt: '15/03/2026' },
  { id: 3, name: 'Trần Đức Anh', email: 'anh@startup.io', phone: '+84901234567', company: 'Startup IO', position: 'CEO', stage: 'lead', source: 'website', dealValue: 18000000, lastContact: '28/04/2026', tags: ['startup'], note: '', createdAt: '01/04/2026' },
  { id: 4, name: 'Phạm Thị Hoa', email: 'hoa@vnpt.vn', phone: '+84956789012', company: 'VNPT', position: 'Procurement', stage: 'won', source: 'event', dealValue: 200000000, lastContact: '30/04/2026', tags: ['telco', 'closed'], note: 'Đã ký hợp đồng. Onboarding 15/05.', createdAt: '05/02/2026' },
  { id: 5, name: 'Hoàng Văn Nam', email: 'nam@shopee.vn', phone: '+84923456789', company: 'Shopee Vietnam', position: 'Head of Ops', stage: 'qualified', source: 'cold', dealValue: 45000000, lastContact: '01/05/2026', tags: ['ecom'], note: '', createdAt: '20/04/2026' },
  { id: 6, name: 'Vũ Thị Mai', email: 'mai@tiki.vn', phone: '+84934567890', company: 'Tiki', position: 'VP Engineering', stage: 'proposal', source: 'linkedin', dealValue: 80000000, lastContact: '03/05/2026', tags: ['ecom', 'VIP'], note: 'Gửi proposal lần 1 ngày 01/05. Chờ phản hồi.', createdAt: '18/04/2026' },
  { id: 7, name: 'Đặng Quốc Hùng', email: 'hung@momo.vn', phone: '+84945678901', company: 'MoMo', position: 'CTO', stage: 'lost', source: 'referral', dealValue: 150000000, lastContact: '15/04/2026', tags: ['fintech'], note: 'Không đạt yêu cầu bảo mật PCI-DSS. Follow-up Q3.', createdAt: '10/03/2026' },
  { id: 8, name: 'Bùi Thị Ngọc', email: 'ngoc@viettel.vn', phone: '+84967890123', company: 'Viettel', position: 'Director', stage: 'lead', source: 'event', dealValue: 60000000, lastContact: '05/05/2026', tags: ['telco', 'new'], note: '', createdAt: '04/05/2026' },
]

const contacts = ref<CRMContact[]>([...INIT])
const tableLoading = ref(true)
onMounted(() => { setTimeout(() => { tableLoading.value = false }, 650) })

/* ── Filter ── */
const search       = ref('')
const stageFilter  = ref('all')
const sourceFilter = ref('all')

const STAGE_FILTER = [
  { value: 'all',         label: 'Tất cả giai đoạn' },
  { value: 'lead',        label: 'Lead' },
  { value: 'qualified',   label: 'Qualified' },
  { value: 'proposal',    label: 'Proposal' },
  { value: 'negotiation', label: 'Đàm phán' },
  { value: 'won',         label: 'Chốt deal' },
  { value: 'lost',        label: 'Thất bại' },
]

const SOURCE_FILTER = [
  { value: 'all',      label: 'Tất cả nguồn' },
  { value: 'website',  label: 'Website' },
  { value: 'referral', label: 'Giới thiệu' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'cold',     label: 'Cold outreach' },
  { value: 'event',    label: 'Sự kiện' },
  { value: 'other',    label: 'Khác' },
]

const STAGE_BADGE: Record<ContactStage, 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'danger'> = {
  lead:        'neutral',
  qualified:   'info',
  proposal:    'warning',
  negotiation: 'primary',
  won:         'success',
  lost:        'danger',
}

const STAGE_LABEL: Record<ContactStage, string> = {
  lead:        'Lead',
  qualified:   'Qualified',
  proposal:    'Proposal',
  negotiation: 'Đàm phán',
  won:         'Chốt deal',
  lost:        'Thất bại',
}

const SOURCE_LABEL: Record<ContactSource, string> = {
  website:  'Website',
  referral: 'Giới thiệu',
  linkedin: 'LinkedIn',
  cold:     'Cold outreach',
  event:    'Sự kiện',
  other:    'Khác',
}

function formatMoney(v: number): string {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1).replace('.0', '') + ' tỷ'
  if (v >= 1_000_000)     return (v / 1_000_000).toFixed(0) + ' tr'
  return v.toLocaleString('vi-VN')
}

const filtered = computed(() => {
  let list = contacts.value
  if (stageFilter.value  !== 'all') list = list.filter(c => c.stage  === stageFilter.value)
  if (sourceFilter.value !== 'all') list = list.filter(c => c.source === sourceFilter.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(c =>
    c.name.toLowerCase().includes(q)    ||
    c.email.toLowerCase().includes(q)   ||
    c.company.toLowerCase().includes(q) ||
    c.phone.includes(q)
  )
  return list
})

/* ── Total pipeline value ── */
const pipelineTotal = computed(() =>
  filtered.value
    .filter(c => !['won', 'lost'].includes(c.stage))
    .reduce((s, c) => s + c.dealValue, 0)
)

/* ── Multi-select ── */
const selected       = ref<number[]>([])
const headerCheckRef = ref<HTMLInputElement | null>(null)

const isAllSelected   = computed(() =>
  filtered.value.length > 0 && filtered.value.every(c => selected.value.includes(c.id))
)
const isIndeterminate = computed(() =>
  filtered.value.some(c => selected.value.includes(c.id)) && !isAllSelected.value
)

watchEffect(() => {
  if (headerCheckRef.value) headerCheckRef.value.indeterminate = isIndeterminate.value
})

function toggleOne(id: number) {
  const i = selected.value.indexOf(id)
  if (i !== -1) selected.value.splice(i, 1)
  else selected.value.push(id)
}
function toggleAll()      { selected.value = isAllSelected.value ? [] : filtered.value.map(c => c.id) }
function clearSelection() { selected.value = [] }

/* ── Overlay state ── */
const addOpen      = ref(false)
const editOpen     = ref(false)
const detailOpen   = ref(false)
const deleteOpen   = ref(false)
const bulkDelOpen  = ref(false)

const addLoading    = ref(false)
const editLoading   = ref(false)
const deleteLoading = ref(false)
const bulkLoading   = ref(false)

const editTarget   = ref<CRMContact | null>(null)
const detailTarget = ref<CRMContact | null>(null)
const deleteTarget = ref<CRMContact | null>(null)
const highlightId  = ref<number | null>(null)

/* ── Form ── */
const FORM_STAGE_OPTIONS = [
  { value: 'lead',        label: 'Lead' },
  { value: 'qualified',   label: 'Qualified' },
  { value: 'proposal',    label: 'Proposal' },
  { value: 'negotiation', label: 'Đàm phán' },
  { value: 'won',         label: 'Chốt deal' },
  { value: 'lost',        label: 'Thất bại' },
]

const FORM_SOURCE_OPTIONS = [
  { value: 'website',  label: 'Website' },
  { value: 'referral', label: 'Giới thiệu' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'cold',     label: 'Cold outreach' },
  { value: 'event',    label: 'Sự kiện' },
  { value: 'other',    label: 'Khác' },
]

const form = reactive({
  name:       '',
  email:      '',
  phone:      '',
  company:    '',
  position:   '',
  stage:      'lead' as ContactStage,
  source:     'website' as ContactSource,
  dealValue:  '',
  lastContact:'',
  tags:       '',
  note:       '',
})

function resetForm() {
  Object.assign(form, {
    name: '', email: '', phone: '', company: '', position: '',
    stage: 'lead', source: 'website', dealValue: '',
    lastContact: '', tags: '', note: '',
  })
}

function fillForm(c: CRMContact) {
  Object.assign(form, {
    name: c.name, email: c.email, phone: c.phone,
    company: c.company, position: c.position,
    stage: c.stage, source: c.source,
    dealValue: String(c.dealValue),
    lastContact: c.lastContact,
    tags: c.tags.join(', '),
    note: c.note,
  })
}

function parseTags(s: string) { return s.split(',').map(t => t.trim()).filter(Boolean) }

/* ── CRUD handlers ── */
function openAdd()    { resetForm(); addOpen.value = true }
function openEdit(c: CRMContact) { fillForm(c); editTarget.value = c; editOpen.value = true }
function openDetail(c: CRMContact) {
  highlightId.value = c.id
  detailTarget.value = c
  detailOpen.value = true
  setTimeout(() => { highlightId.value = null }, 600)
}

function openEditFromDetail() {
  if (!detailTarget.value) return
  const c = detailTarget.value
  detailOpen.value = false
  openEdit(c)
}

function openDelete(c: CRMContact, e: MouseEvent) {
  e.stopPropagation()
  deleteTarget.value = c
  deleteOpen.value = true
}

async function handleAdd() {
  if (!form.name.trim() || !form.company.trim()) {
    showToast('error', 'Vui lòng điền Tên và Công ty')
    return
  }
  addLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  contacts.value.unshift({
    id: Date.now(),
    name: form.name, email: form.email, phone: form.phone,
    company: form.company, position: form.position,
    stage: form.stage, source: form.source,
    dealValue: parseInt(form.dealValue, 10) || 0,
    lastContact: form.lastContact || new Date().toLocaleDateString('vi-VN'),
    tags: parseTags(form.tags),
    note: form.note,
    createdAt: new Date().toLocaleDateString('vi-VN'),
  })
  addLoading.value = false
  addOpen.value = false
  showToast('success', `Đã thêm "${form.name}"`)
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
      name: form.name, email: form.email, phone: form.phone,
      company: form.company, position: form.position,
      stage: form.stage, source: form.source,
      dealValue: parseInt(form.dealValue, 10) || contacts.value[idx].dealValue,
      lastContact: form.lastContact || contacts.value[idx].lastContact,
      tags: parseTags(form.tags),
      note: form.note,
    }
    if (detailTarget.value?.id === editTarget.value?.id) detailTarget.value = contacts.value[idx]
  }
  editLoading.value = false
  editOpen.value = false
  showToast('success', 'Đã cập nhật liên hệ')
}

async function handleDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const name = deleteTarget.value?.name ?? ''
  contacts.value = contacts.value.filter(c => c.id !== deleteTarget.value?.id)
  selected.value  = selected.value.filter(id => id !== deleteTarget.value?.id)
  deleteLoading.value = false
  deleteOpen.value = false
  showToast('success', `Đã xoá "${name}"`)
}

async function handleBulkDelete() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  const count = selected.value.length
  contacts.value = contacts.value.filter(c => !selected.value.includes(c.id))
  selected.value = []
  bulkLoading.value = false
  bulkDelOpen.value = false
  showToast('success', `Đã xoá ${count} liên hệ`)
}

async function handleBulkStage(stage: ContactStage) {
  contacts.value = contacts.value.map(c =>
    selected.value.includes(c.id) ? { ...c, stage } : c
  )
  const count = selected.value.length
  selected.value = []
  showToast('success', `Đã chuyển ${count} liên hệ sang "${STAGE_LABEL[stage]}"`)
}
</script>

<template>
  <AppPageLayout section="app"
    current="contacts"
    page-title="CRM — Khách hàng"
    page-description="Quản lý pipeline bán hàng và theo dõi khách hàng tiềm năng"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Xuất CSV</BaseButton>
      <BaseButton size="sm" @click="openAdd">+ Thêm liên hệ</BaseButton>
    </template>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <BaseInput
        v-model="search"
        placeholder="Tìm tên, email, công ty, SĐT..."
        size="sm"
        clearable
        style="max-width: 280px;"
      />
      <BaseSelectMenu v-model="stageFilter"  :options="STAGE_FILTER"  size="sm" style="width: 180px;" />
      <BaseSelectMenu v-model="sourceFilter" :options="SOURCE_FILTER" size="sm" style="width: 165px;" />
      <BaseBadge :text="`${filtered.length} liên hệ`" variant="neutral" />
      <BaseBadge
        v-if="pipelineTotal > 0"
        :text="`Pipeline: ${formatMoney(pipelineTotal)}`"
        variant="info"
      />
    </div>

    <!-- ── Table ── -->
    <div class="table-wrap" v-reveal>
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
              <th>Liên hệ</th>
              <th>Công ty</th>
              <th>Giai đoạn</th>
              <th class="col-right">Giá trị deal</th>
              <th>Nguồn</th>
              <th>Liên hệ cuối</th>
              <th class="col-actions"></th>
            </tr>
          </thead>

          <TransitionGroup tag="tbody" name="row-fade" appear>
            <tr
              v-for="(c, idx) in filtered"
              :key="c.id"
              :style="{ '--i': idx }"
              class="ct-row"
              :class="{ 'ct-row--selected': selected.includes(c.id), 'row--hl': highlightId === c.id }"
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

              <!-- Contact cell -->
              <td>
                <div class="contact-cell">
                  <BaseAvatar :name="c.name" size="sm" />
                  <div class="contact-info">
                    <span class="contact-name">{{ c.name }}</span>
                    <span class="contact-sub">{{ c.position || c.email }}</span>
                  </div>
                </div>
              </td>

              <!-- Company -->
              <td class="col-company">{{ c.company }}</td>

              <!-- Stage -->
              <td>
                <BaseBadge
                  :text="STAGE_LABEL[c.stage]"
                  :variant="STAGE_BADGE[c.stage]"
                  dot
                />
              </td>

              <!-- Deal value -->
              <td class="col-right col-deal">
                <span v-if="c.dealValue > 0" class="deal-val">{{ formatMoney(c.dealValue) }}</span>
                <span v-else class="col-muted">—</span>
              </td>

              <!-- Source -->
              <td>
                <span class="source-tag">{{ SOURCE_LABEL[c.source] }}</span>
              </td>

              <!-- Last contact -->
              <td class="col-date">{{ c.lastContact }}</td>

              <!-- Row actions -->
              <td class="col-actions" @click.stop>
                <div class="row-actions">
                  <BaseButton size="sm" variant="ghost" @click="openEdit(c)">Sửa</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="openDelete(c, $event)">Xoá</BaseButton>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>

        <!-- Empty state -->
        <div v-if="filtered.length === 0" class="empty-state">
          <div class="empty-icon">🤝</div>
          <p class="empty-text">Không tìm thấy liên hệ nào</p>
          <BaseButton variant="ghost" size="sm" @click="search = ''; stageFilter = 'all'; sourceFilter = 'all'">
            Xoá bộ lọc
          </BaseButton>
        </div>
      </div>
      </Transition>
    </div>
  
  <!-- ── Bulk Action Bar ── -->
  <BulkActionBar :count="selected.length" :show="selected.length > 0" @clear="clearSelection">
    <BaseButton size="sm" variant="primary" @click="handleBulkStage('qualified')">
      → Qualified
    </BaseButton>
    <BaseButton size="sm" variant="primary" @click="handleBulkStage('proposal')">
      → Proposal
    </BaseButton>
    <BaseButton size="sm" variant="danger" @click="bulkDelOpen = true">
      Xoá {{ selected.length }}
    </BaseButton>
  </BulkActionBar>

  <!-- ════ Add Modal ════ -->
  <FormModal
    v-model="addOpen"
    title="Thêm liên hệ CRM"
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
        <FormField label="Chức vụ">
          <BaseInput v-model="form.position" placeholder="CTO, Director..." />
        </FormField>
      </div>
      <div class="form-row-2">
        <FormField label="Email">
          <BaseInput v-model="form.email" type="email" placeholder="email@company.vn" />
        </FormField>
        <FormField label="Điện thoại">
          <BaseInput v-model="form.phone" placeholder="+84912345678" />
        </FormField>
      </div>
      <FormField label="Công ty" required>
        <BaseInput v-model="form.company" placeholder="Tên công ty..." />
      </FormField>
      <div class="form-row-2">
        <FormField label="Giai đoạn">
          <BaseSelectMenu v-model="form.stage" :options="FORM_STAGE_OPTIONS" />
        </FormField>
        <FormField label="Nguồn">
          <BaseSelectMenu v-model="form.source" :options="FORM_SOURCE_OPTIONS" />
        </FormField>
      </div>
      <div class="form-row-2">
        <FormField label="Giá trị deal (VND)" hint="Nhập số, không dấu chấm">
          <BaseInput v-model="form.dealValue" type="number" placeholder="50000000" />
        </FormField>
        <FormField label="Ngày liên hệ cuối">
          <BaseInput v-model="form.lastContact" placeholder="DD/MM/YYYY" />
        </FormField>
      </div>
      <FormField label="Nhãn" hint="Cách nhau bởi dấu phẩy">
        <BaseInput v-model="form.tags" placeholder="VIP, enterprise, hot..." />
      </FormField>
      <FormField label="Ghi chú">
        <BaseTextarea v-model="form.note" placeholder="Thông tin bổ sung..." :rows="3" />
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
        <FormField label="Chức vụ">
          <BaseInput v-model="form.position" />
        </FormField>
      </div>
      <div class="form-row-2">
        <FormField label="Email">
          <BaseInput v-model="form.email" type="email" />
        </FormField>
        <FormField label="Điện thoại">
          <BaseInput v-model="form.phone" />
        </FormField>
      </div>
      <FormField label="Công ty" required>
        <BaseInput v-model="form.company" />
      </FormField>
      <div class="form-row-2">
        <FormField label="Giai đoạn">
          <BaseSelectMenu v-model="form.stage" :options="FORM_STAGE_OPTIONS" />
        </FormField>
        <FormField label="Nguồn">
          <BaseSelectMenu v-model="form.source" :options="FORM_SOURCE_OPTIONS" />
        </FormField>
      </div>
      <div class="form-row-2">
        <FormField label="Giá trị deal (VND)">
          <BaseInput v-model="form.dealValue" type="number" />
        </FormField>
        <FormField label="Ngày liên hệ cuối">
          <BaseInput v-model="form.lastContact" placeholder="DD/MM/YYYY" />
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
          <p class="detail-position">{{ detailTarget.position || '—' }} · {{ detailTarget.company }}</p>
          <BaseBadge
            :text="STAGE_LABEL[detailTarget.stage]"
            :variant="STAGE_BADGE[detailTarget.stage]"
            dot
          />
        </div>
      </div>

      <!-- Deal highlight -->
      <div v-if="detailTarget.dealValue > 0" class="deal-highlight">
        <span class="deal-highlight__label">Giá trị deal</span>
        <span class="deal-highlight__val">{{ formatMoney(detailTarget.dealValue) }}</span>
      </div>

      <!-- Contact info -->
      <div class="detail-section">
        <p class="detail-section__label">Thông tin liên lạc</p>
        <div class="detail-row">
          <span class="detail-key">Email</span>
          <span class="detail-val">{{ detailTarget.email || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Điện thoại</span>
          <span class="detail-val">{{ detailTarget.phone || '—' }}</span>
        </div>
      </div>

      <!-- CRM info -->
      <div class="detail-section">
        <p class="detail-section__label">Thông tin CRM</p>
        <div class="detail-row">
          <span class="detail-key">Nguồn</span>
          <span class="detail-val">{{ SOURCE_LABEL[detailTarget.source] }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Liên hệ cuối</span>
          <span class="detail-val">{{ detailTarget.lastContact }}</span>
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
          <BaseTag v-for="t in detailTarget.tags" :key="t" :label="t" size="sm" variant="neutral" />
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
          Xoá liên hệ này
        </BaseButton>
      </div>
    </template>
  </FormDrawer>

  <!-- ════ Delete single ════ -->
  <ConfirmDialog
    v-model="deleteOpen"
    title="Xoá liên hệ?"
    :description="`'${deleteTarget?.name}' sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá ngay"
    :loading="deleteLoading"
    @confirm="handleDelete"
  />

  <!-- ════ Bulk delete ════ -->
  <ConfirmDialog
    v-model="bulkDelOpen"
    title="Xoá nhiều liên hệ?"
    :description="`${selected.length} liên hệ đã chọn sẽ bị xoá vĩnh viễn.`"
    intent="danger"
    confirm-label="Xoá tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDelete"
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
  margin-bottom: var(--wx-space-4);
}

/* ── Table shell ── */
.table-wrap {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
}

.table-scroll { overflow-x: auto; }

/* ── Loading skeleton ── */
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

/* ── Row states + animations ── */
.ct-row {
  cursor: pointer;
  transition: background var(--wx-d-micro, 100ms) var(--wx-ease-standard);
}
.ct-row:last-child td { border-bottom: none; }
.ct-row:hover td     { background: var(--wx-hover-bg); }
.ct-row--selected td { background: var(--wx-selected-bg); }

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

/* ── Row actions (hidden until hover) ── */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  opacity: 0;
  transition: opacity var(--wx-d-micro, 100ms);
}
.ct-row:hover .row-actions { opacity: 1; }

/* ── Columns ── */
.col-check   { width: 44px; }
.col-actions { width: 130px; }
.col-right   { text-align: right; }

/* ── Contact cell ── */
.contact-cell {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  min-width: 180px;
}
.contact-info { display: flex; flex-direction: column; gap: 2px; }
.contact-name { font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); }
.contact-sub  { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

/* ── Company ── */
.col-company {
  color: var(--wx-text-secondary);
  font-size: var(--wx-fs-13);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Deal value ── */
.col-deal { white-space: nowrap; }
.deal-val {
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  font-size: var(--wx-fs-13);
}
.col-muted { color: var(--wx-text-muted); font-size: var(--wx-fs-13); }

/* ── Source tag ── */
.source-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-full);
}

/* ── Date ── */
.col-date { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; }

/* ── Checkbox ── */
.cb {
  width: 16px; height: 16px;
  accent-color: var(--wx-brand-primary);
  cursor: pointer;
  border-radius: var(--wx-radius-sm);
}

/* ── Empty state ── */
.empty-state {
  padding: var(--wx-space-10) var(--wx-space-6);
  display: flex; flex-direction: column;
  align-items: center; gap: var(--wx-space-3); text-align: center;
}
.empty-icon { font-size: 40px; opacity: 0.35; line-height: 1; }
.empty-text { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }

/* ── Tags cell ── */
.tags-cell { display: flex; gap: var(--wx-space-1); flex-wrap: wrap; }

/* ── Form ── */
.form-body   { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.form-row-2  { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-4); }

/* ── Detail Drawer ── */
.detail-header {
  display: flex;
  align-items: flex-start;
  gap: var(--wx-space-4);
  padding-bottom: var(--wx-space-5);
  margin-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.detail-header__info { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.detail-name     { margin: 0; font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.detail-position { margin: 0; font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }

.deal-highlight {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-3) var(--wx-space-4);
  background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--wx-brand-primary) 20%, transparent);
  border-radius: var(--wx-radius-md);
  margin-bottom: var(--wx-space-5);
}
.deal-highlight__label { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.deal-highlight__val   { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); color: var(--wx-brand-primary); }

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
.detail-key { color: var(--wx-text-secondary); flex-shrink: 0; }
.detail-val { color: var(--wx-text-primary); text-align: right; }
.detail-note {
  margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary);
  line-height: var(--wx-lh-normal);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}
.detail-empty { font-size: var(--wx-fs-13); color: var(--wx-text-muted); font-style: italic; }

.detail-danger {
  padding-top: var(--wx-space-5);
  border-top: 1px solid var(--wx-border-subtle);
  margin-top: auto;
}
</style>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import {
  BaseButton, BaseInput, BaseSelectMenu, BaseTextarea,
  BaseBadge, BaseTag, BaseToggle,
  FormField, FormModal, FormDrawer, ConfirmDialog,
} from '../../components/common'
import { BulkActionBar } from '../../components/data'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── Types ── */
type PluginCategory = 'AI' | 'automation' | 'integration' | 'utility' | 'analytics'

interface Plugin {
  id: number
  name: string
  desc: string
  version: string
  author: string
  enabled: boolean
  category: PluginCategory
  homepage: string
  note: string
  installedAt: string
  lastActive: string
  errorCount: number
}

/* ── Mock data ── */
const INIT_PLUGINS: Plugin[] = [
  { id: 1, name: 'ChatGPT Integration', desc: 'Trả lời tự động bằng GPT-4o. Hỗ trợ context 5 tin nhắn gần nhất và tùy chỉnh system prompt.', version: '2.1.0', author: 'WemakeUI', enabled: true, category: 'AI', homepage: 'https://wemakeui.vn/plugins/chatgpt', note: 'API key cấu hình trong cài đặt', installedAt: '01/03/2024', lastActive: '2 phút trước', errorCount: 0 },
  { id: 2, name: 'Auto-reply Rules', desc: 'Tạo rule trả lời tự động theo keyword, giờ giấc, số điện thoại và nhóm liên hệ.', version: '1.5.2', author: 'WemakeUI', enabled: true, category: 'automation', homepage: 'https://wemakeui.vn/plugins/auto-reply', note: '', installedAt: '15/02/2024', lastActive: '10 phút trước', errorCount: 0 },
  { id: 3, name: 'CRM Sync', desc: 'Đồng bộ liên hệ và tin nhắn hai chiều với HubSpot, Salesforce và Zoho CRM.', version: '3.0.1', author: 'WemakeUI', enabled: false, category: 'integration', homepage: 'https://wemakeui.vn/plugins/crm-sync', note: 'Cần cấu hình OAuth2 token', installedAt: '20/01/2024', lastActive: '2 ngày trước', errorCount: 5 },
  { id: 4, name: 'Media Compressor', desc: 'Nén ảnh và video tự động trước khi gửi để tiết kiệm băng thông.', version: '1.2.0', author: 'Community', enabled: true, category: 'utility', homepage: '', note: '', installedAt: '10/04/2024', lastActive: '1 giờ trước', errorCount: 0 },
  { id: 5, name: 'Analytics Dashboard', desc: 'Theo dõi số liệu tin nhắn, tỷ lệ phản hồi và hiệu suất campaign theo thời gian thực.', version: '1.8.5', author: 'WemakeUI', enabled: true, category: 'analytics', homepage: 'https://wemakeui.vn/plugins/analytics', note: '', installedAt: '05/03/2024', lastActive: '5 phút trước', errorCount: 0 },
  { id: 6, name: 'Scheduled Messages', desc: 'Hẹn giờ gửi tin nhắn đến danh sách liên hệ hoặc nhóm.', version: '2.0.0', author: 'WemakeUI', enabled: true, category: 'automation', homepage: 'https://wemakeui.vn/plugins/scheduler', note: '', installedAt: '01/04/2024', lastActive: '30 phút trước', errorCount: 0 },
  { id: 7, name: 'Webhook Forwarder', desc: 'Chuyển tiếp sự kiện tin nhắn đến các URL webhook bên ngoài.', version: '1.1.0', author: 'Community', enabled: false, category: 'integration', homepage: '', note: 'Thử nghiệm, chưa ổn định', installedAt: '20/04/2024', lastActive: '—', errorCount: 12 },
]

const plugins = ref<Plugin[]>([...INIT_PLUGINS])

/* ── Category maps ── */
const CAT_BADGE: Record<PluginCategory, 'info' | 'success' | 'warning' | 'neutral'> = {
  AI: 'info', automation: 'success', integration: 'warning', utility: 'neutral', analytics: 'info',
}
const CAT_LABEL: Record<PluginCategory, string> = {
  AI: 'AI', automation: 'Tự động hoá', integration: 'Tích hợp', utility: 'Tiện ích', analytics: 'Phân tích',
}

/* ── Filters ── */
const search     = ref('')
const catFilter  = ref('all')
const showFilter = ref('all')

const CAT_FILTER_OPTIONS = [
  { value: 'all',         label: 'Tất cả danh mục' },
  { value: 'AI',          label: 'AI' },
  { value: 'automation',  label: 'Tự động hoá' },
  { value: 'integration', label: 'Tích hợp' },
  { value: 'utility',     label: 'Tiện ích' },
  { value: 'analytics',   label: 'Phân tích' },
]
const SHOW_FILTER_OPTIONS = [
  { value: 'all',     label: 'Tất cả plugin' },
  { value: 'enabled', label: 'Đang bật' },
  { value: 'disabled', label: 'Đang tắt' },
]

const filtered = computed(() => {
  let list = plugins.value
  if (catFilter.value !== 'all')   list = list.filter(p => p.category === catFilter.value)
  if (showFilter.value === 'enabled')  list = list.filter(p => p.enabled)
  if (showFilter.value === 'disabled') list = list.filter(p => !p.enabled)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.author.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q)
  )
  return list
})

/* ── Multi-select ── */
const selected = ref<number[]>([])
const headerCheckRef = ref<HTMLInputElement | null>(null)

const isAllSelected = computed(() =>
  filtered.value.length > 0 && filtered.value.every(p => selected.value.includes(p.id))
)
const isIndeterminate = computed(() =>
  filtered.value.some(p => selected.value.includes(p.id)) && !isAllSelected.value
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
  else selected.value = filtered.value.map(p => p.id)
}
function clearSelection() { selected.value = [] }

/* ── Overlay state ── */
const configOpen   = ref(false)
const detailOpen   = ref(false)
const deleteOpen   = ref(false)
const bulkEnOpen   = ref(false)
const bulkDisOpen  = ref(false)
const bulkDelOpen  = ref(false)

const configLoading = ref(false)
const deleteLoading = ref(false)
const bulkLoading   = ref(false)

const configTarget = ref<Plugin | null>(null)
const detailTarget = ref<Plugin | null>(null)
const deleteTarget = ref<Plugin | null>(null)

/* ── Config form ── */
const form = reactive({ note: '', homepage: '' })

function openConfig(p: Plugin) {
  form.note = p.note
  form.homepage = p.homepage
  configTarget.value = p
  configOpen.value = true
}
function openDetail(p: Plugin) { detailTarget.value = p; detailOpen.value = true }
function openConfigFromDetail() {
  if (!detailTarget.value) return
  const p = detailTarget.value
  detailOpen.value = false
  openConfig(p)
}
function openDelete(p: Plugin, e: Event) {
  e.stopPropagation()
  deleteTarget.value = p; deleteOpen.value = true
}

async function handleSaveConfig() {
  configLoading.value = true
  await new Promise(r => setTimeout(r, 700))
  const idx = plugins.value.findIndex(p => p.id === configTarget.value?.id)
  if (idx !== -1) {
    plugins.value[idx] = { ...plugins.value[idx], note: form.note, homepage: form.homepage }
    if (detailTarget.value?.id === configTarget.value?.id) {
      detailTarget.value = plugins.value[idx]
    }
  }
  configLoading.value = false
  configOpen.value = false
  showToast('success', `Đã lưu cấu hình "${configTarget.value?.name}"`)
}

async function handleDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const name = deleteTarget.value?.name ?? ''
  plugins.value = plugins.value.filter(p => p.id !== deleteTarget.value?.id)
  const si = selected.value.indexOf(deleteTarget.value?.id ?? -1)
  if (si !== -1) selected.value.splice(si, 1)
  deleteLoading.value = false
  deleteOpen.value = false
  showToast('success', `Đã gỡ plugin "${name}"`)
}

function togglePlugin(p: Plugin) {
  const idx = plugins.value.findIndex(x => x.id === p.id)
  if (idx !== -1) {
    plugins.value[idx].enabled = !plugins.value[idx].enabled
    showToast('success', `${plugins.value[idx].enabled ? 'Đã bật' : 'Đã tắt'} plugin "${p.name}"`)
  }
}

async function handleBulkEnable() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  plugins.value = plugins.value.map(p => selected.value.includes(p.id) ? { ...p, enabled: true } : p)
  const count = selected.value.length
  selected.value = []
  bulkLoading.value = false
  bulkEnOpen.value = false
  showToast('success', `Đã bật ${count} plugin`)
}

async function handleBulkDisable() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  plugins.value = plugins.value.map(p => selected.value.includes(p.id) ? { ...p, enabled: false } : p)
  const count = selected.value.length
  selected.value = []
  bulkLoading.value = false
  bulkDisOpen.value = false
  showToast('success', `Đã tắt ${count} plugin`)
}

async function handleBulkDelete() {
  bulkLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  const count = selected.value.length
  plugins.value = plugins.value.filter(p => !selected.value.includes(p.id))
  selected.value = []
  bulkLoading.value = false
  bulkDelOpen.value = false
  showToast('success', `Đã gỡ ${count} plugin`)
}
</script>

<template>
  <AppPageLayout section="wemakeui"
    current="plugins"
    page-title="Plugin manager"
    page-description="Quản lý và cài đặt plugin mở rộng tính năng"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Khám phá plugin</BaseButton>
      <BaseButton size="sm">+ Tải lên plugin</BaseButton>
    </template>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <BaseInput
        v-model="search"
        placeholder="Tìm tên plugin, tác giả..."
        size="sm"
        clearable
        style="max-width: 260px;"
      />
      <BaseSelectMenu
        v-model="catFilter"
        :options="CAT_FILTER_OPTIONS"
        size="sm"
        style="width: 175px;"
      />
      <BaseSelectMenu
        v-model="showFilter"
        :options="SHOW_FILTER_OPTIONS"
        size="sm"
        style="width: 155px;"
      />
      <BaseBadge :text="`${filtered.length} plugin`" variant="neutral" />
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
              <th class="col-name">Plugin</th>
              <th>Danh mục</th>
              <th>Phiên bản</th>
              <th>Tác giả</th>
              <th>Hoạt động cuối</th>
              <th class="col-err">Lỗi</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in filtered"
              :key="p.id"
              class="ct-row"
              :class="{ 'ct-row--selected': selected.includes(p.id), 'ct-row--disabled': !p.enabled }"
              @click="openDetail(p)"
            >
              <td class="col-check" @click.stop>
                <input type="checkbox" class="cb" :checked="selected.includes(p.id)" @change="toggleOne(p.id)" />
              </td>
              <td class="col-on" @click.stop>
                <BaseToggle :model-value="p.enabled" @update:model-value="togglePlugin(p)" />
              </td>
              <td class="col-name">
                <div class="plugin-cell">
                  <span class="plugin-name">{{ p.name }}</span>
                  <span class="plugin-desc">{{ p.desc.slice(0, 60) }}{{ p.desc.length > 60 ? '...' : '' }}</span>
                </div>
              </td>
              <td>
                <BaseTag :label="CAT_LABEL[p.category]" variant="neutral" size="sm" />
              </td>
              <td><code class="ver-code">v{{ p.version }}</code></td>
              <td class="col-author">{{ p.author }}</td>
              <td class="col-last">{{ p.lastActive }}</td>
              <td class="col-err">
                <span :class="p.errorCount > 0 ? 'err-count' : 'col-muted'">{{ p.errorCount }}</span>
              </td>
              <td class="col-actions" @click.stop>
                <div class="row-actions">
                  <BaseButton size="sm" variant="ghost" @click="openConfig(p)">Cài đặt</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="openDelete(p, $event)">Gỡ</BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filtered.length === 0" class="empty-state">
        <div class="empty-icon">🔌</div>
        <p class="empty-text">Không tìm thấy plugin nào</p>
        <BaseButton variant="ghost" size="sm" @click="search = ''; catFilter = 'all'; showFilter = 'all'">
          Xoá bộ lọc
        </BaseButton>
      </div>
    </div>
  
  <!-- ── Bulk Action Bar ── -->
  <BulkActionBar :count="selected.length" :show="selected.length > 0" @clear="clearSelection">
    <BaseButton size="sm" variant="primary" @click="bulkEnOpen = true">
      Bật {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="warning" @click="bulkDisOpen = true">
      Tắt {{ selected.length }}
    </BaseButton>
    <BaseButton size="sm" variant="danger" @click="bulkDelOpen = true">
      Gỡ {{ selected.length }}
    </BaseButton>
  </BulkActionBar>

  <!-- ════ Config Modal ════ -->
  <FormModal
    v-model="configOpen"
    :title="`Cài đặt: ${configTarget?.name ?? ''}`"
    size="sm"
    submit-label="Lưu cài đặt"
    :loading="configLoading"
    @submit="handleSaveConfig"
  >
    <div class="form-body">
      <div class="plugin-info-banner" v-if="configTarget">
        <BaseBadge :text="CAT_LABEL[configTarget.category]" :variant="CAT_BADGE[configTarget.category]" />
        <span class="ver-code">v{{ configTarget.version }}</span>
        <span class="author-text">by {{ configTarget.author }}</span>
      </div>
      <FormField label="Homepage / Tài liệu" hint="URL trang tài liệu plugin">
        <BaseInput v-model="form.homepage" placeholder="https://..." />
      </FormField>
      <FormField label="Ghi chú cấu hình" hint="Ghi chú nội bộ về cài đặt plugin này">
        <BaseTextarea v-model="form.note" placeholder="API key, endpoint, thông tin cấu hình..." :rows="3" />
      </FormField>
    </div>
  </FormModal>

  <!-- ════ Detail Drawer ════ -->
  <FormDrawer
    v-model="detailOpen"
    :title="detailTarget?.name ?? 'Chi tiết plugin'"
    size="md"
    submit-label="Cài đặt"
    cancel-label="Đóng"
    @submit="openConfigFromDetail"
  >
    <template v-if="detailTarget">
      <div class="detail-header">
        <BaseBadge
          :text="CAT_LABEL[detailTarget.category]"
          :variant="CAT_BADGE[detailTarget.category]"
        />
        <BaseBadge
          :text="detailTarget.enabled ? 'Đang bật' : 'Đang tắt'"
          :variant="detailTarget.enabled ? 'success' : 'neutral'"
          dot
        />
        <span v-if="detailTarget.errorCount > 0" class="err-badge">
          {{ detailTarget.errorCount }} lỗi gần đây
        </span>
      </div>

      <div class="detail-section">
        <p class="detail-section__label">Mô tả</p>
        <p class="detail-desc">{{ detailTarget.desc }}</p>
      </div>

      <div class="detail-section">
        <p class="detail-section__label">Thông tin</p>
        <div class="detail-row">
          <span class="detail-key">Phiên bản</span>
          <code class="ver-code">v{{ detailTarget.version }}</code>
        </div>
        <div class="detail-row">
          <span class="detail-key">Tác giả</span>
          <span class="detail-val">{{ detailTarget.author }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Ngày cài đặt</span>
          <span class="detail-val">{{ detailTarget.installedAt }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Hoạt động cuối</span>
          <span class="detail-val">{{ detailTarget.lastActive }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Lỗi gần đây</span>
          <span :class="detailTarget.errorCount > 0 ? 'err-count' : 'detail-val'">
            {{ detailTarget.errorCount }}
          </span>
        </div>
      </div>

      <div v-if="detailTarget.note" class="detail-section">
        <p class="detail-section__label">Ghi chú cấu hình</p>
        <p class="detail-note">{{ detailTarget.note }}</p>
      </div>

      <div class="detail-danger">
        <BaseButton
          variant="danger"
          size="sm"
          @click="openDelete(detailTarget, $event); detailOpen = false"
        >
          Gỡ cài đặt plugin
        </BaseButton>
      </div>
    </template>
  </FormDrawer>

  <!-- ════ Confirm: Delete ════ -->
  <ConfirmDialog
    v-model="deleteOpen"
    title="Gỡ plugin?"
    :description="`Plugin '${deleteTarget?.name}' sẽ bị gỡ và tất cả cài đặt sẽ bị xoá.`"
    intent="danger"
    confirm-label="Gỡ cài đặt"
    :loading="deleteLoading"
    @confirm="handleDelete"
  />

  <!-- ════ Confirm: Bulk enable ════ -->
  <ConfirmDialog
    v-model="bulkEnOpen"
    title="Bật nhiều plugin?"
    :description="`${selected.length} plugin đã chọn sẽ được kích hoạt.`"
    intent="warning"
    confirm-label="Bật tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkEnable"
  />

  <!-- ════ Confirm: Bulk disable ════ -->
  <ConfirmDialog
    v-model="bulkDisOpen"
    title="Tắt nhiều plugin?"
    :description="`${selected.length} plugin đã chọn sẽ bị vô hiệu hoá.`"
    intent="warning"
    confirm-label="Tắt tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDisable"
  />

  <!-- ════ Confirm: Bulk delete ════ -->
  <ConfirmDialog
    v-model="bulkDelOpen"
    title="Gỡ nhiều plugin?"
    :description="`${selected.length} plugin đã chọn sẽ bị gỡ và xoá cài đặt vĩnh viễn.`"
    intent="danger"
    confirm-label="Gỡ tất cả"
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
.ct-row--disabled { opacity: 0.6; }

/* Row actions */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  opacity: 0;
  transition: opacity var(--wx-d-micro);
}
.ct-row:hover .row-actions { opacity: 1; }

/* Columns */
.col-check   { width: 44px; }
.col-on      { width: 56px; }
.col-name    { min-width: 220px; }
.col-err     { width: 60px; text-align: center; font-variant-numeric: tabular-nums; }
.col-actions { width: 130px; }
.col-author  { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.col-last    { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; }
.col-muted   { color: var(--wx-text-muted); }

/* Checkbox */
.cb { width: 16px; height: 16px; accent-color: var(--wx-brand-primary); cursor: pointer; }

/* Plugin name cell */
.plugin-cell { display: flex; flex-direction: column; gap: 2px; }
.plugin-name { font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); line-height: 1.3; }
.plugin-desc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); line-height: 1.3; }

/* Version */
.ver-code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  padding: 2px 7px;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-sm);
  color: var(--wx-text-secondary);
}

/* Error count */
.err-count { font-weight: var(--wx-fw-semibold); color: var(--wx-danger-text); }

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

.plugin-info-banner {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}
.author-text { font-size: var(--wx-fs-13); color: var(--wx-text-muted); }

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

.err-badge {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-danger-text);
  background: var(--wx-danger-bg);
  border: 1px solid var(--wx-danger-border);
  border-radius: var(--wx-radius-full);
  padding: 2px 10px;
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

.detail-desc {
  margin: 0;
  font-size: var(--wx-fs-14);
  color: var(--wx-text-secondary);
  line-height: var(--wx-lh-normal);
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
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-13);
}

.detail-danger {
  padding-top: var(--wx-space-5);
  border-top: 1px solid var(--wx-border-subtle);
  margin-top: auto;
}
</style>

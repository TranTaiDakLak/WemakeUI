<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AppTopbar from '../components/layout/AppTopbar.vue'
import PageHeader from '../components/layout/PageHeader.vue'
import {
  BaseButton, BaseInput, BaseSelect, BaseToggle,
  BaseCheckbox, BaseRadio, BaseTabs, BaseBadge,
  BaseProgress, BaseModal, BaseDropdown, BaseTooltip,
  BaseSkeleton, BaseDataGrid, ContextMenu, StatusBar,
  GroupBox, FormField,
} from '../components/common'
import { useToast } from '../composables/useToast'
import { useBreakpoint } from '../composables/useBreakpoint'
import { useClipboard } from '../composables/useClipboard'
import { useCopyClipboard } from '../composables/useCopyClipboard'
import { useI18n } from '../composables/useI18n'
import { useTheme } from '../ui-system/composables/useTheme'
import type { ColumnConfig, ContextMenuItem, GridStats } from '../types'

/* ── Toast & utilities ───────────────────────────────── */
const { showToast } = useToast()
const { breakpoint, width, isMobile, isTablet, isDesktop } = useBreakpoint()
const { copyToClipboard } = useClipboard()
const { copy, copied } = useCopyClipboard()
const { setLocale, getLocale } = useI18n()
const { theme, isDark, setTheme } = useTheme()

/* ── Tabs ────────────────────────────────────────────── */
const tab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'buttons', label: 'Buttons' },
  { key: 'inputs', label: 'Inputs' },
  { key: 'forms', label: 'Forms' },
  { key: 'datagrid', label: 'DataGrid' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'overlay', label: 'Overlay' },
  { key: 'layout', label: 'Layout' },
]

/* ── Overview state ──────────────────────────────────── */
const localeValue = ref<'vi' | 'en'>(getLocale())
const themeOptions = [
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
  { value: 'system', label: 'Theo hệ thống' },
]
const localeOptions = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
]

function changeLocale(v: string | number) {
  localeValue.value = v as 'vi' | 'en'
  setLocale(v as 'vi' | 'en')
  showToast('info', `Đã đổi ngôn ngữ: ${v}`)
}

const colorTokens = [
  { name: '--wx-brand-primary', label: 'Brand Primary' },
  { name: '--wx-brand-accent', label: 'Brand Accent' },
  { name: '--wx-success-solid', label: 'Success' },
  { name: '--wx-warning-solid', label: 'Warning' },
  { name: '--wx-danger-solid', label: 'Danger' },
  { name: '--wx-info-solid', label: 'Info' },
  { name: '--wx-text-primary', label: 'Text Primary' },
  { name: '--wx-text-secondary', label: 'Text Secondary' },
  { name: '--wx-text-muted', label: 'Text Muted' },
  { name: '--wx-surface-base', label: 'Surface Base' },
  { name: '--wx-surface-sunken', label: 'Surface Sunken' },
  { name: '--wx-border-default', label: 'Border' },
]

const spacingTokens = [
  { name: '--space-xs', value: '4px' },
  { name: '--space-sm', value: '8px' },
  { name: '--space-md', value: '16px' },
  { name: '--space-lg', value: '24px' },
  { name: '--space-xl', value: '32px' },
  { name: '--space-2xl', value: '48px' },
]

/* ── Buttons state ───────────────────────────────────── */
const btnLoading = ref(false)
function triggerLoading() {
  btnLoading.value = true
  setTimeout(() => { btnLoading.value = false }, 1500)
}
const iconPlus = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
const iconDownload = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'

/* ── Inputs state ────────────────────────────────────── */
const inputDemo = reactive({
  text: '',
  password: 'secret123',
  number: 42,
  email: 'demo@wemake.vn',
  errorField: '',
  selectVal: 'pro',
  selectGroupVal: 'apple',
  toggle1: true,
  toggle2: false,
  check1: true,
  check2: false,
  checkIndeterminate: true,
  radio: 'b',
  radioVertical: 'free',
})

const planOpts = [
  { value: 'free', label: 'Miễn phí' },
  { value: 'pro', label: 'Chuyên nghiệp' },
  { value: 'team', label: 'Doanh nghiệp' },
]

const fruitOpts = [
  { value: 'apple', label: 'Táo', group: 'Trái cây' },
  { value: 'banana', label: 'Chuối', group: 'Trái cây' },
  { value: 'carrot', label: 'Cà rốt', group: 'Rau củ' },
  { value: 'broccoli', label: 'Bông cải', group: 'Rau củ' },
]

/* ── Forms state ─────────────────────────────────────── */
const loginForm = reactive({ email: '', password: '', remember: false })
const loginErrors = reactive({ email: '', password: '' })

function submitLogin() {
  loginErrors.email = ''
  loginErrors.password = ''
  if (!loginForm.email) loginErrors.email = 'Email không được để trống'
  else if (!/.+@.+\..+/.test(loginForm.email)) loginErrors.email = 'Email không hợp lệ'
  if (!loginForm.password) loginErrors.password = 'Mật khẩu không được để trống'
  else if (loginForm.password.length < 6) loginErrors.password = 'Mật khẩu tối thiểu 6 ký tự'
  if (!loginErrors.email && !loginErrors.password) {
    showToast('success', 'Đăng nhập thành công!')
  } else {
    showToast('error', 'Vui lòng kiểm tra lại form')
  }
}

const regForm = reactive({
  username: '',
  email: '',
  password: '',
  country: 'vn',
  plan: 'pro',
  newsletter: true,
  agree: false,
})
const countryOpts = [
  { value: 'vn', label: 'Việt Nam' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: 'Japan' },
  { value: 'sg', label: 'Singapore' },
  { value: 'kr', label: 'Korea' },
]

/* ── DataGrid state ──────────────────────────────────── */
const gridColumns = ref<ColumnConfig[]>([
  { key: 'username', label: 'Tài khoản', visible: true, group: 'main', width: '160px', sortable: true },
  { key: 'email', label: 'Email', visible: true, group: 'main', width: '220px', sortable: true },
  { key: 'role', label: 'Vai trò', visible: true, group: 'main', width: '120px' },
  { key: 'status', label: 'Trạng thái', visible: true, group: 'main', width: '120px', sortable: true },
  { key: 'cookie', label: 'Cookie', visible: true, group: 'main', width: '80px', align: 'center' },
  { key: 'token', label: 'Token', visible: true, group: 'main', width: '80px', align: 'center' },
  { key: 'lastLogin', label: 'Đăng nhập cuối', visible: true, group: 'main', width: '160px', sortable: true },
])

function generateRows(n: number) {
  const statuses = ['Live', 'Die', 'Checkpoint']
  const roles = ['Admin', 'Editor', 'Viewer', 'Guest']
  const out = []
  for (let i = 0; i < n; i++) {
    out.push({
      username: `user${(i + 1).toString().padStart(3, '0')}`,
      email: `user${i + 1}@wemake.vn`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      cookie: i % 3 === 0 ? '✓' : '✗',
      token: i % 2 === 0 ? '✓' : '✗',
      lastLogin: `2026-05-${((i % 28) + 1).toString().padStart(2, '0')}`,
      chose: false,
    })
  }
  return out
}

const gridRows = ref(generateRows(50))
const gridLoading = ref(false)
const highlightedRows = ref<Set<number>>(new Set())
const selectedCells = ref<{ row: number; col: string }[]>([])
const allChosen = computed(() => gridRows.value.length > 0 && gridRows.value.every(r => r.chose))

function regenerate(n: number) {
  gridLoading.value = true
  setTimeout(() => {
    gridRows.value = generateRows(n)
    highlightedRows.value = new Set()
    selectedCells.value = []
    gridLoading.value = false
    showToast('success', `Đã tạo ${n} dòng`)
  }, 400)
}

function onToggleAll(checked: boolean) {
  gridRows.value.forEach(r => { r.chose = checked })
}

function onToggleRow(idx: number) {
  gridRows.value[idx].chose = !gridRows.value[idx].chose
}

function onRowMousedown(idx: number) {
  if (highlightedRows.value.has(idx)) {
    highlightedRows.value.delete(idx)
  } else {
    highlightedRows.value.add(idx)
  }
  highlightedRows.value = new Set(highlightedRows.value)
}

function onCellClick(row: number, col: string) {
  selectedCells.value = [{ row, col }]
}

function onSort(col: string, dir: 'asc' | 'desc') {
  gridRows.value = [...gridRows.value].sort((a, b) => {
    const av = String((a as Record<string, unknown>)[col] ?? '')
    const bv = String((b as Record<string, unknown>)[col] ?? '')
    return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })
}

/* ── Context Menu state ──────────────────────────────── */
const ctxShow = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)
const ctxItems = ref<ContextMenuItem[]>([
  { id: 'h1', label: 'Hành động', disabled: true },
  { id: 'view', label: 'Xem chi tiết', icon: '👁', action: () => showToast('info', 'Xem chi tiết') },
  { id: 'edit', label: 'Chỉnh sửa', icon: '✎', action: () => showToast('info', 'Chỉnh sửa') },
  { id: 'copy', label: 'Sao chép', icon: '⧉', action: () => showToast('success', 'Đã sao chép') },
  { id: 's1', separator: true, label: '' },
  {
    id: 'export',
    label: 'Xuất dữ liệu',
    icon: '↓',
    children: [
      { id: 'csv', label: 'CSV', action: () => showToast('success', 'Xuất CSV') },
      { id: 'json', label: 'JSON', action: () => showToast('success', 'Xuất JSON') },
      { id: 'xlsx', label: 'Excel', action: () => showToast('success', 'Xuất Excel') },
    ],
  },
  { id: 's2', separator: true, label: '' },
  { id: 'del', label: 'Xóa', icon: '🗑', danger: true, action: () => showToast('error', 'Đã xóa') },
])

function onGridContextMenu(e: MouseEvent) {
  ctxX.value = e.clientX
  ctxY.value = e.clientY
  ctxShow.value = true
}

/* ── Feedback state ──────────────────────────────────── */
const progress = ref(45)
const progressAuto = ref(0)
let progressTimer: ReturnType<typeof setInterval> | null = null

function startAutoProgress() {
  if (progressTimer) return
  progressAuto.value = 0
  progressTimer = setInterval(() => {
    progressAuto.value += 5
    if (progressAuto.value >= 100) {
      progressAuto.value = 100
      if (progressTimer) clearInterval(progressTimer)
      progressTimer = null
    }
  }, 200)
}

const showModal = ref(false)
const showModalLg = ref(false)
const showModalLoading = ref(false)
const modalLoading = ref(false)

function fakeAsyncSave() {
  modalLoading.value = true
  setTimeout(() => {
    modalLoading.value = false
    showModalLoading.value = false
    showToast('success', 'Đã lưu')
  }, 1200)
}

const skeletonShow = ref(true)

/* ── Overlay state ──────────────────────────────────── */
const tooltipPlacements: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left']
const dropdownPlacements: Array<'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'> = ['bottom-start', 'bottom-end', 'top-start', 'top-end']

/* ── Layout state ────────────────────────────────────── */
const groupCollapsed = ref(false)
const sampleStats: GridStats = {
  total: 1234,
  live: 987,
  highlighted: 12,
  selected: 5,
}

/* ── Clipboard demo ──────────────────────────────────── */
const cbText = ref('Hello WemakeUI!')

function quickCopy() {
  if (copyToClipboard(cbText.value)) {
    showToast('success', 'Đã copy (basic)')
  }
}

onMounted(() => {
  // Initialize theme select to current value
})
</script>

<template>
  <div class="showcase">
    <AppTopbar title="WemakeUI" subtitle="Cross-platform Vue 3 UI Kit" />

    <main class="showcase-main">
      <PageHeader
        title="Component Showcase"
        description="Bộ thành phần dùng được cho web, mobile, và desktop. Click vào các tab để xem chi tiết từng nhóm."
      >
        <template #actions>
          <BaseBadge :text="`${breakpoint} · ${width}px`" variant="info" />
        </template>
      </PageHeader>

      <BaseTabs v-model="tab" :tabs="tabs" />

      <!-- ════════════════════════════════════════════════════
        TAB 1 · OVERVIEW
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'overview'" class="grid">
        <GroupBox title="Theme & Locale">
          <div class="row">
            <FormField label="Chế độ giao diện" layout="vertical">
              <BaseSelect
                :model-value="theme"
                :options="themeOptions"
                @update:model-value="(v) => setTheme(v as 'light' | 'dark' | 'system')"
              />
            </FormField>
            <FormField label="Ngôn ngữ" layout="vertical">
              <BaseSelect :model-value="localeValue" :options="localeOptions" @update:model-value="changeLocale" />
            </FormField>
            <FormField label="Trạng thái hiện tại" layout="vertical">
              <div class="row">
                <BaseBadge :text="isDark ? 'Dark' : 'Light'" :variant="isDark ? 'info' : 'warning'" />
                <BaseBadge :text="`Locale: ${localeValue}`" variant="ghost" />
              </div>
            </FormField>
          </div>
        </GroupBox>

        <GroupBox title="Responsive (useBreakpoint)">
          <div class="row">
            <BaseBadge :text="`Breakpoint: ${breakpoint}`" variant="primary" />
            <BaseBadge :text="`Width: ${width}px`" variant="ghost" />
            <BaseBadge text="Mobile" :variant="isMobile ? 'success' : 'ghost'" />
            <BaseBadge text="Tablet" :variant="isTablet ? 'success' : 'ghost'" />
            <BaseBadge text="Desktop" :variant="isDesktop ? 'success' : 'ghost'" />
          </div>
        </GroupBox>

        <GroupBox title="Color tokens">
          <div class="swatch-grid">
            <div v-for="c in colorTokens" :key="c.name" class="swatch">
              <span class="swatch-color" :style="{ background: `var(${c.name})` }" />
              <div class="swatch-info">
                <span class="swatch-label">{{ c.label }}</span>
                <code class="swatch-name">{{ c.name }}</code>
              </div>
            </div>
          </div>
        </GroupBox>

        <GroupBox title="Gradient tokens">
          <div class="gradient-grid">
            <div class="gradient-card" style="background: var(--wx-gradient-header)">Header</div>
            <div class="gradient-card" style="background: var(--wx-gradient-button)">Button</div>
            <div class="gradient-card" style="background: var(--wx-gradient-cta)">CTA</div>
            <div class="gradient-card" style="background: var(--wx-gradient-accent)">Accent</div>
            <div class="gradient-card" style="background: var(--wx-gradient-success)">Success</div>
            <div class="gradient-card" style="background: var(--wx-gradient-danger)">Danger</div>
            <div class="gradient-card" style="background: var(--wx-gradient-warning)">Warning</div>
          </div>
        </GroupBox>

        <GroupBox title="Spacing scale">
          <div class="space-list">
            <div v-for="s in spacingTokens" :key="s.name" class="space-row">
              <code class="space-name">{{ s.name }}</code>
              <span class="space-bar" :style="{ width: s.value }" />
              <span class="space-value">{{ s.value }}</span>
            </div>
          </div>
        </GroupBox>

        <GroupBox title="Typography">
          <div class="type-list">
            <div class="type-row" style="font-size: 32px; font-weight: 800;">Tiêu đề lớn — 32px / 800</div>
            <div class="type-row" style="font-size: 24px; font-weight: 700;">Tiêu đề trung — 24px / 700</div>
            <div class="type-row" style="font-size: 16px; font-weight: 600;">Tiêu đề nhỏ — 16px / 600</div>
            <div class="type-row" style="font-size: 14px;">Body text — 14px (regular)</div>
            <div class="type-row" style="font-size: 13px; color: var(--wx-text-secondary);">Phụ đề — 13px / secondary</div>
            <div class="type-row" style="font-size: 11px; color: var(--wx-text-muted);">Caption — 11px / muted</div>
            <div class="type-row" style="font-family: var(--wx-font-mono); font-size: 13px;">const code = 'monospace token'</div>
          </div>
        </GroupBox>

        <GroupBox title="Clipboard composables">
          <div class="row">
            <BaseInput v-model="cbText" placeholder="Nội dung muốn copy..." />
            <BaseButton variant="secondary" @click="quickCopy">Copy (basic)</BaseButton>
            <BaseButton :variant="copied ? 'success' : 'primary'" @click="copy(cbText)">
              {{ copied ? '✓ Đã copy!' : 'Copy (with state)' }}
            </BaseButton>
          </div>
        </GroupBox>
      </section>

      <!-- ════════════════════════════════════════════════════
        TAB 2 · BUTTONS
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'buttons'" class="grid">
        <GroupBox title="Variants">
          <div class="row">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="success">Success</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton variant="text">Text</BaseButton>
            <BaseButton variant="cta">CTA</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="Sizes">
          <div class="row" style="align-items: center;">
            <BaseButton size="sm">Small</BaseButton>
            <BaseButton size="md">Medium</BaseButton>
            <BaseButton size="lg">Large</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="States">
          <div class="row">
            <BaseButton :loading="btnLoading" @click="triggerLoading">
              {{ btnLoading ? 'Đang xử lý...' : 'Click để loading 1.5s' }}
            </BaseButton>
            <BaseButton disabled>Disabled</BaseButton>
            <BaseButton variant="success" disabled>Success disabled</BaseButton>
            <BaseButton variant="danger" loading>Danger loading</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="With icons">
          <div class="row">
            <BaseButton variant="primary" :icon="iconPlus">Thêm mới</BaseButton>
            <BaseButton variant="secondary" :icon="iconDownload">Tải xuống</BaseButton>
            <BaseButton variant="success" :icon="iconPlus">Tạo</BaseButton>
            <BaseButton variant="ghost" :icon="iconDownload">Export</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="Block (full-width)">
          <BaseButton variant="primary" block>Đăng nhập</BaseButton>
          <div style="height: 8px;"></div>
          <BaseButton variant="secondary" block>Đăng ký tài khoản mới</BaseButton>
        </GroupBox>
      </section>

      <!-- ════════════════════════════════════════════════════
        TAB 3 · INPUTS
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'inputs'" class="grid">
        <GroupBox title="BaseInput — types">
          <div class="cols-2">
            <FormField label="Text" layout="vertical">
              <BaseInput v-model="inputDemo.text" placeholder="Nhập nội dung..." />
            </FormField>
            <FormField label="Password" layout="vertical">
              <BaseInput v-model="inputDemo.password" type="password" placeholder="••••••••" />
            </FormField>
            <FormField label="Number" layout="vertical">
              <BaseInput v-model="inputDemo.number" type="number" />
            </FormField>
            <FormField label="Email" layout="vertical">
              <BaseInput v-model="inputDemo.email" type="email" placeholder="you@example.com" />
            </FormField>
          </div>
        </GroupBox>

        <GroupBox title="BaseInput — states & sizes">
          <div class="cols-2">
            <FormField label="Có lỗi (error)" layout="vertical">
              <BaseInput v-model="inputDemo.errorField" placeholder="Nhập gì đó..." error="Trường này bắt buộc" />
            </FormField>
            <FormField label="Disabled" layout="vertical">
              <BaseInput model-value="Không thể sửa" disabled />
            </FormField>
            <FormField label="Size sm" layout="vertical">
              <BaseInput v-model="inputDemo.text" size="sm" placeholder="Compact input" />
            </FormField>
            <FormField label="Size md (default)" layout="vertical">
              <BaseInput v-model="inputDemo.text" placeholder="Default input" />
            </FormField>
          </div>
        </GroupBox>

        <GroupBox title="BaseSelect">
          <div class="cols-2">
            <FormField label="Cơ bản" layout="vertical">
              <BaseSelect v-model="inputDemo.selectVal" :options="planOpts" />
            </FormField>
            <FormField label="Có nhóm (optgroup)" layout="vertical">
              <BaseSelect v-model="inputDemo.selectGroupVal" :options="fruitOpts" />
            </FormField>
            <FormField label="Disabled" layout="vertical">
              <BaseSelect :model-value="'pro'" :options="planOpts" disabled />
            </FormField>
            <FormField label="Size sm" layout="vertical">
              <BaseSelect v-model="inputDemo.selectVal" :options="planOpts" size="sm" />
            </FormField>
          </div>
        </GroupBox>

        <GroupBox title="BaseToggle">
          <div class="row" style="flex-direction: column; align-items: flex-start; gap: 12px;">
            <BaseToggle v-model="inputDemo.toggle1" label="Bật thông báo" />
            <BaseToggle v-model="inputDemo.toggle2" label="Tự động cập nhật" />
            <BaseToggle :model-value="true" label="Disabled (on)" disabled />
            <BaseToggle :model-value="false" label="Disabled (off)" disabled />
          </div>
        </GroupBox>

        <GroupBox title="BaseCheckbox">
          <div class="row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
            <BaseCheckbox v-model="inputDemo.check1" label="Tôi đồng ý điều khoản" />
            <BaseCheckbox v-model="inputDemo.check2" label="Đăng ký nhận tin" />
            <BaseCheckbox v-model="inputDemo.checkIndeterminate" :indeterminate="inputDemo.checkIndeterminate" label="Indeterminate state" />
            <BaseCheckbox :model-value="true" label="Disabled checked" disabled />
          </div>
        </GroupBox>

        <GroupBox title="BaseRadio">
          <FormField label="Horizontal (default)" layout="vertical">
            <BaseRadio v-model="inputDemo.radio" name="demo-h" :options="[
              { value: 'a', label: 'Lựa chọn A' },
              { value: 'b', label: 'Lựa chọn B' },
              { value: 'c', label: 'Lựa chọn C' },
            ]" />
          </FormField>
          <FormField label="Vertical" layout="vertical">
            <BaseRadio v-model="inputDemo.radioVertical" name="demo-v" direction="vertical" :options="planOpts" />
          </FormField>
        </GroupBox>

        <GroupBox title="FormField — layouts">
          <FormField label="Horizontal (default)" help-text="Label nằm ngang, control bên phải">
            <BaseInput v-model="inputDemo.text" size="sm" />
          </FormField>
          <FormField label="Required field" required>
            <BaseInput v-model="inputDemo.text" size="sm" />
          </FormField>
          <FormField label="Vertical" layout="vertical" description="Label trên, control dưới">
            <BaseInput v-model="inputDemo.text" />
          </FormField>
          <FormField label="With help text" layout="vertical" help-text="Mật khẩu tối thiểu 8 ký tự, bao gồm chữ và số">
            <BaseInput v-model="inputDemo.password" type="password" />
          </FormField>
        </GroupBox>
      </section>

      <!-- ════════════════════════════════════════════════════
        TAB 4 · FORMS
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'forms'" class="grid cols-2-equal">
        <GroupBox title="Form đăng nhập">
          <FormField label="Email" layout="vertical" required>
            <BaseInput v-model="loginForm.email" type="email" placeholder="you@example.com" :error="loginErrors.email" />
          </FormField>
          <FormField label="Mật khẩu" layout="vertical" required>
            <BaseInput v-model="loginForm.password" type="password" placeholder="••••••••" :error="loginErrors.password" />
          </FormField>
          <BaseCheckbox v-model="loginForm.remember" label="Ghi nhớ đăng nhập" />
          <div style="margin-top: 12px;">
            <BaseButton variant="primary" block @click="submitLogin">Đăng nhập</BaseButton>
          </div>
          <div class="row" style="margin-top: 8px; justify-content: center;">
            <BaseButton variant="text" size="sm">Quên mật khẩu?</BaseButton>
            <BaseButton variant="text" size="sm">Đăng ký</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="Form đăng ký">
          <FormField label="Tên người dùng" layout="vertical" required>
            <BaseInput v-model="regForm.username" placeholder="username..." />
          </FormField>
          <FormField label="Email" layout="vertical" required>
            <BaseInput v-model="regForm.email" type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Mật khẩu" layout="vertical" required help-text="Tối thiểu 8 ký tự">
            <BaseInput v-model="regForm.password" type="password" placeholder="••••••••" />
          </FormField>
          <FormField label="Quốc gia" layout="vertical">
            <BaseSelect v-model="regForm.country" :options="countryOpts" />
          </FormField>
          <FormField label="Gói dịch vụ" layout="vertical">
            <BaseRadio v-model="regForm.plan" name="plan" :options="planOpts" />
          </FormField>
          <BaseToggle v-model="regForm.newsletter" label="Nhận bản tin hàng tuần" />
          <BaseCheckbox v-model="regForm.agree" label="Tôi đồng ý với điều khoản sử dụng" />
          <div class="row" style="margin-top: 12px;">
            <BaseButton
              variant="primary"
              :disabled="!regForm.agree"
              @click="showToast('success', 'Đăng ký thành công!')"
            >
              Đăng ký
            </BaseButton>
            <BaseButton variant="ghost">Hủy</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="Validation states (chỉ minh hoạ)">
          <FormField label="Field bình thường" layout="vertical">
            <BaseInput model-value="value ổn" />
          </FormField>
          <FormField label="Field có lỗi" layout="vertical">
            <BaseInput model-value="abc" error="Giá trị không hợp lệ" />
          </FormField>
          <FormField label="Field disabled" layout="vertical">
            <BaseInput model-value="readonly value" disabled />
          </FormField>
          <FormField label="Required với help" layout="vertical" required help-text="Bắt buộc nhập, tối thiểu 3 ký tự">
            <BaseInput model-value="" />
          </FormField>
        </GroupBox>

        <GroupBox title="Layout horizontal (settings style)">
          <FormField label="Tên hiển thị">
            <BaseInput model-value="Nguyễn Văn A" size="sm" />
          </FormField>
          <FormField label="Email">
            <BaseInput model-value="user@wemake.vn" size="sm" />
          </FormField>
          <FormField label="Múi giờ">
            <BaseSelect :model-value="'vn'" :options="countryOpts" size="sm" />
          </FormField>
          <FormField label="Thông báo email">
            <BaseToggle :model-value="true" />
          </FormField>
          <FormField label="Thông báo push">
            <BaseToggle :model-value="false" />
          </FormField>
          <div class="row" style="margin-top: 12px; justify-content: flex-end;">
            <BaseButton variant="ghost">Hủy</BaseButton>
            <BaseButton variant="primary">Lưu thay đổi</BaseButton>
          </div>
        </GroupBox>
      </section>

      <!-- ════════════════════════════════════════════════════
        TAB 5 · DATAGRID
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'datagrid'" class="grid">
        <GroupBox title="Controls">
          <div class="row">
            <BaseButton variant="ghost" size="sm" @click="regenerate(50)">50 dòng</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="regenerate(200)">200 dòng</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="regenerate(1000)">1000 dòng (virtual)</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="regenerate(5000)">5000 dòng (virtual)</BaseButton>
            <span class="muted">Đang có {{ gridRows.length }} dòng · Click chuột phải để xem context menu</span>
          </div>
        </GroupBox>

        <GroupBox title="BaseDataGrid">
          <div style="height: 480px;">
            <BaseDataGrid
              :columns="gridColumns"
              :rows="gridRows"
              :highlighted-rows="highlightedRows"
              :selected-cells="selectedCells"
              :all-chosen="allChosen"
              :loading="gridLoading"
              @toggle-all="onToggleAll"
              @toggle-row="onToggleRow"
              @row-mousedown="onRowMousedown"
              @cell-click="onCellClick"
              @sort="onSort"
              @contextmenu="onGridContextMenu"
            />
          </div>
          <div class="muted" style="margin-top: 8px;">
            Click vào hàng để bôi đen · Click vào ô để chọn cell · Click header có icon để sort · Kéo cạnh phải header để resize
          </div>
        </GroupBox>

        <GroupBox title="StatusBar (tóm tắt grid)">
          <StatusBar
            :stats="{
              total: gridRows.length,
              live: gridRows.filter((r) => r.status === 'Live').length,
              highlighted: highlightedRows.size,
              selected: selectedCells.length,
            }"
            status-text="Sẵn sàng"
            user-name="demo@wemake.vn"
            version="v0.1.0"
          />
        </GroupBox>
      </section>

      <!-- ════════════════════════════════════════════════════
        TAB 6 · FEEDBACK
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'feedback'" class="grid">
        <GroupBox title="Toast (4 types)">
          <div class="row">
            <BaseButton variant="success" @click="showToast('success', 'Lưu thành công!')">Success</BaseButton>
            <BaseButton variant="danger" @click="showToast('error', 'Có lỗi xảy ra.')">Error</BaseButton>
            <BaseButton variant="primary" @click="showToast('warning', 'Cảnh báo: dữ liệu sắp đầy.')">Warning</BaseButton>
            <BaseButton variant="secondary" @click="showToast('info', 'Thông báo: có cập nhật mới.')">Info</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="BaseProgress — variants">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <BaseProgress :value="progress" variant="primary" show-label />
            <BaseProgress :value="progress" variant="success" show-label />
            <BaseProgress :value="progress" variant="warning" show-label />
            <BaseProgress :value="progress" variant="error" show-label />
          </div>
          <div class="row" style="margin-top: 14px;">
            <BaseButton size="sm" @click="progress = Math.max(0, progress - 10)">−10%</BaseButton>
            <BaseButton size="sm" @click="progress = Math.min(100, progress + 10)">+10%</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="BaseProgress — sizes / striped / animated">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <BaseProgress :value="60" size="sm" />
            <BaseProgress :value="60" size="md" />
            <BaseProgress :value="60" size="lg" />
            <BaseProgress :value="75" striped show-label />
            <BaseProgress :value="progressAuto" striped animated show-label />
          </div>
          <div class="row" style="margin-top: 12px;">
            <BaseButton size="sm" variant="primary" @click="startAutoProgress">Chạy auto progress</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="BaseBadge variants">
          <div class="row">
            <BaseBadge text="Primary" variant="primary" />
            <BaseBadge text="Success" variant="success" />
            <BaseBadge text="Warning" variant="warning" />
            <BaseBadge text="Danger" variant="danger" />
            <BaseBadge text="Info" variant="info" />
            <BaseBadge text="Ghost" variant="ghost" />
            <BaseBadge :text="42" variant="primary" />
          </div>
          <div class="row" style="margin-top: 8px;">
            <BaseBadge dot variant="success" />
            <BaseBadge dot variant="success" pulsing />
            <BaseBadge dot variant="danger" pulsing />
            <BaseBadge dot variant="warning" />
            <BaseBadge dot variant="primary" />
            <span class="muted">Dots & pulsing</span>
          </div>
        </GroupBox>

        <GroupBox title="BaseModal — sizes">
          <div class="row">
            <BaseButton variant="primary" @click="showModal = true">Modal sm</BaseButton>
            <BaseButton variant="primary" @click="showModalLg = true">Modal lg</BaseButton>
            <BaseButton variant="primary" @click="showModalLoading = true">Modal có loading khi save</BaseButton>
          </div>

          <BaseModal
            :show="showModal"
            title="Xác nhận"
            size="sm"
            show-save
            save-label="Đồng ý"
            @close="showModal = false"
            @save="showModal = false; showToast('success', 'Đã xác nhận!')"
          >
            <p>Bạn có chắc chắn muốn thực hiện hành động này?</p>
          </BaseModal>

          <BaseModal :show="showModalLg" title="Chi tiết người dùng" size="lg" @close="showModalLg = false">
            <div class="cols-2">
              <FormField label="Tên" layout="vertical"><BaseInput model-value="Nguyễn Văn A" /></FormField>
              <FormField label="Email" layout="vertical"><BaseInput model-value="a@wemake.vn" /></FormField>
              <FormField label="Vai trò" layout="vertical"><BaseSelect :model-value="'pro'" :options="planOpts" /></FormField>
              <FormField label="Quốc gia" layout="vertical"><BaseSelect :model-value="'vn'" :options="countryOpts" /></FormField>
            </div>
            <p class="muted" style="margin-top: 12px;">Modal có thể kéo thả tiêu đề, ESC để đóng, focus trap khi Tab.</p>
          </BaseModal>

          <BaseModal
            :show="showModalLoading"
            title="Lưu cấu hình"
            size="sm"
            show-save
            save-label="Lưu"
            :loading="modalLoading"
            @close="showModalLoading = false"
            @save="fakeAsyncSave"
          >
            <p>Bấm "Lưu" để giả lập gọi API 1.2s.</p>
          </BaseModal>
        </GroupBox>

        <GroupBox title="BaseSkeleton (loading placeholder)">
          <div class="row" style="margin-bottom: 8px;">
            <BaseToggle v-model="skeletonShow" label="Hiện skeleton" />
          </div>
          <BaseSkeleton v-if="skeletonShow" :rows="4" :cols="3" />
          <div v-else class="muted">(Skeleton ẩn — toggle để xem)</div>
        </GroupBox>
      </section>

      <!-- ════════════════════════════════════════════════════
        TAB 7 · OVERLAY
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'overlay'" class="grid">
        <GroupBox title="BaseTooltip — placements">
          <div class="placement-grid">
            <BaseTooltip v-for="p in tooltipPlacements" :key="p" :content="`Tooltip ${p}`" :placement="p">
              <BaseButton variant="ghost">{{ p }}</BaseButton>
            </BaseTooltip>
          </div>
          <div class="row" style="margin-top: 16px;">
            <BaseTooltip content="Custom delay 800ms" :delay="800">
              <BaseButton variant="secondary">Hover (delay 800ms)</BaseButton>
            </BaseTooltip>
            <BaseTooltip content="Bị disable" disabled>
              <BaseButton variant="secondary">Disabled tooltip</BaseButton>
            </BaseTooltip>
          </div>
        </GroupBox>

        <GroupBox title="BaseDropdown — placements">
          <div class="placement-grid">
            <BaseDropdown v-for="p in dropdownPlacements" :key="p" :placement="p">
              <template #trigger>
                <BaseButton variant="secondary">{{ p }} ▾</BaseButton>
              </template>
              <template #default="{ close }">
                <div class="menu">
                  <button class="menu-item" @click="close()">Hành động 1</button>
                  <button class="menu-item" @click="close()">Hành động 2</button>
                  <button class="menu-item menu-item--danger" @click="close()">Xóa</button>
                </div>
              </template>
            </BaseDropdown>
          </div>
        </GroupBox>

        <GroupBox title="ContextMenu (chuột phải vào nút bên dưới)">
          <div
            class="ctx-target"
            @contextmenu.prevent="onGridContextMenu($event)"
          >
            Chuột phải vào đây để mở context menu
          </div>
          <div class="muted" style="margin-top: 8px;">
            Hỗ trợ: section header · separator · submenu · keyboard nav (↑↓ →← Enter Esc) · danger items
          </div>
        </GroupBox>
      </section>

      <!-- ════════════════════════════════════════════════════
        TAB 8 · LAYOUT
        ════════════════════════════════════════════════════ -->
      <section v-if="tab === 'layout'" class="grid">
        <GroupBox title="GroupBox — fixed">
          <p>GroupBox cơ bản — wrap nội dung với header màu thương hiệu.</p>
        </GroupBox>

        <GroupBox title="GroupBox — collapsible" collapsible :collapsed="groupCollapsed" @update:collapsed="(v) => groupCollapsed = v">
          <p>GroupBox có thể thu gọn. Click vào header để toggle.</p>
          <p>Trạng thái hiện tại: {{ groupCollapsed ? 'Đã thu gọn' : 'Đang mở' }}</p>
        </GroupBox>

        <GroupBox title="PageHeader (đã hiện ở trên cùng)">
          <p class="muted">PageHeader đang ở trên cùng của showcase này — title + description + actions slot.</p>
        </GroupBox>

        <GroupBox title="StatusBar — full">
          <StatusBar
            :stats="sampleStats"
            status-text="Đang chạy"
            user-name="admin@wemake.vn"
            expiry-date="2026-12-31"
            version="v0.1.0"
            :progress="68"
            @segment-click="(s) => showToast('info', `Click segment: ${s}`)"
          />
        </GroupBox>

        <GroupBox title="StatusBar — minimal (chỉ slots)">
          <StatusBar status-text="Online">
            <template #left>
              <span class="muted">CPU: 23%</span>
              <span class="sep">|</span>
              <span class="muted">RAM: 1.2 GB</span>
            </template>
            <template #right>
              <BaseBadge dot variant="success" pulsing />
              <span class="muted">Connected</span>
            </template>
          </StatusBar>
        </GroupBox>

        <GroupBox title="AppTopbar (đã hiện ở trên cùng)">
          <p class="muted">AppTopbar có nút theme toggle ở góc phải trên cùng. Có CSS class .app-drag để kéo cửa sổ trong shell desktop (Wails/Tauri/Electron).</p>
        </GroupBox>
      </section>
    </main>

    <!-- Global Context Menu (used by DataGrid + Overlay tab demos) -->
    <ContextMenu
      :show="ctxShow"
      :x="ctxX"
      :y="ctxY"
      :items="ctxItems"
      @close="ctxShow = false"
    />
  </div>
</template>

<style scoped>
.showcase {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.showcase-main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.grid {
  display: grid;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.grid.cols-2-equal {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 900px) {
  .grid.cols-2-equal {
    grid-template-columns: 1fr;
  }
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

.cols-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

@media (max-width: 700px) {
  .cols-2 { grid-template-columns: 1fr; }
}

.muted {
  color: var(--wx-text-muted);
  font-size: 12px;
}

.sep {
  color: var(--wx-border-default);
  margin: 0 4px;
}

.menu {
  display: flex;
  flex-direction: column;
  padding: 4px;
  min-width: 180px;
}

.menu-item {
  text-align: left;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: var(--wx-radius-sm);
  color: var(--wx-text-primary);
  font-size: 13px;
  cursor: pointer;
  font-family: var(--wx-font-primary);
}

.menu-item:hover {
  background: var(--wx-hover-bg);
}

.menu-item--danger {
  color: var(--wx-danger-text);
}

.menu-item--danger:hover {
  background: var(--wx-danger-bg);
}

/* ── Token swatches ── */
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
}

.swatch {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
}

.swatch-color {
  width: 32px;
  height: 32px;
  border-radius: var(--wx-radius-sm);
  border: 1px solid var(--wx-border-default);
  flex-shrink: 0;
}

.swatch-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.swatch-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-text-primary);
}

.swatch-name {
  font-size: 10px;
  color: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
}

/* ── Gradients ── */
.gradient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.gradient-card {
  height: 60px;
  border-radius: var(--wx-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* ── Spacing scale ── */
.space-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.space-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.space-name {
  font-family: var(--wx-font-mono);
  font-size: 11px;
  color: var(--wx-text-secondary);
  width: 110px;
  flex-shrink: 0;
}

.space-bar {
  height: 12px;
  background: linear-gradient(to right, #06b6d4, #2563eb);
  border-radius: 4px;
}

.space-value {
  color: var(--wx-text-muted);
  font-size: 11px;
  font-family: var(--wx-font-mono);
}

/* ── Type list ── */
.type-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-row {
  padding: 4px 0;
  border-bottom: 1px dashed var(--wx-border-subtle);
}

.type-row:last-child {
  border-bottom: none;
}

/* ── Placement grid (tooltip/dropdown) ── */
.placement-grid {
  display: grid;
  grid-template-columns: repeat(4, max-content);
  gap: 16px;
  padding: 32px;
  justify-content: center;
}

@media (max-width: 700px) {
  .placement-grid {
    grid-template-columns: repeat(2, max-content);
  }
}

/* ── Context menu target ── */
.ctx-target {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 2px dashed var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
  font-size: 13px;
  user-select: none;
  cursor: context-menu;
}

.ctx-target:hover {
  border-color: var(--wx-brand-primary);
  color: var(--wx-text-secondary);
}
</style>

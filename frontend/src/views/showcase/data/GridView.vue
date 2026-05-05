<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { BaseButton, GroupBox } from '../../../components/common'
import { DataGridPro, BulkActionBar } from '../../../components/data'
import type { DataGridDensity, SavedView } from '../../../components/data'
import { useToast } from '../../../composables/useToast'
import type { ColumnConfig } from '../../../types'

const router = useRouter()
const { showToast } = useToast()

const columns = ref<ColumnConfig[]>([
  { key: 'username', label: 'Tài khoản', visible: true, group: 'main', width: '160px', sortable: true },
  { key: 'email', label: 'Email', visible: true, group: 'main', width: '220px', sortable: true },
  { key: 'role', label: 'Vai trò', visible: true, group: 'main', width: '120px', sortable: true },
  { key: 'status', label: 'Trạng thái', visible: true, group: 'main', width: '120px', sortable: true },
  { key: 'cookie', label: 'Cookie', visible: true, group: 'main', width: '80px' },
  { key: 'token', label: 'Token', visible: true, group: 'main', width: '80px' },
  { key: 'lastLogin', label: 'Đăng nhập cuối', visible: true, group: 'main', width: '160px', sortable: true },
  { key: 'note', label: 'Ghi chú', visible: true, group: 'main', width: '200px' },
])

function generateRows(n: number) {
  const statuses = ['Live', 'Die', 'Checkpoint']
  const roles = ['Admin', 'Editor', 'Viewer', 'Guest']
  const out = []
  for (let i = 0; i < n; i++) {
    out.push({
      id: i + 1,
      username: `user${(i + 1).toString().padStart(4, '0')}`,
      email: `user${i + 1}@wemake.vn`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      cookie: i % 3 === 0 ? '✓' : '✗',
      token: i % 2 === 0 ? '✓' : '✗',
      lastLogin: `2026-05-${((i % 28) + 1).toString().padStart(2, '0')}`,
      note: i % 5 === 0 ? 'Khách VIP' : '',
    })
  }
  return out
}

const rows = ref(generateRows(500))
const selected = ref<Set<string | number>>(new Set())
const density = ref<DataGridDensity>('md')
const savedViews = ref<SavedView[]>([])

function regenerate(n: number) {
  rows.value = generateRows(n)
  selected.value = new Set()
  showToast('success', `Đã tạo ${n.toLocaleString('vi-VN')} dòng`)
}

function onCellEdit(row: Record<string, unknown>, col: string, oldVal: unknown, newVal: unknown) {
  // Apply edit to the actual data
  const r = rows.value.find((x) => x.id === row.id)
  if (r) (r as Record<string, unknown>)[col] = newVal
  showToast('success', `Đã sửa ${col}: "${oldVal}" → "${newVal}"`)
}

function onSaveView(view: Omit<SavedView, 'id'>) {
  savedViews.value.push({ ...view, id: 'v' + Date.now() })
  showToast('success', `Đã lưu view "${view.name}"`)
}

function onApplyView(view: SavedView) {
  showToast('info', `Áp dụng view "${view.name}"`)
}

function onExport(format: 'csv' | 'json', exportRows: Record<string, unknown>[]) {
  showToast('success', `Đã xuất ${exportRows.length} dòng (${format.toUpperCase()})`)
}

function bulkDelete() {
  rows.value = rows.value.filter((r) => !selected.value.has(r.id))
  showToast('success', `Đã xoá ${selected.value.size} dòng`)
  selected.value = new Set()
}

function bulkExport() {
  showToast('info', `Đang xuất ${selected.value.size} dòng đã chọn`)
}

const selectedCount = computed(() => selected.value.size)
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · DataGridPro" subtitle="Phase 4 — data display" />
    <main class="main">
      <PageHeader title="DataGridPro" description="Bảng dữ liệu nâng cao đầy đủ feature: sort, virtual scroll, resize, pin, reorder, multi-select, inline edit, saved views, export.">
        <template #actions>
          <button class="back-btn" @click="router.push('/showcase/data')">← Phase 4</button>
        </template>
      </PageHeader>

      <GroupBox title="Tạo dữ liệu test">
        <div class="row">
          <BaseButton size="sm" @click="regenerate(50)">50 dòng</BaseButton>
          <BaseButton size="sm" @click="regenerate(500)">500 dòng</BaseButton>
          <BaseButton size="sm" @click="regenerate(2000)">2k dòng (virtual)</BaseButton>
          <BaseButton size="sm" @click="regenerate(10000)">10k dòng (stress test)</BaseButton>
          <span class="muted">Hiện có: <b>{{ rows.length.toLocaleString('vi-VN') }}</b> dòng</span>
        </div>
      </GroupBox>

      <GroupBox title="DataGridPro (full features)">
        <div class="muted" style="margin-bottom: 8px;">
          <b>Tính năng:</b> sort (click header) · resize (kéo cạnh phải) · reorder (kéo header) · pin (⋮) · multi-select (checkbox) · inline edit (dblclick cell) · density toggle · saved views · export CSV/JSON
        </div>
        <div style="height: 560px;">
          <DataGridPro
            :columns="columns"
            :rows="rows"
            :selected="selected"
            :density="density"
            :saved-views="savedViews"
            resizable
            pinnable
            reorderable
            inline-edit
            striped
            @update:selected="(s) => selected = s"
            @update:density="(d) => density = d"
            @update:columns="(c) => columns = c"
            @cell-edit="onCellEdit"
            @save-view="onSaveView"
            @apply-view="onApplyView"
            @export="onExport"
          />
        </div>
      </GroupBox>
    </main>

    <BulkActionBar :count="selectedCount" :show="selectedCount > 0" @clear="selected = new Set()">
      <BaseButton size="sm" variant="secondary" @click="bulkExport">Xuất</BaseButton>
      <BaseButton size="sm" variant="danger" @click="bulkDelete">Xoá</BaseButton>
    </BulkActionBar>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.row { display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center; }
.muted { color: var(--wx-text-muted); font-size: 12px; }
.muted b { color: var(--wx-brand-primary); }
.back-btn {
  padding: 6px 12px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  cursor: pointer;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-secondary);
}
.back-btn:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
</style>

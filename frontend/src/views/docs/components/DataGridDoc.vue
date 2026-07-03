<script setup lang="ts">
import { ref } from 'vue'
import { DataGridPro } from '../../../components/data'
import { BaseBadge, BaseButton } from '../../../components/common'
import type { ColumnConfig } from '../../../types/ui'
import type { DataGridDensity } from '../../../components/data'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

/* ── Demo data ─────────────────────────────────────── */
const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true, group: 'Chung', width: '70px', sortable: true },
  { key: 'name', label: 'Tên', visible: true, group: 'Chung', sortable: true },
  { key: 'email', label: 'Email', visible: true, group: 'Chung' },
  { key: 'role', label: 'Vai trò', visible: true, group: 'Chung' },
]

const rows: Record<string, unknown>[] = [
  { id: 1, name: 'Nguyễn An', email: 'an@wemake.vn', role: 'Admin' },
  { id: 2, name: 'Trần Bình', email: 'binh@wemake.vn', role: 'Editor' },
  { id: 3, name: 'Lê Cường', email: 'cuong@wemake.vn', role: 'Viewer' },
  { id: 4, name: 'Phạm Dung', email: 'dung@wemake.vn', role: 'Editor' },
  { id: 5, name: 'Vũ Em', email: 'em@wemake.vn', role: 'Viewer' },
]

/* ── Selection ─────────────────────────────────────── */
const selected = ref<Set<string | number>>(new Set())

/* ── Density ───────────────────────────────────────── */
const density = ref<DataGridDensity>('md')

/* ── Status slot demo ──────────────────────────────── */
const statusColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true, group: 'Chung', width: '70px' },
  { key: 'name', label: 'Tên', visible: true, group: 'Chung' },
  { key: 'status', label: 'Trạng thái', visible: true, group: 'Chung' },
]

const statusRows: Record<string, unknown>[] = [
  { id: 1, name: 'Nguyễn An', status: 'active' },
  { id: 2, name: 'Trần Bình', status: 'pending' },
  { id: 3, name: 'Lê Cường', status: 'blocked' },
  { id: 4, name: 'Phạm Dung', status: 'active' },
  { id: 5, name: 'Vũ Em', status: 'pending' },
]

const statusMeta: Record<string, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  active: { variant: 'success', label: 'Hoạt động' },
  pending: { variant: 'warning', label: 'Chờ duyệt' },
  blocked: { variant: 'danger', label: 'Bị khoá' },
}

/* ── Code strings ──────────────────────────────────── */
const basicCode = `<script setup lang="ts">
import { DataGridPro } from '@wemake/ui'
import type { ColumnConfig } from '@wemake/ui'

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true, group: 'Chung', width: '70px', sortable: true },
  { key: 'name', label: 'Tên', visible: true, group: 'Chung', sortable: true },
  { key: 'email', label: 'Email', visible: true, group: 'Chung' },
  { key: 'role', label: 'Vai trò', visible: true, group: 'Chung' },
]

const rows: Record<string, unknown>[] = [
  { id: 1, name: 'Nguyễn An', email: 'an@wemake.vn', role: 'Admin' },
  { id: 2, name: 'Trần Bình', email: 'binh@wemake.vn', role: 'Editor' },
  { id: 3, name: 'Lê Cường', email: 'cuong@wemake.vn', role: 'Viewer' },
  { id: 4, name: 'Phạm Dung', email: 'dung@wemake.vn', role: 'Editor' },
  { id: 5, name: 'Vũ Em', email: 'em@wemake.vn', role: 'Viewer' },
]
<\/script>

<template>
  <div style="height:320px">
    <DataGridPro :columns="columns" :rows="rows" />
  </div>
<\/template>`

const selectionCode = `<script setup lang="ts">
import { ref } from 'vue'
import { DataGridPro } from '@wemake/ui'

const selected = ref<Set<string | number>>(new Set())
<\/script>

<template>
  <p>Đã chọn: {{ selected.size }} dòng</p>
  <div style="height:320px">
    <DataGridPro
      :columns="columns"
      :rows="rows"
      :selected="selected"
      @update:selected="selected = $event"
    />
  </div>
<\/template>`

const densityCode = `<script setup lang="ts">
import { ref } from 'vue'
import { DataGridPro, BaseButton } from '@wemake/ui'
import type { DataGridDensity } from '@wemake/ui'

const density = ref<DataGridDensity>('md')
<\/script>

<template>
  <div class="row">
    <BaseButton
      v-for="d in (['sm', 'md', 'lg'] as DataGridDensity[])"
      :key="d"
      :variant="density === d ? 'primary' : 'secondary'"
      size="sm"
      @click="density = d"
    >{{ d }}</BaseButton>
  </div>
  <div style="height:320px">
    <DataGridPro
      :columns="columns"
      :rows="rows"
      :density="density"
      @update:density="density = $event"
    />
  </div>
<\/template>`

const slotCode = `<script setup lang="ts">
import { DataGridPro, BaseBadge } from '@wemake/ui'
import type { ColumnConfig } from '@wemake/ui'

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true, group: 'Chung', width: '70px' },
  { key: 'name', label: 'Tên', visible: true, group: 'Chung' },
  { key: 'status', label: 'Trạng thái', visible: true, group: 'Chung' },
]

const rows: Record<string, unknown>[] = [
  { id: 1, name: 'Nguyễn An', status: 'active' },
  { id: 2, name: 'Trần Bình', status: 'pending' },
  { id: 3, name: 'Lê Cường', status: 'blocked' },
]

const statusMeta: Record<string, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  active: { variant: 'success', label: 'Hoạt động' },
  pending: { variant: 'warning', label: 'Chờ duyệt' },
  blocked: { variant: 'danger', label: 'Bị khoá' },
}
<\/script>

<template>
  <div style="height:320px">
    <DataGridPro :columns="columns" :rows="rows">
      <template #cell-status="{ value }">
        <BaseBadge
          :variant="statusMeta[String(value)].variant"
          :text="statusMeta[String(value)].label"
          size="sm"
        />
      </template>
    </DataGridPro>
  </div>
<\/template>`

/* ── Reference tables ──────────────────────────────── */
const props: PropRow[] = [
  { name: 'columns', type: 'ColumnConfig[]', desc: 'Định nghĩa cột. Mỗi cột cần key/label/visible/group; width/align/sortable tuỳ chọn.' },
  { name: 'rows', type: 'Record<string, unknown>[]', desc: 'Dữ liệu dòng. Mỗi dòng truy cập theo column.key.' },
  { name: 'rowKey', type: 'string', default: "'id'", desc: 'Trường dùng làm khoá định danh dòng (cho selection / v-for key).' },
  { name: 'selected', type: 'Set<string | number>', desc: 'Tập id dòng đang chọn (controlled qua update:selected).' },
  { name: 'density', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Mật độ dòng — chi phối chiều cao dòng (32 / 40 / 48px).' },
  { name: 'virtual', type: "boolean | 'auto'", default: "'auto'", desc: "Virtual scroll. 'auto' bật khi > 100 dòng." },
  { name: 'resizable', type: 'boolean', default: 'true', desc: 'Cho phép kéo viền để thay đổi độ rộng cột.' },
  { name: 'pinnable', type: 'boolean', default: 'false', desc: 'Hiện menu cột để ghim trái/phải và ẩn cột.' },
  { name: 'reorderable', type: 'boolean', default: 'false', desc: 'Cho phép kéo-thả để sắp xếp lại thứ tự cột.' },
  { name: 'inlineEdit', type: 'boolean', default: 'false', desc: 'Cho phép double-click ô để sửa trực tiếp (phát cell-edit).' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Hiện trạng thái đang tải thay cho bảng.' },
  { name: 'savedViews', type: 'SavedView[]', default: '[]', desc: 'Danh sách view đã lưu để chọn nhanh trên toolbar.' },
  { name: 'bordered', type: 'boolean', default: 'true', desc: 'Kẻ viền dọc giữa các ô.' },
  { name: 'striped', type: 'boolean', default: 'false', desc: 'Tô nền xen kẽ các dòng chẵn.' },
]

const emits: PropRow[] = [
  { name: 'update:selected', type: '(ids: Set<string | number>) => void', desc: 'Phát khi tập dòng chọn thay đổi.' },
  { name: 'update:density', type: "(d: 'sm' | 'md' | 'lg') => void", desc: 'Phát khi đổi mật độ trên toolbar.' },
  { name: 'update:columns', type: '(cols: ColumnConfig[]) => void', desc: 'Phát khi reorder / ẩn-hiện cột.' },
  { name: 'cell-edit', type: '(row, col: string, oldVal, newVal) => void', desc: 'Phát khi sửa ô inline và giá trị thay đổi.' },
  { name: 'sort', type: "(col: string, dir: 'asc' | 'desc') => void", desc: 'Phát khi click header cột sortable.' },
  { name: 'save-view', type: "(view: Omit<SavedView, 'id'>) => void", desc: 'Phát khi người dùng lưu view hiện tại.' },
  { name: 'apply-view', type: '(view: SavedView) => void', desc: 'Phát khi áp dụng một view đã lưu.' },
  { name: 'export', type: "(format: 'csv' | 'json', rows) => void", desc: 'Phát khi xuất CSV/JSON từ toolbar.' },
]

const slots: PropRow[] = [
  { name: 'cell-{colKey}', type: '{ row, value, col, rowIndex }', desc: 'Tuỳ biến nội dung ô của một cột (vd #cell-status). Fallback: slot cell chung rồi text mặc định.' },
]
</script>

<template>
  <DocPage
    name="DataGridPro"
    category="Dữ liệu"
    description="Bảng dữ liệu nâng cao — chọn dòng, sắp xếp, đổi mật độ, resize/ghim/ẩn cột, inline edit, saved views, export CSV/JSON, virtual scroll và slot tuỳ biến từng ô."
    :imports="['DataGridPro']"
  >
    <h2>Cơ bản</h2>
    <p>Truyền <code class="inline">columns</code> (mỗi cột cần <code class="inline">key</code>, <code class="inline">label</code>, <code class="inline">visible</code>, <code class="inline">group</code>) và <code class="inline">rows</code>. Grid chiếm toàn bộ chiều cao container nên hãy bọc trong khối có chiều cao cố định.</p>
    <DemoBlock :code="basicCode">
      <div style="height:320px">
        <DataGridPro :columns="columns" :rows="rows" />
      </div>
    </DemoBlock>

    <h2>Chọn dòng (selection)</h2>
    <p>Bind <code class="inline">:selected</code> với một <code class="inline">ref(new Set())</code> và lắng nghe <code class="inline">@update:selected</code> để kiểm soát tập dòng đang chọn.</p>
    <DemoBlock :code="selectionCode">
      <p>Đã chọn: {{ selected.size }} dòng</p>
      <div style="height:320px">
        <DataGridPro
          :columns="columns"
          :rows="rows"
          :selected="selected"
          @update:selected="selected = $event"
        />
      </div>
    </DemoBlock>

    <h2>Mật độ (density)</h2>
    <p>Đổi <code class="inline">density</code> giữa <code class="inline">sm</code> / <code class="inline">md</code> / <code class="inline">lg</code>. Toolbar của grid cũng phát <code class="inline">@update:density</code> khi người dùng đổi từ bên trong.</p>
    <DemoBlock :code="densityCode">
      <div class="row">
        <BaseButton
          v-for="d in (['sm', 'md', 'lg'] as DataGridDensity[])"
          :key="d"
          :variant="density === d ? 'primary' : 'secondary'"
          size="sm"
          @click="density = d"
        >{{ d }}</BaseButton>
      </div>
      <div style="height:320px">
        <DataGridPro
          :columns="columns"
          :rows="rows"
          :density="density"
          @update:density="density = $event"
        />
      </div>
    </DemoBlock>

    <h2>Ô tuỳ biến (slot cell-*)</h2>
    <p>Dùng slot <code class="inline">#cell-&lt;key&gt;</code> để render tuỳ biến nội dung ô — ví dụ một <code class="inline">BaseBadge</code> trạng thái thay cho text thô. Slot nhận <code class="inline">{ row, value, col, rowIndex }</code>.</p>
    <DemoBlock :code="slotCode">
      <div style="height:320px">
        <DataGridPro :columns="statusColumns" :rows="statusRows">
          <template #cell-status="{ value }">
            <BaseBadge
              :variant="statusMeta[String(value)].variant"
              :text="statusMeta[String(value)].label"
              size="sm"
            />
          </template>
        </DataGridPro>
      </div>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />

    <h2>Sự kiện</h2>
    <PropsTable :rows="emits" name-label="Event" hide-default />

    <h2>Slots</h2>
    <PropsTable :rows="slots" name-label="Slot" hide-default />
  </DocPage>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
</style>

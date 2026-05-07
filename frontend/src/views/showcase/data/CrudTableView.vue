<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { GroupBox } from '../../../components/common'
import CrudPage from '../../../archetypes/crud/CrudPage.vue'
import StatusChip from '../../../components/common/StatusChip.vue'
import type { CrudPageConfig } from '../../../schemas/crud.schema'
import { useToast } from '../../../composables/useToast'

const { showToast } = useToast()

/* ── Demo data ── */
type Employee = {
  id: number
  name: string
  email: string
  department: string
  role: string
  status: string
  salary: number
  joinDate: string
}

function makeEmployees(n: number): Employee[] {
  const deps = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR']
  const roles = ['Senior', 'Junior', 'Lead', 'Manager', 'Intern']
  const statuses = ['active', 'inactive', 'pending']
  const firstNames = ['Nguyễn Văn', 'Trần Thị', 'Lê Minh', 'Phạm Anh', 'Hoàng Thu', 'Đặng Quốc', 'Bùi Thị', 'Vũ Đức']
  const lastNames = ['An', 'Bình', 'Cường', 'Dung', 'Em', 'Phong', 'Giang', 'Hoa']
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `user${(i + 1).toString().padStart(3, '0')}@company.vn`,
    department: deps[i % deps.length],
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    salary: 8_000_000 + (i % 8) * 2_500_000,
    joinDate: `${2020 + (i % 5)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
  }))
}

const STATUS_MAP = {
  active:   { variant: 'success' as const, label: 'Hoạt động',   dot: true },
  inactive: { variant: 'neutral' as const, label: 'Tạm nghỉ',    dot: true },
  pending:  { variant: 'warning' as const, label: 'Chờ duyệt',   dot: true },
}

const DEP_OPTIONS = [
  { value: '', label: 'Tất cả phòng ban' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'HR' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm nghỉ' },
  { value: 'pending', label: 'Chờ duyệt' },
]

const crudConfig: CrudPageConfig<Employee> = {
  entity: 'employee',
  label: { singular: 'nhân viên', plural: 'nhân viên' },
  searchPlaceholder: 'Tìm tên, email...',
  searchFields: ['name', 'email', 'department', 'role'],
  pageSize: 10,
  initialData: () => makeEmployees(32),
  filters: [
    {
      key: 'department',
      defaultValue: '',
      options: DEP_OPTIONS,
      match: (row, val) => !val || row['department'] === val,
    },
    {
      key: 'status',
      defaultValue: '',
      options: STATUS_OPTIONS,
      match: (row, val) => !val || row['status'] === val,
    },
  ],
  columns: [
    { key: 'stt',        label: 'STT',        width: '56px'  },
    { key: 'name',       label: 'Họ tên',     width: '200px' },
    { key: 'email',      label: 'Email'                      },
    { key: 'department', label: 'Phòng ban',  width: '140px' },
    { key: 'role',       label: 'Vai trò',    width: '110px' },
    { key: 'salary',     label: 'Lương',      width: '130px', align: 'right' },
    { key: 'status',     label: 'Trạng thái', width: '140px' },
    { key: 'joinDate',   label: 'Ngày vào',   width: '110px' },
  ],
  addForm: {
    title: 'Thêm nhân viên mới',
    fields: [
      { key: 'name',       label: 'Họ tên',    type: 'text',   placeholder: 'Nguyễn Văn A', required: true },
      { key: 'email',      label: 'Email',     type: 'email',  placeholder: 'email@company.vn', required: true },
      { key: 'department', label: 'Phòng ban', type: 'select', options: DEP_OPTIONS.slice(1) },
      { key: 'role',       label: 'Vai trò',   type: 'text',   placeholder: 'Senior / Junior...' },
      { key: 'salary',     label: 'Lương (đ)', type: 'text',   placeholder: '10000000' },
    ],
    initialValues: () => ({ name: '', email: '', department: 'Engineering', role: 'Junior', salary: '10000000' }),
    build: (f) => ({
      id: Date.now(),
      name: f.name as string,
      email: f.email as string,
      department: f.department as string,
      role: f.role as string,
      status: 'pending',
      salary: Number(f.salary) || 10_000_000,
      joinDate: new Date().toISOString().slice(0, 10),
    }),
  },
  editForm: {
    title: 'Chỉnh sửa nhân viên',
    fields: [
      { key: 'name',       label: 'Họ tên',    type: 'text'   },
      { key: 'email',      label: 'Email',     type: 'email'  },
      { key: 'department', label: 'Phòng ban', type: 'select', options: DEP_OPTIONS.slice(1) },
      { key: 'role',       label: 'Vai trò',   type: 'text'   },
      { key: 'salary',     label: 'Lương (đ)', type: 'text'   },
    ],
    fillMap: (_key, val) => val,
    apply: (original, f) => ({ ...original, ...f, salary: Number(f.salary) || original.salary }),
  },
  delete: {
    confirmTitle: 'Xoá nhân viên?',
    confirmDescription: (r) => `Nhân viên "${r.name}" sẽ bị xoá vĩnh viễn.`,
    bulkConfirmTitle: 'Xoá nhiều nhân viên?',
  },
  detail: {
    titleKey: 'name',
    sections: [
      {
        title: 'Thông tin cơ bản',
        fields: [
          { key: 'email',      label: 'Email' },
          { key: 'department', label: 'Phòng ban' },
          { key: 'role',       label: 'Vai trò' },
          { key: 'joinDate',   label: 'Ngày vào làm' },
        ],
      },
      {
        title: 'Lương & Trạng thái',
        fields: [
          { key: 'salary', label: 'Mức lương', format: (v) => Number(v).toLocaleString('vi-VN') + 'đ' },
          { key: 'status', label: 'Trạng thái' },
        ],
      },
    ],
  },
  handlers: {
    onAdd:    async (r) => showToast('success', `Đã thêm: ${r.name}`),
    onEdit:   async (r) => showToast('success', `Đã cập nhật: ${r.name}`),
    onDelete: async () => showToast('success', 'Đã xoá nhân viên'),
  },
}

/* ── Density control ── */
type Density = 'compact' | 'normal' | 'comfortable'
const density = ref<Density>('normal')
const densityMap: Record<Density, { td: string; th: string }> = {
  compact:     { td: '8px 12px',  th: '8px 12px'  },
  normal:      { td: '12px 16px', th: '12px 16px' },
  comfortable: { td: '16px 20px', th: '16px 20px' },
}
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="data · crud-table" />

    <main class="main">
      <PageHeader
        title="CrudPage — Data Table"
        description="Bảng dữ liệu config-driven: sort, search, filter, CRUD đầy đủ, pagination, bulk actions, detail drawer."
        padded
      />

      <!-- ── Density control ── -->
      <GroupBox title="Density">
        <div class="density-row">
          <button
            v-for="d in (['compact', 'normal', 'comfortable'] as Density[])"
            :key="d"
            class="density-btn"
            :class="{ 'density-btn--active': density === d }"
            @click="density = d"
          >{{ d }}</button>
        </div>
        <p class="density-note">
          Padding ô: <code>{{ densityMap[density].td }}</code>
        </p>
      </GroupBox>

      <!-- ── Demo table ── -->
      <div
        class="table-wrap"
        :style="{
          '--demo-cell-pad': densityMap[density].td,
          '--demo-head-pad': densityMap[density].th,
        }"
      >
        <CrudPage :config="crudConfig">
          <!-- STT -->
          <template #cell-stt="{ index }">
            <span class="cell-stt">{{ index }}</span>
          </template>

          <!-- Họ tên -->
          <template #cell-name="{ row }">
            <span class="cell-name">{{ (row as Employee).name }}</span>
          </template>

          <!-- Email -->
          <template #cell-email="{ row }">
            <span class="cell-email">{{ (row as Employee).email }}</span>
          </template>

          <!-- Phòng ban -->
          <template #cell-department="{ row }">
            <span class="cell-dep">{{ (row as Employee).department }}</span>
          </template>

          <!-- Lương -->
          <template #cell-salary="{ row }">
            <span class="cell-salary">{{ (row as Employee).salary.toLocaleString('vi-VN') }}đ</span>
          </template>

          <!-- Trạng thái -->
          <template #cell-status="{ row }">
            <StatusChip :status="(row as Employee).status" :map="STATUS_MAP" />
          </template>
        </CrudPage>
      </div>

      <!-- ── Anatomy notes ── -->
      <GroupBox title="Anatomy — CrudPage">
        <div class="anatomy-grid">
          <div class="anatomy-item">
            <span class="anatomy-label">Config</span>
            <span class="anatomy-desc">Khai báo columns, filters, addForm, editForm, delete, detail qua 1 object duy nhất</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-label">Slots</span>
            <span class="anatomy-desc"><code>#cell-{key}</code> — custom render từng ô. <code>#detail-header</code>, <code>#detail-body</code>, <code>#detail-extra</code> — tùy biến drawer</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-label">Search</span>
            <span class="anatomy-desc">Tìm kiếm theo <code>searchFields</code> — client-side, reactive</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-label">Filters</span>
            <span class="anatomy-desc">Dropdown filter theo key — AND logic giữa các filter</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-label">Density</span>
            <span class="anatomy-desc">Override <code>--demo-cell-pad</code> CSS var để điều chỉnh mật độ hàng</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-label">Pagination</span>
            <span class="anatomy-desc">Auto hiện khi rows > <code>pageSize</code>. Mặc định 20, demo này 10</span>
          </div>
        </div>
      </GroupBox>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
  font-family: var(--wx-font-primary);
}
.main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--wx-space-5) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

/* ── Density ── */
.density-row {
  display: flex;
  gap: var(--wx-space-2);
  flex-wrap: wrap;
}
.density-btn {
  padding: 6px 14px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
  cursor: pointer;
  transition: all 120ms ease;
  text-transform: capitalize;
}
.density-btn:hover { border-color: var(--wx-brand-primary); color: var(--wx-brand-primary); }
.density-btn--active {
  background: var(--wx-brand-primary);
  border-color: var(--wx-brand-primary);
  color: #fff;
}
.density-note {
  margin: var(--wx-space-2) 0 0;
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
}
.density-note code {
  font-family: var(--wx-font-mono);
  background: var(--wx-surface-sunken);
  padding: 1px 5px;
  border-radius: var(--wx-radius-sm);
}

/* ── Table wrap — apply density via CSS var override ── */
.table-wrap :deep(.crud-table th) { padding: var(--demo-head-pad, 12px 16px); }
.table-wrap :deep(.crud-table td) { padding: var(--demo-cell-pad, 12px 16px); }

/* ── Cell styles ── */
.cell-stt   { font-size: var(--wx-fs-12); color: var(--wx-text-muted); font-variant-numeric: tabular-nums; }
.cell-name  { font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); white-space: nowrap; }
.cell-email { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.cell-dep   { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); white-space: nowrap; }
.cell-salary {
  font-weight: var(--wx-fw-semibold);
  font-variant-numeric: tabular-nums;
  color: var(--wx-text-primary);
  white-space: nowrap;
}

/* ── Anatomy ── */
.anatomy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--wx-space-3);
}
.anatomy-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
}
.anatomy-label {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-brand-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.anatomy-desc {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  line-height: 1.5;
}
.anatomy-desc code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-11);
  background: color-mix(in srgb, var(--wx-brand-primary) 10%, transparent);
  color: var(--wx-brand-primary);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>

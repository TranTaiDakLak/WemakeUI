<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton, BaseInput, BaseSelectMenu, FormField, BaseModal } from '../../components/common'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

const showEdit    = ref(false)
const showConfirm = ref(false)
const showCode    = ref(false)
const saving      = ref(false)
const deleting    = ref(false)

const editName     = ref('')
const editPrice    = ref('')
const editCategory = ref('')
const editStock    = ref('')
const editId       = ref<number | null>(null)

const catOpts = [
  { value: 'laptop',  label: 'Laptop' },
  { value: 'phone',   label: 'Điện thoại' },
  { value: 'tablet',  label: 'Máy tính bảng' },
  { value: 'audio',   label: 'Âm thanh' },
]

const products = ref<Product[]>([
  { id: 1, name: 'MacBook Pro 14"',    price: 52_000_000, category: 'laptop',  stock: 12 },
  { id: 2, name: 'iPhone 15 Pro',       price: 31_000_000, category: 'phone',   stock: 45 },
  { id: 3, name: 'iPad Air M2',         price: 19_000_000, category: 'tablet',  stock: 8 },
  { id: 4, name: 'AirPods Pro 2',       price: 7_000_000,  category: 'audio',   stock: 60 },
])

function openEdit(p: Product) {
  editId.value       = p.id
  editName.value     = p.name
  editPrice.value    = String(p.price)
  editCategory.value = p.category
  editStock.value    = String(p.stock)
  showEdit.value     = true
}

function saveEdit() {
  if (!editId.value) return
  saving.value = true
  setTimeout(() => {
    const idx = products.value.findIndex(p => p.id === editId.value)
    if (idx >= 0) {
      products.value[idx] = {
        id: editId.value!,
        name: editName.value,
        price: Number(editPrice.value),
        category: editCategory.value,
        stock: Number(editStock.value),
      }
    }
    saving.value = false
    showEdit.value = false
  }, 600)
}

function confirmDelete() {
  showEdit.value = false
  showConfirm.value = true
}

function doDelete() {
  if (!editId.value) return
  deleting.value = true
  setTimeout(() => {
    products.value = products.value.filter(p => p.id !== editId.value)
    deleting.value = false
    showConfirm.value = false
  }, 500)
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + '₫'
}
function catLabel(v: string) {
  return catOpts.find(o => o.value === v)?.label ?? v
}
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — edit modal" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Edit Modal Form</h1>
        <p class="fp__desc">
          Click vào hàng để mở modal chỉnh sửa với dữ liệu đã điền sẵn. Gồm nút Xóa với confirm dialog riêng.
        </p>
      </div>

      <!-- Table card -->
      <div class="fp__card">
        <p class="fp__card-title">Sản phẩm — click hàng để chỉnh sửa</p>
        <div class="em-table-wrap">
          <table class="em-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.id" class="em-row" @click="openEdit(p)">
                <td class="em-td--name">{{ p.name }}</td>
                <td><span class="em-badge">{{ catLabel(p.category) }}</span></td>
                <td class="em-td--num">{{ fmt(p.price) }}</td>
                <td class="em-td--num">{{ p.stock }}</td>
                <td class="em-td--action">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Edit modal -->
      <BaseModal :show="showEdit" title="Chỉnh sửa sản phẩm" :show-save="true"
        save-label="Lưu thay đổi" :loading="saving"
        @close="showEdit = false" @save="saveEdit">
        <div class="em-form">
          <FormField label="Tên sản phẩm" required>
            <BaseInput v-model="editName" />
          </FormField>
          <div class="em-row">
            <FormField label="Giá (₫)" required>
              <BaseInput v-model="editPrice" type="number" />
            </FormField>
            <FormField label="Tồn kho" required>
              <BaseInput v-model="editStock" type="number" />
            </FormField>
          </div>
          <FormField label="Danh mục">
            <BaseSelectMenu v-model="editCategory" :options="catOpts" />
          </FormField>
          <div class="em-danger-zone">
            <BaseButton variant="ghost" size="sm" @click="confirmDelete">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:4px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Xóa sản phẩm
            </BaseButton>
          </div>
        </div>
      </BaseModal>

      <!-- Delete confirm modal -->
      <BaseModal :show="showConfirm" title="Xác nhận xóa" size="sm"
        @close="showConfirm = false">
        <div class="em-confirm">
          <div class="em-confirm-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p class="em-confirm-text">Bạn có chắc muốn xóa <strong>{{ editName }}</strong>?<br>Hành động này không thể hoàn tác.</p>
          <div class="em-confirm-actions">
            <BaseButton variant="ghost" size="sm" @click="showConfirm = false">Hủy</BaseButton>
            <BaseButton size="sm" :loading="deleting" @click="doDelete">Xóa</BaseButton>
          </div>
        </div>
      </BaseModal>

      <!-- How it works -->
      <div class="fp__card fp__card--info">
        <p class="fp__card-title">Cách hoạt động</p>
        <ul class="fp__list">
          <li>Click hàng → <code>openEdit(p)</code> pre-populate refs từ object → <code>showEdit = true</code></li>
          <li>Nút "Xóa" trong modal: đóng modal edit, mở confirm dialog riêng</li>
          <li>Confirm dialog là BaseModal size="sm" — không cần component ConfirmDialog riêng</li>
          <li>2 loading states riêng biệt: <code>saving</code> cho edit, <code>deleting</code> cho xóa</li>
        </ul>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>// Pre-populate on row click
function openEdit(p: Product) {
  editId.value    = p.id
  editName.value  = p.name
  editPrice.value = String(p.price)
  showEdit.value  = true
}

// Confirm delete pattern (no extra component needed)
function confirmDelete() {
  showEdit.value    = false  // close edit modal first
  showConfirm.value = true   // then show confirm
}

&lt;!-- Two modals stacked (BaseModal handles z-index) --&gt;
&lt;BaseModal :show="showEdit"    title="Chỉnh sửa" :show-save="true" @save="saveEdit" ... /&gt;
&lt;BaseModal :show="showConfirm" title="Xác nhận xóa" size="sm" ... /&gt;</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseModal','BaseInput','BaseSelect','FormField','BaseButton']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['EditModal','ConfirmDelete','PrePopulate','CRUDUpdate']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 900px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc  { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); line-height: 1.6; }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__card--info { background: color-mix(in srgb, var(--wx-brand-primary) 5%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, var(--wx-brand-primary) 20%, transparent); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.fp__list li { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); line-height: 1.5; }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }

/* Table */
.em-table-wrap { overflow-x: auto; border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); }
.em-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.em-table th { padding: 10px 14px; text-align: left; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .5px; color: var(--wx-text-muted); border-bottom: 1px solid var(--wx-border-subtle); background: var(--wx-surface-sunken); white-space: nowrap; }
.em-table td { padding: 12px 14px; border-bottom: 1px solid var(--wx-border-subtle); color: var(--wx-text-primary); }
.em-table tbody tr:last-child td { border-bottom: none; }
.em-row { cursor: pointer; }
.em-row:hover td { background: color-mix(in srgb, var(--wx-brand-primary) 4%, transparent); }
.em-td--name { font-weight: var(--wx-fw-medium); }
.em-td--num  { color: var(--wx-text-secondary); }
.em-td--action { width: 40px; color: var(--wx-text-muted); }
.em-row:hover .em-td--action { color: var(--wx-brand-primary); }
.em-badge { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 11px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); }

/* Modal form */
.em-form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.em-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
@media (max-width: 560px) { .em-row { grid-template-columns: 1fr; } }
.em-danger-zone { padding-top: var(--wx-space-3); border-top: 1px solid var(--wx-border-subtle); }

/* Confirm dialog */
.em-confirm { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-3); text-align: center; padding: var(--wx-space-2) 0; }
.em-confirm-icon { color: #f59e0b; }
.em-confirm-text { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); line-height: 1.6; }
.em-confirm-actions { display: flex; gap: var(--wx-space-2); }
</style>

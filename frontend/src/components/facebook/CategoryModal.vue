<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'
import { useCategoriesStore } from '../../stores/categories'
import { useAccountsStore } from '../../stores/accounts'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()
const categoriesStore = useCategoriesStore()
const accountsStore = useAccountsStore()

/* ─── Per-category account stats ─── */
function categoryStats(catId: number) {
  const accs = accountsStore.accounts.filter(a => a.categoryId === catId && !a.isDeleted)
  const total = accs.length
  const live = accs.filter(a => a.status === 'Live').length
  const cp = accs.filter(a => a.status === 'Checkpoint' || a.status === 'Die').length
  const trash = accountsStore.accounts.filter(a => a.categoryId === catId && a.isDeleted).length
  return { total, live, cp, unknown: total - live - cp, trash }
}

/* ─── Selection (highlight + checkbox) ─── */
const highlightedIds = ref<Set<number>>(new Set())
const chosenIds = ref<Set<number>>(new Set())
const countHighlight = computed(() => highlightedIds.value.size)
const countSelect = computed(() => chosenIds.value.size)

function toggleChosen(id: number) {
  const s = new Set(chosenIds.value)
  if (s.has(id)) s.delete(id); else s.add(id)
  chosenIds.value = s
}

function onRowClick(id: number, e: MouseEvent) {
  if ((e.target as HTMLElement).tagName === 'INPUT') return
  if (e.ctrlKey) {
    const s = new Set(highlightedIds.value)
    if (s.has(id)) s.delete(id); else s.add(id)
    highlightedIds.value = s
  } else {
    highlightedIds.value = new Set([id])
  }
}

function selectAll() { chosenIds.value = new Set(categoriesStore.sortedCategories.map(c => c.id)) }
function unselectAll() { chosenIds.value = new Set() }

/* ─── Inline add ─── */
const showAddInput = ref(false)
const newCategoryName = ref('')
const addInputRef = ref<HTMLInputElement>()

async function startAdd() {
  showAddInput.value = true
  newCategoryName.value = ''
  await nextTick()
  addInputRef.value?.focus()
}

function confirmAdd() {
  const name = newCategoryName.value.trim()
  if (!name) { showAddInput.value = false; return }
  categoriesStore.addCategory(name)
  showToast('success', `Đã thêm thư mục "${name}"`)
  showAddInput.value = false
  newCategoryName.value = ''
}

function cancelAdd() {
  showAddInput.value = false
  newCategoryName.value = ''
}

/* ─── Inline rename ─── */
const editingId = ref<number | null>(null)
const editingName = ref('')
const editInputRef = ref<HTMLInputElement>()

async function startEdit(id: number, name: string) {
  editingId.value = id
  editingName.value = name
  await nextTick()
  editInputRef.value?.focus()
  editInputRef.value?.select()
}

function confirmEdit() {
  if (editingId.value === null) return
  const name = editingName.value.trim()
  if (name) {
    categoriesStore.renameCategory(editingId.value, name)
    showToast('success', 'Đã sửa thư mục')
  }
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

/* ─── Delete (with inline confirm) ─── */
const showDeleteConfirm = ref(false)
const deleteTargets = ref<number[]>([])

function startDelete() {
  const ids = [...chosenIds.value]
  if (!ids.length) {
    // Fallback: delete highlighted
    const hIds = [...highlightedIds.value]
    if (!hIds.length) { showToast('warning', 'Vui lòng chọn thư mục!'); return }
    deleteTargets.value = hIds
  } else {
    deleteTargets.value = ids
  }
  showDeleteConfirm.value = true
}

function confirmDelete() {
  const blocked: string[] = []
  const deleted: number[] = []
  for (const id of deleteTargets.value) {
    const count = accountsStore.accounts.filter(a => a.categoryId === id).length
    if (count > 0) {
      const cat = categoriesStore.categories.find(c => c.id === id)
      blocked.push(`"${cat?.name}" (${count} tài khoản)`)
    } else {
      categoriesStore.deleteCategory(id)
      chosenIds.value.delete(id)
      highlightedIds.value.delete(id)
      deleted.push(id)
    }
  }
  if (deleted.length) showToast('success', `Đã xóa ${deleted.length} thư mục`)
  if (blocked.length) showToast('warning', `Không thể xóa: ${blocked.join(', ')} — cần chuyển tài khoản trước`)
  showDeleteConfirm.value = false
  deleteTargets.value = []
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTargets.value = []
}

/* ─── Drag-drop reorder ─── */
const dragId = ref<number | null>(null)

function onDragStart(e: DragEvent, id: number) {
  dragId.value = id
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(id))
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

function onDrop(e: DragEvent, targetId: number) {
  e.preventDefault()
  if (dragId.value === null || dragId.value === targetId) return
  const cats = categoriesStore.sortedCategories
  const ids = cats.map(c => c.id)
  const fromIdx = ids.indexOf(dragId.value)
  const toIdx = ids.indexOf(targetId)
  if (fromIdx === -1 || toIdx === -1) return
  ids.splice(fromIdx, 1)
  ids.splice(toIdx, 0, dragId.value)
  categoriesStore.reorderCategories(ids)
  dragId.value = null
}

function onDragEnd() {
  dragId.value = null
}

/* ─── Context menu ─── */
const ctxMenu = ref({ show: false, x: 0, y: 0 })
function showCtx(e: MouseEvent) {
  e.preventDefault()
  ctxMenu.value = { show: true, x: e.clientX, y: e.clientY }
}
function hideCtx() { ctxMenu.value.show = false }

function ctxEdit() {
  const id = [...highlightedIds.value][0]
  if (!id) { showToast('warning', 'Vui lòng chọn thư mục!'); hideCtx(); return }
  const cat = categoriesStore.categories.find(c => c.id === id)
  if (cat) startEdit(cat.id, cat.name)
  hideCtx()
}
</script>

<template>
  <BaseModal :show="show" title="Cấu hình thư mục" size="lg" @close="$emit('close')">
    <div class="cat-content" @click="hideCtx">
      <!-- Toolbar -->
      <div class="cat-toolbar">
        <button class="tb-btn" @click="startAdd">+ Thêm thư mục</button>
        <button class="tb-btn" @click="ctxEdit" :disabled="!highlightedIds.size">Sửa tên</button>
        <button class="tb-btn tb-btn--red" @click="startDelete" :disabled="!chosenIds.size && !highlightedIds.size">Xóa</button>
      </div>

      <!-- DataGrid -->
      <div class="cat-grid" @contextmenu="showCtx">
        <table class="cat-table">
          <thead><tr>
            <th style="width:36px;text-align:center">
              <input type="checkbox" @change="chosenIds.size === categoriesStore.sortedCategories.length ? unselectAll() : selectAll()"
                :checked="chosenIds.size > 0 && chosenIds.size === categoriesStore.sortedCategories.length" />
            </th>
            <th style="width:40px;text-align:center">STT</th>
            <th style="min-width:150px">Tên thư mục</th>
            <th style="width:70px;text-align:center">Tổng</th>
            <th style="width:60px;text-align:center">Live</th>
            <th style="width:80px;text-align:center">Die/CP</th>
            <th style="width:60px;text-align:center">N/A</th>
            <th style="width:60px;text-align:center">Rác</th>
            <th style="min-width:100px">Ngày tạo</th>
          </tr></thead>
          <tbody>
            <tr v-for="(cat, idx) in categoriesStore.sortedCategories" :key="cat.id"
              :class="{ 'row-highlight': highlightedIds.has(cat.id), 'row-dragging': dragId === cat.id }"
              draggable="true"
              @click="onRowClick(cat.id, $event)"
              @dblclick="startEdit(cat.id, cat.name)"
              @dragstart="onDragStart($event, cat.id)"
              @dragover="onDragOver"
              @drop="onDrop($event, cat.id)"
              @dragend="onDragEnd">
              <td style="text-align:center">
                <input type="checkbox" :checked="chosenIds.has(cat.id)" @change="toggleChosen(cat.id)" />
              </td>
              <td style="text-align:center;color:var(--text-tertiary)">{{ idx + 1 }}</td>
              <td>
                <template v-if="editingId === cat.id">
                  <input ref="editInputRef" type="text" class="inline-input" v-model="editingName"
                    @keyup.enter="confirmEdit" @keyup.escape="cancelEdit" @blur="confirmEdit" />
                </template>
                <template v-else>
                  <span style="font-weight:500;color:var(--text-primary)">{{ cat.name }}</span>
                </template>
              </td>
              <td style="text-align:center">{{ categoryStats(cat.id).total }}</td>
              <td style="text-align:center;color:var(--success-color)">{{ categoryStats(cat.id).live }}</td>
              <td style="text-align:center;color:var(--warning-color)">{{ categoryStats(cat.id).cp }}</td>
              <td style="text-align:center;color:var(--text-tertiary)">{{ categoryStats(cat.id).unknown }}</td>
              <td style="text-align:center;color:var(--error-color)">{{ categoryStats(cat.id).trash }}</td>
              <td style="color:var(--text-tertiary)">{{ cat.createdAt.split('T')[0] }}</td>
            </tr>
            <!-- Inline add row -->
            <tr v-if="showAddInput">
              <td colspan="2"></td>
              <td>
                <input ref="addInputRef" type="text" class="inline-input" v-model="newCategoryName"
                  placeholder="Tên thư mục mới..."
                  @keyup.enter="confirmAdd" @keyup.escape="cancelAdd" @blur="confirmAdd" />
              </td>
              <td colspan="6"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Status bar -->
      <div class="cat-statusbar">
        <span>Tổng: <strong style="color:forestgreen">{{ categoriesStore.sortedCategories.length }}</strong></span>
        <span>Bôi đen: <strong style="color:mediumblue">{{ countHighlight }}</strong></span>
        <span>Đã chọn: <strong style="color:#e53e3e">{{ countSelect }}</strong></span>
      </div>

      <!-- Delete confirmation -->
      <div v-if="showDeleteConfirm" class="delete-confirm">
        <span>Xóa {{ deleteTargets.length }} thư mục?</span>
        <button class="dc-btn dc-btn--yes" @click="confirmDelete">Xóa</button>
        <button class="dc-btn" @click="cancelDelete">Hủy</button>
      </div>

      <!-- Context menu -->
      <teleport to="body">
        <div v-if="ctxMenu.show" class="ctx-menu" :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }" @click.stop>
          <button class="ctx-item" @click="selectAll(); hideCtx()">Chọn tất cả</button>
          <button class="ctx-item" @click="unselectAll(); hideCtx()">Bỏ chọn tất cả</button>
          <div class="ctx-sep"></div>
          <button class="ctx-item" @click="startAdd(); hideCtx()">Thêm thư mục</button>
          <button class="ctx-item" @click="ctxEdit">Sửa thư mục</button>
          <button class="ctx-item ctx-item--red" @click="startDelete(); hideCtx()">Xoá thư mục</button>
        </div>
      </teleport>
    </div>

    <template #footer>
      <button class="modal-btn modal-btn--close" @click="$emit('close')">Đóng</button>
    </template>
  </BaseModal>
</template>

<style scoped>
.cat-content { display: flex; flex-direction: column; gap: 8px; }

.cat-toolbar { display: flex; gap: 8px; }
.tb-btn {
  padding: 5px 14px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  background: var(--bg-primary); color: var(--text-secondary); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.12s;
}
.tb-btn:hover:not(:disabled) { border-color: var(--brand-primary); color: var(--brand-primary); }
.tb-btn:disabled { opacity: 0.4; cursor: default; }
.tb-btn--red:hover:not(:disabled) { border-color: var(--error-color); color: var(--error-color); }

.cat-grid { overflow: auto; max-height: 400px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); }
.cat-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.cat-table th { padding: 8px 10px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); white-space: nowrap; position: sticky; top: 0; z-index: 2; }
.cat-table td { padding: 7px 10px; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.cat-table tbody tr { cursor: pointer; user-select: none; }
.cat-table tbody tr:hover td { background: var(--hover-bg); }
.cat-table input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
.row-highlight td { background: var(--active-bg) !important; }
.row-dragging { opacity: 0.4; }

.inline-input {
  width: 100%; padding: 3px 8px; border: 1px solid var(--brand-primary); border-radius: var(--radius-sm);
  font-size: 13px; font-family: var(--font-family); background: var(--bg-primary); color: var(--text-primary);
  outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}

.cat-statusbar { display: flex; gap: 16px; font-size: 12px; color: var(--text-tertiary); padding: 4px 0; }

.delete-confirm {
  display: flex; align-items: center; gap: 10px; padding: 8px 12px;
  background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px; font-size: 13px; color: var(--text-secondary);
}
.dc-btn {
  padding: 6px 16px; border: 1px solid #e2e8f0; border-radius: 12px;
  background: #fff; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s;
  color: #334155;
}
.dc-btn:hover { background: #f8fafc; }
.dc-btn--yes { background: linear-gradient(to right, #f43f5e, #dc2626); color: #fff; border: none; border-top: 1px solid rgba(255,255,255,0.2); box-shadow: 0 6px 12px -3px rgba(239, 68, 68, 0.3); }
.dc-btn--yes:hover { filter: brightness(1.05); background: linear-gradient(to right, #f43f5e, #dc2626); }

/* Context menu */
.ctx-menu { position: fixed; z-index: 9999; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.12); padding: 4px 0; min-width: 180px; }
.ctx-item { display: block; width: 100%; padding: 8px 16px; border: none; background: none; text-align: left; font-size: 13px; cursor: pointer; color: var(--text-secondary); }
.ctx-item:hover { background: var(--hover-bg); }
.ctx-item--red:hover { background: rgba(239,68,68,0.08); color: var(--error-color); }
.ctx-sep { height: 1px; background: var(--border-color); margin: 4px 8px; }

/* Footer — WX variant */
.modal-btn {
  padding: 10px 20px; border: none; border-radius: 12px;
  font-family: var(--wx-font-primary, 'Inter', sans-serif); font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden; border-top: 1px solid rgba(255,255,255,0.2);
}
.modal-btn:active { transform: scale(0.98); }
.modal-btn--close { background: linear-gradient(to right, #f43f5e, #dc2626); color: #fff; box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25); }
.modal-btn--close:hover { box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4); filter: brightness(1.05); }
</style>

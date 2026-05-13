<script setup lang="ts">
import { computed, watchEffect, ref, watch, useSlots, type ComputedRef } from 'vue'
import type { CrudPageConfig, RowId } from '@/schemas/crud.schema'
import { useCrudState } from '@/composables/useCrudState'
import { useFilter } from '@/composables/useFilter'
import { useFormState } from '@/composables/useFormState'
import { useToast } from '@/composables/useToast'
import {
  BaseButton, BaseInput, BaseSelectMenu,
  FormModal, ConfirmDialog,
} from '@/components/common'
import BaseModal from '@/components/common/BaseModal.vue'
import { BulkActionBar } from '@/components/data'
import BasePagination from '@/components/common/BasePagination.vue'
import CrudFormFields from './CrudFormFields.vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: CrudPageConfig<any>
}>()

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'open-detail': [item: any]
}>()

const { showToast } = useToast()

// ── Core state ────────────────────────────────────────────────────────────────
const {
  items, selected,
  addOpen, editOpen, detailOpen, deleteOpen, bulkDeleteOpen,
  addLoading, editLoading, deleteLoading, bulkLoading,
  editTarget, detailTarget, deleteTarget, highlightId,
  isAllSelected, isIndeterminate,
  toggleOne, toggleAll, clearSelection,
  openAdd, openEdit, openDetail, openDelete, highlight,
  addItem, updateItem, removeItem, removeItems,
} = useCrudState(props.config.initialData)

// ── Filter ────────────────────────────────────────────────────────────────────
const { search, filterValues, filtered, resetFilters } = useFilter(
  items as any,
  props.config.searchFields,
  props.config.filters ?? []
)

// ── Selection computed ────────────────────────────────────────────────────────
const headerCheckRef = ref<HTMLInputElement | null>(null)
// ── Pagination ────────────────────────────────────────────────────────────────
const currentPage = ref(1)
const pageSize = computed(() => props.config.pageSize ?? 20)
watch(filtered, () => { currentPage.value = 1 })
const paginated = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const _isAllSelected = computed(() => isAllSelected(paginated.value as any))
const _isIndeterminate = computed(() => isIndeterminate(paginated.value as any))

const slots: ReturnType<typeof useSlots> = useSlots()
const hasRowActions: ComputedRef<boolean> = computed(() =>
  !!(props.config.editForm || props.config.delete || slots['row-actions'])
)

watchEffect(() => {
  if (headerCheckRef.value) headerCheckRef.value.indeterminate = _isIndeterminate.value
})

// ── Form states ───────────────────────────────────────────────────────────────
const addFields  = props.config.addForm?.fields ?? []
const editFields = props.config.editForm?.fields ?? addFields
const addForm  = useFormState(addFields)
const editForm = useFormState(editFields)

// ── Add ───────────────────────────────────────────────────────────────────────
function handleOpenAdd() {
  addForm.reset(props.config.addForm?.initialValues?.())
  openAdd()
}

async function handleAdd() {
  const cfg = props.config.addForm
  if (!cfg) return
  const err = cfg.validate?.(addForm.form)
  if (err) { showToast('error', err); return }
  addLoading.value = true
  const item = cfg.build(addForm.form) as { id: RowId }
  try {
    await props.config.handlers?.onAdd?.(item as any)
    addItem(item as any)
  } finally {
    addLoading.value = false
  }
  addOpen.value = false
  showToast('success', `Đã thêm ${props.config.label.singular}`)
  highlight(item.id)
}

// ── Edit ──────────────────────────────────────────────────────────────────────
function handleOpenEdit(row: Record<string, unknown>) {
  editForm.fillFrom(row, props.config.editForm?.fillMap)
  openEdit(row as any)
}

async function handleEdit() {
  const cfg = props.config.editForm
  if (!cfg || !editTarget.value) return
  const err = cfg.validate?.(editForm.form)
  if (err) { showToast('error', err); return }
  editLoading.value = true
  const updated = cfg.apply(editTarget.value as any, editForm.form)
  try {
    await props.config.handlers?.onEdit?.(updated as any)
    updateItem((editTarget.value as any).id, updated as any)
    editOpen.value = false
    showToast('success', `Đã cập nhật ${props.config.label.singular}`)
  } catch {
    showToast('error', `Không thể cập nhật ${props.config.label.singular}`)
  } finally {
    editLoading.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
async function handleDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  const id = (deleteTarget.value as any).id as RowId
  try {
    await props.config.handlers?.onDelete?.(id)
    removeItem(id)
    deleteOpen.value = false
    showToast('success', `Đã xoá ${props.config.label.singular}`)
  } catch {
    showToast('error', `Không thể xoá ${props.config.label.singular}`)
  } finally {
    deleteLoading.value = false
  }
}

// ── Bulk delete ───────────────────────────────────────────────────────────────
async function handleBulkDelete() {
  bulkLoading.value = true
  const ids = [...selected.value]
  try {
    await props.config.handlers?.onBulkDelete?.(ids)
    removeItems(ids)
    bulkDeleteOpen.value = false
    showToast('success', `Đã xoá ${ids.length} ${props.config.label.plural}`)
  } catch {
    showToast('error', 'Không thể xoá')
  } finally {
    bulkLoading.value = false
  }
}

// ── Bulk custom actions ───────────────────────────────────────────────────────
const activeBulkKey = ref<string | null>(null)
const bulkActionLoading = ref(false)

function openBulkAction(key: string) {
  const cfg = props.config.bulkActions?.find(a => a.key === key)
  if (cfg?.confirm) { activeBulkKey.value = key }
  else doRunBulkAction(key)
}

async function doRunBulkAction(key: string) {
  bulkActionLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  await props.config.handlers?.onBulkAction?.(key, [...selected.value])
  bulkActionLoading.value = false
  activeBulkKey.value = null
  showToast('success', 'Thao tác thành công')
}

// ── Detail helpers ────────────────────────────────────────────────────────────
const detailTitle = computed(() => {
  const cfg = props.config.detail
  if (!detailTarget.value || !cfg?.titleKey) return `Chi tiết ${props.config.label.singular}`
  return (detailTarget.value as any)[cfg.titleKey] ?? `Chi tiết ${props.config.label.singular}`
})

const activeBulkConfirmConfig = computed(() =>
  props.config.bulkActions?.find(a => a.key === activeBulkKey.value)
)

defineExpose({ openAdd: handleOpenAdd })
</script>

<template>
  <!-- ── Toolbar ────────────────────────────────────────────────────────────── -->
  <div class="crud-toolbar">
    <BaseInput
      v-model="search"
      :placeholder="config.searchPlaceholder ?? `Tìm kiếm ${config.label.plural}...`"
      size="sm"
      clearable
      style="max-width: 280px"
    />

    <BaseSelectMenu
      v-for="f in config.filters ?? []"
      :key="f.key"
      :modelValue="filterValues[f.key]"
      :options="f.options"
      size="sm"
      style="width: 185px"
      @update:modelValue="filterValues[f.key] = String($event)"
    />

    <slot name="toolbar-extra" :filtered="filtered" />
  </div>

  <!-- ── Table ──────────────────────────────────────────────────────────────── -->
  <div class="crud-table-wrap">
    <div class="crud-table-scroll">
    <table class="crud-table">
      <thead>
        <tr>
          <th class="col-check">
            <input
              ref="headerCheckRef"
              type="checkbox"
              class="cb"
              :checked="_isAllSelected"
              @change="toggleAll(paginated as any)"
            />
          </th>
          <th
            v-for="col in config.columns"
            :key="col.key"
            :style="col.width ? `width: ${col.width}` : ''"
            :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''"
          >
            {{ col.label }}
          </th>
          <th v-if="hasRowActions" class="col-actions" />
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, rowIdx) in paginated"
          :key="(row as any).id"
          class="crud-row"
          :class="{
            'crud-row--selected':   selected.includes((row as any).id),
            'crud-row--highlight':  highlightId === (row as any).id,
          }"
          @click="openDetail(row as any); emit('open-detail', row)"
        >
          <!-- Checkbox -->
          <td class="col-check" @click.stop>
            <input
              type="checkbox"
              class="cb"
              :checked="selected.includes((row as any).id)"
              @change="toggleOne((row as any).id)"
            />
          </td>

          <!-- Data cells -->
          <td
            v-for="col in config.columns"
            :key="col.key"
            :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''"
          >
            <slot
              :name="`cell-${col.key}`"
              :row="row"
              :value="(row as any)[col.key]"
              :index="(currentPage - 1) * pageSize + rowIdx + 1"
            >
              {{ (row as any)[col.key] ?? '—' }}
            </slot>
          </td>

          <!-- Row actions -->
          <td v-if="hasRowActions" class="col-actions" @click.stop>
            <div class="row-actions">
              <slot
                name="row-actions"
                :row="row"
                :openEdit="() => handleOpenEdit(row as any)"
                :openDelete="() => openDelete(row as any)"
              >
                <button
                  v-if="config.editForm"
                  class="row-btn row-btn--edit"
                  title="Chỉnh sửa"
                  @click="handleOpenEdit(row as any)"
                >
                  <svg class="row-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span class="row-btn__label">Sửa</span>
                </button>
                <button
                  v-if="config.delete"
                  class="row-btn row-btn--delete"
                  title="Xoá"
                  @click="openDelete(row as any)"
                >
                  <svg class="row-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  <span class="row-btn__label">Xoá</span>
                </button>
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    </div><!-- /crud-table-scroll -->

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="crud-empty">
      <div class="crud-empty__icon">{{ config.empty?.emoji ?? '📭' }}</div>
      <p class="crud-empty__text">
        {{ config.empty?.message ?? `Không tìm thấy ${config.label.plural} nào` }}
      </p>
      <BaseButton variant="ghost" size="sm" @click="resetFilters">Xoá bộ lọc</BaseButton>
    </div>
  </div>

  <!-- ── Pagination ────────────────────────────────────────────────────────────── -->
  <div class="crud-pagination">
    <span class="crud-total">{{ filtered.length }} {{ config.label.plural }}</span>
    <BasePagination
      v-if="filtered.length > pageSize"
      v-model="currentPage"
      :total="filtered.length"
      :page-size="pageSize"
      size="sm"
    />
  </div>

  <!-- ── Bulk action bar ─────────────────────────────────────────────────────── -->
  <BulkActionBar
    :count="selected.length"
    :show="selected.length > 0"
    @clear="clearSelection"
  >
    <!-- Custom bulk actions from config -->
    <template v-for="action in config.bulkActions ?? []" :key="action.key">
      <BaseButton
        size="sm"
        :variant="action.variant === 'danger' ? 'danger' : action.variant === 'warning' ? 'warning' : 'ghost'"
        @click="openBulkAction(action.key)"
      >
        {{ action.label }} {{ selected.length }}
      </BaseButton>
    </template>

    <!-- Default bulk delete -->
    <BaseButton
      v-if="config.delete?.bulkConfirmTitle"
      size="sm"
      variant="danger"
      @click="bulkDeleteOpen = true"
    >
      Xoá {{ selected.length }} {{ config.label.plural }}
    </BaseButton>

    <slot name="bulk-extra" :selected="selected" />
  </BulkActionBar>

  <!-- ── Add modal ───────────────────────────────────────────────────────────── -->
  <FormModal
    v-if="config.addForm"
    v-model="addOpen"
    :title="config.addForm.title ?? `Thêm ${config.label.singular} mới`"
    size="md"
    submit-label="Tạo mới"
    :loading="addLoading"
    @submit="handleAdd"
  >
    <CrudFormFields :fields="config.addForm.fields" :form="addForm.form" />
    <slot name="add-form-extra" :form="addForm.form" />
  </FormModal>

  <!-- ── Edit modal ──────────────────────────────────────────────────────────── -->
  <FormModal
    v-if="config.editForm"
    v-model="editOpen"
    :title="config.editForm.title ?? `Chỉnh sửa ${config.label.singular}`"
    size="md"
    submit-label="Lưu thay đổi"
    :loading="editLoading"
    @submit="handleEdit"
  >
    <CrudFormFields :fields="editFields" :form="editForm.form" />
  </FormModal>

  <!-- ── Detail popup ──────────────────────────────────────────────────────── -->
  <BaseModal
    v-if="config.detail"
    :show="detailOpen"
    :title="detailTitle"
    size="md"
    @close="detailOpen = false"
  >
    <template v-if="detailTarget">
      <div class="detail-modal-body">
        <slot name="detail-header" :item="detailTarget" />

        <!-- If detail-body slot is provided, use it; otherwise auto-render sections -->
        <slot v-if="$slots['detail-body']" name="detail-body" :item="detailTarget" />
        <template v-else>
          <div
            v-for="section in config.detail?.sections"
            :key="section.title"
            class="detail-section"
          >
            <p class="detail-section__label">{{ section.title }}</p>
            <div
              v-for="field in section.fields"
              :key="field.key"
              class="detail-row"
            >
              <span class="detail-key">{{ field.label }}</span>
              <code
                v-if="field.code"
                class="detail-val"
              >{{ field.format ? field.format((detailTarget as any)[field.key]) : (detailTarget as any)[field.key] ?? '—' }}</code>
              <span
                v-else
                class="detail-val"
              >{{ field.format ? field.format((detailTarget as any)[field.key]) : (detailTarget as any)[field.key] ?? '—' }}</span>
            </div>
          </div>
        </template>

        <slot name="detail-extra" :item="detailTarget" />
      </div>
    </template>

    <template #footer>
      <div class="detail-modal-footer">
        <BaseButton
          v-if="config.delete"
          variant="danger"
          size="sm"
          @click="openDelete(detailTarget as any); detailOpen = false"
        >
          Xoá {{ config.label.singular }}
        </BaseButton>
        <span class="detail-modal-footer__spacer" />
        <BaseButton variant="ghost" @click="detailOpen = false">Đóng</BaseButton>
        <BaseButton
          v-if="config.editForm"
          variant="primary"
          @click="handleOpenEdit(detailTarget as any); detailOpen = false"
        >Chỉnh sửa</BaseButton>
      </div>
    </template>
  </BaseModal>

  <!-- ── Delete confirm ──────────────────────────────────────────────────────── -->
  <ConfirmDialog
    v-if="config.delete"
    v-model="deleteOpen"
    :title="config.delete.confirmTitle ?? `Xoá ${config.label.singular}?`"
    :description="
      deleteTarget && config.delete.confirmDescription
        ? config.delete.confirmDescription(deleteTarget as any)
        : `${config.label.singular} sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.`
    "
    intent="danger"
    confirm-label="Xoá ngay"
    :loading="deleteLoading"
    @confirm="handleDelete"
  />

  <!-- ── Bulk delete confirm ─────────────────────────────────────────────────── -->
  <ConfirmDialog
    v-if="config.delete?.bulkConfirmTitle"
    v-model="bulkDeleteOpen"
    :title="config.delete.bulkConfirmTitle"
    :description="
      config.delete.bulkConfirmDescription
        ? config.delete.bulkConfirmDescription(selected.length)
        : `${selected.length} ${config.label.plural} sẽ bị xoá vĩnh viễn.`
    "
    intent="danger"
    confirm-label="Xoá tất cả"
    :loading="bulkLoading"
    @confirm="handleBulkDelete"
  />

  <!-- ── Bulk custom action confirm ──────────────────────────────────────────── -->
  <ConfirmDialog
    v-if="activeBulkConfirmConfig?.confirm"
    :modelValue="activeBulkKey !== null"
    :title="activeBulkConfirmConfig!.confirm!.title"
    :description="activeBulkConfirmConfig!.confirm!.description"
    :intent="activeBulkConfirmConfig!.confirm!.intent ?? 'warning'"
    confirm-label="Xác nhận"
    :loading="bulkActionLoading"
    @update:modelValue="(v: boolean) => { if (!v) activeBulkKey = null }"
    @confirm="doRunBulkAction(activeBulkKey!)"
  />
</template>

<style scoped>
/* ── Toolbar ── */
.crud-toolbar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
  margin-bottom: var(--wx-space-4);
}

/* ── Table shell ── */
.crud-table-wrap {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
}

.crud-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.crud-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--wx-fs-14);
}

.crud-table th {
  padding: var(--wx-space-2) var(--wx-space-3);
  text-align: left;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  white-space: nowrap;
  user-select: none;
}

.crud-table td {
  padding: var(--wx-space-2) var(--wx-space-3);
  height: 48px;
  border-bottom: 1px solid var(--wx-border-subtle);
  vertical-align: middle;
}

/* ── Row states ── */
.crud-row {
  cursor: pointer;
  transition: background 120ms ease;
}

.crud-row:last-child td { border-bottom: none; }
.crud-row:hover td { background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent); }
.crud-row--selected td { background: var(--wx-selected-bg); }

.crud-row--highlight td {
  background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
  transition: background 0.1s;
}

/* ── Columns ── */
.col-check {
  width: 44px;
  text-align: center;
}

.col-actions {
  width: 140px;
  text-align: right;
}

.cb {
  width: 15px;
  height: 15px;
  accent-color: var(--wx-brand-primary);
  cursor: pointer;
}

.text-right  { text-align: right; }
.text-center { text-align: center; }

/* ── Row actions (always visible) ── */
.row-actions {
  display: flex;
  gap: var(--wx-space-1);
  justify-content: flex-end;
  flex-wrap: nowrap;
}

/* ── Row action icon buttons ── */
.row-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: var(--wx-radius-md);
  background: transparent;
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 140ms ease,
    color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;
}

.row-btn__icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Edit — blue */
.row-btn--edit {
  color: var(--wx-brand-primary);
  border-color: color-mix(in srgb, var(--wx-brand-primary) 25%, transparent);
}
.row-btn--edit:hover {
  background: var(--wx-brand-primary);
  color: #fff;
  border-color: var(--wx-brand-primary);
  box-shadow: 0 3px 10px -2px color-mix(in srgb, var(--wx-brand-primary) 50%, transparent);
}
.row-btn--edit:hover .row-btn__icon {
  transform: rotate(-12deg) scale(1.15);
}
.row-btn--edit:active { transform: scale(0.96); }

/* Delete — red */
.row-btn--delete {
  color: var(--wx-danger-solid, #ef4444);
  border-color: color-mix(in srgb, var(--wx-danger-solid, #ef4444) 25%, transparent);
}
.row-btn--delete:hover {
  background: var(--wx-danger-solid, #ef4444);
  color: #fff;
  border-color: var(--wx-danger-solid, #ef4444);
  box-shadow: 0 3px 10px -2px color-mix(in srgb, var(--wx-danger-solid, #ef4444) 50%, transparent);
}
.row-btn--delete:hover .row-btn__icon {
  transform: translateY(-2px) scale(1.15);
}
.row-btn--delete:active { transform: scale(0.96); }

/* ── Pagination ── */
.crud-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-3) var(--wx-space-4);
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-elevated);
}

.crud-total {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── Empty state ── */
.crud-empty {
  padding: var(--wx-space-10) var(--wx-space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-3);
  text-align: center;
}

.crud-empty__icon {
  font-size: 36px;
  opacity: 0.35;
  line-height: 1;
}

.crud-empty__text {
  margin: 0;
  font-size: var(--wx-fs-14);
  color: var(--wx-text-muted);
}

/* ── Detail popup layout ── */
.detail-modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}

.detail-modal-footer {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  width: 100%;
}

.detail-modal-footer__spacer { flex: 1; }

/* ── Detail sections — card style ── */
.detail-section {
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
}

.detail-section__label {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  padding: var(--wx-space-2) var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.detail-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--wx-space-6);
  font-size: var(--wx-fs-14);
  padding: var(--wx-space-3) var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
  transition: background var(--wx-d-fast);
}
.detail-row:last-child { border-bottom: none; }
.detail-row:hover { background: var(--wx-surface-hover); }

.detail-key {
  color: var(--wx-text-secondary);
  flex-shrink: 0;
  font-size: var(--wx-fs-13);
}

.detail-val {
  color: var(--wx-text-primary);
  font-weight: var(--wx-fw-medium);
  text-align: right;
  word-break: break-word;
  font-size: var(--wx-fs-13);
}
</style>

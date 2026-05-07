import { ref } from 'vue'
import type { Ref } from 'vue'
import type { RowId } from '@/schemas/crud.schema'

export interface CrudStateReturn<T extends { id: RowId }> {
  items: Ref<T[]>
  selected: Ref<RowId[]>

  addOpen: Ref<boolean>
  editOpen: Ref<boolean>
  detailOpen: Ref<boolean>
  deleteOpen: Ref<boolean>
  bulkDeleteOpen: Ref<boolean>

  addLoading: Ref<boolean>
  editLoading: Ref<boolean>
  deleteLoading: Ref<boolean>
  bulkLoading: Ref<boolean>

  editTarget: Ref<T | null>
  detailTarget: Ref<T | null>
  deleteTarget: Ref<T | null>
  highlightId: Ref<RowId | null>

  isAllSelected(filtered: T[]): boolean
  isIndeterminate(filtered: T[]): boolean

  toggleOne(id: RowId): void
  toggleAll(filtered: T[]): void
  clearSelection(): void

  openAdd(): void
  openEdit(item: T): void
  openDetail(item: T): void
  openDelete(item: T): void
  highlight(id: RowId): void

  addItem(item: T): void
  updateItem(id: RowId, updated: T): void
  removeItem(id: RowId): void
  removeItems(ids: RowId[]): void
}

export function useCrudState<T extends { id: RowId }>(
  initialData: () => T[]
): CrudStateReturn<T> {
  const items = ref<T[]>(initialData()) as Ref<T[]>
  const selected = ref<RowId[]>([])

  const addOpen = ref(false)
  const editOpen = ref(false)
  const detailOpen = ref(false)
  const deleteOpen = ref(false)
  const bulkDeleteOpen = ref(false)

  const addLoading = ref(false)
  const editLoading = ref(false)
  const deleteLoading = ref(false)
  const bulkLoading = ref(false)

  const editTarget = ref<T | null>(null) as Ref<T | null>
  const detailTarget = ref<T | null>(null) as Ref<T | null>
  const deleteTarget = ref<T | null>(null) as Ref<T | null>
  const highlightId = ref<RowId | null>(null)

  function isAllSelected(filtered: T[]): boolean {
    return filtered.length > 0 && filtered.every(r => selected.value.includes(r.id))
  }

  function isIndeterminate(filtered: T[]): boolean {
    return filtered.some(r => selected.value.includes(r.id)) && !isAllSelected(filtered)
  }

  function toggleOne(id: RowId) {
    const idx = selected.value.indexOf(id)
    if (idx !== -1) selected.value.splice(idx, 1)
    else selected.value.push(id)
  }

  function toggleAll(filtered: T[]) {
    if (isAllSelected(filtered)) {
      const ids = filtered.map(r => r.id)
      selected.value = selected.value.filter(id => !ids.includes(id))
    } else {
      filtered.forEach(r => {
        if (!selected.value.includes(r.id)) selected.value.push(r.id)
      })
    }
  }

  function clearSelection() { selected.value = [] }

  function openAdd() { addOpen.value = true }
  function openEdit(item: T) { editTarget.value = item; editOpen.value = true }
  function openDetail(item: T) { detailTarget.value = item; detailOpen.value = true }
  function openDelete(item: T) { deleteTarget.value = item; deleteOpen.value = true }

  function highlight(id: RowId) {
    highlightId.value = id
    setTimeout(() => { highlightId.value = null }, 2000)
  }

  function addItem(item: T) {
    items.value.unshift(item)
  }

  function updateItem(id: RowId, updated: T) {
    const idx = items.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      items.value[idx] = updated
      if (detailTarget.value?.id === id) detailTarget.value = updated
    }
  }

  function removeItem(id: RowId) {
    items.value = items.value.filter(r => r.id !== id)
    const si = selected.value.indexOf(id)
    if (si !== -1) selected.value.splice(si, 1)
  }

  function removeItems(ids: RowId[]) {
    items.value = items.value.filter(r => !ids.includes(r.id))
    selected.value = selected.value.filter(id => !ids.includes(id))
  }

  return {
    items, selected,
    addOpen, editOpen, detailOpen, deleteOpen, bulkDeleteOpen,
    addLoading, editLoading, deleteLoading, bulkLoading,
    editTarget, detailTarget, deleteTarget, highlightId,
    isAllSelected, isIndeterminate,
    toggleOne, toggleAll, clearSelection,
    openAdd, openEdit, openDetail, openDelete, highlight,
    addItem, updateItem, removeItem, removeItems,
  }
}

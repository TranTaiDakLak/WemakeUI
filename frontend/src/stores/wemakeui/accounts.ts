import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AccountRow, AccountStatus } from '../../types/account'

const MOCK: AccountRow[] = []

export const useAccountsStore = defineStore('wc-accounts', () => {
  const accounts = ref<AccountRow[]>([])
  const highlightedIds = ref<Set<number>>(new Set())
  const searchField = ref('uid')
  const searchQuery = ref('')
  const currentCategoryIds = ref<number[]>([0])
  const sortField = ref('')
  const sortDir = ref<'asc' | 'desc'>('asc')

  const filteredAccounts = computed(() => {
    let list = accounts.value

    if (!currentCategoryIds.value.includes(0)) {
      list = list.filter(a => a.categoryId !== null && currentCategoryIds.value.includes(a.categoryId))
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const field = searchField.value as keyof AccountRow
      list = list.filter(a => String(a[field] ?? '').toLowerCase().includes(q))
    }

    if (sortField.value) {
      const f = sortField.value as keyof AccountRow
      list = [...list].sort((a, b) => {
        const av = a[f], bv = b[f]
        if (av === bv) return 0
        const cmp = av! < bv! ? -1 : 1
        return sortDir.value === 'asc' ? cmp : -cmp
      })
    }

    return list
  })

  const displayRows = computed(() =>
    filteredAccounts.value.map(a => ({
      ...a,
      cookie: a.cookie ? '✓' : '-',
      token:  a.token  ? '✓' : '-',
    }))
  )

  const stats = computed(() => {
    const all = accounts.value
    return {
      live:        all.filter(a => a.status === 'Live').length,
      die:         all.filter(a => a.status === 'Die').length,
      checkpoint:  all.filter(a => a.status === 'Checkpoint').length,
      total:       all.length,
      highlighted: highlightedIds.value.size,
      selected:    all.filter(a => a.chose).length,
    }
  })

  const uniqueStatuses = computed((): AccountStatus[] =>
    [...new Set(accounts.value.map(a => a.status))]
  )
  const uniqueNotes = computed(() =>
    [...new Set(accounts.value.map(a => a.note).filter(Boolean))]
  )
  const uniqueActions = computed(() =>
    [...new Set(accounts.value.map(a => a.action).filter(Boolean))]
  )
  const uniqueCheckpoints = computed(() =>
    [...new Set(accounts.value.map(a => a.checkpointType).filter(Boolean))]
  )

  const allChosen = computed(() =>
    accounts.value.length > 0 && accounts.value.every(a => a.chose)
  )

  function loadMockData() {
    accounts.value = MOCK.map(a => ({ ...a }))
  }

  function selectAll() {
    filteredAccounts.value.forEach(a => { a.chose = true })
  }

  function unselectAll() {
    accounts.value.forEach(a => { a.chose = false })
  }

  function selectHighlighted() {
    accounts.value.forEach((a, idx) => {
      if (highlightedIds.value.has(idx)) a.chose = true
    })
  }

  function selectByStatus(status: AccountStatus) {
    accounts.value.filter(a => a.status === status).forEach(a => { a.chose = true })
  }

  function selectByNote(note: string) {
    accounts.value.filter(a => a.note === note).forEach(a => { a.chose = true })
  }

  function toggleAll(checked: boolean) {
    accounts.value.forEach(a => { a.chose = checked })
  }

  function toggleRow(index: number) {
    const a = filteredAccounts.value[index]
    if (a) a.chose = !a.chose
  }

  function dblclickRow(index: number) {
    const a = filteredAccounts.value[index]
    if (a) a.chose = !a.chose
  }

  function setHighlighted(ids: Set<number>) {
    highlightedIds.value = ids
  }

  function deleteSelected() {
    accounts.value = accounts.value.filter(a => !a.chose)
  }

  function moveToCategory(ids: number[], catId: number) {
    const targets = ids.length > 0 ? ids : accounts.value.filter(a => a.chose).map(a => a.id)
    accounts.value.filter(a => targets.includes(a.id)).forEach(a => { a.categoryId = catId })
  }

  function updateField(ids: number[], field: keyof AccountRow, value: string) {
    accounts.value
      .filter(a => ids.includes(a.id))
      .forEach(a => { (a as Record<string, unknown>)[field] = value })
  }

  function setSort(field: string, dir: 'asc' | 'desc') {
    sortField.value = field
    sortDir.value = dir
  }

  loadMockData()

  return {
    accounts, highlightedIds, searchField, searchQuery, currentCategoryIds,
    filteredAccounts, displayRows, stats, allChosen,
    uniqueStatuses, uniqueNotes, uniqueActions, uniqueCheckpoints,
    loadMockData, selectAll, unselectAll, selectHighlighted, selectByStatus, selectByNote,
    toggleAll, toggleRow, dblclickRow, setHighlighted, deleteSelected, moveToCategory, updateField, setSort,
  }
})

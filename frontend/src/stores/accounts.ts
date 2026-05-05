import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AccountRow, AccountStatus } from '../types/account'
import { createEmptyAccountRow } from '../types/account'

export const useAccountsStore = defineStore('accounts', () => {
  /* ── State ── */
  const accounts = ref<AccountRow[]>([])
  const highlightedIds = ref<Set<number>>(new Set())
  const searchQuery = ref('')
  const searchField = ref<string>('all')
  const currentCategoryIds = ref<number[]>([])  // empty = all categories

  /* ── Computed ── */
  const selectedAccounts = computed(() => accounts.value.filter(a => a.chose))
  const selectedCount = computed(() => selectedAccounts.value.length)
  const highlightedCount = computed(() => highlightedIds.value.size)

  const filteredAccounts = computed(() => {
    let list = accounts.value.filter(a => !a.isDeleted)

    // Filter by category (empty array = show all)
    if (currentCategoryIds.value.length > 0) {
      list = list.filter(a => a.categoryId !== null && currentCategoryIds.value.includes(a.categoryId))
    }

    // Filter by search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      list = list.filter(a => {
        if (searchField.value === 'all') {
          return a.uid.toLowerCase().includes(q)
            || a.fullName.toLowerCase().includes(q)
            || a.email.toLowerCase().includes(q)
            || a.note.toLowerCase().includes(q)
        }
        return String((a as unknown as Record<string, unknown>)[searchField.value] ?? '').toLowerCase().includes(q)
      })
    }

    return list
  })

  const stats = computed(() => {
    const all = accounts.value
    return {
      total: all.length,
      live: all.filter(a => a.status === 'Live').length,
      die: all.filter(a => a.status === 'Die').length,
      checkpoint: all.filter(a => a.status === 'Checkpoint').length,
      selected: selectedCount.value,
      highlighted: highlightedCount.value,
    }
  })

  /* ── CRUD ── */
  function addAccount(data: Partial<AccountRow> & { uid: string }) {
    const id = accounts.value.length > 0 ? Math.max(...accounts.value.map(a => a.id)) + 1 : 1
    accounts.value.push(createEmptyAccountRow({ id, ...data }))
  }

  function addBatch(rows: Array<Partial<AccountRow> & { uid: string }>) {
    let nextId = accounts.value.length > 0 ? Math.max(...accounts.value.map(a => a.id)) + 1 : 1
    for (const row of rows) {
      accounts.value.push(createEmptyAccountRow({ id: nextId++, ...row }))
    }
  }

  function updateAccount(id: number, data: Partial<AccountRow>) {
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx >= 0) Object.assign(accounts.value[idx], data)
  }

  function deleteAccount(id: number) {
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx >= 0) {
      accounts.value[idx].isDeleted = true
      accounts.value[idx].deletedAt = new Date().toISOString()
    }
  }

  function deleteSelected() {
    const now = new Date().toISOString()
    accounts.value
      .filter(a => a.chose)
      .forEach(a => { a.isDeleted = true; a.deletedAt = now })
  }

  function permanentDelete(id: number) {
    accounts.value = accounts.value.filter(a => a.id !== id)
  }

  function restoreAccount(id: number) {
    const acc = accounts.value.find(a => a.id === id)
    if (acc) { acc.isDeleted = false; acc.deletedAt = '' }
  }

  function moveToCategory(ids: number[], categoryId: number) {
    for (const acc of accounts.value) {
      if (ids.includes(acc.id)) acc.categoryId = categoryId
    }
  }

  function updateField(ids: number[], field: string, value: string) {
    for (const acc of accounts.value) {
      if (ids.includes(acc.id)) {
        ;(acc as unknown as Record<string, unknown>)[field] = value
      }
    }
  }

  /* ── Selection ── */
  function selectAll() {
    filteredAccounts.value.forEach(a => a.chose = true)
  }

  function unselectAll() {
    accounts.value.forEach(a => a.chose = false)
  }

  function selectByStatus(status: AccountStatus) {
    accounts.value.forEach(a => a.chose = a.status === status)
  }

  function selectByNote(note: string) {
    accounts.value.forEach(a => a.chose = a.note.includes(note))
  }

  function selectHighlighted() {
    accounts.value.forEach((a, i) => {
      if (highlightedIds.value.has(i)) a.chose = true
    })
  }

  function toggleChose(id: number) {
    const acc = accounts.value.find(a => a.id === id)
    if (acc) acc.chose = !acc.chose
  }

  /* ── Highlight ── */
  function setHighlighted(ids: Set<number>) {
    highlightedIds.value = ids
  }

  function clearHighlighted() {
    highlightedIds.value = new Set()
  }

  /* ── Getters ── */
  const activeAccounts = computed(() => accounts.value.filter(a => !a.isDeleted))
  const deletedAccounts = computed(() => accounts.value.filter(a => a.isDeleted))
  const uniqueStatuses = computed(() => [...new Set(activeAccounts.value.map(a => a.status))].filter(Boolean).sort())
  const uniqueNotes = computed(() => [...new Set(activeAccounts.value.map(a => a.note).filter(Boolean))].sort())
  const uniqueActions = computed(() => [...new Set(activeAccounts.value.map(a => a.run).filter(Boolean))].sort())
  const uniqueCheckpoints = computed(() => [...new Set(activeAccounts.value.map(a => a.status282).filter(Boolean))].sort())

  /* ── Init mock data ── */
  function loadMockData() {
    accounts.value = [
      createEmptyAccountRow({ id: 1, uid: '100012345678', fullName: 'Nguyễn Văn A', password: 'Abc@1234', twofa: 'JBSWY3DPEHPK3PXP', email: 'a@gmail.com', cookie: '✓', token: '✓', status: 'Live', statusAds: '-', friends: 2340, follower: 120, categoryId: 1 }),
      createEmptyAccountRow({ id: 2, uid: '100087654321', fullName: 'Trần Thị B', password: 'Pass#5678', twofa: 'KRSXG5CTMVRXEZLU', email: 'b@gmail.com', cookie: '✓', token: '✓', status: 'Live', statusAds: '-', friends: 1820, follower: 85, categoryId: 1 }),
      createEmptyAccountRow({ id: 3, uid: '100011112222', fullName: 'Lê Minh C', password: 'Qwerty!99', twofa: '', email: 'c@yahoo.com', cookie: '✗', token: '✗', status: 'Checkpoint', statusAds: '-', friends: 945, follower: 32, note: 'CP 282', status282: 'CP 282', categoryId: 1 }),
      createEmptyAccountRow({ id: 4, uid: '100033334444', fullName: 'Phạm Quang D', password: 'Xyz@2024', twofa: '', email: 'd@mail.com', cookie: '✗', token: '✗', status: 'Die', statusAds: '-', friends: 0, follower: 0, categoryId: 1 }),
      createEmptyAccountRow({ id: 5, uid: '100055556666', fullName: 'Hoàng Thị E', password: 'SecureP@ss1', twofa: 'GEZDGNBVGY3TQOJQ', email: 'e@outlook.com', cookie: '✓', token: '✓', status: 'Live', statusAds: 'Active', friends: 3102, follower: 450, note: 'VIP', categoryId: 2 }),
      createEmptyAccountRow({ id: 6, uid: '100066667777', fullName: 'Vũ Đình F', password: 'Hello#2025', twofa: 'MFZWIZLTOQ3GC3DT', email: 'f@gmail.com', cookie: '✓', token: '✗', status: 'Live', statusAds: '-', friends: 560, follower: 20, categoryId: 1 }),
      createEmptyAccountRow({ id: 7, uid: '100077778888', fullName: 'Đặng Thu G', password: 'MyP@ss789', twofa: '', email: 'g@mail.com', cookie: '✗', token: '✗', status: 'Die', statusAds: '-', friends: 0, follower: 0, note: 'Disabled', categoryId: 1 }),
    ]
  }

  return {
    // State
    accounts,
    highlightedIds,
    searchQuery,
    searchField,
    currentCategoryIds,
    // Computed
    selectedAccounts,
    selectedCount,
    highlightedCount,
    filteredAccounts,
    stats,
    activeAccounts,
    deletedAccounts,
    uniqueStatuses,
    uniqueNotes,
    uniqueActions,
    uniqueCheckpoints,
    // CRUD
    addAccount,
    addBatch,
    updateAccount,
    deleteAccount,
    deleteSelected,
    permanentDelete,
    restoreAccount,
    moveToCategory,
    updateField,
    // Selection
    selectAll,
    unselectAll,
    selectByStatus,
    selectByNote,
    selectHighlighted,
    toggleChose,
    // Highlight
    setHighlighted,
    clearHighlighted,
    // Init
    loadMockData,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CategoryItem } from '../../types/account'
import { useAccountsStore } from './accounts'

export const useCategoriesStore = defineStore('wc-categories', () => {
  const accountsStore = useAccountsStore()

  /** Danh sách thư mục (không kèm số đếm) — nguồn dữ liệu gốc. */
  const defs = ref<Array<{ id: number; name: string }>>([
    { id: 0, name: 'Tất cả' },
    { id: 1, name: 'Pháp lý' },
    { id: 2, name: 'Báo cáo' },
  ])

  /** Thư mục kèm số bản ghi, luôn tính theo dữ liệu thật (xoá/chuyển thư mục là cập nhật ngay). */
  const categories = computed<CategoryItem[]>(() =>
    defs.value.map(c => ({
      ...c,
      count: c.id === 0
        ? accountsStore.accounts.length
        : accountsStore.accounts.filter(a => a.categoryId === c.id).length,
    }))
  )

  const sortedCategories = computed(() =>
    [...categories.value].sort((a, b) => a.id - b.id)
  )

  function addCategory(name: string) {
    const id = Math.max(0, ...defs.value.map(c => c.id)) + 1
    defs.value.push({ id, name })
  }

  function renameCategory(id: number, name: string) {
    const c = defs.value.find(c => c.id === id)
    if (c) c.name = name
  }

  function removeCategory(id: number) {
    const idx = defs.value.findIndex(c => c.id === id)
    if (idx > -1) defs.value.splice(idx, 1)
  }

  return { categories, sortedCategories, addCategory, renameCategory, removeCategory }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CategoryItem } from '../../types/account'

export const useCategoriesStore = defineStore('wc-categories', () => {
  const categories = ref<CategoryItem[]>([
    { id: 0, name: 'Tất cả', count: 8 },
    { id: 1, name: 'Nhóm A',  count: 3 },
    { id: 2, name: 'Nhóm B',  count: 3 },
    { id: 3, name: 'Nhóm C',  count: 2 },
  ])

  const sortedCategories = computed(() =>
    [...categories.value].sort((a, b) => a.id - b.id)
  )

  function addCategory(name: string) {
    const id = Math.max(0, ...categories.value.map(c => c.id)) + 1
    categories.value.push({ id, name, count: 0 })
  }

  function renameCategory(id: number, name: string) {
    const c = categories.value.find(c => c.id === id)
    if (c) c.name = name
  }

  function removeCategory(id: number) {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx > -1) categories.value.splice(idx, 1)
  }

  return { categories, sortedCategories, addCategory, renameCategory, removeCategory }
})

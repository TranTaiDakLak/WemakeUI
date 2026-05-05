import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '../types/category'

export const useCategoriesStore = defineStore('categories', () => {
  /* ── State ── */
  const categories = ref<Category[]>([])
  const selectedCategoryId = ref<number | null>(null)

  /* ── Computed ── */
  const sortedCategories = computed(() =>
    [...categories.value].sort((a, b) => a.sortOrder - b.sortOrder)
  )

  const selectedCategory = computed(() =>
    categories.value.find(c => c.id === selectedCategoryId.value) ?? null
  )

  /* ── CRUD ── */
  function addCategory(name: string, description = '') {
    const maxId = categories.value.length > 0 ? Math.max(...categories.value.map(c => c.id)) : 0
    const maxOrder = categories.value.length > 0 ? Math.max(...categories.value.map(c => c.sortOrder)) : 0
    categories.value.push({
      id: maxId + 1,
      name,
      description,
      sortOrder: maxOrder + 1,
      createdAt: new Date().toISOString(),
    })
  }

  function renameCategory(id: number, name: string) {
    const cat = categories.value.find(c => c.id === id)
    if (cat) cat.name = name
  }

  function deleteCategory(id: number) {
    categories.value = categories.value.filter(c => c.id !== id)
    if (selectedCategoryId.value === id) selectedCategoryId.value = null
  }

  function reorderCategories(orderedIds: number[]) {
    orderedIds.forEach((id, idx) => {
      const cat = categories.value.find(c => c.id === id)
      if (cat) cat.sortOrder = idx
    })
  }

  function selectCategory(id: number | null) {
    selectedCategoryId.value = id
  }

  /* ── Init mock data ── */
  function loadMockData() {
    categories.value = [
      { id: 1, name: 'Mặc định', description: 'Thư mục mặc định', sortOrder: 0, createdAt: '2026-01-01T00:00:00Z' },
      { id: 2, name: 'VIP', description: 'Tài khoản VIP', sortOrder: 1, createdAt: '2026-01-15T00:00:00Z' },
      { id: 3, name: 'BM Ads', description: 'Tài khoản chạy quảng cáo', sortOrder: 2, createdAt: '2026-02-01T00:00:00Z' },
    ]
  }

  return {
    // State
    categories,
    selectedCategoryId,
    // Computed
    sortedCategories,
    selectedCategory,
    // CRUD
    addCategory,
    renameCategory,
    deleteCategory,
    reorderCategories,
    selectCategory,
    // Init
    loadMockData,
  }
})

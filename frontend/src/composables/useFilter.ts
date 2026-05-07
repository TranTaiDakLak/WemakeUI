import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { FilterConfig } from '@/schemas/crud.schema'

export interface UseFilterReturn<T> {
  search: Ref<string>
  filterValues: Ref<Record<string, string>>
  filtered: ComputedRef<T[]>
  setFilter(key: string, value: string): void
  resetFilters(): void
}

export function useFilter<T extends Record<string, unknown>>(
  source: Ref<T[]>,
  searchFields: string[],
  filters: FilterConfig[] = []
): UseFilterReturn<T> {
  const search = ref('')
  const filterValues = ref<Record<string, string>>(
    Object.fromEntries(filters.map(f => [f.key, f.defaultValue]))
  )

  const filtered = computed<T[]>(() => {
    let list = source.value

    for (const fd of filters) {
      const val = filterValues.value[fd.key]
      if (val !== fd.defaultValue) {
        list = list.filter(row => fd.match(row as Record<string, unknown>, val))
      }
    }

    const q = search.value.trim().toLowerCase()
    if (q) {
      list = list.filter(row =>
        searchFields.some(field => {
          const v = (row as Record<string, unknown>)[field]
          return typeof v === 'string' && v.toLowerCase().includes(q)
        })
      )
    }

    return list
  })

  function setFilter(key: string, value: string) {
    filterValues.value[key] = value
  }

  function resetFilters() {
    search.value = ''
    for (const fd of filters) {
      filterValues.value[fd.key] = fd.defaultValue
    }
  }

  return { search, filterValues, filtered, setFilter, resetFilters }
}

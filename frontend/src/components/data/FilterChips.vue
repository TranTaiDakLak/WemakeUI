<script setup lang="ts">
import type { FilterRule, FilterGroup } from './filter-types'

const props = defineProps<{
  group: FilterGroup
  fieldLabels?: Record<string, string>
}>()

defineEmits<{
  remove: [path: number[]]
  clear: []
}>()

interface FlatChip {
  path: number[]
  text: string
}

function flatten(group: FilterGroup, path: number[] = []): FlatChip[] {
  const out: FlatChip[] = []
  group.rules.forEach((r, idx) => {
    const childPath = [...path, idx]
    if ('rules' in r) {
      out.push(...flatten(r, childPath))
    } else {
      const label = props.fieldLabels?.[r.field] ?? r.field
      const valueStr = Array.isArray(r.value) ? r.value.join(', ') : String(r.value ?? '')
      out.push({ path: childPath, text: `${label} ${r.op} ${valueStr}` })
    }
  })
  return out
}

const chips = (g: FilterGroup) => flatten(g)
</script>

<template>
  <div v-if="chips(group).length" class="filter-chips">
    <span class="filter-chips__label">Bộ lọc đang dùng:</span>
    <span
      v-for="chip in chips(group)"
      :key="chip.path.join('.')"
      class="filter-chip"
    >
      {{ chip.text }}
      <button class="filter-chip__remove" @click="$emit('remove', chip.path)" aria-label="Xoá">×</button>
    </span>
    <button class="filter-chips__clear" @click="$emit('clear')">Xoá tất cả</button>
  </div>
</template>

<style scoped>
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
}

.filter-chips__label {
  font-size: 12px;
  color: var(--wx-text-muted);
  margin-right: 4px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 4px 3px 10px;
  background: var(--wx-info-bg);
  color: var(--wx-info-text);
  border-radius: var(--wx-radius-full);
  font-size: 12px;
  font-weight: 600;
}

.filter-chip__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: var(--wx-radius-full);
  font-size: 14px;
  line-height: 1;
  transition: background var(--wx-duration-fast);
}

.filter-chip__remove:hover {
  background: rgba(0, 0, 0, 0.08);
}

.filter-chips__clear {
  background: transparent;
  border: none;
  color: var(--wx-danger-text);
  font-size: 12px;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: var(--wx-radius-sm);
  font-family: var(--wx-font-primary);
}

.filter-chips__clear:hover {
  background: var(--wx-danger-bg);
}
</style>

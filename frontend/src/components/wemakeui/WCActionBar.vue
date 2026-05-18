<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput, BaseDropdown, BaseSelectMenu, BaseCheckbox } from '../common'
import type { CategoryItem } from '../../types/account'

const props = defineProps<{
  running: boolean
  searchField: string
  searchQuery: string
  categories: CategoryItem[]
  selectedCategoryIds: number[]
}>()

const emit = defineEmits<{
  'update:running': [v: boolean]
  'update:searchField': [v: string]
  'update:searchQuery': [v: string]
  'update:selectedCategoryIds': [v: number[]]
  'add-account': []
  'open-category': []
}>()

const SEARCH_FIELDS = [
  { value: 'uid',      label: 'Nâng cao' },
  { value: 'uid',      label: 'UID' },
  { value: 'email',    label: 'Email' },
  { value: 'password', label: 'Mật khẩu' },
]

function toggleCategory(id: number) {
  let ids = [...props.selectedCategoryIds]
  if (id === 0) {
    emit('update:selectedCategoryIds', [0])
    return
  }
  ids = ids.filter(i => i !== 0)
  if (ids.includes(id)) {
    ids = ids.filter(i => i !== id)
  } else {
    ids.push(id)
  }
  if (ids.length === 0) ids = [0]
  emit('update:selectedCategoryIds', ids)
}

function currentCategoryLabel() {
  if (props.selectedCategoryIds.includes(0)) return `Tất cả (${props.categories.find(c => c.id === 0)?.count ?? 0})`
  const selected = props.categories.filter(c => props.selectedCategoryIds.includes(c.id))
  if (selected.length === 1) return `${selected[0].name} (${selected[0].count ?? 0})`
  return `${selected.length} thư mục`
}
</script>

<template>
  <div class="wc-action-bar">
    <!-- Run / Stop -->
    <BaseButton
      :variant="running ? 'danger' : 'success'"
      size="sm"
      @click="emit('update:running', !running)"
    >
      {{ running ? '■ Dừng' : '▶ Chạy' }}
    </BaseButton>

    <div class="ab-sep" />

    <!-- Search field selector -->
    <BaseSelectMenu
      class="ab-field-select"
      size="sm"
      :model-value="searchField"
      :options="[
        { value: 'uid',      label: 'Nâng cao' },
        { value: 'uid2',     label: 'UID' },
        { value: 'email',    label: 'Email' },
        { value: 'password', label: 'Mật khẩu' },
      ]"
      @update:model-value="emit('update:searchField', String($event))"
    />

    <!-- Search input -->
    <div class="ab-search">
      <BaseInput
        :model-value="searchQuery"
        placeholder="🔍 Tìm kiếm..."
        size="sm"
        @update:model-value="(v) => emit('update:searchQuery', String(v))"
      />
    </div>

    <div class="ab-sep" />

    <!-- Add account -->
    <BaseButton variant="primary" size="sm" @click="emit('add-account')">
      + Thêm TK
    </BaseButton>

    <!-- Category dropdown -->
    <BaseDropdown placement="bottom-start">
      <template #trigger>
        <BaseButton variant="ghost" size="sm" class="ab-cat-btn">
          Thư mục: {{ currentCategoryLabel() }} ▾
        </BaseButton>
      </template>
      <template #default="{ close }">
        <div class="ab-cat-menu">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="ab-cat-item"
          >
            <BaseCheckbox
              :model-value="selectedCategoryIds.includes(cat.id)"
              :label="cat.name"
              @update:model-value="toggleCategory(cat.id)"
            />
            <span class="ab-cat-count">{{ cat.count ?? 0 }}</span>
          </div>
          <div class="ab-cat-sep" />
          <BaseButton
            variant="ghost"
            size="sm"
            style="width:100%;justify-content:flex-start"
            @click="() => { emit('open-category'); close() }"
          >📁 Quản lý thư mục</BaseButton>
        </div>
      </template>
    </BaseDropdown>
  </div>
</template>

<style scoped>
.wc-action-bar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  height: 42px;
  padding: 0 var(--wx-space-3);
  background: var(--wx-bg-base);
  border-bottom: 1px solid var(--wx-border-default);
  flex-shrink: 0;
}

.ab-sep {
  width: 1px;
  height: 20px;
  background: var(--wx-border-default);
  margin: 0 var(--wx-space-1);
}

.ab-field-select {
  height: 30px;
  padding: 0 8px;
  font-size: var(--wx-fs-13);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  color: var(--wx-text-primary);
  cursor: pointer;
}

.ab-search { width: 200px; }

.ab-cat-btn { white-space: nowrap; }

.ab-cat-menu {
  min-width: 200px;
  padding: 4px;
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  box-shadow: var(--wx-shadow-lg);
}

.ab-cat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: var(--wx-fs-13);
  border-radius: var(--wx-radius-sm);
  cursor: pointer;
}
.ab-cat-item:hover { background: var(--wx-surface-sunken); }
.ab-cat-count {
  margin-left: auto;
  font-size: var(--wx-fs-11);
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-full);
}

.ab-cat-sep {
  height: 1px;
  background: var(--wx-border-subtle);
  margin: 4px 0;
}

</style>

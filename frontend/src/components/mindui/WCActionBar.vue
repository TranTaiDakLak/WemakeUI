<script setup lang="ts">
import { BaseButton, BaseDropdown, BaseSelectMenu, BaseOptionRow } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
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

function onSearchInput(e: Event) {
  emit('update:searchQuery', (e.target as HTMLInputElement).value)
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
      <span class="ab-ic" v-html="running ? SHELL_ICONS.stop : SHELL_ICONS.play" />{{ running ? 'Dừng' : 'Chạy' }}
    </BaseButton>

    <div class="ab-sep" />

    <!-- Search field selector -->
    <BaseSelectMenu
      class="ab-field-select"
      size="sm"
      :model-value="searchField"
      :options="[
        { value: 'uid',      label: 'Mã' },
        { value: 'fullName', label: 'Tiêu đề' },
        { value: 'email',    label: 'Liên hệ' },
        { value: 'password', label: 'Loại' },
      ]"
      @update:model-value="emit('update:searchField', String($event))"
    />

    <!-- Search input -->
    <label class="ab-search">
      <span class="ab-search-ic" v-html="SHELL_ICONS.search" />
      <input
        class="ab-search-input"
        type="search"
        :value="searchQuery"
        placeholder="Tìm kiếm…"
        aria-label="Tìm kiếm bản ghi"
        autocomplete="off"
        @input="onSearchInput"
      />
    </label>

    <div class="ab-sep" />

    <!-- Add account -->
    <BaseButton variant="primary" size="sm" @click="emit('add-account')">
      <span class="ab-ic" v-html="SHELL_ICONS.plus" />Thêm mới
    </BaseButton>

    <!-- Category dropdown (teleport: không bị cắt bởi card overflow:hidden khi bảng ít dòng) -->
    <BaseDropdown placement="bottom-start" teleport>
      <template #trigger>
        <BaseButton variant="ghost" size="sm" class="ab-cat-btn">
          <span class="ab-ic ab-ic--muted" v-html="SHELL_ICONS.folder" />Thư mục: {{ currentCategoryLabel() }}<span class="ab-ic ab-ic--muted ab-ic--caret" v-html="SHELL_ICONS.chevronDown" />
        </BaseButton>
      </template>
      <template #default="{ close }">
        <div class="ab-cat-menu">
          <BaseOptionRow
            v-for="cat in categories"
            :key="cat.id"
            indicator="check"
            :model-value="selectedCategoryIds.includes(cat.id)"
            :label="cat.name"
            @update:model-value="toggleCategory(cat.id)"
          >
            <template #trailing><span class="ab-cat-count">{{ cat.count ?? 0 }}</span></template>
          </BaseOptionRow>
          <div class="ab-cat-sep" />
          <BaseButton
            variant="ghost"
            size="sm"
            class="wc-drop-item"
            @click="() => { emit('open-category'); close() }"
          ><span class="ab-ic ab-ic--muted" v-html="SHELL_ICONS.folder" />Quản lý thư mục</BaseButton>
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
  min-height: 48px;
  padding: var(--wx-space-2) var(--wx-space-3);
  background: var(--wx-surface-base);
  border-bottom: 1px solid var(--wx-border-default);
  flex-shrink: 0;
  flex-wrap: wrap;
}

/* icon SVG đứng cạnh nhãn nút */
.ab-ic { display: inline-flex; align-items: center; flex-shrink: 0; margin-right: 6px; }
.ab-ic :deep(svg) { width: 14px; height: 14px; }
.ab-ic--muted { color: var(--wx-text-muted); }
.ab-ic--caret { margin: 0 0 0 4px; }
.ab-ic--caret :deep(svg) { width: 12px; height: 12px; }

.ab-sep {
  width: 1px;
  height: 20px;
  background: var(--wx-border-default);
  margin: 0 var(--wx-space-1);
}

.ab-field-select { min-width: 110px; }

/* ô tìm kiếm có icon dẫn đầu (BaseInput chưa có slot icon) */
.ab-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 220px;
  max-width: 100%;
}
.ab-search-ic {
  position: absolute;
  left: 10px;
  display: inline-flex;
  color: var(--wx-text-muted);
  pointer-events: none;
  transition: color var(--wx-d-fast) var(--wx-ease-standard);
}
.ab-search-ic :deep(svg) { width: 14px; height: 14px; }
.ab-search:focus-within .ab-search-ic { color: var(--wx-brand-primary); }
.ab-search-input {
  width: 100%;
  height: 32px;
  padding: 0 var(--wx-space-3) 0 32px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-shell-field-bg);
  color: var(--wx-text-primary);
  font: inherit;
  font-size: var(--wx-fs-13);
  outline: none;
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard), box-shadow var(--wx-d-fast) var(--wx-ease-standard), background var(--wx-d-fast) var(--wx-ease-standard);
}
.ab-search-input::placeholder { color: var(--wx-text-muted); }
.ab-search-input::-webkit-search-cancel-button { display: none; }
.ab-search-input:hover:not(:focus) { border-color: var(--wx-text-muted); }
.ab-search-input:focus-visible { background: var(--wx-surface-base); border-color: var(--wx-brand-primary); box-shadow: var(--wx-shadow-focus); }

.ab-cat-btn { white-space: nowrap; }

.ab-cat-menu {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  padding: var(--wx-space-1);
}
.wc-drop-item { justify-content: flex-start; }

.ab-cat-count {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-full);
}

.ab-cat-sep {
  height: 1px;
  background: var(--wx-border-subtle);
  margin: var(--wx-space-1) 0;
}
</style>

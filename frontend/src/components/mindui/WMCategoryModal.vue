<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton, BaseInput } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import { useCategoriesStore } from '../../stores/mindui/categories'
import MindDialog from './MindDialog.vue'

const show = defineModel<boolean>({ required: true })
const categoriesStore = useCategoriesStore()
const newName = ref('')
const editingId = ref<number | null>(null)
const editName = ref('')

const visibleCategories = computed(() => categoriesStore.sortedCategories.filter(c => c.id !== 0))

/** Biểu tượng bút chì (shell-icons chưa có) */
const PENCIL_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'

function startEdit(id: number, name: string) {
  editingId.value = id
  editName.value = name
}

function saveEdit(id: number) {
  if (editName.value.trim()) {
    categoriesStore.renameCategory(id, editName.value.trim())
  }
  editingId.value = null
}

function addNew() {
  if (newName.value.trim()) {
    categoriesStore.addCategory(newName.value.trim())
    newName.value = ''
  }
}
</script>

<template>
  <MindDialog
    v-model="show"
    title="Quản lý thư mục"
    :subtitle="`${visibleCategories.length} thư mục · nhóm bản ghi theo chủ đề`"
    :icon="SHELL_ICONS.folder"
    size="md"
  >
    <div class="cat-body">
      <!-- Thêm mới -->
      <div class="cat-add-row">
        <BaseInput v-model="newName" placeholder="Tên thư mục mới..." size="sm" class="cat-grow" @keyup.enter="addNew" />
        <BaseButton variant="primary" size="sm" :disabled="!newName.trim()" @click="addNew">
          <span class="cat-ic" aria-hidden="true" v-html="SHELL_ICONS.plus" />Thêm
        </BaseButton>
      </div>

      <!-- Danh sách -->
      <ul class="cat-list mind-slim-scroll">
        <li v-for="cat in visibleCategories" :key="cat.id" class="cat-row">
          <template v-if="editingId === cat.id">
            <BaseInput v-model="editName" size="sm" class="cat-grow" autofocus @keyup.enter="saveEdit(cat.id)" @keyup.escape.stop="editingId = null" />
            <BaseButton variant="primary" size="icon" aria-label="Lưu tên" title="Lưu" :icon="SHELL_ICONS.check" @click="saveEdit(cat.id)" />
            <BaseButton variant="ghost" size="icon" aria-label="Huỷ sửa" title="Huỷ" :icon="SHELL_ICONS.x" @click="editingId = null" />
          </template>
          <template v-else>
            <span class="cat-glyph" aria-hidden="true" v-html="SHELL_ICONS.folder" />
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-count" :title="`${cat.count ?? 0} bản ghi`">{{ cat.count ?? 0 }}</span>
            <BaseButton variant="ghost" size="icon" :aria-label="`Đổi tên ${cat.name}`" title="Đổi tên" :icon="PENCIL_ICON" @click="startEdit(cat.id, cat.name)" />
            <BaseButton variant="ghost" size="icon" :aria-label="`Xoá thư mục ${cat.name}`" title="Xoá" :icon="SHELL_ICONS.trash" @click="categoriesStore.removeCategory(cat.id)" />
          </template>
        </li>
        <li v-if="visibleCategories.length === 0" class="cat-empty">Chưa có thư mục nào — hãy tạo thư mục đầu tiên ở trên.</li>
      </ul>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.cat-body { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.cat-add-row { display: flex; gap: var(--wx-space-2); align-items: center; }
.cat-grow { flex: 1; min-width: 0; }
.cat-ic { display: inline-flex; margin-right: 6px; }
.cat-ic :deep(svg) { width: 14px; height: 14px; }

.cat-list { display: flex; flex-direction: column; gap: var(--wx-space-1); max-height: 340px; margin: 0; padding: 0; list-style: none; overflow-y: auto; }
.cat-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: 6px 8px 6px 10px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-ctrl);
  background: var(--wx-surface-elevated);
  transition: background var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.cat-row:hover { background: color-mix(in srgb, var(--wx-text-secondary) 4%, var(--wx-surface-elevated)); }
.cat-glyph { display: inline-flex; flex-shrink: 0; color: var(--wx-brand-600); }
.cat-glyph :deep(svg) { width: 16px; height: 16px; }
.cat-name { flex: 1; min-width: 0; font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cat-count {
  min-width: 26px;
  padding: 1px 8px;
  border: 1px solid var(--wx-neutral-border);
  border-radius: var(--wx-radius-full);
  background: var(--wx-neutral-bg);
  color: var(--wx-neutral-text);
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-align: center;
}
.cat-empty { padding: var(--wx-space-6) var(--wx-space-3); text-align: center; font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
</style>

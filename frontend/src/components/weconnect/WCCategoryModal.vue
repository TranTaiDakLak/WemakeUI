<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput, BaseModal } from '../common'
import { useCategoriesStore } from '../../stores/weconnect/categories'

const show = defineModel<boolean>({ required: true })
const categoriesStore = useCategoriesStore()
const newName = ref('')
const editingId = ref<number | null>(null)
const editName = ref('')

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
  <BaseModal :show="show" title="📁 Quản lý thư mục" size="md" @close="show = false">
    <div class="cat-body">
      <!-- Add new -->
      <div class="cat-add-row">
        <BaseInput v-model="newName" placeholder="Tên thư mục mới..." size="sm" style="flex:1" @keyup.enter="addNew" />
        <BaseButton variant="primary" size="sm" :disabled="!newName.trim()" @click="addNew">+ Thêm</BaseButton>
      </div>

      <!-- List -->
      <div class="cat-list">
        <div
          v-for="cat in categoriesStore.sortedCategories.filter(c => c.id !== 0)"
          :key="cat.id"
          class="cat-row"
        >
          <template v-if="editingId === cat.id">
            <BaseInput v-model="editName" size="sm" style="flex:1" autofocus @keyup.enter="saveEdit(cat.id)" @keyup.escape="editingId = null" />
            <BaseButton variant="primary" size="sm" @click="saveEdit(cat.id)">✓</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="editingId = null">✕</BaseButton>
          </template>
          <template v-else>
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-count">{{ cat.count ?? 0 }}</span>
            <BaseButton variant="ghost" size="sm" @click="startEdit(cat.id, cat.name)">✏️</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="categoriesStore.removeCategory(cat.id)">🗑</BaseButton>
          </template>
        </div>
      </div>
    </div>

    <template #footer>
      <div style="width:100%;display:flex;justify-content:flex-end">
        <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.cat-body { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.cat-add-row { display: flex; gap: var(--wx-space-2); align-items: center; }
.cat-list { display: flex; flex-direction: column; gap: 4px; max-height: 320px; overflow-y: auto; }
.cat-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: 7px 10px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}
.cat-name { flex: 1; font-size: var(--wx-fs-14); color: var(--wx-text-primary); }
.cat-count { font-size: var(--wx-fs-12); color: var(--wx-text-muted); min-width: 24px; text-align: center; }
</style>

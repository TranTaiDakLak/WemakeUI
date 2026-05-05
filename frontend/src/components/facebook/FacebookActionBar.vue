<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Category } from '../../types/category'

const props = defineProps<{
  isRunning: boolean
  categories: Category[]
  currentCategoryIds: number[]
  filteredCount: number
}>()

const emit = defineEmits<{
  run: []
  stop: []
  add: []
  search: [field: string, query: string]
  'category-change': [ids: number[]]
  'open-category-modal': []
}>()

/* ── Search local state ── */
const searchField = ref('all')
const searchQuery = ref('')

function onSearchInput() {
  emit('search', searchField.value, searchQuery.value)
}

function onSearchKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    emit('search', searchField.value, searchQuery.value)
  }
}

function onFieldChange() {
  if (searchQuery.value) {
    emit('search', searchField.value, searchQuery.value)
  }
}

/* ── Category multi-select ── */
const showCatDropdown = ref(false)

function toggleCatDropdown() {
  showCatDropdown.value = !showCatDropdown.value
}

const catDropdownRef = ref<HTMLElement>()

function closeCatDropdown() {
  showCatDropdown.value = false
}

function onDocClick(e: MouseEvent) {
  if (catDropdownRef.value && !catDropdownRef.value.contains(e.target as Node)) {
    showCatDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

function toggleCategoryId(id: number) {
  const ids = [...props.currentCategoryIds]
  const idx = ids.indexOf(id)
  if (idx >= 0) ids.splice(idx, 1)
  else ids.push(id)
  emit('category-change', ids)
}

function selectAllCategories() {
  emit('category-change', props.categories.map(c => c.id))
}

function clearCategories() {
  emit('category-change', [])
}

const categoryLabel = computed(() => {
  if (props.currentCategoryIds.length === 0) return `Tất cả (${props.filteredCount})`
  if (props.currentCategoryIds.length === 1) {
    const cat = props.categories.find(c => c.id === props.currentCategoryIds[0])
    return cat ? cat.name : 'Thư mục'
  }
  return `Đang chọn ${props.currentCategoryIds.length}/${props.categories.length}`
})
</script>

<template>
  <div class="toolbar">
    <!-- Run/Stop toggle -->
    <div class="toolbar-group">
      <button v-if="!isRunning" class="toolbar-btn toolbar-btn--run" title="Chạy tác vụ" @click="$emit('run')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Chạy
      </button>
      <button v-else class="toolbar-btn toolbar-btn--stop" title="Dừng tác vụ" @click="$emit('stop')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
        Dừng
      </button>
    </div>

    <!-- Search section -->
    <div class="toolbar-group toolbar-group--search">
      <select class="toolbar-select toolbar-select--sm" v-model="searchField" @change="onFieldChange">
        <option value="all">Nâng cao</option>
        <option value="uid">UID</option>
        <option value="password">Mật khẩu</option>
        <option value="email">Email</option>
      </select>
      <div class="toolbar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm tài khoản..." class="toolbar-search-input" @input="onSearchInput" @keydown="onSearchKeyDown" />
      </div>
    </div>

    <!-- Add account -->
    <button class="toolbar-btn toolbar-btn--add" title="Thêm tài khoản" :disabled="isRunning" @click="$emit('add')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Thêm TK
    </button>

    <!-- Category section -->
    <div ref="catDropdownRef" class="toolbar-group toolbar-group--category">
      <span class="toolbar-label">Thư mục:</span>
      <div class="cat-dropdown-wrap">
        <button class="toolbar-select cat-dropdown-btn" @click="toggleCatDropdown">
          {{ categoryLabel }}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-if="showCatDropdown" class="cat-dropdown">
          <button class="cat-dd-item cat-dd-action" @click="clearCategories">Tất cả ({{ filteredCount }})</button>
          <div class="cat-dd-sep"></div>
          <label v-for="cat in categories" :key="cat.id" class="cat-dd-item cat-dd-check">
            <input type="checkbox" :checked="currentCategoryIds.includes(cat.id)" @change="toggleCategoryId(cat.id)" />
            <span>{{ cat.name }}</span>
          </label>
          <div v-if="categories.length > 1" class="cat-dd-sep"></div>
          <button v-if="categories.length > 1" class="cat-dd-item cat-dd-action" @click="selectAllCategories">Chọn tất cả</button>
        </div>
      </div>
      <button class="toolbar-btn-icon" title="Quản lý thư mục" @click="$emit('open-category-modal')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
      </button>
    </div>

    <div class="toolbar-spacer"></div>
  </div>
</template>

<style scoped>
/* ─── Toolbar Container ─── */
.toolbar {
  height: 42px; display: flex; align-items: center; padding: 0 10px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color); gap: 8px; flex-shrink: 0;
  transition: background 0.3s ease;
}

/* ─── Groups ─── */
.toolbar-group { display: flex; align-items: center; gap: 5px; }
.toolbar-group--category { padding: 0 8px; border-left: 1px solid var(--border-color); border-right: 1px solid var(--border-color); }
.toolbar-group--search { flex: 1; max-width: 420px; }

/* ─── Labels & Selects ─── */
.toolbar-label { font-size: 11px; color: var(--text-tertiary); white-space: nowrap; }
.toolbar-select {
  padding: 4px 7px; border: 1px solid var(--border-color); border-radius: 4px;
  background: var(--card-bg); color: var(--text-secondary); font-family: var(--font-family); font-size: 11px;
  outline: none; transition: border-color 0.15s;
}
.toolbar-select:focus { border-color: var(--brand-primary); }
.toolbar-select--sm { width: 80px; }

/* ─── Search ─── */
.toolbar-search {
  flex: 1; display: flex; align-items: center; gap: 5px; padding: 4px 8px;
  background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 4px;
  color: var(--text-tertiary); transition: border-color 0.15s, box-shadow 0.15s;
}
.toolbar-search:focus-within { border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(80,160,255,0.12); }
.toolbar-search-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--text-primary); font-family: var(--font-family); font-size: 12px;
}
.toolbar-search-input::placeholder { color: var(--text-tertiary); }

.toolbar-spacer { flex: 1; }

/* ─── Buttons — WX variant styles ─── */
.toolbar-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
  border: none; border-radius: 12px; font-family: var(--wx-font-primary, 'Inter', sans-serif);
  font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap;
  overflow: hidden; position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.toolbar-btn:hover { filter: brightness(1.05); }
.toolbar-btn:active { transform: scale(0.98); }
.toolbar-btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
/* Run = WxButton success */
.toolbar-btn--run { background: linear-gradient(to right, #10b981, #059669); color: #fff; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.25); }
.toolbar-btn--run:hover { box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4); }
/* Add = WxButton primary */
.toolbar-btn--add { background: linear-gradient(to right, #06b6d4, #3b82f6); color: #fff; box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.25); }
.toolbar-btn--add:hover { box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.4); }
/* Stop = WxButton danger */
.toolbar-btn--stop { background: linear-gradient(to right, #f43f5e, #dc2626); color: #fff; box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25); }
.toolbar-btn--stop:hover { box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4); }

/* ─── Icon Button ─── */
.toolbar-btn-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: 1px solid var(--border-color); border-radius: 4px;
  background: var(--card-bg); color: var(--text-tertiary); cursor: pointer; transition: all 0.15s;
}
.toolbar-btn-icon:hover { background: var(--hover-bg); border-color: var(--brand-primary); color: var(--brand-primary); }

/* ─── Category Dropdown ─── */
.cat-dropdown-wrap { position: relative; }
.cat-dropdown-btn {
  display: flex; align-items: center; gap: 4px; cursor: pointer;
  min-width: 100px; justify-content: space-between;
}
.cat-dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 999;
  min-width: 180px; background: var(--card-bg); border: 1px solid var(--border-color);
  border-radius: 4px; box-shadow: var(--shadow-lg);
  padding: 4px 0; max-height: 280px; overflow-y: auto;
}
.cat-dd-item {
  display: flex; align-items: center; gap: 6px; width: 100%;
  padding: 5px 12px; border: none; background: none; text-align: left;
  font-size: 12px; color: var(--text-secondary); cursor: pointer; font-family: var(--font-family);
}
.cat-dd-item:hover { background: var(--hover-bg); }
.cat-dd-check { cursor: pointer; }
.cat-dd-check input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
.cat-dd-action { color: var(--brand-primary); font-weight: 600; }
.cat-dd-sep { height: 1px; background: var(--border-color); margin: 3px 8px; }
</style>

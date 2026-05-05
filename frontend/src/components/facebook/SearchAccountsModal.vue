<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [], search: [keywords: string[]] }>()

const { showToast } = useToast()

const searchText = ref('')
const keywordCount = computed(() => {
  return searchText.value.trim() ? searchText.value.trim().split('\n').filter(l => l.trim()).length : 0
})

function handleSearch() {
  if (!keywordCount.value) { showToast('warning', 'Vui lòng nhập từ khóa tìm kiếm!'); return }
  const keywords = searchText.value.trim().split('\n').filter(l => l.trim()).map(l => l.trim())
  showToast('info', `Tìm kiếm ${keywords.length} từ khóa — chức năng đang phát triển`)
}
</script>

<template>
  <BaseModal :show="show" title="Tìm kiếm nâng cao" size="sm" @close="$emit('close')">
    <div class="search-content">
      <div class="search-header">
        <span class="search-label">Danh sách từ khóa cần tìm:</span>
        <span class="search-count">({{ keywordCount }})</span>
      </div>
      <textarea v-model="searchText" class="search-input" rows="12" placeholder="UID, Mật khẩu hoặc email&#10;Mỗi từ khóa một dòng..."></textarea>
      <div class="search-actions">
        <button class="search-btn search-btn--primary" @click="handleSearch">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Tìm kiếm
        </button>
        <button class="search-btn search-btn--secondary" @click="$emit('close')">Đóng</button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.search-content { display: flex; flex-direction: column; gap: 10px; }
.search-header { display: flex; align-items: center; gap: 6px; }
.search-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; }
.search-count { font-size: 13px; color: var(--brand-primary); font-weight: 600; }
.search-input { padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-family: Consolas, monospace; font-size: 13px; resize: none; background: var(--bg-primary); color: var(--text-secondary); outline: none; }
.search-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
.search-input::placeholder { color: var(--text-tertiary); font-family: var(--font-family); }
.search-actions { display: flex; gap: 8px; justify-content: flex-end; }
.search-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 16px; border: none; border-radius: var(--radius-sm); font-family: var(--font-family); font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
.search-btn--primary { background: var(--brand-primary); color: #fff; }
.search-btn--primary:hover { opacity: 0.88; }
.search-btn--secondary { background: var(--border-color); color: var(--text-primary); }
.search-btn--secondary:hover { opacity: 0.8; }
</style>

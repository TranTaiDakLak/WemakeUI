<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'open-popup': [key: string]
}>()

/* ── Dropdown state ── */
const openDropdown = ref('')

function toggleDropdown(id: string) {
  openDropdown.value = openDropdown.value === id ? '' : id
}

function closeDropdowns() {
  openDropdown.value = ''
}

function emitAndClose(key: string) {
  emit('open-popup', key)
  closeDropdowns()
}
</script>

<template>
  <div class="menu-strip" @mouseleave="closeDropdowns">
    <button class="menu-btn" @click="$emit('open-popup', 'settings')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
      Cài đặt chung
    </button>
    <button class="menu-btn" @click="$emit('open-popup', 'interaction')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      Thiết lập tương tác
    </button>
    <button class="menu-btn" @click="$emit('open-popup', 'display')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      Cấu hình hiển thị
    </button>

    <!-- Tiện ích dropdown -->
    <div class="menu-dropdown-wrapper">
      <button class="menu-btn" :class="{ 'menu-btn--active': openDropdown === 'utils' }" @click.stop="toggleDropdown('utils')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        Tiện ích
        <svg class="menu-arrow" width="8" height="8" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <div v-if="openDropdown === 'utils'" class="menu-dropdown">
        <button class="menu-dropdown-item" @click="emitAndClose('utils-link-bm')">Lấy link nhận BM</button>
        <button class="menu-dropdown-item" @click="emitAndClose('utils-import')">Thêm dữ liệu từ phần mềm khác</button>
        <button class="menu-dropdown-item" @click="emitAndClose('utils-check-bm')">Kiểm tra BM VIP</button>
      </div>
    </div>

    <button class="menu-btn" @click="$emit('open-popup', 'trash')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
      Thùng rác
    </button>

    <!-- Liên hệ dropdown -->
    <div class="menu-dropdown-wrapper">
      <button class="menu-btn" :class="{ 'menu-btn--active': openDropdown === 'contact' }" @click.stop="toggleDropdown('contact')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
        Liên hệ
        <svg class="menu-arrow" width="8" height="8" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <div v-if="openDropdown === 'contact'" class="menu-dropdown">
        <button class="menu-dropdown-item" @click="emitAndClose('contact-zalo')">Hỗ trợ Zalo OA</button>
        <button class="menu-dropdown-item" @click="emitAndClose('contact-telegram')">Nhóm Telegram</button>
        <button class="menu-dropdown-item" @click="emitAndClose('contact-fanpage')">Fanpage</button>
        <button class="menu-dropdown-item" @click="emitAndClose('contact-youtube')">Youtube</button>
        <button class="menu-dropdown-item" @click="emitAndClose('contact-zalo-vip')">Nhóm Zalo VIP</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Menu Strip ─── */
.menu-strip {
  height: 32px; display: flex; align-items: center; padding: 0 6px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color); gap: 1px; flex-shrink: 0;
  transition: background 0.3s ease;
}

/* ─── Menu Buttons ─── */
.menu-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px;
  border: none; border-radius: 3px; background: transparent; color: var(--text-secondary);
  font-family: var(--font-family); font-size: 12px; cursor: pointer;
  transition: background 0.12s, color 0.12s; white-space: nowrap;
}
.menu-btn:hover { background: var(--hover-bg); color: var(--text-primary); }
.menu-btn--active { background: var(--hover-bg); color: var(--text-primary); }
.menu-arrow { margin-left: 2px; opacity: 0.5; }

/* ─── Dropdowns ─── */
.menu-dropdown-wrapper { position: relative; }
.menu-dropdown {
  position: absolute; top: calc(100% + 2px); left: 0; z-index: 100;
  min-width: 220px; background: var(--card-bg); border: 1px solid var(--border-color);
  border-radius: 6px; box-shadow: var(--shadow-lg);
  padding: 4px 0;
}
.menu-dropdown-item {
  display: block; width: 100%; padding: 7px 16px; border: none; background: none;
  text-align: left; font-family: var(--font-family); font-size: 12px; color: var(--text-secondary);
  cursor: pointer; white-space: nowrap; transition: background 0.1s;
}
.menu-dropdown-item:hover { background: var(--hover-bg); color: var(--text-primary); }
</style>

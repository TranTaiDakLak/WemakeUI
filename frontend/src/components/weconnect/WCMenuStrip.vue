<script setup lang="ts">
import { BaseButton, BaseDropdown } from '../common'

const emit = defineEmits<{
  'open-modal': [name: string]
}>()

const utilsItems = [
  { label: 'Lấy link nhận BM',              action: () => emit('open-modal', 'utils') },
  { label: 'Thêm dữ liệu từ phần mềm khác', action: () => emit('open-modal', 'utils') },
  { label: 'Kiểm tra BM VIP',               action: () => emit('open-modal', 'utils') },
]

const contactItems = [
  { label: 'Hỗ trợ Zalo OA',  action: () => {} },
  { label: 'Nhóm Telegram',   action: () => {} },
  { label: 'Fanpage',         action: () => {} },
  { label: 'Youtube',         action: () => {} },
  { label: 'Nhóm Zalo VIP',   action: () => {} },
]
</script>

<template>
  <div class="wc-menu-strip">
    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'settings')">⚙ Cài đặt chung</BaseButton>
    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'interaction')">≈ Thiết lập tương tác</BaseButton>
    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'display')">▦ Cấu hình hiển thị</BaseButton>

    <BaseDropdown placement="bottom-start">
      <template #trigger>
        <BaseButton variant="ghost" size="sm">🔧 Tiện ích ▾</BaseButton>
      </template>
      <template #default="{ close }">
        <div class="wc-drop-menu">
          <BaseButton
            v-for="item in utilsItems"
            :key="item.label"
            variant="ghost"
            size="sm"
            style="width:100%;justify-content:flex-start"
            @click="() => { item.action(); close() }"
          >{{ item.label }}</BaseButton>
        </div>
      </template>
    </BaseDropdown>

    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'trash')">🗑 Thùng rác</BaseButton>

    <BaseDropdown placement="bottom-start">
      <template #trigger>
        <BaseButton variant="ghost" size="sm">💬 Liên hệ ▾</BaseButton>
      </template>
      <template #default="{ close }">
        <div class="wc-drop-menu">
          <BaseButton
            v-for="item in contactItems"
            :key="item.label"
            variant="ghost"
            size="sm"
            style="width:100%;justify-content:flex-start"
            @click="() => { item.action(); close() }"
          >{{ item.label }}</BaseButton>
        </div>
      </template>
    </BaseDropdown>
  </div>
</template>

<style scoped>
.wc-menu-strip {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  padding: 0 var(--wx-space-3);
  background: var(--wx-surface-elevated);
  border-bottom: 1px solid var(--wx-border-default);
  flex-shrink: 0;
}

.wc-drop-menu {
  min-width: 200px;
  padding: 4px;
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  box-shadow: var(--wx-shadow-lg);
}

</style>

<script setup lang="ts">
import { BaseButton, BaseDropdown } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'

const emit = defineEmits<{
  'open-modal': [name: string]
}>()

const utilsItems = [
  { label: 'Tạo liên kết chia sẻ',           action: () => emit('open-modal', 'utils') },
  { label: 'Thêm dữ liệu từ phần mềm khác', action: () => emit('open-modal', 'utils') },
  { label: 'Kiểm tra trùng lặp',             action: () => emit('open-modal', 'utils') },
]

const contactItems = [
  { label: 'Tất cả kênh hỗ trợ…', action: () => emit('open-modal', 'contact') },
  { label: 'Hỗ trợ Zalo OA',  action: () => {} },
  { label: 'Nhóm Telegram',   action: () => {} },
  { label: 'Trang cộng đồng', action: () => {} },
  { label: 'Youtube',         action: () => {} },
  { label: 'Nhóm Zalo VIP',   action: () => {} },
]
</script>

<template>
  <div class="wc-menu-strip" role="menubar" aria-label="Menu chức năng">
    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'settings')">
      <span class="ms-ic" v-html="SHELL_ICONS.settings" />Cài đặt chung
    </BaseButton>
    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'interaction')">
      <span class="ms-ic" v-html="SHELL_ICONS.activity" />Thiết lập tương tác
    </BaseButton>
    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'display')">
      <span class="ms-ic" v-html="SHELL_ICONS.columns" />Cấu hình hiển thị
    </BaseButton>

    <span class="ms-sep" aria-hidden="true" />

    <BaseDropdown placement="bottom-start" teleport>
      <template #trigger>
        <BaseButton variant="ghost" size="sm">
          <span class="ms-ic" v-html="SHELL_ICONS.wrench" />Tiện ích<span class="ms-caret" v-html="SHELL_ICONS.chevronDown" />
        </BaseButton>
      </template>
      <template #default="{ close }">
        <div class="wc-drop-menu">
          <BaseButton
            v-for="item in utilsItems"
            :key="item.label"
            variant="ghost"
            size="sm"
            class="wc-drop-item"
            @click="() => { item.action(); close() }"
          >{{ item.label }}</BaseButton>
        </div>
      </template>
    </BaseDropdown>

    <BaseButton variant="ghost" size="sm" @click="emit('open-modal', 'trash')">
      <span class="ms-ic" v-html="SHELL_ICONS.trash" />Thùng rác
    </BaseButton>

    <BaseDropdown placement="bottom-start" teleport>
      <template #trigger>
        <BaseButton variant="ghost" size="sm">
          <span class="ms-ic" v-html="SHELL_ICONS.message" />Liên hệ<span class="ms-caret" v-html="SHELL_ICONS.chevronDown" />
        </BaseButton>
      </template>
      <template #default="{ close }">
        <div class="wc-drop-menu">
          <BaseButton
            v-for="item in contactItems"
            :key="item.label"
            variant="ghost"
            size="sm"
            class="wc-drop-item"
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
  min-height: 38px;
  padding: 0 var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.wc-menu-strip::-webkit-scrollbar { display: none; }
/* nút giữ nguyên bề rộng — khung hẹp (mobile) thì thanh cuộn ngang, không bóp nhãn thành "Cài đặ…" */
.wc-menu-strip > * { flex-shrink: 0; }

/* icon SVG nhỏ đứng trước nhãn nút */
.ms-ic,
.ms-caret { display: inline-flex; align-items: center; flex-shrink: 0; }
.ms-ic { margin-right: 6px; color: var(--wx-text-muted); }
.ms-ic :deep(svg) { width: 14px; height: 14px; }
.ms-caret { margin-left: 4px; color: var(--wx-text-muted); }
.ms-caret :deep(svg) { width: 12px; height: 12px; }

.ms-sep {
  width: 1px;
  height: 16px;
  margin: 0 var(--wx-space-1);
  background: var(--wx-border-default);
  flex-shrink: 0;
}

/* nền / viền / bóng do .base-dropdown__content của BaseDropdown đảm nhiệm */
/* cột flex: mục menu tự giãn đầy bề rộng menu, menu co theo nội dung dài nhất
   (không dùng width:100% trên nút — làm menu teleport bị kéo giãn tới mép viewport) */
.wc-drop-menu {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  padding: var(--wx-space-1);
}
.wc-drop-item { justify-content: flex-start; }
</style>

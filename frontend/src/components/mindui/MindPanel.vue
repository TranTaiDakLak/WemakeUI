<script setup lang="ts">
/**
 * MindPanel — khuôn form popover/panel: head (ô icon gradient + tiêu đề + phụ đề) · body · foot.
 *
 * Port từ khuôn panel popover của MindAds. Dùng cho popover cấu hình nhỏ (chọn cột, xuất file, nhập danh sách…)
 * hoặc nội dung bên trong BaseModal/BasePopover. Bản thân KHÔNG phải overlay — chỉ là khung giao diện.
 *
 *   <MindPanel title="Hiển thị cột" subtitle="Chọn cột cần xem" :icon="ICON" closable @close="open = false" scroll>
 *     …danh sách…
 *     <template #foot><BaseButton size="sm">Áp dụng</BaseButton></template>
 *   </MindPanel>
 *
 * slots: default (body) · foot · head-extra (phải tiêu đề) · icon (thay ô icon)
 */
withDefaults(defineProps<{
  title: string
  subtitle?: string
  /** SVG html cho ô icon */
  icon?: string
  /** hiện nút đóng + gợi ý Esc */
  closable?: boolean
  /** body cuộn (max-height 350px) */
  scroll?: boolean
  /** chiều rộng (CSS) */
  width?: string
  /** làm mờ body khi đang tải */
  loading?: boolean
}>(), {
  closable: false,
  scroll: false,
  loading: false,
})

defineEmits<{ close: [] }>()
</script>

<template>
  <section class="mind-panel mpn" :style="width ? { width } : undefined">
    <header class="mind-panel__head">
      <span class="mind-panel__icon" aria-hidden="true">
        <slot name="icon"><span v-if="icon" v-html="icon" /></slot>
      </span>
      <div class="mind-panel__titles">
        <div class="mind-panel__title">{{ title }}</div>
        <div v-if="subtitle" class="mind-panel__sub">{{ subtitle }}</div>
      </div>
      <div class="mpn__head-extra"><slot name="head-extra" /></div>
      <template v-if="closable">
        <kbd class="mind-kbd mpn__esc">Esc</kbd>
        <button type="button" class="mind-icon-btn" aria-label="Đóng" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </template>
    </header>

    <div class="mind-panel__body mind-slim-scroll" :class="{ 'mind-panel__body--scroll': scroll, 'mpn__body--loading': loading }">
      <slot />
    </div>

    <footer v-if="$slots.foot" class="mind-panel__foot">
      <slot name="foot" />
    </footer>
  </section>
</template>

<style scoped>
.mpn { max-width: 100%; }
.mpn__head-extra { margin-left: auto; display: inline-flex; align-items: center; gap: var(--wx-space-2); }
.mpn__esc { margin-left: auto; }
.mpn__head-extra:empty { display: none; }
.mpn__head-extra:empty + .mpn__esc { margin-left: auto; }
.mpn__body--loading { opacity: 0.45; pointer-events: none; transition: opacity var(--wx-d-normal) var(--wx-ease-standard); }
</style>

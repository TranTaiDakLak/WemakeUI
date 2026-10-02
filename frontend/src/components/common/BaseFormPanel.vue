<script lang="ts">
let _panelIdCounter = 0
</script>

<script setup lang="ts">
/**
 * BaseFormPanel — khuôn form/popover V3 của MindAds (`wm-panel`):
 *   head (icon-tile + tiêu đề + phụ đề + nút đóng/kbd)  /  body  /  foot (hint + nút).
 *
 * Dùng cho popover cấu hình (chọn cột, xuất dữ liệu, nạp lại…), panel nổi trong toolbar,
 * hoặc khối form tự đứng. Không tự định vị / không tự đóng — host (BasePopover, BaseDropdown…)
 * lo vị trí; panel chỉ lo hình dạng và phát `close`.
 *
 * Slots: `icon` (thay nội dung tile), `head-extra`, mặc định (body), `footer`, `footer-hint`.
 */
import { computed } from 'vue'
import type { IconTileTone } from '../../types'
import BaseIconTile from './BaseIconTile.vue'
import BaseKbd from './BaseKbd.vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  /** chuỗi SVG/HTML cho icon-tile; hoặc dùng slot `icon` */
  icon?: string
  tone?: IconTileTone
  /** hiện nút X ở góc phải đầu panel */
  closable?: boolean
  closeLabel?: string
  /** gợi ý phím tắt ở góc phải đầu panel (vd 'Esc'); bỏ qua nếu `closable` */
  kbd?: string
  /** nhấn Esc khi focus nằm trong panel → emit close (chỉ khi closable) */
  closeOnEsc?: boolean
  /** chiều rộng cố định: số = px, chuỗi = CSS (vd '380px', 'min(380px, 100%)') */
  width?: number | string
  /** giới hạn chiều cao thân panel → cuộn dọc với thanh cuộn mảnh (số = px) */
  bodyMaxHeight?: number | string
  /** làm mờ thân panel + chặn tương tác khi đang tải */
  loading?: boolean
  /** bỏ bóng nổi (khi nhúng sẵn trong card/popover khác) */
  flat?: boolean
}>(), {
  tone: 'brand',
  closable: false,
  closeLabel: 'Đóng',
  closeOnEsc: false,
  loading: false,
  flat: false,
})

const emit = defineEmits<{
  close: []
}>()

const titleId = `wx-form-panel-title-${++_panelIdCounter}`

function toCss(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

const rootStyle = computed(() => {
  const w = toCss(props.width)
  return w ? { width: w, maxWidth: '100%' } : undefined
})
const bodyStyle = computed(() => {
  const h = toCss(props.bodyMaxHeight)
  return h ? { maxHeight: h } : undefined
})

function onKeydown(e: KeyboardEvent) {
  if (props.closable && props.closeOnEsc && e.key === 'Escape') {
    e.stopPropagation()
    emit('close')
  }
}
</script>

<template>
  <section
    class="wx-form-panel"
    :class="{ 'wx-form-panel--flat': flat }"
    :style="rootStyle"
    role="group"
    :aria-labelledby="title ? titleId : undefined"
    :aria-busy="loading || undefined"
    @keydown="onKeydown"
  >
    <header v-if="title || subtitle || icon || $slots.icon || $slots['head-extra'] || closable || kbd" class="wx-form-panel__head">
      <BaseIconTile v-if="icon || $slots.icon" :tone="tone" size="md" :icon="icon">
        <slot name="icon" />
      </BaseIconTile>
      <div class="wx-form-panel__titles">
        <h3 v-if="title" :id="titleId" class="wx-form-panel__title">{{ title }}</h3>
        <div v-if="subtitle" class="wx-form-panel__sub">{{ subtitle }}</div>
      </div>
      <div v-if="$slots['head-extra']" class="wx-form-panel__head-extra">
        <slot name="head-extra" />
      </div>
      <button
        v-if="closable"
        type="button"
        class="wx-form-panel__close"
        :aria-label="closeLabel"
        :title="closeLabel"
        @click="emit('close')"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
      <BaseKbd v-else-if="kbd" class="wx-form-panel__kbd">{{ kbd }}</BaseKbd>
    </header>

    <div
      class="wx-form-panel__body"
      :class="{ 'wx-form-panel__body--scroll': bodyMaxHeight !== undefined, 'wx-form-panel__body--loading': loading }"
      :style="bodyStyle"
    >
      <slot />
    </div>

    <footer v-if="$slots.footer || $slots['footer-hint']" class="wx-form-panel__foot">
      <span v-if="$slots['footer-hint']" class="wx-form-panel__hint"><slot name="footer-hint" /></span>
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.wx-form-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-panel);
  box-shadow: var(--wx-shadow-popover);
  overflow: hidden;
}
.wx-form-panel--flat { box-shadow: none; }

/* ── head ── */
.wx-form-panel__head {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: 13px var(--wx-space-4) 11px;
  background: var(--wx-gradient-panel-head);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.wx-form-panel__titles { flex: 1; min-width: 0; line-height: 1.25; }
.wx-form-panel__title {
  margin: 0;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-extrabold);
  letter-spacing: var(--wx-tracking-snug);
  color: var(--wx-text-primary);
}
.wx-form-panel__sub {
  margin: 1px 0 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-muted);
}
.wx-form-panel__head-extra { display: flex; align-items: center; gap: var(--wx-space-2); flex-shrink: 0; }
.wx-form-panel__kbd { margin-left: auto; }

.wx-form-panel__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  margin-left: auto;
  padding: 0;
  border: none;
  border-radius: var(--wx-radius-ctrl-sm);
  background: transparent;
  color: var(--wx-text-light);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-form-panel__close:hover { background: var(--wx-hover-neutral); color: var(--wx-text-primary); }
.wx-form-panel__close:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: -1px; }

/* ── body ── */
.wx-form-panel__body { padding: 10px 12px 12px; min-height: 0; }
.wx-form-panel__body--scroll {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--wx-scrollbar-thumb) transparent;
}
.wx-form-panel__body--scroll::-webkit-scrollbar { width: var(--wx-scrollbar-width-thin); }
.wx-form-panel__body--scroll::-webkit-scrollbar-track { background: transparent; }
.wx-form-panel__body--scroll::-webkit-scrollbar-thumb {
  background-color: var(--wx-scrollbar-thumb);
  border-radius: var(--wx-radius-full);
  border: none;
  background-clip: border-box;
}
.wx-form-panel__body--scroll::-webkit-scrollbar-thumb:hover { background-color: var(--wx-scrollbar-thumb-hover); }
.wx-form-panel__body--loading {
  opacity: 0.45;
  pointer-events: none;
  transition: opacity var(--wx-d-normal) var(--wx-ease-standard);
}

/* ── foot ── */
.wx-form-panel__foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--wx-space-2);
  padding: 10px 14px;
  background: color-mix(in srgb, var(--wx-surface-sunken) 50%, var(--wx-surface-elevated));
  border-top: 1px solid var(--wx-border-subtle);
}
/* hint trôi sang trái, đẩy cụm nút sang phải */
.wx-form-panel__hint {
  margin-right: auto;
  font-size: 10.5px;
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-light);
  white-space: nowrap;
}
</style>

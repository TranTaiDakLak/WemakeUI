<script setup lang="ts">
/**
 * BaseIconTile — ô icon vuông bo góc có gradient (đầu form panel, option card, danh sách tính năng).
 * Port từ `wm-panel-icon` / `wm-export-tile` của MindAds.
 *
 * Icon truyền qua slot (khuyến nghị) hoặc prop `icon` (chuỗi SVG/HTML, cùng quy ước với BaseButton).
 * Gradient lấy từ token --wx-gradient-tile-* nên dark mode + variant "flat" tự đổi.
 */
import type { IconTileTone } from '../../types'

withDefaults(defineProps<{
  tone?: IconTileTone
  size?: 'sm' | 'md' | 'lg'
  /** chuỗi SVG/HTML; bỏ qua nếu dùng slot */
  icon?: string
}>(), {
  tone: 'brand',
  size: 'md',
})
</script>

<template>
  <span class="wx-icon-tile" :data-tone="tone" :data-size="size" aria-hidden="true">
    <slot><span v-if="icon" class="wx-icon-tile__glyph" v-html="icon" /></slot>
  </span>
</template>

<style scoped>
.wx-icon-tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--wx-text-on-brand);
  border-radius: var(--wx-radius-tile);
  background: var(--wx-gradient-tile);
  box-shadow: var(--wx-shadow-tile);
  line-height: 1;
}

.wx-icon-tile__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* size — 36px là cỡ chuẩn của đầu panel (nguồn) */
.wx-icon-tile[data-size="sm"] { width: 28px; height: 28px; font-size: 13px; border-radius: var(--wx-radius-ctrl-sm); }
.wx-icon-tile[data-size="md"] { width: 36px; height: 36px; font-size: 16px; }
.wx-icon-tile[data-size="lg"] { width: 44px; height: 44px; font-size: 20px; border-radius: var(--wx-radius-item); }

/* tone — chỉ tông thương hiệu mới có bóng "ánh tím" (shadow-tile); các tông khác dùng bóng trung tính */
.wx-icon-tile[data-tone="blue"]    { background: var(--wx-gradient-tile-blue);  box-shadow: var(--wx-shadow-sm), inset 0 1px 1px color-mix(in srgb, var(--wx-text-on-brand) 30%, transparent); }
.wx-icon-tile[data-tone="success"] { background: var(--wx-gradient-tile-green); box-shadow: var(--wx-shadow-sm), inset 0 1px 1px color-mix(in srgb, var(--wx-text-on-brand) 30%, transparent); }
.wx-icon-tile[data-tone="warning"] { background: var(--wx-gradient-tile-amber); box-shadow: var(--wx-shadow-sm), inset 0 1px 1px color-mix(in srgb, var(--wx-text-on-brand) 30%, transparent); }
.wx-icon-tile[data-tone="danger"]  { background: var(--wx-gradient-tile-red);   box-shadow: var(--wx-shadow-sm), inset 0 1px 1px color-mix(in srgb, var(--wx-text-on-brand) 30%, transparent); }
.wx-icon-tile[data-tone="neutral"] {
  background: var(--wx-neutral-bg);
  color: var(--wx-neutral-text);
  border: 1px solid var(--wx-neutral-border);
  box-shadow: none;
}
</style>

<script setup lang="ts">
/**
 * AppBannerStack — vùng xếp chồng các <AppBanner variant="floating">.
 *
 * Neo bằng một marker cao 0 (không chiếm layout) + khối absolute bên trong,
 * nên banner luôn nằm NGAY DƯỚI mép topbar thật, bất kể topbar cao bao nhiêu
 * (density compact/comfortable, topbar wrap…) — không phải đoán offset bằng px.
 *
 *   <AppShell>
 *     <template #topbar>…</template>
 *     <template #banners>
 *       <AppBannerStack>
 *         <AppBanner tone="warning" title="Dữ liệu có thể đã cũ" />
 *       </AppBannerStack>
 *     </template>
 *   </AppShell>
 *
 * placement: 'right' (mặc định) · 'center'
 * inline:    true → banner nằm TRONG luồng layout (đẩy nội dung xuống) thay vì nổi đè lên nội dung.
 *            Dùng khi vùng ngay dưới topbar có nút hành động (PageHeader…) mà banner nổi sẽ che mất.
 */
withDefaults(defineProps<{
  placement?: 'right' | 'center'
  /** đặt banner trong luồng layout (không đè lên nội dung) */
  inline?: boolean
  /** max-width của stack (CSS value) */
  maxWidth?: string
}>(), {
  placement: 'right',
  inline: false,
  maxWidth: '28rem',
})
</script>

<template>
  <div class="wx-banner-anchor" :data-inline="inline || undefined" aria-live="polite">
    <div
      class="wx-banner-stack"
      :data-placement="placement"
      :style="{ '--wx-banner-stack-max': maxWidth }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.wx-banner-anchor {
  position: relative;
  height: 0;
  z-index: var(--wx-z-overlay);
  pointer-events: none;
}
.wx-banner-stack {
  position: absolute;
  top: var(--wx-space-2);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  width: calc(100% - 24px);
  max-width: var(--wx-banner-stack-max);
  pointer-events: none;
}
.wx-banner-stack > :deep(*) { pointer-events: auto; }
/* inline: chiếm chỗ thật trong luồng, full-width, đệm theo gutter của shell */
.wx-banner-anchor[data-inline] {
  height: auto;
  pointer-events: auto;
  padding: var(--wx-space-2) var(--wx-shell-gutter, 8px) 0;
}
.wx-banner-anchor[data-inline] .wx-banner-stack {
  position: static;
  width: 100%;
  max-width: none;
  transform: none;
}
.wx-banner-stack[data-placement='right'] { right: var(--wx-space-3); }
.wx-banner-stack[data-placement='center'] { left: 50%; transform: translateX(-50%); }
</style>

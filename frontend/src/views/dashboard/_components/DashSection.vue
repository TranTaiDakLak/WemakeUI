<script setup lang="ts">
/**
 * DashSection — nhóm nội dung dashboard có tiêu đề + đường kẻ gradient quét "laser".
 * Internal, demo-app-only. Port từ khối `dashboard-group` của trang Dashboard MindAds
 * (thẻ kính bo lớn, tiêu đề đậm, đường kẻ gradient chạy tia sáng).
 *
 *   <DashSection title="Chỉ số chính" subtitle="So với 7 ngày trước"> …cards… </DashSection>
 *
 * slots: default · actions (cuối hàng tiêu đề)
 */
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="ds">
    <header class="ds__head">
      <div class="ds__titles">
        <h2 class="ds__title">{{ title }}</h2>
        <span v-if="subtitle" class="ds__sub">{{ subtitle }}</span>
      </div>
      <span class="ds__line" aria-hidden="true"><span class="ds__laser" /></span>
      <div v-if="$slots.actions" class="ds__actions"><slot name="actions" /></div>
    </header>
    <div class="ds__body"><slot /></div>
  </section>
</template>

<style scoped>
.ds {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
  padding: var(--wx-space-4) var(--wx-space-4) var(--wx-space-5);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-2xl);
  background: color-mix(in srgb, var(--wx-shell-frame-bg) 55%, var(--wx-surface-base));
  box-shadow: var(--wx-shadow-sm);
}
.ds__head { display: flex; align-items: center; gap: var(--wx-space-3); min-width: 0; }
.ds__titles { display: flex; align-items: baseline; gap: var(--wx-space-3); flex-shrink: 0; min-width: 0; }
.ds__title { margin: 0; font-size: var(--wx-fs-18); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); white-space: nowrap; }
.ds__sub { font-size: var(--wx-fs-12); color: var(--wx-content-muted); white-space: nowrap; }
.ds__line {
  position: relative;
  flex: 1;
  min-width: 24px;
  height: 2px;
  border-radius: var(--wx-radius-full);
  background: linear-gradient(to right, var(--wx-brand-accent), var(--wx-brand-primary));
  opacity: 0.7;
  overflow: hidden;
}
.ds__laser {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, color-mix(in srgb, var(--wx-surface-base) 85%, transparent), transparent);
  transform: translateX(-100%);
  animation: mind-laser-scan 3s ease-in-out infinite;
}
.ds__actions { display: inline-flex; align-items: center; gap: var(--wx-space-2); flex-shrink: 0; }
.ds__body { display: flex; flex-direction: column; gap: var(--wx-space-4); min-width: 0; }

@media (max-width: 639px) {
  .ds__sub { display: none; }
  .ds { padding: var(--wx-space-3); }
}
@media (prefers-reduced-motion: reduce) { .ds__laser { animation: none; opacity: 0; } }
</style>

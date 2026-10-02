<script setup lang="ts">
/**
 * MindSection — nhóm nội dung trong form/modal: nhãn viết hoa có vạch nhấn cyan (kiểu "PHƯƠNG THỨC TẢI"
 * trong các popover của MindAds) + vùng nội dung. Dùng thay GroupBox trong hộp thoại cấu hình.
 *
 *   <MindSection title="Chung" description="Số luồng và độ trễ">…</MindSection>
 *
 * Slots: mặc định (nội dung) · `extra` (bên phải nhãn, vd nút "Chọn tất").
 */
defineProps<{
  title: string
  description?: string
  /** bao nội dung trong thẻ viền nhẹ */
  boxed?: boolean
}>()
</script>

<template>
  <section class="mind-section">
    <header class="mind-section__head">
      <span class="mind-section__bar" aria-hidden="true" />
      <div class="mind-section__titles">
        <h4 class="mind-section__title">{{ title }}</h4>
        <p v-if="description" class="mind-section__desc">{{ description }}</p>
      </div>
      <div v-if="$slots.extra" class="mind-section__extra"><slot name="extra" /></div>
    </header>
    <div class="mind-section__body" :class="{ 'mind-section__body--boxed': boxed }">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.mind-section { min-width: 0; }
.mind-section__head {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  margin-bottom: var(--wx-space-2);
}
.mind-section__bar {
  flex-shrink: 0;
  width: 5px;
  height: 14px;
  border-radius: 2px;
  background: var(--wx-brand-accent);
}
.mind-section__titles { flex: 1; min-width: 0; }
.mind-section__title {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-label);
  text-transform: uppercase;
  color: var(--wx-text-secondary);
}
.mind-section__desc { margin: 1px 0 0; font-size: var(--wx-fs-11); color: var(--wx-text-light); }
.mind-section__extra { display: inline-flex; align-items: center; gap: var(--wx-space-2); flex-shrink: 0; }
.mind-section__body { display: flex; flex-direction: column; gap: var(--wx-space-2); min-width: 0; }
.mind-section__body--boxed {
  padding: var(--wx-space-3);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-sunken);
}
</style>
